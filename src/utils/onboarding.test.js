import { STARTER_TEMPLATES, hasMeaningfulPortfolioContent } from "./onboarding";

describe("builder onboarding", () => {
  it("exposes normalized starter templates for new users", () => {
    expect(STARTER_TEMPLATES).toHaveLength(3);

    STARTER_TEMPLATES.forEach((template) => {
      expect(template.data.name).toBeTruthy();
      expect(template.data.title).toBeTruthy();
      expect(template.data.profilePic).toContain("data:image/svg+xml");
      expect(template.data.education.length).toBeGreaterThan(0);
      expect(template.data.work.length).toBeGreaterThan(0);
      expect(template.data.skills.length).toBeGreaterThan(0);
      expect(template.data.contact.github.startsWith("https://")).toBe(true);
      expect(template.data.contact.linkedin.startsWith("https://")).toBe(true);
    });
  });

  it("detects when a portfolio is still effectively blank", () => {
    expect(hasMeaningfulPortfolioContent({})).toBe(false);
    expect(
      hasMeaningfulPortfolioContent({
        about: "I build polished frontend experiences."
      })
    ).toBe(true);
    expect(
      hasMeaningfulPortfolioContent({
        skills: [{ name: "React" }]
      })
    ).toBe(true);
  });
});
