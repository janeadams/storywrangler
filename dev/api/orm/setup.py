import datetime as dt
import os
import pickle
import json
import pandas as pd

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