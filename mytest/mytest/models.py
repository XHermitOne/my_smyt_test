import os
import os.path
import yaml

from django.db import models

import mytest.settings

# class TESTDynamicModel(object):
#
#     def __init__(self, record_id):
#         self.record_id = record_id


class TESTDynamicModelManager(object):
    #title = models.CharField(max_length=100)

    #class Meta:
    #    models_data = None

    # @property
    # def model_set(self):
    #     return TESTDynamicModel()

    def _create_field(self, id, title, type):
        """
        Создание поля по его описанию.
        """
        if type == 'int':
            return models.IntegerField()
        elif type == 'char':
            return models.CharField(max_length=255)
        elif type == 'date':
            return models.DateField()

    def load_models(self, sYAMLFileName=None):
        """
        Загрузка моделей из файла.
        """
        new_models = {}
        models_data = self.load_model_data(sYAMLFileName)
        if models_data:
            for name, struct in models_data.items():
                field_data = struct.get('fields', None)
                fields = {}
                for fld in field_data:
                    fields[fld['id']] = self._create_field(**fld)
                meta_opts = struct.get('meta_opts', None)
                new_model = self._create_model(name, fields, meta_opts)
                new_models[name] = new_model
        return models_data, new_models

    def load_model_data(self, sYAMLFileName=None):
        """
        Загрузка данных моделей из файла.
        """
        model_data = None
        if os.path.exists(sYAMLFileName):
            f=None
            try:
                f = open(sYAMLFileName,'r')
                try:
                    model_data = yaml.load(f)
                except:
                    print('ERROR. load %s YAML file' % sYAMLFileName)
                    raise

                f.close()
                f = None
            except:
                if f:
                    f.close()
                    f = None
                raise
        else:
            print('WARNING. Not found file %s' % sYAMLFileName)
        return model_data

    def _create_model(self, model_name=None, fields=None,
                      meta_opts=None, base_model_class=models.Model):
        """
        Метод возвращает динамически созданный класс модели с указанным
        именем, набором полей и мета-опций, унаследованный от указанного класса модели.
        """

        # имя модели дополняем идентификатором строки модели-донора
        #tab_name = 'dynamic%s_' % self.record_id + model_name

        class Meta:
            # обязательно указываем, к какому приложению принадлежит модель
            app_label = 'mytest'
            db_table = model_name

        # Дополняем метакласс переданными опциями
        if meta_opts is not None:
            for key, value in meta_opts.iteritems():
                setattr(Meta, key, value)

        # Словарь атрибутов модели
        attrs = {'__module__': self.__class__.__module__,
                    'Meta': Meta,
                    'objects': models.Manager()}

        # Добавляем поля к модели
        if fields:
            attrs.update(fields)

        # Создаем класс модели
        model = type(model_name, (base_model_class,), attrs)

        return model

try:
    MODEL_MANAGER = TESTDynamicModelManager()
    #for rec in TESTDynamicModelManager.objects.all():
    DATA, MODELS = MODEL_MANAGER.load_models(mytest.settings.MODEL_YAML_FILENAME)
    print('DATA: %s MODELS: %s' % (DATA, MODELS))
except:
    print('ERROR. Create dynamic models')
    raise

