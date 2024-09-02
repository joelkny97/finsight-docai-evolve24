from typing import Any
from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from news.models import News
from .serializers import NewsSerializer
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS, BasePermission, AllowAny
from  rest_framework.viewsets import ModelViewSet
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
        return News.newsobjects.filter(subscribers__in=[user.id])
    
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