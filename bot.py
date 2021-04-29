#!/bin/python

from discord.ext import commands
from persona import Persona
from reply import Reply

class Bot(commands.Bot):

    def __init__(
        self,
        command_prefix,
        help_command=_default,
        description=None,
        **options
    ):
        super().__init__(
            command_prefix,
            help_command=help_command,
            description=description,
            **options
        )



    async def on_ready(self):
        print(f'{self.user} has connected to Discord!')

    async def on_message(self, message: str):

        # Ignore the bot itself.
        if message.author == self.user:
            return


        # See if the user's message has any of the key/trigger words.
        # If it does, send back the reply.
        #response =

        #await message.channel.send('ah')



    async def on_error(self, event, *args, **kwargs):
        with open('error.log', 'a') as file:
            file.write(f'Error: {args[0]}\n')