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
    slug: "mysql-mariadb-database-migration",
    title: "MySQL / MariaDB Database Migration — Step-by-Step Guide",
    date: "2025-05-29",
    category: "MySQL",
    readTime: "5 min read",
    excerpt:
      "End-to-end procedure for migrating a MySQL/MariaDB database between environments using mysqldump — covering export, user grants, import, and post-migration verification.",
  },
];
