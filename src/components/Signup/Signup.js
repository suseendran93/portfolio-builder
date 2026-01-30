import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "var(--bg-primary-light)" }}>
            <Card style={{ width: '400px', padding: '2rem', background: "var(--bg-card-light)", backdropFilter: "blur(15px)" }} className="shadow-lg">
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>
                        <Form.Group id="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group id="password-confirm" className="mb-3">
                            <Form.Label>Password Confirmation</Form.Label>
                            <Form.Control type="password" required onChange={(e) => setPasswordConfirm(e.target.value)} />
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                        Already have an account? <Link to="/">Log In</Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Signup;
