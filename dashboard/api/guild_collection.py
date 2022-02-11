from flask_restful import abort
from gremlin.db.lmdb import get, open_db, transact_get, transact_update
from typing import Any, Callable, Dict, NoReturn, Tuple, Union
import traceback
import re

from dashboard.api.logging import Logging
from dashboard.api.validation import verify_schema


class GuildCollection:

    def __init__(
        self,
        guild_id: str,
        collection_name: str
    ) -> None:
        self.guild_id = guild_id
        self.collection_name = collection_name
        self.logger = Logging.get_logger()

    def get_items(self):
        guild_data = get(self.guild_id)
        item_data = guild_data[self.collection_name] if self.collection_name in guild_data else {}
        return item_data, 200


    def put_item(
        self,
        item_schema_path: str,
        item_key_regex: str,
        item_key: str,
        afterValidation: Callable[[Dict[str, Any]], None] = None
    ) -> Union[Tuple, NoReturn]:
        """
            Add or updates an item in a guild's collections.
        """

        # Check if an actual key was passed.
        if not item_key:
            abort(400, message='Key must be specified.')

        keyMatch = re.match(item_key_regex, item_key, re.RegexFlag.IGNORECASE)
        if not keyMatch:
            abort(400, message='Invalid key.')

        # Grab content and check it for errors.
        item_content = verify_schema(item_schema_path)

        # Do some stuff.
        if afterValidation:
            try:
                afterValidation(item_content)
            except Exception:
                self.logger.error(
                    'Error after validation.\n' +
                    'Stacktrace:\n' + traceback.format_exc()
                )

        db = open_db()

        try:
            # Atomically update the db with the new item.
            with db.begin(write=True) as trnx:

                # Grab the data for the guild.
                guild_data = transact_get(trnx, self.guild_id)

                # Grab or make item collection, if it doesn't exist.
                item_data = guild_data[self.collection_name] if self.collection_name in guild_data else {}

                # Add or update item entry.
                item_data[item_key] = item_content
                guild_data[self.collection_name] = item_data

                # Update the data for the guild.
                transact_update(
                    trnx,
                    self.guild_id,
                    guild_data
                )

        except Exception:
            self.logger.error(
                'Item update error.'
                'Stacktrace:\n' + traceback.format_exc()
            )
            abort(500, message='Internal Error.')

        finally:
            db.close()

        return item_content, 201


    def remove_item(
        self,
        item_key_regex: str,
        item_key: str
    ) -> Union[Tuple, NoReturn]:
        """
            Removes an item in a guild's collections.
        """

        # Check if an actual key was passed.
        if not item_key:
            abort(400, message='Key must be specified.')

        keyMatch = re.match(item_key_regex, item_key, re.RegexFlag.IGNORECASE)
        if not keyMatch:
            abort(400, message='Invalid key.')

        db = open_db()

        try:
            # Atomically update the db.
            with db.begin(write=True) as trnx:

                # Grab the data for the guild.
                guild_data = transact_get(trnx, self.guild)

                # Check if the item collection exists.
                if self.item_name not in guild_data:
                    self.send_bad_request(f'No {self.item_name} to remove.')
                    return

                item_data = guild_data[self.item_name]

                # Remove the entry if it exists.
                if self.subpath in item_data:
                    del item_data[self.subpath]

                    guild_data[self.item_name] = item_data

                    # Update the data for the guild.
                    transact_update(
                        trnx,
                        self.guild,
                        guild_data
                    )

        except Exception:
            self.logger.error(
                'Item delete error.'
                'Stacktrace:\n' + traceback.format_exc()
            )
            abort(500, message='Internal Error.')

        finally:
            db.close()

        return 'Accepted', 201