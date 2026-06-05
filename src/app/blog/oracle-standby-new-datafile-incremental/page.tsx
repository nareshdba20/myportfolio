import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Rolling Forward Standby When Datafile Added to Primary — Naresh Gowda",
  description:
    "How to recover a physical standby when a new tablespace or datafile is added to primary and the standby cannot receive it — using RMAN incremental backup to restore the missing file.",
};

export default function StandbyNewDatafile() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-medium border border-orange-200 dark:border-orange-500/20">
              <Tag size={10} /> Oracle
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 6 min read</span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Rolling Forward Standby When a Datafile Is Added to Primary
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Reference: Oracle MOS <span className="font-mono text-violet-600 dark:text-violet-400">DocID 1531031.1</span>
          </p>
        </div>

        <div className="space-y-1">

          <Section title="Problem Statement">
            <p>
              A new tablespace or datafile is added to the primary database. The physical standby cannot receive it because:
            </p>
            <ul>
              <li>MRP is in a <strong>wait state</strong> — standby waiting for a datafile it has never seen</li>
              <li><code>STANDBY_FILE_MANAGEMENT=MANUAL</code> was set — standby did not auto-create the file</li>
              <li>Network link between primary and standby was down when the file was added</li>
              <li>The new file resides on a path unavailable on the standby</li>
            </ul>
            <Note>Check alert log on standby for errors like: <code>ORA-01111: name for datafile N is unknown</code> or <code>MRP0: Background Media Recovery terminated with error 1110</code></Note>
          </Section>

          <Section title="Step 1 — Identify the Missing Datafiles">
            <CodeBlock language="sql" code={`-- On PRIMARY: find recently added datafiles by file# or creation time
SELECT file#, name, creation_time, bytes/1024/1024 size_MB
FROM v$datafile
ORDER BY creation_time DESC;

-- On STANDBY: compare — files present on primary but missing on standby
-- Run on standby and compare file# list against primary output
SELECT file#, name FROM v$datafile ORDER BY file#;

-- Check standby alert log for the exact file numbers causing issues
-- grep -i "datafile" $ORACLE_BASE/diag/rdbms/<db>/<sid>/trace/alert*.log`} />
          </Section>

          <Section title="Step 2 — Stop MRP on Standby">
            <CodeBlock language="sql" code={`-- On STANDBY
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

ALTER SYSTEM SET standby_file_management=MANUAL SCOPE=BOTH SID='*';`} />
          </Section>

          <Section title="Step 3 — Backup the Missing Datafiles on Primary">
            <p>On <strong>primary</strong>, backup only the new datafiles by file number:</p>
            <CodeBlock language="bash" code={`# On PRIMARY
rman target /`} />
            <CodeBlock language="sql" code={`-- Replace 219, 220, 221 with your actual missing file numbers
BACKUP DATAFILE 219, 220, 221
  FORMAT '/oracle/backup/new_files/ForStandby_%U'
  TAG 'NEW_DATAFILE_FORSTANDBY';`} />
          </Section>

          <Section title="Step 4 — Transfer Backup to Standby">
            <CodeBlock language="bash" code={`# SCP from primary to standby
scp /oracle/backup/new_files/ForStandby_* \
    oracle@standby-server:/oracle/backup/new_files/`} />
          </Section>

          <Section title="Step 5 — Catalog the Backup on Standby">
            <CodeBlock language="bash" code={`# On STANDBY
rman target /`} />
            <CodeBlock language="sql" code={`CATALOG START WITH '/oracle/backup/new_files/' NOPROMPT;`} />
          </Section>

          <Section title="Step 6 — Restore the Datafiles to ASM (or Filesystem)">
            <CodeBlock language="sql" code={`-- Restore and place directly into ASM diskgroup
RUN {
  SET NEWNAME FOR DATAFILE 219 TO '+STANDBY_DATA';
  SET NEWNAME FOR DATAFILE 220 TO '+STANDBY_DATA';
  SET NEWNAME FOR DATAFILE 221 TO '+STANDBY_DATA';
  RESTORE DATAFILE 219, 220, 221;
}`} />
            <Note>
              Replace <code>+STANDBY_DATA</code> with your standby ASM diskgroup name.
              If not using ASM, specify the full filesystem path instead.
            </Note>
          </Section>

          <Section title="Step 7 — Catalog New ASM Location & Switch">
            <CodeBlock language="sql" code={`-- Catalog the newly restored files from ASM
CATALOG START WITH '+STANDBY_DATA/<db_unique_name>/datafile/' NOPROMPT;

-- Switch the standby control file to use the new file locations
SWITCH DATABASE TO COPY;`} />
          </Section>

          <Section title="Step 8 — Re-enable File Management & Restart MRP">
            <CodeBlock language="sql" code={`-- Re-enable automatic standby file management
ALTER SYSTEM SET standby_file_management=AUTO SCOPE=BOTH SID='*';

-- Start MRP
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;`} />
          </Section>

          <Section title="Step 9 — Verify MRP Is Applying">
            <CodeBlock language="sql" code={`-- Confirm MRP is running and the new datafile is no longer blocking
SELECT process, status, thread#, sequence#
FROM v$managed_standby;

-- Confirm the datafile is now known to standby
SELECT file#, name, status FROM v$datafile WHERE file# IN (219, 220, 221);

-- Check for any remaining archive gap
SELECT thread#, low_sequence#, high_sequence# FROM v$archive_gap;`} />
          </Section>

          <Section title="Prevention — Set STANDBY_FILE_MANAGEMENT=AUTO">
            <p>
              The root cause of this issue is often <code>STANDBY_FILE_MANAGEMENT=MANUAL</code> or
              network disruption at the time of file creation. To prevent it:
            </p>
            <CodeBlock language="sql" code={`-- On PRIMARY and STANDBY — keep this AUTO
ALTER SYSTEM SET standby_file_management=AUTO SCOPE=BOTH SID='*';

-- Verify
SHOW PARAMETER standby_file_management;`} />
            <Note>
              With <code>AUTO</code>, when a new datafile is created on primary, Oracle automatically
              creates a placeholder on the standby and MRP writes data to it as archived logs are applied.
            </Note>
          </Section>

          <Section title="Alternative — Create Placeholder Manually on Standby">
            <p>If you prefer not to restore from backup for small files:</p>
            <CodeBlock language="sql" code={`-- On STANDBY: manually create the placeholder datafile
-- Oracle will write the real data as MRP applies archive logs
ALTER DATABASE CREATE DATAFILE
  '/path/on/standby/unknown_219.dbf'   -- the path showing in alert log
AS '+STANDBY_DATA';                     -- actual target location`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · Standby · RMAN · Datafile · MOS 1531031.1</span>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-3 pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">{title}</h2>
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
