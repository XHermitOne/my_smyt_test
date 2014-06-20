# -*- coding: utf-8 -*-

#from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect

import mytest.models
import mytest.forms

def add_new_record(request, cur_tab_name=None, *args, **kwargs):
    """
    Добавить новую запись в таблицу.
    """
    print('DEBUG add rec', cur_tab_name, kwargs)
    model = mytest.models.MODELS.get(cur_tab_name, None)
    if model:
        new_rec = model(*args, **kwargs)
        new_rec.save()

# def new_record(request, cur_tab_name=None):
#     """
#     """

def main_view(request, cur_tab_name=None):
    """
    Главная страница.
    """
    context = {}

    tables = []
    for name, data in mytest.models.SCHEME.items():
        data['name'] = name
        tables.append(data)

    if cur_tab_name is None:
        cur_tab_name = tables[0]['name']

    if request.method == 'POST':
        form = mytest.forms.TESTDynamicForm(mytest.models.SCHEME[cur_tab_name],
                                     request.POST.copy())
        if form.is_valid():
            rec = {}
            for form_field_name in form.fields.keys():
                rec[form_field_name] = request.POST.get(form_field_name, None)
            add_new_record(request, cur_tab_name, **rec)
        else:
            print('WARNING. Don\'t valid form data')
        return HttpResponseRedirect('/%s/' % cur_tab_name)
    else:

        context['tables'] = tables
        context['table_titles'] = [tab.get('title', '') for tab in mytest.models.SCHEME.values()]

        context['cur_tab_name'] = cur_tab_name
        context['cur_table'] = mytest.models.SCHEME[cur_tab_name]
        fields = mytest.models.SCHEME[cur_tab_name]['fields']
        field_names = [field['id'] for field in fields]
        context['fields'] = fields
        context['records'] = [[getattr(rec, field_name) for field_name in field_names] for rec in mytest.models.MODELS[cur_tab_name].objects.all()]

        form = mytest.forms.TESTDynamicForm(mytest.models.SCHEME[cur_tab_name])
        context['form'] = form

    return render_to_response('main.html', context)

