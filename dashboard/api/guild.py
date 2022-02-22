from os import getenv
from dotenv import load_dotenv
from typing import Dict, NoReturn, Tuple, Union
from flask_restful import Resource, abort
from dashboard.api.authorization import auth_required
from gremlin.db.lmdb import get
import requests
import re
import json


load_dotenv()
DISCORD_API = getenv('DISCORD_API', 'https://discord.com/api')
DISCORD_TOKEN = getenv('DISCORD_TOKEN')


def verify_guild(guild_id: str) -> Union[Tuple, NoReturn]:
    """
        Check with Discord to see if the
        guild exists and fetch its info.
    """
    response = requests.get(
        f'{DISCORD_API}/guilds/{guild_id}/preview',
        headers={
            'Authorization': f'Bot {DISCORD_TOKEN}'
        }
    )

    if response.ok:
        return json.loads(response.content), 200
    else:
        abort(400, message='Guild doesn''t exist.')



class Guild(Resource):

    @auth_required
    def get(self, guild_id):
        """
            Get guild preview from Discord.
        """
        if not guild_id:
            abort(400, message='Missing ID.')

        return verify_guild(guild_id)


class GuildLookup(Resource):

    @auth_required
    def get(self, guild_name: str):
        """
            Lookup a guild id by it's vanity name.
        """
        if not guild_name:
            abort(400, message='Missing vanity name.')

        match = re.match(r'^[a-zA-Z0-9_]{2,100}$', guild_name)
        if not match:
            abort(400, message='Invalid guild vanity name.')

        vanities = get('vanity')

        if guild_name not in vanities:
            abort(400, message='Unknown vanity name.')

        return verify_guild(vanities[guild_name])