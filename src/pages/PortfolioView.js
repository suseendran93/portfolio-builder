import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHeader from "../components/Navbar/Navbar";
import BackToTop from "../components/BackToTop/BackToTop";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Work from "../components/Work";
import Contact from "../components/Contact";
import Education from "../components/Education";
// import ThemeContext from "../context/ThemeContext";
import { PortfolioContext } from "../context/PortfolioContext";
import { Button } from "react-bootstrap";

const PortfolioView = () => {
    // const { theme } = useContext(ThemeContext);
    const { logout } = useContext(PortfolioContext);
    const navigate = useNavigate();

    // Ref lifting logic from original App/Navbar if needed.
    // The original Navbar had refs defined inside it or passed down?
    // Checking original Navbar.js... it defined refs inside itself but also accepted props?
    // Wait, NavbarHeader inside Navbar.js defined its own refs for scrolling but App.js just rendered NavbarHeader.
    // Actually, NavbarHeader rendered the sections (About, Skills etc) INSIDE itself in the original code?
    // Let's re-read Navbar.js.

    return (
        <>
            <div style={{
                position: 'fixed',
                top: '80px', // Below navbar
                right: '20px',
                zIndex: 2000,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '10px 20px',
                borderRadius: '30px',
                display: 'flex',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
                <Button size="sm" variant="light" onClick={() => navigate('/builder')}>Back to Builder</Button>
                <Button size="sm" variant="success" onClick={() => alert('Generate Portfolio feature coming soon!')}>Generate Portfolio</Button>
                <Button size="sm" variant="outline-light" onClick={() => { logout(); navigate('/'); }}>Logout</Button>
            </div>

            <NavbarHeader />
            <div id="home">
                <Hero />
            </div>
            <div id="about">
                <About />
            </div>
            <div id="education">
                <Education />
            </div>
            <div id="work">
                <Work />
            </div>
            <div id="skills">
                <Skills />
            </div>
            <div id="contact">
                <Contact />
            </div>
            <BackToTop />
        </>
    );
};

export default PortfolioView;
