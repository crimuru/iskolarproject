from django.urls import path
from . import views

urlpatterns = [
    path('', views.iSKOLARapp_view, name="iSKOLARapp"),
    path('login/', views.login_view, name='login'),
    path('signupp/',views.signup_view, name='signup'),
    path('profile/',views.profile_view, name='profile'),
]
