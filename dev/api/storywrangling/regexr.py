import html
import re
from collections import Counter


def html2unicode(code):
    """ Converts HTML entities to unicode ('&amp;' => '&') """
    return html.unescape(code)


def hex2unicode(code):
    """ Converts hex-values to unicode ('1F609' => '😉') """
    code = [r"\U" + x.zfill(8) for x in code.split()]
    code = "".join(code)
    return bytes(code, "ascii").decode("unicode-escape")


def remove_whitespaces(text):
    """ Strip out extra whitespaces
    Args:
        text: a string

    Returns: cleaned text
    """
    text = re.sub(r"\s\s+", " ", text)
    text = re.sub(r"\n|\t", " ", text)
    text = re.sub(
        u"\u20e3|\ufe0f|\u2800|\u200b|\u200c|\u200d|<200b>|<200c>|<200d>", "", text
    )
    text = text.strip()
    return html2unicode(text)


def ngram_parser(text, ngram_parser):
    """ Parse out N-grams using a custom regex
    Args:
        text: a string object
        ngram_parser: a compiled regex expression to extract one-grams

    Returns: a list of 1-grams
    """
    # take care of a few edge cases
    text = re.sub(r"(([\-\.]{2,})|(\'\'))", r" \1 ", text)
    return [x[0] for x in ngram_parser.findall(text) if x[0] != ""]


def nparser(s, parser, n=1):
    """ Concatenate tokens into ngrams
    Args:
        s: a string object
        parser: a compiled regex expression to extract one-grams
        n: the degree of the ngrams

    Returns: a Counter object of n-grams
    """
    tokens = ngram_parser(s, parser)

    if len(tokens) == 0:
        return None
    else:
        ngrams = zip(*[tokens[i:] for i in range(n)])
        return Counter([" ".join(ngram) for ngram in ngrams])
