import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio

def viz_multi(ngrams, output=None):
    fig = go.Figure()
    for ngram in ngrams:
        df = pd.read_csv(f'capitol/top_ngrams/{ngram}.csv')
        fig.add_trace(go.Scatter(x=df['time'], y=df['rank'],
                            mode='lines',
                            name=ngram))
    fig.update_yaxes(autorange="reversed",type="log")
    fig.update_layout(template='plotly_white')
    if output:
        fig.write_html(f"capitol/{output}/{ngram}.html")
    else:
        fig.show()
    return

def viz_single(ngram, src="top_ngrams", output="top_1k_viz"):
    df = pd.read_csv(f'capitol/{src}/{ngram}.csv')
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df['time'], y=df['rank'],
                        mode='lines',
                        name=ngram))
    fig.update_yaxes(autorange="reversed",type="log")
    fig.update_layout(template='plotly_white', title=ngram)
    if output:
        fig.write_html(f"capitol/{output}/{ngram}.html")
    else:
        fig.show()
    return

def viz_top1k(folder='zipf_1grams'):
    top1k = pd.read_csv(f'capitol/{folder}.csv')['ngram'][:1000]
    for ngram in top1k:
        viz_single(ngram)
    return