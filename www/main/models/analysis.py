from django.db import models

class AnalysisManager(models.Manager):
    def pending(self):
        result=list(Analysis.objects.filter(result=""))
        return result

class Analysis(models.Model):
    url=models.URLField()
    topic=models.CharField(max_length=50)
    result=models.TextField() # JSON result
    numberResults=models.IntegerField() # number of search results to analyze
    duration=models.IntegerField() # length of the analysis
    requester=models.IPAddressField()
    date=models.DateTimeField() # date of request
    objects=AnalysisManager()
