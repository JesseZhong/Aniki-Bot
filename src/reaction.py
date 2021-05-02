#!/bin/python

from discord import TextChannel, AllowedMentions, VoiceClient, VoiceChannel
from .persona import Persona
from .audio import Audio
from .state import is_connected
from asyncio import AbstractEventLoop
from typing import Dict, List

default_volume = 0.5

class Reaction:

    def __init__(
        self,
        audio_url: str = None,
        content: str = None,
        persona: str = None,
        start: str = None,
        end: str = None,
        volume: float = default_volume,
        tts: bool = False,
        **kwargs
    ):
        super().__init__()

        self.audio_url = audio_url
        self.start = start
        self.end = end
        self.volume = volume

        self.content = content
        self.persona = persona
        self.tts = tts


    async def react(
        self,
        user,
        text_channel: TextChannel,
        personas: Dict[str, Persona],
        voice_clients: List[VoiceClient],
        loop: AbstractEventLoop
    ):
        """
            React Andy.
        """

        # Check if there's any text message
        # reactions and attempt to send.
        if self.persona and \
           self.persona in personas and \
           self.content and \
           text_channel:
            
            await self.text(
                text_channel,
                personas[self.persona],
                self.content,
                self.tts
            )

        # Check if there's any audio to play
        # and try to play it.
        if self.audio_url and is_connected(user):
            voice_channel = user.voice.channel
            await Audio.play(
                self.audio_url,
                voice_clients,
                voice_channel,
                loop,
                start=self.start,
                end=self.end
            )


    async def text(
        self,
        channel: TextChannel,
        persona: Persona,
        content: str,
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
                content=content,
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