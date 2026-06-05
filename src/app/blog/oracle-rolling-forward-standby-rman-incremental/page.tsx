import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Rolling Forward Physical Standby Using RMAN Incremental Backup — Naresh Gowda",
  description:
    "How to roll forward a physical standby that has fallen too far behind primary using RMAN incremental backup — when archive logs are no longer available on primary.",
};

export default function RollingForwardStandby() {
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
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 8 min read</span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Rolling Forward a Physical Standby Using RMAN Incremental Backup
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Reference: Oracle MOS <span className="font-mono text-violet-600 dark:text-violet-400">DocID 836986.1</span>
          </p>
        </div>

        <div className="space-y-1">

          <Section title="Problem Statement">
            <p>
              A physical standby database falls too far behind the primary. The archive logs needed to apply
              are no longer available — either because the primary's FRA was too small, logs were deleted,
              or the standby was down for an extended period.
            </p>
            <p>
              A full rebuild (active duplicate) would take too long. The <strong>incremental backup roll-forward</strong> method
              is faster because it only transfers changed blocks since the standby's current SCN — not the entire database.
            </p>
            <div className="grid grid-cols-2 gap-3 my-3">
              {[
                { label: "Full Rebuild", value: "Transfers entire DB over network", bad: true },
                { label: "Incremental Roll-forward", value: "Transfers only changed blocks since standby SCN", bad: false },
              ].map((c) => (
                <div key={c.label} className={`p-3 rounded-xl border text-xs ${c.bad ? "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300" : "border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>
                  <p className="font-semibold mb-1">{c.label}</p>
                  <p>{c.value}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Step 1 — Get the Standby's Current SCN">
            <p>Connect to the <strong>standby</strong> and capture the SCN to use as the incremental backup start point:</p>
            <CodeBlock language="sql" code={`-- On STANDBY
SELECT current_scn FROM v$database;

-- More precise: minimum SCN across all datafile headers
SELECT MIN(fhscn) FROM x$kcvfh;

-- Note this value — it becomes the FROM SCN for the primary backup
-- Example: 9823746510`} />
          </Section>

          <Section title="Step 2 — Stop MRP on Standby">
            <CodeBlock language="sql" code={`-- On STANDBY
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

-- Confirm MRP has stopped
SELECT process, status FROM v$managed_standby WHERE process LIKE 'MRP%';`} />
          </Section>

          <Section title="Step 3 — Take Incremental Backup on Primary FROM Standby SCN">
            <p>Connect to <strong>primary</strong> and take an incremental backup starting from the standby's SCN:</p>
            <CodeBlock language="bash" code={`# On PRIMARY
rman target /`} />
            <CodeBlock language="sql" code={`-- Replace 9823746510 with the SCN captured from standby in Step 1
BACKUP INCREMENTAL FROM SCN 9823746510
  DATABASE FORMAT '/oracle/backup/rollforward/inc_%U'
  TAG 'STANDBY_ROLLFORWARD';

-- Also backup the current control file
BACKUP CURRENT CONTROLFILE
  FOR STANDBY
  FORMAT '/oracle/backup/rollforward/stby_ctrl_%U';`} />
            <Note>The incremental backup captures only blocks changed since the standby's SCN — much smaller than a full backup for a recent outage.</Note>
          </Section>

          <Section title="Step 4 — Transfer Backup Files to Standby">
            <CodeBlock language="bash" code={`# From PRIMARY, transfer backup pieces to standby server
scp /oracle/backup/rollforward/inc_* \
    oracle@standby-server:/oracle/backup/rollforward/

scp /oracle/backup/rollforward/stby_ctrl_* \
    oracle@standby-server:/oracle/backup/rollforward/`} />
          </Section>

          <Section title="Step 5 — Restore the Standby Control File">
            <p>On <strong>standby</strong>, mount with the new control file from primary:</p>
            <CodeBlock language="bash" code={`# On STANDBY
rman target /

RMAN> SHUTDOWN IMMEDIATE;
RMAN> STARTUP NOMOUNT;`} />
            <CodeBlock language="sql" code={`-- Catalog and restore the standby control file
CATALOG START WITH '/oracle/backup/rollforward/' NOPROMPT;

RESTORE STANDBY CONTROLFILE FROM '/oracle/backup/rollforward/stby_ctrl_xxx';

ALTER DATABASE MOUNT;`} />
          </Section>

          <Section title="Step 6 — Catalog the Incremental Backup">
            <CodeBlock language="sql" code={`-- Catalog the incremental backup pieces transferred from primary
CATALOG START WITH '/oracle/backup/rollforward/' NOPROMPT;`} />
          </Section>

          <Section title="Step 7 — Recover the Standby Using Incremental Backup">
            <CodeBlock language="sql" code={`-- Apply the incremental backup to roll forward the standby
RECOVER DATABASE NOREDO;`} />
            <Note>
              <code>NOREDO</code> tells RMAN to apply only the incremental backup blocks — not to apply archive logs.
              The remaining gap will be closed when MRP starts and archive logs from primary are applied.
            </Note>
          </Section>

          <Section title="Step 8 — Switch Files and Start MRP">
            <CodeBlock language="sql" code={`-- In RMAN: switch database to use cataloged copies if needed
SWITCH DATABASE TO COPY;

-- In SQL*Plus: start MRP to apply archive logs and sync fully
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;`} />
          </Section>

          <Section title="Step 9 — Verify Sync">
            <CodeBlock language="sql" code={`-- Check MRP is running and sequences are applying
SELECT process, status, thread#, sequence#
FROM v$managed_standby;

-- Check for archive gap
SELECT thread#, low_sequence#, high_sequence# FROM v$archive_gap;

-- Compare max applied vs max archived on primary
SELECT MAX(sequence#) FROM v$archived_log WHERE applied='YES';`} />
          </Section>

          <Section title="Key Points">
            <ul>
              <li>This method works for any size of gap — the backup is only as large as the changed blocks</li>
              <li>If the standby is very old (months), a full rebuild might still be faster — evaluate the backup size first</li>
              <li>Always take a <strong>standby control file</strong> backup alongside the incremental — they must match</li>
              <li>After MRP starts, full synchronization may still take time as remaining archive logs are applied</li>
              <li>You can run multiple incremental roll-forwards iteratively to get closer to primary before the final sync</li>
            </ul>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · Standby · RMAN · DataGuard · MOS 836986.1</span>
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
