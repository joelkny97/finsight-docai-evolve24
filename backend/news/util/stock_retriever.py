import sys, http.client, urllib, datetime, requests
import json
from dotenv import load_dotenv
import os
import django.db.utils

load_dotenv()

BASE_URL = 'https://api.twelvedata.com/'
ALPHA_API_KEY = os.getenv('ALPHA_API_KEY')

def get_stock_list():
    query_uri = urllib.parse.urljoin(BASE_URL, 'stocks')


    query_string= urllib.parse.urlencode({
        'country': "United States",
        'type': "Common Stock",
    })

    url = query_uri + '?'+ query_string

    try:
        response = requests.get(url)
    except requests.exceptions.HTTPError as err:
        print(err)
    else:
        data = response.json()
        stock_symbols = [ (stock['symbol'], stock['name'], stock['type'], stock['exchange'], stock['country']) for stock in data['data']]

        return stock_symbols

def write_symbols_file():
  os.makedirs('config', exist_ok=True)
  symbols = get_stock_list()
  if symbols == 0:
    return
  with open('config/symbols.txt', 'w') as text_file:
    for symbol in symbols:
    #   text_file.write(symbol[0]+'='+symbol[1]+'\n')
      text_file.write(f"{symbol[0]};{symbol[1]};{symbol[2]};{symbol[3]};{symbol[4]}\n")

def read_symbols_file():
  dict=[]
  with open('config/symbols.txt', 'r') as text_file:
    for line in text_file:
      symbol = line.split(';')[0].strip()
      name = line.split(';')[1].strip()
      type = line.split(';')[2].strip()
      index = line.split(';')[3].strip()
      country = line.split(';')[4].strip()
    #   sector = line.split(';')[5].strip() // TODO : Need to implement by fetching Sector information
      dict.append({'symbol':symbol, 'name':name, 'type':type, 'index':index, 'country':country})
  return dict

    
def get_meta_data(ticker):
    query_uri = urllib.parse.urljoin(BASE_URL, 'quote')


    query_string= urllib.parse.urlencode({
        'symbol': ticker,
        'apikey': ALPHA_API_KEY,
    })

    url = query_uri + '?'+ query_string
    response = requests.get(url)
    data = response.json()
    return data
    
def get_multi_stock_quotes(tickers:list):

    query_uri = urllib.parse.urljoin(BASE_URL, 'complex_data')
    query_string= urllib.parse.urlencode({
        'apikey': ALPHA_API_KEY,
    })

    data = json.dumps({
        "symbols": tickers,
        "intervals": ["5min"],
        "methods": [
            'quote',
        ]
    })
    url = query_uri + '?'+  query_string
    try:
        response = requests.post(url=url, data=data, headers={'Content-Type': 'application/json'})
    except requests.exceptions.HTTPError as err:
        print(err)
        return []
    except Exception as e:
        print(e)
    else:
    # print(response.request.url)
        data = response.json()['data']
        return data
def get_history_data(ticker, start_date, end_date):

    query_uri = urllib.parse.urljoin(BASE_URL, 'time_series')

    query_string= urllib.parse.urlencode({
        'symbol': ticker,
        'apikey': ALPHA_API_KEY,
        'interval': '1day',
        'start_date': start_date,
        'end_date': end_date
    })

    url = query_uri + '?'+  query_string
    response = requests.get(url)
    data = response.json()['values']
    return data