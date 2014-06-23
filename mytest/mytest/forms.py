# -*- coding: utf-8 -*-

from django import forms

DATE_FORMATS = ['%b %d %Y',      # 'Oct 25 2006'
                '%b %d, %Y',      # 'Oct 25, 2006'
                '%d %b %Y',       # '25 Oct 2006'
                '%d %b, %Y',      # '25 Oct, 2006'
                '%B %d %Y',       # 'October 25 2006'
                '%B %d, %Y',      # 'October 25, 2006'
                '%d %B %Y',       # '25 October 2006'
                '%d %B, %Y',      # '25 October, 2006'
                '%Y-%m-%d',       # '2006-10-25'
                '%m/%d/%Y',       # '10/25/2006'
                '%m/%d/%y',       # '10/25/06'
                '%Y.%m.%d',       # '2006.10.25'
                '%d.%m.%Y',       # '25.10.2006'
                ]


class TESTDynamicForm(forms.Form):
    """
    Динамическая форма.
    """

    def __init__(self, model_data, *args, **kwargs):
        super(TESTDynamicForm, self).__init__(*args, **kwargs)
        for i, field in enumerate(model_data['fields']):
            name = field['id']
            self.fields['%s' % name] = self.create_field(field)

    def create_field(self, field):
        """
        Создание поля формы по описанию поля модели.
        """
        if field['type'] == 'char':
            return forms.CharField(label=field['title'])
        elif field['type'] == 'int':
            return forms.IntegerField(label=field['title'])
        elif field['type'] == 'date':
            return forms.DateField(label=field['title'],
                                   input_formats=DATE_FORMATS,
                                   widget=forms.TextInput(attrs={'class': 'datepicker'}))
