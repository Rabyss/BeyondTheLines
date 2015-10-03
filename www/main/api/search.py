#!/usr/bin/python2
# -*- coding: utf-8 -*-

from django.http import HttpResponseBadRequest, HttpResponse
from libs import search
from libs.extract import extract
from libs.analysis import analyze
import os
import json
import logging

logger = logging.getLogger(__name__)


def handle(request):
    params = request.GET
    if "query" not in params:
        return HttpResponseBadRequest("Parameter \"query\" not set.")
    if "nb_per_source" not in params:
        return HttpResponseBadRequest("Parameter \"nb_per_source\" not set.")
    if not is_int(params["nb_per_source"]):
        return  HttpResponseBadRequest("Parameter \"nb_per_source\" must be an integer.")
    if "sources" not in params or len(params["sources"]) < 1:
        return HttpResponseBadRequest("Parameter \"sources\" not set.")
    return perform_analysis(params["query"], params["nb_per_source"], params["sources"])


def perform_analysis(query, nb_per_source, sources):
    sources = sources.split(',')
    if not isinstance(sources, list):
        sources = [sources]
    nb_per_source = int(nb_per_source)
    engine = search.BingSearchEngine(os.environ["BING_API_KEY"])
    urls = search.search_from_sources(sources, query, nb_per_source, engine)
    result = {}
    for key in urls.keys():
        result[key] = []
        for url in urls[key]:
            try:
                text = extract(url).cleaned_text
                if text != "":
                    result[key].append({
                        "url": url,
                        "data": analyze(text)
                })
            except ValueError as e:
                print "Value Error :", e.message
                pass

    return HttpResponse(json.dumps(result), content_type="application/json")


def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False
