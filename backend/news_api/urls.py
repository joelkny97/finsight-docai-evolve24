from django.urls import path
from .views import NewsList, NewsDetail

app_name = 'news_api'



urlpatterns = [
    path('', NewsList.as_view(), name='listcreate'),
    path('<int:pk>/', NewsDetail.as_view(), name='detailcreate'),
]