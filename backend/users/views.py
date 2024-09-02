from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, GenericAPIView
from .models import NewUser
from . import models
from .serializers import RegisterUserSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
import jwt
from utils.email_helper import EmailUtil
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from . import views
from django.http import HttpResponseRedirect
from rest_framework.renderers import TemplateHTMLRenderer
from django.shortcuts import render


class CustomUserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        # self.login(request)
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data

                # get token
                user_email = NewUser.objects.get(email=json['email'])
                tokens = RefreshToken.for_user(user_email).access_token

                # get domain
                current_site = get_current_site(request).domain
                relative_link = reverse("users:email-verify")
                absurl = 'http://' + current_site + relative_link + "?token=" + str(tokens)
                email_body = 'Hi ' + user_email.user_name + ',\n\n Use the link below to verify your email \n' + absurl

                data = {'email_body': email_body, 'to_email': user_email.email, 'email_subject': 'FinSight Account Verification'}

                EmailUtil.send_email(data = data)

                
                return Response({'user_data': json, 'access_token': str(tokens)}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class BlackListTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class VerifyEmail(GenericAPIView):
    serializer_class = RegisterUserSerializer

    renderer_classes =  [TemplateHTMLRenderer]


    def get(self, request):
        token = request.GET.get('token')

        if not token:
            return Response({'email': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload  = jwt.decode(token, options={'verify_signature': False})

            user= NewUser.objects.get(id=payload['user_id'])

            if not user.is_active:
                user.is_active = True
                user.save()

            
            # return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        
            return render(request,context={'message': 'Account successfully activated'}, status=status.HTTP_200_OK, template_name='activatesuccess.html')
        except jwt.ExpiredSignatureError as identifier:

            return render(request,context={'error': 'Expired signature'}, status=status.HTTP_400_BAD_REQUEST, template_name='activatefailure.html')
            # return Response({'error': 'Expired signature'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError as identifier:
            return render(request,context={'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST, template_name='activatefailure.html')
            # return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        except NewUser.DoesNotExist:
            return render(request,context={'error': 'User Does Not Exist'}, status=status.HTTP_404_NOT_FOUND, template_name='activatefailure.html')
            # return Response({'error': 'User Does Not Exist'}, status=status.HTTP_404_NOT_FOUND)
        

        
