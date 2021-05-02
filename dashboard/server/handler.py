#!/bin/python

import json
from http.server import BaseHTTPRequestHandler

class ServerHandler(BaseHTTPRequestHandler):

    def set_headers(self):
        self.send_response(200, 'We good!')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()


    def respond(self, obj: {}):
        self.wfile.write(
            json.dumps(obj).encode(encoding='utf_8')
        )

    def do_GET(self):
        self.set_headers()
        
        routes = {
            '/personas': self.handle_personas,
            '/': self.handle_root
        }

        # Handle a request based off path.
        if self.path in routes:
            routes[self.path]()


    def handle_root(self):
        self.respond('Nothing to see here!')


    def handle_personas(self):
        self.respond({
            'PERSONA': 'YEAAAH BABY'
        })