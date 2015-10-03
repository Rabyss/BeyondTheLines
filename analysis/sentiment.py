#!/usr/bin/python2
# -*- coding: utf-8 -*-

from extract import extract
import sys
import importlib
import argparse
from langdetect import detect

def sentiment(s, language=None):
    if language == None:
        language = detect(s)
    if language not in ["en","fr"]:
        raise Exception("Language not supported")
    # if language:
    #     pattern = importlib.import_module("pattern." + language)
    # else:
    #     import pattern.en as pattern
    pattern = importlib.import_module("pattern." + language)
    return pattern.sentiment(s)


def extract_sentiment(url, language=None):
    return sentiment(extract(url, language).cleaned_text)


def main():
    parser = argparse.ArgumentParser(description="Process sentiment in a string or a web page.")
    parser.add_argument("string", metavar='string', type=str, help="the string to process (or the url)")
    parser.add_argument("language", metavar="language", type=str, help="the language of the web page", nargs='?')
    parser.add_argument("-u", "--url", action="store_true", help="the string is an url")
    args = parser.parse_args()
    if args.url:
        print extract_sentiment(args.string, args.language)
    else:
        print sentiment(args.string, args.language)
    return 0

if __name__ == "__main__":
    sys.exit(main())
