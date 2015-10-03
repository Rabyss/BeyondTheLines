from django.db import models
from datetime import datetime
from django.utils import timezone

class AnalysisManager(models.Manager):
    def pending(self):
        result=list(Analysis.objects.filter(result=""))
        return result
    def add(self, url, topic, numberResults, requester):
        a=Analysis(url=url, topic=topic, numberResults=numberResults, requester=requester)
        a.save()
        return a

class Analysis(models.Model):
    url = models.URLField()
    topic = models.CharField(max_length=50)
    result = models.TextField(default="") # JSON result
    numberResults = models.IntegerField() # number of search results to analyze
    duration = models.IntegerField(default=0) # length of the analysis
    requester = models.IPAddressField()
    date = models.DateTimeField(default=timezone.now()) # date of request
    objects = AnalysisManager()
