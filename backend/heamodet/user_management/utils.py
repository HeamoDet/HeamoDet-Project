
import random
from datetime import timedelta
from django.utils import timezone

def generate_otp():
   
    return f'{random.randint(1000, 9999)}'

def is_otp_valid(otp_entry):

    valid_duration = timedelta(minutes=30)
    return otp_entry.created_at >= timezone.now() - valid_duration
