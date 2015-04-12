from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers
from SpotMe import views

urlpatterns = patterns('',
    url(r'^SpotMe/', include('SpotMe.urls', namespace="SpotMe")),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
