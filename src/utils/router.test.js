import {
  buildPublicPortfolioUrl,
  getPublicBasePath,
  getRouterBasename,
  getRuntimeBasePath
} from "./router";

describe("router utilities", () => {
  it("parses base paths from PUBLIC_URL", () => {
    expect(getPublicBasePath("https://example.com/portfolio-builder")).toBe("/portfolio-builder");
    expect(getPublicBasePath("/portfolio-builder/")).toBe("/portfolio-builder");
    expect(getPublicBasePath("")).toBe("/");
  });

  it("uses root path outside production", () => {
    expect(getRuntimeBasePath({ env: "development", publicUrl: "/portfolio-builder" })).toBe("/");
    expect(getRuntimeBasePath({ env: "test", publicUrl: "/portfolio-builder" })).toBe("/");
    expect(getRuntimeBasePath({ env: "production", publicUrl: "/portfolio-builder" })).toBe("/portfolio-builder");
  });

  it("uses no basename locally and a project basename in production", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalPublicUrl = process.env.PUBLIC_URL;

    process.env.NODE_ENV = "development";
    process.env.PUBLIC_URL = "/portfolio-builder";
    expect(getRouterBasename()).toBeUndefined();

    process.env.NODE_ENV = "production";
    process.env.PUBLIC_URL = "/portfolio-builder";
    expect(getRouterBasename()).toBe("/portfolio-builder");

    process.env.NODE_ENV = originalNodeEnv;
    process.env.PUBLIC_URL = originalPublicUrl;
  });

  it("builds local and production public portfolio URLs correctly", () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalPublicUrl = process.env.PUBLIC_URL;

    process.env.NODE_ENV = "development";
    process.env.PUBLIC_URL = "/portfolio-builder";
    expect(buildPublicPortfolioUrl("demo-slug", "http://localhost:3000")).toBe(
      "http://localhost:3000/p/demo-slug"
    );

    process.env.NODE_ENV = "production";
    process.env.PUBLIC_URL = "/portfolio-builder";
    expect(buildPublicPortfolioUrl("demo-slug", "https://suseendran93.github.io")).toBe(
      "https://suseendran93.github.io/portfolio-builder/p/demo-slug"
    );

    process.env.NODE_ENV = originalNodeEnv;
    process.env.PUBLIC_URL = originalPublicUrl;
  });
});
