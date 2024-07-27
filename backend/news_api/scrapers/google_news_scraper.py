import feedparser

class googleNewsFeedScraper:
    def __init__(self, query):
        self.query = query
        

    def scrape_google_news_feed(self):
        rss_url = f'https://news.google.com/rss/search?q={self.query}&hl=en-US&gl=US&ceid=US:en'
        feed = feedparser.parse(rss_url)

        if feed.entries:
            for entry in feed.entries:
                title = entry.title
                link = entry.link
                description = entry.description
                pubdate = entry.published
                source = entry.source
                print(f"Title: {title}\nLink: {link}\nDescription: {description}\nPublished: {pubdate}\nSource: {source}")
                print("-+-")
        else:
            print("Nothing Found!")

if __name__ == "__main__":
    query = 'AAPL'
    scraper = googleNewsFeedScraper(query)
    scraper.scrape_google_news_feed()