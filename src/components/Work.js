import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaBuilding } from "react-icons/fa";

const Work = () => {
  const { portfolioData } = useContext(PortfolioContext);

  if (!portfolioData.work || portfolioData.work.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-8/12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Work Experience</h2>
              <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-8">
              {portfolioData.work && portfolioData.work.length > 0 ? (
                portfolioData.work.map((item, idx) => (
                  <div key={idx} className="relative pl-0">
                    {/* Timeline connector for larger screens could go here, keeping it simple for now */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <FaBuilding size={20} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {typeof item === 'string' ? `Experience ${idx + 1}` : (item.company || "Company Name")}
                            </h3>
                            {typeof item !== 'string' && (
                              <h4 className="text-indigo-600 font-medium">{item.role || "Role"}</h4>
                            )}
                          </div>
                        </div>
                        {typeof item !== 'string' && (
                          <div className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {item.date || "Date"}
                          </div>
                        )}
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        {typeof item === 'string' ? item : item.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-10">
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
