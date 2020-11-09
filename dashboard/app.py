from dashboard.setup import *
from dashboard.data import *
from dashboard.viz import *
from dashboard.layout import *
import pandas as pd
import time

app = dash.Dash(__name__, suppress_callback_exceptions=True)
    

app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content'),
    dcc.Loading(
        id="loading-page",
        type="default"
    )
])

@app.callback([Output('url', 'href'), Output('loading-plot','children')],
              [Input('search-button', 'n_clicks')],
              [State({'type': 'options', 'index': ALL}, 'id'),
                State({'type': 'options', 'index': ALL}, 'value')
              ])
def search(search, ids, values):
    print('SEARCH BUTTON CLICKED')
    print(f'state ids: {ids}')
    print(f'state values: {values}')
    params = get_state_params(ids, values)
    url = build_url(params)
    plot = build_plot(params)
    return url, plot

@app.callback(Output('options-menu', 'children'),
              [Input({'type': 'options', 'index': 'viewer'}, 'value')],
              [State({'type': 'options', 'index': ALL}, 'id'),
                State({'type': 'options', 'index': ALL}, 'value')
              ]
             )
def update_options(viewer, ids, values):
    print(f'state ids: {ids}')
    print(f'state values: {values}')
    params = get_state_params(ids, values)
    options = build_all_options(params)
    return options
    


# Update the index
@app.callback(Output('loading-page', 'children'),
              [Input('url', 'href')])
def display_page(href):
    print(f'DISPLAY PAGE callback called on href {href}')
    params = get_url_params(href)
    layout = build_page_layout(params)
    return layout


if __name__ == '__main__':
    app.run_server(debug=False, port=8052)