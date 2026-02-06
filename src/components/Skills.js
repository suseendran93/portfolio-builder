import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { IoLogoJavascript, IoLogoCss3, IoLogoHtml5, IoLogoReact, IoLogoGithub, IoLogoNodejs } from "react-icons/io5";
import { FaBootstrap } from "react-icons/fa"
import { DiMongodb } from "react-icons/di";
import { VscVscode } from "react-icons/vsc";

const Skills = () => {
  const { portfolioData } = useContext(PortfolioContext);

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
    <div className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full lg:w-10/12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">My Skills</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
                {portfolioData.skills && portfolioData.skills.map((skill, index) => {
                  const icon = getIcon(skill.name);
                  return (
                    <div key={index} className="flex justify-center">
                      <div className="group flex flex-col items-center justify-center p-6 w-full rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-md hover:bg-white transition-all duration-300">
                        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                          {icon ? icon : <div className="text-xl font-bold text-slate-400">{skill.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                        <span className="font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
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
