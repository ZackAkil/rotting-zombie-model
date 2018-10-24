import json
import datetime
from flask import Response

# inport datastore client library
from google.cloud import datastore

# create new connection to datastore (will default connect to the one in the same project)
client = datastore.Client()


def submit_feedback(request):
    
    resp = Response()
    resp.headers.set('Content-Type','application/json')
    
    # get json data sent by user
    request_json = request.get_json()
    
    # create new datastore prediction-feedback record
    new_feedback = datastore.Entity(key=client.key('prediction-feedback'))

    # set record data using user sent data   
    new_feedback['model'] = request_json['model']
    new_feedback['input data'] = request_json['input data']
    new_feedback['prediction'] = request_json['prediction']
    new_feedback['was correct'] = request_json['was correct']
        
    # set time in record
    new_feedback['time'] = datetime.datetime.now()
    
    # save record
    client.put(new_feedback)
    
    # also send saved record back to user in json format as confirmation
    resp.response = json.dumps(new_feedback, default=str)
    return resp
