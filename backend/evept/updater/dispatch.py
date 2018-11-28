import boto3
import json
import os

from itertools import zip_longest

from evept.util.db import get_table

def dispatch_hourly(evt, ctxt):
    print("dispatch_hourly starting")
    dispatch_character_updates(evt, ctxt)
    print("dispatch_hourley complete")


def dispatch_character_updates(evt, ctxt):
    sqs = boto3.resource('sqs')
    queue_arn = os.environ.get('SQS_CHARACTER_UPDATER')
    queue = sqs.get_queue_by_name(QueueName=queue_arn.split(':')[-1])

    table = get_table()
    characters = table.scan()['Items']
    to_send = []
    for character in characters:
        if not character['resourceType'].endswith(':character'):
            # we store different things in our database table, check that this is the character
            continue

        to_send.append({
            "resourceType": character['resourceType'],
            "resourceIdentifier": character['resourceIdentifier']
        })

    for batch in zip_longest(*[iter(to_send)] * 15):
        entries = list(filter(lambda x: x, batch))
        queue.send_message(MessageBody=json.dumps({
            "entries": entries
        }))
