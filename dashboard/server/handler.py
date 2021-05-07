#!/bin/python

import os
import json
from .basehandler import BaseHandler

class ServerHandler(BaseHandler):

    def __init__(self, *args, **kwargs):

        get_routes={
            '/personas': self.get_personas,
            '/reactions': self.get_reactions,
            '/favicon.ico': self.get_favicon,
            '/': self.get_root
        }
        post_routes={}
        put_routes={}
        delete_routes={}

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