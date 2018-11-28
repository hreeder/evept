import datetime
import os
import uuid

import boto3
import simplejson as json

from esipy import App, EsiClient, EsiSecurity
from evept.util.esi import get_esi_client

from evept.serverless import response
from evept.util.db import get_table

def addchar(evt, ctxt):
    sec, app, client = get_esi_client()
    tokens = sec.auth(evt['body']['code'])
    jwt = sec.verify()
    table = get_table()

    userid = evt['requestContext']['authorizer']['claims']['sub']
    username = evt['requestContext']['authorizer']['claims']['cognito:username']

    existing_doc = table.get_item(Key={
        'resourceType': f"evept:{username}_{userid}:character",
        'resourceIdentifier': jwt['sub'].split(":")[2]
    })

    if "Item" in existing_doc:
        doc = existing_doc['Item']
    else:
        doc = {
            "resourceType": f"evept:{username}_{userid}:character",
            "resourceIdentifier": jwt['sub'].split(":")[2],
            "characterName": jwt['name'],
            "characterId": jwt['sub'].split(":")[2]
        }
    
    doc['refresh_token'] = tokens['refresh_token']

    # Add this character to our update queue
    sqs = boto3.resource('sqs')
    queue_arn = os.environ.get('SQS_CHARACTER_UPDATER')
    queue = sqs.get_queue_by_name(QueueName=queue_arn.split(':')[-1])
    queue.send_message(MessageBody=json.dumps({
        "entries": [{
            "resourceType": doc['resourceType'],
            "resourceIdentifier": doc['resourceIdentifier']
        }]
    }))
    
    table.put_item(Item=doc)

    body = {
        "message": "I have been routed to evept.routes.esi.addchar",
        "input": evt
    }

    return response(body)
