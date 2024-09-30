import aiohttp
import asyncio
import json
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
from dotenv import load_dotenv
import openai
import os
import traceback
import feedparser

load_dotenv()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_body_content(html):
    soup = BeautifulSoup(html, "html.parser")
    body_content = soup.body.get_text(separator="\n", strip=True)
    body_content = body_content.replace("\n", " ")
    return body_content

async def extract_content(html):
    try:
        chat_completion = openai.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an AI Agent that summarizes the news article from the HTML page. Please summarize the article."},
                {"role": "user", "content": f"HTML: ```{html}```"}
            ],
            model="gpt-4"
        )

        result = chat_completion.choices[0].message.content
        return result
    except Exception as e:
        traceback.print_exc()
        return None

async def scrape_link(link):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(link)
        await page.wait_for_timeout(5000)

        title = await page.title()
        content = await page.content()
        body_content = extract_body_content(content)

        await browser.close()
        return {"title": title, "content": body_content}

async def scrape_google_news_feed(query, write_to_file=False):
    rss_url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
    async with aiohttp.ClientSession() as session:
        async with session.get(rss_url) as response:
            feed = await response.text()
            feed_entries = feedparser.parse(feed).entries[:2]

    tasks = []
    results = []

    for entry in feed_entries:
        title = entry.title
        link = entry.link
        description = entry.description
        pubdate = entry.published
        source = entry.source

        tasks.append(scrape_link(link))

    page_data_list = await asyncio.gather(*tasks)

    for entry, page_data in zip(feed_entries, page_data_list):
        page_title = page_data.get("title", "")
        summary = await extract_content(page_data.get("content", ""))

        results.append({
            "title": entry.title,
            "link": entry.link,
            "description": entry.description,
            "published": entry.published,
            "source": entry.source,
            "page_title": page_title,
            "summary": summary
        })

    if write_to_file:
        with open("output.json", "w") as f:
            f.write(json.dumps(results, indent=4))
    
    return results


def main(query):
    return asyncio.run(scrape_google_news_feed(query, write_to_file=False))
# if __name__ == "__main__":
#     query = "AAPL"
#     asyncio.run(scrape_google_news_feed(query, write_to_file=False))
