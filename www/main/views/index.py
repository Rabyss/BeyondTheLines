from django.shortcuts import render
#from ipware.ip import get_ip

def index(request):
    print request.session.session_key
    #print "IP",get_ip(request)
    return render(request, "index.html")
# def analyze(request):
#     if request.method!="POST":
#         return
#     #print request.POST["blah"]
#     return 
