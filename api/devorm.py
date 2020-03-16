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
import urllib


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
    # Convert '%23' to '#', etc.
    query = urllib.parse.unquote(query)
    pid = uuid.uuid4()
    date = request.date
    ip = request.remote_addr
    # Pull the src from the URL params, e.g. 'ui'
    # For now, we're just using english
    if request.args.get('src') is None:
        src = 'api'
    else:
        src = str(request.args.get('src'))
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    # For now, we're just using english
    if request.args.get('lang') is None:
        language = 'en'
    else:
        language = str(request.args.get('lang'))
    # For now, we're just using english
    if request.args.get('noRT') is 'true':
        noRT = True
    else:
        noRT = False
    # Pull the metric from the URL params, e.g. 'rank','counts','freq'
    metric = request.args.get('metric')
    if metric is None:
        if noRT:
            metric = ['rank_noRT','count_noRT','freq_noRT']
        else:
            metric = ['rank','counts','freq']
        
    ngrams, n = get_ngrams(query)
    noRT = False
    output = {'ngrams':ngrams, 'n':n,'querydata':[]}

    for n in ngrams:
        print(n)
        df = pd.DataFrame(list(db['en'].find({"word": n})))
        df = df.dropna(how='all')

        df = df.sort_values(by=['time'])
        df['time'] = [str(t)[:10] for t in df['time']]
        df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() for t in df['time']]
        df=df[df['time']>=(dt.date(2009,8,1))]
        df.sort_values(by='time',ascending=True,inplace=True)
        df['time']=[t.strftime("%Y-%m-%d") for t in df['time']]

        dictout = {}
        dictout.update({'ngram':n})

        dictout.update({'dates':list(df['time'])})

        if 'counts' in metric:
            if noRT:
                c = list(df['count_noRT'])
            else:
                c = list(df['counts'])
            dictout.update({'counts':c})
        if 'freq' in metric:
            if noRT:
                f = list(df['freq_noRT'])
            else:
                f = list(df['freq'])
            dictout.update({'freq':f})
        if 'rank' in metric:
            if noRT:
                r = list(df['rank_noRT'])
            else:
                r = list(df['rank'])
            dictout.update({'rank':r})
        output['querydata'].append(dictout)
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port='3000')

