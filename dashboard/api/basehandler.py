#!/bin/python

import json
import requests
import logging
import re
import traceback
from os import getenv
from jsonschema import validate
from jsonschema.exceptions import ValidationError
from logging.handlers import RotatingFileHandler
from http.server import BaseHTTPRequestHandler
from typing import Any, Tuple, Union, Dict, Callable, Set, List
from gremlin.db.lmdb import open_db, transact_get, transact_update, get
from urllib.parse import quote

from common.utility import get_guild


states: Set[str] = set()


class BaseHandler(BaseHTTPRequestHandler):

    def __init__(
        self,
        get_routes: List[Tuple[str, Callable[[], None]]],
        post_routes: List[Tuple[str, Callable[[], None]]],
        put_routes: List[Tuple[str, Callable[[], None]]],
        delete_routes: List[Tuple[str, Callable[[], None]]],
        *args,
        **kwargs
    ):
        self.SITE_URL = getenv('SITE_URL')
        self.REDIRECT_URL = f'{self.SITE_URL}/authorized'
        self.CLIENT_ID = getenv('CLIENT_ID')
        self.CLIENT_SECRET = getenv('CLIENT_SECRET')
        self.DISCORD_TOKEN = getenv('DISCORD_TOKEN')
        self.DISCORD_API = 'https://discord.com/api'
        self.DISCORD_OAUTH_API = f'{self.DISCORD_API}/oauth2'

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
        
        self.get_routes: List[Tuple[str, Callable[[], None]]] = self.regexify(get_routes)
        self.post_routes: List[Tuple[str, Callable[[], None]]] = self.regexify(post_routes)
        self.put_routes: List[Tuple[str, Callable[[], None]]] = self.regexify(put_routes)
        self.delete_routes: List[Tuple[str, Callable[[], None]]] = self.regexify(delete_routes)

        self.oauth_routes: Dict[str, Callable[[], None]] = {
            '/authorize': self.request_authorization,
            '/access': self.request_access,
            '/refresh': self.refresh_access,
            '/revoke': self.revoke_access
        } 

        super().__init__( *args, **kwargs)


    def regexify(self, routes: List[Tuple[str, Callable[[], None]]]):
        result = []
        for (key, handler) in routes:
            result.append((rf'^{re.escape(key)}(?:|/|/(?P<stub>.+))$', handler))
        return result

    def send_headers(self, code: int, message: str = None):
        """
            Set the necessary headers for a response,
            as well as sending the status code and message.
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
        self.send_header("Access-Control-Allow-Headers", "Refresh")
        self.send_header("Access-Control-Allow-Headers", "State")
        self.send_header("Access-Control-Allow-Headers", "Code")
        self.send_header("Access-Control-Allow-Headers", "Guild")
        self.send_header('Content-Type', 'application/json')
        self.end_headers()


    def get_header(self, key: str) -> Union[str, None]:
        """
            Attempts to pull a request header value.
        """
        if key not in self.headers or not self.headers[key]:
            return None

        return self.headers[key]


    def send_content(self, content: Dict):
        """
            Sends a response with the provided content.
        """
        self.wfile.write(
            json.dumps(content).encode(encoding='utf_8')
        )


    def send_bad_request(self, content: str = None):
        self.send_headers(400)
        self.send_content('Bad Request' if not content else content)

    
    def get_content(self):
        """
            Returns the content body of the request.
        """
        contentLen = int(self.headers.get('Content-Length'))
        return json.loads(self.rfile.read(contentLen)) \
            if contentLen > 0 \
            else {}
    

    def put_item(
        self,
        schema: Dict,
        item_name: str,
        key_regex: str,
        afterValidation: Callable[[Dict[str, Any]], None] = None
    ):
        """
            Add or updates an entry for an item belonging to a guild.
        """

        # Check for path stub and its validity.
        if not self.subpath:
            self.send_bad_request('Key must be specified.')
            return

        subMatch = re.match(key_regex, self.subpath, re.RegexFlag.IGNORECASE)
        if not subMatch:
            self.send_bad_request('Invalid key.')
            return

        # Check content for errors.
        content = self.get_content()
        try:
            validate(
                instance=content,
                schema=schema
            )
        except ValidationError as error:
            self.send_bad_request(error.message)
            return

        # Do some stuff.
        if afterValidation:
            try:
                afterValidation(content)
            except Exception:
                self.logger.error(
                    'Error after validation.\n' +
                    'Stacktrace:\n' + traceback.format_exc()
                )

        db = open_db()

        try:
            # Atomically update the db with the new item.
            with db.begin(write=True) as trnx:

                # Grab the data for the guild.
                guild_data = transact_get(trnx, self.guild)

                # Grab or make item collection, if it doesn't exist.
                item_data = guild_data[item_name] if item_name in guild_data else {}

                # Add or update item entry.
                item_data[self.subpath] = content
                guild_data[item_name] = item_data

                # Update the data for the guild.
                transact_update(
                    trnx,
                    self.guild,
                    guild_data
                )

        except Exception:
            self.logger.error(
                'Item update error.'
                'Stacktrace:\n' + traceback.format_exc()
            )
            self.send_headers(500, 'Internal Error')
            return

        finally:
            db.close()

        self.send_headers(201, 'Accepted')
        self.send_content(content)


    def delete_item(
        self,
        item_name: str,
        key_regex: str
    ):
        """
            Removes an entry for an item that belongs to a guild.
        """

        # Check for path stub and its validity.
        if not self.subpath:
            self.send_bad_request('Key must be specified.')
            return

        subMatch = re.match(key_regex, self.subpath, re.RegexFlag.IGNORECASE)
        if not subMatch:
            self.send_bad_request('Invalid key.')
            return

        db = open_db()

        try:
            # Atomically update the db.
            with db.begin(write=True) as trnx:

                # Grab the data for the guild.
                guild_data = transact_get(trnx, self.guild)

                # Check if the item collection exists.
                if item_name not in guild_data:
                    self.send_bad_request(f'No {item_name} to remove.')
                    return

                item_data = guild_data[item_name]

                # Remove the entry if it exists.
                if self.subpath in item_data:
                    del item_data[self.subpath]

                    guild_data[item_name] = item_data

                    # Update the data for the guild.
                    transact_update(
                        trnx,
                        self.guild,
                        guild_data
                    )

        except Exception:
            self.logger.error(
                'Item delete error.'
                'Stacktrace:\n' + traceback.format_exc()
            )
            self.send_headers(500, 'Internal Error')
            return

        finally:
            db.close()

        self.send_headers(201, 'Accepted')


    def send_item(
        self,
        item_name
    ):
        """
            Returns an item for a guild.
        """
        guild_data = get(self.guild)
        self.send_content(guild_data[item_name] if item_name in guild_data else {})

    
    def handle_vanity(self) -> bool:
        """
            Handles vanity check requests.
            Checks if a special name exists for a guild.
            Returns the mapping if it does.
        """

        if not self.check_file_exists(self.VANITY):
            return False

        match = re.match(r'^/vanity/(?P<guild>[a-zA-Z0-9_]{2,100})$', self.path)
        if match:
            guild = match.group('guild')
            vanities = get('vanity')
            if guild in vanities:
                self.send_headers(200)
                self.send_content({
                    'id': vanities[guild]
                })
                return True

            self.send_bad_request()
            return True


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
        """
            Request an authorization URL from Discord.
            The user can then use said URL to authenticate
            with Discord.
        """
        state = self.get_header('State')
        if not state:
            self.send_bad_request('Missing state.')
            return
        scope = 'identify guilds'

        global states
        states.add(state)

        # No need for the user to reapprove.
        prompt = 'none'

        redirect = quote(self.REDIRECT_URL, safe='')
        auth_url = f'{self.DISCORD_OAUTH_API}/authorize?response_type=code' + \
            f'&client_id={self.CLIENT_ID}&state={state}&scope={scope}' + \
            f'&redirect_uri={redirect}&prompt={prompt}'

        self.send_headers(200)
        self.send_content({
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

        # Check if state was previously handled.
        global states
        if state not in states:
            self.send_bad_request('Bad state.')
            return
        states.remove(state)

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

            self.send_headers(500)
            return

        tokens = json.loads(response.content)
        self.token = tokens['access_token']

        # Grab the access_token and grab the user.
        user = json.loads(self.get_user(self.token).content)['user']

        self.send_headers(200)
        self.send_content(tokens)


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

        self.send_headers(200)
        self.send_content(json.loads(response.content))


    def revoke_token(self, token) -> bool:
        '''
            Invalidates the passed Discord token.
        '''
        response = requests.post(
            f'{self.DISCORD_OAUTH_API}/token/revoke',
            headers={
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data=f'client_id={self.CLIENT_ID}&client_secret={self.CLIENT_SECRET}&token={token}'
        )
        
        return response.ok


    def revoke_access(self):
        '''
            Revokes the user's passed Discord token.
            Sends back an OK if revoke was successful.
        '''
        if not self.token:
            self.send_bad_request('Token Missing.')
            return

        if self.revoke_token(self.token):
            self.send_headers(200, 'Token Revoked.')
        else:
            self.send_bad_request('Failed to Revoke.')


    def permitted(self, user) -> bool:
        """
            Check if the user has permissions.
        """

        if not hasattr(self, 'guild'):
            return False

        username = user['username']
        discriminator = user['discriminator']
        userid = user['id']

        permitted = get_guild(self.guild)

        # Check if the user is simply listed.
        if 'users' in permitted and \
            f'{username}#{discriminator}' in permitted['users']:
                return True
        
        # Try to resolve permissions for the user based of their guild role.
        if 'roles' in permitted:

            # List guild roles.
            roles = json.loads(requests.get(
                f'{self.DISCORD_API}/guilds/{self.guild}/roles',
                headers={
                    'Authorization': f'Bot {self.DISCORD_TOKEN}'
                }
            ).content)

            # Cross-reference guild roles with listed roles.
            # Grab their 'snowflake' ids.
            allowedRoles = [
                role['id']
                for roleName in permitted['roles']
                for role in roles
                if role['name'] == roleName
            ]

            # Get the user's guild roles.
            memberResponse = requests.get(
                f'{self.DISCORD_API}/guilds/{self.guild}/members/{userid}',
                headers={
                    'Authorization': f'Bot {self.DISCORD_TOKEN}'
                }
            )

            # Confirm the user is in the guild.
            if memberResponse.status_code != 200:
                return False
            member = json.loads(memberResponse.content)

            # Check if there are intersections between the user's
            # roles and the listed ones.
            if 'roles' in member and \
                any(set(allowedRoles) & set(member['roles'])):
                    return True

        return False


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


    def check_guild(self) -> bool:
        """
            Check if an allowed guild was included in the request.
        """
        self.guild = self.get_header('Guild')

        guilds = get('guilds')
        return self.guild and guilds or self.guilds in guilds


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

        if 'Authorization' not in self.headers or 'Guild' not in self.headers:
            return (401, 'Unauthorized.')

        # Check if user is from an allowed guild.
        if not self.check_guild():
            return (403, 'Forbidden Guild.')

        try:
            auth_type, token = self.headers['Authorization'].split(' ')

        except ValueError:
            return (400, 'Bad Request - Invalid Authorization.')

        if auth_type.lower() != 'bearer':
            return (403, 'Forbidden Auth Type')

        # Check if the token is valid.
        response = self.get_user(token)

        if response.status_code != 200:
            return (401, 'Unauthorized - Invalid Token.')

        user = json.loads(response.content)['user']

        try:
            if not self.permitted(user):
                return (403, 'Forbidden User')
        except OSError:
            print('Could not open or read the permissions file.')
            return (403, 'Forbidden')
        except Exception:
            self.logger.error(
                'Unknown error when attempting to open the permissions file.\n' +
                'Stacktrace:\n' + traceback.format_exc()
            )
            return (500, 'Server Error.')

        # Save token for potential later use.
        self.token = token
        return None


    def handler_for(self, routes: List[Tuple[str, Callable[[], None]]]):
        """
            Handles all requests for a set of routes.
        """

        # For everything else, check for a valid Discord token.
        result = self.verify()

        # Deny the user access if verification failed.
        if result is not None:
           self.send_headers(*result)
           self.send_content('Nope')
           return

        # Handle a request based off path.
        for (route, handler) in routes:
            match: re.Match = re.match(route, self.path)
            if match:
                stub = match.group('stub')
                self.subpath = stub if stub else None
                handler()
                return
        
        self.send_headers(404, 'Dude, fuck off!')
        self.send_content('Yo, WTF you doin here?!')


    def do_GET(self):
        """
            Handle all incoming GET requests.
        """

        # Handle guild vanity lookups.
        if self.handle_vanity():
            return

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
        self.send_headers(200, 'OK')
