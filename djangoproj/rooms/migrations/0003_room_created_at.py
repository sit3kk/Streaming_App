# Generated by Django 5.0.2 on 2024-02-20 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0002_alter_room_room_name_alter_room_room_topic'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default='2023-01-25 15:30:00+01:00'),
            preserve_default=False,
        ),
    ]