"use client";
import React, { useState } from 'react';
import { Container, Card, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faSignInAlt, faHeartbeat,faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import './signup.css'
import { loginUser } from '@/services/services';
import { ToastContainer, toast } from 'react-toastify';



const LoginForm = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const [message, setMessage] = useState()
    const [loading, setLoading] = useState(false);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const onSubmit = async(data) => {
        console.log("Form Data:", data);
        try{
            setLoading(true)
            const response = await loginUser(data)
            console.log(response);
            toast.success(response.data.message, { autoClose: 3000 });
            let newAuthTokens = JSON.stringify({
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
              });
            localStorage.setItem('authTokens', newAuthTokens);
            router.push("/user")
        }catch(error){
            console.log(error);
            if (error?.response?.data?.message) {
                setMessage(error.response.data.message)

            } else {
                
                toast.error("Network unable to connect to the server", { autoClose: 3000 });
            }
            setLoading(false)
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
                    padding: '8px',
                    backgroundColor: '#ffffff',

                }}
                className="shadow-sm"
            >

                <h5
                    className='text-center'
                    style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        color: 'red',
                        textTransform: 'uppercase',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Login
                </h5>
                <>
                {loading ? (
                                <div className="loading-section">
                                    <p className="sending-text email-text text-center ">Please wait</p>
                                    <div className="loading-dots">
                                        <div className="dot-1"></div>
                                        <div className="dot-2"></div>
                                        <div className="dot-3"></div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {message ? (
                                        <p className={`email-text text-center ${message === 'Login successful' ? 'text-success' : 'text-danger'}`}>{message}</p>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                            </>
                <Card.Body style={{ padding: '0.4rem' }}>
                <Form onSubmit={handleSubmit(onSubmit)}>


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
                                Login  <FontAwesomeIcon icon={faSignInAlt} className="text-white me-1 ms-1" style={{ fontSize: '1em' }} />
                            </button>

                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </>
    );
};

export default LoginForm;
