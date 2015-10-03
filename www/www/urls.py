from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.conf import settings

urlpatterns = patterns('',
                       url(r"^admin/", include(admin.site.urls)),
                       url("^$", "main.views.index.index"),
                       url("^api/website", "main.api.get.website"),
                       url("^api/webpage", "main.api.get.webpage"),
                       url("^api/text", "main.api.post.text"),
                        url(r'^favicon.ico/$', lambda x: HttpResponseRedirect(settings.STATIC_URL+'ico/favicon.ico'))
                       )
