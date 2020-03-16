import pandas as pd
import numpy as np
import flask
import datetime as dt
import pymongo
import datetime
from dotenv import load_dotenv
load_dotenv()
import os
import time
from flask import Flask, Response
from flask import request, abort, jsonify
import csv
import uuid
from flask_cors import CORS
import regexr as r


password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
# Connect to mongo using the credentials from .env file
client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))

with open('ngrams.bin', "rb") as f:
    regex = pickle.load(f)

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'


def print_info(varlist):
    l=[]
    for k,v in varlist.items():
        l.append(k+" = "+str(v))
    return print(" | ".join(l))

def get_ngrams(q):
    q = r.remove_whitespaces(q)
    ngrams = list(r.ngram_parser(q, regex))
    if len(n)==3:
        ngrams = list(r.ngrams(q, regex, n=3).keys())[0]
        n = 3
    elif len(ngrams)==2:
        ngrams = list(r.ngrams(q, regex, n=2).keys())[0]
        n = 2
    else:
        n = 1
    return ngrams, n



def give_instructions():
    return "Enter a URL containing a 1, 2, or 3-word query</br>in the format <b>/api/</b><em>&lt;query&gt;</em><b>?lang=</b><em>&lt;en,es,ru&gt;</em><b>&metric=[rank,counts,freq]</b></br>e.g. <a href='http://hydra.uvm.edu:3001/api/happy birthday?lang=en&metric=[counts]'>http://hydra.uvm.edu:3001/api/happy birthday?lang=en&metric=[counts]</a></br></br>Notes: Emojis are supported! 🐙</br><a href='http://hydra.uvm.edu:3001/api/🐙?metric=[rank]'>http://hydra.uvm.edu:3001/api/🐙?metric=[rank]</a></br></br>If more than 3 words are entered, they will be parsed as 1-grams. Commas and other delimeters are parsed as words too. </br>For a full explanation of the regex used, consult our documentation,</br>which will be added <a href='https://gitlab.com/compstorylab/storywrangler'>here</a> pending paper publication on the ArXiv."



@app.route('/api/', methods=['GET'])
def simple_response():
    start = time.time()
    pid = uuid.uuid4()
    src='root'
    ip = request.remote_addr
    with open('api/querylog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),None,src,0,None,None,str(ip),str(start)])
        fd.close()
    end = time.time()
    # responselog columns - ['pid','time','errors']
    with open('api/responselog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),float((end-start)*60),['No query; returned instructions']])
        fd.close()
    return give_instructions()

@app.route('/api', methods=['GET'])
def simple_response():
    return give_instructions()



@app.route('/api/<query>', methods=['GET'])
def get_data(query):
    start = time.time()
    query = query.replace("%23","#")
    pid = uuid.uuid4()
    date = request.date
    ip = request.remote_addr
    errs=[]
    # Track which data was sent with the request
    sent = []
    # Pull the src from the URL params, e.g. 'ui'
    # For now, we're just using english
    if request.args.get('src') is None:
        src = 'api'
    else:
        src = str(request.args.get('src'))
        sent.append('src')
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    # For now, we're just using english
    if request.args.get('lang') is None:
        language = 'en'
    else:
        language = str(request.args.get('lang'))
        sent.append('lang')
    # Pull the metric from the URL params, e.g. 'rank','counts','freq'
    metric = request.args.get('metric')
    if metric is None:
        metric = ['rank','rank_noRT','counts','count_noRT','freq','freq_noRT']
        #metric = ['rank','counts','freq']
    else:
        sent.append('metric')
        
    ngrams, n = get_ngrams(query)
        
    with open('api/querylog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),str(query),str(src),int(n),str(language),metric,str(ip),sent,str(start)])
        fd.close()
    output=dict()
    output['word']=query
    output['wordcount']=int(ngram)
    output['language']=language
    try:
        # Select the location based on the wordcount (1grams, 2grams, 3grams, etc.), by counting spaces
        db = client[str(n)+'grams']
        #print("Connected to mongo client "+str(ngram)+'grams')
    except:
        errs.append(str("Couldn't connect to the "+language+" "+str(n)+"-grams database"))
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
                errs.append('Error gathering dates')
                pass
            # Calculate min, max, and median rank
            try:
                output['maxrank']=int(min(df['rank'].values))
            except:
                output['maxrank']=int(0)
                errs.append('Error computing maxrank')
                pass
            try:
                output['minrank']=int(max(df['rank'].values))
            except:
                output['minrank']=int(0)
                errs.append('Error computing minrank')
                pass
            try:
                output['medianrank']=int(np.round(np.median(df['rank'].values)))
            except:
                output['medianrank']=int(0)
                errs.append('Error computing medianrank')
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
                errs.append('Error formatting dates')
                pass
            #print('Sent dates and metrics as arrays to the output dict')
            # Fill the requested metric values
            for item in ['rank','rank_noRT','counts','count_noRT','freq','freq_noRT']:
                #print('Testing to see if ',item,' is in the list of requested metrics...')
                if item in metric:
                    #print('Found ',item,' in list of requested metrics')
                    if item in ['counts','count_noRT']:
                        output[item]=[int(r) for r in df[item].values] # Convert from int64 to Python integers
                    else:
                        output[item]=[float(f) for f in df[item].values] # Convert from float64 Python float
        else:
            errs.append(str("Couldn't find any data for '"+query+"' in the "+language+" "+str(ngram)+"grams database"))
    except:
        for item in ['rank','rank_noRT','counts','count_noRT','freq','freq_noRT']:
            if item in metric:
                output[item]=[]
                errs.append(str("Couldn't find "+item+" data for '"+query+"' in the "+language+" "+str(ngram)+"grams database"))
    output['api_error_count']=len(errs)
    if len(errs) > 0:
        output['errors']=errs
    end = time.time()
    #print("elapsed time: "+str((end - start)*60))
    # responselog columns - ['pid','time','errors']
    with open('api/responselog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),float((end -start)*60),errs])
        fd.close()
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port='3001')

