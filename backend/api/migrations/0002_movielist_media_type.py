# Generated by Django 5.1.3 on 2024-12-01 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='movielist',
            name='media_type',
            field=models.CharField(max_length=100, null=True),
        ),
    ]