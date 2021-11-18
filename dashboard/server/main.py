#!/bin/python

import os
from socket import socket, SO_REUSEADDR, SOL_SOCKET
import ssl
from http.server import HTTPServer
from dotenv import load_dotenv
from .handler import ServerHandler

class Main():
    def __init__(self):
        load_dotenv()
        self.API_URL = os.getenv('API_URL')
        self.API_PORT = int(os.getenv('API_PORT'))
        self.CERT_FILE = os.getenv('CERT_FILE')
        self.KEY_FILE = os.getenv('KEY_FILE')


    def run(self):
        """
            Runs or resumes the server.
        """
        if not hasattr(self, 'server'):
            self.server = HTTPServer(
                (
                    self.API_URL,
                    self.API_PORT
                ),
                ServerHandler
            )
            self.server.socket = ssl.wrap_socket(
                self.server.socket,
                server_side=True,
                certfile=self.CERT_FILE,
                keyfile=self.KEY_FILE,
                ssl_version=ssl.PROTOCOL_TLSv1_2
            )

            # Allow for address re-use after service restarts.
            self.server.socket.setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)

            print(f'Server started on {self.API_URL}:{self.API_PORT}.')
            

        if hasattr(self, 'server') and self.server:
            self.server.serve_forever()
        

    def stop(self):
        """
            Stops and cleans up the server.
        """
        if hasattr(self, 'server') and self.server:
            self.server.server_close()
            self.server = None
            print('Server shutdown.')
