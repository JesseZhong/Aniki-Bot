#!/bin/python

import json
from http.server import BaseHTTPRequestHandler

class ServerHandler(BaseHTTPRequestHandler):

    def set_headers(self, code: int, message: str = None):
        self.send_response(code, message)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()


    def respond(self, obj: {}):
        self.wfile.write(
            json.dumps(obj).encode(encoding='utf_8')
        )
        

    def do_GET(self):
        
        routes = {
            '/personas': self.handle_personas,
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
        self.respond({
            'PERSONA': 'YEAAAH BABY'
        })