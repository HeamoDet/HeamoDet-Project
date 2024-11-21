import OtpForm from "@/components/authentication/OtpForm";
import Navbar from "@/components/header/Navbar";




export default function Home() {
  return (
   <>
   
   <Navbar authentication={false}/>
    <OtpForm/>
   
   </>
  
   
  );
}
