export const portfolio = {
  name: "Naresh Gowda",
  tagline: "Computer Engineer · Database Administrator · Building cool things",
  location: "Dallas, TX",
  currentRole: "SWE @ Evozn Inc",
  yearsOfExp: "5+",
  github: "https://github.com/nareshdba20",
  linkedin: "https://www.linkedin.com/in/nareshgowdadba",
  blog: "https://focusondb.wordpress.com/",
  blogName: "Focus on DB",
} as const;

export const projects = [
  {
    name: "Townwall",
    description:
      "Anonymous community platform with AI-moderated posts. Built for safe, authentic community conversations at scale with production-grade infrastructure.",
    tags: ["Node.js", "TypeScript", "React", "PostgreSQL", "AWS ECS", "Terraform"],
    icon: "🏘️",
    github: "#",
    live: null,
    featured: true,
  },
  {
    name: "Voice Chat Platform",
    description:
      "Real-time voice chat web app with low-latency audio streaming, load-balanced on AWS with CloudFront CDN distribution.",
    tags: ["React", "Vite", "AWS ALB", "CloudFront"],
    icon: "🎙️",
    github: "#",
    live: null,
    featured: true,
  },
  {
    name: "Alpaca Trading Bot",
    description:
      "Algorithmic trading bot for stocks and crypto with automated strategy execution, backtesting, and live order management via Alpaca and Zerodha APIs.",
    tags: ["Python", "Alpaca API", "Zerodha"],
    icon: "📈",
    github: "#",
    live: null,
    featured: false,
  },
  {
    name: "AI Productivity Agent",
    description:
      "CLI-based AI agent for automating daily tasks, sending smart notifications, and managing workflows entirely from the terminal.",
    tags: ["Python", "CLI", "AI Agent"],
    icon: "🤖",
    github: "#",
    live: null,
    featured: false,
  },
  {
    name: "X Comment Summarizer",
    description:
      "Chrome extension that scrapes X/Twitter comment threads and uses AI to generate concise summaries of the full discussion.",
    tags: ["Python", "Chrome Extension", "JavaScript"],
    icon: "🐦",
    github: "#",
    live: null,
    featured: false,
  },
  {
    name: "Hermes Agent",
    description:
      "Configurable AI agent framework for orchestrating multi-step automated workflows, tool use, and long-running task pipelines.",
    tags: ["Python", "AI Agent"],
    icon: "⚡",
    github: "#",
    live: null,
    featured: false,
  },
  {
    name: "MLOps Platform",
    description:
      "End-to-end ML model serving platform with REST API endpoints for model inference, versioning, and monitoring.",
    tags: ["Python", "Flask", "FastAPI", "MLOps"],
    icon: "🧠",
    github: "#",
    live: null,
    featured: false,
  },
  {
    name: "Job Autofill Extension",
    description:
      "Browser extension that intelligently autofills job application forms — eliminates hours of repetitive data entry.",
    tags: ["Chrome Extension", "JavaScript"],
    icon: "📝",
    github: "#",
    live: null,
    featured: false,
  },
] as const;

export const skills = [
  {
    category: "Languages & Frameworks",
    color: "violet",
    items: ["React", "TypeScript", "JavaScript", "Next.js", "Python", "Node.js"],
  },
  {
    category: "Databases",
    color: "blue",
    items: ["PostgreSQL", "Oracle", "MySQL", "MongoDB", "MSSQL"],
  },
  {
    category: "Design & Product",
    color: "pink",
    items: ["UI/UX Design", "Product Design", "Figma"],
  },
  {
    category: "Cloud & Tools",
    color: "green",
    items: ["AWS", "Terraform", "Git", "GitHub", "VSCode", "Docker"],
  },
] as const;
