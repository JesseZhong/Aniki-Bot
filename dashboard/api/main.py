#!/bin/python
from os import getenv
from dotenv import load_dotenv
from flask import Flask
from flask_restful import Api
from dashboard.api.authorization import RefreshAccess, RequestAccess, RequestAuthorization, RevokeAccess
from dashboard.api.emojis import Emojis
from dashboard.api.images import ImageUpload
from dashboard.api.guild import Guild, GuildLookup
from dashboard.api.metadata import Metadata
from dashboard.api.personas import Personas, Persona
from dashboard.api.reactions import Reaction, Reactions


load_dotenv()
SITE_URL = getenv('SITE_URL')

app = Flask(__name__)
api = Api(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization, Refresh, Guild, Code, Content-Type, State, Refresh, X-Requested-With'
    )
    response.headers.add(
        'Access-Control-Allow-Methods',
        'GET, PUT, DELETE, OPTIONS'
    )
    response.headers.add('Content-Type', 'application/json')
    return response


api.add_resource(RequestAuthorization, '/authorize')
api.add_resource(RequestAccess, '/access')
api.add_resource(RefreshAccess, '/refresh')
api.add_resource(RevokeAccess, '/revoke')

api.add_resource(GuildLookup, '/guild/lookup/<guild_name>')
api.add_resource(Guild, '/guild/<guild_id>')

api.add_resource(Reactions, '/reactions')
api.add_resource(Reaction, '/reactions/<reaction_id>')

api.add_resource(Personas, '/personas')
api.add_resource(Persona, '/personas/<persona_id>')

api.add_resource(Metadata, '/metadata')
api.add_resource(Emojis, '/emojis')
api.add_resource(ImageUpload, '/images/<image_key>')