port = '3000'
version = 'dev'

from dashboard.setup import *
from dashboard.data import *
from dashboard.viz import *
from dashboard.layout import *
import pandas as pd
import time
from flask import Flask, Response
from flask import request, abort, jsonify
import csv
import uuid
from flask_cors import CORS
import json
import uuid
import sys
import urllib


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['JSON_SORT_KEYS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/api/ngrams/', methods=['GET'])
def ngrams_response():
    return urllib.urlopen("static/ngrams.html").read()

@app.route('/api/zipf/', methods=['GET'])
def zipf_response():
    return urllib.urlopen("static/zipf.html").read()

@app.route('/api/divergence/', methods=['GET'])
def divergence_response():
    return urllib.urlopen("static/divergence.html").read()

@app.route('/api/zipf/<query>', methods=['GET'])
def zipf_data(query):
    get_url_params(request.args, 'zipf')
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

