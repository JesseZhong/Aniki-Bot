#!/bin/python

import asyncio
import os
import json
import requests
from gremlin.discord.audio import Audio
from bs4 import BeautifulSoup
from typing import Any, Dict, OrderedDict
from .basehandler import BaseHandler

class ServerHandler(BaseHandler):

    def __init__(self, *args, **kwargs):

        handlerDir = os.path.dirname(os.path.realpath(__file__))

        with open(os.path.join(handlerDir, 'schemas/put_persona.json'), 'r') as file:
            self.put_persona_schema = json.load(file)

        with open(os.path.join(handlerDir, 'schemas/put_reaction.json'), 'r') as file:
            self.put_reaction_schema = json.load(file)

        get_routes=[
            ('/guild', self.get_guild),
            ('/personas', self.get_personas),
            ('/reactions', self.get_reactions),
            ('/emojis', self.get_emojis),
            ('/favicon.ico', self.get_favicon),
            ('/', self.get_root)
        ]
        post_routes=[
            ('/metadata', self.post_metadata)
        ]
        put_routes=[
            ('/personas', self.put_persona),
            ('/reactions', self.put_reaction)
        ]
        delete_routes=[
            ('/personas', self.delete_persona),
            ('/reactions', self.delete_reaction)
        ]

        super().__init__(
            get_routes,
            post_routes,
            put_routes,
            delete_routes,
            *args,
            **kwargs
        )


    def get_root(self):
        self.send_headers(200)
        self.send_content('Nothing to see here!')


    def get_favicon(self):
        return


    def get_guild(self):
        if hasattr(self, 'guild'):
            response = requests.get(
                f'{self.DISCORD_API}/guilds/{self.guild}/preview',
                headers={
                    'Authorization': f'Bot {self.DISCORD_TOKEN}'
                }
            )

            if response.status_code == 200:
                self.send_headers(200)
                self.wfile.write(response.content)
            else:
                self.send_bad_request({
                    'message': 'Guild doesn''t exist'
                })
        else:
            self.send_bad_request({
                'message': 'Must include guild id.'
            })


    def get_personas(self):
        self.send_headers(200)
        self.send_file('personas.json')


    def get_reactions(self):
        self.send_headers(200)
        self.send_file('reactions.json')


    def put_persona(self):
        self.put_item(
            self.put_persona_schema,
            'personas.json',
            '^([a-zA-Z0-9-_.]{3,25}|[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$'
        )


    def put_reaction(self):
        def cache(reaction: Dict[str, Any]):
            if 'audio_url' in reaction and reaction['audio_url']:
                asyncio.run(Audio.from_url(
                    reaction['audio_url'],
                    start=(reaction['start'] if 'start' in reaction else None),
                    end=(reaction['end'] if 'end' in reaction else None),
                    clip=(reaction['clip'] if 'clip' in reaction else None)
                ))

        self.put_item(
            self.put_reaction_schema,
            'reactions.json',
            '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$',
            cache
        )

    
    def delete_persona(self):
        self.delete_item(
            'personas.json',
            '^([a-zA-Z0-9-_.]{3,25}|[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$'
        )


    def delete_reaction(self):
        self.delete_item(
            'reactions.json',
            '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'
        )

    
    def post_metadata(self):
        content = self.get_content()

        if 'url' not in content or not content['url']:
            self.send_bad_request('Invalid URL.')
            return

        response = requests.get(
            content['url'].format(1),
            headers={'User-Agent': 'Mozilla/5.0'}
        )

        if not response.ok:
            self.send_bad_request('Unreachable URL.')
            return

        soup = BeautifulSoup(response.text, features='html.parser')
        metas = soup.find_all('meta', {'property': True, 'content': True})

        metadata = {
            meta.attrs['property']: meta.attrs['content']
            for meta in metas
        }

        self.send_headers(200)
        self.send_content(metadata)


    def get_emojis(self):

        if not self.token:
            self.send_bad_request('No token provided.')
            return

        # Get user's guilds.
        userGuildsRes = requests.get(
            f'{self.DISCORD_API}/users/@me/guilds',
            headers={
                'Authorization': f'Bearer {self.token}'
            }
        )

        # For 401, assume missing 'guilds' scope.
        # Revoke token and spit a 401 back.
        if userGuildsRes.status_code == 401:
            self.revoke_token(self.token)
            self.send_headers(401, 'Unauthorized - New Token Required.')
            return

        if not userGuildsRes.ok:
            self.send_bad_request('User guild problem.')
            return

        # Get the bot's guilds.
        botGuildsRes = requests.get(
            f'{self.DISCORD_API}/users/@me/guilds',
            headers={
                'Authorization': f'Bot {self.DISCORD_TOKEN}'
            }
        )

        if not botGuildsRes.ok:
            self.send_headers(500, 'Bot info problem.')
            return

        # Get the intersection (guilds in common) for the user and the bot.
        userGuilds = json.loads(userGuildsRes.content)
        userGuildIds = {g['id'] for g in userGuilds}
        botGuildIds = {g['id'] for g in json.loads(botGuildsRes.content)}
        guildIdsInCommon = userGuildIds & botGuildIds

        # Grab the emojis that the user and the bot share.
        # In other words, get the emojis that the bot has permission to see.
        try:
            emojis = {}
            for id in guildIdsInCommon:
                guild = next((g for g in userGuilds if g['id'] == id), None)

                if guild:
                    emojiRes = requests.get(
                        f'{self.DISCORD_API}/guilds/{id}/emojis',
                        headers={
                            'Authorization': f'Bot {self.DISCORD_TOKEN}'
                        }
                    )

                    if emojiRes.ok:
                        
                        guildEmojis = json.loads(emojiRes.content)

                        if guildEmojis and len(guildEmojis) > 0:
                            emojis[id] = {
                                'id': id,
                                'name': guild['name'],
                                'icon': guild['icon'],
                                'emojis': guildEmojis
                            }

            self.send_headers(200)
            self.send_content(emojis)

        except Exception as e:
            print(e)
            self.send_headers(500, 'Emoji Error.')