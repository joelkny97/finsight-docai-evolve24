from typing import Any
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, status
from news.models import News, Keyword
from .serializers import NewsSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, SAFE_METHODS
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from news_api.scrapers import google_news_scraper
import logging
from rest_framework.pagination import PageNumberPagination

# Set up logging
logger = logging.getLogger(__name__)

class NewsUserWritePermission(BasePermission):
    message = 'Editing posts is restricted to the author only.'
    
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user


class NewsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 12

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'page': self.request.query_params.get('page'),
            'results': data
        })


class NewsList(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer
    # pagination_class = NewsPagination

    def get_queryset(self):
        user = self.request.user
        return News.newsobjects.filter(subscribers=user).order_by('-created_at')
    

    def create(self, request, *args, **kwargs):
        user = request.user
        query = request.data.get('title')

        if not query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keyword_objects = []
            for name in query.split():
                keyword_instance, _ = Keyword.objects.get_or_create(name=name)
                keyword_objects.append(keyword_instance)

            news_list = google_news_scraper.main(query=query)

            unserialized_data = []

            for news in news_list:
                existing_news, created = News.newsobjects.get_or_create(
                    title=news['title'],
                    defaults={
                        'headline': news['title'],
                        'content': news['summary'],
                        'author': "FinSight AI Writer",
                        'status': "all",
                        'url': news['link'],
                        'created_at': timezone.make_aware(
                            datetime.strptime(news['published'], "%a, %d %b %Y %H:%M:%S %Z"),
                            timezone.get_current_timezone()
                        ),
                    }
                )

                if not created:
                    if user not in existing_news.subscribers.all():
                        existing_news.subscribers.add(user)
                    logger.info(f"Existing news updated: {existing_news.title}")

                if created:
                    existing_news.subscribers.add(user)
                    existing_news.keywords.set(keyword_objects)

                unserialized_data.append(self.get_serializer(existing_news).data)

            return Response(unserialized_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error("Error occurred: ", exc_info=e)
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class NewsDetail(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = NewsSerializer

    def get_queryset(self):
        return News.newsobjects.all()

    def retrieve(self, request, pk=None):
        news_item = get_object_or_404(News, pk=pk)
        serializer = self.get_serializer(news_item)
        return Response(serializer.data)

    def update(self, request, pk=None):
        news_item = get_object_or_404(News, pk=pk)
        if news_item.author != request.user:
            return Response({"error": "You do not have permission to edit this news item."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.get_serializer(news_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        news_item = get_object_or_404(News, pk=pk)
        if news_item.author != request.user:
            return Response({"error": "You do not have permission to delete this news item."}, status=status.HTTP_403_FORBIDDEN)

        news_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class TopNewsList(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = NewsSerializer

    def get_queryset(self):
        return News.objects.filter(status="top").order_by('-created_at')[:6]
