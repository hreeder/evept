import simplejson as json


def response(body, status_code=200, headers={}):
    _headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True
    }

    # In this order so that if headers as an arg overrides the above,
    # we can use the supplied values rather than the defaults
    _headers.update(headers)

    _response = {
        "statusCode": 200,
        "headers": _headers,
        "body": json.dumps(body)
    }

    return _response
