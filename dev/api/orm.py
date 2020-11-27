port = '3000'
version = 'dev'

import pandas as pd
import time
import datetime as dt
import os
import pickle
from storywrangling import Storywrangler
storywrangler = Storywrangler()
from flask import Flask, Response
from flask import request, abort, jsonify
import csv
import uuid
from flask_cors import CORS
import json
import uuid
import sys
from urllib.parse import urlparse, quote, unquote, quote_plus
import numpy as np

def load_resources():
    package_directory = os.path.dirname(os.path.abspath(__file__))
    resources = {}
    with open(os.path.join(package_directory, 'resources', 'ngrams.bin'), "rb") as f:
        resources['regex'] = pickle.load(f)
    resources['language_codes'] = pd.read_csv(os.path.join(package_directory,'resources','popular_language_codes.csv'))
    resources['language_name_lookup'] = resources['language_codes'].set_index('db_code').filter(['language']).to_dict()['language']
    with open(os.path.join(package_directory, 'resources', 'language_support.json'), 'r') as f:
        resources['language_support'] = json.load(f)
    resources['dropdown_language_options'] = resources['language_codes'].set_index('language').filter(['db_code']).reset_index().rename(columns={'language':'label','db_code':'value'}).to_dict(orient='records')
    resources['today_ngram_adjusted'] = dt.datetime.today() - dt.timedelta(days=2)
    resources['today_div_adjusted'] = dt.datetime(2019, 5, 1, 0, 0)
    with open(os.path.join(package_directory, 'resources', 'page_defaults.json'), 'r') as f:
        resources['page_defaults'] = json.load(f)
        for page in ['divergence','zipf']:
            resources['page_defaults'][page]['date'] = resources['today_div_adjusted']
    with open(os.path.join(package_directory, 'resources', 'page_options.json'), 'r') as f:
        resources['page_options'] = json.load(f)
        for page in ['ngrams','zipf']:
            resources['page_options'][page]['language'] = list(resources['language_codes']['db_code'])
    with open(os.path.join(package_directory, 'resources', 'page_config.json'), 'r') as f:
        resources['page_config'] = json.load(f)
    return resources

resources = load_resources()

def check_language_support(language,ngrams):
    # Returns the requested number, if supported, or the max number, if requested is not supported
    if language in resources['language_support'][str(ngrams)+'grams']:
        print(f'We DO have language support for {language} {ngrams}grams')
        return ngrams
    else:
        max_support = resources['language_support'][resources['language_support']['db_code']==language]['support'].values[0]
        print(f'We dont have language support for {language} {ngrams}grams; we do have support for {language} {max_support}grams')
        return int(max_support)

def get_today_languages():
    params = {
        'date': resources['today_div_adjusted'],
        'rt': False,
        'scale': 'log',
        'n': 1,
        'language': 'en',
        'viewer': 'divergence'
    }
    data = get_divergence_data(params)
    return build_response(params,data)

def get_today_suggestions():
    params = {
        'date': resources['today_div_adjusted'],
        'rt': False,
        'scale': 'log',
        'n': 1,
        'language': 'en',
        'viewer': 'divergence'
    }
    data = get_divergence_data(params)
    return list(data.index)[:30]

def type_out(v, t):
    if t == "bool":
        return bool(v)
    elif t == "string":
        return str(v)
    elif t == "int":
        return int(v)
    elif t == "array":
        parsed = []
        values = v.split(',') # split on the comma
        for value in values: # for each item in the list
            if value != '': # so long as it's not nothing
                parsed.append(value.strip()) # remove any leading/trailing whitespace and add to the array
        return parsed # return the new parsed array
    else:
        return v

def get_url_params(url,viewer):
    params = {}
    defaults = resources['page_defaults'][viewer]
    options = resources['page_options'][viewer]
    types = resources['page_option_types'][viewer]
    for p in defaults.keys():
        p_type = types[p] # Get the type (string, bool, array, int) of this parameter
        try:
            value = url.get(p) # Try to get the parameter from the request.args part of the URL
            if p in options.keys(): # If there are restricted options for this parameter
                if value not in options[p]: # If the value isn't one of the restricted options for this parameter
                    params[p] = defaults[p] # Set to the default value
                else:
                    params[p] = type_out(value, p_type) # Set to the value specified in the URL
            else: # If there are no restricted options for this parameter
                params[p] = type_out(value, p_type) # Set to the value specified in the URL
        except: # If the parameter listed in default keys wasn't specified in the URL
            params[p] = defaults[p] # Set the parameter to the default value
    params['viewer'] = viewer
    print(params)
    return params

def freq_to_odds(freq):
    try: return 1.0/freq
    except: return None

def build_response(params,data):
    if params['response'] == "csv":
        return data.to_csv()
    elif params['response'] == "tsv":
        return data.to_csv(sep="\t")
    else: # Default to json
        response = {}
        response['metadata'] = params
        response['data'] = data.to_dict()
        return jsonify(response)

def get_ngram_data(params):
    print(f"Getting ngram data for {params['ngram']} in {params['language']}")
    ngram_df = storywrangler.get_ngram(
      params['ngram'],
      lang=params['language']
    )
    ngram_df['odds']=[freq_to_odds(f) for f in ngram_df['freq']]
    ngram_df['odds_no_rt']=[freq_to_odds(f) for f in ngram_df['freq_no_rt']]
    return build_response(params,ngram_df)

def get_language_data(params):
    print(f"Getting language data for {params['language']}")
    lang_df = storywrangler.get_lang(params['language'])
    lang_df['odds']=[freq_to_odds(f) for f in lang_df['freq']]
    lang_df['odds_no_rt']=[freq_to_odds(f) for f in lang_df['freq_no_rt']]
    return build_response(params,lang_df)

def get_zipf_data(params):
    if params['rt']:
        change_param = 'rank_change'
    else:
        change_param = 'rank_change_noRT'
    params['n'] = check_language_support(params['language'],params['n'])
    zipf_df = storywrangler.get_zipf_dist(params['date'], params['language'], str(params['n'])+'grams', max_rank=100)
    zipf_df = zipf_df[zipf_df[change_param] > 0]
    zipf_df = zipf_df.sort_values(by=[change_param])
    return build_response(params,zipf_df)

def get_divergence_data(params):
    if params['rt']:
        change_param = 'rank_change'
    else:
        change_param = 'rank_change_noRT'
    div_df = storywrangler.get_divergence(params['date'], params['language'],  str(params['n'])+'grams', max_rank=100)
    div_df = div_df[div_df[change_param] > 0]
    div_df = div_df.sort_values(by=[change_param])
    return build_response(params,div_df)


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

@app.route('/api/resources/', methods=['GET'])
def resources_response():
    return jsonify(resources)


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

