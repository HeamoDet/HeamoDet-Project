"use client"
import SignUpForm from "@/components/authentication/Signup";
import Navbar from "@/components/header/Navbar";
import { Userprovider } from "@/contexts/usercontext";
import { OtpProvider } from "@/contexts/otpcontext";



export default function Home() {
  return (
   <>
   
   
   <Navbar/>
    <SignUpForm/>
    
    
   </>
   
   
  );
}
