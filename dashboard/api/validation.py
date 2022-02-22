from os import path
from typing import NoReturn, Union
from flask import request
from flask_restful import abort
from jsonschema.exceptions import ValidationError
from jsonschema.validators import validate
import json
import re


def verify_schema(
    schema_file: str
) -> Union[any, NoReturn]:
    """
        Check if the data is valid and return it.
    """

    # Attempt to get the request body as json.
    data = None
    try:
        data = request.get_json(force=True)
    except TypeError:
        abort(400, 'Malformed request body.')

    # Grab local path.
    apiDir = path.dirname(path.realpath(__file__))

    # Validate the schema of the request body first.
    with open(path.join(apiDir, schema_file), 'r') as file:
        put_schema = json.load(file)
        try:
            validate(
                instance=data,
                schema=put_schema
            )
        except ValidationError as e:
            abort(400, message=e.message)

    return data