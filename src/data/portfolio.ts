export const portfolio = {
  name: "Naresh Gowda",
  tagline: "Software Engineer · Database Administrator · Cloud & DevOps",
  location: "Dallas, TX",
  currentRole: "Database & DevOps Engineer @ Evozn Inc",
  yearsOfExp: "7+",
  github: "https://github.com/nareshdba20",
  linkedin: "https://www.linkedin.com/in/nareshgowdadba",
  blog: "https://focusondb.wordpress.com/",
  blogName: "Focus on DB",
  email: "nareshdba20@gmail.com",
} as const;

export type WorkExperience = {
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  highlights: string[];
};

export const workExperience: WorkExperience[] = [
  {
    role: "Database & DevOps Engineer",
    company: "Evozn Inc",
    location: "Dallas, TX, USA",
    period: "Jun 2025 – Present",
    current: true,
    highlights: [
      "Architected CI/CD pipelines for Node.js microservices using GitHub Actions, AWS Lambda, and Docker with blue-green deployments.",
      "Provisioned and managed AWS RDS instances (MySQL, PostgreSQL, MongoDB, SQL Server) with Multi-AZ for high availability and DR.",
      "Configured AWS CloudWatch monitoring with custom metrics, automated alerting, and performance dashboards.",
      "Managed database migrations from legacy on-premise systems to AWS cloud with zero data loss.",
      "Implemented HA strategies using AWS Multi-AZ RDS, read replicas, and Oracle Data Guard.",
    ],
  },
  {
    role: "Cloud Engineer",
    company: "Deloitte India Ltd",
    location: "India",
    period: "Nov 2020 – Jun 2023",
    current: false,
    highlights: [
      "Migrated 100+ databases from HP-UX to RHEL using Oracle Data Pump and RMAN with minimal downtime.",
      "Performed on-prem to AWS Cloud migrations using AWS DMS for scalable, cost-efficient environments.",
      "Upgraded Oracle databases (10g/11g → 19c) and administered 5-node Oracle RAC clusters with ASM storage.",
      "Managed end-to-end Exadata lifecycle including patching, storage cell management, and performance optimization via AWR, ASH, OEM.",
      "Provided 24×7 production support, mentored junior DBAs, and managed capacity planning for 40TB+ environments.",
    ],
  },
  {
    role: "Database Engineer",
    company: "Epayslip.com",
    location: "India",
    period: "Oct 2018 – Jan 2020",
    current: false,
    highlights: [
      "Installed and managed Oracle (10g–12c), PostgreSQL, MySQL, and MongoDB on Linux/Windows.",
      "Administered AWS EC2-hosted databases with CloudWatch alarms for real-time monitoring.",
      "Developed RMAN backup/recovery plans and implemented SQL Server TDE for data security.",
      "Supported full lifecycle DB migrations from dev to production in 3-tier architectures.",
    ],
  },
];

export type Project = {
  name: string;
  description: string;
  tags: string[];
  icon: string;
  github: string | null;
  live: string | null;
  featured: boolean;
  status: "work" | "side" | "open-source";
};

export const projects: Project[] = [
  {
    name: "Townwall",
    description:
      "Anonymous community platform with AI-moderated posts. Multi-tier AWS infrastructure (ECS Fargate, RDS PostgreSQL, ElastiCache Redis, CloudFront) with 99.5% uptime SLA and 1M+ monthly requests.",
    tags: ["React", "Node.js", "PostgreSQL", "AWS ECS", "Terraform", "Redis"],
    icon: "🏘️",
    github: null,
    live: null,
    featured: true,
    status: "work",
  },
  {
    name: "AI Hiring Athena",
    description:
      "Intelligent recruitment platform handling 1000+ concurrent AI interview sessions. FastAPI backend on AWS App Runner with Bedrock, Transcribe, and Rekognition integrations.",
    tags: ["FastAPI", "AWS App Runner", "Bedrock", "Transcribe", "Redis", "S3"],
    icon: "🧠",
    github: null,
    live: null,
    featured: true,
    status: "work",
  },
  {
    name: "Voice Chat Platform",
    description:
      "Real-time voice communication app with <100ms latency. Containerized Node.js/React with Docker multi-stage builds, WebRTC pooling, and CDN caching for 40% bandwidth reduction.",
    tags: ["React", "Node.js", "WebRTC", "Docker", "CloudFront", "AWS ALB"],
    icon: "🎙️",
    github: null,
    live: null,
    featured: true,
    status: "work",
  },
  {
    name: "Pet Services Platform",
    description:
      "SaaS-based pet services platform (grooming, training, vet, emergency). MVP built with React, Node.js, AWS Cognito auth, and MySQL schema for customers, providers, and appointments.",
    tags: ["React", "Node.js", "MySQL", "AWS EC2", "S3", "Lambda", "Cognito"],
    icon: "🐾",
    github: null,
    live: null,
    featured: false,
    status: "work",
  },
  {
    name: "Alpaca Trading Bot",
    description:
      "Algorithmic trading bot with automated strategy execution, backtesting, and live order management via Alpaca and Zerodha APIs.",
    tags: ["Python", "Alpaca API", "Zerodha"],
    icon: "📈",
    github: null,
    live: null,
    featured: false,
    status: "side",
  },
  {
    name: "AI Productivity Agent",
    description:
      "CLI-based AI agent for automating daily tasks, sending smart notifications, and managing workflows entirely from the terminal.",
    tags: ["Python", "CLI", "AI Agent"],
    icon: "🤖",
    github: null,
    live: null,
    featured: false,
    status: "side",
  },
  {
    name: "X Comment Summarizer",
    description:
      "Chrome extension that scrapes X/Twitter comment threads and uses AI to generate concise summaries of the full discussion.",
    tags: ["Python", "Chrome Extension", "JavaScript"],
    icon: "🐦",
    github: null,
    live: null,
    featured: false,
    status: "side",
  },
  {
    name: "MLOps Platform",
    description:
      "End-to-end ML model serving platform with REST API endpoints for model inference, versioning, and monitoring.",
    tags: ["Python", "FastAPI", "MLOps"],
    icon: "⚡",
    github: null,
    live: null,
    featured: false,
    status: "side",
  },
  {
    name: "Job Autofill Extension",
    description:
      "Browser extension that intelligently autofills job application forms — eliminates hours of repetitive data entry.",
    tags: ["Chrome Extension", "JavaScript"],
    icon: "📝",
    github: null,
    live: null,
    featured: false,
    status: "side",
  },
];

export const skills = [
  {
    category: "Languages & Scripting",
    color: "violet",
    items: ["Python", "Go", "JavaScript", "Node.js", "SQL", "PL/SQL", "Bash", "PowerShell"],
  },
  {
    category: "Databases",
    color: "blue",
    items: ["Oracle", "PostgreSQL", "MySQL", "MongoDB", "MSSQL", "Redis", "Exadata"],
  },
  {
    category: "Cloud & Infrastructure",
    color: "green",
    items: ["AWS", "Azure", "OCI", "Terraform", "CloudFormation", "AWS CDK", "Docker", "Kubernetes"],
  },
  {
    category: "CI/CD & Observability",
    color: "pink",
    items: ["GitHub Actions", "Jenkins", "ArgoCD", "Prometheus", "Grafana", "ELK Stack", "Datadog", "CloudWatch"],
  },
] as const;
