#!/bin/python

import os
import json
from .basehandler import BaseHandler

class ServerHandler(BaseHandler):

    def do_GET(self):

        # Check for a valid Discord token.
        result = self.verify()

        # Deny the user access if verification failed.
        if result is not None:
            self.set_headers(**result)
            self.respond()
            return
        
        routes = {
            '/personas': self.handle_personas,
            '/reactions': self.handle_reactions,
            '/favicon.ico': self.handle_favicon,
            '/': self.handle_root
        }

        # Handle a request based off path.
        if self.path in routes:
            routes[self.path]()
        else:
            self.set_headers(404, 'Dude, fuck off!')
            self.respond('Yo, WTF you doin here?!')


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