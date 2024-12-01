from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
import jwt

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'HTTP_AUTHORIZATION' in request.META:
            try:
                auth_header = request.META['HTTP_AUTHORIZATION']
                if 'Bearer' in auth_header:
                    token = auth_header.split(' ')[1]
                    # Verify token
                    payload = jwt.decode(
                        token, 
                        settings.SECRET_KEY, 
                        algorithms=['HS256']
                    )
                    request.user_token_payload = payload
            except jwt.ExpiredSignatureError:
                return JsonResponse(
                    {'error': 'Token has expired'}, 
                    status=401
                )
            except jwt.InvalidTokenError:
                return JsonResponse(
                    {'error': 'Invalid token'}, 
                    status=401
                )
        
        response = self.get_response(request)
        return response
