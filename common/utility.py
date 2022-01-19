from typing import Dict, Set
from datetime import datetime
from api.db import get, update

TIME_FORMAT = '%Y.%m.%d %H:%M:%S'

def list_users():
    """
        Prints all allowed users.
    """
    users = get('users')

    user_list = []
    for username, user in users.items():
        if 'is_admin' in user and user['is_admin']:
            user_list.append(f'{username} [admin]')
        else:
            user_list.append(username)
    print('Users: ' + ', '.join(user_list))


def delete_user(
    username: str
):
    """
        Attempts to delete a user from the db.
    """
    users = get('users')

    if username in users:
        del users[username]
        update('users', users)


def put_user(
    username: str,
    is_admin: bool = False
):
    """
        Add a user and maybe a role.
    """
    users = get('users')
    users[username] = {
        'is_admin': is_admin
    }
    update('users', users)


def list_roles():
    """
        Prints all allowed guild roles.
    """
    roles = get('roles')
    
    role_list = []
    for guild, role in roles.items():
        role_list.append(f'{role} [{guild}]')

    print('Roles [Guild]: ' + ', '.join(role_list))


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


def delete_role(
    guild: str,
    role: str
):
    """
        Deletes an allowed role.
    """
    roles = get('roles')

    if guild in roles:
        guild_roles: Set = roles[guild]
        del guild_roles[role]

        update('roles', roles)


def put_role(
    guild: str,
    role: str
):
    """
        Add an allowable guild role.
    """
    roles = get('roles')

    if guild in roles:
        guild_roles: Set = roles[guild]
        guild_roles.add(role)
        roles[guild] = guild_roles

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
