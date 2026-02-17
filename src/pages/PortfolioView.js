import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from "../context/PortfolioContext";
import NavbarHeader from "../components/Navbar/Navbar";
import BackToTop from "../components/BackToTop/BackToTop";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Work from "../components/Work";
import Contact from "../components/Contact";
import Education from "../components/Education";
import ResumeDownload from "../components/ResumeDownload/ResumeDownload";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';

const PortfolioView = ({ publicMode = false }) => {
    const { portfolioData } = useContext(PortfolioContext);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const education = useRef(null);
    const skills = useRef(null);
    const work = useRef(null);
    const contact = useRef(null);

    const scrollToSection = (elementRef) => {
        const navbarHeight = 80;
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
        <div className="bg-slate-50 min-h-screen text-slate-900 font-inter">
            {!publicMode && (
                <div className="fixed top-24 right-5 z-50 bg-white/90 backdrop-blur-md p-3 rounded-full flex gap-2 shadow-lg border border-slate-200">
                    <button
                        onClick={() => navigate('/builder')}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-sm font-medium transition-colors"
                    >
                        <FaArrowLeft /> Back to Builder
                    </button>
                    <button
                        onClick={async () => {
                            try {
                                await logout();
                                navigate('/');
                            } catch (error) {
                                console.error("Logout Error:", error);
                                alert("Failed to log out: " + error.message);
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-full text-sm font-medium transition-colors"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}

            <NavbarHeader
                scrollToSection={scrollToSection}
                refs={{ education, skills, work, contact }}
            />

            <div id="home">
                <Hero
                    scrollToSection={scrollToSection}
                    refs={{ education, skills, work, contact }}
                    downloadResumeButton={<ResumeDownload variant="secondary" showWatermark={!publicMode} />}
                />
            </div>
            {/* About section removed */}
            <div id="education" ref={education}>
                <Education />
            </div>
            <div id="work" ref={work}>
                <Work />
            </div>
            <div id="skills" ref={skills}>
                <Skills />
            </div>
            <div id="contact" ref={contact}>
                <Contact />
            </div>

            <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
                <div>
                    &copy; {new Date().getFullYear()} Copyright: {portfolioData?.name || "BuildFolio"}
                </div>
            </footer>

            <BackToTop />
        </div>
    );
};

export default PortfolioView;
