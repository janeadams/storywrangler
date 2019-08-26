#!/usr/bin/env python
# -*- coding: utf-8 -*-
import socket
from subprocess import Popen, PIPE
import getpass
import json
import sys
import os
import gzip
import timeit
import pandas as pd
import numpy as np
import pandas
import argparse
import datetime
import matplotlib
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from multiprocessing import Pool
plt.switch_backend('agg')
from pymongo import MongoClient
from pymongo.collation import Collation, CollationStrength
from datetime import timedelta, date
import sys


def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + timedelta(n)


class Query:
    """Class to work with 1-gram db"""

    def __init__(self, username, pwd, db, lang):
        """
        Parameters
        ----------
        username: mongoDB user
        pwd: mongoDB password
        query: mongo formatted
        """
 
        #password = getpass.getpass('password:') # those with guest access
        #if socket.gethostname() != 'hydra.uvm.edu':
        #    proc = Popen(['./port_forward.sh'], stdin=PIPE)
            # proc.communicate(input=password.encode('utf-8')) # also for Guests

        client = MongoClient('mongodb://%s:%s@hydra.uvm.edu:27017' % (username, pwd))
        db = client[db]
        self.tweets = db[lang]
        self.lang = lang
        return
    
    def query_zipf_dist(self, starttime, endtime=None):
        """ Query the database and return daily zipf files (word, count, rank, frequency)
        
        Parameters:
        ----------
        starttime (datetime object): the start date of the range for the zipf data
        endtime (optional) (datetime object): the end date of the range for the zipf data         

        """
        if not endtime:
            query = {'time':starttime} 
        else:
            query =  {'time':{'$lte':starttime,'$gte':endtime}}
                
        cursor = self.tweets.find(query)

        results = pd.DataFrame.from_dict([x for x in cursor])
        
        return results.drop(['_id','time'], axis=1)
        

    def query_timeseries(self, query=None, word=None, max_range=False):
        """ query database for n-gram timeseries, return pandas dataframe\
        :param query: json-like query for mongo
        :param word: word to query
        :param max_range: flag to query over default date range
        :return: pandas dataframe of count, rank, and frequency over time for an n-gram"""
        if max_range:
            index = pd.date_range(start=datetime.datetime(2008,9,1),end=datetime.date.today(),freq='D')
        else:
            data_array = []
            for i in self.tweets.find(query):
                data_array.append([i['time'],int(i['counts']), float(i['freq'])])
            if len(data_array) == 0:
                return
            data = np.array(data_array)
            data = data[data[:,0].argsort()]
            
            index = pd.date_range(start=data[0,0], end=data[-1,0], freq='D')
        data2 = np.zeros((len(index), 3))
        data2[:,1] = np.nan
        index_dict = {x.to_pydatetime():i for i,x in enumerate(index)}
        for i in self.tweets.find(query):
            try:
                data2[index_dict[i['time']],:] = int(i['counts']),np.nan,float(i['freq'])
            except KeyError:
                pass

        return  pd.DataFrame(data=data2,
                    index=index)

    def query_insensitive_timeseries(self, query=None, word=None, max_range=False):
        """ query database for n-gram timeseries, return pandas dataframe\
        :param query: json-like query for mongo
        :param word: word to query
        :param max_range: flag to query over default date range
        :return: pandas dataframe of count, rank, and frequency over time for an n-gram"""
        if max_range:
            index = pd.date_range(start=datetime.datetime(2008,9,1),end=datetime.date.today(),freq='D')
        else:
            data_array = []
            for i in self.tweets.find(query).sort('word').collation(Collation(locale=self.lang,strength=CollationStrength.SECONDARY)):
                data_array.append([i['time'],int(i['counts']), float(i['rank']), float(i['freq'])])
            if len(data_array) == 0:
                return
            data = np.array(data_array)
            data = data[data[:,0].argsort()]

            index = pd.date_range(start=data[0,0], end=data[-1,0], freq='D')
        data2 = np.zeros((len(index), 3))
        data2[:,1] = np.nan
        index_dict = {x.to_pydatetime():i for i,x in enumerate(index)}
        for i in self.tweets.find(query).sort('word').collation(Collation(locale=self.lang,strength=CollationStrength.SECONDARY)):
            try:
                data2[index_dict[i['time']],:] += int(i['counts']),int(i['rank']),float(i['freq'])
            except KeyError:
                pass

        return  pd.DataFrame(data=data2,
                    index=index)

    def query_languages(self, lang):
        """ queries database and returns pandas dataframe
        :param query: 
        :param gt_days: minimum number of days in the database
        :return: list of n-grams matching pattern """
        index = pd.date_range(start=datetime.datetime(2008,9,1),end=datetime.date.today(),freq='D')
        
        data2 = np.zeros((len(index), 6))
        data2[:,:] = np.nan
        index_dict = {x.to_pydatetime():i for i,x in enumerate(index)}
        query = {'language':lang }
        for i in self.tweets.find(query):
            try:
                data2[index_dict[i['date']],:] = i['ft_count'],i['ft_rank'],i['ft_freq'],i['tw_count'],i['tw_rank'],i['tw_freq']
            except KeyError:
                pass

        return  pd.DataFrame(data=data2,
                    index=index)


    def query_regex(self, query, gt_days=1):
        """ queries database and returns a list of unique strings matching a regex
        :param query: json-like query for mongo
        :param gt_days: minimum number of days in the database
        :return: list of n-grams matching pattern """
        
        word_dic = {}
        for i in self.tweets.find(query):
            if i['word'] in word_dic:
                word_dic[i['word']] +=1 
            else:
                word_dic[i['word']] = 1 
        return [i for i,value in word_dic.items() if value > gt_days]


    def tweet_query(self, query):
        for i in self.tweets.find(query):
            yield i

    def stdout_timeseries(self):
        """Prints timeseries data to screen"""
        data = self.data
        df = pd.DataFrame(data)
        data1 = [datetime.datetime.strftime(i, format="%Y-%m-%d") for i in data[:,0]]
        for row in self.data2.itertuples():
            print(datetime.datetime.strftime(row[0],format="%Y-%m-%d"), int(row[1]), int(row[2]), row[3])
        return


    def timeseries_tofile(self):
        try:
            self.data2.to_csv(f'output/{word}.txt', header=None, sep=' ')
            print(f'{timeit.default_timer() - start} seconds')
        except FileNotFoundError:
            pass
        return
    
def main():
    word = 'tweet'
    query = Query('mvarnold', pwd, {'word' : word}, word)
    data = query.query_timeseries()
    print(data)

if __name__ == "__main__":

    main()


