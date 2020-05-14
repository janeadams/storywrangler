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
import dev.api.regexr as r
import urllib
import pickle
import json
import uuid


password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
# Connect to mongo using the credentials from .env file
client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))

with open('prod/api/ngrams.bin', "rb") as f:
    regex = pickle.load(f)
    
with open('prod/api/language_support.json', 'r') as f:
    language_support = json.load(f)

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
    n = len(ngrams)
    if n==3:
        if language in language_support['3grams']:
            ngrams = [list(r.ngrams(q, regex, n=3).keys())[0]]
        else: n=1
    if n==2:
        if language in language_support['2grams']:
            ngrams = [list(r.ngrams(q, regex, n=2).keys())[0]]
        else: n=1
    if n==1:
        ngrams = list(r.ngrams(q, regex, n=1).keys())
        res = [] 
        [res.append(x) for x in ngrams if x not in res]
        ngrams = res
    
    return ngrams, n



def give_instructions():
    return "Enter a URL containing a query</br>in the format <b>/api/</b><em>&lt;query&gt;</em><b>?language=</b><em>&lt;en,es,ru,fr...&gt;</em><b>&metric=&lt;rank,counts,freq&gt;&rt=</b>&lt;true,false&gt;</br></br>e.g. <a href='https://storywrangling.org/api/happy new year?metric=freq&rt=false' target='_blank'>https://storywrangling.org/api/<b>happy new year</b>?metric=<b>freq</b>&rt=<b>false</b></a> to get all original tweets (no retweeets)</br>frequency data for the 3-gram <em>happy new year</em> from the ngrams database.</br></br>or try <a href='https://storywrangling.org/api/bonjour?language=fr&metric=counts&rt=true' target='_blank'>https://storywrangling.org/api/<b>bonjour</b>?language=<b>fr</b>&metric=<b>counts</b>&rt=<b>true</b></a> to get all count data </br>(including retweeets) for the 1-gram <em>bonjour</em> from the French ngrams database.</br></br>Also... emojis are supported!</br><a href='https://storywrangling.org/api/🐙' target='_blank'>https://storywrangling.org/api/🐙</a></br></br>If we can, we'll try to return the values for a full phrase; if we don't have data for the full phrase,</br>we'll break up your query into 1-grams and return data for each 1-gram.</br>Commas and other delimeters are parsed as words too. </br></br>For a full explanation of the regex used, consult our documentation,</br>which will be added <a href='https://gitlab.com/compstorylab/storywrangler'>here</a> pending paper publication on the ArXiv.</br></br>Don't forget to check out the UI at <a href='https://storywrangling.org' target='_blank'>https://storywrangling.org</a>!"



@app.route('/api/', methods=['GET'])
def simple_response():
    start = time.time()
    pid = uuid.uuid4()
    src='root'
    ip = request.remote_addr
    with open('dev/api/logs/querylog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),None,src,0,None,None,str(ip),str(start)])
        fd.close()
    end = time.time()
    # responselog columns - ['pid','time','errors']
    with open('dev/api/logs/responselog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),float((end-start)*60),['No query; returned instructions']])
        fd.close()
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
    language = str(request.args.get('language'))
    if language in language_support['1grams']:
        language = language
    else:
        language = 'en'
    rt = request.args.get('rt') == 'true'
    # Pull the metric from the URL params, e.g. 'rank','counts','freq'
    metric = request.args.get('metric')
    if metric is None:
        metric = 'rank'
        
    ngrams, n = get_ngrams(query)
    output = {'ngrams':ngrams, 'database':n, 'metric':metric, 'rt':rt, 'language':language, 'ngramdata':[],'errors':[]}
    
    print(f'ngrams :{ngrams}, n:{n}, metric:{metric}, rt:{rt}, language:{language}')
    
    with open('dev/api/logs/querylog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),str(query),str(src),int(n),str(language),metric,str(ip),'',str(start)])
        fd.close()
    try:
        # Select the location based on the wordcount (1grams, 2grams, 3grams, etc.), by counting spaces
        db = client[f'{n}grams']
        #print("Connected to mongo client "+str(ngram)+'grams')
    except:
        errs.append(f"Couldn't connect to the {language} {n}grams database")
        
    ndict = {}
    
    for ngram in ngrams:
        print(f'searching the {n}grams db for {ngram}')
        try:
            df = pd.DataFrame(list(db[language].find({"word": ngram})))
            if df.shape[0]==0:
                output['errors'].append(f"Couldn't find data for {ngram}")
            else:
                df = df.dropna(how='all')
                df['time'] = [str(t)[:10] for t in df['time']]
                df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() for t in df['time']]
                df=df[df['time']>=(dt.date(2009,8,1))]
                df.sort_values(by='time',ascending=True,inplace=True)
                df['time']=[t.strftime("%Y-%m-%d") for t in df['time']]
                
                values = []

                if metric =='counts':
                    if rt:
                        values = list(df['counts'])
                    else:
                        values = list(df['count_noRT'])
                if metric=='freq':
                    if rt:
                        values = list(df['freq'])
                    else:
                        values = list(df['freq_noRT'])
                if metric=='rank':
                    if rt:
                        values = list(df['rank'])
                    else:
                        values = list(df['rank_noRT'])
                    
                datalist=[]
                
                for item in dict(zip(list(df['time']),values)).items():
                    datalist.append(item)
                    
                ndict[ngram]={'uuid':uuid.uuid4(), 'min_date':df['time'].min(), 'max_date':df['time'].max(), (f'min_{metric}'): min(values), (f'max_{metric}'):max(values), 'data':datalist}
                
        except: output['errors'].append(f"Couldn't find data for {ngram}")
            
    output['ngramdata']=ndict
            
    return jsonify(output)

if __name__ == '__main__':
    app.run(debug=True, port='3000')

