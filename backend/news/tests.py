from django.test import TestCase
from django.contrib.auth.models import User
from news.models import News, Category
from django.utils import timezone
# Create your tests here.


class TestCreatePost(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_category = Category.objects.create(
            title="test_category")
        test_user = User.objects.create_user(
            username="test_user", password="test_password")
        test_news = News.objects.create(
            category_id=1,
            title="test_title",
            headline="test_headline",
            content="test_content",
            author="test_author",
            slug="news-title",
            subscribers_id=[1],
            status="all",
            created_at=timezone.now(),
        )

    def test_news_content(self):
        post = News.objects.get(id=1)
        cat = Category.objects.get(id=1)
        sub = User.objects.get(id=1)
        expected_object_name = f'{post.title}'
        self.assertEqual(expected_object_name, 'test_title')
        self.assertEqual(cat.title, 'test_category')
        self.assertEqual(sub.username, 'test_user')
        self.assertCountEqual(post.subscribers.all(), [sub])


    def test_news_list_view(self):
        response = self.client.get('/newsapi/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'test_title')

        