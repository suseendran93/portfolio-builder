import React, { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import ThemeContext from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const NavbarHeader = ({ scrollToSection, refs }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { education, skills, work, contact } = refs || {};

  return (
    <>
      <Navbar collapseOnSelect expand="sm" fixed="top" className="custom-navbar" style={{ zIndex: 1030 }}>
        <div className="navbar-container">
          <Container className="navbar-left">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse
              id="responsive-navbar-nav"
              className="navbar-collapse-custom"
            >
              <Nav className="header-nav">
                <Nav.Link
                  href="#education"
                  eventKey="education"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollToSection && education) scrollToSection(education);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>Education</div>
                </Nav.Link>
                <Nav.Link
                  href="#skills"
                  eventKey="skills"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollToSection && skills) scrollToSection(skills);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>My Skills</div>
                </Nav.Link>

                <Nav.Link
                  href="#work"
                  eventKey="work"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollToSection && work) scrollToSection(work);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>Work</div>
                </Nav.Link>

                <Nav.Link
                  href="#contact"
                  eventKey="contact"
                  onClick={(e) => {
                    e.preventDefault();
                    if (scrollToSection && contact) scrollToSection(contact);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>Contact</div>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>

          <div className="navbar-right">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle dark mode"
            >
              {theme ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      </Navbar>
    </>
  );
};

export default NavbarHeader;
