import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaBuilding } from "react-icons/fa";
import "./Work/Work.scss";

const Work = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  if (!portfolioData.work || portfolioData.work.length === 0) return null;

  return (
    <section className={`work-section ${isDark ? 'work-section--dark' : 'work-section--light'}`} style={{ "--accent-color": accentColor }}>
      <div className="work-section__container">
        <div className="work-section__shell">
          <div className="work-section__content">
            <div className="work-section__heading">
              <h2 className={`work-section__title ${isDark ? 'work-section__title--dark' : 'work-section__title--light'}`}>Work Experience</h2>
              <div className="work-section__divider"></div>
            </div>

            <div className="work-section__list">
              {portfolioData.work && portfolioData.work.length > 0 ? (
                portfolioData.work.map((item, idx) => (
                  <div key={idx} className="work-section__item">
                    {/* Timeline connector for larger screens could go here, keeping it simple for now */}
                    <div className={`work-section__card ${isDark ? 'work-section__card--dark' : 'work-section__card--light'
                      }`}>
                      <div className="work-section__meta">
                        <div className="work-section__identity">
                          <div className={`work-section__icon ${isDark ? 'work-section__icon--dark' : 'work-section__icon--light'}`}>
                            <FaBuilding size={20} />
                          </div>
                          <div>
                            <h3 className={`work-section__company ${isDark ? 'work-section__company--dark' : 'work-section__company--light'}`}>
                              {typeof item === 'string' ? `Experience ${idx + 1}` : (item.company || "Company Name")}
                            </h3>
                            {typeof item !== 'string' && (
                              <h4 className="work-section__role">{item.role || "Role"}</h4>
                            )}
                          </div>
                        </div>
                        {typeof item !== 'string' && (
                          <div className={`work-section__date ${isDark ? 'work-section__date--dark' : 'work-section__date--light'}`}>
                            {item.date || "Date"}
                          </div>
                        )}
                      </div>

                      {typeof item !== 'string' && item.responsibilities && (
                        <div className="work-section__detail">
                          <h5 className={`work-section__detail-title ${isDark ? 'work-section__detail-title--dark' : 'work-section__detail-title--light'}`}>Roles & Responsibilities</h5>
                          <p className={`work-section__detail-text ${isDark ? 'work-section__detail-text--dark' : 'work-section__detail-text--light'}`}>{item.responsibilities}</p>
                        </div>
                      )}
                      {typeof item !== 'string' && item.accomplishments && (
                        <div className="work-section__detail">
                          <h5 className={`work-section__detail-title ${isDark ? 'work-section__detail-title--dark' : 'work-section__detail-title--light'}`}>Work Accomplishments</h5>
                          <p className={`work-section__detail-text ${isDark ? 'work-section__detail-text--dark' : 'work-section__detail-text--light'}`}>{item.accomplishments}</p>
                        </div>
                      )}
                      {/* Legacy fallback for old data with description */}
                      {typeof item !== 'string' && !item.responsibilities && !item.accomplishments && item.description && (
                        <p className="work-section__fallback">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="work-section__empty">
                  <p>No work experience added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
