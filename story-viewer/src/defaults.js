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
                'languages': ['English','Spanish','French'],
                'rt': true,
                'metric': 'speakers',
                'scale': 'lin',
                'n': 1,
                'queryDate': null
            }
        case ('rtd'):
            return {
                'metric': 'rd_contribution',
                'ngrams': null,
                'language': 'en',
                'languages': null,
                'rt': true,
                'scale': 'lin',
                'n': 1,
                'queryDate': formatDate(mostrecent)
            }
        case ('zipf' ):
            return {
                'ngrams': null,
                'language': 'en',
                'languages': null,
                'rt': true,
                'metric': 'freq',
                'scale': 'lin',
                'n': 1,
                'queryDate': formatDate(mostrecent)
            }
    }
})

export const metricOptions = (v,n) => {
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
            return {
                'rd_contribution': 'Rank-Divergence Contribution',
                'rank_change': "Rank Change"
            }
        case ('zipf'):
            return {
                'rank': 'Rank',
                'odds': 'Odds',
                'freq': 'Frequency'
            }
    }
}

export const languageOptions = (v) => {
    switch (v) {
        case ('realtime'):
            return {
                'en': 'English',
                'fr': 'French',
                'es': 'Spanish'
            }
        case ('ngrams'):
        case ('languages'):
        case ('rtd'):
        case ('zipf'):
            return {
            'af': 'Afrikaans',
            'sq': 'Albanian',
            'ar': 'Arabic',
            'an': 'Aragonese',
            'hy': 'Armenian',
            'ast': 'Asturian',
            'az': 'Azerbaijani',
            'eu': 'Basque',
            'be': 'Belarusian',
            'bn': 'Bengali',
            'bs': 'Bosnian',
            'br': 'Breton',
            'bg': 'Bulgarian',
            'ca': 'Catalan',
            'ceb': 'Cebuano',
            'ckb': 'Central-Kurdish',
            'cbk': 'Chavacano',
            'hr': 'Croatian',
            'cs': 'Czech',
            'da': 'Danish',
            'nl': 'Dutch',
            'en': 'English',
            'eo': 'Esperanto',
            'et': 'Estonian',
            'fi': 'Finnish',
            'fr': 'French',
            'fy': 'Frisian',
            'gl': 'Gallegan',
            'ka': 'Georgian',
            'de': 'German',
            'el': 'Greek',
            'gu': 'Gujarati',
            'he': 'Hebrew',
            'hi': 'Hindi',
            'hu': 'Hungarian',
            'is': 'Icelandic',
            'io': 'Ido',
            'ilo': 'Iloko',
            'id': 'Indonesian',
            'ia': 'Interlingua',
            'ie': 'Interlingue',
            'ga': 'Irish',
            'it': 'Italian',
            'kn': 'Kannada',
            'kk': 'Kazakh',
            'ko': 'Korean',
            'ku': 'Kurdish',
            'la': 'Latin',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'jbo': 'Lojban',
            'lb': 'Luxembourgish',
            'mk': 'Macedonian',
            'mg': 'Malagasy',
            'ml': 'Malayalam',
            'mr': 'Marathi',
            'mzn': 'Mazanderani',
            'min': 'Minangkabau',
            'mn': 'Mongolian',
            'ne': 'Nepali',
            'no': 'Norwegian',
            'nn': 'Nynorsk',
            'oc': 'Occitan',
            'fa': 'Persian',
            'pl': 'Polish',
            'pt': 'Portuguese',
            'ps': 'Pushto',
            'qu': 'Quechua',
            'ro': 'Romanian',
            'ru': 'Russian',
            'nds': 'Saxon',
            'sr': 'Serbian',
            'sh': 'Serbo-Croatian',
            'sd': 'Sindhi',
            'si': 'Sinhala',
            'sk': 'Slovak',
            'sl': 'Slovenian',
            'azb': 'South-Azerbaijani',
            'es': 'Spanish',
            'sw': 'Swahili',
            'sv': 'Swedish',
            'tl': 'Tagalog',
            'ta': 'Tamil',
            'te': 'Telugu',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'ur': 'Urdu',
            'uz': 'Uzbek',
            'vi': 'Vietnamese',
            'war': 'Waray',
            'cy': 'Welsh',
            'pnb': 'Western-Panjabi'
            }
    }
}

