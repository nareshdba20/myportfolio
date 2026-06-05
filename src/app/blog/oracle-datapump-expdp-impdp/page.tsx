import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Oracle Data Pump expdp/impdp — Naresh Gowda",
  description:
    "Complete guide to Oracle Data Pump for table and schema-level export and import — parameter files, directory setup, parallel export, tablespace verification, and schema remapping.",
};

export default function OracleDataPump() {
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
            Oracle Data Pump (expdp/impdp) — Table & Schema Export/Import Guide
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Complete guide to Oracle Data Pump for table and schema-level export/import between environments —
            covers directory setup, parameter files, parallel export, tablespace verification, and schema remapping.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="Step 1 — Discover Source & Target Details">
            <p>Before starting, confirm the source (CMO) and target (FMO) database details:</p>
            <CodeBlock language="sql" code={`-- Check DB name, unique name, and role
SELECT name, db_unique_name, database_role, open_mode FROM v$database;

-- Check DB version
SELECT version FROM v$instance;

-- Verify TNS connectivity from both sides
-- Source: tnsping <target_service>
-- Target: tnsping <source_service>`} />
          </Section>

          <Section title="Step 2 — Identify Schema & Table Sizes">
            <p>Measure what you are exporting before starting — avoids storage surprises:</p>
            <CodeBlock language="sql" code={`-- Schema segment size breakdown (useful for multi-schema exports)
SELECT
  ROUND(SUM(bytes)/1024/1024/1024, 2) AS size_GB,
  segment_type,
  owner
FROM dba_segments
WHERE owner IN (
  'HP_PROV_PUB',
  'HP_PROV_SUBSCRIPTIONS',
  'HP_PROV_OUTBOUND_CONFIG',
  'HP_PROV_HOST_CONFIG'
)
GROUP BY segment_type, owner
ORDER BY size_GB DESC;

-- Check if specific tables exist and which schemas own them
SELECT owner, table_name
FROM dba_tables
WHERE table_name IN ('RESELLER','RSLR_CONTRACT_XREF','WEB_RESELLER_HIERARCHY');

-- Total size of a specific schema
SELECT ROUND(SUM(bytes)/1024/1024/1024, 3) "Size in GB"
FROM dba_segments
WHERE owner = 'YOUR_SCHEMA';`} />
            <Note>Always get the size before export — Data Pump dump files can be 1.5–3× the actual data size before compression.</Note>
          </Section>

          <Section title="Step 3 — Set Up Data Pump Directory">
            <p>Data Pump requires an Oracle directory object pointing to a valid OS path:</p>
            <CodeBlock language="sql" code={`-- View existing directories
SET LINES 1234 PAGES 1234
COL owner FORMAT A20
COL DIRECTORY_NAME FORMAT A25
COL DIRECTORY_PATH FORMAT A70
SELECT owner, directory_name, directory_path
FROM dba_directories
ORDER BY owner, directory_name;

-- Create a new directory (as SYSDBA)
CREATE OR REPLACE DIRECTORY DATA_PUMP_DIR AS '/oracle/backup/datapump/';
CREATE OR REPLACE DIRECTORY PUMP_DIR      AS '/oracle/arch/datapump/';

-- Grant access to the schema user if needed
GRANT READ, WRITE ON DIRECTORY DATA_PUMP_DIR TO your_schema_user;`} />
            <Note>The OS directory must exist and be writable by the <code>oracle</code> OS user before creating the directory object.</Note>
          </Section>

          <Section title="Step 4 — Export Tables (expdp)">
            <p>Create a parameter file for the export, then run with nohup:</p>
            <CodeBlock language="bash" code={`# Create parameter file
vi /tmp/expdp_tables.par`} />
            <CodeBlock language="bash" code={`# expdp_tables.par contents:
directory=DATA_PUMP_DIR
dumpfile=table_backup_%U.dmp
logfile=expdp_tables.log
parallel=4
tables=SCHEMA1.TABLE1,SCHEMA1.TABLE2,SCHEMA2.TABLE3
transform=disable_archive_logging:y`} />
            <CodeBlock language="bash" code={`# Run export in background
nohup expdp '/ as sysdba' parfile=/tmp/expdp_tables.par &

# Monitor progress
tail -f /oracle/backup/datapump/expdp_tables.log`} />
            <Note>
              <code>parallel=4</code> uses 4 workers — match this to available CPU/IO capacity.
              <code>transform=disable_archive_logging:y</code> skips redo generation on the target, significantly speeding up import.
            </Note>
          </Section>

          <Section title="Step 5 — Export Schema (expdp)">
            <CodeBlock language="bash" code={`# Schema-level export parameter file:
directory=DATA_PUMP_DIR
dumpfile=schema_backup_%U.dmp
logfile=expdp_schema.log
parallel=4
schemas=PROV,HP_PROV_PUB,HP_PROV_SUBSCRIPTIONS`} />
            <CodeBlock language="bash" code={`nohup expdp '/ as sysdba' parfile=/tmp/expdp_schema.par &`} />
          </Section>

          <Section title="Step 6 — Import Tables (impdp)">
            <CodeBlock language="bash" code={`# Standard table import
vi /tmp/impdp_tables.par`} />
            <CodeBlock language="bash" code={`# impdp_tables.par contents:
directory=DATA_PUMP_DIR
dumpfile=table_backup_%U.dmp
logfile=impdp_tables.log
parallel=4
tables=PROV.HP_PROV_PUB,PROV.HP_PROV_SUBSCRIPTIONS,PROV.HP_PROV_OUTBOUND_CONFIG,PROV.HP_PROV_HOST_CONFIG`} />
            <CodeBlock language="bash" code={`nohup impdp '/ as sysdba' parfile=/tmp/impdp_tables.par &`} />
          </Section>

          <Section title="Step 7 — Import with Table Truncation">
            <p>When the target table already exists and you want to replace data:</p>
            <CodeBlock language="bash" code={`directory=DATA_PUMP_DIR
dumpfile=table_backup_%U.dmp
logfile=impdp_truncate.log
parallel=4
tables=SCHEMA.TABLE_NAME
TABLE_EXISTS_ACTION=TRUNCATE`} />
            <Note>
              <code>TABLE_EXISTS_ACTION</code> options:
              SKIP (default) → skip existing table,
              REPLACE → drop and recreate,
              TRUNCATE → truncate then load,
              APPEND → insert without checking duplicates.
            </Note>
          </Section>

          <Section title="Step 8 — Import with Schema Remapping">
            <p>When the source and target schema names differ between environments:</p>
            <CodeBlock language="bash" code={`directory=DATA_PUMP_DIR
dumpfile=schema_backup.dmp
logfile=impdp_remap.log
tables=SOURCE_SCHEMA.TABLE_NAME
transform=disable_archive_logging:y
REMAP_SCHEMA=SOURCE_SCHEMA:TARGET_SCHEMA`} />
            <CodeBlock language="bash" code={`nohup impdp '/ as sysdba' parfile=/tmp/impdp_remap.par &`} />
          </Section>

          <Section title="Step 9 — Tablespace Utilization Verification">
            <p>After import, verify tablespace usage has not exceeded capacity:</p>
            <CodeBlock language="sql" code={`-- Complete tablespace utilization report (permanent + temp)
SET COLSEP |
SET LINESIZE 100 PAGES 100 TRIMSPOOL ON NUMWIDTH 14
COL "Name"     FORMAT A25
COL "Size (GB)" FORMAT A15
COL "Used (GB)" FORMAT A15
COL "Free (GB)" FORMAT A15
COL "(Used) %"  FORMAT A15

SELECT d.status "Status",
       d.tablespace_name "Name",
       TO_CHAR(NVL(a.bytes/1024/1024/1024,0),'99,999,990.90') "Size (GB)",
       TO_CHAR(NVL(a.bytes-NVL(f.bytes,0),0)/1024/1024/1024,'99999999.99') "Used (GB)",
       TO_CHAR(NVL(f.bytes/1024/1024/1024,0),'99,999,990.90') "Free (GB)",
       TO_CHAR(NVL((a.bytes-NVL(f.bytes,0))/a.bytes*100,0),'990.00') "(Used) %"
FROM sys.dba_tablespaces d,
     (SELECT tablespace_name, SUM(bytes) bytes FROM dba_data_files GROUP BY tablespace_name) a,
     (SELECT tablespace_name, SUM(bytes) bytes FROM dba_free_space GROUP BY tablespace_name) f
WHERE d.tablespace_name = a.tablespace_name(+)
  AND d.tablespace_name = f.tablespace_name(+)
  AND NOT (d.extent_management LIKE 'LOCAL' AND d.contents LIKE 'TEMPORARY')
UNION ALL
-- Temp tablespaces
SELECT d.status "Status",
       d.tablespace_name "Name",
       TO_CHAR(NVL(a.bytes/1024/1024/1024,0),'99,999,990.90') "Size (GB)",
       TO_CHAR(NVL(t.bytes,0)/1024/1024/1024,'99999999.99') "Used (GB)",
       TO_CHAR(NVL((a.bytes-NVL(t.bytes,0))/1024/1024/1024,0),'99,999,990.90') "Free (GB)",
       TO_CHAR(NVL(t.bytes/a.bytes*100,0),'990.00') "(Used) %"
FROM sys.dba_tablespaces d,
     (SELECT tablespace_name, SUM(bytes) bytes FROM dba_temp_files GROUP BY tablespace_name) a,
     (SELECT tablespace_name, SUM(bytes_cached) bytes FROM v$temp_extent_pool GROUP BY tablespace_name) t
WHERE d.tablespace_name = a.tablespace_name(+)
  AND d.tablespace_name = t.tablespace_name(+)
  AND d.extent_management LIKE 'LOCAL'
  AND d.contents LIKE 'TEMPORARY';`} />
          </Section>

          <Section title="Step 10 — Monitor Data Pump Job Progress">
            <CodeBlock language="sql" code={`-- Check running Data Pump jobs
SELECT owner_name, job_name, operation, job_mode,
       state, degree, attached_sessions
FROM dba_datapump_jobs
WHERE state = 'EXECUTING';

-- Detailed progress (rows processed, elapsed time)
SELECT job_name, operation, job_mode, state,
       TO_CHAR(start_time,'DD-MON-YY HH24:MI:SS') start_time
FROM dba_datapump_jobs;`} />
            <Note>You can also attach to a running job interactively: <code>expdp '/ as sysdba' attach=JOB_NAME</code> — then type <code>status</code> at the Export&gt; prompt.</Note>
          </Section>

          <Section title="Quick Reference — Common Parameter File Options">
            <CodeBlock language="bash" code={`# Full database export
full=Y

# Specific schemas
schemas=SCHEMA1,SCHEMA2

# Specific tables
tables=SCHEMA.TABLE1,SCHEMA.TABLE2

# Exclude statistics (speeds up import)
exclude=STATISTICS

# Compression
compression=ALL

# Encryption
encryption=ALL
encryption_password=<password>

# Remap tablespace on import
REMAP_TABLESPACE=SOURCE_TBS:TARGET_TBS

# Remap schema on import
REMAP_SCHEMA=SOURCE_SCHEMA:TARGET_SCHEMA

# Include only specific object types
include=TABLE:"IN ('TABLE1','TABLE2')"

# Query filter during export
query=SCHEMA.TABLE:"WHERE status='ACTIVE'"

# Network import directly from source DB (no dump file needed)
network_link=SOURCE_DB_LINK`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · Data Pump · expdp · impdp · Migration</span>
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
