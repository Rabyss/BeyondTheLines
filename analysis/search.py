#!/usr/bin/python2
# -*- coding: utf-8 -*-

import requests
import string
from abc import ABCMeta, abstractmethod


class SearchEngine:
    __metaclass__ = ABCMeta

    def __init__(self):
        return

    @abstractmethod
    def search(self, query):
        raise NotImplemented


class BingSearchEngine(SearchEngine):
    bing_api = "https://api.datamarket.azure.com/Data.ashx/Bing/Search/v1/Composite?"

    def __init__(self, key):
        self.key = key
        super(BingSearchEngine, self).__init__()

    @staticmethod
    def encode(request):
        # Custom url encoder to match bing API specs
        request = string.replace(request, "'", '%27')
        request = string.replace(request, '"', '%27')
        request = string.replace(request, '+', '%2b')
        request = string.replace(request, ' ', '%20')
        request = string.replace(request, ':', '%3a')
        return request

    def search(self, query):
        params = {'ImageFilters': '"Face:Face"',
                  '$format': 'json',
                  '$top': 10,
                  '$skip': 0}
        return self.search_with_params(query, params)

    def search_with_params(self, query, params):
        request = 'Sources="web"'
        request += '&Query="' + str(query) + '"'
        for key, value in params.iteritems():
            request += '&' + key + '=' + str(value)
        request = self.bing_api + self.encode(request)
        return requests.get(request, auth=(self.key, self.key))


def search_from_sources(sources, query, results_per_query, engine):
    queries = []
    for source in sources:
        if source == "web":
            queries.append(query)
        else:
            queries.append("site:" + source + " " + query)

    return [extract_urls_from_result(engine.search(q).json(), results_per_query) for q in queries]


def extract_urls_from_result(result, results_per_query):
    web_results = result["d"]["results"][0]["Web"]
    urls = [wr["Url"] for wr in web_results]
    if len(urls) > results_per_query:
        urls = urls[:results_per_query]
    return urls


def main():
    import os
    # This environment variable must be set
    key = os.environ["BING_API_KEY"]
    bing = BingSearchEngine(key)
    print search_from_sources(["web", "udc.ch"], "étrangers", 1, bing)
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
