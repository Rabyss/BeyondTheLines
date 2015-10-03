import os
import django
import time

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "www.settings")
django.setup()

from main.models import Analysis

#Analysis.objects.all().delete()
#Analysis.objects.add("http://www.google.ch", "test", 10, "127.0.0.1")

pending=Analysis.objects.pending()
print len(pending),"analyses pending"
for i,p in enumerate(pending):
    print "Processing analysis ",i,"/",len(pending)
    start=time.time()
    print p.url, p.topic, p.numberResults, p.date
    duration=int(time.time()-start)
    p.duration=duration
    p.result="b"
    p.save()
