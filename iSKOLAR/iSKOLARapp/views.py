from django.shortcuts import render

# Create your views here.
def iSKOLARapp_view(request):
    return render(request, "iskolar.html")
def login_view(request):
    return render(request, "login.html")