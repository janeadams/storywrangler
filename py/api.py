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
from dotenv import load_dotenv
load_dotenv()
import os
password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
from flask import Flask, Response
from flask import request, abort, jsonify

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

@app.route('/api/<query>', methods=['GET'])
def get_data(query):
    if len(query) == 0:
        abort(404)
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    language = request.args.get('language')
    # For now, we're just using english
    if language is None:
        language = 'en'
    # Pull the metric from the URL params, e.g. 'ranks','counts','frequencies'
    metric = request.args.get('metric')
    if metric is None:
        metric = ['rank','counts','freq']
    print("query = ",query," | language = ",language," | metric = ",metric)
    try:
        # Connect to mongo using the credentials from .env file
        client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))
        # Select the location based on the wordcount (1grams, 2grams, 3grams, etc.), by counting spaces
        ngram=str(query.count(' ')+1)+'grams'
        db = client[ngram]
        print("connected to mongo client "+ngram)
    except:
        return str("Couldn't connect to the "+language+" "+ngram+" database")
    output=dict()
    output['word']=query
    try:
        # Build df
        df = pd.DataFrame(list(db[language].find({"word": query})))
        df = df.dropna(how='all')
        df = df.sort_values(by=['time'])
        df['year'] = [date.year for date in df['time']]
        df['day'] = [date.timetuple().tm_yday for date in df['time']]
        # Pull out beginning part of date (YY-MM-DD)
        df['time'] = [str(t)[:10] for t in df['time']]
        # Convert date to date object
        df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() for t in df['time']]
        print(df.columns)
        print('line 60')
        print('Initial df.shape = ',df.shape)
        # Remove dates before 2010
        df=df[df['time']>=(dt.date(2009,8,1))]
        print('line 64')
        print('New df.shape = ',df.shape)
        # Calculate min, max, and median rank
        try:
            output['maxrank']=int(min(df['rank'].values))
            print("output['maxrank'] = ",output['maxrank'])
        except:
            print('error computing maxrank')
        try:
            output['minrank']=int(max(df['rank'].values))
            print("output['minrank']=",output['minrank'])
        except:
            print('error computing minrank')
        try:
            output['medianrank']=int(np.round(np.median(df['rank'].values)))
            print("output['medianrank'] = ",output['medianrank'])
        except:
            print('error computing medianrank')
        # Index df by date
        df.set_index('time',inplace=True)
        print('Indexed df by date')
        # Drop the id field (used for indexing in the database)
        df.drop(columns=["_id"]);
        print('Dropped the id field (used for indexing in the database)')
        # Sort by date
        df.sort_values(by='time',ascending=True,inplace=True)
        print('Sorted by date')
        # Convert time back to a string
        df.index=[t.strftime("%Y-%m-%d") for t in df.index]
        print('Converted time back to a string')
        # Send dates and metrics as arrays to the output dict
        output['dates']=df.index.values.tolist()
        print('Sent dates and metrics as arrays to the output dict')
        # Fill the requested metric values
        for item in ['rank','counts','freq']:
            print('Testing to see if ',item,' is in the list of requested metrics...')
            if item in metric:
                print('Found ',item,' in list of requested metrics')
                try:
                    output[item]=[int(r) for r in df[item].values] # Convert from int64 to Python integers
                    print('output[',item,'] is an int')
                    print('output[',item,'] =',output[item][0:5],'...')
                except:
                    output[item]=[float(f) for f in df[item].values] # Convert from float64 Python float
                    print('output[',item,'] is a float')
                    print('output[',item,'] =',output[item][0:5],'...')
        # Update the error message to 'None'
        output['error']=None
    except:
        output['error']=str("Couldn't find data for "+query+" in the "+language+" "+ngram+" database")
        output['maxrank']=int(0)
        output['minrank']=int(0)
        output['medianrank']=int(0)
        output['dates']=[]
        for item in ['rank','counts','freq']:
            if item in metric:
                output[item]=[]
    return jsonify(output)
        

if __name__ == '__main__':
    app.run(debug=True, port='3001')

