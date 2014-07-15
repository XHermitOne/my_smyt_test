# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect, HttpResponsePermanentRedirect

try:
    import json
except ImportError:
    from django.utils import simplejson as json

import mytest.models
import mytest.forms

import datetime

import logging

logger = logging.getLogger('my_debug_logger')

DEFAULT_DATE_FORMAT = '%Y-%m-%d'

def add_new_record(request, cur_tab_name=None, *args, **kwargs):
    """
    Добавить новую запись в таблицу.
    """
    #print('DEBUG add rec', cur_tab_name, kwargs)
    model = mytest.models.MODELS.get(cur_tab_name, None)
    if model:
        new_rec = model(*args, **kwargs)
        new_rec.save()

def update_record(request, tab_name=None, record_id=None, field_name=None, new_value=None):
    """
    Обновление значения записи.
    """
    model = mytest.models.MODELS.get(tab_name, None)
    if model:
        record = model.objects.get(id=int(record_id))
        if record:
            try:
                if getattr(record, field_name) != new_value:
                    setattr(record, field_name, new_value)
                    record.save()
            except:
                print('ERROR Update record %s in table %s', record_id, tab_name)

    return HttpResponseRedirect('/%s/' % tab_name)

def ajax_set_cell(request):
    """
    Установить значение ячейки таблицы.
    """
    if request.method == 'POST':
        data = dict(request.POST)
        # print('DEBUG::', data)

        tab_name = data['tab_name'][0]
        record_id = data['rec_id'][0]
        field_name = data['field_name'][0]
        new_value = data['new_value'][0]
        old_value = data['old_value'][0]

        if tab_name and record_id and field_name:
            model = mytest.models.MODELS.get(tab_name, None)
            if model:
                record = model.objects.get(id=int(record_id))
                if record:
                    try:
                        if getattr(record, field_name) != new_value:
                            setattr(record, field_name, new_value)
                            record.save()
                            return HttpResponse(new_value)
                    except:
                        print('ERROR Update record %s in table %s', record_id, tab_name)
        return HttpResponse(old_value)
    return HttpResponse("err")

def ajax_add_record(request, cur_tab_name):
    """
    Добавить новую запись в таблицу.
    """
    if request.method == 'POST':
        new_record = dict([(field_name, value[0]) for field_name, value in dict(request.POST).items()])

        model = mytest.models.MODELS.get(cur_tab_name, None)
        if model:
            new_rec = model(**new_record)
            new_rec.save()
            logger.info('Save record ... OK')

            #Подготоыить данные для отправки браузеру
            record = {}
            record['scheme'] = mytest.models.SCHEME[cur_tab_name]['fields']
            new_record['id'] = new_rec.id
            record ['data'] = new_record
            return HttpResponse(json.dumps(record),
                                content_type='application/json')
    return HttpResponse("err")

def ajax_get_table_data(request, tab_name):
    """
    Получить данные о таблице.
    """
    if request.method == 'GET':
        data = {}
        data['scheme'] = mytest.models.SCHEME[tab_name]
        data['records'] = []
        model = mytest.models.MODELS.get(tab_name, None)
        if model:
            #logger.info('MODEL %s'%model)
            records = [[field.strftime(DEFAULT_DATE_FORMAT) if type(field) == datetime.date else field for field in rec] for rec in model.objects.all().values_list()]
            data['records'] = records
            #logger.info('RECORDS %s'%data['records'])
        return HttpResponse(json.dumps(data),
                    content_type='application/json')

    return HttpResponse("err")


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
        context['cur_table'] = mytest.models.SCHEME.get(cur_tab_name, None)
        if context['cur_table']:
            fields = mytest.models.SCHEME[cur_tab_name]['fields']
            field_names = [field['id'] for field in fields]
            context['fields'] = fields
            context['records'] = [[{'value': getattr(rec, field_name).strftime(DEFAULT_DATE_FORMAT) if fields[i]['type'] == 'date' else getattr(rec, field_name),
                                'field_name': field_name,
                                'type': fields[i]['type'],
                                'rec_id': rec.id} for i,field_name in enumerate(field_names)] for rec in mytest.models.MODELS[cur_tab_name].objects.all()]
        else:
            context['fields'] = []
            context['records'] = []

        tab = mytest.models.SCHEME.get(cur_tab_name,None)
        if tab:
            form = mytest.forms.TESTDynamicForm(tab)
            context['form'] = form

    return render_to_response('main.html', context)

