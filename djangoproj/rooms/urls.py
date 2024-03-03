from django.urls import path
from .views import CreateRoomView, DeleteRoomView, ListRoomsView, JoinToRoomView, CheckIfHostView

urlpatterns = [
    path('create_room', CreateRoomView.as_view()),
    path('delete_room', DeleteRoomView.as_view()),
    path('list_rooms', ListRoomsView.as_view()),
    path('join_room', JoinToRoomView.as_view()),
    path('is_room_owner', CheckIfHostView.as_view()),

]