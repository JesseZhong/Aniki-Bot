from os import getenv
from typing import Dict, NoReturn, Tuple, Union
from dotenv import load_dotenv
from flask import request
from flask_restful import Resource, abort
from datetime import datetime, timedelta
from functools import wraps
from gremlin.discord.auth import DiscordAuth, ExpiredTokenError, InvalidTokenError
#from api.mockauth import ExpiredToken, InvalidToken, MockAuth as DiscordAuth
from gremlin.db.lmdb import get, open_db, transact_get, transact_update, update
from common.utility import get_guild
import requests
import json



load_dotenv()
DISCORD_API = getenv('DISCORD_API', 'https://discord.com/api')
SITE_URL = getenv('SITE_URL')
REDIRECT_URL = f'{SITE_URL}/authorized'
CLIENT_ID = getenv('CLIENT_ID')
CLIENT_SECRET = getenv('CLIENT_SECRET')
DISCORD_TOKEN = getenv('DISCORD_TOKEN')
STATE_EXPIRY = getenv('STATE_EXPIRY', 10) # In days.
STATE_KEY = getenv('STATE_KEY', 'session_states')

TIME_FORMAT = '%Y.%m.%d %H:%M:%S'


def permissions_check(
    token: str,
    guild: str,
) -> Union[NoReturn, Tuple]:
    """
        Check user if user has access
        to resources using their token.

        Return:
            Accepted user token and guild id.
    """

    discord = DiscordAuth(
        DISCORD_API,
        REDIRECT_URL,
        CLIENT_ID
    )

    user = None
    try:
        user = discord.get_user(token)

    except ExpiredTokenError:
        abort(401, message='Unauthorized - Invalid Token.')

    except InvalidTokenError:
        abort(401, message='Unauthorized - New Token Required.')

    username = ''
    discriminator = ''
    userid = ''

    # Get user info.
    try:
        username = user['username']
        discriminator = user['discriminator']
        userid = user['id']

    except KeyError as e:
        print(e)
        abort(418, 'I''m a little teapot.')

    # Try to get guild info.
    guild_stuff = get_guild(guild)
    if not guild_stuff or 'data' not in guild_stuff:
        abort(403, 'Forbidden.')

    guild_data = guild_stuff['data']

    # Check if there is a permissions collection for the guild.
    if 'permitted' not in guild_data:
        abort(403, message='Forbidden')

    permitted = guild_data['permitted']

    # Check if the user is simply listed.
    if 'users' in permitted and \
        f'{username}#{discriminator}' in permitted['users']:
            return token, guild
        
    # Try to resolve permissions for the user based of their guild role.
    if 'roles' in permitted:

        # List guild roles.
        roles = json.loads(requests.get(
            f'{DISCORD_API}/guilds/{guild}/roles',
            headers={
                'Authorization': f'Bot {DISCORD_TOKEN}'
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
            f'{DISCORD_API}/guilds/{guild}/members/{userid}',
            headers={
                'Authorization': f'Bot {DISCORD_TOKEN}'
            }
        )

        # Confirm the user is in the guild.
        if not memberResponse.ok:
            abort(403)
        member = json.loads(memberResponse.content)

        # Check if there are intersections between the user's
        # roles and the listed ones.
        if 'roles' in member and \
            any(set(allowedRoles) & set(member['roles'])):
                return token, guild

    abort(401, message='Unauthorized - Invalid Token.')


def resolve_auth():
    """
        Grab token and check
    """
    if 'Authorization' not in request.headers or 'Guild' not in request.headers:
        abort(401)

    auth_type, token = request.headers['Authorization'].split(' ')

    if auth_type.lower() != 'bearer':
        abort(400)

    guild = request.headers['Guild']

    return permissions_check(
        token,
        guild
    )


def auth_required(func):
    """
        Requires the user to auth with Discord
        and be permitted.
    """

    @wraps(func)
    def check_auth(*args, **kwargs):
        token, guild = resolve_auth()
        return func(args, kwargs, token=token, guild=guild)
    
    return check_auth


class RequestAuthorization(Resource):

    def get(self):
        if 'State' not in request.headers:
            abort(400, message='Missing state.')

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        # Save state to compare later.
        state = request.headers['State']

        db = open_db()
        with db.begin(write=True) as trnx:
            states: Dict[str, str] = transact_get(
                trnx,
                STATE_KEY
            )

            expiry_date = datetime.now() + timedelta(days=STATE_EXPIRY)
            states[state] = expiry_date.strftime(TIME_FORMAT)

            transact_update(
                trnx,
                STATE_KEY,
                states
            )

        db.close()

        auth_url = discord.request_authorization(
            state=state,
            scope='identify guilds'
        )

        return {
            'auth_url': auth_url,
            'state': state
        }, 200


class RequestAccess(Resource):

    def get(self):
        if 'State' not in request.headers:
            abort(400, message='Missing state.')

        state = request.headers['State']

        db = open_db()

        # Check if state was previously handled.
        states: Dict[str, str] = get(
            STATE_KEY,
            dbenv=db
        )
        
        if state not in states:
            abort(400, message='Bad state.')

        if 'Code' not in request.headers:
            abort(400, message='Missing code.')

        code = request.headers['Code']

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        try:
            tokens = discord.request_access(
                code=code,
                client_secret=CLIENT_SECRET
            )
            
            del states[state]
            update(
                STATE_KEY,
                states,
                dbenv=db
            )

        except Exception:
            abort(500, message='What?')

        finally:
            db.close()

        return tokens, 200


class RefreshAccess(Resource):

    def get(self):
        if 'Refresh' not in request.headers:
            abort(400, message='Missing refresh token.')

        refresh = request.headers['Refresh']

        discord = DiscordAuth(
            DISCORD_API,
            REDIRECT_URL,
            CLIENT_ID
        )

        tokens = discord.refresh_access(
            refresh_token=refresh,
            client_secret=CLIENT_SECRET
        )

        return tokens, 200


class RevokeAccess(Resource):

    def get(self):
        if 'Authorization' not in request.headers:
            abort(401, message='Token Missing.')

        token = request.headers['Authorization']

        response = requests.post(
            f'{self.DISCORD_OAUTH_API}/token/revoke',
            headers={
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data=f'client_id={self.CLIENT_ID}&client_secret={self.CLIENT_SECRET}&token={token}'
        )

        if response.ok:
            return 'Token Revoked.', 200
        else:
            abort(400, message='Failed to revoke.')