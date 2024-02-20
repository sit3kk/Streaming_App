from django.urls import path
from .views import CreateRoomView, DeleteRoomView, ListRoomsView

urlpatterns = [
    path('create_room', CreateRoomView.as_view()),
    path('delete_room', DeleteRoomView.as_view()),
    path('list_rooms', ListRoomsView.as_view()),

]