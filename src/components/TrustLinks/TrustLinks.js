import React from "react";
import { Link } from "react-router-dom";
import "./TrustLinks.scss";

const TrustLinks = ({ className = "", tone = "default" }) => (
  <nav className={`trust-links trust-links--${tone} ${className}`.trim()} aria-label="Trust and support links">
    <Link to="/privacy" className="trust-links__link">
      Privacy
    </Link>
    <Link to="/help" className="trust-links__link">
      Help
    </Link>
  </nav>
);

export default TrustLinks;
