# Generated by Django 5.0.2 on 2024-02-23 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0006_alter_room_room_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='room_name',
            field=models.CharField(default='None', max_length=100),
        ),
    ]
