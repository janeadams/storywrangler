port = '3000'
version = 'dev'

import pandas as pd
import time
import datetime as dt
import os
import pickle
from storywrangling import Storywrangler, Realtime
from storywrangling.regexr import nparser
from flask import Flask, Response, make_response, request, jsonify
import csv
import uuid
from flask_cors import CORS
import json
import uuid
import sys
from urllib.request import urlopen
from urllib.parse import urlparse, quote, unquote, quote_plus
import numpy as np

dir = os.path.dirname(__file__)

today_ngram_adjusted = dt.datetime.today() - dt.timedelta(days=2)
today_div_adjusted = dt.datetime(2019, 5, 1, 0, 0)

language_codes = pd.read_csv(os.path.join(dir, 'orm_resources','popular_language_codes.csv'))
language_name_lookup = language_codes.set_index('db_code').filter(['language']).to_dict()['language']
language_code_lookup = language_codes.set_index('language').filter(['db_code']).to_dict()['db_code']

language_support = {}
with open(os.path.join(dir, 'orm_resources', 'language_support.json'), 'r') as f:
    language_support = json.load(f)

all_defaults = {}
with open(os.path.join(dir, 'orm_resources', 'page_defaults.json'), 'r') as f:
    all_defaults = json.load(f)
    for page in ['zipf','divergence']:
        all_defaults[page]['query'] = today_div_adjusted

all_options = {}
with open(os.path.join(dir, 'orm_resources', 'page_options.json'), 'r') as f:
    all_options = json.load(f)
    for page in ['languages']:
        all_options[page]['query'] = list(language_codes['db_code'])
    for page in ['ngrams']:
        all_options[page]['language'] = list(language_codes['db_code'])
        
all_option_types = {}
with open(os.path.join(dir, 'orm_resources', 'page_option_types.json'), 'r') as f:
    all_option_types = json.load(f)

def check_language_support(language,ngrams):
    # Returns the requested number, if supported, or the max number, if requested is not supported
    if language in language_support[str(ngrams)+'grams']:
        print(f'We DO have language support for {language} {ngrams}grams')
        return ngrams
    else:
        max_support = language_support[language_codes['db_code']==language]['support'].values[0]
        print(f'We dont have language support for {language} {ngrams}grams; we do have support for {language} {max_support}grams')
        return int(max_support)

def get_today_languages():
    params = {
        'date': today_div_adjusted,
        'rt': False,
        'n': 1,
        'language': 'en',
        'viewer': 'divergence'
    }
    data = get_divergence_data(params)
    return build_response(params,data)

def get_today_suggestions():
    params = {
        'date': today_div_adjusted,
        'rt': False,
        'n': 1,
        'language': 'en',
        'viewer': 'divergence'
    }
    data = get_divergence_data(params)
    return list(data.index)[:30]

def type_out(v, t):
    if t == "bool":
        return (v.lower() in ['true',True])
    elif t == "string":
        return str(v)
    elif t == "int":
        return int(v)
    elif t == "list":
        return get_list(v)
    elif t == "date":
        try:
            return datetime.datetime.strptime(v, '%Y-%m-%d')
        except:
            return today_div_adjusted
    else:
        return v

def get_url_params(url,viewer):
    print('Getting URL params...')
    print(dict(request.args))
    params = {}
    defaults = all_defaults[viewer]
    print('Default params:')
    print(defaults)
    options = all_options[viewer]
    #print('Param options:')
    #print(options)
    types = all_option_types[viewer]
    #print('Param expected types:')
    #print(types)
    for p in defaults.keys():
        p_type = types[p] # Get the type (string, bool, array, int) of this parameter
        try:
            value = url.get(p) # Try to get the parameter from the request.args part of the URL
            formatted_value = type_out(value, p_type)
            if p in options.keys(): # If there are restricted options for this parameter
                if formatted_value not in options[p]: # If the value isn't one of the restricted options for this parameter
                    params[p] = defaults[p] # Set to the default value
                else:
                    params[p] = formatted_value # Set to the value specified in the URL
            else: # If there are no restricted options for this parameter
                params[p] = formatted_value # Set to the value specified in the URL
        except: # If the parameter listed in default keys wasn't specified in the URL
            params[p] = defaults[p] # Set the parameter to the default value
    params['viewer'] = viewer
    if (params['collection'] == 'realtime') & (params['viewer'] == 'zipf'):
        params['n'] = 1
    print('Params:')
    print(params)
    return params

