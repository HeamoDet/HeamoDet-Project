"use client";

import React,{useEffect,useState} from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useOtp } from '@/contexts/otpcontext';
import { useUser } from '@/contexts/usercontext';
import { registerUser, resendOtp } from '@/services/services';
import { useRouter } from 'next/navigation';




const ReactCodeInput = dynamic(() => import('react-code-input'), { ssr: false });

const OtpForm = () => {
    const { register, handleSubmit, watch,setValue, formState: { errors } } = useForm();
    const { setOtpValue, expirationTime, setOtpExpirationTime } = useOtp();
    const [timer, setTimer] = useState(0);
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false);
    const {user,updateUser}=useUser()
    const [userData,setUserData] = useState()
    const router = useRouter();
    
    const otp = watch("otp", ""); 

    const inputStyle = {
        width: '45px',
        height: '45px',
        fontSize: '1.2rem',
        borderRadius: '5px',
        border: '1px solid #ced4da',
        textAlign: 'center',
        margin: '3px'
    };

    useEffect(() => {
        const savedUserData = JSON.parse(localStorage.getItem('signupData'));
        setUserData(savedUserData)
        const savedExpirationTime = localStorage.getItem('otpExpirationTime');
    
        if (savedUserData && savedExpirationTime) {
            
            updateUser({ email: savedUserData.email });
            setOtpExpirationTime(parseInt(savedExpirationTime, 10));
        }
    }, []);

    useEffect(() => {
        console.log("Use effect timer",expirationTime);
        if (expirationTime) {
            const interval = setInterval(() => {
                const remainingTime = expirationTime - Math.floor(Date.now() / 1000);
                if (remainingTime > 0) {
                    setTimer(Math.floor(remainingTime));
                } else {
                    setTimer(0);
                    clearInterval(interval);
                }
            }, 1000);
    
           
            return () => clearInterval(interval);
        }
    }, [expirationTime]);
    



    const onSubmit = async(data) => {
        console.log('OTP submitted:', data.otp);
        console.log("User Data",userData);
        const finalData = {
            "otp":data.otp,
            "email":userData.email,
            "username":userData.username,
            "password":userData.password
        }
        try{
           const response = await registerUser(finalData)
           console.log("Response in after register",response);
           router.push('/login') 
        }catch(error){
            if (error?.response?.data?.message) {
                setMessage(error.response.data.message)
            } else {
                setMessage("Network unable to connect to the server");
            }
        }
        
 
    };

    const handleResendOtp=async()=>{
        try{
            setLoading(true)
        console.log("resend otp")
        const data = {
            "email":user.email
        }
        const response = await resendOtp(data)
        setMessage(response.data.message)
        const expirationTime = new Date(response.data.expiration_time).getTime() / 1000;
        const truncatedExpirationTime = expirationTime.toFixed(2);
        setOtpExpirationTime(truncatedExpirationTime)
        localStorage.setItem('otpExpirationTime', truncatedExpirationTime);
    }catch(error){
        if (error?.response?.data?.message) {
            setMessage(error.response.data.message)
        } else {
            setMessage("Network unable to connect to the server");
        }

    }finally{
        setLoading(false)
    }
    }

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100 mt-3">
            <div className="row d-flex align-items-center justify-content-center">
                <div className="card shadow-sm d-flex align-items-center" style={{ padding: '8%', border: '0', minWidth: '320px', maxWidth: '320px' }}>
                    <div className="card-header text-center" style={{ border: '0', backgroundColor: 'white' }}>
                        <h2 className="text-dark" style={{ fontWeight: 'bold', color: '#343a40', fontSize: '1.5rem' }}>You've Got Email</h2>
                        {loading ? (
                                <div className="loading-section">
                                    <p className="sending-text email-text text-center ">Sending OTP</p>
                                    <div className="loading-dots">
                                        <div className="dot-1"></div>
                                        <div className="dot-2"></div>
                                        <div className="dot-3"></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {message ? (
                                        <p className={`email-text text-center ${message === 'New OTP sent successfully' || message === 'OTP verification successful' ? 'text-success' : 'text-danger'}`}>{message}</p>
                                    ) : (
                                        <p className="email-text text-center">We have sent the OTP verification code to your email address. Check your email and enter the code below.</p>
                                    )}
                                </>
                            )}
                    </div>
                    <form aria-label="form" name="forget-password-form" method="POST" className="d-flex flex-column align-items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3 d-flex justify-content-center">
                            <ReactCodeInput
                                type="text"
                                fields={4}
                              
                                className={`form-control ${errors.otp ? 'is-invalid' : ''}`} 
                                {...register("otp", { required: "OTP is required", minLength: { value: 4, message: "OTP must be 4 digits" } })} 
                                onChange={(value) => {
                                    
                                    setValue("otp", value)}}
                                inputStyle={inputStyle}
                            />
                           
                        </div>
                        {errors.otp && <span className="text-danger">{errors.otp.message}</span>} 
                        <div className="row text-center text-danger mt-2">
                                    {timer > 0 ? <p className="custom-time">
                                        {`OTP expires in ${timer} seconds`}
                                    </p> : <button type='button' onClick={handleResendOtp} style={{
                                        border: 'none',
                                        background: 'none',
                                        padding: 0,
                                        outline: 'none',

                                    }}>
                                        Resend
                                    </button>}
                                    </div>
                        <button type="submit" className="btn btn-danger" style={{ fontSize: '0.9rem', padding: '8px 20px', width: '100%' }}>
                            Confirm
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OtpForm;