export const languageValueOptions = (v) => {
    switch (v) {
        case ('realtime'):
            return [
                {'value': 'en', 'label':'English'},
                {'value': 'fr', 'label':'French'},
                {'value': 'es', 'label':'Spanish'}
            ]
        case ('ngrams'):
        case ('languages'):
        case ('rtd'):
        case ('zipf'):
            return [{'value': 'af', 'label': 'Afrikaans'},
                {'value': 'sq', 'label': 'Albanian'},
                {'value': 'ar', 'label': 'Arabic'},
                {'value': 'an', 'label': 'Aragonese'},
                {'value': 'hy', 'label': 'Armenian'},
                {'value': 'ast', 'label': 'Asturian'},
                {'value': 'az', 'label': 'Azerbaijani'},
                {'value': 'eu', 'label': 'Basque'},
                {'value': 'be', 'label': 'Belarusian'},
                {'value': 'bn', 'label': 'Bengali'},
                {'value': 'bs', 'label': 'Bosnian'},
                {'value': 'br', 'label': 'Breton'},
                {'value': 'bg', 'label': 'Bulgarian'},
                {'value': 'ca', 'label': 'Catalan'},
                {'value': 'ceb', 'label': 'Cebuano'},
                {'value': 'ckb', 'label': 'Central-Kurdish'},
                {'value': 'cbk', 'label': 'Chavacano'},
                {'value': 'hr', 'label': 'Croatian'},
                {'value': 'cs', 'label': 'Czech'},
                {'value': 'da', 'label': 'Danish'},
                {'value': 'nl', 'label': 'Dutch'},
                {'value': 'en', 'label': 'English'},
                {'value': 'eo', 'label': 'Esperanto'},
                {'value': 'et', 'label': 'Estonian'},
                {'value': 'fi', 'label': 'Finnish'},
                {'value': 'fr', 'label': 'French'},
                {'value': 'fy', 'label': 'Frisian'},
                {'value': 'gl', 'label': 'Gallegan'},
                {'value': 'ka', 'label': 'Georgian'},
                {'value': 'de', 'label': 'German'},
                {'value': 'el', 'label': 'Greek'},
                {'value': 'gu', 'label': 'Gujarati'},
                {'value': 'he', 'label': 'Hebrew'},
                {'value': 'hi', 'label': 'Hindi'},
                {'value': 'hu', 'label': 'Hungarian'},
                {'value': 'is', 'label': 'Icelandic'},
                {'value': 'io', 'label': 'Ido'},
                {'value': 'ilo', 'label': 'Iloko'},
                {'value': 'id', 'label': 'Indonesian'},
                {'value': 'ia', 'label': 'Interlingua'},
                {'value': 'ie', 'label': 'Interlingue'},
                {'value': 'ga', 'label': 'Irish'},
                {'value': 'it', 'label': 'Italian'},
                {'value': 'kn', 'label': 'Kannada'},
                {'value': 'kk', 'label': 'Kazakh'},
                {'value': 'ko', 'label': 'Korean'},
                {'value': 'ku', 'label': 'Kurdish'},
                {'value': 'la', 'label': 'Latin'},
                {'value': 'lv', 'label': 'Latvian'},
                {'value': 'lt', 'label': 'Lithuanian'},
                {'value': 'jbo', 'label': 'Lojban'},
                {'value': 'lb', 'label': 'Luxembourgish'},
                {'value': 'mk', 'label': 'Macedonian'},
                {'value': 'mg', 'label': 'Malagasy'},
                {'value': 'ml', 'label': 'Malayalam'},
                {'value': 'mr', 'label': 'Marathi'},
                {'value': 'mzn', 'label': 'Mazanderani'},
                {'value': 'min', 'label': 'Minangkabau'},
                {'value': 'mn', 'label': 'Mongolian'},
                {'value': 'ne', 'label': 'Nepali'},
                {'value': 'no', 'label': 'Norwegian'},
                {'value': 'nn', 'label': 'Nynorsk'},
                {'value': 'oc', 'label': 'Occitan'},
                {'value': 'fa', 'label': 'Persian'},
                {'value': 'pl', 'label': 'Polish'},
                {'value': 'pt', 'label': 'Portuguese'},
                {'value': 'ps', 'label': 'Pushto'},
                {'value': 'qu', 'label': 'Quechua'},
                {'value': 'ro', 'label': 'Romanian'},
                {'value': 'ru', 'label': 'Russian'},
                {'value': 'nds', 'label': 'Saxon'},
                {'value': 'sr', 'label': 'Serbian'},
                {'value': 'sh', 'label': 'Serbo-Croatian'},
                {'value': 'sd', 'label': 'Sindhi'},
                {'value': 'si', 'label': 'Sinhala'},
                {'value': 'sk', 'label': 'Slovak'},
                {'value': 'sl', 'label': 'Slovenian'},
                {'value': 'azb', 'label': 'South-Azerbaijani'},
                {'value': 'es', 'label': 'Spanish'},
                {'value': 'sw', 'label': 'Swahili'},
                {'value': 'sv', 'label': 'Swedish'},
                {'value': 'tl', 'label': 'Tagalog'},
                {'value': 'ta', 'label': 'Tamil'},
                {'value': 'te', 'label': 'Telugu'},
                {'value': 'tr', 'label': 'Turkish'},
                {'value': 'uk', 'label': 'Ukrainian'},
                {'value': 'ur', 'label': 'Urdu'},
                {'value': 'uz', 'label': 'Uzbek'},
                {'value': 'vi', 'label': 'Vietnamese'},
                {'value': 'war', 'label': 'Waray'},
                {'value': 'cy', 'label': 'Welsh'},
                {'value': 'pnb', 'label': 'Western-Panjabi'}]
    }
}