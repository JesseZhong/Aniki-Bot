#!/bin/python

import ssl
from os import getenv
from sys import argv
from socket import SO_REUSEADDR, SOL_SOCKET
from http.server import HTTPServer
from dotenv import load_dotenv
from dashboard.api.handler import ServerHandler

if __name__ == '__main__':

    load_dotenv()
    API_URL = getenv('API_URL')
    API_PORT = int(getenv('API_PORT'))

    server = HTTPServer(
        (
            API_URL,
            API_PORT
        ),
        ServerHandler
    )

    # Setup with SSL if argument present.
    if len(argv) > 1 and argv[1] == 'ssl':
        
        CERT_FILE = getenv('CERT_FILE')
        KEY_FILE = getenv('KEY_FILE')

        server.socket = ssl.wrap_socket(
            server.socket,
            server_side=True,
            certfile=CERT_FILE,
            keyfile=KEY_FILE,
            ssl_version=ssl.PROTOCOL_TLSv1_2
        )

        # Allow for address re-use after service restarts.
        server.socket.setsockopt(
            SOL_SOCKET,
            SO_REUSEADDR,
            1
        )

        print('Configured with SSL.')

    print(f'Server started on {API_URL}:{API_PORT}.')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

    server.server_close()
    print('Server shutdown.')
