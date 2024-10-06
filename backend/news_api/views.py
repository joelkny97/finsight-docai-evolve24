from typing import Any
from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from news.models import News
from .serializers import NewsSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound, NotAcceptable
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS, BasePermission, AllowAny
from  rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from news.util.stock_writer import write_new_query_to_db
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
from news.models import News, Keyword
from users.models import NewUser as User
from news_api.scrapers import google_news_scraper
import logging
import traceback

logger = logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
)

logger = logging.getLogger(__name__)


# Create your views here.



class NewsUserWritePermission(BasePermission):
    message = 'Editing posts is restricted to the author only.'
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


# class NewsList(ModelViewSet):
#     permission_classes = [IsAuthenticated]
#     serializer_class = NewsSerializer


#     def get_object(self, queryset=None, **kwargs):
#         item = self.kwargs.get('pk')
#         return get_object_or_404(News, title=item)

#     def get_queryset(self):
#         user = self.request.user
#         return News.objects.filter(subscribers=user)

class NewsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 12


    def get_paginated_response(self, data):

        return Response({
            
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page': self.request.query_params.get('page'),  # Add the current page number
            'results': data
        })
    

class NewsList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer

    def get_queryset(self):
        user = self.request.user
        return News.newsobjects.filter(subscribers=user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        user = request.user
        query = request.data.get('title')

        # Validate that the required fields are present
        if not query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keyword_objects = []
            for name in query.split():
                keyword_instance, _ = Keyword.objects.get_or_create(name=name)
                keyword_objects.append(keyword_instance)

            

            news_list = google_news_scraper.main(query=query)
            # Simulated scraped news items
            # test_news = [{'title': 'Angry Amazon employees are ‘rage applying’ for new jobs after Andy Jassy’s RTO mandate: ‘I will not go back’ - Fortune', 'link': 'https://news.google.com/rss/articles/CBMigwFBVV95cUxQc1hSMjBEVmpfdlBheHVVaDE2blA2c0Q4ZzMxSm5Ebjl3LTVnOThjdWtYTDZBR3FrM0FnNlFXZ2RlcmRnU0EtU09Wd1dJOEJTdUlfQjN1OThFRFBNdmlPWjdPYk45SldmckpMQUhvWGZILXBkbDhnckZuOE1BclNaUi1VYw?oc=5', 'summary': "Some summary..."}]
            # news_list = test_news
            
            # To hold new or updated news data
            unserialized_data = []

            for news in news_list:
                # Attempt to get the existing news item or create a new one
                existing_news, created = News.newsobjects.get_or_create(
                    title=news['title'],
                    defaults={
                        'headline': news['title'],
                        'content': news['summary'],
                        'author': "FinSight AI Writer",
                        'status': "all",
                        'url': news['link'],
                        'created_at': timezone.make_aware(datetime.strptime(news['published'], "%a, %d %b %Y %H:%M:%S %Z"), timezone.get_current_timezone()),  # Replace with actual timestamp
                    }
                )

                if not created:
                    # If the news item already exists
                    if user not in existing_news.subscribers.all():
                        existing_news.subscribers.add(user)  # Add user to subscribers if not already present
                    logger.info(f"Existing news updated:{existing_news.title}" )

                # If it was created, we need to set keywords
                if created:
                    existing_news.subscribers.add(user)
                    existing_news.keywords.set(keyword_objects)
                
                unserialized_data.append(self.get_serializer(existing_news).data)

            return Response(unserialized_data, status=status.HTTP_201_CREATED)

        except NotFound as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("Error occurred: ", exc_info=e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)        

    permission_classes = [IsAuthenticated]

    
    serializer_class = NewsSerializer
    pass



class NewsDetail(generics.RetrieveUpdateDestroyAPIView):

    # authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pass


class TopNewsList(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        return News.objects.filter(status="top").order_by('-created_at')[:6]
    

    # queryset = News.objects.all().order_by('-created_at')[:5]
    serializer_class = NewsSerializer
    pass


""" Concrete View Classes
#CreateAPIView
Used for create-only endpoints.
#ListAPIView
Used for read-only endpoints to represent a collection of model instances.
#RetrieveAPIView
Used for read-only endpoints to represent a single model instance.
#DestroyAPIView
Used for delete-only endpoints for a single model instance.
#UpdateAPIView
Used for update-only endpoints for a single model instance.
##ListCreateAPIView
Used for read-write endpoints to represent a collection of model instances.
RetrieveUpdateAPIView
Used for read or update endpoints to represent a single model instance.
#RetrieveDestroyAPIView
Used for read or delete endpoints to represent a single model instance.
#RetrieveUpdateDestroyAPIView
Used for read-write-delete endpoints to represent a single model instance.
"""