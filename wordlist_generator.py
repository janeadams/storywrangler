import pymongo
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
import os
password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
client = pymongo.MongoClient('mongodb://%s:%s@127.0.0.1' % (username, password))
db = client["1-gram_time"]
# ### Pull all unique words and their minimum rank value
# From https://docs.mongodb.com/manual/reference/operator/aggregation/group/#aggregation-group-distinct-values
import time
start = time.time()
wordlist = list(db.tweets.aggregate( [ { "$group" : { "_id" : "$word" , "minRank": {"$min":"$rank"}} } ], allowDiskUse=True))
end = time.time()
print("elapsed time: "+str((end - start)*60))
wl = pd.DataFrame.from_dict(wordlist)
wl=wl[wl['minRank']!='Rank']
wl['minRank']=wl['minRank'].astype('int')
wl.to_csv(path_or_buf="wordlist_from-df.csv",index=False)
wl_filter = wl[wl['minRank']<5000]
wl_filter = wl_filter.sort_values(by="minRank")
wl_filter.to_csv(path_or_buf="wordlist_below5k.csv",index=False)