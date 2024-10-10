from django.urls import path
from finance.views import FinanceQAView

urlpatterns = [
    path('financeqa/', FinanceQAView.as_view(), name='financeqa'),
]