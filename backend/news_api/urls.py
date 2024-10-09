from django.urls import path
from .views import NewsList
from .views import NewsDetail
from .views import TopNewsList

from  rest_framework.routers import DefaultRouter

app_name = 'news_api'

# router = DefaultRouter()
# router.register('', NewsList, basename='news')


urlpatterns = [
    path('', NewsList.as_view({'get': 'list', 'post': 'create'}), name='listcreate'),  # For listing and creating news
    path('<int:pk>/', NewsDetail.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='detailcreate'),  # For retrieving, updating, and deleting a news item
    path('topnews/', TopNewsList.as_view({'get': 'list'}), name='topnews'),  # For listing top news
]
