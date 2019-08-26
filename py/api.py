#!/usr/bin/env python
# coding: utf-8

# In[131]:


import pandas as pd
import numpy as np
import dash
import flask
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
from pandas_datareader import data as web
import datetime as dt
import pymongo
import datetime


# In[132]:


from dotenv import load_dotenv
load_dotenv()
import os
password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")


# In[134]:


def generate_object():
    # Connect to mongo using the credentials from .env file
    client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))
    # Select the location based on the wordcount (1grams, 2grams, 3grams, etc.), by counting spaces
    db = client[str(query.count(' ')+1)+'grams']
    output=dict()
    output['word']=query
    # Build df
    df = pd.DataFrame(list(db[language].find({ "word": query})));
    df=df.dropna(how='all')
    df = df.sort_values(by=['time'])
    df['year'] = [date.year for date in df['time']]
    df['day'] = [date.timetuple().tm_yday for date in df['time']]
    # Pull out beginning part of date (YY-MM-DD)
    df['time'] = [str(t)[:10] for t in df['time']]
    # Convert date to date object
    #print("Before converting to date object, df.head(10) = ")
    #print(df.head(10))
    df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() for t in df['time']]
    # Remove dates before 2010
    #print("Before removing early dates, shape is", df.shape)
    df=df[df['time']>=(dt.date(2009,8,1))]
    #print("After removing early dates, shape is", df.shape)
    # Calculate min, max, and median rank
    output['maxrank']=int(min(df['rank'].values))
    output['minrank']=int(max(df['rank'].values))
    output['medianrank']=int(np.round(np.median(df['rank'].values)))
    # Index df by date
    #print("setting time as index...")
    df.set_index('time',inplace=True)
    #print("set time as index")
    # Drop the id field (used for indexing in the database)
    df.drop(columns=["_id"]);
    # Sort days
    print("sorting by date...")
    df.sort_values(by='time',ascending=True,inplace=True)
    print("sorted by date")
    # Convert time back to a string
    df.index=[t.strftime("%Y-%m-%d") for t in df.index]
    # Find the date on which the rank reached its first and most recent (could be the same day) minimum and maximum 
    output['firstmax']=df[df['rank']==output['maxrank']].index[-1]
    output['lastmax']=df[df['rank']==output['maxrank']].index[0]
    output['firstmin']=df[df['rank']==output['minrank']].index[-1]
    output['lastmin']=df[df['rank']==output['minrank']].index[0]
    # Send dates and metrics as arrays to the output dict
    output['dates']=df.index.values.tolist()
    if 'ranks' in metric:
        output['ranks']=[int(r) for r in df['rank'].values] # Convert from int64 to Python integers
    if 'counts' in metric:
        output['counts']=[int(c) for c in df['counts'].values] # Convert from int64 to Python integers
    if 'frequencies' in metric:
        output['frequencies']=[float(f) for f in df['freq'].values] # Convert from float64 Python float
    return output


# In[138]:


query='christmas'
language='en'
metric = ['ranks','counts','frequencies']


# In[ ]:


#!flask/bin/python
from flask import Flask
from flask import abort

app = Flask(__name__)

@app.route('/api/<str:query>', methods=['GET'])
def get_data(query):
    if len(query) == 0:
        abort(404)
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    #language = str(request.args.get('language'))
    # For now, we're just using english
    if language is None:
        language = 'en'
    # Pull the metric from the URL params, e.g. 'ranks','counts','frequencies'
    metric = str(request.args.get('metric'))
    if metric is None:
        metric = ['ranks','counts','frequencies']
    return jsonify(generate_object())

if __name__ == '__main__':
    app.run(debug=True, port='3001')

