from django.core.management.base import BaseCommand
from news_api.scrapers import top_news_fetcher
import datetime
from news.models import News
from django.utils import timezone


class Command(BaseCommand):
    help = 'Fetch and update stock data from the external API'


    
    def handle(self, *args, **kwargs): 

        if not News.objects.datetimes('created_at', 'day', order='DESC').filter(status="top").latest('created_at')  > timezone.now() - datetime.timedelta(days=1):
            # pass
            top_news = top_news_fetcher.main()

            News.objects.filter(status="top").delete()
            for news in top_news:
                try:
                    n = News.objects.create(title=news['title'], 
                                            headline=news['title'], 
                                            content=news['summary'], 
                                            author="NewsAPIWriter", 
                                            status="top",
                                            url = news['link'],
                                            created_at=timezone.make_aware(datetime.datetime.strptime(news['published'], "%a, %d %b %Y %H:%M:%S %Z"), timezone.get_current_timezone())
    ,
                                            )
                    n.save()
                except Exception as e:
                    print(e)

        self.stdout.write(self.style.SUCCESS('Successfully updated Top News data'))