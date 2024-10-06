from rest_framework import serializers
from news.models import News, Category, Keyword, StockList

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'title', 'headline', 'content', 'subscribers', 'status')

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ('id', 'title', 'headline', 'content', 'subscribers', 'url', 'created_at', 'status', 'keywords', 'author')

    def update(self, instance, validated_data):
        # Add the current user to the subscribers
        user = validated_data.pop('subscribers', None)
        user_id = user[0] if user else None
        if user and user_id not in [s.id for s in instance.subscribers.all()]:
            instance.subscribers.add(user_id)

        # Update other fields
        instance.title = validated_data.get('title', instance.title)
        instance.headline = validated_data.get('headline', instance.headline)
        instance.content = validated_data.get('content', instance.content)
        instance.author = validated_data.get('author', instance.author)
        instance.status = validated_data.get('status', instance.status)
        instance.url = validated_data.get('url', instance.url)
        instance.created_at = validated_data.get('created_at', instance.created_at)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title')

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = ('id', 'name')

class StockListSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockList
        fields = ('id', 'name', 'symbol', 'instrument_type', 'country', 'sector', 'index')

