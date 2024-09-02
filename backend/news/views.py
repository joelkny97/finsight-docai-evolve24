from django.shortcuts import render
from pygooglenews import GoogleNews
import datetime
# Create your views here.
from news_api.scrapers import top_news_fetcher
from news.models import News



def news(request):
      
    

    return render(request, 'home.html', )