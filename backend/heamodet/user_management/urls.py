from django.urls import path
from user_management.views import GenerateOTPView,UserRegisterView,LoginView,ResendOTPView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns=[
    path('generate-otp/',GenerateOTPView.as_view(),name='otp_request'),
    path('resend-otp/',ResendOTPView.as_view(),name='resend_otp'),
    path('user-register/',UserRegisterView.as_view(),name='register_request'),
    path('user-login/',LoginView.as_view(),name='User-login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh')

]