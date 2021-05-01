#!/bin/python

import json
import logging
import traceback
from os import path
from logging.handlers import RotatingFileHandler
from discord import \
    Client, Message, Webhook, AsyncWebhookAdapter, \
    TextChannel, VoiceChannel, AllowedMentions, Member
from .persona import Persona
from .reaction import Reaction
from .audio import Audio
from .state import is_connected
import asyncio

class Bot(Client):

    def __init__(self):
        super().__init__()

        # Setup logging.
        self.logger = logging.getLogger('Error Log')
        self.logger.setLevel(logging.ERROR)
        handler = RotatingFileHandler(
            'error.log',
            maxBytes=20000,
            backupCount=1
        )
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)

        # Initiate properties.
        self.personas: dict[str, Persona] = {}
        self.reactions: dict[str, Reaction] = {}


    def load(self, directory: str):
        """
            Load bot settings and customizations from a directory.
        """

        try:
            # Load in personas.
            with open(path.join(directory, 'personas.json'), 'r') as personaFile:
                self.personas = {
                    k:Persona(**v)
                    for k, v
                    in json.load(personaFile).items()
                }

            # Load in and flatten phrases based of trigger phrases.
            with open(path.join(directory, 'reactions.json'), 'r') as reactionsFile:
                reactions = json.load(reactionsFile)
                self.reactions = {
                    t:Reaction(**r)
                    for r in reactions
                    for t in r['triggers']
                }
        except Exception as error:
            self.log_error(error)
            pass


    async def on_ready(self):
        """
            Alert the host that the bot server is online.
        """
        print(f'{self.user} has connected to Discord!')


    async def on_message(self, message: Message):
        """
            Scan all messages for key words.
            When a word or phrase is found,
            send a preset reply back to the text channel.
        """

        # Ignore messages from the bot itself or webhooks.
        if message.webhook_id or message.author == self.user:
            return

        content = message.content
        author = message.author

        # Attempts to play a YouTube audio.
        if content.startswith('!play '):
            url = content[6:]

            if not url:
                await message.reply('Please pass a valid url.')
                return

            if is_connected(author):
                try:
                    channel = author.voice.channel
                    await Audio.play(
                        url,
                        self.voice_clients,
                        channel,
                        self.loop
                    )
                except Exception as error:
                    self.log_error(error)
                    pass
            else:
                await message.reply('You need to be in a voice channel to use this command.')
            return
        
        # Disconnects bot from the user's current voice channel.
        if content.startswith('!stop') and self.is_connected(author):
            await self.stop(author)
            return

        # Disconnects bot from all voice channels.
        if content.startswith('!stopall'):
            await self.stop_all()
            return

        # See if the user's message has any of the key/trigger words.
        # If it does, send back the reply.
        content = content.lower()
        for key, value in self.reactions.items():
            if key in content:
                try:
                    await value.react(
                        author,
                        message.channel,
                        self.personas,
                        self.voice_clients,
                        self.loop
                    )
                except Exception as error:
                    self.log_error(error)
                    pass


    async def stop(self, user: Member):
        """
            Disconnects the user's current voice channel.
        """
        voice = user.voice.channel
        for voice in self.voice_clients:
            if voice:
                await voice.disconnect()


    async def stop_all(self):
        """
            Disconnects the bot from all voice channels.
        """
        for voice in self.voice_clients:
            if voice:
                await voice.disconnect()


    def log_error(self, error: Exception):
        self.logger.error(str(error))
        self.logger.error(traceback.format_exc())