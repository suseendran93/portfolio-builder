import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaLock, FaUserShield } from "react-icons/fa";
import TrustLinks from "../../components/TrustLinks/TrustLinks";
import "./Privacy.scss";

const privacySections = [
  {
    icon: <FaLock />,
    title: "What stays private",
    text: "Your builder draft, customization, resume content, and contact details stay tied to your account until you explicitly publish a public portfolio."
  },
  {
    icon: <FaEye />,
    title: "What becomes public",
    text: "Only the portfolio content attached to your published share link becomes publicly visible. Anyone with that link can open the published portfolio."
  },
  {
    icon: <FaUserShield />,
    title: "What we store",
    text: "BuildFolio currently stores your account email, portfolio content, customization choices, publishing metadata, and uploaded profile image needed to render your portfolio and resume."
  }
];

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="trust-page">
      <div className="trust-page__shell">
        <button type="button" onClick={() => navigate(-1)} className="trust-page__back">
          <FaArrowLeft /> Back
        </button>

        <div className="trust-page__hero">
          <span className="trust-page__badge">Privacy</span>
          <h1 className="trust-page__title">Your portfolio stays private until you choose to publish it.</h1>
          <p className="trust-page__subtitle">
            BuildFolio is designed so you can draft, revise, and export your materials before you make anything public.
          </p>
        </div>

        <div className="trust-page__grid">
          {privacySections.map((section) => (
            <section key={section.title} className="trust-page__card">
              <div className="trust-page__icon">{section.icon}</div>
              <h2 className="trust-page__card-title">{section.title}</h2>
              <p className="trust-page__card-text">{section.text}</p>
            </section>
          ))}
        </div>

        <section className="trust-page__panel">
          <h2 className="trust-page__panel-title">Good to know</h2>
          <ul className="trust-page__list">
            <li>Public portfolios are shared through the specific link generated when you publish.</li>
            <li>You can keep editing your private draft before publishing or republishing.</li>
            <li>Support and legal copy should be reviewed again before full public launch.</li>
          </ul>
        </section>

        <div className="trust-page__footer">
          <TrustLinks />
        </div>
      </div>
    </div>
  );
};

export default Privacy;
