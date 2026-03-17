import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaMobileAlt, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const Contact = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = portfolioData.customization?.portfolio || { theme: 'light', accentColor: '#4f46e5' };
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  const contactItems = [
    {
      icon: <FaMobileAlt size={30} />,
      desc: portfolioData.contact.phone,
      href: null
    },
    {
      icon: <FaEnvelope size={30} />,
      desc: portfolioData.contact.email,
      href: portfolioData.contact.email ? `mailto:${portfolioData.contact.email}` : null
    },
    {
      icon: <FaLinkedin size={30} />,
      desc: "LinkedIn",
      href: portfolioData.contact.linkedin
    },
    {
      icon: <FaGithub size={30} />,
      desc: "GitHub",
      href: portfolioData.contact.github
    }
  ].filter(item => item.desc && item.href !== ""); // Filter out empty items

  if (contactItems.length === 0) return null;

  return (
    <div className={`py-20 transition-colors duration-500 ${isDark ? 'bg-transparent' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Get In Touch</h2>
          <div className="h-1 w-20 mx-auto rounded-full" style={{ backgroundColor: accentColor }}></div>
          <p className={`mt-4 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Feel free to reach out for collaborations or just a friendly hello.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full lg:w-10/12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactItems.map((item, index) => (
                <div key={index} className={`flex flex-col items-center p-6 border rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${isDark ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-100 hover:border-indigo-100'
                  }`}>
                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full shadow-sm transition-colors mb-4 ${isDark ? 'bg-slate-700 text-slate-300 group-hover:bg-slate-600' : 'bg-white text-slate-700 group-hover:bg-indigo-50'
                      }`}
                    style={{ color: item.href ? undefined : accentColor }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-inherit hover:text-inherit w-full h-full flex items-center justify-center transition-colors"
                        style={{ color: accentColor }}
                      >
                        {item.icon}
                      </a>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className={`font-medium break-all text-center ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
