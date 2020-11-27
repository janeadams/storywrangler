port = '3000'
version = 'dev'

from orm.setup import *
from orm.data import *
import pandas as pd
import time
from flask import Flask, Response
from flask import request, abort, jsonify
import csv
import uuid
from flask_cors import CORS
import json
import uuid
import sys
import urllib


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'

# Return default HTML landing page if no query is provided

@app.route('/api/ngrams/', methods=['GET'])
def ngrams_response():
    return urllib.urlopen("static/ngrams.html").read()

@app.route('/api/zipf/', methods=['GET'])
def zipf_response():
    return urllib.urlopen("static/zipf.html").read()

@app.route('/api/divergence/', methods=['GET'])
def divergence_response():
    return urllib.urlopen("static/divergence.html").read()


# Get data using the ORM module and the Storywrangling package

@app.route('/api/ngrams/<query>', methods=['GET'])
def ngram_data(query):
    params = get_url_params(request.args, 'ngrams')
    return get_ngram_data(params)

@app.route('/api/zipf/<query>', methods=['GET'])
def zipf_data(query):
    params = get_url_params(request.args, 'zipf')
    return get_zipf_data(params)

@app.route('/api/divergence/<query>', methods=['GET'])
def divergence_data(query):
    params = get_url_params(request.args, 'divergence')
    return get_divergence_data(params)

@app.route('/api/potusometer/<query>', methods=['GET'])
def potusometer_data(query):
    params = get_url_params(request.args, 'potusometer')
    return get_potusometer_data(params)

if __name__ == '__main__':
    app.run(debug=True, port=port)

