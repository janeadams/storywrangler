import pandas as pd
import numpy as np
import dash
import flask
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
from pandas_datareader import data as web
from datetime import datetime as dt
import pymongo
from dotenv import load_dotenv
load_dotenv()
import os
password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))
db = client["1-grams"]
def load(word):
    try:
        df = pd.DataFrame(list(db["tweets"].find({ "word": word})))
        df = df.sort_values(by=['time'])
        df['year'] = [date.year for date in df['time']]
        df['day'] = [date.timetuple().tm_yday for date in df['time']]
        return df
    except:
        print(str("No timeseries found for "+word))
        df = pd.DataFrame()
        return df
    
import csv
wordlist = []
with open('wordlist_below5k.csv', 'rt') as f:
    reader = csv.reader(f)
    next(reader)
    wordlist=list(reader)
    
options = []
for word in wordlist:
    options.append({'label': word[0],'value': word[0]})
    
external_stylesheets = ['styles.css']

server = flask.Flask(__name__)

app = dash.Dash(__name__, server=server, external_stylesheets=external_stylesheets)

app.layout = html.Div([
    html.H1('Twitter 1-grams'),
    html.P('This shows any one-grams that cracked the top 5k rank at any time (47,844 onegrams)'),
    html.Div([
        dcc.Dropdown(id='my-dropdown', options=options, value=['@realdonaldtrump','@bts_twt'], multi=True)]),
    dcc.Graph(id='my-graph',figure={'layout': {'yaxis': {'autorange': 'reversed', 'type':'log'}}})
])

@app.callback(Output('my-graph', 'figure'), [Input('my-dropdown', 'value')])

def update_graph(input_value):
    data=[]
    layout={
        'yaxis': {'autorange': 'reversed', 'type':'log'},
    }
    figure = {'data':data, 'layout':layout}
    for item in input_value:
        df = load(item)
        data.append({'x':df['time'], 'y':df['rank'],'name':item})
    return figure


if __name__ == '__main__':
    app.run_server(port=8050, host='0.0.0.0')