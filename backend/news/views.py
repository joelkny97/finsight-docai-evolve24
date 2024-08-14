from django.shortcuts import render
from pygooglenews import GoogleNews

# Create your views here.


def news(request):

    # gn = GoogleNews()

    # business_topics = gn.topic_headlines('business')['entries']

    # context = {}

    # context['top_news'] = business_topics

    return render(request, 'home.html', )