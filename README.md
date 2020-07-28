
# StoryWrangler
## Twitter nGram Viewer
All ngram timeseries are stored and served on Hydra, a server at the University of Vermont Complex Systems Center. This is a public resource for non-commercial use.

Before you continue reading, [check out the Github gist](https://gist.github.com/janeadams/da52c46ad1f51741711787d683222fb5) for querying the API in Python; this might help.

There are two methods for accessing onegrams:


## API
Public can access the production API for non-commercial use at `https://storywrangling.org/api/your api query`. Please don't automate mass scraping; if there is a large ngram subset you would like from the database, send us an email. This helps ensure everything keeps running for everyone else who would like to use the service.


### Parameters
All parameters except for the ngram query can occur in any order. The URL format is as follows:
`api/<query>?<parameter>=<value>&<parameter>=<value>&<parameter>=<value>`

Note that API URLs should not contain quote characters.


| Parameter | Description                                                      | Example Values                          |
|-----------|------------------------------------------------------------------|-----------------------------------------|
| query     | one or more ngrams to search<br>(goes immediately after `/api/`) | `#MeToo`,`does anyone else`,`😊` |
| metric    | which measure of lexical fame to return<br>(default is `rank`)   | `rank`,`freq`                  |
| language  | which language database to query<br>(default is English as `en`) | `en`,`es`,`ru`,`fr`                     |
| rt        | boolean for whether to include retweets<br>(default is `false`)  | `true`,`false`                          |
| src       | metadata for logging & debugging purposes<br>(default is `api`)  | `api`,`ui`                              |

Here is an [example query](https://storywrangling.org/api/%234645boricuas%20%23hurricanemaria%20%F0%9F%87%B5%F0%9F%87%B7%20hurac%C3%A1n?language=es&metric=freq&rt=true) searching the Spanish ngrams database for the frequencies of ngrams related to Hurricane Maria, from all tweets, including retweets:
`/api/%234645boricuas%20%23hurricanemaria%20%F0%9F%87%B5%F0%9F%87%B7%20hurac%C3%A1n?language=es&metric=freq&rt=true`

[Check out the Github gist](https://gist.github.com/janeadams/da52c46ad1f51741711787d683222fb5) for a sample API query using requests, pandas, json and csv.

### Accessing the API
There are two versions of the API: production ('prod') and development ('dev'). 


#### Production API Public Access
The production API is served on Hydra at port `:3001` and is accessed online at `https://storywrangling.org/api/your api query`


#### Development API UVM Internal Access
The development API is served on Hydra at port `:3000` (`https://hydra.uvm.edu:3000/api/your api query`). To access, you will need a UVM account and multi-factor authentication set up on your phone.

To access the development API:
- Connect to the UVM VPN at `sslvpn2.uvm.edu` using your UVM credentials and your MFA token from Duo
- Visit `http://hydra.uvm.edu:3000/api/your api query`

## UI

The production UI is accessible for public non-commercial use at `https://storywrangling.org`.


### Parameters
There are some default values specified in `setup.js`:

| Variable | Description                                                      | Example Values                          |
|-----------|------------------------------------------------------------------|-----------------------------------------|
| defaultNgrams    | Ngrams to pre-load on page load when none are specified in the URL   | `["hahaha","one two three","#friday","🦠"]`                  |
| suggestions  | Array of Ngrams to suggest in the query box (a new one is chosen at random on page load) | `["haha", "happy new year", "#throwbackthursday", "😊"]`                     |
| colors        | an object containing color names and hex codes  | keys: `['names','main','dark','light']`    


The UI takes several parameters, stored in the `params` object:

| Parameter | Description                                                      | Example Values                          |
|-----------|------------------------------------------------------------------|-----------------------------------------|
| metric    | string for which measure of lexical fame to return<br>(default is `'rank'`)   | `'rank'`, `'freq'`                  |
| language  | string for which language database to query<br>(default is English as `'en'`) | `'en'`,`'es'`,`'ru'`,`'fr'`                     |
| rt        | boolean for whether to include retweets<br>(default is `true`)  | `true`,`false`                          |
| scale       | string for visualization scale (linear or logarithmic)<br>(default is `'log'`)  | `'log'`,`'lin'`                              |
| start       | The date to start the view range; default is one year ago today  | `Fri Jul 31 2009`|
| end       | The date to start the view range; default is today  | `Thu Mar 28 2019`|

Ngrams are stored in a variable simply called `Ngrams` which is an array of string-type ngrams to display, e.g. `['#MeToo','does anyone else','😊']`.


### Accessing the UI

There are two versions of the UI: production ('prod') and development ('dev'). 

#### Production UI Public Access
The production UI is served on Hydra at port `:8050` and is accessed online at [storywrangling.org](https://storywrangling.org/)

#### Development UI UVM Internal Access
The production UI is served on Hydra at port `:8051`. To access, you will need a UVM account and multi-factor authentication set up on your phone.

To access the development UI:
- Connect to the UVM VPN at `sslvpn2.uvm.edu` using your UVM credentials and your MFA token from Duo
- Visit `http://hydra.uvm.edu:8051`
    
## Structure

The production-ready API and UI are both shared with the web at [storywrangling.org](https://storywrangling.org/) via Hydra ports `:3001` and `:8050`, respectively. The development versions of the API and UI are only accesible via UVM VPN (see "Accessing the API: Development API UVM Internal Access") via Hydra ports `:3000` and `:8051`, respectively.

### API
The API is built in Python, using PyMongo to access the MongoDB on Hydra. It is run on the server using Flask and UWSGI.

There are several key scripts and files in the API directory:

| Script/File       | Description                                                |
|--------------|------------------------------------------------------------|
| init_logs.py | Initializes logging into a `logs/` directory for debugging |
| uwsgi.py     | Starts the Flask App in `orm.py`                           |
| orm.py       | Main API code; ORM stands for object-relational mapping    |
| regexr.py    | Function for evaluating ngrams using `ngrams.bin`          |
| ngrams.bin   | Compiled regular expression for evaluating ngrams          |


### UI
The UI is built using D3.js v5 and JavaScript ES6. It is run on the server using Node. Data is queried from the API.

There are several key scripts in the UI `scripts/` directory:

| Script        | Description                                                                                           |
|---------------|-------------------------------------------------------------------------------------------------------|
| setup.js      | Sets default parameters and valid values; sets filters, sizing and ranges                             |
| url-parse.js  | Reads queries and parameters from the URL                                                             |
| filter.js     | Checks boxes on filters corresponding to parameters; monitors for changes                             |
| load-data.js  | Parse parameter selections into a URL query to the API;<br>format the returned data for visualization |
| query.js      | Handle new queries from the submission box; parse with `load-data.js`                                 |
| visualization.js | Visualization code (using D3)                                                                         |

