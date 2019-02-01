#!/usr/bin/env python
# coding: utf-8

# In[38]:


import pandas as pd
import dash
from dash.dependencies import Input, Output
import dash_core_components as dcc
import dash_html_components as html
from pandas_datareader import data as web
from datetime import datetime as dt


# In[39]:


mypath = "output/"
from os import listdir
from os.path import isfile, join
filelist = [f for f in listdir(mypath) if isfile(join(mypath, f))]
wordlist = [name[:-4] for name in filelist]


# In[40]:


def load(word):
    #df = pickle.load( open(str(mypath+word+".pkl")) )
    df = pd.read_csv(str(mypath+word+".txt"), sep=" ", skipinitialspace=True)
    df['Date'] = [dt.strptime(date, '%Y-%m-%d') for date in df['Date']]
    df['Year'] = [date.year for date in df['Date']]
    df['Day'] = [date.timetuple().tm_yday for date in df['Date']]
    return df


# In[42]:


options=[]
for word in wordlist:
    options.append({'label': word, 'value': word})


# In[49]:


app = dash.Dash()

app.layout = html.Div([
    html.H1('Twitter 1-grams'),
    dcc.Dropdown(
        id='my-dropdown',
        options = options,
        value=['digital','cyber','#innovation'],
        multi=True
    ),
    dcc.Graph(id='my-graph'),
])

@app.callback(Output('my-graph', 'figure'), [Input('my-dropdown', 'value')])
def update_graph(selected_dropdown_value):
    data=[]
    figure = {'data':data}
    for item in selected_dropdown_value:
        df = load(item)
        data.append({'x':df['Date'], 'y':df['Rank'],'name':item})
    return figure

if __name__ == '__main__':
    app.run_server()


# In[ ]:
