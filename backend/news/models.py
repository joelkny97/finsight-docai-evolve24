from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.


class Category(models.Model):
    title = models.CharField(max_length=100)
    
    def __str__(self):
        return self.title
    
class News(models.Model):

    options = (
        ('subscribed', 'Subscribed'),
        ('unsubscribed', 'Unsubscribed'),
        ('deleted', 'Deleted'),
        ('archived', 'Archived'),
        ('hidden', 'Hidden'),
        ('all', 'All'),
    )

    class NewsObjects(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(status='all')

    category = models.ForeignKey(Category, on_delete=models.PROTECT, default=1)

    title = models.CharField(max_length=250)
    headline = models.TextField(null=True)
    content = models.TextField()
    author = models.TextField(null=True)
    created_at = models.DateTimeField(default=timezone.now)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    status = models.CharField(choices=options, default='all', max_length=25)

    subscribers = models.ManyToManyField(User, related_name='subscribers', blank=True)

    slug = models.SlugField(max_length=250, unique_for_date='created_at')

    objects = models.Manager() # default
    newsobjects = NewsObjects() # custom manager

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title




