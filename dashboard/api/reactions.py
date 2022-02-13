import asyncio
from typing import Any, Dict
from dashboard.api.authorization import perms_required
from dashboard.api.guild_collection import GuildCollection
from flask_restful import Resource, abort
from gremlin.discord.audio import Audio


REACTION_ID_REGEX = '^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$'

def get_reactions(
    guild_id: str
):
    return GuildCollection(
        guild_id,
        'reactions'
    )


class Reactions(Resource):

    @perms_required
    def get(
        self,
        guild: str,
        **kwargs
    ):
        """
            Returns all the reactions for a guild.
        """
        return get_reactions(guild).get_items()


class Reaction(Resource):

    @perms_required
    def put(
        self,
        args: Dict[str, str],
        guild: str,
        **kwargs
    ):
        """
            Adds or updates a reaction.
            Also, attempts to cache any reaction audio.
        """
        if not args or 'reaction_id' not in args:
            abort(400, 'Missing ID.')
        reaction_id = args['reaction_id']

        def cache(reaction: Dict[str, Any]):
            if 'audio_url' in reaction and reaction['audio_url']:
                asyncio.run(Audio.from_url(
                    reaction['audio_url'],
                    start=(reaction['start'] if 'start' in reaction else None),
                    end=(reaction['end'] if 'end' in reaction else None),
                    clip=(reaction['clip'] if 'clip' in reaction else None)
                ))

        return get_reactions(guild).put_item(
            'schemas/put_persona.json',
            REACTION_ID_REGEX,
            reaction_id,
            cache
        )

    @perms_required
    def delete(
        self,
        args: Dict[str, str],
        guild: str,
        **kwargs
    ):
        """
            Removes a reaction.
        """
        if not args or 'reaction_id' not in args:
            abort(400, 'Missing ID.')
        reaction_id = args['reaction_id']

        return get_reactions(guild).remove_item(
            REACTION_ID_REGEX,
            reaction_id
        )