import { normalizeContactInfo } from "./contact";

export const PORTFOLIO_LAYOUT_OPTIONS = [
  { id: "modern", name: "Modern", description: "Clean and professional with a balanced split" },
  { id: "classic", name: "Classic", description: "Traditional editorial layout with restrained details" },
  { id: "creative", name: "Creative", description: "Expressive composition with bolder spacing and rhythm" }
];

export const PORTFOLIO_THEME_OPTIONS = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "royal", name: "Royal" }
];

export const RESUME_LAYOUT_OPTIONS = [
  { id: "standard", name: "Standard", description: "Best for ATS compatibility" },
  { id: "executive", name: "Executive", description: "Sharper hierarchy for senior profiles" },
  { id: "minimal", name: "Minimal", description: "Lightweight structure with subdued decoration" }
];

export const DEFAULT_PORTFOLIO_CUSTOMIZATION = Object.freeze({
  layout: "modern",
  theme: "light",
  accentColor: "#4f46e5"
});

export const DEFAULT_RESUME_CUSTOMIZATION = Object.freeze({
  layout: "standard",
  accentColor: "#1e293b"
});

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const expandShortHex = (value) =>
  `#${value
    .slice(1)
    .split("")
    .map((char) => `${char}${char}`)
    .join("")}`.toLowerCase();

export const parseHexColor = (value) => {
  if (typeof value !== "string") return null;

  const trimmedValue = value.trim();
  const prefixedValue = trimmedValue.startsWith("#") ? trimmedValue : `#${trimmedValue}`;

  if (!HEX_COLOR_PATTERN.test(prefixedValue)) {
    return null;
  }

  return prefixedValue.length === 4
    ? expandShortHex(prefixedValue)
    : prefixedValue.toLowerCase();
};

export const normalizeHexColor = (value, fallback) =>
  parseHexColor(value) || parseHexColor(fallback) || DEFAULT_PORTFOLIO_CUSTOMIZATION.accentColor;

const normalizeOption = (value, allowedValues, fallback) =>
  allowedValues.includes(value) ? value : fallback;

export const normalizeCustomization = (customization = {}) => {
  const portfolio = customization?.portfolio || {};
  const resume = customization?.resume || {};

  return {
    portfolio: {
      layout: normalizeOption(
        portfolio.layout,
        PORTFOLIO_LAYOUT_OPTIONS.map((option) => option.id),
        DEFAULT_PORTFOLIO_CUSTOMIZATION.layout
      ),
      theme: normalizeOption(
        portfolio.theme,
        PORTFOLIO_THEME_OPTIONS.map((option) => option.id),
        DEFAULT_PORTFOLIO_CUSTOMIZATION.theme
      ),
      accentColor: normalizeHexColor(
        portfolio.accentColor,
        DEFAULT_PORTFOLIO_CUSTOMIZATION.accentColor
      )
    },
    resume: {
      layout: normalizeOption(
        resume.layout,
        RESUME_LAYOUT_OPTIONS.map((option) => option.id),
        DEFAULT_RESUME_CUSTOMIZATION.layout
      ),
      accentColor: normalizeHexColor(
        resume.accentColor,
        DEFAULT_RESUME_CUSTOMIZATION.accentColor
      )
    }
  };
};

export const createDefaultPortfolioData = () => ({
  about: "",
  name: "",
  title: "",
  profilePic: null,
  work: [],
  education: [],
  skills: [],
  customSlug: "",
  published: false,
  publishedAt: null,
  contact: normalizeContactInfo(),
  customization: normalizeCustomization()
});

const normalizeSkill = (skill) => {
  if (typeof skill === "string") {
    return { name: skill };
  }

  if (!skill || typeof skill !== "object") {
    return { name: "" };
  }

  return {
    name: typeof skill.name === "string" ? skill.name : ""
  };
};

export const normalizePortfolioData = (data = {}) => {
  const defaults = createDefaultPortfolioData();

  return {
    ...defaults,
    ...data,
    work: Array.isArray(data.work) ? data.work : defaults.work,
    education: Array.isArray(data.education) ? data.education : defaults.education,
    skills: Array.isArray(data.skills)
      ? data.skills.map(normalizeSkill)
      : defaults.skills,
    contact: normalizeContactInfo({
      ...defaults.contact,
      ...(data.contact || {})
    }),
    customization: normalizeCustomization(data.customization)
  };
};
