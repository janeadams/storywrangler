from dashboard.setup import *
from dashboard.data import *

import plotly.io as pio
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go
from plotly.subplots import make_subplots

pio.templates.default = "plotly_white"


def make_ngram_plot(params, data):
    
    if params['rt']:
        col = params['metric']
    else:
        col = params['metric']+"_no_rt"
    
    ngram_plot = go.Figure()
    i = 0
    colors = px.colors.qualitative.Vivid
    for ngram in data.keys():
        ngram_plot.add_trace(go.Scatter(
            x=data[ngram].index,
            y=data[ngram][col],
            name=ngram,
            legendgroup=ngram,
            line = dict(color=colors[i]),
            connectgaps=False, # override default to connect the gaps
            hoverinfo = 'all'))
        ngram_plot.add_trace(go.Scatter(
            x=data[ngram].index,
            y=data[ngram][col],
            name=str(ngram+': no Gaps'),
            legendgroup=ngram,
            line = dict(dash='dot',color=colors[i]),
            connectgaps=True, # override default to connect the gaps
            hoverinfo = 'skip',
            showlegend=False))
        df = data[ngram]
        if params['metric'] in ['rank', 'odds']:
            max_df = df[df[col] == df[col].min()]
        else:
            max_df = df[df[col] == df[col].max()]

        ngram_plot.add_trace(go.Scatter(
            x=list(max_df.index),
            y=list(max_df[col]),
            name=ngram,
            legendgroup=ngram,
            mode='markers',
            opacity=0.3,
            marker = dict(color='red',size=15),
            showlegend=False,
            connectgaps=True,
            hoverinfo = 'skip',
            ))
        i+=1
    if params['scale']=='log':
        ngram_plot.update_yaxes(type='log')
    if params['metric'] in ['rank', 'odds']:
        ngram_plot.update_yaxes(autorange='reversed')
    ngram_plot.layout.hovermode = 'x unified'
    ngram_plot.update_layout(
        title=(resources['language_name_lookup'][params['language']]+" phrases: usage "+params['metric']+" over time").title(),
        xaxis_title="Date",
        yaxis_title=params['metric'].title(),
        #legend_title="Search terms",
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )
    return ngram_plot

def make_language_plot(params, data):
    col = params['metric']
    if params['metric'] in ['num', 'unique']:
        col = params['metric']+'_'+str(params['n'])+'grams'
        if not params['rt']:
            col = col+'_no_rt'
    elif params['metric'] in ['count','odds','rank']:
        if not params['rt']:
            col = params['metric']+'_no_rt'
    else:
        col = params['metric']
    language_plot = go.Figure()
    i = 0
    colors = px.colors.qualitative.Vivid
    for lang in params['languages']:
        
        name = resources['language_name_lookup'][lang]
        
        language_plot.add_trace(go.Scatter(
            x=data[lang].index,
            y=data[lang][col],
            name=name,
            legendgroup=lang,
            line = dict(color=colors[i]),
            connectgaps=False, # override default to connect the gaps
            hoverinfo = 'all'))
        
        language_plot.add_trace(go.Scatter(
            x=data[lang].index,
            y=data[lang][col],
            name=name,
            legendgroup=lang,
            line = dict(dash='dot',color=colors[i]),
            connectgaps=True, # override default to connect the gaps
            hoverinfo = 'skip',
            showlegend=False
        ))
        
        df = data[lang]
        if params['metric'] in ['rank', 'odds']:
            max_df = df[df[col] == df[col].min()]
        else:
            max_df = df[df[col] == df[col].max()]

        language_plot.add_trace(go.Scatter(
            x=list(max_df.index),
            y=list(max_df[col]),
            name=name,
            legendgroup=lang,
            mode='markers',
            opacity=0.3,
            marker = dict(color='red',size=15),
            showlegend=False,
            connectgaps=True,
            hoverinfo = 'skip',
            ))
        
        i+=1
    if params['scale']=='log':
        language_plot.update_yaxes(type='log')
    if params['metric'] in ['rank', 'odds']:
        language_plot.update_yaxes(autorange='reversed')
    language_plot.layout.hovermode = 'x unified'
    return language_plot

def make_divergence_table(params, data):
    if params['rt']:
        change_param = 'rank_change'
        change_title = 'Rank Change (with retweets)'
        contribution_param = 'rd_contribution'
        contribution_title = 'Rank Divergence Contribution (with retweets)'
    else:
        change_param = 'rank_change_noRT'
        change_title = 'Rank Change (organic tweets only)'
        contribution_param = 'rd_contribution_noRT'
        contribution_title = 'Rank Divergence Contribution (organic tweets only)'
    div_table = go.Figure(
        data=[go.Table(
            header=dict(values=['Term', change_title, contribution_title]),
            cells=dict(values=[data.index, data[change_param], data[contribution_param]]))
        ])
    return div_table

def make_divergence_plot(params, data):
    search_n = 10
    div_ngrams = list(data.index)[:search_n]
    nparams = {
        'ngrams': div_ngrams,
        'metric': 'rank',
        'scale': params['scale'],
        'rt': params['rt'],
        'language': params['language'],
        'viewer': 'ngrams'
    }
    ndata = get_ngram_data(nparams)
    div_plot = make_subplots(
        rows=search_n,
        cols=1,
        subplot_titles=list(ndata.keys()),
        #row_heights=list(np.ones(search_n)*400),
        shared_xaxes=True
    )
    i = 0
    colors = px.colors.qualitative.Vivid
    t2 = data.iloc[0]['time_2']
    for ngram in ndata.keys():

        div_plot.add_trace(go.Scatter(
            x=ndata[ngram].index,
            y=ndata[ngram][nparams['metric']],
            name=ngram,
            legendgroup=ngram,
            line = dict(color=colors[i]),
            showlegend=False,
            connectgaps=False,
            hoverinfo = 'all'),row=i+1, col=1)

        div_plot.add_trace(go.Scatter(
            x=ndata[ngram].index,
            y=ndata[ngram][nparams['metric']],
            name=ngram,
            legendgroup=ngram,
            line = dict(dash='dot', color=colors[i]),
            showlegend=False,
            connectgaps=True,
            hoverinfo = 'skip'
            ),row=i+1, col=1)

        df = ndata[ngram]
        divergence_df = df[df.index==t2]

        div_plot.add_trace(go.Scatter(
            x=list(divergence_df.index),
            y=list(divergence_df['rank']),
            name=ngram,
            legendgroup=ngram,
            mode='markers',
            opacity=0.3,
            marker = dict(color='red',size=15),
            showlegend=False,
            connectgaps=True,
            hoverinfo = 'skip',
            ),row=i+1, col=1)
        i+=1
    if params['scale']=='log':
        div_plot.update_yaxes(type='log')
    div_plot.update_yaxes(autorange='reversed')
    div_plot.layout.hovermode = 'x unified'
    #div_plot.layout.height=400*search_n
    div_plot.layout.height=800
    return div_plot

def make_plot(params, data):
    if params['viewer']=='ngrams':
        return make_ngram_plot(params, data)
    elif params['viewer']=='language':
        return make_language_plot(params, data)
    elif params['viewer']=='zipf':
        return make_zipf_plot(params, data)
    elif params['viewer']=='divergence':
            print(data)
            if params['plots']:
                return [make_divergence_table(params, data), make_divergence_plot(params, data)]
            else:
                return make_divergence_table(params, data)
    elif params['viewer']=='potusometer':
        return make_potusometer_plot(params, data)
    else:
        return ('Error')