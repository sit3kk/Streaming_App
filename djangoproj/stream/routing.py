from django.urls import re_path
from .consumers import WebRTCSignalConsumer

websocket_urlpatterns = [
    re_path(r'ws/signal/(?P<room_name>\w+)/$', WebRTCSignalConsumer.as_asgi()),
]
