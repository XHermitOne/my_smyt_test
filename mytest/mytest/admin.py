# -*- coding: utf-8 -*-
from django.contrib import admin
import mytest.models


for model_name,model in mytest.models.MODELS.items():
    admin_class_name = 'TEST%sAdmin' % model_name
    admin_list_display = [field['id'] for field in mytest.models.SCHEME[model_name]['fields']]
    attrs = {'list_display' : admin_list_display}
    admin_class = type(admin_class_name, (admin.ModelAdmin,), attrs)

    admin.site.register(model, admin_class)
