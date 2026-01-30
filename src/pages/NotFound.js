import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh", textAlign: "center" }}>
            <h1 className="display-1 fw-bold">404</h1>
            <p className="lead">Page Not Found</p>
            <p className="mb-4">The link you followed may be broken, or the page may have been removed.</p>
            <Button variant="primary" onClick={() => navigate('/')}>
                Go to Home
            </Button>
        </Container>
    );
};

export default NotFound;
