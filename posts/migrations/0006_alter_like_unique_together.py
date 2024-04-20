# Generated by Django 5.0.3 on 2024-04-20 21:35

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_alter_like_unique_together'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='like',
            unique_together={('post', 'user')},
        ),
    ]
