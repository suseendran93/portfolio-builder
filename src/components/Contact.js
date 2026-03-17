import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { FaMobileAlt, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";
import { DEFAULT_PORTFOLIO_CUSTOMIZATION, normalizeCustomization } from "../utils/customization";
import { normalizeContactInfo } from "../utils/contact";
import "./Contact/Contact.scss";

const Contact = () => {
  const { portfolioData } = useContext(PortfolioContext);
  const customization = normalizeCustomization(portfolioData.customization).portfolio || DEFAULT_PORTFOLIO_CUSTOMIZATION;
  const contact = normalizeContactInfo(portfolioData.contact);
  const { theme, accentColor } = customization;
  const isDark = theme === 'dark' || theme === 'royal';

  const contactItems = [
    {
      icon: <FaMobileAlt size={30} />,
      desc: contact.phone,
      href: null
    },
    {
      icon: <FaEnvelope size={30} />,
      desc: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null
    },
    {
      icon: <FaLinkedin size={30} />,
      desc: "LinkedIn",
      href: contact.linkedin
    },
    {
      icon: <FaGithub size={30} />,
      desc: "GitHub",
      href: contact.github
    }
  ].filter(item => item.desc && item.href !== ""); // Filter out empty items

  if (contactItems.length === 0) return null;

  return (
    <div className={`contact-section ${isDark ? 'contact-section--dark' : 'contact-section--light'}`} style={{ "--accent-color": accentColor }}>
      <div className="contact-section__container">
        <div className="contact-section__heading">
          <h2 className={`contact-section__title ${isDark ? 'contact-section__title--dark' : 'contact-section__title--light'}`}>Get In Touch</h2>
          <div className="contact-section__divider"></div>
          <p className={`contact-section__subtitle ${isDark ? 'contact-section__subtitle--dark' : 'contact-section__subtitle--light'}`}>
            Feel free to reach out for collaborations or just a friendly hello.
          </p>
        </div>

        <div className="contact-section__shell">
          <div className="contact-section__content">
            <div className="contact-section__grid">
              {contactItems.map((item, index) => (
                <div key={index} className={`contact-section__card ${isDark ? 'contact-section__card--dark' : 'contact-section__card--light'
                  }`}>
                  <div
                    className={`contact-section__icon ${isDark ? 'contact-section__icon--dark' : 'contact-section__icon--light'
                      }`}
                    style={{ color: item.href ? undefined : accentColor }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-section__link"
                        style={{ color: accentColor }}
                      >
                        {item.icon}
                      </a>
                    ) : (
                      item.icon
                    )}
                  </div>
                  <span className={`contact-section__label ${isDark ? 'contact-section__label--dark' : 'contact-section__label--light'}`}>
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
