import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaGraduationCap } from "react-icons/fa";

const Education = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  if (!portfolioData.education || portfolioData.education.length === 0) return null;

  return (
    <section className={`py-20 transition-colors duration-500 ${isDark ? 'bg-transparent' : 'bg-slate-50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-8/12">
            <div className="text-center mb-16">
              <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Education</h2>
              <div className="h-1 w-20 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
            </div>

            <div className="space-y-6">
              {portfolioData.education && portfolioData.education.length > 0 ? (
                portfolioData.education.map((item, idx) => (
                  <div key={idx} className={`p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg mt-1 ${isDark ? 'bg-white/10' : 'bg-indigo-50'}`} style={{ color: accentColor }}>
                        <FaGraduationCap size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <div>
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.school}</h3>
                            <h4 className="font-medium" style={{ color: accentColor }}>{item.degree}</h4>
                          </div>
                          <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full mt-2 md:mt-0 inline-block text-center w-fit">
                            {item.date}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-10">
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
