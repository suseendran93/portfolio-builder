import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaCrown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import './Success.scss';

const Success = () => {
    const navigate = useNavigate();
    const { currentUser, userData } = useAuth();

    useEffect(() => {
        // In a real app, we'd verify the sessionId here.
        // For this demo, we assume success if they landed here.
        if (userData?.tier === 'PREMIUM') {
            toast.success("Welcome to Premium!");
        }
    }, [userData]);

    return (
        <div className="success-page">
            <div className="success-page__card">
                <div className="success-page__icon">
                    <FaCheckCircle className="success-page__icon-mark" size={40} />
                </div>

                <h1 className="success-page__title">Payment Successful!</h1>
                <p className="success-page__description">
                    Congratulations! Your account has been upgraded to <span className="success-page__highlight">PREMIUM</span>.
                    You can now publish your portfolio and download resumes without watermarks.
                </p>

                <div className="success-page__status">
                    <div className="success-page__status-icon">
                        <FaCrown className="success-page__status-mark" size={24} />
                    </div>
                    <div>
                        <h3 className="success-page__status-title">Premium Active</h3>
                        <p className="success-page__status-text">All features unlocked for {currentUser?.email}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/builder')}
                    className="success-page__action"
                >
                    Go to Builder
                </button>
            </div>
        </div>
    );
};

export default Success;
