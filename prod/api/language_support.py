import json
language_support = {}

for grams in ['1grams','2grams','3grams']:
    with open(grams+'.json', 'r') as file:
        languages = []
        for key, value in json.load(file).items():
            if value==True: languages.append(key)
        language_support[grams] = languages
        
with open('1grams.json', 'r') as file:
    languages = []
    for key in json.load(file).keys():
        languages.append(key)
    language_support['all'] = languages

with open('language_support.json', 'w') as outfile:
    json.dump(language_support, outfile)
