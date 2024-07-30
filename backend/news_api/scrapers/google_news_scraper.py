import feedparser
from playwright.sync_api import sync_playwright
from openai import OpenAI
import os
import traceback
import json
from dotenv import load_dotenv
from bs4 import BeautifulSoup

load_dotenv()

openai_client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)


def extract_body_content(html):
    soup = BeautifulSoup(html, "html.parser")
    body_content = soup.body.get_text(separator="\n", strip=True)
    body_content = body_content.replace("\n", " ")
    return body_content


# TODO : Add exception handling
# TODO : Add logging
# TODO : Remove static URL and static query feeds
class googleNewsFeedScraper:
    def __init__(self, query):
        self.query = query

    def extract_content(self, html):
        try:
            chat_completion = openai_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI Agent that summarizes the news article from the HTML page. Please summarize the article.",
                    },
                    {
                        "role": "user",
                        "content": f"HTML: ```{html}```",
                    },
                ],
                model="gpt-4o",
            )

            result = chat_completion.choices[0].message.content

            return result
        except Exception as e:
            traceback.print_exc()
            return None

    def scrape_link(self, link):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()
            page.goto(link)
            page.wait_for_timeout(5000)

            # Example: Extract the page title
            title = page.title()
            print(f"Page title: {title}")

            # Example: Extract some content from the page
            content = page.content()

            body_content = extract_body_content(content)
            # print(
            #     f"Page content: {content[:500]}"
            # )  # Print the first 500 characters of the content

            browser.close()
            return {"title": title, "content": body_content}

    def scrape_google_news_feed(self):
        rss_url = f"https://news.google.com/rss/search?q={self.query}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss_url)

        feed_entries = feed.entries[:2]

        results = []

        if feed_entries:
            for entry in feed_entries:
                title = entry.title
                link = entry.link
                page_data = self.scrape_link(link)
                description = entry.description
                pubdate = entry.published
                source = entry.source
                page_title = page_data.get("title", "")
                summary = self.extract_content(page_data.get("content", ""))
                results.append(
                    {
                        "title": title,
                        "link": link,
                        "description": description,
                        "published": pubdate,
                        "source": source,
                        "page_title": page_title,
                        "summary": summary,
                    }
                )

        with open("output.json", "w") as f:
            f.write(json.dumps(results, indent=4))

        return results


if __name__ == "__main__":
    query = "AAPL"
    scraper = googleNewsFeedScraper(query)
    scraper.scrape_google_news_feed()
