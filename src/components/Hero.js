import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import "./Hero/Hero.scss";

const Hero = ({ scrollToSection, refs, downloadResumeButton }) => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', layout: 'modern', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;

  const isDark = theme === 'dark' || theme === 'royal';

  return (
    <section
      className={`hero hero-section ${theme === 'dark' ? 'hero--dark' : theme === 'royal' ? 'hero--royal' : 'hero--light'
        }`}
      style={{ "--accent-color": accentColor }}
    >
      {/* Decorative background elements */}
      <div className="hero__backdrop">
        <div className={`hero__orb hero__orb--left ${isDark ? 'hero__orb--dark' : 'hero__orb--light'
          }`}></div>
        <div className={`hero__orb hero__orb--right ${isDark ? 'hero__orb--dark-alt' : 'hero__orb--light-alt'
          }`}></div>
      </div>

      <div className="hero__container">
        <div className="hero__grid">

          {/* Text Content - Now on Left */}
          <div className="hero__content">
            <div>
              <h2 className="hero__eyebrow">
                {portfolioData.title}
              </h2>
              <h1 className={`hero__title ${isDark ? 'hero__title--dark' : 'hero__title--light'
                }`}>
                Hi, I'm <span className={`hero__accent ${isDark ? 'hero__accent--dark' : 'hero__accent--light'}`}>{portfolioData.name?.split(' ')[0]}</span>
                <br />
                {portfolioData.name?.split(' ').slice(1).join(' ')}
              </h1>
            </div>

            <p className={`hero__description ${isDark ? 'hero__description--dark' : 'hero__description--light'
              }`}>
              {portfolioData.about}
            </p>

            <div className="hero__actions">
              <button
                onClick={() => scrollToSection(refs?.contact)}
                className="hero__button hero__button--primary"
              >
                Get in Touch
              </button>
              <button
                onClick={() => scrollToSection(refs?.work)}
                className={`hero__button hero__button--secondary ${isDark ? 'hero__button--secondary-dark' : 'hero__button--secondary-light'
                  }`}
              >
                View Work
              </button>
              {downloadResumeButton}
            </div>
          </div>

          {/* Image Content - Now on Right */}
          <div className="hero__media">
            <div className="hero__image-frame">
              {/* Abstract decorative blob behind image */}
              <div className="hero__image-blob"></div>

              {portfolioData.profilePic ? (
                <img
                  className="hero__image"
                  alt={portfolioData.name}
                  src={portfolioData.profilePic}
                />
              ) : (
                <div className="hero__image hero__image--placeholder">
                  <FaUserCircle className="hero__placeholder-icon" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div
        className="hero__scroll"
        onClick={() => scrollToSection(refs?.education)}
      >
        <FaChevronDown size={30} />
      </div>
    </section>
  );
};

export default Hero;
