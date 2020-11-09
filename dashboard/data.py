from storywrangling import Storywrangler
storywrangler = Storywrangler()

from dashboard.setup import *

import pandas as pd
import datetime as dt
from urllib.parse import urlparse, quote, unquote, quote_plus
import numpy as np

def print_resources():
    return print(resources)
    
def check_language_support(language,ngrams):
    # Returns the requested number, if supported, or the max number, if requested is not supported
    if language in resources['language_support'][str(ngrams)+'grams']:
        print(f'We DO have language support for {language} {ngrams}grams')
        return ngrams
    else:
        max_support = resources['language_support'][resources['language_support']['db_code']==language]['support'].values[0]
        print(f'We dont have language support for {language} {ngrams}grams; we do have support for {language} {max_support}grams')
        return int(max_support)
    
def get_state_params(ids, values):
    params = {}
    id_list = []
    for d in ids:
        id_list.append(d['index'])
    print(f'State ID list: {id_list}')
    print(f'State values: {values}')
    states = dict(zip(id_list,values))
    print(f'States: {states}')
    params['viewer'] = states['viewer']
    defaults = resources['page_defaults'][params['viewer']]
    print(f"Defaults for {params['viewer']} are {defaults}")
    for key in states.keys():
        if key in defaults.keys():
            if key == 'ngrams':
                parsed = []
                values = states[key].split(',')
                for v in values:
                    if v != '':
                        parsed.append(v.strip())
                params[key] = parsed
            else:
                params[key] = states[key]
    for key in defaults.keys():
        if key not in params.keys():
            print(f"{key} was not listed in params for {params['viewer']}; setting {key} to default: {defaults[key]}")
            params[key] = defaults[key]
    print(f'Got params from states: {params}')
    return params

def get_url_params(url):
    print(f'Getting params from URL: {url}')
    params = {}
    try:
        viewer = urlparse(url).path.replace('/','')
        if viewer not in resources['page_defaults'].keys(): viewer = 'ngrams'
    except:
        print(f'urlpath is {urlparse(url).path}')
    queries = urlparse(url).query.split('&')
    for query in queries:
        query_pair = query.split('=')
        key = query_pair[0]
        if key == 'viewer':
            if query_pair[1] in resources['page_defaults'].keys():
                viewer = query_pair[1]
            else:
                viewer = 'ngrams'
    defaults = resources['page_defaults'][viewer]
    options = resources['page_options'][viewer]
    if queries in [[""],"",[],None]:
        print("QUERIES ARE EMPTY")
    else:
        for query in queries:
            query_pair = query.split('=')
            key = query_pair[0]
            if key in ['ngrams','languages']:
                if query_pair[1] in [None,'',np.nan]:
                    value = defaults['ngrams']
                else:
                    value = query_pair[1].split(',')
                    if key == 'ngrams':
                        parsed = []
                        for v in value:
                            if v != '':
                                parsed.append(unquote(v))
                        value = parsed
                    if key == 'languages':
                        print(f"key = {key} value={value}")
                        in_options = []
                        for v in value:
                            v = v.strip().lower()
                            if v in list(resources['language_codes']['db_code']):
                                print(f"{v} is a valid language option")
                                in_options.append(v)
                                print(f"in_options = {in_options}")
                        if len(in_options)>0:
                            print(f"len(in_options) = {len(in_options)}")
                            value = in_options
                        else:
                            value = defaults['languages']
            elif (key in ['n','max_rank']):
                try:
                    value = int(value)
                except:
                    value = defaults[key]
            else:
                value = query_pair[1]
                if key in ['date']:
                    value = dt.datetime.strptime(value, '%Y-%m-%d')
                if key in ['rt','plots']:
                    value = ((value == 'true') | (value == 'True'))
                if (key == 'metric') & (value=='freq'):
                    value = 'odds'
                if key in options.keys():
                    print(f'{key} in options')
                    if value not in options[key]:
                        print(f'{value} not in options for {key}: {options[key]}')
                        value=defaults[key]
                        print(f'Setting {key} value to default value: {value}')
            if key != "viewer":
                params[key] = value
    for k in defaults.keys():
        if k not in params.keys():
            params[k]=defaults[k]
    for k in params.keys():
        if (type(params[k]) != list):
            if (k in options.keys()) and (params[k] not in options[k]):
                params[k] = defaults[k]
    params['viewer']=viewer
    return params

def build_url(params):
    print(f'Building URL for {params}')
    url = "\?"
    param_strings=[]
    for key in params.keys():
        if type(params[key]) == list:
            url_val = ','.join([quote(str(v)) for v in params[key]])
        else:
            url_val = quote(str(params[key]))
        param_strings.append(f'{key}={url_val}')
    url = url + '&'.join(param_strings)
    print(f'New URL is {url}')
    return url
    

def freq_to_odds(freq):
    try: return 1.0/freq
    except: return None
    
def get_ngram_data(params):
    data = {}
    no_empty = []
    for ngram in params['ngrams']:
        if ngram != '':
            no_empty.append(ngram)
    params['ngrams'] = no_empty
    for ngram in params['ngrams']:
        ngram_df = storywrangler.get_ngram(
          ngram,
          lang=params['language']
        )
        ngram_df['odds']=[freq_to_odds(f) for f in ngram_df['freq']]
        ngram_df['odds_no_rt']=[freq_to_odds(f) for f in ngram_df['freq_no_rt']]
        data[ngram]=ngram_df
    return data

def get_language_data(params):
    print(f"Getting language data for {params['languages']}")
    data = {}
    for lang in params['languages']:
        df = storywrangler.get_lang(lang)
        df['odds']=[freq_to_odds(f) for f in df['freq']]
        df['odds_no_rt']=[freq_to_odds(f) for f in df['freq_no_rt']]
        data[lang]=df
        print(data)
    return data

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
    return data

def get_zipf_data(params):
    if params['rt']:
        change_param = 'rank_change'
    else:
        change_param = 'rank_change_noRT'
    params['n'] = check_language_support(params['language'],params['n'])
    data = storywrangler.get_zipf_dist(params['date'], params['language'], str(params['n'])+'grams', max_rank=100)
    data = data[data[change_param] > 0]
    data = data.sort_values(by=[change_param])
    return data

def get_divergence_data(params):
    if params['rt']:
        change_param = 'rank_change'
    else:
        change_param = 'rank_change_noRT'
    data = storywrangler.get_divergence(params['date'], params['language'],  str(params['n'])+'grams', max_rank=100)
    data = data[data[change_param] > 0]
    data = data.sort_values(by=[change_param])
    return data

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

def get_data(params):
    if params['viewer']=='ngrams':
        return get_ngram_data(params)
    elif params['viewer']=='language':
        return get_language_data(params)
    elif params['viewer']=='zipf':
        return get_zipf_data(params)
    elif params['viewer']=='divergence':
        return get_divergence_data(params)
    elif params['viewer']=='potusometer':
        return get_potusometer_data(params)
    else:
        return ('Error')