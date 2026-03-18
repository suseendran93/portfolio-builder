import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import TrustLinks from '../TrustLinks/TrustLinks';
import './Signup.scss';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== passwordConfirm) {
            return setError("Passwords do not match");
        }

        if (password.length < 6) {
            return setError("Password should be at least 6 characters");
        }

        try {
            setError("");
            setLoading(true);
            await signup(email, password);
            navigate("/builder");
        } catch (err) {
            setError("Failed to create an account: " + err.message);
        }

        setLoading(false);
    }

    return (
        <div className="signup">
            <div className="signup__card">
                <div className="signup__content">
                    <div className="signup__brand">
                        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="BuildFolio Logo" className="signup__logo" />
                        <h2 className="signup__title">
                            Create Account
                        </h2>
                        <p className="signup__subtitle">Join us to build your professional portfolio</p>
                    </div>

                    {error && (
                        <div className="signup__error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="signup__form">
                        <div className="signup__field">
                            <label className="signup__label">Email Address</label>
                            <div className="signup__control">
                                <div className="signup__icon">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="signup__input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="signup__field">
                            <label className="signup__label">Password</label>
                            <div className="signup__control">
                                <div className="signup__icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="signup__input"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="signup__field">
                            <label className="signup__label">Confirm Password</label>
                            <div className="signup__control">
                                <div className="signup__icon">
                                    <FaLock />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="signup__input"
                                    placeholder="Confirm your password"
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="signup__submit"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="signup__footer">
                        <p className="signup__footer-text">
                            Already have an account?{' '}
                            <Link to="/" className="signup__link">
                                Log In
                            </Link>
                        </p>
                        <p className="signup__trust-copy">
                            Draft privately, refine your content, then publish only when you are ready to share.
                        </p>
                        <TrustLinks className="signup__trust-links" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
