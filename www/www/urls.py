from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
                       url(r"^admin/", include(admin.site.urls)),
                       url("^$", "main.views.index.index"),
                       #url("^analyze$", "main.views.index.index"),
                       url("^api/website", "main.api.get.website"),
                       url("^api/webpage", "main.api.get.webpage"),
                       url("^api/text", "main.api.post.text")
                       )
