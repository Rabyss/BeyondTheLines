#!/usr/bin/python2
# -*- coding: utf-8 -*-

from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseNotFound
from libs import search
from libs.extract import extract
from libs.analysis import analyze
import os
import json


def website(request):
    if request.method != "GET":
        return HttpResponseBadRequest("This should be a GET request.")
    params = request.GET
    if "topic" not in params or len(params["topic"]) == 0:
        return HttpResponseBadRequest("Parameter \"topic\" not set.")
    if "quantity" not in params:
        return HttpResponseBadRequest("Parameter \"quantity\" not set.")
    if not is_int(params["quantity"]):
        return HttpResponseBadRequest("Parameter \"quantity\" must be an integer.")
    if "url" not in params or len(params["url"]) == 0 or params["url"] == "http://":
        return HttpResponseBadRequest("Parameter \"url\" not set.")
    return website_analysis(params["topic"], params["quantity"], params["url"])


def webpage(request):
    if request.method != "GET":
        return HttpResponseBadRequest("This should be a GET request.")
    params = request.GET
    if "url" not in params:
        return HttpResponseBadRequest("Parameter \"url\" not set.")
    return webpage_analysis(params["url"])


def webpage_analysis(url):
    text = extract(url).cleaned_text

    if text != "":
        return HttpResponse(json.dumps(analyze(text)))
    return HttpResponseNotFound("The page has no interesting feature.")


def website_analysis(topic, quantity, url):
    quantity = int(quantity)
    engine = search.BingSearchEngine(os.environ["BING_API_KEY"])
    urls = search.search_from_sources(url, topic, quantity, engine)

    print urls

    results = []
    for url in urls:
        try:
            text = extract(url).cleaned_text
            if text != "":
                results.append(analyze(text))
        except ValueError as e:
            print "Value Error :", e.message
            pass

    accumulator = {}
    accumulator["moods"]={"indicative":0,"imperative":0,"conditional":0,"subjunctive":0}
    for analysis in results:
        for key in analysis.keys():
            if key not in accumulator:
                accumulator[key] = analysis[key]
            elif key != "moods":
                accumulator[key] = [sum(x) for x in zip(accumulator[key], analysis[key])]
        for k in accumulator["moods"].keys():
            if k in analysis["moods"].keys():
                accumulator["moods"][k]=accumulator["moods"][k]+analysis["moods"][k]
            #accumulator[key].update(analysis[key].keys())

    results_number = len(results)

    for key in accumulator.keys():
        if key != "moods":
            accumulator[key] = [x/results_number for x in accumulator[key]]
    for k in accumulator["moods"].keys():
        if results_number>0:
            accumulator["moods"][k]=accumulator["moods"][k]/results_number

    return HttpResponse(json.dumps(accumulator), content_type="application/json")


def is_int(s):
    try:
        int(s)
        return True
    except ValueError:
        return False
