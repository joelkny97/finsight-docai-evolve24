from django.utils import timezone
from datetime import datetime
from news.models import News, Keyword
from users.models import NewUser as User
from news_api.scrapers import google_news_scraper



def write_new_query_to_db(user, query):

    news_list  = google_news_scraper.main(query=query)


    for news in news_list:
        try:
            user = User.objects.get(username=user.username)  # replace with the current user's username
            n = News.objects.create(title=news['title'], 
                                    headline=news['title'], 
                                    content=news['summary'], 
                                    author="GoogleNewsWriter", 
                                    status="subscribed",
                                    url=news['link'],
                                    created_at=timezone.make_aware(datetime.datetime.strptime(news['published'], "%a, %d %b %Y %H:%M:%S %Z"), timezone.get_current_timezone()),
                                    )
            n.subscribers.add(user)  # add the current user as a subscriber
            keywords = Keyword.objects.get_or_create(name__in=query)  # get the keywords from the news article
            n.keywords.add(*keywords)  # add the keywords to the news article
            n.save()
        except Exception as e:
            print(e)