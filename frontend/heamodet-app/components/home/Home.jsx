"use client";

import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import styles from './HomePage.module.css'; // Import CSS module
import { useRouter } from 'next/navigation';

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [detectionResult, setDetectionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleShowModal = () => {
        if (showModal) {
            setSelectedImage(null);
            setDetectionResult(null); 
        }
        setShowModal(!showModal);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setDetectionResult(null); // Reset previous results
        }
    };

    const handleDetection = async () => {
        setLoading(true);
        setDetectionResult(null);
        
        setTimeout(() => {
            setDetectionResult("Detected: Blood Cancer"); 
            setLoading(false);
        }, 2000);
    };

   

    return (
        <div className="container text-center d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: 'white' }}>
            <div>
                <h1 className={styles.welcomeText}>Welcome to Blood Cancer Detection</h1>
                <p className={styles.subtitle}>Upload an image to detect blood cancer</p>
                <Button variant="primary" className='text-white' onClick={handleShowModal}>
                    <FontAwesomeIcon icon={faUpload} className="me-2" /> {/* Icon added */}
                    Upload Image
                </Button>

                <Modal show={showModal} onHide={handleShowModal} centered>
                    <Modal.Header closeButton className={styles.modalHeader}>
                        <Modal.Title className={styles.modalHeader}>Upload Blood Sample Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control mb-3"
                        />
                        {selectedImage && (
                            <div>
                                <Image
                                    src={selectedImage}
                                    alt="Selected blood sample"
                                    width={200}
                                    height={200}
                                    style={{ objectFit: 'cover', borderRadius: '10px' }}
                                />
                                <Button
                                    variant="success"
                                    onClick={handleDetection}
                                    className="mt-3 ms-2"
                                    disabled={loading}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : "Analyze"}
                                </Button>
                            </div>
                        )}
                        {detectionResult && (
                            <div className="mt-4">
                                <h5>Detection Result:</h5>
                                <p className="alert alert-info">{detectionResult}</p>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default HomePage;
