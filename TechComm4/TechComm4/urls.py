from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url('^SpotMe/', include('SpotMe.urls', namespace="SpotMe")),
    url(r'^admin/', include(admin.site.urls)),
)
