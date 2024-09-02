import aiohttp
import feedparser
import asyncio
import platform
from pygooglenews import GoogleNews
from playwright.async_api import async_playwright
import os
import traceback
import json
from dotenv import load_dotenv
from bs4 import BeautifulSoup



class TopNewsFetcher:

    def __init__(self, query):
        self.query = query
        self.results = []


    async def scrape_top_news(self, url=None):
        async with aiohttp.ClientSession() as session:
            if url is None:
                url = f"https://news.google.com/rss/search?q={self.query}&hl=en-US&gl=US&ceid=US:en"

            async with session.get(url) as response:
                if response.status == 200:
                    feed = await response.text()

                    feed = feedparser.parse(feed)

                    feed_entries = feed.entries[:6]

                    if feed_entries:
                        for entry in feed_entries:
                            title = entry.title
                            link = entry.link

                            page_data = await self.scrape_link(link)

                            description = entry.description
                            pubdate = entry.published
                            source = entry.source
                            page_title = page_data.get("title", "")
                            summary = self.extract_content(page_data.get("content", ""))
                            self.results.append(
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

    # async def scrape_link(self, link):
    #     async with aiohttp.ClientSession() as session:
    #         async with session.get(link) as response:
    #             if response.status == 200:
    #                 page_data = await response.text()
    #                 return {"title": "", "content": page_data}
                
    async def scrape_link(self, link):
        
        
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(link, wait_until="domcontentloaded")
            await page.wait_for_timeout(3000)

            # Example: Extract the page title
            title = await page.title()
            print(f"Page title: {title}")

            # Example: Extract some content from the page
            content = await page.content()

            body_content = await self.extract_body_content(content)
            # print(
            #     f"Page content: {content[:500]}"
            # )  # Print the first 500 characters of the content

            await browser.close()
            return {"title": title, "content": body_content}

    def extract_content(self, content):
        return content
    
    async def extract_body_content(self, html):
        soup = BeautifulSoup(html, "html.parser")
        try:
            article_body = soup.find('article')
            
            if article_body is None:
                article_body = soup.body.find_all('p')
                article_content = '\n'.join([para.text for para in article_body])
            else:

            # body_content = soup.body.get_text(separator="\n", strip=True)
            
                para_text =  article_body.get_text(separator="<p>", strip=True)
            
                article_content = para_text.replace("<p>", " ")
        except AttributeError as ne:
            traceback.print_exc()
            return None
        except Exception as e:
            traceback.print_exc()
            return None
        else:
            return article_content

    # async def extract_news_content(self, html):
    #     soup = BeautifulSoup(html, "html.parser")
    #     body_content = soup.body.get_text(separator="\n", strip=True)
    #     body_content = body_content.replace("\n", " ")
    #     return body_content
    
    def get_results(self):
        return self.results
    

def main():
    scraper = TopNewsFetcher("finance")
    asyncio.run(scraper.scrape_top_news())
    results = scraper.get_results()
    return results
# if __name__ == "__main__":
#     # if platform.system()=='Windows':
#     #     asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
#     scraper = TopNewsFetcher("aapl")
#     asyncio.run(scraper.scrape_top_news())
#     results = scraper.get_results()
#     print(results)