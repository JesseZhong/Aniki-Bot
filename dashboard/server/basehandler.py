#!/bin/python

import os
import json
import requests
from http.server import BaseHTTPRequestHandler

DATA_DIR = os.getenv('DATA_DIR')
SITE_URL = os.getenv('SITE_URL')
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')

discord_oauth_url = 'https://discord.com/api/oauth2'

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

    
    def authorize(self):

        # TODO: Hash session cookie.
        state=f''
        scope = 'identity'
        redirect = f'{SITE_URL}'

        # No need for the user to reapprove.
        prompt = 'none'

        auth_url = f'{discord_oauth_url}/authorize?response_type=code' + \
            f'&client_id={CLIENT_ID}&scope={scope}&state={state}' + \
            f'&redirect_uri={redirect}&prompt={prompt}'

        self.respond({
            'auth_url': auth_url
        })

    
    def request_access(self, code: str):
        """
            Responds with a new access token
            if a valid Discord authorization code.
        """
        data = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': SITE_URL
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(
            f'{discord_oauth_url}/token',
            data=data,
            headers=headers
        )
        response.raise_for_status()
        self.respond(response)


    def refresh_access(self, refresh_token: str):
        """
            Responds with a new access token
            if a valid Discord refresh token is provided.
        """
        data = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(
            f'{discord_oauth_url}/token',
            data=data,
            headers=headers
        )
        response.raise_for_status()
        self.respond(response)


    def verify(self):
        return