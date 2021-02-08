import pandas as pd
import time
import datetime as dt
import os
import pickle
from storywrangling import Storywrangler, Realtime
from storywrangling.regexr import nparser
from flask import Flask, Response, make_response, request, jsonify
import csv
import json
import sys
import numpy as np
import pymongo

api = Storywrangler()
realtime = Realtime()

event = dt.datetime.strptime('2021-01-06', '%Y-%m-%d')

def get_ngram_zipfs():
    for n in [1,2,3]:
        zipf_df = api.get_zipf_dist(event, 'en', str(n)+'grams')
        zipf_df.to_csv(f'capitol/zipf_{str(n)}grams.csv')
    return

def get_ngram(ngram, output='top_ngrams'):
    ngram_df = realtime.get_ngram(ngram, lang="en", case_insensitive=False)
    try:
        ngram_df.to_csv(f'capitol/{output}/{ngram}.csv')
    except:
        print(f'Error saving {ngram} csv')
        
def save_ngram_timeseries(n=1, top=10000):
    top = pd.read_csv(f'capitol/zipf_{n}grams.csv')['ngram'][:top]
    for ngram in top:
        get_ngram(ngram)
    return
    