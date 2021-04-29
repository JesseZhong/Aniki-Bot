#!/bin/python

from discord import Webhook, AsyncWebhookAdapter, TextChannel, AllowedMentions
from persona import Persona
from discord.errors import NotFound

# triggerPhrases[]
# message

class Reply:

    def __init__(self):
        super().__init__()
        self.triggerPhrases = list()

    async def load(self):
        return

    async def send(
        self,
        channel: TextChannel,
        persona: Persona,
        message: str,
        tts: bool = False
    ):
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
