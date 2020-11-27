port = '3001'
version = 'prod'

import dev.api.regexr as r
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
import urllib
import pickle
import json
import uuid
import sys

password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
# Connect to mongo using the credentials from .env file
client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))

with open(f'{version}/api/ngrams.bin', "rb") as f:
    regex = pickle.load(f)
    
with open(f'{version}/api/language_support.json', 'r') as f:
    language_support = json.load(f)

language_codes = pd.read_csv(f'{version}/api/popular_language_codes.csv')

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'


def print_info(varlist):
    l=[]
    for k,v in varlist.items():
        l.append(k+" = "+str(v))
    return print(" | ".join(l))

def get_unique_count(date, language, ngrams):
    db = client['languages']
    collection = db['languages']
    for result in collection.find({'language':language, 'time':date}):
        unique = result[f'unique_{ngrams}']
        print(f'Unique {ngrams} for {language} on {date}: {unique}')
    return int(unique)

def get_ngrams(language, q):
    q = r.remove_whitespaces(q)
    ngrams = list(r.ngram_parser(q, regex))
    number = len(ngrams)
    if number==3:
        if language in language_support['3grams']:
            ngrams = [list(r.ngrams(q, regex, n=3).keys())[0]]
        else:
            number=1
            ngrams = list(r.ngrams(q, regex, n=1).keys())
            res = []
            [res.append(x) for x in ngrams if x not in res]
            ngrams = res
    elif number==2:
        if language in language_support['2grams']:
            ngrams = [list(r.ngrams(q, regex, n=2).keys())[0]]
        else:
            number=1
            ngrams = list(r.ngrams(q, regex, n=1).keys())
            res = []
            [res.append(x) for x in ngrams if x not in res]
            ngrams = res
    else:
        number=1
        ngrams = list(r.ngrams(q, regex, n=1).keys())
        res = []
        [res.append(x) for x in ngrams if x not in res]
        ngrams = res
    
    return ngrams, number



def give_ngram_instructions():
    return "Enter a URL containing a query</br>in the format <b>/api/ngrams/</b><em>&lt;query&gt;</em><b>?language=</b><em>&lt;en,es,ru,fr...&gt;</em><b>&metric=&lt;rank,freq&gt;&rt=</b>&lt;true,false&gt;</br></br>e.g. <a href='https://storywrangling.org/api/ngrams/happy new year?metric=freq&rt=false' target='_blank'>https://storywrangling.org/api/ngrams/<b>happy new year</b>?metric=<b>freq</b>&rt=<b>false</b></a> to get all original tweets (no retweeets)</br>frequency data for the 3-gram <em>happy new year</em> from the ngrams database.</br></br>or try <a href='https://storywrangling.org/api/ngrams/bonjour?language=fr&metric=freq&rt=true' target='_blank'>https://storywrangling.org/api/ngrams/<b>bonjour</b>?language=<b>fr</b>&metric=<b>freq</b>&rt=<b>true</b></a> to get all frequency data </br>(including retweeets) for the 1-gram <em>bonjour</em> from the French ngrams database.</br></br>Also... emojis are supported!</br><a href='https://storywrangling.org/api/ngrams/🐙' target='_blank'>https://storywrangling.org/api/ngrams/🐙</a></br></br>If we can, we'll try to return the values for a full phrase; if we don't have data for the full phrase,</br>we'll break up your query into 1-grams and return data for each 1-gram.</br>Commas and other delimeters are parsed as words too. </br></br>For a full explanation of the regex used, consult our documentation,</br>which will be added <a href='https://gitlab.com/compstorylab/storywrangler'>here</a> pending paper publication on the ArXiv.</br></br>Don't forget to check out the UI at <a href='https://storywrangling.org' target='_blank'>https://storywrangling.org</a>!"

def give_zipf_instructions():
    return "Enter a URL containing a date (YYYY-MM-DD) query</br>in the format <b>/api/zipf/</b><em>&lt;date&gt;</em><b>?language=</b><em>&lt;en,es,ru,fr...&gt;</em></br></br>e.g. <a href='https://storywrangling.org/api/zipf/2020-03-28?language=en' target='_blank'>https://storywrangling.org/api/zipf/<b>2020-03-28</b>?language=<b>en</b></a> to get the top 1000 most-used ngrams' usage data in all English tweets on January 1, 2020</br>"

def give_divergence_instructions():
    return "Enter a URL containing a date (YYYY-MM-DD) query</br>in the format <b>/api/divergence/</b><em>&lt;date&gt;</em></br></br>e.g. <a href='https://storywrangling.org/api/divergence/2020-03-28' target='_blank'>https://storywrangling.org/api/divergence/<b>2020-03-28</b></a> to get the highest-divergence ngrams in all English tweets on January 1, 2020</br>"


@app.route('/api/zipf/', methods=['GET'])
def zipf_response():
    return give_zipf_instructions()

@app.route('/api/divergence/', methods=['GET'])
def divergence_response():
    return give_divergence_instructions()

