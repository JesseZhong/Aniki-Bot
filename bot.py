#!/bin/python

import json
import logging
from logging.handlers import RotatingFileHandler
import traceback
from os import path
from discord import Client, Message, Webhook, AsyncWebhookAdapter, TextChannel, AllowedMentions
from persona import Persona

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
        self.personas = {}
        self.phrases = {}


    def load(self, directory: str):
        """
            Load bot settings and customizations from a directory.
        """

        try:
            # Load in personas.
            with open(path.join(directory, 'personas.json'), 'r') as personaFile:
                self.personas = {k:Persona(**v) for k, v in json.load(personaFile).items()}

            # Load in and flatten phrases based of trigger phrases.
            with open(path.join(directory, 'phrases.json'), 'r') as phrasesFile:
                phrases = json.load(phrasesFile)
                self.phrases = {
                    t:{
                        'content': p['content'],
                        'persona': p['persona'],
                        'tts': 'tts' in p and p['tts'] != 0
                    }
                    for p in phrases
                    for t in p['triggers']
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

        # See if the user's message has any of the key/trigger words.
        # If it does, send back the reply.
        content = message.content.lower()
        for key, value in self.phrases.items():
            if key in content:
                try:
                    await self.reply(
                        message.channel,
                        self.personas[value['persona']],
                        value['content'],
                        value['tts']
                    )
                except Exception as error:
                    self.log_error(error)
                    pass


    async def reply(
        self,
        channel: TextChannel,
        persona: Persona,
        message: str,
        tts: bool = False
    ):
        """
            Sends a custom message using a webhook.
            Uses a requested persona (fake user)
            to send the message
        """
        webhooks = await channel.webhooks()

        if webhooks:
            webhook = webhooks[0]
            await webhook.send(
                content=message,
                wait=False,
                username=persona.name,
                avatar_url=persona.avatar,
                allowed_mentions=AllowedMentions(
                    everyone=False,
                    replied_user=True,
                    roles=True,
                    users=True
                )
            )


    def log_error(self, error: Exception):
        self.logger.error(str(error))
        self.logger.error(traceback.format_exc())