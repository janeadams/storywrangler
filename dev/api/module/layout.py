from dashboard.setup import *
from dashboard.viz import *

import dash
from dash.dependencies import Input, Output, State, MATCH, ALL
import dash_core_components as dcc
import dash_html_components as html

def set_config(params):
    config = {'displaylogo': False, 'toImageButtonOptions': {'format': 'svg'}}
    viewer = params['viewer']
    title_stat = resources['page_config'][viewer]['filename']
    if (type(params[title_stat]) == list):
        unique_string = '_'.join([s.replace(' ','-').lower() for s in params[title_stat]])
    else:
        unique_string = str(params[title_stat]).replace(' ','-').lower()
    config['toImageButtonOptions']['filename']='storywrangler-'+viewer+"_"+unique_string
    return config

def build_plot(params):
    plot = dcc.Loading(
            id="loading-plot",
            type="default",
            children=dcc.Graph(id='plot', config=set_config(params), figure=make_plot(params, get_data(params)))
        )
    return plot

def build_single_option(key, params):
    if key == 'ngrams':
        return dcc.Input(
                id = {
                    'type': 'options',
                    'index': 'ngrams'
                },
                placeholder='Enter a value...',
                type='text',
                value=', '.join(params['ngrams']))
    elif key == 'languages':
        return dcc.Dropdown(
            id = {
                'type': 'options',
                'index': 'languages'
            },
            options=resources['dropdown_language_options'],
            value=params['languages'],
            multi=True,
            clearable=False
        )
    elif (key == 'language' and (params['viewer'] in ['ngrams','zipf'])):
        return dcc.Dropdown(
           id = {
                'type': 'options',
                'index': 'language'
            },
            options=resources['dropdown_language_options'],
            value=params['language'],
            clearable=False
            )
    elif key == 'language':
        return dcc.Dropdown(
            id = {
                'type': 'options',
                'index': 'language'
            },
            options=[{'label': str(v).title(), 'value': v} for v in resources['page_options'][params['viewer']]['language']],
            value=params['language'],
            clearable=False
        )
    elif key == 'scale':
        return dcc.RadioItems(
            id = {
                'type': 'options',
                'index': 'scale'
            },
            options=[{'label': l, 'value': v} for l,v in zip(['Log','Linear'],['log','lin'])],
            value=params['scale']
            )
    elif key == 'metric':
        if params['viewer'] == 'language':
            return dcc.Dropdown(
                id = {
                    'type': 'options',
                    'index': 'metric'
                },
                options=[{'label': str(v).title(), 'value': v} for v in resources['page_options'][params['viewer']]['metric']],
                value=params['metric'],
                clearable=False
            )
        else:
            return dcc.RadioItems(
                id = {
                    'type': 'options',
                    'index': 'metric'
                },
                options=[{'label': str(v).title(), 'value': v} for v in resources['page_options'][params['viewer']]['metric']],
                value=params['metric'])
    elif key == 'rt':
        return dcc.RadioItems(
            id = {
                'type': 'options',
                'index': 'rt'
            },
            options=[{'label': l, 'value': v} for l,v in zip(['With Retweets','Without Retweets'],[True,False])],
            value=params['rt'])
    elif key == 'date':
        return dcc.DatePickerSingle(
            id = 'date-picker',
            date=params['date'].date())
    elif key == 'n':
        return dcc.RadioItems(
            id = {
                'type': 'options',
                'index': 'n'
                },
            options=[{'label': str(n)+"grams", 'value': str(n)} for n in resources['page_options'][params['viewer']]['n']],
            value=str(params['n']))
    elif key == 'plots':
        return dcc.RadioItems(
            id = {
                'type': 'options',
                'index': 'plots'
                },
            options=[{'label': l, 'value': v} for l,v in zip(['Table Only','Show Plots (May take longer to load)'],[False,True])],
            value=params['plots'])
    else: 
        print(f'Key "{key}" not found in options generator logic')
        return None
              

def build_all_options(params):
    print(f'Building all options for viewer {params["viewer"]}')
    options = []
    for key in params.keys():
        #print(f'Generating options components for {key}')
        options.append(build_single_option(key,params))
    search = html.Button('Submit', id='search-button', n_clicks=0)
    options.append(search)
    return options
    

def build_page_layout(params):
    print(f'Building page layout for params: {params}')
    viewer_dropdown_options = {
        "Search for popular terms on Twitter in a single language":"ngrams",
        "Compare today's most-used terms on Twitter to last year":"divergence",
        "Find a single day's most popular terms on Twitter":"zipf",
        "Compare language usage on Twitter":"language",
        "Search for popular terms on Trump-related Twitter":"potusometer"
    }
    viewer_select = [dcc.Dropdown(
        id={
            'type': 'options',
            'index': 'viewer'
            },
        options=[{'label': l, 'value': v} for l,v in viewer_dropdown_options.items()],
        value=params['viewer'])]
    options_list = build_all_options(params)
    plot = build_plot(params)
    layout = html.Div([html.H1(str(params['viewer']).title()), html.Div(viewer_select, id='viewer-menu'), html.Div(options_list, id='options-menu'), html.Div(plot, id='main-content')])
    return layout