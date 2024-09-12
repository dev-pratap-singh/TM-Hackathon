from django.urls import path
from .views import hello_world, get_cars, get_makes, get_models, get_ccs, get_fuels, get_variants, get_summary


urlpatterns = [
    path("", hello_world, name="test"),
    path("get_cars/", get_cars, name="get_cars"),
    path("get_makes/", get_makes, name="get_makes"),
    path('get_models/<str:make>/', get_models, name='get_models'),
    path('get_fuels/<str:make>/<str:model>/',
         get_fuels, name='get_fuels'),
    path('get_ccs/<str:make>/<str:model>/<str:fuel>/',
         get_ccs, name='get_cc'),
    path('get_variants/<str:make>/<str:model>/<str:fuel>/<str:cc>/',
         get_variants, name='get_variants'),
    path('get_summary/',
         get_summary, name='get_summary')
]
