import pandas as pd
import numpy as np
import dash
import flask
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
    
external_stylesheets = ['styles.css']

server = flask.Flask(__name__)

app = dash.Dash(__name__, server=server, external_stylesheets=external_stylesheets)

data=[]

layout = {'yaxis': {'type':'log','autorange':'reversed','fixedrange': 'true'}}

config = {'scrollZoom': True}

app.layout = html.Div([
    html.H1('Twitter 1-grams'),
    html.Div(dcc.Input(id='input-box', type='text')),
    html.Button('Submit', id='button'),
    html.Div(id='output-container-button', children='Enter a query (or comma-separated queries) and press submit!'),
    dcc.Graph(id='my-graph',config=config,figure={'data':data,'layout': layout})
])

@app.callback(
    dash.dependencies.Output('my-graph', 'figure'),
    [dash.dependencies.Input('button', 'n_clicks')],
    [dash.dependencies.State('input-box', 'value')])
def update_graph(n_clicks, value):
    print("updating graph...")
    data = []
    figure = {'data':data, 'layout':layout}
    try:
        print(value)
        value = value.lower()
        value = value.replace(" ",",")
        values = value.split(',')
        print(values)
        for item in values:
            print(item)
            df = load(item)
            data.append({'x':df['time'], 'y':df['rank'],'name':item})
        return figure
    except:
        print("exception raised!")
        return figure

if __name__ == '__main__':
    app.run_server(port=8050, host='0.0.0.0', debug=True)
