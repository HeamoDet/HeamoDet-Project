import { axiosInstance, axiosPrivate } from "@/interceptor/Interceptor";

const generateOtp = async (data) => {
    return  await axiosPrivate.post('user/generate-otp/', data);
 };

 const resendOtp = async (data) => {
    return  await axiosPrivate.post('user/resend-otp/', data);
 };

 const registerUser = async(data) => {
   return  await axiosPrivate.post('user/user-register/', data);
 }

 const loginUser = async(data) => {
   return await axiosPrivate.post('user/user-login/',data);
 }

 
 
 export {generateOtp,
         resendOtp,
         registerUser,
         loginUser}