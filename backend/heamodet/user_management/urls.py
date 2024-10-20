from django.urls import path
from user_management.views import GenerateOTPView,UserRegisterView,LoginView

urlpatterns=[
    path('generate-otp/',GenerateOTPView.as_view(),name='otp_request'),
    path('user-register/',UserRegisterView.as_view(),name='register_request'),
    path('user-login/',LoginView.as_view(),name='User-login')

]