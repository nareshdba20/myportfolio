import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Oracle Standby Database Rebuild Using RMAN — Naresh Gowda",
  description:
    "Step-by-step procedure to rebuild an Oracle physical standby database using RMAN — restoring the control file from primary, cataloging ASM datafiles, recovering from service, and resizing standby redo logs.",
};

export default function OracleStandbyRebuild() {
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
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 10 min read</span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Oracle Standby Database Rebuild Using RMAN — Control File Restore & Recovery
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Step-by-step procedure to rebuild an Oracle physical standby when it falls too far behind primary
            or after a control file issue — using RMAN to restore the control file from primary,
            catalog existing ASM datafiles, recover from service, and recreate standby redo logs.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="When to Use This Procedure">
            <p>Rebuild the standby when:</p>
            <ul>
              <li>Standby has fallen behind primary and archive gap is too large to recover normally</li>
              <li>Control file is corrupted or out of sync with primary</li>
              <li>After adding large datafiles on primary that the standby cannot receive via MRP</li>
              <li>Standby redo log size mismatch causing MRP failures</li>
            </ul>
          </Section>

          <Section title="Step 1 — Check Current SCN & Stop MRP">
            <CodeBlock language="sql" code={`-- Check current SCN on primary
SELECT current_scn FROM v$database;

-- Check minimum SCN across all datafile headers (on standby)
SELECT MIN(fhscn) FROM x$kcvfh;

-- MRP process status before stopping
SELECT process, status, thread#, sequence#, blocks, block#
FROM v$managed_standby;`} />
            <CodeBlock language="sql" code={`-- Stop MRP process
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

-- Temporarily set file management to MANUAL
ALTER SYSTEM SET standby_file_management=MANUAL SCOPE=BOTH SID='*';`} />
          </Section>

          <Section title="Step 2 — Restore Standby Control File from Primary">
            <p>Connect via RMAN and restore a fresh control file directly from the primary:</p>
            <CodeBlock language="bash" code={`rman target /

RMAN> SHUTDOWN IMMEDIATE;
RMAN> STARTUP NOMOUNT;

RMAN> RUN {
  ALLOCATE CHANNEL t1 TYPE DISK;
  RESTORE STANDBY CONTROLFILE FROM SERVICE sfdcp_DGMGRL;
}

RMAN> ALTER DATABASE MOUNT;`} />
            <Note>This pulls the current primary control file over the network — no dump file required. Requires the DGMGRL TNS service to be reachable.</Note>
          </Section>

          <Section title="Step 3 — Handle FRA Conflicts">
            <p>If the FRA (Flash Recovery Area) path in the restored control file conflicts with current settings, temporarily clear it:</p>
            <CodeBlock language="sql" code={`-- Check current FRA settings
SHOW PARAMETER db_recovery_file_dest;

-- Temporarily clear FRA to avoid path conflicts
ALTER SYSTEM SET db_recovery_file_dest='' SCOPE=BOTH SID='*';`} />
            <Note>You will restore this setting after recovery is complete.</Note>
          </Section>

          <Section title="Step 4 — Catalog Existing Datafiles from ASM">
            <p>Tell RMAN about datafiles already on the standby ASM diskgroup — avoids copying all data from scratch:</p>
            <CodeBlock language="bash" code={`# Run catalog in background (can take time for large databases)
nohup rman target / \
  cmdfile='/oracle/backup/standby_rebuild/catalog.rcv' \
  log='/oracle/backup/standby_rebuild/catalog.log' &

# catalog.rcv contents:
CATALOG START WITH '+SFDCP_DATA/SFDCS/DATAFILE/' NOPROMPT;`} />
            <Note>This registers the existing standby datafiles with the new control file. Without this step, RMAN would try to restore all datafiles from primary — massively increasing recovery time for large databases.</Note>
          </Section>

          <Section title="Step 5 — Switch Database to Use Cataloged Copies">
            <CodeBlock language="sql" code={`-- Switch all datafiles to use the cataloged copies
-- (run this in RMAN after catalog completes)
SWITCH DATABASE TO COPY;`} />
          </Section>

          <Section title="Step 6 — Recover from Primary Service">
            <p>Recover the standby to catch up with primary using RMAN's recover from service. Use many channels for a large/busy database:</p>
            <CodeBlock language="bash" code={`nohup rman target / \
  cmdfile='/oracle/backup/standby_rebuild/recover.rcv' \
  log='/oracle/backup/standby_rebuild/recover.log' &

# recover.rcv contents:
RUN {
  ALLOCATE CHANNEL prmy1  TYPE DISK;
  ALLOCATE CHANNEL prmy2  TYPE DISK;
  ALLOCATE CHANNEL prmy3  TYPE DISK;
  ALLOCATE CHANNEL prmy4  TYPE DISK;
  ALLOCATE CHANNEL prmy5  TYPE DISK;
  ALLOCATE CHANNEL prmy6  TYPE DISK;
  ALLOCATE CHANNEL prmy7  TYPE DISK;
  ALLOCATE CHANNEL prmy8  TYPE DISK;
  ALLOCATE CHANNEL prmy9  TYPE DISK;
  ALLOCATE CHANNEL prmy10 TYPE DISK;
  ALLOCATE CHANNEL prmy11 TYPE DISK;
  ALLOCATE CHANNEL prmy12 TYPE DISK;
  ALLOCATE CHANNEL prmy13 TYPE DISK;
  ALLOCATE CHANNEL prmy14 TYPE DISK;
  ALLOCATE CHANNEL prmy15 TYPE DISK;
  ALLOCATE CHANNEL prmy16 TYPE DISK;
  ALLOCATE CHANNEL prmy17 TYPE DISK;
  ALLOCATE CHANNEL prmy18 TYPE DISK;
  ALLOCATE CHANNEL prmy19 TYPE DISK;
  ALLOCATE CHANNEL prmy20 TYPE DISK;
  RECOVER DATABASE FROM SERVICE sfdcp_DGMGRL
    NOREDO
    USING COMPRESSED BACKUPSET;
}`} />
            <Note>
              <code>NOREDO</code> means only datafile blocks are transferred — redo is applied later by MRP.
              <code>USING COMPRESSED BACKUPSET</code> reduces network transfer significantly.
              Monitor <code>recover.log</code> for progress.
            </Note>
          </Section>

          <Section title="Step 7 — Restore FRA Setting">
            <CodeBlock language="sql" code={`-- Restore FRA after recovery completes
ALTER SYSTEM SET db_recovery_file_dest='+SFDCP_RECO' SCOPE=BOTH SID='*';

SHOW PARAMETER db_recovery_file_dest;`} />
          </Section>

          <Section title="Step 8 — Drop & Recreate Standby Redo Logs">
            <p>
              After rebuilding, standby redo logs may have the wrong size or be on incorrect diskgroups.
              Drop all and recreate with the correct size (must be <strong>≥ primary redo log size</strong>):
            </p>
            <CodeBlock language="sql" code={`-- First stop MRP if still running
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

-- Check existing SRL groups
SELECT group#, dbid, thread#, sequence#, status FROM v$standby_log;

-- Clear and drop (if DROP alone fails due to active state, clear first)
ALTER DATABASE CLEAR LOGFILE GROUP 19;
ALTER DATABASE DROP STANDBY LOGFILE GROUP 19;
-- Repeat for groups 20-42

-- Verify all removed
SELECT group#, status FROM v$standby_log;`} />
            <CodeBlock language="sql" code={`-- Recreate at correct size (2G shown — match your primary redo size or larger)
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 19 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 20 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 21 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 22 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 23 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 24 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 25 SIZE 2G;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 26 SIZE 2G;
-- Continue for threads 3-6 (groups 27-42)`} />
          </Section>

          <Section title="Step 9 — Re-enable File Management & Start MRP">
            <CodeBlock language="sql" code={`-- Re-enable automatic standby file management
ALTER SYSTEM SET standby_file_management=AUTO SCOPE=BOTH SID='*';

-- Start MRP
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;`} />
          </Section>

          <Section title="Step 10 — Verify Sync">
            <CodeBlock language="sql" code={`-- MRP process and sequence status
SELECT process, status, thread#, sequence#, blocks, block#
FROM v$managed_standby;

-- Data Guard status messages
SELECT message FROM v$dataguard_status;

-- Check for archive gap
SELECT thread#, low_sequence#, high_sequence# FROM gv$archive_gap;

-- Archive destination errors on Primary
SELECT status, error FROM v$archive_dest WHERE dest_id IN (1,2,3,4);`} />
          </Section>

          <Section title="Bonus — Restore Specific Datafiles Only">
            <p>
              When only a few datafiles are missing or corrupt on the standby (not a full rebuild),
              use incremental backup and restore for just those files:
            </p>
            <CodeBlock language="sql" code={`-- Step A: On Primary — backup the specific datafiles
BACKUP DATAFILE 219, 220, 221
  FORMAT '/oracle/backup/incremental/ForStandby_%U'
  TAG 'FORSTANDBY';`} />
            <CodeBlock language="bash" code={`# Step B: Transfer the backup pieces to standby
scp /oracle/backup/incremental/ForStandby_* \
    oracle@standby-server:/oracle/backup/incremental/`} />
            <CodeBlock language="sql" code={`-- Step C: On Standby — catalog the backup pieces
CATALOG START WITH '/oracle/backup/incremental/' NOPROMPT;

-- Step D: Restore and rename to ASM
RUN {
  SET NEWNAME FOR DATAFILE 219 TO '+SFDCP_DATA';
  SET NEWNAME FOR DATAFILE 220 TO '+SFDCP_DATA';
  SET NEWNAME FOR DATAFILE 221 TO '+SFDCP_DATA';
  RESTORE DATAFILE 219, 220, 221;
}

-- Step E: Catalog new ASM location
CATALOG START WITH '+SFDCP_DATA/<db_unique_name>/datafile/';

-- Step F: Switch to use the newly restored files
SWITCH DATABASE TO COPY;`} />
            <Note>This targeted approach is much faster than a full rebuild when only a few datafiles are affected. Useful for adding new tablespaces that the standby did not receive.</Note>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · Standby · RMAN · DataGuard · Rebuild</span>
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
