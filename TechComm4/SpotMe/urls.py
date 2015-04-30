from django.conf.urls import patterns, url

from SpotMe import views

from TechComm4 import settings

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^areas', views.area_list, name='api'),
    url(r'^search', views.search, name='search'),
    url(r'^(?P<area_id>\d+)/$', views.detail, name='detail'),
)
