# Generated by Django 5.0.2 on 2024-02-23 16:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0004_room_viewers'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='private',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='room',
            name='room_password',
            field=models.CharField(default='None', max_length=100),
        ),
    ]
