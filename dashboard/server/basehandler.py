#!/bin/python

import os
import json
from http.server import BaseHTTPRequestHandler

DATA_DIR = os.getenv('DATA_DIR')

class BaseHandler(BaseHTTPRequestHandler):

    def set_headers(self, code: int, message: str = None):
        self.send_response(code, message)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()


    def respond(self, obj: {}):
        self.wfile.write(
            json.dumps(obj).encode(encoding='utf_8')
        )


    def send_file(self, filename: str):
        with open(os.path.join(DATA_DIR, filename), 'r') as file:
            data = json.load(file)
            self.respond(data)