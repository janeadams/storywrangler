import pandas as pd
import numpy as np
import flask
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
    errs=[]
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    language = request.args.get('lang')
    # For now, we're just using english
    if language is None:
        language = 'en'
    # Pull the metric from the URL params, e.g. 'ranks','counts','frequencies'
    metric = request.args.get('metric')
    if metric is None:
        metric = ['rank','counts','freq']
    ngram=int(query.count(' ')+1)
    print("query = ",query," | wordcount = ",ngram," | lang = ",language," | metric = ",metric)
    try:
        # Connect to mongo using the credentials from .env file
        client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))
        # Select the location based on the wordcount (1grams, 2grams, 3grams, etc.), by counting spaces
        db = client[str(ngram)+'grams']
        print("Connected to mongo client "+str(ngram)+'grams')
    except:
        errs.append(str("Couldn't connect to the "+language+" "+str(ngram)+"grams database"))
        return print("Couldn't connect to the",language,ngram,"database")
    output=dict()
    output['word']=query
    output['wordcount']=int(ngram)
    output['language']=language
    try:
        # Build df
        df = pd.DataFrame(list(db[language].find({"word": query})))
        df = df.dropna(how='all')
        if df.shape[0]>0:
            try:
                df = df.sort_values(by=['time'])
                df['year'] = [date.year for date in df['time']]
                df['day'] = [date.timetuple().tm_yday for date in df['time']]
                # Pull out beginning part of date (YY-MM-DD)
                df['time'] = [str(t)[:10] for t in df['time']]
                # Convert date to date object
                df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() for t in df['time']]
                # Remove dates before 2010
                df=df[df['time']>=(dt.date(2009,8,1))]
            except:
                output['dates']=[]
                errs.append('error gathering dates')
                pass
            # Calculate min, max, and median rank
            try:
                output['maxrank']=int(min(df['rank'].values))
            except:
                output['maxrank']=int(0)
                errs.append('error computing maxrank')
                pass
            try:
                output['minrank']=int(max(df['rank'].values))
            except:
                output['minrank']=int(0)
                errs.append('error computing minrank')
                pass
            try:
                output['medianrank']=int(np.round(np.median(df['rank'].values)))
            except:
                output['medianrank']=int(0)
                errs.append('error computing medianrank')
                pass
            # Index df by date
            df.set_index('time',inplace=True)
            #print('Indexed df by date')
            # Drop the id field (used for indexing in the database)
            df.drop(columns=["_id"]);
            #print('Dropped the id field (used for indexing in the database)')
            # Sort by date
            df.sort_values(by='time',ascending=True,inplace=True)
            #print('Sorted by date')
            # Convert time back to a string
            df.index=[t.strftime("%Y-%m-%d") for t in df.index]
            #print('Converted time back to a string')
            # Send dates and metrics as arrays to the output dict
            try:
                output['dates']=df.index.values.tolist()
            except:
                output['dates']=[]
                errs.append('error formatting dates')
                pass
            #print('Sent dates and metrics as arrays to the output dict')
            # Fill the requested metric values
            for item in ['rank','counts','freq']:
                print('Testing to see if ',item,' is in the list of requested metrics...')
                if item in metric:
                    print('Found ',item,' in list of requested metrics')
                    if item =='counts':
                        output[item]=[int(r) for r in df[item].values] # Convert from int64 to Python integers
                    else:
                        output[item]=[float(f) for f in df[item].values] # Convert from float64 Python float
        else:
            errs.append(str("Couldn't find any data for '"+query+"' in the "+language+" "+str(ngram)+"grams database"))
    except:
        for item in ['rank','counts','freq']:
            if item in metric:
                output[item]=[]
                errs.append(str("Couldn't find "+item+"data for '"+query+"' in the "+language+" "+str(ngram)+"grams database"))
    if len(errs) > 0:
        output['error_count']=len(errs)
        output['errors']=errs
    return jsonify(output)
        

if __name__ == '__main__':
    app.run(debug=True, port='3001')

