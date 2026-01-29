import React, { useRef, useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import About from "../About";
import Skills from "../Skills";
import Work from "../Work";
import Contact from "../Contact";
import Education from "../Education";
import Hero from "../Hero";
import ThemeContext from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";


const NavbarHeader = () => {
  const about = useRef(null);
  const skills = useRef(null);
  const work = useRef(null);
  const contact = useRef(null);
  const education = useRef(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const scrollToSection = (elementRef) => {
    const navbarHeight = 56; // Bootstrap navbar default height
    const elementPosition = elementRef.current.offsetTop;
    const offsetPosition = elementPosition - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };
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
                  href="#about"
                  eventKey="about"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(about);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>About</div>
                </Nav.Link>
                <Nav.Link
                  href="#education"
                  eventKey="education"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(education);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>Education</div>
                </Nav.Link>
                <Nav.Link
                  href="#skills"
                  eventKey="skills"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(skills);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>My Skills</div>
                </Nav.Link>

                <Nav.Link
                  href="#work"
                  eventKey="work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(work);
                  }}
                >
                  <div style={{ padding: "0 2em" }}>Work</div>
                </Nav.Link>

                <Nav.Link
                  href="#contact"
                  eventKey="contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(contact);
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

      <div className="hero-wrapper" style={{ marginTop: "56px" }}>
        <Hero theme={theme} scrollToSection={scrollToSection} aboutRef={about} />
      </div>

      <div className="about" ref={about}>
        <About theme={theme} />
      </div>
      <div className="education" ref={education}>
        <Education theme={theme} />
      </div>
      <div className="skills" ref={skills}>
        <Skills theme={theme} />
      </div>
      <div className="work" ref={work}>
        <Work theme={theme} />
      </div>
      <div className="contact" ref={contact}>
        <Contact theme={theme} />
      </div>

      <footer className="portfolio-footer">
        <div className="text-center p-4">
          &copy; {new Date().getFullYear()} Copyright: Suseendran's Portfolio
        </div>
      </footer>
    </>
  );
};

export default NavbarHeader;
