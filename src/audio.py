#!/bin/python

import asyncio
from discord import \
    PCMVolumeTransformer, FFmpegPCMAudio, VoiceChannel, VoiceClient
import youtube_dl
from typing import List
from urllib.parse import urlparse, parse_qs, ParseResult
from os import path, system
from .timestamps import from_seconds, parse_timestamp, stringify

# Suppress noise about console usage from errors
youtube_dl.utils.bug_reports_message = lambda: ''

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': 'videos/%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

def prepend(filename: str, prefix: str) -> str:
    """
        Adds a prefix to the beginning of the filename.
    """
    filePath, baseName = path.split(filename)
    baseName = prefix + baseName
    return path.join(filePath, baseName)


clip_prefix = 'clipped_'


class Audio(PCMVolumeTransformer):

    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.url = data.get('url')


    @classmethod
    async def from_url(
        cls,
        url: str,
        *,
        start: str = None,
        end: str = None,
        loop: bool = None,
        stream: bool = False
    ):
        # Parse time stamps if there are any.
        startTime = parse_timestamp(start) if start else None
        endTime = parse_timestamp(end) if end else None

        # Check if a time stamp was specified with the URL.
        parsedUrl: ParseResult = urlparse(url)
        if parsedUrl.query:
            query = parse_qs(parsedUrl.query)

            if query and 't' in query:
                try:
                    startTime = from_seconds(int(query['t'][0]))
                except ValueError:
                    pass

        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(
            None,
            lambda: ytdl.extract_info(
                url,
                download=not stream
            )
        )

        # If it's a playlist, grab the first item.
        if 'entries' in data:
            data = data['entries'][0]

        # Download the video and return the filename.
        filename = data['url'] \
            if stream \
            else ytdl.prepare_filename(data)

        # Clip the video if time stamps are specified.
        if startTime or endTime:

            clippedFile = prepend(filename, clip_prefix)

            # Order matters for cutting speed.
            # https://stackoverflow.com/a/42827058/10167844
            before = f'-ss {stringify(startTime)}' if startTime else ''
            after = f'-to {stringify(endTime - (startTime if startTime else 0))}' if endTime else ''

            system(f'sudo ffmpeg -y -hide_banner -loglevel error {before} -i {filename} -vn {after} -c copy {clippedFile}')


            # Prep the clipped file instead of the original.
            filename = clippedFile


        return cls(
            FFmpegPCMAudio(
                filename,
                options='-vn'
            ),
            data=data
        )


    @staticmethod
    async def play(
        url: str,
        voice_clients: List[VoiceClient],
        voice_channel: VoiceChannel,
        loop: asyncio.AbstractEventLoop
    ):
        """
            Plays the audio of a YouTube video into a voice channel.
        """

        # Check if the client is already connected to the targetted voice channel.
        voiceClient = next(
            (v for v in voice_clients if v.channel == voice_channel),
            None
        )

        # Connect if not already connected.
        if not voiceClient:
            voiceClient = await voice_channel.connect()
            
        player = await Audio.from_url(url)

        # Play audio into the voice channel.
        voiceClient.play(
            player,
            after=lambda error: asyncio.run_coroutine_threadsafe(
                voiceClient.disconnect(),
                loop
            )
        )