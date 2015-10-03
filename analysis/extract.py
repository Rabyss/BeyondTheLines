#!/usr/bin/python2
# -*- coding: utf-8 -*-

from goose import Goose
import sys
import argparse


def extract(url, language=None):
    if language:
        g = Goose({'use_meta_language': False, 'target_language': language})
    else:
        g = Goose()

    return g.extract(url=url)


def main():
    parser = argparse.ArgumentParser(description="Extract data from a web page")
    parser.add_argument("url", metavar='url', type=str, help="the url to extract data from")
    parser.add_argument("language", metavar="language", type=str, help="the language of the web page", nargs='?')
    args = parser.parse_args()
    print extract(args.url, args.language).cleaned_text
    return 0

if __name__ == "__main__":
    sys.exit(main())
