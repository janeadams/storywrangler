
import datetime
import numpy as np
import pandas as pd
from tqdm import tqdm
from pymongo import MongoClient


class Query:
    """Class to work with n-gram db"""

    def __init__(self, db, lang, username="guest", pwd="roboctopus", port="27017"):
        """Python wrapper to access database on hydra.uvm.edu

        Args:
            db: database to use
            lang: language collection to use
            username: username to access database
            pwd: password to access database
        """
        client = MongoClient(f"mongodb://{username}:{pwd}@hydra.uvm.edu:{port}")
        db = client[db]

        self.database = db[lang]
        self.lang = lang
        self.lag = datetime.timedelta(days=2)
        self.last_updated = datetime.datetime.today() - self.lag

        self.db_cols = [
            "counts",
            "count_noRT",
            "rank",
            "rank_noRT",
            "freq",
            "freq_noRT",
        ]

        self.cols = [
            "count",
            "count_no_rt",
            "rank",
            "rank_no_rt",
            "freq",
            "freq_no_rt"
        ]

        self.lang_cols = [
            "ft_count",
            "ft_freq",
            "ft_rank",
            "ft_comments",
            "ft_retweets",
            "ft_speakers",
            "ft_tweets",
            "num_1grams",
            "num_2grams",
            "num_3grams",
            "unique_1grams",
            "unique_2grams",
            "unique_3grams",
            "num_1grams_no_rt",
            "num_2grams_no_rt",
            "num_3grams_no_rt",
            "unique_1grams_no_rt",
            "unique_2grams_no_rt",
            "unique_3grams_no_rt",
        ]

    def prepare_data(self, query, cols):
        return {
            d: {c: np.nan for c in cols}
            for d in pd.date_range(
                start=query["time"]["$gte"].date(),
                end=query["time"]["$lte"].date(),
                freq="D",
            ).date
        }

    def prepare_ngram_query(self, word, start=None, end=None):
        query = {
            "word": {"$in": word} if type(word) is list else word,
            "time": {
                "$gte": start if start else datetime.datetime(2009, 1, 1),
                "$lte": end if end else self.last_updated,
            }
        }
        return query, self.prepare_data(query, self.cols)

    def prepare_lang_query(self, lang=None, start=None, end=None):
        query = {
            "language": lang if lang else "_all",
            "time": {
                "$gte": start if start else datetime.datetime(2009, 1, 1),
                "$lte": end if end else self.last_updated,
            }
        }
        return query, self.prepare_data(query, self.lang_cols)

    def prepare_day_query(self, date=None):
        return {"time": date if date else self.last_updated}

    def query_ngram(self, word, start_time=None, end_time=None):
        """Query database for n-gram timeseries

        Args:
            word (string): target ngram
            start_time (datetime): starting date for the query
            end_time (datetime): ending date for the query

        Returns (pd.DataFrame):
            dataframe of ngrams usage over time
        """
        query, data = self.prepare_ngram_query(word, start_time, end_time)

        for i in self.database.find(query):
            d = i["time"].date()
            for c, db in zip(self.cols, self.db_cols):
                data[d][c] = i[db]

        df = pd.DataFrame.from_dict(data=data, orient="index")
        return df

    def query_ngrams_array(self, word_list, start_time=None, end_time=None):
        """Query database for an array n-gram timeseries

        Args:
            word_list (list): list of strings to query mongo
            start_time (datetime): starting date for the query
            end_time (datetime): ending date for the query

        Returns (pd.DataFrame):
            dataframe of ngrams usage over time
        """

        query, data = self.prepare_ngram_query(word_list, start_time, end_time)

        df = pd.DataFrame(list(self.database.find(query)))
        df.set_index("word", inplace=True, drop=False)

        tl_df = pd.DataFrame(word_list)
        tl_df.set_index(0, inplace=True)

        df = tl_df.join(df)
        df["word"] = df.index
        df.drop("_id", axis=1, inplace=True)
        cols = {d: k for d, k in zip(self.db_cols, self.cols)}
        cols.update({"word": "ngram"})
        df.rename(columns=cols, inplace=True)
        df.reset_index(drop=True, inplace=True)
        return df

    def query_languages(self, lang, start_time=None, end_time=None):
        """Query database for language timeseries

        Args:
            lang (string): target language
            start_time (datetime): starting date for the query
            end_time (datetime): ending date for the query

        Returns (pd.DataFrame):
            dataframe of language over time
        """
        query, data = self.prepare_lang_query(lang, start_time, end_time)

        for i in self.database.find(query):
            d = i["time"].date()
            for c in self.lang_cols:
                try:
                    if np.isnan(data[d][c]):
                        data[d][c] = i[c]
                    else:
                        data[d][c] += i[c]
                except KeyError:
                    pass

        df = pd.DataFrame.from_dict(data=data, orient="index")
        df.columns = df.columns.str.replace(r"ft_", "")

        df["count_no_rt"] = df["count"] - df["retweets"]
        df["rank_no_rt"] = df["count_no_rt"].rank(method="average", ascending=False)
        df["freq_no_rt"] = df["count_no_rt"] / df["count_no_rt"].sum()
        return df

    def query_day(self, date):
        """Query database for all ngrams in a single day

        Args:
            date (datetime): target date

        Returns (pd.DataFrame):
            dataframe of ngrams
        """
        query = self.prepare_day_query(date)
        zipf = {}
        for t in tqdm(
            self.database.find(query),
            desc="Retrieving ngrams",
            unit=""
        ):
            zipf[t["word"]] = {}
            for c, db in zip(self.cols, self.db_cols):
                zipf[t["word"]][c] = t[db]

        df = pd.DataFrame.from_dict(data=zipf, orient="index")
        return df
