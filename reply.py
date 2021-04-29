#!/bin/python

from discord import Webhook, AsyncWebhookAdapter, TextChannel
from persona import Persona
from discord.errors import NotFound

# triggerPhrases[]
# message

class Reply:

    async def send(
        self,
        channel: TextChannel,
        persona: Persona,
        message: str,
        tts: bool = False
    ):
        webhooks = channel.webhooks()

        if webhooks:

            try:
                webhook = webhooks[0]
                await webhook.send(
                    content=message,
                    wait=False,
                    username=persona.name,
                    avatar_url=persona.avatar,
                    allowed_mentions=True
                )

            except NotFound as e:
                print(e)
