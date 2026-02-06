import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaMobileAlt, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const Contact = () => {
  const { portfolioData } = useContext(PortfolioContext);

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
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Get In Touch</h2>
          <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-slate-600 max-w-xl mx-auto">
            Feel free to reach out for collaborations or just a friendly hello.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full lg:w-10/12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactItems.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-700 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors mb-4">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer" className="text-inherit hover:text-inherit w-full h-full flex items-center justify-center">
                        {item.icon}
                      </a>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className="text-slate-600 font-medium break-all text-center">
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
