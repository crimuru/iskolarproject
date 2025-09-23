from django.shortcuts import render

# Create your views here.
def loginpage_view(request):
    return render(request, "login.html")