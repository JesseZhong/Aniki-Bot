#!/bin/python

from http.server import BaseHTTPRequestHandler

class ServerHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200, 'We good!')
        self.send_header('Content-type', 'text/html')
        self.end_headers()