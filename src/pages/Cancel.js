import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const Cancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                    <FaTimesCircle className="text-red-600" size={40} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
                <p className="text-slate-600 mb-8">
                    No worries! Your payment was cancelled and you haven't been charged.
                    You can always upgrade later to unlock premium features.
                </p>

                <button
                    onClick={() => navigate('/builder')}
                    className="w-full py-4 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                    Back to Builder
                </button>
            </div>
        </div>
    );
};

export default Cancel;
