import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-center px-4 font-inter">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
                404
            </h1>
            <p className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</p>
            <p className="text-slate-500 mb-8 max-w-md">The link you followed may be broken, or the page may have been removed.</p>
            <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-indigo-500/30"
            >
                Go to Home
            </button>
        </div>
    );
};

export default NotFound;
