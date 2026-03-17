import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <h1 className="not-found__code">
                404
            </h1>
            <p className="not-found__title">Page Not Found</p>
            <p className="not-found__description">The link you followed may be broken, or the page may have been removed.</p>
            <button
                onClick={() => navigate('/')}
                className="not-found__action"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;
