import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaGlobe, FaMagic, FaQuestionCircle, FaFileAlt } from "react-icons/fa";
import TrustLinks from "../../components/TrustLinks/TrustLinks";
import "../Privacy/Privacy.scss";
import "./Help.scss";

const faqItems = [
  {
    title: "How does publishing work?",
    body: "You build your portfolio privately inside the builder. Once you publish, BuildFolio creates a public share link that can be opened by recruiters and anyone you send it to."
  },
  {
    title: "Can I keep editing after publishing?",
    body: "Yes. You can continue refining your content and styling, then save and republish updates as your portfolio evolves."
  },
  {
    title: "What should I prepare first?",
    body: "Start with your headline, a short about section, one education entry, one experience or project entry, a few core skills, and accurate contact links."
  }
];

const quickSteps = [
  {
    icon: <FaMagic />,
    title: "Start with a role-ready template",
    text: "Use a starter if you want a faster path to preview and a cleaner first draft."
  },
  {
    icon: <FaFileAlt />,
    title: "Export your resume",
    text: "Download the PDF once your portfolio content looks application-ready."
  },
  {
    icon: <FaGlobe />,
    title: "Share your public link",
    text: "Publish only when the profile feels complete enough to send to recruiters."
  }
];

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="trust-page">
      <div className="trust-page__shell">
        <button type="button" onClick={() => navigate(-1)} className="trust-page__back">
          <FaArrowLeft /> Back
        </button>

        <div className="trust-page__hero">
          <span className="trust-page__badge">Help</span>
          <h1 className="trust-page__title">Build a recruiter-ready profile without guessing your next step.</h1>
          <p className="trust-page__subtitle">
            This quick guide explains how to move from draft to preview to shareable public portfolio.
          </p>
        </div>

        <div className="trust-page__grid">
          {quickSteps.map((item) => (
            <section key={item.title} className="trust-page__card">
              <div className="trust-page__icon">{item.icon}</div>
              <h2 className="trust-page__card-title">{item.title}</h2>
              <p className="trust-page__card-text">{item.text}</p>
            </section>
          ))}
        </div>

        <section className="trust-page__panel">
          <div className="help-page__faq-header">
            <div className="trust-page__icon help-page__faq-icon">
              <FaQuestionCircle />
            </div>
            <div>
              <h2 className="trust-page__panel-title">Frequently asked questions</h2>
              <p className="help-page__faq-copy">Keep this page lightweight for now, then replace it with full support docs and a real contact channel before launch.</p>
            </div>
          </div>

          <div className="help-page__faq-list">
            {faqItems.map((item) => (
              <article key={item.title} className="help-page__faq-item">
                <h3 className="help-page__faq-title">{item.title}</h3>
                <p className="help-page__faq-text">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="trust-page__footer">
          <TrustLinks />
        </div>
      </div>
    </div>
  );
};

export default Help;
