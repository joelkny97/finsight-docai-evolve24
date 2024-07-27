# Generated by Django 5.0.7 on 2024-07-25 21:08

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=250)),
                ('headline', models.TextField(null=True)),
                ('content', models.TextField()),
                ('author', models.TextField(null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('image', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('url', models.URLField(blank=True, null=True)),
                ('status', models.CharField(choices=[('subscribed', 'Subscribed'), ('unsubscribed', 'Unsubscribed'), ('deleted', 'Deleted'), ('archived', 'Archived'), ('hidden', 'Hidden'), ('all', 'All')], default='all', max_length=25)),
                ('slug', models.SlugField(max_length=250, unique_for_date='created_at')),
                ('category', models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='news.category')),
                ('subscribers', models.ManyToManyField(blank=True, related_name='subscribers', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
