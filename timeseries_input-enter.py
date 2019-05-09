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

app.layout = html.Div([
    html.H1('Twitter 1-grams'),
    html.Div(dcc.Input(id='input-box', type='text')),
    html.Button('Submit', id='button'),
    html.Div(id='output-container-button', children='Enter a value and press submit'),
    dcc.Graph(id='my-graph',figure={'layout': {'yaxis': {'autorange': 'reversed', 'type':'log'}}}),
])

@app.callback(
    dash.dependencies.Output('my-graph', 'figure'),
    [dash.dependencies.Input('button', 'n_clicks')],
    [dash.dependencies.State('input-box', 'value')])
def update_graph(n_clicks, value):
    layout={
        'yaxis': {'autorange': 'reversed', 'type':'log'},
    }
    figure = {'data':data, 'layout':layout}
    try:
        values = value.split(',')
        for item in values:
            df = load(item)
            data.append({'x':df['time'], 'y':df['rank'],'name':item})
        return figure
    except:
        return figure

if __name__ == '__main__':
    app.run_server(port=8050, host='0.0.0.0', debug=True)