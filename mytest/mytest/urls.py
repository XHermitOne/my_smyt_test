# -*- coding: utf-8 -*-

from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

import mytest.views

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', mytest.views.main_view),
    url(r'^update/(?P<tab_name>[^/]+)/(?P<record_id>[^/]+)/(?P<field_name>[^/]+)/(?P<new_value>[^/]+)/$', mytest.views.update_record),
    url(r'^(?P<cur_tab_name>[^/]+)/$', mytest.views.main_view),

)
