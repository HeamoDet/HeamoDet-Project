import LoginForm from "@/components/authentication/Login";
import Navbar from "@/components/header/Navbar";


export default function Home() {
  return (
   <>
   <Navbar authentication={false}/>
   <LoginForm/>
   </>
    
   
  );
}
