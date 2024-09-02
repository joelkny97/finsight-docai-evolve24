from django.urls import path, include
from .views import CustomUserCreate, BlackListTokenView, VerifyEmail

app_name = 'users'


urlpatterns = [
    path('register/', CustomUserCreate.as_view(), name='create_user'),
    path('logout/blacklist/', BlackListTokenView.as_view(), name='blacklist'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]