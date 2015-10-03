#!/usr/bin/python2
# -*- coding: utf-8 -*-

from extract import extract
import sys
import importlib
import argparse
from langdetect import detect
import numpy as np
from collections import Counter

def stats(l):
    return np.mean(l), np.std(l)

def analyze(s, language=None):
    # Detect language if not provided
    if language:
        language = detect(s)
    if language not in ["en", "fr"]:
        raise Exception("Language "+language+"not supported")
    # Load pattern
    pattern = importlib.import_module("pattern." + language)
    # Perform analysis
    analysis = {}
    pt = pattern.parsetree(s)
    analysis["wordPerSentence"] = stats([len(s.words) for s in pt])
    analysis["moods"] = Counter([pattern.mood(s) for s in pt])
    analysis["modality"] = stats([pattern.modality(s) for s in pt])
    analysis["sentiment"] = stats([pattern.sentiment(s)] for s in pt)
    #return pattern.sentiment(s)
    return analysis


def analyze_url(url, language=None):
    return analyze(extract(url, language).cleaned_text)


def main():
    parser = argparse.ArgumentParser(description="Analyze text in a string or a web page.")
    parser.add_argument("string", metavar='string', type=str, help="the text to process (or the url)")
    parser.add_argument("language", metavar="language", type=str, help="the language of the text", nargs='?')
    parser.add_argument("-u", "--url", action="store_true", help="the string is an url")
    args = parser.parse_args()
    if args.url:
        print analyze_url(args.string, args.language)
    else:
        print analyze(args.string, args.language)
    return 0

if __name__ == "__main__":
    sys.exit(main())
