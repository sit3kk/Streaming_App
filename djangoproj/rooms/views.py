from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class TestView(APIView):
    def get(self, request, format=None):

        if request.user.is_authenticated:
            return Response({ 'success': 'Test endpoint', "user": request.user.username }, status=200)

        else:
            return Response({ 'error': 'User is not authenticated' }, status=401)
        