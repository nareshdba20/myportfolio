export type OwnPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
};

export const ownPosts: OwnPost[] = [
  {
    slug: "github-branch-protection-free",
    title: "GitHub Branch Protection on Private Repos — Without Paying for Team Plan",
    date: "2026-06-03",
    category: "DevOps",
    readTime: "4 min read",
    excerpt:
      "GitHub Rulesets on private repos require the Team plan. Here is a GitHub Actions workaround that blocks direct pushes to main and prevents deploys from running — completely free.",
  },
  {
    slug: "ec2-bedrock-textract-iam-fix",
    title: "EC2 Not Authorized to Call Bedrock or Textract — How to Fix IAM Permissions",
    date: "2026-06-03",
    category: "Cloud",
    readTime: "5 min read",
    excerpt:
      "How to fix the 'is not authorized to perform: bedrock:InvokeModel' error when running AI workloads on EC2 — adding the right IAM policies for Bedrock and Textract in under two minutes.",
  },
  {
    slug: "aws-dev-environment-setup",
    title: "Setting Up a Production-Mirror Dev Environment on AWS",
    date: "2026-06-02",
    category: "Cloud",
    readTime: "12 min read",
    excerpt:
      "How I built a fully isolated dev environment for RiseYou — separate EC2, RDS PostgreSQL 17, S3, ECR, and Amplify frontend — with GitHub Actions CI/CD that deploys on every push to the dev branch.",
  },
  {
    slug: "oracle-rac-cold-backup-rman",
    title: "Oracle RAC Cold Backup Using RMAN — Step by Step",
    date: "2025-05-20",
    category: "Oracle",
    readTime: "6 min read",
    excerpt:
      "A complete walkthrough of taking a cold backup on an Oracle RAC cluster using RMAN — covering shutdown, mount, compressed backup, controlfile, SPFILE, and pfile creation.",
  },
  {
    slug: "oracle-dba-scripts-collection",
    title: "Oracle DBA Scripts Collection — Standby, Archive Sync, Space & Performance",
    date: "2025-05-25",
    category: "Oracle",
    readTime: "10 min read",
    excerpt:
      "A practical reference of Oracle DBA shell scripts and SQL queries covering standby database build automation, archive log sync check, space monitoring, RMAN progress, and everyday DBA tasks.",
  },
  {
    slug: "oracle-dataguard-dr-configuration",
    title: "Oracle Data Guard DR Configuration — Primary, Local HA, COLO2 & Far Sync",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "15 min read",
    excerpt:
      "Complete step-by-step guide to setting up Oracle Data Guard with Far Sync and COLO2 DR for a 6-node RAC cluster — covering Primary config, Local HA standby, COLO2 standby, Far Sync instance, and DG Broker setup.",
  },
  {
    slug: "oracle-rolling-forward-standby-rman-incremental",
    title: "Rolling Forward a Physical Standby Using RMAN Incremental Backup (DocID 836986.1)",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "8 min read",
    excerpt:
      "How to roll forward a physical standby database that has fallen too far behind primary using an RMAN incremental backup — avoiding a full rebuild when archive logs are no longer available.",
  },
  {
    slug: "oracle-standby-new-datafile-incremental",
    title: "Rolling Forward Standby When Datafile Added to Primary (DocID 1531031.1)",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "6 min read",
    excerpt:
      "Step-by-step procedure to recover a physical standby when a new tablespace or datafile is added to primary and the standby cannot receive it — using RMAN incremental backup to restore the missing file.",
  },
  {
    slug: "oracle-transportable-tablespace-cross-platform",
    title: "Reduce Transportable Tablespace Downtime Using Cross-Platform Incremental Backup (DocID 2471245.1)",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "10 min read",
    excerpt:
      "The V4 method for moving tablespaces across platforms (e.g., Solaris to Linux) with minimal downtime — using RMAN cross-platform incremental backups to keep the transport set current before the final cutover window.",
  },
  {
    slug: "oracle-datapump-expdp-impdp",
    title: "Oracle Data Pump (expdp/impdp) — Table & Schema Export/Import Guide",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "8 min read",
    excerpt:
      "Complete guide to Oracle Data Pump for table and schema-level export and import — parameter files, directory setup, parallel export, tablespace verification, and schema remapping.",
  },
  {
    slug: "oracle-standby-rebuild-rman",
    title: "Oracle Standby Database Rebuild Using RMAN — Control File Restore & Recovery",
    date: "2025-05-29",
    category: "Oracle",
    readTime: "10 min read",
    excerpt:
      "Step-by-step procedure to rebuild an Oracle physical standby database using RMAN — restoring the control file from primary, cataloging ASM datafiles, recovering from service, and resizing standby redo logs.",
  },
  {
    slug: "mysql-mariadb-database-migration",
    title: "MySQL / MariaDB Database Migration — Step-by-Step Guide",
    date: "2025-05-29",
    category: "MySQL",
    readTime: "5 min read",
    excerpt:
      "End-to-end procedure for migrating a MySQL/MariaDB database between environments using mysqldump — covering export, user grants, import, and post-migration verification.",
  },
];
