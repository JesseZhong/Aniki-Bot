#!/bin/python

import os
import json
from .basehandler import BaseHandler

class ServerHandler(BaseHandler):

    def __init__(self, *args, **kwargs):
        get_routes = {
            '/personas': self.handle_personas,
            '/reactions': self.handle_reactions,
            '/favicon.ico': self.handle_favicon,
            '/': self.handle_root
        }

        post_routes = {

        }

        super().__init__(
            get_routes,
            post_routes,
            *args,
            **kwargs
        )


    def handle_root(self):
        self.set_headers(200)
        self.respond('Nothing to see here!')


    def handle_favicon(self):
        return
        

    def handle_personas(self):
        self.set_headers(200)
        self.send_file('personas.json')


    def handle_reactions(self):
        self.set_headers(200)
        self.send_file('reactions.json')