from django.contrib.auth import views as auth_views
from django.urls import path
from . import views  # if you keep forgot_view or others

urlpatterns = [
    path("", views.iSKOLARapp_view, name="iSKOLARapp"),
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("homepage/", views.homepage_view, name="homepage"),
    path("profile/", views.profile_view, name="profile"),
    path('profile/view/', views.view_profile, name='view_profile'),
    path("archives/", views.archives_view, name="archives"),
    path("saved_scholarships/", views.saved_scholarships_view, name="saved_scholarships"),
    path("applications/", views.applications_view, name="applications"),


    # ✅ password reset URLs
    path("forgot/", 
         auth_views.PasswordResetView.as_view(template_name="forgot.html"), 
         name="password_reset"),
    path("forgot/done/", 
         auth_views.PasswordResetDoneView.as_view(template_name="password_reset_done.html"), 
         name="password_reset_done"),
    path("reset/<uidb64>/<token>/", 
         auth_views.PasswordResetConfirmView.as_view(template_name="password_reset_confirm.html"), 
         name="password_reset_confirm"),
    path("reset/done/", 
         auth_views.PasswordResetCompleteView.as_view(template_name="password_reset_complete.html"), 
         name="password_reset_complete"),
]
