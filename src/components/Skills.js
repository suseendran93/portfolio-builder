import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { IoLogoJavascript, IoLogoCss3, IoLogoHtml5, IoLogoReact, IoLogoGithub, IoLogoNodejs } from "react-icons/io5";
import { FaBootstrap } from "react-icons/fa"
import { DiMongodb } from "react-icons/di";
import { VscVscode } from "react-icons/vsc";
import "./Skills/Skills.scss";

const Skills = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', accentColor: '#4f46e5' };
  const { theme } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  if (!portfolioData.skills || portfolioData.skills.length === 0) return null;

  // Helper to map skill name to icon
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("java") && !n.includes("script")) return null; // Simple heuristic
    if (n.includes("javascript")) return <IoLogoJavascript size={40} className="text-yellow-400" />;
    if (n.includes("css")) return <IoLogoCss3 size={40} className="text-blue-500" />;
    if (n.includes("html")) return <IoLogoHtml5 size={40} className="text-orange-500" />;
    if (n.includes("react")) return <IoLogoReact size={40} className="text-cyan-400" />;
    if (n.includes("github")) return <IoLogoGithub size={40} className="text-slate-800" />;
    if (n.includes("node")) return <IoLogoNodejs size={40} className="text-green-500" />;
    if (n.includes("bootstrap")) return <FaBootstrap size={40} className="text-purple-600" />;
    if (n.includes("mongo")) return <DiMongodb size={40} className="text-green-600" />;
    if (n.includes("vscode")) return <VscVscode size={40} className="text-blue-400" />;
    return null; // Fallback handled in render
  };

  return (
    <div className={`skills-section ${isDark ? 'skills-section--dark' : 'skills-section--light'}`} style={{ "--accent-color": customization.accentColor }}>
      <div className="skills-section__container">
        <div className="skills-section__shell">
          <div className="skills-section__content">
            <div className={`skills-section__panel ${isDark ? 'skills-section__panel--dark' : 'skills-section__panel--light'
              }`}>
              <h2 className={`skills-section__title ${isDark ? 'skills-section__title--dark' : 'skills-section__title--light'}`}>My Skills</h2>

              <div className="skills-section__grid">
                {portfolioData.skills && portfolioData.skills.map((skill, index) => {
                  const icon = getIcon(skill.name);
                  return (
                    <div key={index} className="skills-section__cell">
                      <div className={`skills-section__card ${isDark
                        ? 'skills-section__card--dark'
                        : 'skills-section__card--light'
                        }`}>
                        <div className="skills-section__icon">
                          {icon ? icon : <div className={`skills-section__initials ${isDark ? 'skills-section__initials--dark' : 'skills-section__initials--light'}`}>{skill.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                        <span className={`skills-section__label ${isDark ? 'skills-section__label--dark' : 'skills-section__label--light'}`}>
                          {skill.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
