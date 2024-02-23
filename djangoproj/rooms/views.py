from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Room
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from .serializers import RoomSerializer
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny


@method_decorator(login_required, name='dispatch')
@method_decorator(csrf_protect, name='dispatch')
class CreateRoomView(APIView):
    def post(self, request, format=None):
        data = self.request.data
        room_topic = data['room_topic']
        room_name = data['room_name']
        room_description = data['room_description']
        room_owner = self.request.user
        room_password = data.get('room_password')
        private = data.get('private')

        try:
            if room_name and room_description:
                
                room = Room.objects.create(
                    room_name=room_name, 
                    room_topic = room_topic, 
                    room_description=room_description, 
                    room_owner=request.user,
                    private=private,
                    room_password=room_password
                    )
        
                room.save()
                

                return Response({ 'success': 'Room created successfully', "room" : room.room_id }, status=201)
            else:
                return Response({ 'error': 'Room name and description are required' }, status=400)
        except:
            return Response({ 'error': 'Something went wrong when creating room' }, status=400)

@method_decorator(csrf_protect, name='dispatch')
class DeleteRoomView(APIView):
    def delete(self, request, format=None):
        data = self.request.data
        room_id = data.get('room_id')
        room_owner = self.request.user
        try:
            if room_id:
                room = Room.objects.get(room_id=room_id)
                if room.room_owner == room_owner:
                    room.delete()
                    return Response({ 'success': 'Room deleted successfully' }, status=200)
                else:
                    return Response({ 'error': 'You are not the owner of this room' }, status=400)
            else:
                return Response({ 'error': 'Room ID is required' }, status=400)
        except Room.DoesNotExist:
            return Response({ 'error': 'Room not found' }, status=404)
        except Exception as e:
            return Response({ 'error': 'Something went wrong when deleting room', 'details': str(e) }, status=400)
        

class ListRoomsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):

        try:
            rooms = Room.objects.all().order_by('-created_at')
            serializer = RoomSerializer(rooms, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({ 'error': 'Something went wrong when retrieving rooms', 'details': str(e) }, status=500)

