import Nav from "@/components/nav";
import Footer from "@/components/footer";
import PrintButton from "@/components/print-button";

export const metadata = {
  title: "Resume — Naresh Gowda",
  description: "Resume of Naresh Gowda — Software Engineer & Database Administrator.",
};

const experience = [
  {
    initials: "EV",
    color: "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300",
    company: "Evozn Inc",
    location: "Dallas, TX, USA",
    role: "Database & DevOps Engineer",
    period: "Jun 2025 – Present",
    current: true,
    bullets: [
      "Architected CI/CD pipelines for Node.js microservices using GitHub Actions, AWS Lambda, and Docker with blue-green deployments and automated security scanning.",
      "Provisioned and managed AWS RDS instances (MySQL, PostgreSQL, MongoDB, SQL Server) with Multi-AZ configurations for high availability and disaster recovery.",
      "Configured AWS CloudWatch monitoring with custom metrics, automated alerting, and performance dashboards.",
      "Managed database migrations from legacy on-premise systems to AWS cloud with zero data loss and minimal downtime.",
    ],
  },
  {
    initials: "DL",
    color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
    company: "Deloitte India Ltd",
    location: "India",
    role: "Cloud Engineer",
    period: "Nov 2020 – Jun 2023",
    current: false,
    bullets: [
      "Migrated 100+ databases from HP-UX to RHEL using Oracle Data Pump and RMAN with minimal downtime.",
      "Performed on-prem to AWS Cloud migrations using AWS DMS, enabling scalable and cost-efficient environments.",
      "Upgraded Oracle databases (10g/11g → 19c) and administered 5-node Oracle RAC clusters with ASM storage.",
      "Managed end-to-end Exadata lifecycle — patching, storage cell management, performance tuning via AWR, ASH, OEM.",
      "Provided 24×7 production support, mentored junior DBAs, and managed capacity planning for 40TB+ environments.",
    ],
  },
  {
    initials: "EP",
    color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    company: "Epayslip.com",
    location: "India",
    role: "Database Engineer",
    period: "Oct 2018 – Jan 2020",
    current: false,
    bullets: [
      "Installed and managed Oracle (10g–12c), PostgreSQL, MySQL, and MongoDB on Linux/Windows.",
      "Administered AWS EC2-hosted databases with CloudWatch alarms for real-time monitoring.",
      "Developed RMAN backup/recovery plans and implemented SQL Server TDE for data security.",
      "Supported full lifecycle DB migrations from dev to production in 3-tier architectures.",
    ],
  },
];

const skillSections = [
  {
    title: "Cloud & Infrastructure",
    items: ["AWS", "Azure", "OCI", "Terraform", "CloudFormation", "AWS CDK", "Docker", "Kubernetes", "Helm", "OpenShift"],
  },
  {
    title: "Databases",
    items: ["Oracle", "PostgreSQL", "MySQL", "MongoDB", "MSSQL", "Redis", "Exadata", "Oracle RAC", "AWS RDS"],
  },
  {
    title: "Languages & Scripting",
    items: ["Python", "Go", "JavaScript", "Node.js", "SQL", "PL/SQL", "Bash", "PowerShell"],
  },
  {
    title: "CI/CD & DevOps",
    items: ["GitHub Actions", "Jenkins", "GitLab CI/CD", "Azure DevOps", "CircleCI", "ArgoCD", "GitOps"],
  },
  {
    title: "Monitoring & Observability",
    items: ["Prometheus", "Grafana", "ELK Stack", "Datadog", "New Relic", "CloudWatch", "Jaeger"],
  },
  {
    title: "Site Reliability Engineering",
    items: ["High Availability", "Disaster Recovery", "Chaos Engineering", "Incident Response", "SLA/SLO/SLI", "Capacity Planning"],
  },
];

export default function ResumePage() {
  return (
    <main className="min-h-screen">
      <Nav />

      <div className="max-w-3xl mx-auto px-5 pt-28 pb-20">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-14">
          <div>
            <p className="font-mono text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">// resume</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">My Resume</h1>
          </div>
          <div className="print:hidden shrink-0 mt-6">
            <PrintButton />
          </div>
        </div>

        {/* Work Experience */}
        <Section title="Work Experience">
          <div className="space-y-6">
            {experience.map((job) => (
              <div key={job.company} className="flex gap-4">
                {/* Logo */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${job.color}`}>
                  {job.initials}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
                    <div>
                      <span className="font-semibold text-zinc-900 dark:text-white text-sm">{job.role}</span>
                      <span className="text-zinc-500 text-sm"> · {job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {job.current && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium border border-emerald-200 dark:border-emerald-500/20">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Now
                        </span>
                      )}
                      <span className="font-mono text-[11px] text-zinc-400">{job.period}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-3">{job.location}</p>
                  <ul className="space-y-1.5">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <span className="text-zinc-300 dark:text-zinc-600 mt-1 shrink-0">—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Skills */}
        {skillSections.map((section) => (
          <Section key={section.title} title={section.title}>
            <div className="flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>
        ))}

      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-5 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {title}
      </h2>
      {children}
    </div>
  );
}
