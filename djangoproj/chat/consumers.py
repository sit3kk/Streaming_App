from datetime import datetime
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.sessions.models import Session
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from django.utils import timezone
from rooms.models import Room



class ChatConsumer(AsyncWebsocketConsumer):

    active_users = {}


    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope["user"] 


      
     
        

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()


        initial_user_count = len(self.active_users)
        

        if self.user not in self.active_users:
            self.active_users[self.user] = 1

            if not self.user.is_anonymous:
                
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                    "type": "chat.message",
                    "message": f"{self.user.username} joined the chat",
                    "username": "System" 
                    }
            )
        else:
            self.active_users[self.user] += 1

        if len(self.active_users) != initial_user_count:
            await self.update_viewers_list()


   
        await self.set_viewers()


      
    async def disconnect(self, close_code):
        

        initial_user_count = len(self.active_users)

        

        if self.active_users[self.user] == 1:
            del self.active_users[self.user]

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat.message",
                    "message": f"{self.user.username} left the chat",
                    "username": "System" 
                }
            )
        else:
            self.active_users[self.user] -= 1

        if len(self.active_users) != initial_user_count:
            await self.update_viewers_list()

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.set_viewers()

    async def receive(self, text_data):
        
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        self.user = self.scope["user"]


        if self.user.is_anonymous:
            await self.send(text_data=json.dumps({"disable_message": True}))
            return
 
        
        await self.channel_layer.group_send(self.room_group_name, {
            "type": "chat_message",
            "message": message,
            "username": self.user.username
        })

    
    async def chat_message(self, event):

        if self.user.is_anonymous:
            await self.send(text_data=json.dumps({"disable_message": True}))
            return

        message = event["message"]
        username = event["username"]

        await self.send(text_data=json.dumps({
            "message": message,
            "username": username
        }))

    async def set_viewers(self):
        try:
            room = await database_sync_to_async(Room.objects.get)(room_id=self.room_name)
            await database_sync_to_async(room.set_viewers)(len(self.active_users))
    
        except Room.DoesNotExist:
            pass
        except Exception as e:
            print(e)


    async def update_viewers_list(self):
  
        viewers_list = [user.username for user in self.active_users.keys()]  

        viewers_list_message = {
        "type": "viewers_list",
        "viewers_list": viewers_list,
    }

        await self.channel_layer.group_send(self.room_group_name, viewers_list_message)




    
    async def viewers_list(self, event):
  
        await self.send(text_data=json.dumps({
            'type': 'viewers_list',
            'viewers_list': event['viewers_list']
        }))
        
