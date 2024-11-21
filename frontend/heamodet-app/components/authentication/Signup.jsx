"use client";
import React, { useState } from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import './signup.css'; 
import { useUser } from '@/contexts/usercontext';
import { useRouter } from 'next/navigation';
import { generateOtp } from '@/services/services';
import {useOtp} from '@/contexts/otpcontext'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';








const SignUpForm = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false);
    const {setOtpExpirationTime} = useOtp()

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch("password", "");
    const router =useRouter()

    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordShown(!confirmPasswordShown);

    const {updateUser}=useUser()

    const onSubmit = async(data)=> {
        console.log("data",data)
        const email={
            "email":data.email
        }
        try{
           setLoading(true)
           const response = await generateOtp(email)
           const expirationTime = new Date(response.data.expiration_time).getTime() / 1000;
           const truncatedExpirationTime = expirationTime.toFixed(2);
           setOtpExpirationTime( truncatedExpirationTime )
           setMessage(response.data.message)
           

           console.log(response)
           console.log("Form Data:", data);
           localStorage.setItem('signupData', JSON.stringify(data)); 
           localStorage.setItem('otpExpirationTime', truncatedExpirationTime);
           updateUser(data)
           router.push("/otp")
        }catch(error){
            console.log(error.response.data.message)
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            } else {
                setMessage("Network unable to connect to the server");
            }
        }finally{
            setLoading(false)
        }
       
    };

    return (
        <> <ToastContainer position="top-center" autoClose={false} />
        <Container
            className="d-flex justify-content-center align-items-center mt-4"
            style={{ height: '99vh', overflow: 'hidden' }}
        >
            <Card
                style={{
                    width: '40%',
                    maxWidth: '400px',
                    maxHeight: '80vh',
                    borderRadius: '8px',
                    padding: '8px',
                    backgroundColor: '#ffffff',
                }}
                className="shadow-sm"
            >
                <h5
                    className="text-center"
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        color: 'red',
                        textTransform: 'uppercase',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Create Account
                </h5>
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
                                        
                                            <p className='email-text text-center text-success'>{message}</p>
                                        
                                    </>
                                )}

                <Card.Body style={{ padding: '0.4rem', overflowY: 'auto', maxHeight: 'calc(80vh - 3rem)' }}>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId="username" className="mb-1">
                            <Form.Label style={{ fontSize: '0.75rem', color: '#6c757d' }}>Username</Form.Label>
                            <Form.Control
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`} 
                                type="text"
                                placeholder="Enter username"
                                {...register("username", { required: "Username is required" })}
                                style={{ fontSize: '0.75rem', padding: '5px', borderRadius: '5px' }}
                            />
                            {errors.username && <p className="text-danger" style={{ fontSize: '0.7rem' }}>{errors.username.message}</p>}
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-1">
                            <Form.Label style={{ fontSize: '0.75rem', color: '#6c757d' }}>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Invalid email"
                                    }
                                })}
                                style={{ fontSize: '0.75rem', padding: '5px', borderRadius: '5px' }}
                            />
                            {errors.email && <p className="text-danger" style={{ fontSize: '0.7rem' }}>{errors.email.message}</p>}
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-1">
    <Form.Label style={{ fontSize: '0.75rem', color: '#6c757d' }}>Password</Form.Label>
    <div className="input-container position-relative"> {/* Wrap input and icon */}
        <Form.Control
            type={passwordShown ? 'text' : 'password'}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`} 
            placeholder="Enter password"
            {...register("password", {
                required: "Password is required",
                minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long"
                },
                pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain at least one uppercase letter, one number, and one special character"
                }
            })}
            style={{ fontSize: '0.75rem', padding: '5px 30px 5px 5px', borderRadius: '5px' }} // Adjust padding for icon
        />
        <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordShown ? faEye : faEyeSlash} />
        </div>
    </div>
    {errors.password && <p className="text-danger" style={{ fontSize: '0.7rem' }}>{errors.password.message}</p>}
</Form.Group>

<Form.Group controlId="confirmPassword" className="mb-1">
    <Form.Label style={{ fontSize: '0.75rem', color: '#6c757d' }}>Confirm Password</Form.Label>
    <div className="input-container position-relative"> {/* Wrap input and icon */}
        <Form.Control
            type={confirmPasswordShown ? 'text' : 'password'}
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} 
            placeholder="Confirm password"
            {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === password || "Passwords do not match"
            })}
            style={{ fontSize: '0.75rem', padding: '5px 30px 5px 5px', borderRadius: '5px' }} // Adjust padding for icon
        />
        <div className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
            <FontAwesomeIcon  icon={confirmPasswordShown ? faEye : faEyeSlash} />
        </div>
    </div>
    {errors.confirmPassword && <p className="text-danger" style={{ fontSize: '0.7rem' }}>{errors.confirmPassword.message}</p>}
</Form.Group>

                        <div className="d-flex justify-content-center mt-2">
                            <button
                                type="submit"
                                className="btn btn-danger mt-3"
                                style={{
                                    width: '100%',
                                    fontSize: '0.85rem',
                                    padding: '5px',
                                    borderRadius: '6px'
                                }}
                            >
                                Sign Up <FontAwesomeIcon icon={faUserPlus} className="text-white me-1 ms-1" style={{ fontSize: '1em' }} />
                            </button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>
    );
};

export default SignUpForm;
