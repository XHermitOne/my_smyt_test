
from django.http import HttpResponse
import mytest.models

def main_view(request):
    """
    Главная страница.
    """
    print('DEBUG. Models data %s' % mytest.models.TESTDynamicModelManager.data)
    return HttpResponse('Hello')

