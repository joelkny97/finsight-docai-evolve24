from django.contrib import admin
from .models import News, Category, Keyword, StockList
# Register your models here.


@admin.register(News)
class SubscriberAdmin(admin.ModelAdmin):

    list_display = ('title','id', 'author', 'status', 'slug')
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Category)

@admin.register(Keyword)
class KeywordAdmin(admin.ModelAdmin):

    list_display = ('name', 'id')

admin.site.register(StockList)