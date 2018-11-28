import boto3
import os

from esipy import EsiApp, EsiClient, EsiSecurity
from pyswagger import App
from typing import Tuple

HEADERS = {
    "User-Agent": 'evePT - Sklullus Dromulus - github.com/hreeder - TweetFleetSlack @sklullus'
}
CALLBACK_URL = "http://localhost:3000/esi/callback"
SCOPES = [
    "esi-skills.read_skills.v1"
]

SECURITY = None
ESI_APP = None
APP = None
CLIENT = None

def get_secret(key):
    ssm = boto3.client('ssm')
    resp = ssm.get_parameter(
        Name=key,
        WithDecryption=True
    )

    return resp['Parameter']['Value']


def get_esi_client() -> Tuple[EsiSecurity, App, EsiClient]:
    global SECURITY
    global APP
    global ESI_APP
    global CLIENT

    clientID = get_secret(os.environ.get("ESI_CLIENTID"))
    secret = get_secret(os.environ.get("ESI_SECRET"))

    if not SECURITY:
        SECURITY = EsiSecurity(
            redirect_uri=CALLBACK_URL,
            client_id=clientID,
            secret_key=secret,
            headers=HEADERS
        )

    if not ESI_APP:
        ESI_APP = EsiApp(security=SECURITY)

    if not APP:
        APP = ESI_APP.get_latest_swagger

    if not CLIENT:
        client = EsiClient(
            retry_requests=True,
            headers=HEADERS,
            security=SECURITY
        )

    return SECURITY, APP, CLIENT
