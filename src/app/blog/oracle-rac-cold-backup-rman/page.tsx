import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Oracle RAC Cold Backup Using RMAN — Naresh Gowda",
  description:
    "A complete step-by-step guide to taking a cold backup on an Oracle RAC cluster using RMAN — shutdown, mount, compressed backup, controlfile, SPFILE, and pfile creation.",
};

export default function OracleRACColdBackup() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-xs font-medium border border-orange-200 dark:border-orange-500/20">
              <Tag size={10} /> Oracle
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
              <Clock size={11} /> 6 min read
            </span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Oracle RAC Cold Backup Using RMAN — Step by Step
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            A complete walkthrough of taking a cold (offline) backup on an Oracle RAC cluster using RMAN.
            Covers shutdown, mount state, compressed backupset, controlfile copy, SPFILE backup, and pfile creation.
          </p>
        </div>

        <div className="prose-custom">

          <Section title="Overview">
            <p>
              A <strong>cold backup</strong> (offline backup) means backing up Oracle database files while the database is in <code>MOUNT</code> state — not open to users.
              This guarantees data consistency since no transactions are running during the backup.
            </p>
            <p>
              In a RAC (Real Application Clusters) environment, you shut down all instances but keep <strong>one instance in mount mode</strong> to perform the RMAN backup.
            </p>
          </Section>

          <Section title="Environment">
            <ul>
              <li>Oracle RAC — 6-node cluster</li>
              <li>NFS mount for backup storage (verify sufficient space with <code>df -h</code> beforehand)</li>
              <li>RMAN backup utility</li>
              <li>OS: RHEL / HP-UX</li>
            </ul>
          </Section>

          <Section title="Step 1 — Check Available Space">
            <p>Before starting, verify the NFS backup mount has sufficient free space.</p>
            <CodeBlock language="bash" code={`df -h
# Confirm NFS backup location is mounted and has enough space
# Example: 15T total, 8.8T free is healthy for this operation`} />
          </Section>

          <Section title="Step 2 — Create Backup Directory">
            <CodeBlock language="bash" code={`# Create working directory on local node
mkdir -p /tmp/fmo_coldbkp
chmod 777 /tmp/fmo_coldbkp
cd /tmp/fmo_coldbkp`} />
            <Note>Create this directory on the node where you will run RMAN from.</Note>
          </Section>

          <Section title="Step 3 — Shutdown the Database">
            <p>Switch to the target database and perform a clean shutdown.</p>
            <CodeBlock language="bash" code={`# Connect as SYSDBA
sqlplus / as sysdba`} />
            <CodeBlock language="sql" code={`SHUTDOWN IMMEDIATE;

-- Bring to mount state (files closed, not open)
STARTUP MOUNT;

EXIT;`} />
          </Section>

          <Section title="Step 4 — Stop All Instances, Start One in Mount">
            <p>In RAC, stop the entire database cluster, then start just one instance in mount mode for RMAN.</p>
            <CodeBlock language="bash" code={`# Stop all RAC instances
srvctl stop database -d PRODDB -f

# Start only node3 instance in MOUNT mode
srvctl start instance -d PRODDB -i PRODDB3 -o mount`} />
            <p>Verify instance status — only one should be running:</p>
            <CodeBlock language="bash" code={`# Expected output:
Instance PRODDB1 is not running on node1
Instance PRODDB2 is not running on node2
Instance PRODDB3 is running on node3     ← backup node
Instance PRODDB4 is not running on node4
Instance PRODDB5 is not running on node5
Instance PRODDB6 is not running on node6`} />
            <Note>Only one instance in mount state is sufficient for RMAN to access all datafiles in a RAC cluster via shared storage (ASM).</Note>
          </Section>

          <Section title="Step 5 — Connect to RMAN">
            <CodeBlock language="bash" code={`rman target /`} />
          </Section>

          <Section title="Step 6 — Backup the Full Database (Compressed)">
            <p>Take a compressed backupset of all datafiles. Compressed backupsets significantly reduce storage usage.</p>
            <CodeBlock language="sql" code={`RMAN> BACKUP AS COMPRESSED BACKUPSET DATABASE
  FORMAT '/oracle/backup/FMO_COLD_BKP/%u'
  TAG 'FRESHDB';`} />
            <p>RMAN will process all tablespaces — SYSTEM, SYSAUX, TOOLS, and all UNDO tablespaces (one per RAC instance):</p>
            <CodeBlock language="bash" code={`Starting backup at 25-JUL-2022
allocated channel: ORA_DISK_1
channel ORA_DISK_1: starting compressed full datafile backup set
input datafile file number=00001 name=+PRODDB_DATA/DATAFILE/system.dbf
input datafile file number=00002 name=+PRODDB_DATA/DATAFILE/sysaux.dbf
input datafile file number=00003 name=+PRODDB_DATA/DATAFILE/sys_undots.dbf
input datafile file number=00004 name=+PRODDB_DATA/DATAFILE/tools.dbf
input datafile file number=00005 name=+PRODDB_DATA/DATAFILE/undo01.dbf
input datafile file number=00006 name=+PRODDB_DATA/DATAFILE/undo02.dbf
...
channel ORA_DISK_1: backup set complete, elapsed time: 00:00:46
Finished backup at 25-JUL-2022`} />
          </Section>

          <Section title="Step 7 — Backup the Control File">
            <CodeBlock language="sql" code={`RMAN> BACKUP AS COPY CURRENT CONTROLFILE
  FORMAT '/oracle/backup/FMO_COLD_BKP/controlfile_PRODDB_copy.ctl';`} />
          </Section>

          <Section title="Step 8 — Backup the SPFILE">
            <CodeBlock language="sql" code={`RMAN> BACKUP AS COPY SPFILE
  FORMAT '/oracle/backup/FMO_COLD_BKP/snapcf_spfile_PRODDB.bck';`} />
          </Section>

          <Section title="Step 9 — Additional Control File Backup">
            <CodeBlock language="sql" code={`RMAN> BACKUP CURRENT CONTROLFILE
  FORMAT '/oracle/backup/FMO_COLD_BKP/control_PRODDB.bck';`} />
            <Note>Taking both a copy and a standard backup of the controlfile gives you two recovery paths — always good practice for critical databases.</Note>
          </Section>

          <Section title="Step 10 — Create PFILE from SPFILE">
            <p>Exit RMAN and create a text-based parameter file as an additional safety measure.</p>
            <CodeBlock language="bash" code={`sqlplus / as sysdba`} />
            <CodeBlock language="sql" code={`CREATE PFILE='/oracle/backup/FMO_COLD_BKP/pfile_PRODDB_25Jul2022.ora'
  FROM SPFILE;

-- Output: File created.`} />
          </Section>

          <Section title="Step 11 — Open the Database">
            <CodeBlock language="sql" code={`ALTER DATABASE OPEN;`} />
            <CodeBlock language="bash" code={`# Start all RAC instances
srvctl start database -d PRODDB`} />
          </Section>

          <Section title="Step 12 — Verify Backup Files">
            <CodeBlock language="bash" code={`ls -ltr /oracle/backup/FMO_COLD_BKP/`} />
            <p>Expected output — confirm all files are present and non-zero:</p>
            <CodeBlock language="bash" code={`-rw-r----- oracle dba   72278016  backupset_piece
-rw-r----- oracle dba   18857984  controlfile_PRODDB_copy.ctl
-rw-r----- oracle dba     114688  snapcf_spfile_PRODDB.bck
-rw-r----- oracle dba   18939904  control_PRODDB.bck
-rw-r--r-- oracle dba       2509  pfile_PRODDB_25Jul2022.ora`} />
          </Section>

          <Section title="Key Takeaways">
            <ul>
              <li>Always use <code>SHUTDOWN IMMEDIATE</code> — never <code>SHUTDOWN ABORT</code> before a cold backup</li>
              <li>In RAC, only <strong>one instance in MOUNT state</strong> is needed — RMAN accesses shared ASM storage</li>
              <li>Use <strong>TAG</strong> on backups (e.g., <code>FRESHDB</code>) for easy identification during restore/recovery</li>
              <li><strong>COMPRESSED BACKUPSET</strong> can reduce backup size by 40–70% depending on data</li>
              <li>Always back up <strong>controlfile + SPFILE separately</strong> — critical for complete database recovery</li>
              <li>Creating a <strong>PFILE</strong> from SPFILE gives a human-readable parameter backup</li>
            </ul>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · RAC · RMAN · Backup</span>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/50">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto bg-zinc-50 dark:bg-zinc-900/60">
        <code className="text-xs font-mono text-zinc-800 dark:text-zinc-300 leading-relaxed whitespace-pre">
          {code}
        </code>
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
