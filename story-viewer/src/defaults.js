import {today, mostrecent, parseDate, formatDate, formatURLParams, parseArray} from "./utils"

export const defaults = (v => {
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return {
                'ngrams': ['covid','coronavirus'],
                'language': 'en',
                'languages': null,
                'rt': true,
                'metric': 'rank',
                'scale': 'log',
                'n': null,
                'queryDate': null
            }
        case ('languages'):
            return {
                'ngrams': null,
                'language': null,
                'languages': ['en','es','fr'],
                'rt': true,
                'metric': 'rank',
                'scale': 'lin',
                'n': 1,
                'queryDate': null
            }
        case ('rtd'):
        case ('zipf' ):
            return {
                'ngrams': null,
                'language': 'en',
                'languages': null,
                'rt': true,
                'metric': 'rank',
                'scale': 'log',
                'n': 1,
                'queryDate': formatDate(mostrecent)
            }
    }
})

export const options = (v,n) => {
    switch (v) {
        case ('ngrams'):
        case ('realtime'):
        case ('potus'):
            return {
                'rank': 'Rank',
                'odds': 'Odds',
                'freq': 'Frequency'
            }
        case ('languages'):
            return {
                'rank': 'Rank',
                'odds': 'Odds',
                'freq': 'Frequency',
                'count': 'Count',
                'comments': 'Comments',
                'retweets': 'Retweets',
                'speakers': 'Speakers',
                'tweets': 'Tweets',
                'num': 'Total Number of '+n+'-grams',
                'unique': 'Number of Unique '+n+'-grams'
            }
        case ('rtd'):
        case ('zipf'):
            return {
                'rank': 'Rank',
                'odds': 'Odds',
                'freq': 'Frequency'
            }
    }
}