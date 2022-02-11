from typing import Dict
from dashboard.api.authorization import auth_required
from dashboard.api.guild_collection import GuildCollection
from flask_restful import Resource, abort


PERSONA_ID_REGEX = '^([a-zA-Z0-9-_.]{3,25}|[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12})$'

def get_personas(
    guild_id: str
):
    return GuildCollection(
        guild_id,
        'personas'
    )


class Personas(Resource):

    @auth_required
    def get(
        self,
        guild_id: str
    ):
        """
            Returns all the personas for a guild.
        """
        return get_personas(guild_id).get_items()


class Persona(Resource):

    @auth_required
    def put(
        self,
        args: Dict[str, str],
        guild_id: str
    ):
        """
            Adds or updates a persona.
        """
        if not args or 'persona_id' not in args:
            abort(400, 'Missing ID.')
        persona_id = args['persona_id']

        return get_personas(guild_id).put_item(
            'schemas/put_persona.json',
            PERSONA_ID_REGEX,
            persona_id,
        )

    @auth_required
    def delete(
        self,
        args: Dict[str, str],
        guild_id: str
    ):
        """
            Removes a persona.
        """
        if not args or 'persona_id' not in args:
            abort(400, 'Missing ID.')
        persona_id = args['persona_id']

        return get_personas(guild_id).remove_item(
            PERSONA_ID_REGEX,
            persona_id
        )