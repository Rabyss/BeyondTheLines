import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "www.settings")
django.setup()

from main.models import Analysis

pending=Analysis.objects.pending()
print len(pending),"analyses pending"
