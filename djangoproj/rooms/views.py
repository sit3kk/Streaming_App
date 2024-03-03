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
from rest_framework import permissions



@method_decorator(csrf_protect, name='dispatch')
class CreateRoomView(APIView):
    permission_classes = [permissions.IsAuthenticated]


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
        


class JoinToRoomView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data

        username = request.user.username


        id = data.get('room_id')
        password = data.get('room_password')

 
        try:
            room = Room.objects.get(room_id=id)
            room_owner = room.room_owner

            if room.private:
                if room.room_password == password:
               
                    is_owner = request.user.is_authenticated and room_owner == request.user.username

                  
                    user_status = 'authenticated' if request.user.is_authenticated else 'anonymous'
                    return Response({
                        'success': f'{user_status.capitalize()} user {username} joined room',
                        'is_owner': is_owner
                    }, status=200)
                else:
                    return Response({'error': 'Password is incorrect'}, status=400)
            else:
       
                is_owner = request.user.is_authenticated and room_owner == request.user
                user_status = 'authenticated' if request.user.is_authenticated else 'anonymous'
                return Response({
                    'success': f'{user_status.capitalize()} user {username} joined room',
                    'is_owner': is_owner
                }, status=200)
        except Room.DoesNotExist:
            return Response({'error': 'Room does not exist'}, status=404)
        except Exception as e:
            return Response({'error': 'Something went wrong when joining room'}, status=400)




class CheckIfHostView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    

    def post(self, request, format=None):

        try:
            data = request.data
            room_id = data.get('room_id')
            room = Room.objects.get(room_id=room_id)
            room_owner = room.room_owner
       
            is_owner = str(room_owner) == str(request.user.username)
            return Response({'is_owner': is_owner}, status=200)
        except Room.DoesNotExist:
            return Response({'error': 'Room does not exist'}, status=404)
        except Exception as e:
            return Response({'error': 'Something went wrong when checking if user is host'}, status=400)



