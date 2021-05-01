#!/bin/python

from discord import Member

def is_connected(user) -> bool:
    """
        Check if the user is connected to a voice channel.
    """
    return isinstance(user, Member) and \
        user.voice and hasattr(user.voice, 'channel') and \
        user.voice.channel