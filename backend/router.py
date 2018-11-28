import simplejson as json

from evept.routes.chars import list_chars as chars_list_chars
from evept.routes.esi import addchar as esi_addchar
from evept.serverless import response

def entrypoint(event, context):
    routes = {
        ("GET", "characters"): chars_list_chars,
        ("POST", "esi/addchar"): esi_addchar,
    }
    method = event['httpMethod']
    route = event['pathParameters']['route']
    print(f"evept::router: Attempting route for {method},{route}")

    # GET requests don't have bodies
    if event['body']:
        event['body'] = json.loads(event['body'])

    if (method, route) not in routes:
        return response({"status": 404, "message": "Route Not Found"}, 404)

    try:
        return routes[(method, route)](event, context)
    except Exception as ex:
        print(f"FAILED EXECUTION OF {method},{route}")
        print(ex)
