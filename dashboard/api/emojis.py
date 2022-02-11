from os import getenv
from dotenv import load_dotenv
from flask_restful import Resource, abort
from dashboard.api.logging import Logging
import requests
import json

load_dotenv()
DISCORD_API = getenv('DISCORD_API', 'https://discord.com/api')
DISCORD_TOKEN = getenv('DISCORD_TOKEN')


class Emojis(Resource):

    def get(
        self,
        token: str
    ):
        """
            Get emoji's available to a user through the bot.
        """

        # Get user's guilds.
        userGuildsRes = requests.get(
            f'{DISCORD_API}/users/@me/guilds',
            headers={
                'Authorization': f'Bearer {token}'
            }
        )

        if not userGuildsRes.ok:
            abort(400, message='User guild problem.')
            return

        # Get the bot's guilds.
        botGuildsRes = requests.get(
            f'{self.DISCORD_API}/users/@me/guilds',
            headers={
                'Authorization': f'Bot {DISCORD_TOKEN}'
            }
        )

        if not botGuildsRes.ok:
            abort(500, message='Bot info problem.')

        # Get the intersection (guilds in common) for the user and the bot.
        userGuilds = json.loads(userGuildsRes.content)
        userGuildIds = {g['id'] for g in userGuilds}
        botGuildIds = {g['id'] for g in json.loads(botGuildsRes.content)}
        guildIdsInCommon = userGuildIds & botGuildIds

        # Grab the emojis that the user and the bot share.
        # In other words, get the emojis that the bot has permission to see.
        try:
            emojis = {}
            for id in guildIdsInCommon:
                guild = next((g for g in userGuilds if g['id'] == id), None)

                if guild:
                    emojiRes = requests.get(
                        f'{self.DISCORD_API}/guilds/{id}/emojis',
                        headers={
                            'Authorization': f'Bot {self.DISCORD_TOKEN}'
                        }
                    )

                    if emojiRes.ok:
                        
                        guildEmojis = json.loads(emojiRes.content)

                        if guildEmojis and len(guildEmojis) > 0:
                            emojis[id] = {
                                'id': id,
                                'name': guild['name'],
                                'icon': guild['icon'],
                                'emojis': guildEmojis
                            }

            return emojis, 200

        except Exception as e:
            Logging.get_logger().error(e)
            abort(500, message='Emoji Error.')