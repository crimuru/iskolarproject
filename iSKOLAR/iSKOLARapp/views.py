from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages

# Create your views here.
def iSKOLARapp_view(request):
    
    return render(request, "iskolar.html")
def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("homepage")
        else:
            messages.error(request, "Invalid email or password")
            return redirect("login")
    return render(request, "login.html")
def signup_view(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password1 != password2:
            messages.error(request, "Passwords do not match")
            return redirect("signup")
        
        if User.objects.filter(username=email).exists() or User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists")
            return redirect("signup")

        user = User.objects.create_user(username=email, email=email, password=password1, first_name=first_name, last_name=last_name)
        user.save()
        messages.success(request, "Account created successfully! Please log in.")
        return redirect("login")
    return render(request, "signup.html")
def homepage_view(request):
    return render(request, "homepage.html")
def profile_view(request):
    return render(request, "profile.html")
def forgot_view(request):
    return render(request, "forgot.html")

