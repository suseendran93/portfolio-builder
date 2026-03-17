import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { PortfolioContext } from "../../context/PortfolioContext";
import PortfolioView from "./PortfolioView";

const mockUseAuth = jest.fn();

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => mockUseAuth()
}));

jest.mock("../../context/PortfolioContext", () => {
  const React = require("react");
  return {
    PortfolioContext: React.createContext({
      portfolioData: {},
      updatePortfolioData: () => {}
    })
  };
});

jest.mock("../../components/ResumeDownload/ResumeDownload", () => () => (
  <button type="button">Download Resume</button>
));

const portfolioData = {
  name: "Test User",
  title: "Frontend Engineer",
  about: "I build polished portfolio experiences.",
  profilePic: null,
  education: [
    {
      school: "Test University",
      degree: "B.Sc. Computer Science",
      date: "2024",
      description: "Studied software engineering."
    }
  ],
  work: [
    {
      company: "BuildFolio",
      role: "Engineer",
      date: "2025",
      responsibilities: "Built portfolio flows.",
      accomplishments: "Shipped production features."
    }
  ],
  skills: [
    { name: "React" },
    { name: "CSS" }
  ],
  contact: {
    phone: "+1 555 0100",
    email: "test@example.com",
    github: "https://github.com/test",
    linkedin: "https://linkedin.com/in/test"
  },
  customization: {
    portfolio: {
      layout: "creative",
      theme: "light",
      accentColor: "#4f46e5"
    },
    resume: {
      layout: "minimal",
      accentColor: "#1e293b"
    }
  }
};

const renderPortfolioView = () =>
  render(
    <MemoryRouter>
      <PortfolioContext.Provider
        value={{
          portfolioData,
          updatePortfolioData: () => {}
        }}
      >
        <PortfolioView />
      </PortfolioContext.Provider>
    </MemoryRouter>
  );

describe("PortfolioView integration", () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      userData: { tier: "PREMIUM" },
      logout: jest.fn()
    });
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("renders the composed portfolio sections", () => {
    const { container } = renderPortfolioView();

    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Hi, I'm/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Education" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Work Experience" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "My Skills" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Get In Touch" })
    ).toBeInTheDocument();
    expect(screen.getByText("Download Resume")).toBeInTheDocument();
    expect(screen.getByText(/Copyright: Test User/i)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("portfolio-view--layout-creative");
  });
});
