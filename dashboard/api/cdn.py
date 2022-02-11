from datetime import timedelta, datetime
from os import getenv
from dotenv import load_dotenv
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding
from botocore.signers import CloudFrontSigner
from urllib.parse import quote_plus


load_dotenv()
KEY_ID = getenv('KEY_ID')
KEY_LOCATION = getenv('KEY_LOCATION')
CDN_URL = getenv('CDN_URL')


def encode_object_key(
    key: str
):
    """
        Encodes a S3 object so it is safe to use in URLs.
    """
    return quote_plus(key, safe='/')


def rsa_signer(
    message: str
):
    """
        Sign a string with with a cert.
    """
    with open(KEY_LOCATION, 'rb') as key_file:

        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )

    return private_key.sign(
        message,
        padding.PKCS1v15(),
        hashes.SHA1()
    )


def sign_url(
    url: str,
    duration: timedelta
):
    """
        Sign CloudFront resource and set an expiration date.
    """
    expire_date = datetime.now() + duration
    cloudfront_signer = CloudFrontSigner(
        KEY_ID,
        rsa_signer
    )

    # Sign the url.
    signed_url = cloudfront_signer.generate_presigned_url(
        url,
        date_less_than=expire_date
    )

    return signed_url


def gen_url(
    key: str
):
    """
        Generate a url for a CDN object based of its S3 key.
    """
    encoded_key = encode_object_key(key)
    return f'{CDN_URL}/{encoded_key}'


def gen_cdn_url(
    key: str,
    duration: timedelta
):
    """
        Encode key, append to CDN domain to form url,
        and sign the url along with an expiration date.
    """
    url = gen_url(key)
    return sign_url(
        url,
        duration
    )


def gen_image_url(
    image_key: str
):
    """
        Creates a URL to an image.
    """
    return f'{CDN_URL}/images/{encode_object_key(image_key)}'