import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './Cancel.scss';

const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="cancel-page">
            <div className="cancel-page__card">
                <div className="cancel-page__icon">
                    <FaTimesCircle className="cancel-page__icon-mark" size={40} />
                </div>

                <h1 className="cancel-page__title">Payment Cancelled</h1>
                <p className="cancel-page__description">
                    No worries! Your payment was cancelled and you haven't been charged.
                    You can always upgrade later to unlock premium features.
                </p>

                <button
                    onClick={() => navigate('/builder')}
                    className="cancel-page__action"
                >
                    Back to Builder
                </button>
            </div>
        </div>
    );
};

export default Cancel;