def freq_to_odds(freq):
    try: return 1.0/freq
    except: return None
    
def get_list(query):
    parsed_list = [q.strip() for q in query.split(',') if (q.strip() != '')]
    print(f'Parsed query {query} into list {parsed_list}')
    return parsed_list

def get_1grams_list(query, language):
    parsed_list = [q.strip() for q in query.split(',') if (q.strip() != '')]
    print(f'Parsed query {query} into list {parsed_list}')
    new_list = []
    for q in parsed_list:
        ngrams = list(nparser(q, Storywrangler.parser, n=1).keys())
        res = []
        [res.append(x) for x in ngrams if x not in res]
        ngrams = res
        print(f'Adding {ngrams} to new list')
        for n in ngrams:
            new_list.append(n)
            print(f'New list: {new_list}')
    print(f'Original query: {query} | Language: {language} | New list: {new_list}')
    return list(set(new_list))
    

def get_ngrams_list(query, language, api):
    parsed_list = [q.strip() for q in query.split(',') if (q.strip() != '')]
    print(f'Parsed query {query} into list {parsed_list}')
    new_list = []
    for q in parsed_list:
        print(f'Getting ngrams for "{q}" in {language}')
        ngrams = list(nparser(q, api.parser))
        number = len(ngrams)
        if number==3:
            print(f'{q} is a 3gram')
            if language in language_support['3grams']:
                print(f'{language} supports 3grams')
                ngrams = [list(nparser(q, api.parser, n=3).keys())[0]]
                for n in ngrams:
                    new_list.append(n)
                    print(f'New list: {new_list}')
            else:
                print(f'{language} does not support 3grams')
                number=1
                ngrams = list(nparser(q, api.parser, n=1).keys())
                res = []
                [res.append(x) for x in ngrams if x not in res]
                ngrams = res
                print(f'Adding {ngrams} to new list')
                for n in ngrams:
                    new_list = new_list.append(n)
        elif number==2:
            print(f'{q} is a 2gram')
            if language in language_support['2grams']:
                print(f'{language} supports 2grams')
                ngrams = [list(nparser(q, api.parser, n=2).keys())[0]]
                print(f'Adding {ngrams} to new list')
                for n in ngrams:
                    new_list.append(n)
                    print(f'New list: {new_list}')
            else:
                print(f'{language} does not support 2grams')
                number=1
                ngrams = list(nparser(q, api.parser, n=1).keys())
                res = []
                [res.append(x) for x in ngrams if x not in res]
                ngrams = res
                print(f'Adding {ngrams} to new list')
                for n in ngrams:
                    new_list.append(n)
                    print(f'New list: {new_list}')
        else:
            print(f'{q} is not a 3gram or 2gram')
            number=1
            ngrams = list(nparser(q, api.parser, n=1).keys())
            res = []
            [res.append(x) for x in ngrams if x not in res]
            ngrams = res
            print(f'Adding {ngrams} to new list')
            for n in ngrams:
                new_list.append(n)
                print(f'New list: {new_list}')
    print(f'Original query: {query} | Language: {language} | New list: {new_list}')
    return list(set(new_list))

def get_language_list(query):
    print(f'Getting language list; query is {query}')
    parsed_list = [q.strip().lower() for q in query.split(',') if (q.strip() != '')]
    print(f'Parsed list: {parsed_list}')
    new_list = []
    for q in parsed_list:
        if q in list(language_name_lookup.keys()):
            print(f'{q} is a valid language')
            new_list.append(q)
            print(f'Added {q} to {new_list}')
        elif q.title() in list(language_code_lookup.keys()):
            # If language specified is in plain writing (not a language code)
            print(f'{q.title()} is a valid language name')
            # Convert to db language code
            new_list.append(language_code_lookup[q.title()])
            print(f'Added {q.title()} to {new_list}')
    return new_list
    

