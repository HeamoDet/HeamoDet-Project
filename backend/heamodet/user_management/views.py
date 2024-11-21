from django.shortcuts import render
from rest_framework import generics,status,views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from user_management.models import User,OTP
from user_management.utils import generate_otp,is_otp_valid
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone


class GenerateOTPView(views.APIView):
    permission_classes=[AllowAny]

    def post(self, request, *args, **kwargs):
       
        email=request.data.get('email')

        if not email:
            return Response({"message":"Email is required"},status=status.HTTP_400_BAD_REQUEST)
        try:

            user = User.objects.get(email=email,is_verified=True)
            if user:
                return Response({"message":"User already exists"},status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:


            otp_entry,_=OTP.objects.get_or_create(email=email)
            otp_entry.otp=generate_otp()
            otp_entry.save()

            context = {'otp': otp_entry.otp}
            html_content = render_to_string('otp/otp.html', context)

            subject = 'Heamodet User Verification'
            message = f'Your OTP code is {otp_entry.otp}'
            from_email = 'heamodetproject@gmail.com'  
            recipient_list = [email]
            try:
                send_mail(subject, message, from_email, recipient_list, html_message=html_content,fail_silently=True)
                expiration_time = timezone.now() + timezone.timedelta(minutes=1)
                return Response({"message": f"OTP sent to {email}","expiration_time":expiration_time}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ResendOTPView(views.APIView):
    permission_classes=[AllowAny]
    def post(self, request):
      
        
        email = request.data.get("email")
        #otp_type = request.data.get("otp_type")
        response={}

        # if otp_type==None:
        #     response["errorCode"]="E10101"
        #     response["message"]=messages.E10101
        #     return Response(
        #        response, status=status.HTTP_400_BAD_REQUEST
        #     )

        
        # if otp_type!=1 and otp_type!=0:
        #     response["errorCode"]="E10102"
        #     response["message"]=messages.E10102
        #     return Response(
        #        response, status=status.HTTP_400_BAD_REQUEST
        #     )

        if not email:
            
            response["message"]="Email is required"
            return Response(
               response, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            otp_entry = OTP.objects.get(email=email)
            otp_entry.otp=generate_otp()
            otp_entry.save()

            context = {'otp': otp_entry.otp}
            html_content = render_to_string('otp/otp.html', context)

            subject = 'Heamodet User Verification'
            message = f'Your OTP code is {otp_entry.otp}'
            from_email = 'heamodetproject@gmail.com'  
            recipient_list = [email]
            try:
                send_mail(subject, message, from_email, recipient_list, html_message=html_content,fail_silently=True)
                expiration_time = timezone.now() + timezone.timedelta(minutes=1)
                return Response({"message": f"New OTP sent successfully","expiration_time":expiration_time}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

           

        except OTP.DoesNotExist:
            response["errorCode"]="E10103"
            response["message"]="Email is not found"
            return Response(
               response,
                status=status.HTTP_404_NOT_FOUND,
            )

class UserRegisterView(views.APIView):
    permission_classes=[AllowAny]

    def post(self, request, *args, **kwargs):
       
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not otp:
            return Response({"message":"OTP is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_entry=OTP.objects.get(email=email)
            if not is_otp_valid(otp_entry):
                return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
            username = request.data.get('username')
            password = request.data.get('password')
            if not username:
                return Response({"message":"username is required"},status=status.HTTP_400_BAD_REQUEST)
            if not password:
                return Response({"message":"password is required"},status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create(username=username,email=email)
            user.set_password(password)
            user.is_verified=True
            user.save()

            otp_entry.delete()
            return Response({"message": "OTP verification successful"}, status=status.HTTP_201_CREATED)
        except OTP.DoesNotExist:
            return Response({"message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)



class LoginView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)

           
            if not user.is_verified:
                return Response({"message": "User is not verified"}, status=status.HTTP_400_BAD_REQUEST)

           
            if not check_password(password, user.password):
                return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

           
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "username": user.username,
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)





    