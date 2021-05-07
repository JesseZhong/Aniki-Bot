#!/bin/python

import os
import json
import requests
import logging
from logging.handlers import RotatingFileHandler
import traceback
from http.server import BaseHTTPRequestHandler
from typing import Tuple, Union, Dict, Callable, Set
from urllib.parse import quote


states: Set[str] = set()


class BaseHandler(BaseHTTPRequestHandler):

    def __init__(
        self,
        get_routes: Dict[str, Callable[[], None]],
        post_routes: Dict[str, Callable[[], None]],
        put_routes: Dict[str, Callable[[], None]],
        delete_routes: Dict[str, Callable[[], None]],
        *args,
        **kwargs
    ):
        self.DATA_DIR = os.getenv('DATA_DIR')
        self.SITE_URL = os.getenv('SITE_URL')
        self.REDIRECT_URL = f'{self.SITE_URL}/authorized'
        self.CLIENT_ID = os.getenv('CLIENT_ID')
        self.CLIENT_SECRET = os.getenv('CLIENT_SECRET')
        self.PERMITTED_USERS = os.getenv('PERMITTED_USERS')
        self.DISCORD_OAUTH_API = 'https://discord.com/api/oauth2'

        """
            Sets up error logging.
        """

        self.logger = logging.getLogger('Error Log')
        self.logger.setLevel(logging.ERROR)
        handler = RotatingFileHandler(
            'server-error.log',
            maxBytes=20000,
            backupCount=1
        )
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
        
        self.get_routes: Dict[str, Callable[[], None]] = get_routes
        self.post_routes: Dict[str, Callable[[], None]] = post_routes
        self.put_routes: Dict[str, Callable[[], None]] = put_routes
        self.delete_routes: Dict[str, Callable[[], None]] = delete_routes

        self.oauth_routes: Dict[str, Callable[[], None]] = {
            '/authorize': self.request_authorization,
            '/access': self.request_access,
            '/refresh': self.refresh_access
        } 

        super().__init__( *args, **kwargs)


    def set_headers(self, code: int, message: str = None):
        """
            Set a response's headers.
        """
        self.send_response(code, message)
        origin = self.get_header('Origin')
        if origin == self.SITE_URL:
            self.send_header('Access-Control-Allow-Origin', self.SITE_URL)
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS, PUT, DELETE')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Headers", "Accept")
        self.send_header("Access-Control-Allow-Headers", "Authorization")
        self.send_header("Access-Control-Allow-Headers", "State")
        self.send_header("Access-Control-Allow-Headers", "Code")
        self.send_header('Content-Type', 'application/json')
        self.end_headers()


    def get_header(self, key: str) -> Union[str, None]:
        """
            Attempts to pull a request header value.
        """
        if key not in self.headers or not self.headers[key]:
            return None

        return self.headers[key]


    def respond(self, content: {}):
        """
            Sends a response with the provided content.
        """
        self.wfile.write(
            json.dumps(content).encode(encoding='utf_8')
        )


    def send_bad_request(self, content: str = None):
        self.set_headers(400)
        self.respond('Bad Request' if not content else content)


    def send_file(self, filename: str):
        """
            Sends the contents of a specified file.
        """
        with open(os.path.join(self.DATA_DIR, filename), 'r') as file:
            data = json.load(file)
            self.respond(data)


    def handle_oauth_request(self) -> bool:
        """
            Checks and handles any Discord OAuth2
            requests.

            Returns 'True' if the request was for OAuth2.
        """

        if self.path in self.oauth_routes:
            self.oauth_routes[self.path]()
            return True
        else:
            return False

    
    def request_authorization(self):

        state = self.get_header('State')
        if not state:
            self.send_bad_request('Missing state.')
            return
        scope = 'identify'

        global states

        # No need for the user to reapprove.
        prompt = 'none'

        redirect = quote(self.REDIRECT_URL, safe='')
        auth_url = f'{self.DISCORD_OAUTH_API}/authorize?response_type=code' + \
            f'&client_id={self.CLIENT_ID}&state={state}&scope={scope}' + \
            f'&redirect_uri={redirect}&prompt={prompt}'

        self.set_headers(200)
        self.respond({
            'auth_url': auth_url,
            'state': state
        })

    
    def request_access(self):
        """
            Responds with a new access token
            if a valid Discord authorization code.
        """

        state = self.get_header('State')
        if not state:
            self.send_bad_request('Missing state.')
            return

        code = self.get_header('Code')
        if not code:
            self.send_bad_request('Missing code.')
            return

        data = {
            'client_id': self.CLIENT_ID,
            'client_secret': self.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': self.REDIRECT_URL
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(
            f'{self.DISCORD_OAUTH_API}/token',
            data=data,
            headers=headers
        )

        try:
            # Check for errors.
            response.raise_for_status()
        except requests.HTTPError as error:

            # Print and log the bad request to the user endpoint.
            msg = f'Status: {response.status_code}\nReason: {response.reason}' \
                + f'Content: {response.content}'
            self.log_error(msg)
            print(msg)

            self.set_headers(500)
            return

        tokens = json.loads(response.content)

        # Grab the access_token and grab the user.
        user = json.loads(self.get_user(tokens['access_token']).content)['user']

        # Check for permissions.
        permitted = self.permitted(
            username=user['username'],
            discriminator=user['discriminator']
        )

        # Append API permissions to the response.
        tokens['permitted'] = permitted

        print(tokens)

        self.set_headers(200)
        self.respond(tokens)


    def refresh_access(self):
        """
            Responds with a new access token
            if a valid Discord refresh token is provided.
        """

        refresh = self.get_header('Refresh')
        if not refresh:
            self.send_bad_request('Missing refresh token.')
            return

        data = {
            'client_id': self.CLIENT_ID,
            'client_secret': self.CLIENT_SECRET,
            'grant_type': 'refresh_token',
            'refresh_token': refresh
        }
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        response = requests.post(
            f'{self.DISCORD_OAUTH_API}/token',
            data=data,
            headers=headers
        )

        self.set_headers(200)
        self.respond(response)


    def revoke_access(self):
        return


    def permitted(self, username: str, discriminator: str) -> bool:
        """
            Check if the user has permissions.
        """
        with open(self.PERMITTED_USERS, 'r') as file:
            permittedUsers = json.load(file)
            return f'{username}#{discriminator}' in permittedUsers


    def get_user(self, access_token: str) -> requests.Response:
        """
            Pings Discord's API to get the user for the access token.
        """
        return requests.get(
            f'{self.DISCORD_OAUTH_API}/@me',
            headers={
                'Authorization': f'Bearer {access_token}'
            }
        )


    def verify(self) -> Union[Tuple[int, str], None]:
        """
            Check for the 'Authorization' header in the request.
            Then verify that there is a valid Discord access
            token passed by checking with Discord's OAuth2 API.

            After a verification, the user's id is checked against
            a list of permitted users to see if they can use this API.

            Returns a tuple of the status code if verification
            failed OR the nothing if verification was successful.
        """

        if 'Authorization' not in self.headers:
            return (401, 'Unauthorized')

        try:
            auth_type, token = self.headers['Authorization'].split(' ')

        except ValueError:
            return (400, 'Bad Request - Invalid Authorization')

        if auth_type.lower() != 'bearer':
            return (403, 'Forbidden')

        # Check if the token is valid.
        response = self.get_user(token)

        if response.status_code != 200:
            return (401, 'Unauthorized - Invalid Token')

        user = json.loads(response.content)['user']

        try:
            if not self.permitted(
                username=user['username'],
                discriminator=user['discriminator']
            ):
                return (403, 'Forbidden')
        except OSError:
            print('Could not open or read the permissions file.')
            return (403, 'Forbidden')
        except Exception as e:
            self.logger.error(
                'Unknown error when attempting to open the permissions file.\n' +
                'Stacktrace:\n' + traceback.format_exc()
            )
            return (500, 'Server Error')

        return None


    def handler_for(self, routes: Dict[str, Callable[[], None]]):
        """
            Handles all requests for a set of routes.
        """

        # For everything else, check for a valid Discord token.
        result = self.verify()

        # Deny the user access if verification failed.
        if result is not None:
           self.set_headers(*result)
           self.respond('Nope')
           return

        # Handle a request based off path.
        if self.path in routes:
            routes[self.path]()
        else:
            self.set_headers(404, 'Dude, fuck off!')
            self.respond('Yo, WTF you doin here?!')



    def do_GET(self):
        """
            Handle all incoming GET requests.
        """

        # Check for OAuth2 stuffs.
        # If an OAuth2 request was made,
        # handle it and do nothing else.
        if self.handle_oauth_request():
           return

        self.handler_for(self.get_routes)

    
    def do_POST(self):
        """
            Handle all incoming PUT requests.
        """
        self.handler_for(self.post_routes)


    def do_PUT(self):
        """
            Handle all incoming PUT requests.
        """
        self.handler_for(self.put_routes)


    def do_DELETE(self):
        """
            Handle all incoming PUT requests.
        """
        self.handler_for(self.delete_routes)

    
    def do_OPTIONS(self):
        self.set_headers(200, 'OK')
