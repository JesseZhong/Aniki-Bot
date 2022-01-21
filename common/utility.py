from typing import Dict, Set
from datetime import datetime
from operator import itemgetter
from gremlin.db.lmdb import get, update

TIME_FORMAT = '%Y.%m.%d %H:%M:%S'


def get_guild(
    guild: str
):
    """
        Gets a guild's data, if available.
    """
    guild_id = None

    # Look up id if vanity was passed.
    vanity = get('vanity')
    if guild in vanity:
        guild_id = vanity[guild]

    # Use passed id or vanity id.
    guild_id = guild_id if guild_id else guild

    # Guild not allowed? Get out!
    guilds = get('guilds')
    if guild_id not in guilds:
        print('Guild not allowed.')
        return None
    else:
        return {
            'id': guild_id,
            'data': get(guild_id)
        }


def get_permitted(
    guild: str
):
    """
        Gets a guild's permitted users and roles, if available.
    """

    # Get guild data.
    guild_stuff = get_guild(guild)
    if not guild_stuff:
        return
    guild_data = guild_stuff['data']

    # Check if there are any permitted users or roles.
    if 'permitted' not in guild_data or not guild_data['permitted']:
        return {}

    return guild_data['permitted']


def update_permitted(
    guild: str,
    permitted: Dict
):
    """
        Updates a guild's permitted users and roles.
    """

    # Get guild data.
    guild_stuff = get_guild(guild)
    if not guild_stuff:
        return

    guild_id, guild_data = itemgetter(
        'id',
        'data'
    )

    guild_data['permitted'] = permitted
    update(
        guild_id,
        guild_data
    )


def list_permitted(
    guild: str
):
    """
        Prints all allowed users and roles for a guild.
    """
    permitted = get_permitted(guild)

    # List users if available.
    if 'users' in permitted:
        print('Users: ' + ', '.join(permitted['users']))

    # List roles if available.
    if 'roles' in permitted:
        print('Roles: ' + ', '.join(permitted['roles']))


def remove_user(
    guild: str,
    username: str
):
    """
        Attempts to remove a user from a guild's permissions.
    """
    permitted = get_permitted(guild)

    if 'users' not in permitted or username not in permitted['users']:
        print('User does not exist. Nothing to remove.')
        return

    permitted['users'].remove(username)
    update_permitted(
        guild,
        permitted
    )


def put_user(
    guild: str,
    username: str
):
    """
        Add a user.
    """
    guild_stuff = get_guild(guild)
    if not guild_stuff:
        return

    guild_id, guild_data = itemgetter(
        'id',
        'data'
    )

    # Add user. Create necessary structures if they don't exist.
    permitted = guild_data['permitted'] if 'permitted' in guild_data else {}
    users: Set = set(permitted['users'] if 'users' in permitted else [])
    users.add(username)
    permitted['users'] = users

    update_permitted(
        guild_id,
        permitted
    )


def delete_guild(
    guild: str
):
    """
        Delete all the roles for a guild.
    """
    roles = get('roles')

    if guild in roles:
        del roles[guild]

        update('roles', roles)


def clean_states():
    """
        Clean up session states that have expired.
    """
    states: Dict[str, str] = get('states')

    now = datetime.now()
    for state, expiry in states.items():
        if datetime.strptime(expiry, TIME_FORMAT) > now:
            del states[state]
