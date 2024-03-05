from django.urls import path
from .views import CreateRoomView, DeleteRoomView, ListRoomsView, AuthenticateRoomView, CheckIfHostView, RoomAccessView

urlpatterns = [
    path('create_room', CreateRoomView.as_view()),
    path('delete_room', DeleteRoomView.as_view()),
    path('list_rooms', ListRoomsView.as_view()),
    path('authenticate_room', AuthenticateRoomView.as_view()),
    path('room_access', RoomAccessView.as_view()),
    path('is_room_owner', CheckIfHostView.as_view()),

]