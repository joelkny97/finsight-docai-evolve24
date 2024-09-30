from django.core.management.base import BaseCommand
from news.util.stock_retriever import read_symbols_file, write_symbols_file, get_stock_list
import os
from news.models import StockList


class Command(BaseCommand):
    help = 'Fetch and update stock data from the external API'


    
    def handle(self, *args, **kwargs):

        if not os.path.exists('config/symbols.txt'):
            write_symbols_file()
        else:
            stocks = read_symbols_file()
            for stock in stocks:
                # Extract relevant information
                name = stock.get('name')
                symbol = stock.get('symbol')
                index = stock.get('index')
                country = stock.get('country')
                # sector = stock.get('sector') // TODO : Need to implement by fetching Sector information
                instrument_type = stock.get('type')
                
                # Create or update the stock in the database
                StockList.objects.update_or_create(
                    symbol=symbol,
                    defaults={
                        'name': name,
                        'index': index,
                        'country': country,
                        # 'sector': sector, // TODO : Need to implement by fetching Sector information
                        'instrument_type': instrument_type,
                    }
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully updated stock data'))