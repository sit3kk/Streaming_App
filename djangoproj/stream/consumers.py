import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

class WebRTCSignalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"signal_{self.room_name}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data_json = json.loads(text_data)
        event_type = data_json.get("type")

        # Handle different events: offer, answer, ICE candidate
        if event_type == "offer":
            await self.handle_offer(data_json)
        elif event_type == "answer":
            await self.handle_answer(data_json)
        elif event_type == "ice_candidate":
            await self.handle_ice_candidate(data_json)

    async def handle_offer(self, data):
        # Send offer to the specific room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_sdp",
                "sdp": data["sdp"],
                "from": self.channel_name,
                "event": "offer"
            }
        )

    async def handle_answer(self, data):
        # Send answer to the specific user who initiated the offer
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_sdp",
                "sdp": data["sdp"],
                "from": self.channel_name,
                "event": "answer"
            }
        )

    async def handle_ice_candidate(self, data):
        # Send ICE candidate to the specific room or user
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "send_ice_candidate",
                "candidate": data["candidate"],
                "from": self.channel_name
            }
        )

    # Methods to handle sending SDP and ICE candidates to clients
    async def send_sdp(self, event):
        # Filter out the sender
        if event["from"] != self.channel_name:
            await self.send(text_data=json.dumps({
                "type": event["event"],
                "sdp": event["sdp"]
            }))

    async def send_ice_candidate(self, event):
        # Filter out the sender
        if event["from"] != self.channel_name:
            await self.send(text_data=json.dumps({
                "type": "ice_candidate",
                "candidate": event["candidate"]
            }))