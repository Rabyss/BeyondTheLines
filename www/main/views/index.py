from django.shortcuts import render
#from ipware.ip import get_ip

def index(request):
    return render(request, "index.html")

