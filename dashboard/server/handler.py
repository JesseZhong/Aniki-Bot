#!/bin/python

import os
import json
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
        delete_routes=[]

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
        self.respond('Nothing to see here!')


    def get_favicon(self):
        return
        

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
            '[0-9a-f]{12}4[0-9a-f]{3}[89ab][0-9a-f]{15}\Z'
        )