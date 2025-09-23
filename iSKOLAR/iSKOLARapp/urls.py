from django.urls import path
from . import views

urlpatterns = [
    path('', views.iSKOLARapp_view, name="iSKOLARapp"),
    path('login/', views.login_view, name='login'),
]
