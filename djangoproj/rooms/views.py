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
from cryptography.fernet import Fernet




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
        

'''
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

'''

key= Fernet.generate_key()

cipher_suite = Fernet(key)

class KeyHolder:
    key = Fernet.generate_key()
    cipher_suite = Fernet(key)

class AuthenticateRoomView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data
        username = data.get('username')
        room_id = data.get('room_id')
        room_password = data.get('room_password')


        try:
            room = Room.objects.get(room_id=room_id)
            
            if room.private == False:
                return Response({'room_token': 'None'}, status=status.HTTP_200_OK)

            elif room.private == True and room.room_password == room_password:
        
                room_id_and_username = f"{room.room_id},{username}".encode('utf-8')
                encrypted_data = KeyHolder.cipher_suite.encrypt(room_id_and_username)

                return Response({'room_token': encrypted_data.decode('utf-8')}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Wrong password'}, status=status.HTTP_400_BAD_REQUEST)
        except Room.DoesNotExist:
            return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

class RoomAccessView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        data = request.data
        room_id = data.get('room_id')
        username = data.get('username')
        room_token = data.get('room_token')


        try:

            room = Room.objects.get(room_id=room_id)

            if room.private == False:
                return Response({'room_token': 'None'}, status=status.HTTP_200_OK)
            
            if not room_token:
                return Response({'error': 'Room token is required'}, status=status.HTTP_400_BAD_REQUEST)

            room_token_bytes = room_token.encode('utf-8')
            decrypted_data = KeyHolder.cipher_suite.decrypt(room_token_bytes).decode('utf-8')
            encoded_room_id, encoded_username = decrypted_data.split(',')

            
            if room.room_id == encoded_room_id and encoded_username == username:
                return Response({'message': 'Access granted', 'room_id' : room.room_id, 'username' : username}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)

        except Room.DoesNotExist:
            return Response({'error': 'Room does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': f'Something went wrong when authenticating room: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)



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



