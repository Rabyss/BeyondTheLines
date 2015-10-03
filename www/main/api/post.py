#!/usr/bin/python2
# -*- coding: utf-8 -*-

from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseNotFound
from libs.analysis import analyze
import json


def text(request):
    if request.method != "POST":
        return HttpResponseBadRequest("This should be a POST request.")
    params = request.POST
    if "text" not in params:
        return HttpResponseBadRequest("No text to analyze.")
    return text_analysis(params["text"])


def text_analysis(text):
    if text != "":
        return HttpResponse(json.dumps(analyze(text)))
    return HttpResponseNotFound("The page has no interesting feature.")

