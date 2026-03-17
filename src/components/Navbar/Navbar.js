import React, { useState, useContext } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { PortfolioContext } from "../../context/PortfolioContext";
import "./Navbar.scss";

const NavbarHeader = ({ scrollToSection, refs }) => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  const { education, skills, work, contact } = refs || {};
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (ref) => {
    setIsOpen(false);
    if (scrollToSection && ref) scrollToSection(ref);
  };

  const navItems = [
    { name: "Education", ref: education },
    { name: "Work", ref: work },
    { name: "My Skills", ref: skills },
    { name: "Contact", ref: contact },
  ];

  return (
    <nav
      className={`portfolio-nav ${theme === 'dark' ? 'portfolio-nav--dark' : theme === 'royal' ? 'portfolio-nav--royal' : 'portfolio-nav--light'
        }`}
      style={{ "--accent-color": accentColor }}
    >
      <div className="portfolio-nav__container">
        {/* Brand/Logo (Optional, could add one later) */}
        <div className="portfolio-nav__brand">
          {/* Portfolio */}
        </div>

        {/* Desktop Menu */}
        <div className="portfolio-nav__menu">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.ref)}
              className={`portfolio-nav__item ${isDark ? 'portfolio-nav__item--dark' : 'portfolio-nav__item--light'}`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="portfolio-nav__toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="portfolio-nav__mobile">
          <div className="portfolio-nav__mobile-list">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.ref)}
                className="portfolio-nav__mobile-item"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarHeader;
