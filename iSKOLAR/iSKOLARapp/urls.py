from django.urls import path
from . import views

urlpatterns = [
    path('', views.iSKOLARapp_view, name="iSKOLARapp"),
]
