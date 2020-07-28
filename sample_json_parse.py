import json
import pandas as pd
import csv

data = {}

with open('storywrangler_data.json') as json_file:
    data = json.load(json_file)
    for ngram in data['metadata']['ngrams']:
        ngrams.append(ngram)
        dfs[ngram] = pd.DataFrame(data['data'][ngram], columns=['date',data['metadata']['metric']])
        
for ngram in dfs:
    dfs[ngram].to_csv(f"{ngram}-{data['metadata']['language']}-{data['metadata']['metric']}.csv")