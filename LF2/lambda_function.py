import json
import boto3
import requests
from requests_aws4auth import AWS4Auth

def push_to_lex(query):
    #added old comment 1 for checking
    lex = boto3.client('lex-runtime')
    print("lex client initialized")

    response = lex.post_text(
        botName = 'photosBot',
        botAlias = 'photosBotAlias',
        userId = 'id',
        inputText = query
        )
    labels = []
    if 'slots' not in response:
        print("No photo collection for query {}".format(query))
    else:
        print ("slot: ",response['slots'])
        slot_val = response['slots']
        for key,value in slot_val.items():
            if value!=None:
                labels.append(value)
    return labels


def search_elastic_search(labels):
    print("Inside elastic search")
    region = 'us-east-1'
    service = 'es'
    credentials = boto3.Session().get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
    url = 'https://search-photos-vgwy7lm3x32a3n72oxallgjfta.us-east-1.es.amazonaws.com/photos/_search?q='
    resp = []
    for label in labels:
        if (label is not None) and label != '':
            url2 = url + label
            resp.append(requests.get(url2, auth = awsauth).json())
    print ('elastic response: ', resp)
    output = []
    for r in resp:
        if 'hits' in r:
             for val in r['hits']['hits']:
                key = val['_source']['objectKey']
                if key not in output:
                    output.append("https://img-db-00x.s3.amazonaws.com/"+key)
    print('output: ', output)
    return output


def lambda_handler(event, context):
    # TODO implement
    print('event: ', event)
    q = event['queryStringParameters']['q']
    print('query: ', q)
    lex = boto3.client('lex-runtime')
    print("lex client initialized")
    labels = push_to_lex(q)
    print("labels: ", labels)
    img_paths = {}
    if len(labels) != 0:
        img_paths = search_elastic_search(labels)
        img_paths = list(set(img_paths))        
    if not img_paths:
        return{
            'statusCode':404,
            'headers':{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"*","Access-Control-Allow-Headers":"*"},
            'body': json.dumps('No Results found')
        }
    else:
        print(img_paths)
        return{
            'statusCode': 200,
            'headers':{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"*","Access-Control-Allow-Headers":"*"},
            'body': json.dumps(img_paths)
        }
