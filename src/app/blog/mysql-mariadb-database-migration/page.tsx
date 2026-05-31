import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "MySQL / MariaDB Database Migration — Naresh Gowda",
  description:
    "End-to-end procedure for migrating a MySQL/MariaDB database between environments using mysqldump — export, user grants, import, and post-migration verification.",
};

export default function MySQLMigration() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-500/20">
              <Tag size={10} /> MySQL
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 5 min read</span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            MySQL / MariaDB Database Migration — Step-by-Step Guide
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            A complete procedure for migrating a MySQL/MariaDB database between two environments (e.g., CMO → FMO, or Dev → Prod)
            using <code>mysqldump</code>. Covers export, user grants extraction, import, and verification.
          </p>
        </div>

        <div className="prose-custom">

          <Section title="Overview">
            <p>
              This procedure covers a live database migration between two separate environments.
              The goal is a consistent, verified copy of the source database on the target server
              with matching user permissions and schema.
            </p>
            <ul>
              <li><strong>Source (CMO):</strong> The environment you are migrating FROM</li>
              <li><strong>Target (FMO):</strong> The environment you are migrating TO</li>
              <li><strong>Tool:</strong> <code>mysqldump</code> — ships with MySQL/MariaDB, no extra install needed</li>
            </ul>
          </Section>

          <Section title="Step 1 — Connect to Source Server">
            <p>RDP or SSH to your source database server and open a terminal.</p>
            <CodeBlock language="bash" code={`# Navigate to MySQL binary directory if not in PATH
mysql -u root -p<password>

-- Verify databases
SHOW DATABASES;

-- If replication is configured: gap should be 0 before migration
SHOW SLAVE STATUS\G
-- Look for: Seconds_Behind_Master: 0`} />
            <Note>Always confirm the slave lag is 0 before dumping to avoid capturing a mid-replication state.</Note>
          </Section>

          <Section title="Step 2 — Record Table Count (Pre-Migration Baseline)">
            <p>Note the table count — you will verify this matches after import.</p>
            <CodeBlock language="sql" code={`-- Record this output to compare after import
SHOW TABLES FROM your_database_name;`} />
          </Section>

          <Section title="Step 3 — Export the Database (mysqldump)">
            <p>
              Exit the MySQL prompt and run the dump from the OS. Use <code>--single-transaction</code>
              for InnoDB to avoid locking the database during export.
            </p>
            <CodeBlock language="bash" code={`exit;   -- exit mysql prompt first

mysqldump -u root -p<password> \\
  -qf \\
  --skip-add-drop-table \\
  --single-transaction \\
  --routines \\
  --triggers \\
  --databases your_database_name \\
  > /path/to/backup/db_dump_$(date +%d%b%y).sql`} />
            <Note>
              <code>--routines</code> includes stored procedures and functions.
              <code>--triggers</code> includes trigger definitions.
              <code>--single-transaction</code> takes a consistent snapshot without locking (InnoDB only).
            </Note>
          </Section>

          <Section title="Step 4 — Export User Grants">
            <p>
              Extract the grants for non-root users that need to exist on the target.
              Run these in MySQL prompt, save the output.
            </p>
            <CodeBlock language="sql" code={`-- List all users and their grant statements
SELECT CONCAT('SHOW GRANTS FOR ''', user, '''@''', host, ''';')
FROM mysql.user
WHERE user != 'root';

-- Run the SHOW GRANTS for each user you need, e.g.:
SHOW GRANTS FOR 'appuser'@'%';
SHOW GRANTS FOR 'readonlyuser'@'%';

-- Copy the output — you will run these on the target in Step 8`} />
          </Section>

          <Section title="Step 5 — Copy the Dump File to Target">
            <CodeBlock language="bash" code={`# Option A: SCP from source to target
scp /path/to/backup/db_dump_*.sql user@target-server:/path/to/import/

# Option B: Shared network drive (Windows environments)
# Copy db_dump_*.sql to \\\\target-server\\Database\\your_db\\`} />
          </Section>

          <Section title="Step 6 — Connect to Target Server">
            <p>RDP or SSH to the target (FMO) server.</p>
            <CodeBlock language="bash" code={`mysql -u root -p<password>

-- Verify connectivity and replication state (if applicable)
SHOW DATABASES;
SHOW SLAVE STATUS\G    -- Seconds_Behind_Master should be 0`} />
          </Section>

          <Section title="Step 7 — Create the Database on Target">
            <CodeBlock language="sql" code={`CREATE DATABASE your_database_name;`} />
          </Section>

          <Section title="Step 8 — Create Users and Grant Permissions">
            <p>Apply the grants you captured in Step 4.</p>
            <CodeBlock language="sql" code={`-- Create users and apply grants from Step 4 output
CREATE USER 'appuser'@'%' IDENTIFIED BY '<password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON your_database_name.* TO 'appuser'@'%';

-- Apply other grants from Step 4...

-- Always flush after user/grant changes
FLUSH PRIVILEGES;`} />
          </Section>

          <Section title="Step 9 — Import the Database">
            <CodeBlock language="bash" code={`exit;   -- exit mysql prompt

# Standard import
mysql -u root -p<password> your_database_name \\
  < /path/to/import/db_dump_*.sql

# If the above produces empty tables, import without specifying database:
mysql -u root -p<password> < /path/to/import/db_dump_*.sql`} />
            <Note>
              If you used <code>--databases</code> in the dump command (recommended), the SQL file contains
              <code>CREATE DATABASE</code> and <code>USE</code> statements, so you can import without specifying the DB name.
            </Note>
          </Section>

          <Section title="Step 10 — Post-Migration Verification">
            <CodeBlock language="sql" code={`mysql -u root -p<password>

-- Verify DB exists
SHOW DATABASES;

-- Check replication (if applicable)
SHOW SLAVE STATUS\G    -- Seconds_Behind_Master: 0

-- Compare table count with Step 2 baseline
SHOW TABLES FROM your_database_name;

-- Quick row count check on critical tables
SELECT COUNT(*) FROM your_database_name.your_critical_table;`} />
            <Note>Table count and row counts in critical tables on the target must match the source baseline from Step 2.</Note>
          </Section>

          <Section title="Connecting with SSL (MariaDB)">
            <p>When SSL is required to connect to a secured MariaDB instance:</p>
            <CodeBlock language="bash" code={`mysql \\
  --ssl-ca=/path/to/certs/ca.crt \\
  --ssl-cert=/path/to/certs/server.crt \\
  --ssl-key=/path/to/certs/server.key \\
  --host=your-db-server.domain.com \\
  -u your_username -p`} />
          </Section>

          <Section title="Quick Reference">
            <CodeBlock language="sql" code={`-- Check users in a specific database
SELECT user FROM mysql.db WHERE db = 'your_database_name';

-- Check all user privileges
SELECT user, host, authentication_string FROM mysql.user;

-- Show grants for a specific user
SHOW GRANTS FOR 'appuser'@'%';`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">MySQL · MariaDB · Migration · mysqldump</span>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">{title}</h2>
      <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{children}</div>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 my-3">
      <div className="flex items-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/50">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto bg-zinc-50 dark:bg-zinc-900/60">
        <code className="text-xs font-mono text-zinc-800 dark:text-zinc-300 leading-relaxed whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 my-3">
      <span className="text-amber-500 text-sm shrink-0">💡</span>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{children}</p>
    </div>
  );
}
