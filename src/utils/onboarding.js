import { normalizePortfolioData } from "./customization";

const createAvatarDataUrl = (name, accentColor) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
      <rect width="320" height="320" rx="48" fill="${accentColor}" />
      <circle cx="160" cy="116" r="52" fill="rgba(255,255,255,0.18)" />
      <path d="M80 254c16-42 50-64 80-64s64 22 80 64" fill="rgba(255,255,255,0.18)" />
      <text x="160" y="180" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="700" fill="#ffffff">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const createTemplate = ({
  id,
  label,
  audience,
  summary,
  accentColor,
  portfolioTheme,
  portfolioLayout,
  resumeLayout,
  data
}) => ({
  id,
  label,
  audience,
  summary,
  accentColor,
  data: normalizePortfolioData({
    ...data,
    profilePic: createAvatarDataUrl(data.name, accentColor),
    customization: {
      portfolio: {
        layout: portfolioLayout,
        theme: portfolioTheme,
        accentColor
      },
      resume: {
        layout: resumeLayout,
        accentColor
      }
    }
  })
});

export const STARTER_TEMPLATES = [
  createTemplate({
    id: "software-engineer",
    label: "Software Engineer",
    audience: "Best for full-stack, frontend, and campus engineering roles",
    summary: "A polished technical starter with projects, product-minded experience language, and recruiter-friendly defaults.",
    accentColor: "#4f46e5",
    portfolioTheme: "light",
    portfolioLayout: "modern",
    resumeLayout: "standard",
    data: {
      name: "Aarav Mehta",
      title: "Aspiring Software Engineer",
      about:
        "Final-year computer science student focused on building reliable web products with React, JavaScript, and backend APIs. I enjoy turning rough ideas into polished user experiences and shipping improvements quickly.",
      education: [
        {
          school: "ABC Institute of Technology",
          degree: "B.Tech in Computer Science",
          date: "2022 - 2026",
          description:
            "Relevant coursework: data structures, DBMS, operating systems, computer networks, and cloud fundamentals."
        }
      ],
      work: [
        {
          company: "Campus Developer Lab",
          role: "Frontend Intern",
          date: "Jan 2026 - Mar 2026",
          responsibilities:
            "Built reusable UI components, improved responsive layouts, and collaborated with mentors on weekly product releases.",
          accomplishments:
            "Reduced friction in the project showcase flow and helped launch a student-facing release used during placement season."
        }
      ],
      skills: [
        { name: "React" },
        { name: "JavaScript" },
        { name: "HTML/CSS" },
        { name: "Node.js" },
        { name: "GitHub" },
        { name: "SQL" }
      ],
      contact: {
        phone: "+91 98765 43210",
        email: "aarav.student@example.com",
        linkedin: "linkedin.com/in/aarav-mehta",
        github: "github.com/aarav-mehta"
      }
    }
  }),
  createTemplate({
    id: "data-analyst",
    label: "Data Analyst",
    audience: "Best for analytics, BI, and operations roles",
    summary: "A clear, insight-driven starter focused on dashboards, SQL, storytelling, and measurable impact.",
    accentColor: "#0f766e",
    portfolioTheme: "light",
    portfolioLayout: "classic",
    resumeLayout: "executive",
    data: {
      name: "Riya Nair",
      title: "Entry-Level Data Analyst",
      about:
        "Business and analytics graduate who enjoys turning messy datasets into clear decisions. Comfortable with SQL, Excel, dashboarding, and communicating trends to non-technical teams.",
      education: [
        {
          school: "National School of Business and Analytics",
          degree: "BBA in Business Analytics",
          date: "2021 - 2025",
          description:
            "Focused on business intelligence, statistics, forecasting, visualization, and stakeholder communication."
        }
      ],
      work: [
        {
          company: "Insight Sprint",
          role: "Analytics Intern",
          date: "Jun 2025 - Aug 2025",
          responsibilities:
            "Cleaned reporting data, built weekly dashboards, and tracked funnel health across campaign and student onboarding metrics.",
          accomplishments:
            "Automated a recurring reporting workflow and reduced manual spreadsheet work for the operations team."
        }
      ],
      skills: [
        { name: "SQL" },
        { name: "Excel" },
        { name: "Power BI" },
        { name: "Python" },
        { name: "Data Visualization" },
        { name: "Statistics" }
      ],
      contact: {
        phone: "+91 91234 56780",
        email: "riya.analyst@example.com",
        linkedin: "linkedin.com/in/riya-nair",
        github: "github.com/riya-nair"
      }
    }
  }),
  createTemplate({
    id: "product-designer",
    label: "Product Designer",
    audience: "Best for UI/UX, visual design, and product design roles",
    summary: "A bolder starter with narrative-driven case study language and a more expressive portfolio look.",
    accentColor: "#db2777",
    portfolioTheme: "dark",
    portfolioLayout: "creative",
    resumeLayout: "minimal",
    data: {
      name: "Neha Kapoor",
      title: "Junior Product Designer",
      about:
        "Design graduate who enjoys translating user problems into interfaces that feel simple, useful, and visually confident. Interested in product thinking, design systems, and prototyping flows that ship well.",
      education: [
        {
          school: "School of Design and Media",
          degree: "B.Des in Interaction Design",
          date: "2021 - 2025",
          description:
            "Studied UX research, interface design, prototyping, visual communication, and design systems."
        }
      ],
      work: [
        {
          company: "Studio North",
          role: "Design Intern",
          date: "Feb 2025 - May 2025",
          responsibilities:
            "Created wireframes, refined interface states, and supported the team in usability reviews for mobile and desktop product flows.",
          accomplishments:
            "Helped improve navigation clarity in a student services product and contributed to reusable component documentation."
        }
      ],
      skills: [
        { name: "Figma" },
        { name: "Wireframing" },
        { name: "Design Systems" },
        { name: "UX Research" },
        { name: "Prototyping" },
        { name: "Visual Design" }
      ],
      contact: {
        phone: "+91 99887 77665",
        email: "neha.design@example.com",
        linkedin: "linkedin.com/in/neha-kapoor",
        github: "github.com/neha-kapoor"
      }
    }
  })
];

export const hasMeaningfulPortfolioContent = (data = {}) => {
  const normalizedData = normalizePortfolioData(data);

  return Boolean(
    normalizedData.name.trim() ||
      normalizedData.title.trim() ||
      normalizedData.about.trim() ||
      normalizedData.profilePic ||
      normalizedData.education.length ||
      normalizedData.work.length ||
      normalizedData.skills.length ||
      normalizedData.contact.phone ||
      normalizedData.contact.email ||
      normalizedData.contact.github ||
      normalizedData.contact.linkedin
  );
};
