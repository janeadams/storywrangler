import pandas as pd
language_codes = pd.read_csv('language_codes.csv')
print(language_codes)
language = 'es'
if language in list(language_codes['db_code']):
	print('language in codes')
