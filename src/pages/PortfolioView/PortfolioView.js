import React, { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioContext } from "../../context/PortfolioContext";
import NavbarHeader from "../../components/Navbar/Navbar";
import BackToTop from "../../components/BackToTop/BackToTop";
import Hero from "../../components/Hero";
import Skills from "../../components/Skills";
import Work from "../../components/Work";
import Contact from "../../components/Contact";
import Education from "../../components/Education";
import ResumeDownload from "../../components/ResumeDownload/ResumeDownload";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { DEFAULT_PORTFOLIO_CUSTOMIZATION, normalizeCustomization } from '../../utils/customization';
import './PortfolioView.scss';

const PortfolioView = ({ publicMode = false }) => {
    const { userData, logout } = useAuth();
    const { portfolioData } = useContext(PortfolioContext);
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

    const customization = normalizeCustomization(portfolioData.customization).portfolio || DEFAULT_PORTFOLIO_CUSTOMIZATION;
    const { layout, theme } = customization;

    const getThemeClasses = () => {
        switch (theme) {
            case 'dark': return 'bg-slate-900 text-slate-100';
            case 'royal': return 'bg-indigo-900 text-white';
            default: return 'bg-slate-50 text-slate-900';
        }
    };

    return (
        <div className={`portfolio-view portfolio-view--layout-${layout} ${getThemeClasses()}`}>
            {!publicMode && (
                <div className="portfolio-view__toolbar">
                    <button
                        onClick={() => navigate('/builder')}
                        className="portfolio-view__toolbar-button portfolio-view__toolbar-button--secondary"
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
                        className="portfolio-view__toolbar-button portfolio-view__toolbar-button--danger"
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
                    downloadResumeButton={
                        <ResumeDownload
                            variant="secondary"
                            showWatermark={!publicMode && userData?.tier === 'BASIC'}
                        />
                    }
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

            <footer className="portfolio-view__footer">
                <div>
                    &copy; {new Date().getFullYear()} Copyright: {portfolioData?.name || "BuildFolio"}
                </div>
            </footer>

            <BackToTop />
        </div>
    );
};

export default PortfolioView;
