import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";

const Hero = ({ scrollToSection, refs, downloadResumeButton }) => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', layout: 'modern', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;

  const isDark = theme === 'dark' || theme === 'royal';

  return (
    <section
      className={`hero-section relative flex flex-col min-h-screen overflow-hidden pt-32 pb-20 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-900' : theme === 'royal' ? 'bg-indigo-950' : 'bg-slate-50'
        }`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
        <div className={`absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full blur-3xl ${isDark ? 'bg-indigo-900/40' : 'bg-gradient-to-r from-indigo-100 to-purple-100'
          }`}></div>
        <div className={`absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full blur-3xl ${isDark ? 'bg-purple-900/20' : 'bg-gradient-to-l from-blue-100 to-indigo-50'
          }`}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center">
        <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          {/* Text Content - Now on Left */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <div>
              <h2 className={`text-2xl md:text-3xl font-medium mb-2`} style={{ color: accentColor }}>
                {portfolioData.title}
              </h2>
              <h1 className={`text-5xl md:text-7xl font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'
                }`}>
                Hi, I'm <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, ${isDark ? '#a5b4fc' : '#7c3aed'})` }}>{portfolioData.name?.split(' ')[0]}</span>
                <br />
                {portfolioData.name?.split(' ').slice(1).join(' ')}
              </h1>
            </div>

            <p className={`text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 ${isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
              {portfolioData.about}
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
              <button
                onClick={() => scrollToSection(refs?.contact)}
                style={{ backgroundColor: accentColor }}
                className="px-8 py-3 text-white rounded-full font-medium hover:opacity-90 transition-all shadow-lg"
              >
                Get in Touch
              </button>
              <button
                onClick={() => scrollToSection(refs?.work)}
                className={`px-8 py-3 bg-transparent border rounded-full font-medium transition-colors ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
              >
                View Work
              </button>
              {downloadResumeButton}
            </div>
          </div>

          {/* Image Content - Now on Right */}
          <div className="w-full md:w-5/12 text-center relative">
            <div className="relative inline-block">
              {/* Abstract decorative blob behind image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-violet-200 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-2xl opacity-50 transform scale-110 animate-pulse"></div>

              {portfolioData.profilePic ? (
                <img
                  className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-cover rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white"
                  alt={portfolioData.name}
                  src={portfolioData.profilePic}
                />
              ) : (
                <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white rounded-[2rem] shadow-2xl rotate-3 border-4 border-white text-slate-200">
                  <FaUserCircle className="w-32 h-32" />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer animate-bounce text-slate-400 hover:text-indigo-600 transition-colors"
        onClick={() => scrollToSection(refs?.education)}
      >
        <FaChevronDown size={30} />
      </div>
    </section>
  );
};

export default Hero;
