# your_app/management/commands/archive_news.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from news.models import News

class Command(BaseCommand):
    help = 'Archive news older than 30 days'

    def handle(self, *args, **kwargs):
        thirty_days_ago = timezone.now() - timezone.timedelta(days=30)
        old_news = News.objects.filter(created_at__lt=thirty_days_ago, status='active')

        archived_count = old_news.update(status='archived')  # This will update the status in bulk

        self.stdout.write(self.style.SUCCESS(f'Successfully archived {archived_count} news articles.'))
