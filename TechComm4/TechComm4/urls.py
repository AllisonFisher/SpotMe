from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers
from SpotMe import views

router = routers.DefaultRouter()
router.register(r'areas', views.AreaViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^SpotMe/', include('SpotMe.urls', namespace="SpotMe")),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)
