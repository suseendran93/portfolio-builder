import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaLock, FaUser } from 'react-icons/fa';
import './Login.scss';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, currentUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/builder');
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(email, password);
            navigate('/builder');
        } catch (err) {
            setError("Failed to log in: " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="login">
            <div className="login__card">
                <div className="login__content">
                    <div className="login__brand">
                        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="BuildFolio Logo" className="login__logo" />
                        <h2 className="login__title">
                            Welcome Back
                        </h2>
                        <p className="login__subtitle">Sign in to manage your portfolio</p>
                    </div>

                    {error && (
                        <div className="login__error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login__form">
                        <div className="login__field">
                            <label className="login__label">Email Address</label>
                            <div className="login__control">
                                <div className="login__icon">
                                    <FaUser />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="login__input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="login__field">
                            <label className="login__label">Password</label>
                            <div className="login__control">
                                <div className="login__icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="login__input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="login__submit"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="login__footer">
                        <p className="login__footer-text">
                            Don't have an account?{' '}
                            <Link to="/signup" className="login__link">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
