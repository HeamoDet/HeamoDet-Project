"use client"
import React,{createContext,useState,useContext, useMemo,useEffect} from 'react'

const UserContext = createContext();

export const Userprovider = ({children})=>{
    const [user,setUser] = useState({
        username:'',
        email:' ',
        password:'',
    })
    useEffect(()=>{
        console.log(user)
    },[user])

    const updateUser = (newDetails)=>{
       setUser((prevUser)=>({
        ...prevUser,
        ...newDetails
       }));
    }

    const logout = () => {
        setUser({
          username: '',
          email: '',
          password:'',
        });
      };

      const value = useMemo(() => ({
        user,
        updateUser,
        logout,
      }), [user]);


      return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
      )
};
export const useUser = ()=>{
    return useContext(UserContext)
}