
##################
Storywrangler API
##################

.. contents::


Description
###########

The `Storywrangler <https://gitlab.com/compstorylab/storywrangler>`__
project is a curation of Twitter into day-scale usage ranks and
frequencies of 1-, 2-, and 3-grams for over 150 billion tweets in 100+
languages from 2008 and updated on a daily basis. The massive
sociolinguistic dataset accounts for social amplification of
:math:`n`-grams via retweets, which can be visualized through time
series
`contagiograms <https://gitlab.com/compstorylab/contagiograms>`__. The
project is intended to enable or enhance the study of any large-scale
temporal phenomena where people matter including culture, politics,
economics, linguistics, public health, conflict, climate change, and
data journalism.

Installation
############

You can install the latest verion by cloning the repo and running
`setup.py <setup.py>`__ script in your terminal

Setuptools
**********

.. code:: shell

    git clone https://gitlab.com/compstorylab/storywrangling.git
    cd storywrangling
    python setup.py install 

Install Development Version
***************************

.. code:: shell

    git clone https://gitlab.com/compstorylab/storywrangling.git
    cd storywrangling
    pip install -e .

Anaconda
********

This will create a new conda environment (``storywrangling``) with all
required dependencies.

.. code:: shell

    conda env create -q -f requirements.yml


Backend
########
All :math:`n`-gram timeseries are stored and served on `Hydra`, a server
at the `Vermont Complex Systems Center <https://vermontcomplexsystems.org/>`__.
Further details about our backend infrastructure 
and our Twitter stream processing framework 
can be found on our Gitlab
`repository <https://gitlab.com/compstorylab/storywrangler>`__.


Online Viewer
#############

Our viewer can be accessed online at
`storywrangling.org <https://storywrangling.org/>`__. We do provide a
simple way to download these daily :math:`n`-gram timeseries as JSON
files via the UI.


Python Module
##############

Here, we provide a Python module to query our MongoDB
on `Hydra`.

    If there is a large subset of :math:`n`-grams you would like from
    our database, please send us an email.


Getting started
***************

Import our library and create an instance of the master
`Storywrangler() <storywrangling/api.py>`__ class object.

.. code:: python

    from datetime import datetime
    from storywrangling import Storywrangler    

    storywrangler = Storywrangler()

The ``Storywrangler()`` class provides a set of methods 
to access our database. 
We outline some of the main methods below. 


A single n-gram timeseries
***************************

You can get a dataframe of usage rate for a single n-gram timeseries
by using the ``get_ngram()`` method.

================  ========  ======================  =============================
Argument                                            Description
--------------------------------------------------  -----------------------------
Name              Type      Default
================  ========  ======================  =============================
``ngram``         str       required                target 1-, 2-, or 3-gram  
``lang``          str       "\_all"                 target language (iso code)
``start_time``    datetime  datetime(2009, 1, 1)    starting date for the query
``end_time``      datetime  last\_updated           ending date for the query
================  ========  ======================  =============================

    See `supported\_languages.json <resources/supported_languages.json>`__
    for a list of all supported languages.

**Example code**

.. code:: python

    ngram = storywrangler.get_ngram(
      "Black Lives Matter",
      lang="en",
      start_time=datetime(2010, 1, 1),
      end_time=datetime(2020, 1, 1),
    )

**Expected output**

A single Pandas dataframe (see `ngram_example.tsv <tests/ngram_example.tsv>`__).

================  =============================================
Argument          Description
================  =============================================
``time``          Pandas `DatetimeIndex`   
``count``         usage rate in all tweets (AT)
``count_no_rt``   usage rate in organic tweets (OT)
``freq``          normalized frequency in all tweets (AT)
``freq_no_rt``    normalized frequency in organic tweets (OT)
``rank``          usage tied-rank in all tweets (AT)
``rank_no_rt``    usage tied-rank in organic tweets (OT)
================  =============================================




A list of n-grams from one language
************************************

If you have a list of :math:`n`-grams, 
then you can use the ``get_ngrams_array()`` method 
to retrieve a dataframe of usage rates in a single langauge.


