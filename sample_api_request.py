import requests
import json
import pandas as pd
import csv

query = "one two three four"
language = "es"
metric = "rank"
rt = "false"

r = requests.get(f"https://storywrangling.org/api/{query}?language={language}&metric={metric}&rt={rt}").json()

dfs = {}
for ngram in r['ngrams']:
    dfs[ngram] = pd.DataFrame(r['ngramdata'][ngram]['data'], columns=['date',r['metric']])
    
for ngram in dfs:
    dfs[ngram].to_csv(f"{ngram}-{r['metric']}.csv")