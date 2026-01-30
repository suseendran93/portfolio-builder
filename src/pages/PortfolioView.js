import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarHeader from "../components/Navbar/Navbar";
import BackToTop from "../components/BackToTop/BackToTop";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Work from "../components/Work";
import Contact from "../components/Contact";
import Education from "../components/Education";
import ThemeContext from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "react-bootstrap";

const PortfolioView = ({ publicMode = false }) => {
    const { logout } = useAuth();
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const education = useRef(null);
    const skills = useRef(null);
    const work = useRef(null);
    const contact = useRef(null);

    const scrollToSection = (elementRef) => {
        const navbarHeight = 56; // Bootstrap navbar default height
        if (elementRef && elementRef.current) {
            const elementPosition = elementRef.current.offsetTop;
            const offsetPosition = elementPosition - navbarHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    };

    return (
        <>
            {!publicMode && (
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
                    <Button size="sm" variant="outline-light" onClick={async () => {
                        console.log("Preview Logout Clicked");
                        try {
                            await logout();
                            console.log("Firebase Logout Successful");
                            navigate('/');
                        } catch (error) {
                            console.error("Logout Error:", error);
                            alert("Failed to log out: " + error.message);
                        }
                    }}>Logout</Button>
                </div>
            )}

            <NavbarHeader
                scrollToSection={scrollToSection}
                refs={{ education, skills, work, contact }}
            />

            <div id="home">
                <Hero theme={theme} scrollToSection={scrollToSection} aboutRef={education} />
            </div>
            {/* About section removed */}
            <div id="education" ref={education}>
                <Education theme={theme} />
            </div>
            <div id="work" ref={work}>
                <Work theme={theme} />
            </div>
            <div id="skills" ref={skills}>
                <Skills theme={theme} />
            </div>
            <div id="contact" ref={contact}>
                <Contact theme={theme} />
            </div>

            <footer className="portfolio-footer">
                <div className="text-center p-4">
                    &copy; {new Date().getFullYear()} Copyright: Suseendran's Portfolio
                </div>
            </footer>

            <BackToTop />
        </>
    );
};

export default PortfolioView;
