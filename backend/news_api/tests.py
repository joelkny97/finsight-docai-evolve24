from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from django.utils import timezone
from news.models import News, Category

from django.contrib.auth.models import User


# Create your tests here.



class NewsTests(APITestCase):

    def test_view_all_news(self):
        """
        Ensure we can view all objects.
        """

        auth_user = User.objects.create_superuser(username="test_user", password="test_password")
        drf_client = APIClient()

        drf_client.force_authenticate(user=auth_user)
        drf_client.force_login(auth_user)

        url = reverse('news_api:listcreate')
        response = drf_client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_news(self):
        """
        Ensure we can create a new Post object and view object.
        """
        
        drf_client = APIClient()

        
        self.test_category = Category.objects.create(title='test_category')

        self.testuser1 = User.objects.create_superuser(
            username='test_user1', password='123456789')
        
        drf_client.force_authenticate(user=self.testuser1)
        drf_client.force_login(self.testuser1)


        data = { "title":"test_title", "headline":"test_headline",
            "content":"test_content",
            "author":"test_author",
            "slug":"news-title",
            "status":"all",
            "created_at":timezone.now()}
        url = reverse('news_api:listcreate')
        response = drf_client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 6)
        root = reverse(('news_api:detailcreate'), kwargs={'pk': 1})
        response = drf_client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_news_update_authorized(self):
        """
        Ensure we can update an object.
        """
        self.test_category = Category.objects.create(title='test_category')

        self.testuser1 = User.objects.create_superuser(
            username='test_user1', password='123456789')
        
        drf_client = APIClient()

        drf_client.force_authenticate(user=self.testuser1)
        drf_client.force_login(self.testuser1)


        News.objects.create(
            category_id=1,
            title="test_title",
            headline="test_headline",
            content="test_content",
            author="test_author",
            slug="news-title",
            status="all",)
        
        url = reverse(('news_api:detailcreate'), kwargs={'pk': 1})
        data = { "title":"updated_title", "headline":"test_headline",
            "content":"test_content",
            "author":"test_author",
            "slug":"news-title",
            "status":"all",
            "created_at":timezone.now()}
        response = drf_client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(News.objects.get(id=1).title, "updated_title")


    def test_view_all_news_unauthorized(self):
        """
        Ensure unauthorized user cannot list objects.
        """
        self.test_category = Category.objects.create(title='test_category')

        self.testuser1 = User.objects.create_user(
            username='test_user1', password='123456789')
        
        drf_client = APIClient()

        drf_client.force_authenticate(user=self.testuser1)
        drf_client.force_login(self.testuser1)


        News.objects.create(
            category_id=1,
            title="test_title",
            headline="test_headline",
            content="test_content",
            author="test_author",
            slug="news-title",
            status="all",)
        
        url = reverse('news_api:listcreate')
        response = drf_client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        



    def test_news_update_unauthorized(self):

        """
        Ensure unauthorized user cannot updated objects.
        """
        self.test_category = Category.objects.create(title='test_category')

        self.testuser1 = User.objects.create_user(
            username='test_user1', password='123456789')
        
        drf_client = APIClient()

        drf_client.force_authenticate(user=self.testuser1)
        drf_client.force_login(self.testuser1)

        

        News.objects.create(
            category_id=1,
            title="test_title",
            headline="test_headline",
            content="test_content",
            author="test_author",
            slug="news-title",
            status="all",)
        
        url = reverse(('news_api:detailcreate'), kwargs={'pk': 1})
        data = { "title":"updated_title", "headline":"test_headline",
            "content":"test_content",
            "author":"test_author",
            "slug":"news-title",
            "status":"all",
            "created_at":timezone.now()}
        response = drf_client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(News.objects.get(id=1).title, 'test_title')
        