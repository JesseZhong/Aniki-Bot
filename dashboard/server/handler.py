#!/bin/python

import os
import json
import requests
from typing import Dict, OrderedDict
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
            ('/favicon.ico', self.get_favicon),
            ('/', self.get_root)
        ]
        post_routes=[]
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
        self.set_headers(200)
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
                self.set_headers(200)
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
        self.set_headers(200)
        self.send_file('personas.json')


    def get_reactions(self):
        self.set_headers(200)
        self.send_file('reactions.json')


    def put_persona(self):
        self.put_item(
            self.put_persona_schema,
            'personas.json',
            '^[a-zA-Z0-9-_.]{3,25}$'
        )


    def put_reaction(self):
        self.put_item(
            self.put_reaction_schema,
            'reactions.json',
            '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'
        )

    
    def delete_persona(self):
        self.delete_item(
            'personas.json',
            '^[a-zA-Z0-9-_.]{3,25}$'
        )


    def delete_reaction(self):
        self.delete_item(
            'reactions.json',
            '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'
        )