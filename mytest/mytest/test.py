# -*- coding: utf-8 -*-

from django.test import TestCase
import mytest.models

import time
import datetime
import random
import hashlib

RECORD_COUNT = 2

class TESTModelsTestCase(TestCase):

    def setUp(self):
        self.models_data={}
        for model_name, model in mytest.models.MODELS.items():
            self.models_data[model_name] = []
            fields = mytest.models.SCHEME[model_name]['fields']
            for i in range(RECORD_COUNT):
                record = {}
                for field in fields:
                    record[field['id']] = self.genFieldValue(field)
                self.models_data[model_name].append(record)
                model.objects.create(**record)

    def genFieldValue(self, dField):
        """
        Сгенерировать тествое значение для поля.
        """
        if dField['type'] == 'char':
            t = time.time() * 1000
            r = random.random()*100000000000000000
            a = random.random()*100000000000000000
            data = str(t)+u' '+str(r)+u' '+str(a)
            data = hashlib.md5(data.encode('utf-8')).hexdigest()
            return data
        elif dField['type'] == 'int':
            return int(random.random()*10000)
        elif dField['type'] == 'date':
            return datetime.date.today()

    def test_create_models(self):
        """
        Тестировать модели.
        """
        for model_name, model in mytest.models.MODELS.items():
            #Проверка на запись
            all_count = model.objects.all().count()
            self.assertEqual(all_count, RECORD_COUNT)

    def test_read_models(self):
        """
        Тестировать модели.
        """
        for model_name, model in mytest.models.MODELS.items():
            #Проверка на чтение
            for i, record in enumerate(model.objects.all()):
                hash_record = self.models_data[model_name][i]
                for field_name, value in hash_record.items():
                    self.assertEqual(getattr(record, field_name), value)

    def test_update_models(self):
        """
        Тестировать модели.
        """
        for model_name, model in mytest.models.MODELS.items():
            #Проверка на обновление
            record = model.objects.all()[0]
            hash_record = self.models_data[model_name][0]
            for field_name, value in hash_record.items():
                field = [field for field in mytest.models.SCHEME[model_name]['fields'] if field['id'] == field_name][0]
                new_value = self.genFieldValue(field)
                setattr(record, field_name, new_value)
                record.save()
                self.assertEqual(getattr(record, field_name), new_value)

    def test_delete_models(self):
        """
        Тестировать модели.
        """
        for model_name, model in mytest.models.MODELS.items():
            #Проверка на удаление
            model.objects.all().delete()
            self.assertEqual(model.objects.all().count(), 0)
