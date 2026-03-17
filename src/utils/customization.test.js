import {
  DEFAULT_PORTFOLIO_CUSTOMIZATION,
  DEFAULT_RESUME_CUSTOMIZATION,
  normalizeCustomization,
  normalizeHexColor,
  normalizePortfolioData,
  parseHexColor
} from "./customization";
import { getResumeStyles } from "./resumeStyles";

describe("customization normalization", () => {
  it("normalizes invalid customization to supported defaults", () => {
    expect(
      normalizeCustomization({
        portfolio: {
          layout: "broken",
          theme: "neon",
          accentColor: "zzzzzz"
        },
        resume: {
          layout: "poster",
          accentColor: "#12"
        }
      })
    ).toEqual({
      portfolio: DEFAULT_PORTFOLIO_CUSTOMIZATION,
      resume: DEFAULT_RESUME_CUSTOMIZATION
    });
  });

  it("normalizes hex colors consistently", () => {
    expect(parseHexColor("abc")).toBe("#aabbcc");
    expect(parseHexColor("#ABCDEF")).toBe("#abcdef");
    expect(normalizeHexColor("#12", "#123456")).toBe("#123456");
  });

  it("fills missing portfolio data with safe defaults", () => {
    expect(
      normalizePortfolioData({
        contact: { email: "test@example.com" },
        skills: [{ name: "React", percent: 90 }, "CSS"],
        customization: {
          portfolio: {
            theme: "royal",
            accentColor: "ff00aa"
          }
        }
      })
    ).toMatchObject({
      about: "",
      education: [],
      work: [],
      skills: [{ name: "React" }, { name: "CSS" }],
      contact: {
        phone: "",
        email: "test@example.com",
        github: "",
        linkedin: ""
      },
      customization: {
        portfolio: {
          layout: "modern",
          theme: "royal",
          accentColor: "#ff00aa"
        },
        resume: DEFAULT_RESUME_CUSTOMIZATION
      }
    });
  });
});

describe("resume layout styling", () => {
  it("returns different style treatments for executive and minimal layouts", () => {
    const executiveStyles = getResumeStyles("#0f172a", "executive");
    const minimalStyles = getResumeStyles("#0f172a", "minimal");

    expect(executiveStyles.page.borderTop).toBe("14px solid #0f172a");
    expect(executiveStyles.dateBadge.backgroundColor).toBe("#0f172a");
    expect(minimalStyles.entry.borderLeft).toBe("none");
    expect(minimalStyles.dateBadge.backgroundColor).toBe("transparent");
  });
});
