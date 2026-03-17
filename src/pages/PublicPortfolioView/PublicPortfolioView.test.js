import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import PublicPortfolioView from "./PublicPortfolioView";
import { loadPublicPortfolioBySlug } from "../../utils/portfolioStorage";

jest.mock("../../context/PortfolioContext", () => {
  const React = require("react");
  return {
    PortfolioContext: React.createContext({
      portfolioData: null,
      updatePortfolioData: () => {}
    })
  };
});

jest.mock("../../utils/portfolioStorage", () => ({
  loadPublicPortfolioBySlug: jest.fn()
}));

jest.mock("../PortfolioView/PortfolioView", () => ({ publicMode }) => (
  <div>
    Portfolio View
    <span>{publicMode ? "Public Mode" : "Private Mode"}</span>
  </div>
));

const renderPublicPortfolioView = (route = "/p/demo-slug") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/p/:slug" element={<PublicPortfolioView />} />
      </Routes>
    </MemoryRouter>
  );

describe("PublicPortfolioView", () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    loadPublicPortfolioBySlug.mockReset();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("loads and renders a published portfolio by slug", async () => {
    loadPublicPortfolioBySlug.mockResolvedValue({
      name: "Test User",
      title: "Engineer"
    });

    renderPublicPortfolioView();

    await waitFor(() => {
      expect(loadPublicPortfolioBySlug).toHaveBeenCalledWith("demo-slug");
    });

    expect(await screen.findByText("Portfolio View")).toBeInTheDocument();
    expect(await screen.findByText("Public Mode")).toBeInTheDocument();
  });

  it("shows a not found state when no published portfolio exists", async () => {
    loadPublicPortfolioBySlug.mockResolvedValue(null);

    renderPublicPortfolioView();

    expect(await screen.findByText("Portfolio not found.")).toBeInTheDocument();
  });

  it("shows a load failure state when the fetch throws", async () => {
    loadPublicPortfolioBySlug.mockRejectedValue(new Error("boom"));

    renderPublicPortfolioView();

    expect(await screen.findByText("Failed to load portfolio.")).toBeInTheDocument();
  });
});
