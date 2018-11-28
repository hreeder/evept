import boto3
import os

def get_table():
    dynamo = boto3.resource('dynamodb')
    table_name = os.environ.get('DYNAMO_TABLE_NAME')
    table = dynamo.Table(table_name)

    return table
