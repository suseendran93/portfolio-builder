import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaCrown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
                    <FaCheckCircle className="text-emerald-600" size={40} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
                <p className="text-slate-600 mb-8">
                    Congratulations! Your account has been upgraded to <span className="text-amber-500 font-bold">PREMIUM</span>.
                    You can now publish your portfolio and download resumes without watermarks.
                </p>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 flex items-center gap-4 text-left">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                        <FaCrown className="text-amber-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Premium Active</h3>
                        <p className="text-sm text-slate-500">All features unlocked for {currentUser?.email}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/builder')}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all transform hover:scale-[1.02]"
                >
                    Go to Builder
                </button>
            </div>
        </div>
    );
};

export default Success;
