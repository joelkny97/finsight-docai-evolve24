from django.test import TestCase
from django.contrib.auth.models import User
from news.models import News, Category
from django.utils import timezone
from rest_framework.test import APIClient
# Create your tests here.


class TestCreatePost(TestCase):

    @classmethod
    def setUpTestData(cls):

        test_category = Category.objects.create(
            title="test_category")
        test_user = User.objects.create_superuser(
            username="test_user", password="test_password")
        test_news = News.objects.create(
            category_id=1,
            title="test_title",
            headline="test_headline",
            content="test_content",
            author="test_author",
            slug="news-title",
            status="all",
            created_at=timezone.now(),
        )

        test_news.subscribers.set([test_user])

    def test_news_content(self):
        post = News.newsobjects.get(id=1)
        cat = Category.objects.get(id=1)
        expected_object_name = f'{post.title}'
        self.assertEqual(expected_object_name, 'test_title')
        self.assertEqual(cat.title, 'test_category')
        self.assertEqual(post.subscribers.get(id=1).username, 'test_user')
        self.assertCountEqual(post.subscribers.all(), [User.objects.get(id=1)])

        self.assertEqual(str(post), 'test_title')

        self.assertEqual(str(cat), 'test_category')


    def test_api_news_list_view(self):
        auth_user = User.objects.get(username="test_user")
        drf_client = APIClient()

        drf_client.force_authenticate(user=auth_user)
        drf_client.force_login(auth_user)

        # print(self.client .is_authenticated)
        response = drf_client.get('/api/news/',follow=True )
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'test_title')


    def test_api_news_detail_view(self):
        auth_user = User.objects.get(username="test_user")
        drf_client = APIClient()

        drf_client.force_authenticate(user=auth_user)
        drf_client.force_login(auth_user)

        response = drf_client.get('/api/news/1/',follow=True )
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'test_title')
        self.assertEquals( len([response.data]) , 1)