================  ========  ======================  ===============================
Argument                                            Description
--------------------------------------------------  -------------------------------
Name              Type      Default
================  ========  ======================  ===============================
``ngrams``        list      required                a list of 1-, 2-, or 3-grams  
``lang``          str       "\_all"                 target language (iso code)
``database``      str       "1grams"                target database collection
``start_time``    datetime  datetime(2009, 1, 1)    starting date for the query
``end_time``      datetime  last\_updated           ending date for the query
================  ========  ======================  ===============================


**Example code**

.. code:: python

    ngrams = ["Higgs", "#AlphaGo", "CRISPR", "#AI", "LIGO"]
    ngrams_df = storywrangler.get_ngrams_array(
      ngrams,
      lang="en",
      database="1grams",
      start_time=datetime(2010, 1, 1),
      end_time=datetime(2020, 1, 1),
    )

All :math:`n`-grams should be in one langauge and one database collection.


**Expected output**

A single Pandas dataframe (see `ngrams_array_example.tsv <tests/ngrams_array_example.tsv>`__).

================  =============================================
Argument          Description
================  =============================================
``time``          Pandas `DatetimeIndex`   
``ngram``          requested n-gram  
``count``         usage rate in all tweets (AT)
``count_no_rt``   usage rate in organic tweets (OT)
``freq``          normalized frequency in all tweets (AT)
``freq_no_rt``    normalized frequency in organic tweets (OT)
``rank``          usage tied-rank in all tweets (AT)
``rank_no_rt``    usage tied-rank in organic tweets (OT)
================  =============================================




A list of n-grams across several languages
******************************************

To request a list of :math:`n`-grams across several languages, 
you can use the ``get_ngrams_tuples()`` method.

===============  ============  ======================  ================================
Argument                                               Description
-----------------------------------------------------  --------------------------------
Name             Type          Default
===============  ============  ======================  ================================
``ngrams``       list(tuples)  required                a list of ("n-gram", "iso-code")  
``start_time``   datetime      datetime(2009, 1, 1)    starting date for the query
``end_time``     datetime      last\_updated           ending date for the query
===============  ============  ======================  ================================



**Example code**

.. code:: python

    examples = [
      ('😊', '_all'),
      ('2018', '_all'),
      ('Christmas', 'en'),
      ('Pasqua', 'it'),
      ('eleição', 'pt'),
      ('sommar', 'sv'),
      ('Olympics', 'en'),
      ('World Cup', 'en'),
      ('#AlphaGo', 'en'),
      ('gravitational waves', 'en'),
      ('black hole', 'en'),
      ('Papa Francesco', 'it'),
      ('coronavirus', 'en'),
      ('Libye', 'fr'),
      ('Suriye', 'tr'),
      ('Росія', 'uk'),
      ('ثورة', 'ar'),
      ('Occupy', 'en'),
      ('Black Lives Matter', 'en'),
      ('Brexit', 'en'),
      ('#MeToo', 'en'),
    ]
    ngrams_array = storywrangler.get_ngrams_tuples(
      examples,
      start_time=datetime(2010, 1, 1),
      end_time=datetime(2020, 1, 1),
    )

**Expected output**

A single Pandas dataframe (see `ngrams_multilang_example.tsv <tests/ngrams_multilang_example.tsv>`__).

================  =============================================
Argument          Description
================  =============================================
``time``          Pandas `DatetimeIndex`   
``ngram``         requested n-gram  
``lang``          requested language
``count``         usage rate in all tweets (AT)
``count_no_rt``   usage rate in organic tweets (OT)
``freq``          normalized frequency in all tweets (AT)
``freq_no_rt``    normalized frequency in organic tweets (OT)
``rank``          usage tied-rank in all tweets (AT)
``rank_no_rt``    usage tied-rank in organic tweets (OT)
================  =============================================



Zipf distribution for a given day
**********************************

To get the Zipf distribution of all 
:math:`n`-grams in our database for a given language on a signle day,
please use the ``get_zipf_dist()`` method:

==============  ========  ======================  ===============================
Argument                                          Description
------------------------------------------------  -------------------------------
Name            Type      Default
==============  ========  ======================  ===============================
``date``        datetime  required                target date 
``lang``        str       "\_all"                 target language (iso code)
``database``    str       "1grams"                target database collection
==============  ========  ======================  ===============================


