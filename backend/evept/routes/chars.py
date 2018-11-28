from boto3.dynamodb.conditions import Key
from evept.serverless import response
from evept.util.db import get_table

def list_chars(evt, ctxt):
    table = get_table()

    userid = evt['requestContext']['authorizer']['claims']['sub']
    username = evt['requestContext']['authorizer']['claims']['cognito:username']

    characters_response = table.query(
        KeyConditionExpression=Key('resourceType').eq(f"evept:{username}_{userid}:character")
    )
    items = characters_response['Items'] or []

    for item in items:
        del item['refresh_token']
        del item['resourceType']

    return response({
        "characters": items
    })
