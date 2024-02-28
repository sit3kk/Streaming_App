import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns as chat_websocket_urlpatterns
from stream.routing import websocket_urlpatterns as stream_websocket_urlpatterns

from django.urls import re_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'djangoproj.settings')


django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                chat_websocket_urlpatterns + stream_websocket_urlpatterns
            )
        )
    ),

    }
)