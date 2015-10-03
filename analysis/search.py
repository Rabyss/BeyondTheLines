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


def main():
    import os
    # This environment variable must be set
    my_key = os.environ["BING_API_KEY"]
    query_string = "Brad Pitt"
    bing = BingSearchEngine(my_key)

    print bing.search(query_string).json()
    return 0

if __name__ == "__main__":
    import sys
    sys.exit(main())
