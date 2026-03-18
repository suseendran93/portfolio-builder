import {
  DEFAULT_PORTFOLIO_CUSTOMIZATION,
  DEFAULT_RESUME_CUSTOMIZATION,
  normalizeCustomization,
  normalizeHexColor,
  normalizePortfolioData,
  parseHexColor
} from "./customization";
import {
  isValidExternalUrlInput,
  normalizeContactInfo,
  normalizeExternalUrl
} from "./contact";
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
        contact: {
          email: "test@example.com",
          github: "github.com/example",
          linkedin: "javascript:alert(1)"
        },
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
        github: "https://github.com/example",
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

  it("maps legacy resume layout ids to ats-friendly templates", () => {
    expect(
      normalizeCustomization({
        resume: {
          layout: "standard"
        }
      }).resume.layout
    ).toBe("ats-classic");

    expect(
      normalizeCustomization({
        resume: {
          layout: "executive"
        }
      }).resume.layout
    ).toBe("ats-structured");

    expect(
      normalizeCustomization({
        resume: {
          layout: "minimal"
        }
      }).resume.layout
    ).toBe("ats-compact");
  });
});

describe("contact normalization", () => {
  it("normalizes safe external urls and rejects unsafe schemes", () => {
    expect(normalizeExternalUrl("github.com/example")).toBe("https://github.com/example");
    expect(normalizeExternalUrl("javascript:alert(1)")).toBe("");
    expect(isValidExternalUrlInput("linkedin.com/in/example")).toBe(true);
    expect(isValidExternalUrlInput("ftp://example.com")).toBe(false);
    expect(
      normalizeContactInfo({
        github: "https://github.com/example",
        linkedin: " data:text/html,test "
      })
    ).toMatchObject({
      github: "https://github.com/example",
      linkedin: ""
    });
  });
});

describe("resume layout styling", () => {
  it("returns different style treatments for ats-structured and ats-compact layouts", () => {
    const structuredStyles = getResumeStyles("#0f172a", "ats-structured");
    const compactStyles = getResumeStyles("#0f172a", "ats-compact");

    expect(structuredStyles.page.borderTop).toBe("10px solid #0f172a");
    expect(structuredStyles.dateBadge.backgroundColor).toBe("#0f172a14");
    expect(compactStyles.entry.borderLeft).toBe("none");
    expect(compactStyles.dateBadge.backgroundColor).toBe("transparent");
  });
});