@app.route('/api/ngrams/', methods=['GET'])
def ngrams_response():
    start = time.time()
    pid = uuid.uuid4()
    src='root'
    ip = request.remote_addr
    with open(f'{version}/api/logs/querylog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),None,src,0,None,None,str(ip),str(start)])
        fd.close()
    end = time.time()
    # responselog columns - ['pid','time','errors']
    with open(f'{version}/api/logs/responselog.csv','a') as fd:
        write_outfile = csv.writer(fd)
        write_outfile.writerow([int(pid),float((end-start)*60),['No query; returned instructions']])
        fd.close()
    return give_ngram_instructions()

@app.route('/api/zipf/<query>', methods=['GET'])
def zipf_data(query):
    start = time.time()
    pid = uuid.uuid4()
    request_date = request.date
    ip = request.remote_addr
    # Pull the language from the URL params, e.g. 'en', 'es', 'ru'
    language = str(request.args.get('language'))
    if language in list(language_codes['db_code']):
        language = language
    else:
        language = 'en'
    ngrams = str(request.args.get('ngrams'))+"grams"
    if ngrams in ['1grams','2grams','3grams']:
        if language not in language_support[ngrams]:
            ngrams = '1grams'
    else:
        ngrams = '1grams'
    # Pull the date requested
    try:
        date = datetime.datetime.strptime(query, '%Y-%m-%d')
    except:
        return ("Sorry, date not formatted correctly or not included in our database. Dates should be formatted as 2020-03-28")
    show_all = request.args.get('all') == 'true'
    output = {'date':date,'language': language, 'ngrams':ngrams}
    db = client[ngrams]
    collection = db[language]
    if show_all:
        try:
            unique_count = get_unique_count(date, language, ngrams)
            output[f'unique_{ngrams}'] = unique_count
            words = [None] * unique_count
            data = np.zeros((unique_count,4))
            i = 0
            for result in collection.find({'time':date}):
                words[i]=result['word']
                data[i][0]=result['rank']
                data[i][1]=result['rank_noRT']
                data[i][2]=result['freq']
                data[i][3]=result['freq_noRT']
                i+=1
            df = pd.DataFrame(data=data, columns=['rank', 'rank_noRT','freq','freq_noRT'])
            df['ngram']=words
            output['elapsed_time']=(time.time()-start)
            output['data']=df.to_dict('index')
        except:
            output['elapsed_time']=(time.time()-start)
            output['error'] = (f"Sorry, we had trouble returning zipf data for {date} in the {language} {ngrams} database")
    else:
        try:
            max_rank = int(request.args.get('max'))
        except:
            max_rank = 1000
        output['max']=max_rank
        try:
            df = pd.DataFrame(columns=['ngram','rank', 'rank_noRT','freq','freq_noRT'])
            for result in collection.find({'time':date, "rank": {"$lte": max_rank}}):
                df = df.append({'ngram': result['word'], 'rank': result['rank'], 'rank_noRT': result['rank_noRT'],'freq':result['freq'],'freq_noRT':result['freq_noRT']},ignore_index=True)
            output['elapsed_time']=(time.time()-start)
            output['data']=df.to_dict('index')
        except:
            output['elapsed_time']=(time.time()-start)
            output['error'] = (f"Sorry, we had trouble returning zipf data for {date} in the {language} {ngrams} database")
    return jsonify(output)

@app.route('/api/divergence/<query>', methods=['GET'])
def divergence_data(query):
    start = time.time()
    pid = uuid.uuid4()
    ip = request.remote_addr
    language = 'en'
    try:
        ngrams = str(request.args.get('ngrams'))+"grams"
        if ngrams not in ['1grams','2grams']:
            ngrams = '1grams'
    except:
        ngrams = '1grams'
    # Pull the date requested
    try:
        date = datetime.datetime.strptime(query, '%Y-%m-%d')
    except:
        return ("Sorry, date not formatted correctly or not included in our database. Dates should be formatted as 2020-03-28")
    rt = request.args.get('rt') == 'true'
    output = {'date':query,'language': language, 'ngrams': ngrams, 'with_RT':rt}
    db = client['rd_'+ngrams]
    collection = db[language]
    try:
        if rt:
            change = 'rank_change'
            contribution = 'rd_contribution'
        else:
            change = 'rank_change_noRT'
            contribution = 'rd_contribution_noRT'
        df = pd.DataFrame(columns=['ngram', change, contribution])
        for result in collection.find({'time_2':date}):
            df = df.append({'ngram': result['ngram'], change: result[change], contribution: result[contribution]},ignore_index=True)
        df.dropna(inplace=True)
        df = df.sort_values(by=[change])
        output['elapsed_time']=(time.time()-start)
        output['data']=df.to_dict('index')
    except:
        output['elapsed_time']=(time.time()-start)
        output['error'] = (f"Sorry, we had trouble returning rank divergence data for {date} in the {language} {'rd_'+ngrams} database")
        output['sys_err'] = (f'Unexpected error: {sys.exc_info()[0]}')
    return jsonify(output)


@app.route('/api/ngrams/<query>', methods=['GET'])
def ngram_data(query):
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
    if language in list(language_codes['db_code']):
        language = language
    else:
        language = 'en'
    rt = request.args.get('rt') == 'true'
    # Pull the metric from the URL params, e.g. 'rank','counts','freq'
    metric = request.args.get('metric')
    if metric != 'freq' :
        metric = 'rank'
        
    ngrams, n = get_ngrams(language, query)
    output = {'ngrams':ngrams, 'database':n, 'metric':metric, 'rt':rt, 'language':language, 'ngramdata':[],'errors':[]}
    
    print(f'ngrams :{ngrams}, n:{n}, metric:{metric}, rt:{rt}, language:{language}')
    
    with open(f'{version}/api/logs/querylog.csv','a') as fd:
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
                df = df[df['rank'] < 1000000] # Drop entries below rank 1M
                df = df[df['rank_noRT'] < 1000000]
                df['time'] = [str(t)[:10] for t in df['time']]
                df['time'] = [dt.datetime.strptime(t, '%Y-%m-%d').date() + datetime.timedelta(days=1) for t in df['time']]
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
    app.run(debug=True, port=port)

