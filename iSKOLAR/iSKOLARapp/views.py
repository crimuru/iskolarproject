import re
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from supabase import create_client, Client


SUPABASE_URL = "https://ionsrqiqludrojmpbhfa.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbnNycWlxbHVkcm9qbXBiaGZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgxMjE2NiwiZXhwIjoyMDc0Mzg4MTY2fQ.7aePHEM6jZbTf1Iivrv2n4KxX9LmHSdCu9SDjuAJHEg"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def iSKOLARapp_view(request):
    return render(request, "iskolar.html")

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is None:
            # Try to create Django user if Supabase verification is complete
            # (Assume Supabase allows login only if email is verified)
            try:
                # If login to Supabase is successful, create Django user
                response = supabase.auth.sign_in_with_password({"email": username, "password": password})
                if response.user:
                    # Create Django user now
                    user = User.objects.create_user(username=username, email=username, password=password)
                    login(request, user)
                    return redirect("homepage")
                else:
                    messages.error(request, "Invalid credentials or email not verified.")
                    return redirect("login")
            except Exception:
                messages.error(request, "Invalid credentials or email not verified.")
                return redirect("login")
        else:
            login(request, user)
            return redirect("homepage")
    return render(request, "login.html")

def signup_view(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        email = request.POST.get("email")
        password1 = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if not (first_name and first_name[0].isupper()):
            messages.error(request, "First name must start with a capital letter.")
            return redirect("signup")
        if not (last_name and last_name[0].isupper()):
            messages.error(request, "Last name must start with a capital letter.")
            return redirect("signup")

        if password1 != password2:
            messages.error(request, "Passwords do not match")
            return redirect("signup")
        if len(password1) < 8:
            messages.error(request, "Password must be at least 8 characters long")
            return redirect("signup")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password1):
            messages.error(request, "Password must contain at least one special character")
            return redirect("signup")
        
        if User.objects.filter(username=email).exists():
            messages.error(request, "An account with this email already exists.")
            return redirect("signup")        

        try:
            response = supabase.auth.sign_up(
                {"email": email, "password": password1}
            )
            if response.user:
                User.objects.create_user(username=email, email=email, password=password1,
                                        first_name=first_name, last_name=last_name)
                messages.success(request, "Account created! Please check your email to verify your account before logging in.")
                return redirect("login")
            else:
                messages.error(request, "Signup failed")
                return redirect("signup")
        except Exception as e:
            messages.error(request, f"Signup failed: {str(e)}")
            return redirect("signup")
    return render(request, "signup.html")

def homepage_view(request):
    return render(request, "homepage.html")

def profile_view(request):
    return render(request, "profile.html")

def forgot_view(request):
    return render(request, "forgot.html")
def view_profile(request):
    return render(request, 'view-profile.html')
