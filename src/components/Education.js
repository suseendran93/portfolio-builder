import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaGraduationCap } from "react-icons/fa";
import { DEFAULT_PORTFOLIO_CUSTOMIZATION, normalizeCustomization } from "../utils/customization";
import "./Education/Education.scss";

const Education = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = normalizeCustomization(portfolioData.customization).portfolio || DEFAULT_PORTFOLIO_CUSTOMIZATION;
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  if (!portfolioData.education || portfolioData.education.length === 0) return null;

  return (
    <section className={`education-section ${isDark ? 'education-section--dark' : 'education-section--light'}`} style={{ "--accent-color": accentColor }}>
      <div className="education-section__container">
        <div className="education-section__shell">
          <div className="education-section__content">
            <div className="education-section__heading">
              <h2 className={`education-section__title ${isDark ? 'education-section__title--dark' : 'education-section__title--light'}`}>Education</h2>
              <div className="education-section__divider"></div>
            </div>

            <div className="education-section__list">
              {portfolioData.education && portfolioData.education.length > 0 ? (
                portfolioData.education.map((item, idx) => (
                  <div key={idx} className={`education-section__card ${isDark ? 'education-section__card--dark' : 'education-section__card--light'
                    }`}>
                    <div className="education-section__card-layout">
                      <div className={`education-section__icon ${isDark ? 'education-section__icon--dark' : 'education-section__icon--light'}`}>
                        <FaGraduationCap size={24} />
                      </div>
                      <div className="education-section__details">
                        <div className="education-section__meta">
                          <div>
                            <h3 className={`education-section__school ${isDark ? 'education-section__school--dark' : 'education-section__school--light'}`}>{item.school}</h3>
                            <h4 className="education-section__degree">{item.degree}</h4>
                          </div>
                          <span className="education-section__date">
                            {item.date}
                          </span>
                        </div>
                        <p className="education-section__description">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="education-section__empty">
                  <p>No education details added.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
