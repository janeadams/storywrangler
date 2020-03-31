
# Twitter Onegram Viewer
All ngram timeseries are stored and served on Hydra, a server at the University of Vermont Complex Systems Center.

There are two methods for accessing onegrams:


## API

There are two versions of the API: Production and Dev. The Production API is housed on Hydra at port `:3001` and is accessed online at `https://storywrangling.org/api/test`

The Dev API is housed on Hydra at port `:3000` (`https://hydra.uvm.edu:3000/api/test`).

### Parameters
The API takes several parameters:

| Parameter | Description                                                      | Example Values                          |
|-----------|------------------------------------------------------------------|-----------------------------------------|
| query     | one or more ngrams to search<br>(goes immediately after `/api/`) | `#MeToo`,`does anyone else`,`😊` |
| metric    | which measure of lexical fame to return<br>(default is `rank`)   | `rank`,`counts`,`freq`                  |
| language  | which language database to query<br>(default is English as `en`) | `en`,`es`,`ru`,`fr`                     |
| RT        | boolean for whether to include retweets<br>(default is `false`)  | `true`,`false`                          |
| src       | metadata for logging & debugging purposes<br>(default is `api`)  | `api`,`ui`                              |

All parameters except for the ngram query can occur in any order. The URL format is as follows:
`api/<query>?<parameter>=<value>&<parameter>=<value>&<parameter>=<value>`

Here is an example query searching the Spanish ngrams database for the frequencies of ngrams related to Hurricane Maria, from all tweets, including retweets:
`api/#4645boricuas,#hurricanemaria,🇵🇷?metric=freq&language=es&RT=true`

### Accessing the API

#### Production API Public Access
Public can access the Production API from `https://storywrangling.org/api/`. Please don't automate mass scraping; if there is a large ngram subset you would like from the database, shoot us an email. This helps ensure everything keeps running for everyone else who would like to use the service.

#### Development API UVM Internal Access
You will need a UVM account and multi-factor authentication set up on your phone.

To access the Dev API:
- Connect to the UVM VPN at `sslvpn2.uvm.edu` using your UVM credentials and your MFA token from Duo
- Visit `http://hydra.uvm.edu:3000/api/happy new year` (or whatever ngrams you would like to query)

## UI
The UI is currently generated from a Jupyter Notebook using Dash (a Flask-based graphing dashboard from Plotly). This will be replaced in the future by a React app, likely running D3 with Semiotic.

<img src="notes/ui.jpg">

To use the UI from a local machine:
- `ssh username@hydra.uvm.edu`
- Clone this Github repository to your user folder on Hydra
- Set up a testing environment called `test_env` using `source activate test_env` and install the dependencies listed in `requirements.txt`
- `jupyter notebook --port=9994`
- In another Terminal window, mirror the Jupyter notebook:
- `ssh -N -L localhost:9994:localhost:9994 username@hydra.uvm.edu`
- Open `hydra_dash_test.ipynb` and run using `test_env` as the kernel
- In another Terminal window, mirror the Flask app running on Hydra:
- `ssh -N -L localhost:8050:localhost:8050 username@hydra.uvm.edu`
- Visit http://127.0.0.1:8050/

    
## Structure

The production-ready API and UI are both shared with the web at `storywrangling.org` via Hydra ports `:3001` and `:8050`, respectively. The development versions of the API and UI are only accesible via UVM VPN (see "Accessing the API: Development API UVM Internal Access") via Hydra ports `:3000` and `:8051`, respectively.

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
| timeseries.js | Visualization code (using D3)                                                                         |

