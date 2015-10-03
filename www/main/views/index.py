from django.shortcuts import render


def index(request):
    print request.session.session_key
    return render(request, "index.html")
