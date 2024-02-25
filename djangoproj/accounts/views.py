from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib import auth
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from django.core.files.storage import default_storage
from rest_framework import status
from .models import Profile



class CheckAuthenticatedView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        user = self.request.user
        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': 'success',  "user": user.username}, status=200)
            else:
                return Response({ 'isAuthenticated': 'error' }, status=401)
        except:
            return Response({ 'error': 'Something went wrong when checking authentication status' }, status=400)

@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        email = data['email']
        password = data['password']
        re_password  = data['re_password']

        try:
            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' }, status=400)
                else:
                    if len(password) < 3:
                        return Response({ 'error': 'Password must be at least 3 characters' }, status=400)
                    else:
                        user = User.objects.create_user(username=username, email = email,  password=password)
                    
                        return Response({ 'success': 'User created successfully', "user" : username }, status=201)
            else:
                return Response({ 'error': 'Passwords do not match' }, status=400)
        except:
                return Response({ 'error': 'Something went wrong when registering account' }, status=400)

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        
        data = self.request.data

        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                print(f'User {username} authenticated')
                return Response({ 'success': 'User authenticated', "user": username}, status=200)
            else:
                print(f'User {username} not authenticated')
                return Response({ 'error': 'Error Authenticating' }, status=401)
        except:
            return Response({ 'error': 'Something went wrong when logging in' }, status=401)

class LogoutView(APIView):

    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Loggout Out' }, status=200)
        except:
            return Response({ 'error': 'Something went wrong when logging out' }, status=400)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set' })


class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        user = self.request.user

        try:
            User.objects.filter(id=user.id).delete()

            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Something went wrong when trying to delete user' })
        
class SetPhotoAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    

    def post(self, request, format=None):
        user = request.user
        file = request.FILES.get('photo') 
        if not file:
            return Response({'error': 'No photo provided'}, status=status.HTTP_400_BAD_REQUEST)
        
      
        try:
            profile = user.profile
        except Profile.DoesNotExist:
            profile = Profile(user=user)
        
        filename = default_storage.save(f'profile_photos/{user.username}/{file.name}', file)
        profile.photo = filename
        profile.save()

        return Response({'success': 'Photo set successfully'}, status=status.HTTP_200_OK)
