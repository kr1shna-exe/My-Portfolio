export type ExperienceItem = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  link?: string;
  highlights: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "CompanyInsights",
    role: "Founding AI/ML Engineer",
    start: "March 2026",
    end: "Present",
    location: "Remote",
    summary:
      "Leading the design and development of AI-native systems powering CompanyInsights.ai, building agentic workflows, retrieval pipelines and scalable LLM infrastructure to transform unstructured business data into actionable insights.",
    link: "https://companyinsights.ai",
    highlights: [
    ],
  },
  {
    company: "Springreen",
    role: "Full-Stack Engineer",
    start: "Oct 2024",
    end: "Feb 2025",
    location: "Remote",
    summary:
      "Produced ApeHR’s marketing experience so prospects can see, in one scroll, how the platform turns manual hiring into an automated, insight-led workflow.",
    link: "https://acetrumpets.vercel.app",
    highlights: [
      "Translated stakeholder research into interactive KPI stories (survey stats, hiring funnels, ATS benchmarks) ",
      "Lined up persona-specific CTAs with instant Telegram notifications, giving the founding team real-time insight",
    ],
  },
  {
    company: "Beasova",
    role: "Lead Frontend Engineer",
    start: "Aug 2024",
    end: "Sep 2024",
    location: "Remote",
    summary:
      "Delivered production-ready web applications for client using React, Tailwind CSS, and the MERN stack, translating requirements into scalable frontend architectures.",
    highlights: [
      "Built and deployed client website from ground up using React and Tailwind CSS, ensuring responsive design and cross-browser compatibility.",
      "Integrated RESTful APIs and managed state using Redux/Context API, ensuring seamless data flow between frontend and Node.js backends.",
    ],
  },
];
