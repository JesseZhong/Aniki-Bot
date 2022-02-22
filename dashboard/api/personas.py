from typing import Dict
from dashboard.api.authorization import perms_required
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

    @perms_required
    def get(
        self,
        guild: str,
        **kwargs
    ):
        """
            Returns all the personas for a guild.
        """
        return get_personas(guild).get_items()


class Persona(Resource):

    @perms_required
    def put(
        self,
        persona_id: str,
        guild: str,
        **kwargs
    ):
        """
            Adds or updates a persona.
        """
        if not persona_id:
            abort(400, 'Missing ID.')

        return get_personas(guild).put_item(
            'schemas/put_persona.json',
            PERSONA_ID_REGEX,
            persona_id,
        )

    @perms_required
    def delete(
        self,
        persona_id: str,
        guild: str,
        **kwargs
    ):
        """
            Removes a persona.
        """
        if not persona_id:
            abort(400, 'Missing ID.')

        return get_personas(guild).remove_item(
            PERSONA_ID_REGEX,
            persona_id
        )