**Example code**

.. code:: python

    ngrams_zipf = storywrangler.get_zipf_dist(
      date=datetime(2010, 1, 1),
      lang="en",
      database="1grams"
    )


**Expected output**

A single Pandas dataframe (see `ngrams_zipf_example.tsv <tests/ngrams_zipf_example.tsv.gz>`__).

================  =============================================
Argument          Description
================  =============================================
``ngram``         requested n-gram  
``count``         usage rate in all tweets (AT)
``count_no_rt``   usage rate in organic tweets (OT)
``freq``          normalized frequency in all tweets (AT)
``freq_no_rt``    normalized frequency in organic tweets (OT)
``rank``          usage tied-rank in all tweets (AT)
``rank_no_rt``    usage tied-rank in organic tweets (OT)
================  =============================================



Language usage over time
**************************

To get a timeseries of usage rate for a given language,
you can use the ``get_lang()`` method:

==============  ============  ======================  ================================
Argument                                              Description
----------------------------------------------------  --------------------------------
Name            Type          Default
==============  ============  ======================  ================================
``lang``        str           "\_all"                 target language (iso code)
``start_time``  datetime      datetime(2009, 1, 1)    starting date for the query
``end_time``    datetime      last\_updated           ending date for the query
==============  ============  ======================  ================================


**Example code**

.. code:: python

    lang = storywrangler.get_lang(
        "en",
        start_time=datetime(2010, 1, 1),
    )


**Expected output**

A single Pandas dataframe (see `lang_example.tsv <tests/lang_example.tsv>`__).


========================  ===================================================
Argument                  Description
========================  ===================================================
``time``                  Pandas `DatetimeIndex`   
``count``                 usage rate of all tweets (AT)
``count_no_rt``           usage rate of organic tweets (OT)
``freq``                  normalized frequency of all tweets (AT)
``freq_no_rt``            normalized frequency of organic tweets (OT)
``rank``                  usage tied-rank of all tweets (AT)
``rank_no_rt``            usage tied-rank of organic tweets (OT)
``num_1grams``            volume of 1-grams in all tweets (AT)
``num_1grams_no_rt``      volume of 1-grams in organic tweets (OT)
``num_2grams``            volume of 2-grams in all tweets (AT)
``num_2grams_no_rt``      volume of 3-grams in organic tweets (OT)
``num_3grams``            volume of 3-grams in all tweets (AT)
``num_3grams_no_rt``      volume of 3-grams in organic tweets (OT)
``unique_1grams``         number of unique 1-grams in all tweets (AT)
``unique_1grams_no_rt``   number of unique 1-grams in organic tweets (OT)
``unique_2grams``         number of unique 2-grams in all tweets (AT)
``unique_2grams_no_rt``   number of unique 2-grams in organic tweets (OT)
``unique_3grams``         number of unique 3-grams in all tweets (AT)
``unique_3grams_no_rt``   number of unique 3-grams in organic tweets (OT)
========================  ===================================================


Citation
########

See the following paper for more details, 
and please cite it if you use
our dataset:

    Alshaabi, T., Adams, J. L., Arnold, M. V., Minot, J. R., Dewhurst, 
    D. R., Reagan, A. J., Danforth, C. M., & Dodds, P. S. (2020). 
    `Storywrangler: A massive exploratorium for sociolinguistic, cultural, 
    socioeconomic, and political timelines using Twitter 
    <https://arxiv.org/abs/2007.12988>`__. 
    *arXiv preprint arXiv:2007.12988*.


For more information regarding 
our tweet's language identification and detection framework,
please see the following paper: 

    Alshaabi, T., Dewhurst, D. R., Minot, J. R., Arnold, M. V., 
    Adams, J. L., Danforth, C. M., & Dodds, P. S. (2020). 
    `The growing echo chamber of social media: 
    Measuring temporal and social contagion dynamics 
    for over 150 languages on Twitter for 2009--2020
    <https://arxiv.org/abs/2003.03667>`__.
    *arXiv preprint arXiv:2003.03667*.