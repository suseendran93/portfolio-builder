import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import App from "./App";

const mockUseAuth = jest.fn();

jest.mock("../context/AuthContext", () => ({
  useAuth: () => mockUseAuth()
}));

jest.mock("../context/PortfolioContext", () => ({
  PortfolioProvider: ({ children }) => <>{children}</>
}));

jest.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />
}));

jest.mock("../components/Login/Login", () => () => <div>Login Screen</div>);
jest.mock("../components/Signup/Signup", () => () => <div>Signup Screen</div>);
jest.mock("../components/Builder/Builder", () => () => <div>Builder Screen</div>);
jest.mock("../pages/PortfolioView/PortfolioView", () => () => <div>Portfolio Preview</div>);
jest.mock("../pages/PublicPortfolioView/PublicPortfolioView", () => () => <div>Public Portfolio</div>);
jest.mock("../pages/Success/Success", () => () => <div>Payment Success</div>);
jest.mock("../pages/Cancel/Cancel", () => () => <div>Payment Cancelled</div>);
jest.mock("../pages/NotFound/NotFound", () => () => <div>Not Found</div>);

const renderAppAtRoute = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  );

describe("App routing", () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    mockUseAuth.mockReset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("renders the login route for unauthenticated users", () => {
    mockUseAuth.mockReturnValue({ currentUser: null });

    renderAppAtRoute("/");

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
  });

  it("redirects unauthenticated users away from private routes", () => {
    mockUseAuth.mockReturnValue({ currentUser: null });

    renderAppAtRoute("/builder");

    expect(screen.getByText("Login Screen")).toBeInTheDocument();
    expect(screen.queryByText("Builder Screen")).not.toBeInTheDocument();
  });

  it("renders the builder for authenticated users", () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: "user-1" } });

    renderAppAtRoute("/builder");

    expect(screen.getByText("Builder Screen")).toBeInTheDocument();
  });

  it("renders the public portfolio route", () => {
    mockUseAuth.mockReturnValue({ currentUser: null });

    renderAppAtRoute("/p/test-slug");

    expect(screen.getByText("Public Portfolio")).toBeInTheDocument();
  });

  it("renders not found for unknown routes", () => {
    mockUseAuth.mockReturnValue({ currentUser: null });

    renderAppAtRoute("/missing-route");

    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