def get_ngram_data(params, api):
    print(f"Getting ngram data for {params['query']} in {params['language']}")
    df_obj = {}
    try:
        for ngram in params['query']:
            ngram_df = api.get_ngram(
              ngram,
              lang=params['language']
            )
            #ngram_df['date'] = [d.date().strftime("%Y-%m-%d") for d in ngram_df['date']]
            try:
                ngram_df['odds']=[freq_to_odds(f) for f in ngram_df['freq']]
            except:
              print("Error converting odds to frequency")
            try:
                ngram_df['odds_no_rt']=[freq_to_odds(f) for f in ngram_df['freq_no_rt']]
            except:
              print("Error converting odds (no RT) to frequency (no RT)")
            ngram_df.index = ngram_df.index.strftime('%Y-%m-%d')
            df_obj[ngram] = ngram_df.dropna()
        print(f'Building response for params {params}')
        if params['response'] == "csv":
            keyed_dfs = {}
            for ngram, df in df_obj.items():
              df['ngram'] = ngram
              keyed_dfs[ngram] = df
            combined_df = pd.concat(keyed_dfs.values())
            response = make_response(combined_df.to_csv(), 200) # 200 Status Code 'OK'
            response.headers["Content-Disposition"] = f'attachment; filename={"_".join([str(n).replace(" ","-") for n in params["query"]])}.csv'
            response.headers["Content-Type"] = "text/csv"
            return response
        else: # Default to json
            content = {}
            content['metadata'] = params
            dict_obj = {}
            for ngram in df_obj.keys():
              dict_obj[ngram] = {}
              dict_obj[ngram]['date'] = list(df_obj[ngram].index)
              for col in list(df_obj[ngram].columns):
                  dict_obj[ngram][col] = list(df_obj[ngram][col])
            content['data'] = dict_obj
            response = make_response(jsonify(content), 200) # 200 Status Code 'OK'
            response.headers["Content-Type"] = "application/json"
            return response
    except:
        response = make_response(jsonify({"message": "Database error"}),401) # 200 Status Code 'OK'
        response.headers["Content-Type"] = "application/json"
        return response

def get_language_data(params, api):
    print(f"Getting language data for {params['languages']}")
    df_obj = {}
    for language in params['query']:
        lang_df = api.get_lang(language)
        try:
            lang_df['odds']=[freq_to_odds(f) for f in lang_df['freq']]
        except:
            print("Error converting odds to frequency")
        try:
            lang_df['odds_no_rt']=[freq_to_odds(f) for f in lang_df['freq_no_rt']]
        except:
            print("Error converting no RT odds to frequency")
        #print(f'{language} dtypes are {lang_df.dtypes}')
        lang_df.index = lang_df.index.strftime('%Y-%m-%d')
        df_obj[language] = lang_df.dropna()
    print(f'Building response for params {params}')
    if params['response'] == "csv":
        keyed_dfs = {}
        for language, df in df_obj.items():
          df['language'] = language
          keyed_dfs[language] = df
        combined_df = pd.concat(keyed_dfs.values())
        resp = make_response(combined_df.to_csv(encoding="utf-8"))
        resp.headers["Content-Disposition"] = f'attachment; filename={"_".join([str(n).replace(" ","-") for n in params["query"]])}.csv'
        resp.headers["Content-Type"] = "text/csv"
        return resp
    else: # Default to json
        response = {}
        response['metadata'] = params
        dict_obj = {}
        for ngram in df_obj.keys():
          dict_obj[language] = df_obj[language].to_dict()
        response['data'] = dict_obj
        return jsonify(response)

def get_zipf_data(params, api):
    params['n'] = check_language_support(params['language'],params['n'])
    zipf_df = api.get_zipf_dist(params['query'], params['language'], str(params['n'])+'grams', max_rank=params['max'], rt=params['rt'])
    if params['rt']:
        change_param = 'rank'
    else:
        change_param = 'rank_no_rt'
    zipf_df = zipf_df.sort_values(by=[change_param])
    if params['response'] == "csv":
        resp = make_response(zipf_df.to_csv(encoding="utf-8-sig"))
        resp.headers["Content-Disposition"] = f'attachment; filename={"zipf_"+params["query"].date().strftime("%Y-%m-%d")}.csv'
        resp.headers["Content-Type"] = "text/csv"
        return resp
    else: # Default to json
        response = {}
        response['metadata'] = params
        response['metadata']['query'] = response['metadata']['query'].date().strftime("%Y-%m-%d")
        response['data'] = zipf_df.to_dict()
        return jsonify(response)

