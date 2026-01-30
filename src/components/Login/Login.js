import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
// import { PortfolioContext } from '../../context/PortfolioContext'; // Removed old context usage for auth

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
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "var(--bg-primary-light)", color: "var(--text-primary-light)" }}>
            <Card style={{ width: '400px', padding: '2rem', background: "var(--bg-card-light)", backdropFilter: "blur(15px)", border: "1px solid var(--border-light)", boxShadow: "0 8px 32px var(--shadow-light)" }} className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4" style={{ fontWeight: "bold" }}>Portfolio Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", color: "inherit" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-light)", color: "inherit" }}
                            />
                        </Form.Group>
                        <Button disabled={loading} variant="primary" type="submit" className="w-100" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 1), rgba(139, 92, 246, 1))", border: "none" }}>
                            Login
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        Need an account? <Link to="/signup" style={{ color: 'var(--text-primary-light)' }}>Sign Up</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;
