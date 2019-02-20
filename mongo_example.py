import pandas as pd
import os

import numpy as np
import matplotlib.pyplot as plt
from scipy import io
import datetime


import sys 
sys.path.insert(0, '/home/mvarnold/.passwords')
sys.path.insert(0, '/home/mvarnold/1-gram_search')
from mongo_password import x as pwd 
from mongo_query import Query


begin_date = datetime.datetime(2017,1,1)
word_i = "trump"
query =  Query('guest', 'roboctopus', {'word' : word_i, 'time': {'$gte': begin_date}}, word_i)
data_i = query.query_timeseries()
count_i, rank_i, freq_i = data_i.values.T 
dates = data_i.index
print(freq_i)
