from django.urls import path
from .views import NewsList
from .views import NewsDetail

from  rest_framework.routers import DefaultRouter

app_name = 'news_api'

# router = DefaultRouter()
# router.register('', NewsList, basename='news')


# urlpatterns = router.urls


urlpatterns = [
    path('', NewsList.as_view(), name='listcreate'),
    path('<int:pk>/', NewsDetail.as_view(), name='detailcreate'),
]