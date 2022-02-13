from flask_restful import Resource, request, abort
from dashboard.api.authorization import perms_required
from bs4 import BeautifulSoup
import requests


class Metadata(Resource):

    @perms_required
    def post(self, **kwargs):
        """
            Gets the metatags from a webpage.
        """

        content = None
        try:
            content = request.get_json(force=True)
        except TypeError:
            abort(400, message='Malformed request body.')

        if 'url' not in content or not content['url']:
            abort(400, message='Missing URL.')

        # Request the page at the URL, impersonating a simple bot.
        response = requests.get(
            content['url'].format(1),
            headers={'User-Agent': 'Mozilla/5.0'}
        )

        # Check if the request succeeded.
        if not response.ok:
            abort(400, message='Unreachable URL.')

        # Parse the page and get all the meta tags.
        soup = BeautifulSoup(response.text, features='html.parser')
        metas = soup.find_all('meta', {'property': True, 'content': True})

        # Filter only the meta tags that have content.
        metadata = {
            meta.attrs['property']: meta.attrs['content']
            for meta in metas
        }

        return metadata, 200