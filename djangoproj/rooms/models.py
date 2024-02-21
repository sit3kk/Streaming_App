import random
import string
from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string


class Room(models.Model):
    room_id = models.CharField(primary_key=True, max_length=6, unique=True) 
    room_name = models.CharField(max_length=100, default='None')
    room_topic = models.CharField(max_length=100,default='None')
    room_owner = models.ForeignKey(User, related_name='rooms', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    room_description = models.TextField()
    viewers = models.IntegerField(default=0)


    def set_viewers(self, viewers):
        self.viewers = viewers
        self.save()
        

    def save(self, *args, **kwargs):
        if not self.room_id:  
            unique_id = self.generate_unique_id()
            self.room_id = unique_id
        super(Room, self).save(*args, **kwargs)
       # Chat.objects.create(room=self)

    @staticmethod
    def generate_unique_id():
        while True:
            unique_id = get_random_string(length=6, allowed_chars=string.ascii_letters + string.digits)
            if not Room.objects.filter(room_id=unique_id).exists():
                return unique_id