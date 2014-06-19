from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import mytest.views

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'mytest.views.main_view'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
