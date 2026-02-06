import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaGraduationCap } from "react-icons/fa";

const Education = () => {
  const { portfolioData } = useContext(PortfolioContext);

  if (!portfolioData.education || portfolioData.education.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-8/12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Education</h2>
              <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-6">
              {portfolioData.education && portfolioData.education.length > 0 ? (
                portfolioData.education.map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg mt-1">
                        <FaGraduationCap size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{item.school}</h3>
                            <h4 className="text-indigo-600 font-medium">{item.degree}</h4>
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
