import React, { useContext } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { Container, Row, Col, Image } from "react-bootstrap";
import pic from "../assets/profile-image.jpg";
import { FaChevronDown } from "react-icons/fa";

const Hero = ({ theme, scrollToSection, aboutRef }) => {
  const { portfolioData } = useContext(PortfolioContext);
  return (
    <section
      className={`hero-section ${theme ? "hero-section-dark" : "hero-section-light"}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col xs={12} md={6} lg={4} className="text-center mb-4 mb-md-0">
            <Image
              className="my-2"
              roundedCircle
              alt="profile-img"
              width={300}
              height={300}
              src={portfolioData.profilePic || pic}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
          </Col>
          <Col xs={12} md={6} lg={8} className="text-center text-md-start">
            <h1
              className="display-3 fw-bold mb-3"
              style={{
                fontSize: "clamp(2rem, 5vw, 4rem)",
              }}
            >
              {portfolioData.name}
            </h1>
            <h2
              className="display-6 mb-4 hero-subtitle"
              style={{
                fontSize: "clamp(1.25rem, 3vw, 2rem)",
              }}
            >
              {portfolioData.title}
            </h2>
            <p
              className="lead mb-4 hero-bio"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                maxWidth: "600px",
              }}
            >
              {portfolioData.about}
            </p>
          </Col>
        </Row>
      </Container>
      <div
        className="scroll-indicator"
        onClick={() => scrollToSection(aboutRef)}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          animation: "bounce 2s infinite",
        }}
      >
        <FaChevronDown
          size={30}
          className="scroll-chevron"
        />
      </div>
    </section>
  );
};

export default Hero;
