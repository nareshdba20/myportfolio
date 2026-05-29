import Nav from "@/components/nav";
import Footer from "@/components/footer";
import PrintButton from "@/components/print-button";
import { MapPin, Mail, Linkedin } from "lucide-react";

export const metadata = {
  title: "Resume — Naresh Gowda",
  description: "Resume of Naresh Gowda — Software Engineer & Database Administrator.",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen">
      <Nav />

      <div className="max-w-4xl mx-auto px-5 pt-28 pb-20">

        {/* Print button */}
        <div className="flex justify-end mb-6 print:hidden">
          <PrintButton />
        </div>

        {/* Resume card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 sm:p-12 print:shadow-none print:border-none">

          {/* Header */}
          <div className="text-center border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">Naresh Gowda</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500">
              <a href="mailto:nareshdba20@gmail.com" className="flex items-center gap-1 hover:text-violet-600 transition-colors">
                <Mail size={11} /> nareshdba20@gmail.com
              </a>
              <span className="flex items-center gap-1"><MapPin size={11} /> Dallas, TX, USA</span>
              <a href="https://www.linkedin.com/in/nareshgowdadba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Linkedin size={11} /> linkedin.com/in/nareshgowdadba
              </a>
              <span>+1 945-266-9794</span>
            </div>
          </div>

          {/* Summary */}
          <Section title="Professional Summary">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Software Engineer with 7+ years of experience delivering enterprise-scale and AI-enabled applications. Proven track record in
              optimizing systems, automating workflows, and leading cross-functional teams to deliver measurable business impact.
              Successfully led projects spanning enterprise migration, AI-powered platforms, and full-stack software development, improving
              performance, scalability, and user adoption.
            </p>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              {[
                { label: "Programming & Scripting", value: "Python, Go, Bash/Shell Scripting, PowerShell, YAML, JSON, SQL, PL/SQL, JavaScript, Node.js" },
                { label: "Cloud Platforms", value: "AWS (EC2, ECS, EKS, Lambda, S3, RDS, CloudFormation, CloudWatch, IAM, VPC, Route53, ALB/NLB, Auto Scaling), Azure, OCI, Exadata" },
                { label: "Container & Orchestration", value: "Docker, Kubernetes, Helm, Docker Compose, Container Registry, Service Mesh (Istio), OpenShift" },
                { label: "Infrastructure as Code", value: "Terraform, CloudFormation, AWS CDK" },
                { label: "CI/CD & DevOps", value: "Jenkins, GitHub Actions, GitLab CI/CD, Azure DevOps, CircleCI, ArgoCD, GitOps" },
                { label: "Monitoring & Observability", value: "Prometheus, Grafana, ELK Stack, Datadog, New Relic, CloudWatch, Jaeger, Zipkin" },
                { label: "Networking", value: "TCP/IP, DNS, Load Balancing, VPN, CDN, API Gateway, Service Discovery, Network Security, Firewalls, NAT Gateways" },
                { label: "Site Reliability Engineering", value: "SLA/SLO/SLI, Incident Response, Chaos Engineering, Disaster Recovery, High Availability, Capacity Planning" },
              ].map((s) => (
                <div key={s.label} className="flex gap-1.5">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-200 shrink-0">{s.label}:</span>
                  <span>{s.value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Work Experience */}
          <Section title="Work Experience">
            <div className="space-y-6">
              <Job
                role="Database and DevOps Engineer"
                company="Evozn Inc, USA"
                period="Jun 2025 – Present"
                bullets={[
                  "Architected end-to-end CI/CD pipelines for Node.js microservices using GitHub Actions, AWS Lambda, and Docker, implementing automated testing, security scanning, and blue-green deployments.",
                  "Provisioned and managed cloud databases on AWS RDS and EC2-hosted instances (MySQL, PostgreSQL, MongoDB, SQL Server) ensuring high availability, replication, and disaster recovery with multi-AZ configurations.",
                  "Developed and maintained UNIX shell scripts to automate deployments, backups, and operational workflows.",
                  "Configured comprehensive monitoring using AWS CloudWatch with custom metrics, automated alerting, log aggregation, and performance dashboards for Lambda and EC2 infrastructure.",
                  "Managed database migrations from legacy on-premise systems to AWS cloud including cross-platform migrations, version upgrades, schema refactoring, and data validation to minimize downtime.",
                  "Implemented HA and DR strategies using AWS Multi-AZ RDS, read replicas, and Oracle Data Guard for zero data loss and business continuity.",
                ]}
              />
              <Job
                role="Cloud Engineer"
                company="Deloitte India Ltd"
                period="Nov 2020 – Jun 2023"
                bullets={[
                  "Migrated 100+ databases from HP-UX to RHEL using Oracle Data Pump and RMAN; adapted backup/restore processes for Db2 LUW.",
                  "Performed on-prem to AWS Cloud migrations using AWS DMS, enabling scalable and cost-efficient environments.",
                  "Upgraded Oracle databases (10g/11g → 19c) with minimal downtime.",
                  "Administered 5-node Oracle RAC clusters and ASM storage, implementing Data Guard for DR and high availability.",
                  "Designed and implemented database security strategies (TDE, auditing, masking).",
                  "Tuned performance using AWR, ADDM, ASH, and DBMS_STATS; implemented partitioning for large datasets.",
                  "Managed end-to-end Exadata lifecycle operations including patching, storage cell management, compute node updates, and cluster maintenance.",
                  "Provided 24×7 production support, mentored junior DBAs, and managed capacity planning for 40TB+ environments.",
                ]}
              />
              <Job
                role="Database Engineer"
                company="Epayslip.com"
                period="Oct 2018 – Jan 2020"
                bullets={[
                  "Installed and managed Oracle (10g–12c), PostgreSQL, MySQL, and MongoDB on Linux/Windows.",
                  "Administered AWS EC2-hosted databases and set up CloudWatch alarms for real-time monitoring.",
                  "Developed RMAN backup/recovery plans and implemented SQL Server TDE.",
                  "Supported full lifecycle DB migrations from dev to production in 3-tier architectures.",
                  "Applied quarterly patch sets using OPatch and maintained patch compliance.",
                  "Actively supported 24×7 production environments with high reliability and performance SLAs.",
                ]}
              />
            </div>
          </Section>

          {/* Projects */}
          <Section title="Key Projects">
            <div className="space-y-4">
              {[
                {
                  name: "Townwall — Anonymous Engagement Platform",
                  company: "Evozn Inc",
                  bullets: [
                    "Architected multi-tier AWS infrastructure using Terraform (VPC, ECS Fargate, RDS Multi-AZ PostgreSQL, ElastiCache Redis, CloudFront CDN) with 99.5% uptime SLA.",
                    "Built GitHub Actions CI/CD pipeline reducing deployment time by 75%; achieved 9.3/10 security score through AWS WAF, SSL/TLS, and SonarQube gates.",
                    "Implemented ECS Fargate auto-scaling supporting 1M+ monthly requests with zero-downtime deployments.",
                  ],
                },
                {
                  name: "AI Hiring Athena — Intelligent Recruitment Platform",
                  company: "Evozn Inc",
                  bullets: [
                    "Architected AWS App Runner deployment with FastAPI backend, integrated Redis, S3, and AI services (Bedrock, Transcribe, Rekognition) handling 1000+ concurrent interview sessions.",
                    "Implemented GitHub-integrated CD reducing time-to-market by 60%; optimized AWS costs by 40% through right-sizing and reserved instances.",
                    "Built secure data pipelines for resume parsing, video proctoring, and AI-powered interviews with 99.9% data integrity and GDPR compliance.",
                  ],
                },
                {
                  name: "Voice Chat Platform — Real-time Communication",
                  company: "Evozn Inc",
                  bullets: [
                    "Deployed containerized Node.js/React with Docker multi-stage builds achieving <100ms latency for voice connections.",
                    "Implemented CDN caching and WebRTC connection pooling achieving 40% bandwidth reduction; maintained 99.9% service availability.",
                  ],
                },
              ].map((proj) => (
                <div key={proj.name}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{proj.name}</p>
                    <span className="text-[10px] text-violet-600 dark:text-violet-400 font-medium shrink-0 ml-2">{proj.company}</span>
                  </div>
                  <ul className="space-y-1">
                    {proj.bullets.map((b, i) => (
                      <li key={i} className="flex gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        <span className="text-violet-400 shrink-0 mt-0.5">•</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3 font-mono border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Job({ role, company, period, bullets }: { role: string; company: string; period: string; bullets: string[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-1 mb-2">
        <div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{role}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400"> · {company}</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-400 shrink-0">{period}</span>
      </div>
      <ul className="space-y-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <span className="text-violet-400 shrink-0 mt-0.5">•</span> {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
