from typing import Any
from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from news.models import News
from .serializers import NewsSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS, BasePermission, AllowAny
from  rest_framework.viewsets import ModelViewSet
from news.util.stock_writer import write_new_query_to_db
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
from news.models import News, Keyword
from users.models import NewUser as User
from news_api.scrapers import google_news_scraper
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

class NewsList(generics.ListCreateAPIView):
    # authentication_classes = [BasicAuthentication]
    def get_queryset(self):
        user = self.request.user
        return News.newsobjects.filter(subscribers__in=[user.id]).order_by('-created_at')[:10]
    
    def create(self, request, *args, **kwargs):
        #TODO: Add validation, fix post issue when writing multiple articles, writing duplicate articles
        user = request.user
        query = request.data.get('title')
        print(query)

        # Validate that the required fields are present
        if not query:
            return Response({"error": "Query is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the news object
        keyword_objects = []
        for name in query.split():
            keyword_instance, _ = Keyword.objects.get_or_create(name=name)
            keyword_objects.append(keyword_instance)
        # write_new_query_to_db(user, self.request.POST.get('title'))

        # test_news = [{'title': 'Angry Amazon employees are ‘rage applying’ for new jobs after Andy Jassy’s RTO mandate: ‘I will not go back’ - Fortune', 'link': 'https://news.google.com/rss/articles/CBMigwFBVV95cUxQc1hSMjBEVmpfdlBheHVVaDE2blA2c0Q4ZzMxSm5Ebjl3LTVnOThjdWtYTDZBR3FrM0FnNlFXZ2RlcmRnU0EtU09Wd1dJOEJTdUlfQjN1OThFRFBNdmlPWjdPYk45SldmckpMQUhvWGZILXBkbDhnckZuOE1BclNaUi1VYw?oc=5', 'description': '<a href="https://news.google.com/rss/articles/CBMigwFBVV95cUxQc1hSMjBEVmpfdlBheHVVaDE2blA2c0Q4ZzMxSm5Ebjl3LTVnOThjdWtYTDZBR3FrM0FnNlFXZ2RlcmRnU0EtU09Wd1dJOEJTdUlfQjN1OThFRFBNdmlPWjdPYk45SldmckpMQUhvWGZILXBkbDhnckZuOE1BclNaUi1VYw?oc=5" target="_blank">Angry Amazon employees are ‘rage applying’ for new jobs after Andy Jassy’s RTO mandate: ‘I will not go back’</a>&nbsp;&nbsp;<font color="#6f6f6f">Fortune</font>', 'published': 'Sun, 29 Sep 2024 09:00:00 GMT', 'source': {'href': 'https://fortune.com', 'title': 'Fortune'}, 'page_title': "Angry Amazon employees are 'rage applying' for new jobs after Andy Jassy's RTO mandate | Fortune", 'summary': "Several Amazon employees are looking for new jobs as a revolt against Amazon's return-to-office (RTO) mandate announced by CEO Andy Jassy. The mandate requires employees to return to the office five days a week. Many Amazon workers were expecting and hoping for a hybrid work model instead, which allows them to split their work week between the office and home. Amazon employees, including those hired virtually during the pandemic, are expressing their anger and dissatisfaction with the mandate, describing it as a trust betrayal from the company and its leadership. Some employees believe this mandate is a ploy by the company to reduce headcount."}]

        news_list  = google_news_scraper.main(query=query)
        created_news = []
        # print(test_news)
        for news in news_list:
            try:
                # Check if the news object already exists based on the title
                existing_news = News.newsobjects.filter(title=news['title']).first()
                if existing_news:
                    # If it exists, append the existing news data
                    created_news.append(self.get_serializer(existing_news).data)
                else:
                    # Prepare data for the new news object
                    data = {
                        'title': news['title'],
                        'headline': news['title'],
                        'content': news['summary'],
                        'author': "FinSight AI Writer",
                        'status': "all",
                        'url': news['link'],
                        'created_at': timezone.make_aware(
                            datetime.strptime(news['published'], "%a, %d %b %Y %H:%M:%S %Z"),
                            timezone.get_current_timezone()
                        ),
                        'subscribers': [user.id],
                    }

                    # Create and validate the serializer
                    serializer = self.get_serializer(data=data)

                    if serializer.is_valid(raise_exception=True):
                        news_instance = serializer.save()
                        news_instance.keywords.set(keyword_objects)
                        created_news.append(serializer.data)  # Append new news data

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            # Check if created_news is empty and respond accordingly
        if not created_news:
            return Response({"error": "No news items created or found."}, status=status.HTTP_204_NO_CONTENT)

        return Response(created_news, status=status.HTTP_201_CREATED)  # Move this outside the loop


        

    permission_classes = [IsAuthenticated]

    # queryset = News.newsobjects.all()

    
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