# Generated by Django 5.0.2 on 2024-02-20 19:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='room_name',
            field=models.CharField(default='None', max_length=100),
        ),
        migrations.AlterField(
            model_name='room',
            name='room_topic',
            field=models.CharField(default='None', max_length=100),
        ),
    ]