def get_divergence_data(params, api):
    div_df = api.get_divergence(params['query'], params['language'],  str(params['n'])+'grams', max_rank=params['max'], rt=params['rt'])
    if params['rt']:
        change_param = 'rank_change'
    else:
        change_param = 'rank_change_no_rt'
    div_df = div_df.sort_values(by=[change_param], ascending=False)
    div_df['time_1'] = [d.date().strftime("%Y-%m-%d") for d in div_df['time_1']]
    div_df['time_2'] = [d.date().strftime("%Y-%m-%d") for d in div_df['time_2']]
    print(div_df.head(10))
    if params['response'] == "csv":
        resp = make_response(div_df.to_csv(encoding="utf-8-sig"))
        resp.headers["Content-Disposition"] = f'attachment; filename={"div_"+params["query"].date().strftime("%Y-%m-%d")}.csv'
        resp.headers["Content-Type"] = "text/csv"
        return resp
    else: # Default to json
        response = {}
        response['metadata'] = params
        response['metadata']['query'] = response['metadata']['query'].date().strftime("%Y-%m-%d")
        response['data'] = div_df.to_dict()
        return jsonify(response)


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JSON_AS_ASCII'] = False

# Return default HTML landing page if no query is provided

@app.route('/api/ngrams/', methods=['GET'])
def ngrams_response():
    return urlopen("file://" + os.path.expanduser('~') + "/dev/api/static/ngrams.html").read()
          
@app.route('/api/languages/', methods=['GET'])
def languages_response():
    return urlopen("file://" + os.path.expanduser('~') + "/dev/api/static/languages.html").read()

@app.route('/api/zipf/', methods=['GET'])
def zipf_response():
    return urlopen("file://" + os.path.expanduser('~') + "/dev/api/static/zipf.html").read()

@app.route('/api/divergence/', methods=['GET'])
def divergence_response():
    return urlopen("file://" + os.path.expanduser('~') + "/dev/api/static/divergence.html").read()


# Get data using the ORM module and the Storywrangling package

@app.route('/api/ngrams/<query>', methods=['GET'])
def ngram_data(query):
    print(f'Received ngram query {query} and request args {dict(request.args)}')
    params = get_url_params(request.args, 'ngrams')
    if params['collection']=='realtime':
        api = Realtime()
        if query is not None:
            ngrams_list = get_1grams_list(query)
    else:
        api = Storywrangler()
        if query is not None:
            ngrams_list = get_ngrams_list(query, params['language'], api)
    if ngrams_list is not None:
        params['query'] = ngrams_list
    return get_ngram_data(params, api)
          
@app.route('/api/languages/<query>', methods=['GET'])
def languages_data(query):
    api = Storywrangler()
    params = get_url_params(request.args, 'languages')
    if query is not None:
        language_list = get_language_list(query)
        if language_list is not None:
            params['query'] = language_list
    return get_language_data(params, api)

@app.route('/api/zipf/<query>', methods=['GET'])
def zipf_data(query):
    api = Storywrangler()
    params = get_url_params(request.args, 'zipf')
    if query is not None:
        try:
            params['query'] = dt.datetime.strptime(query, '%Y-%m-%d')
        except:
            print(f'{query} is not a valid date in the time format YYYY-MM-DD')
            print(f'Query is default {params["query"]}')
    return get_zipf_data(params, api)

@app.route('/api/divergence/<query>', methods=['GET'])
def divergence_data(query):
    api = Storywrangler()
    params = get_url_params(request.args, 'divergence')
    if query is not None:
        try:
            params['query'] = dt.datetime.strptime(query, '%Y-%m-%d')
        except:
            print(f'{query} is not a valid date in the time format YYYY-MM-DD')
            print(f'Query is default {params["query"]}')
    return get_divergence_data(params, api)

if __name__ == '__main__':
    app.run(debug=True, port=port)

