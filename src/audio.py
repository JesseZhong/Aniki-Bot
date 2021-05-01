#!/bin/python

import asyncio
from discord import \
    PCMVolumeTransformer, FFmpegPCMAudio, VoiceChannel, VoiceClient
import youtube_dl
from typing import List

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

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

class Audio(PCMVolumeTransformer):

    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.url = data.get('url')


    @classmethod
    async def from_url(
        cls,
        url,
        *,
        loop=None,
        stream=False
    ):
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

        filename = data['url'] \
            if stream \
            else ytdl.prepare_filename(data)

        return cls(
            FFmpegPCMAudio(
                filename,
                **ffmpeg_options
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