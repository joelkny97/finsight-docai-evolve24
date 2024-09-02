from django.db import models
from django.conf import settings

# Create your models here.

class Accounts(models.Model):
    account_number = models.CharField(max_length=250, unique=True)
    account_name = models.CharField(max_length=250)
    account_type = models.CharField(max_length=250)
    account_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return str("*"*(len(self.account_number)-4)) + self.account_number[-4:]
    
class AccountDetails(models.Model):
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    account_balance = models.FloatField()
    account_currency = models.CharField(max_length=3)
    
    def __str__(self):
        return str("*"*(len(self.account.account_number)-4)) + self.account.account_number[-4:]

class TransactionCategory(models.Model):
    category = models.CharField(max_length=250, default="Other", unique=True)

    def __str__(self):
        return self.category

class Transactions(models.Model):
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=250)
    category = models.ForeignKey(TransactionCategory, on_delete=models.SET_DEFAULT,default=TransactionCategory.objects.get(category="Other"), null=True)
    transaction_type = models.MultipleField(choices=[('Debit', 'Debit'), ('Credit', 'Credit')], max_length=250)
    amount = models.FloatField()

class StockTransaction(models.Model):
    stock_name = models.CharField(max_length=250,unique=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE)
    stock_price = models.FloatField()
    stock_quantity = models.FloatField()
    transaction_type = models.MultipleField(choices=[('Buy', 'Buy'), ('Sell', 'Sell')], max_length=250)


class InvestmentPortfolio(AccountDetails):
    account = models.ForeignKey(Accounts, on_delete=models.CASCADE, unique=True)
    stock_name = models.CharField(max_length=250,unique=True)
    quantity = models.FloatField()
    value = models.FloatField()





    
    



