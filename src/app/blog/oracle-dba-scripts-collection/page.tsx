import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Oracle DBA Scripts Collection — Naresh Gowda",
  description:
    "Practical Oracle DBA shell scripts and SQL queries: standby build automation, archive sync check, space monitoring, RMAN progress, and everyday DBA reference.",
};

export default function OracleDBAScripts() {
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
            <span className="text-xs text-zinc-400 font-mono">May 25, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Oracle DBA Scripts Collection — Standby, Archive Sync, Space & Performance
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            A practical reference of Oracle DBA shell scripts and SQL queries covering standby database build automation,
            archive log sync check, space monitoring, RMAN progress tracking, and everyday DBA tasks.
          </p>
        </div>

        <div className="prose-custom">

          <Section title="1. Automated Standby Build Script (KSH)">
            <p>
              This KSH script automates the Oracle standby database build using RMAN Active Duplicate.
              It accepts the standby SID and primary CMO SID as arguments, sets up the environment,
              runs the duplicate, and sends a status email on completion.
            </p>
            <CodeBlock language="bash" code={`#!/bin/ksh
set -x

display_msg() { echo "------------>>> "$1; }

sendMail() {
  MAIL_TXT="sendMail.txt"
  {
    echo "Subject: Status of STANDBY BUILD script"
    echo "To: dba-team@company.com"
    echo "From: oracle-alerts@company.com"
    echo "MIME-Version: 1.0"
    echo "Content-Type: text/html"
    echo "This is an automated email - please DO NOT reply."
    echo "Standby build script completed. Log: /oracle/backup/\${SID_Name}/duplicate.log"
    lines=$(tail -20 /oracle/backup/\${SID_Name}/duplicate.log)
    echo "\${lines}"
  } > $MAIL_TXT
  cat $MAIL_TXT | /usr/sbin/sendmail -t
  [[ $? -eq 0 ]] && display_msg "mail sent" || display_msg "something went wrong"
}`} />
            <CodeBlock language="bash" code={`# ---- MAIN ----
SID_Name=$1
CMO_DB_Name=$2

export ORACLE_SID=\${SID_Name}
ORAHOME=$(cat /home/oracle/scripts/environment/dbtab \\
  | grep -v ^# | grep "\${SID_Name}" | head -1 | awk -F: '{print $3}')

export ORACLE_HOME=$ORAHOME
export PATH=$PATH:$ORACLE_HOME/bin
export LOG=/oracle/backup/\${SID_Name}/duplicate.log

display_msg "ORACLE HOME set to \${ORACLE_HOME}"
echo "Restore started at: $(date)" > $LOG

sqlplus / as sysdba >> $LOG << EOF
  -- pre-checks
  EXIT
EOF

sendMail`} />
            <Note>Always run this as the <code>oracle</code> OS user. Pass SID as $1 and primary DB as $2: <code>sh standbybuild.sh STBYDB PRIMARYDB</code></Note>
          </Section>

          <Section title="2. RMAN Active Duplicate for Standby">
            <p>
              Run RMAN Active Duplicate with multiple channels for parallel data transfer from primary to standby.
            </p>
            <CodeBlock language="bash" code={`export ORACLE_SID=STBYDB
export ORACLE_HOME=/u01/app/oracle/product/11.1.0/db_1
export PATH=$PATH:$ORACLE_HOME/bin
export LOG=/oracle/backup/STBYDB/STBYDB.log

echo "Duplication started at: $(date)" > $LOG

$ORACLE_HOME/bin/rman \\
  target sys/<password>@PRIMARYDB \\
  AUXILIARY sys/<password>@STBYDB >> $LOG << EOF
set echo on;
run {
  allocate channel CH1 type disk;
  allocate channel CH2 type disk;
  allocate channel CH3 type disk;
  allocate channel CH4 type disk;
  allocate auxiliary channel AUX1 type disk;
  allocate auxiliary channel AUX2 type disk;
  allocate auxiliary channel AUX3 type disk;
  allocate auxiliary channel AUX4 type disk;
  DUPLICATE TARGET DATABASE FOR STANDBY
    FROM ACTIVE DATABASE
    DORECOVER
    NOFILENAMECHECK;
}
exit;
EOF`} />
            <Note>Use <code>nohup sh dupstby.cmd &amp;</code> to run in background so it survives terminal disconnection.</Note>
          </Section>

          <Section title="3. Archive Log Sync Check">
            <p>
              Run this script on the standby to verify archive log gap and MRP (Managed Recovery Process) status.
            </p>
            <CodeBlock language="sql" code={`-- Standby database details
SELECT name, created, instance_name, host_name,
       database_role, CURRENT_SCN
FROM v$database, v$instance;

-- Archive gap between primary and standby
SELECT DISTINCT
  ARCH.THREAD#        AS Thread,
  ARCH.SEQUENCE#      AS Last_Received,
  APPL.SEQUENCE#      AS Last_Applied,
  (ARCH.SEQUENCE# - APPL.SEQUENCE#) AS Gap
FROM
  (SELECT THREAD#, MAX(SEQUENCE#) SEQUENCE#
   FROM v$archived_log
   WHERE (THREAD#, FIRST_TIME) IN
     (SELECT THREAD#, MAX(FIRST_TIME) FROM v$archived_log GROUP BY THREAD#)
   GROUP BY THREAD#) ARCH,
  (SELECT THREAD#, MAX(SEQUENCE#) SEQUENCE#
   FROM v$log_history
   WHERE (THREAD#, FIRST_TIME) IN
     (SELECT THREAD#, MAX(FIRST_TIME) FROM v$log_history GROUP BY THREAD#)
   GROUP BY THREAD#) APPL
WHERE ARCH.THREAD# = APPL.THREAD#
ORDER BY 1;

-- MRP process status
SELECT process, status, sequence#, thread#, blocks, block#
FROM gv$managed_standby;

-- Last applied and received time
SELECT 'Last Applied : ' label,
       TO_CHAR(next_time,'DD-MON-YY HH24:MI:SS') time
FROM v$archived_log
WHERE sequence# = (SELECT MAX(sequence#) FROM v$archived_log WHERE applied='YES')
UNION
SELECT 'Last Received: ',
       TO_CHAR(next_time,'DD-MON-YY HH24:MI:SS')
FROM v$archived_log
WHERE sequence# = (SELECT MAX(sequence#) FROM v$archived_log);

-- Check for archive gap
SELECT thread#, low_sequence#, high_sequence#
FROM v$archive_gap;

-- Data Guard status messages
SELECT message FROM gv$dataguard_status;`} />
          </Section>

          <Section title="4. MRP Control Commands">
            <CodeBlock language="sql" code={`-- Stop MRP
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE CANCEL;

-- Start MRP (disconnect from session)
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;`} />
          </Section>

          <Section title="5. OS Space Check">
            <CodeBlock language="bash" code={`# Human-readable filesystem usage
df -Pk | awk '{ if (NR==1){next}
  if (NF==6){print}
  if (NF==1){getline record; $0=$0 record; print $0}
}' | awk '
BEGIN {
  print "Filesystem                    Mount Point        Total GB   Avail GB   Used GB   Used%"
  print "---------------------------------------------------------------------------------------------"
}
/dev/ {
  printf ("%-30s %-18s %10.2f %10.2f %10.2f %4.0f%%\\n",
    $1,$6,$2/1024/1024,$4/1024/1024,$3/1024/1024,$5)
}'

# Top 10 largest directories under Oracle backup location
du -a /oracle/backup | sort -n -r | head -n 10`} />
          </Section>

          <Section title="6. RMAN Backup Progress Monitoring">
            <CodeBlock language="sql" code={`-- Real-time RMAN progress
SELECT sid, serial#, context, sofar, totalwork,
       ROUND(sofar/totalwork*100, 2) "% Complete",
       TO_CHAR(sysdate, 'DD-MON-YY HH24:MI') current_time
FROM v$session_longops
WHERE opname LIKE 'RMAN%'
  AND opname NOT LIKE '%aggregate%'
  AND totalwork != 0
  AND sofar <> totalwork;

-- RMAN job history
SELECT session_key, input_type, status,
       TO_CHAR(start_time, 'mm-dd-yyyy hh24:mi:ss')  start_time,
       TO_CHAR(end_time,   'mm-dd-yyyy hh24:mi:ss')  end_time,
       elapsed_seconds/3600 hours
FROM v$rman_backup_job_details
ORDER BY session_key;`} />
          </Section>

          <Section title="7. Discovery Queries">
            <CodeBlock language="sql" code={`-- Total DB size
SELECT SUM(bytes)/1024/1024/1024 size_GB FROM dba_segments;

-- ASM diskgroup space
SELECT name,
       ROUND(total_mb/1024, 2) total_GB,
       ROUND(free_mb/1024, 2)  free_GB,
       ROUND(free_mb/total_mb*100) "FREE%"
FROM v$asm_diskgroup;

-- Character set
SELECT * FROM nls_database_parameters WHERE parameter = 'NLS_CHARACTERSET';`} />
          </Section>

          <Section title="8. Tablespace & Datafile Queries">
            <CodeBlock language="sql" code={`-- Tablespace usage with file breakdown
SELECT df.tablespace_name,
       df.file_name,
       ROUND(df.bytes/1024/1024)      total_MB,
       NVL(ROUND(ext.used_bytes/1024/1024), 0) used_MB,
       NVL(ROUND(free.free_bytes/1024/1024), 0) free_MB,
       NVL(ROUND(free.free_bytes/df.bytes*100), 0) free_pct,
       df.autoextensible
FROM dba_data_files df
LEFT JOIN (SELECT file_id, SUM(bytes) used_bytes FROM dba_extents GROUP BY file_id) ext
  ON df.file_id = ext.file_id
LEFT JOIN (SELECT file_id, SUM(bytes) free_bytes FROM dba_free_space GROUP BY file_id) free
  ON df.file_id = free.file_id
ORDER BY df.tablespace_name, df.file_name;

-- Tablespace read/write mode
SELECT tablespace_name, status FROM dba_tablespaces;

-- TEMP tablespace usage
SELECT tablespace_name, bytes/1024/1024 size_MB,
       bytes_used/1024/1024 used_MB, bytes_free/1024/1024 free_MB
FROM sys.v_$temp_space_header, v$tempfile;`} />
          </Section>

          <Section title="9. Schema Size Queries">
            <CodeBlock language="sql" code={`-- All schemas sorted by size
SELECT owner, ROUND(SUM(bytes)/1024/1024/1024, 2) schema_size_GB
FROM dba_segments
GROUP BY owner
ORDER BY 2 DESC;

-- Specific schema size
SELECT owner, ROUND(SUM(bytes)/1024/1024/1024, 2) schema_size_GB
FROM dba_segments
WHERE owner = 'YOUR_SCHEMA'
GROUP BY owner;

-- Largest tables in DB
SELECT * FROM (
  SELECT segment_name, segment_type,
         ROUND(bytes/1024/1024/1024, 2) size_GB,
         tablespace_name
  FROM dba_segments
  WHERE segment_type = 'TABLE'
  ORDER BY 3 DESC
) WHERE ROWNUM <= 10;`} />
          </Section>

          <Section title="10. Running Sessions & Active SQL">
            <CodeBlock language="sql" code={`-- Active sessions with SQL text
SELECT s.sid, s.username, s.status,
       q.optimizer_mode, q.cpu_time, q.elapsed_time,
       SUBSTR(q.sql_text, 1, 100) sql_text
FROM gv$sqlarea q
JOIN gv$session s
  ON s.sql_hash_value = q.hash_value
 AND s.sql_address    = q.address
WHERE s.username IS NOT NULL;

-- I/O per session
SELECT io.sid, io.block_gets, io.consistent_gets,
       io.physical_reads, io.block_changes
FROM v$sess_io io
JOIN v$session s ON s.sid = io.sid
WHERE s.username IS NOT NULL;`} />
          </Section>

          <Section title="11. DB Growth Rate">
            <CodeBlock language="sql" code={`SELECT
  (SELECT name FROM v$database) "DB Name",
  ROUND(SUM(used.bytes)/1024/1024, 2) || ' MB' "Total Size",
  ROUND(SUM(used.bytes)/1024/1024 - free.p/1024/1024, 2) || ' MB' "Used",
  ROUND(free.p/1024/1024, 2) || ' MB' "Free",
  ROUND((SUM(used.bytes)/1024/1024)
    / (SELECT sysdate - MIN(creation_time) FROM v$datafile), 2)
    || ' MB/day' "Daily Growth"
FROM (
  SELECT bytes FROM v$datafile
  UNION ALL SELECT bytes FROM v$tempfile
  UNION ALL SELECT bytes FROM v$log
) used,
(SELECT SUM(bytes) AS p FROM dba_free_space) free
GROUP BY free.p;`} />
          </Section>

          <Section title="12. FRA (Flash Recovery Area) Usage">
            <CodeBlock language="sql" code={`-- FRA usage by file type
SELECT file_type, percent_space_used, percent_space_reclaimable, number_of_files
FROM v$recovery_area_usage
ORDER BY 1;

-- FRA size and used
SELECT name,
       ROUND(space_limit/1024/1024, 0)  size_MB,
       ROUND(space_used/1024/1024, 0)   used_MB,
       DECODE(NVL(space_used,0), 0, 0,
         ROUND(space_used/space_limit*100)) pct_used
FROM v$recovery_file_dest;`} />
          </Section>

          <Section title="13. Duplicate Datafile Check">
            <CodeBlock language="sql" code={`-- Find duplicate datafile names (different paths, same filename)
SELECT SUBSTR(file_name, INSTR(file_name,'/',-1)) file_name, COUNT(*)
FROM dba_data_files
GROUP BY SUBSTR(file_name, INSTR(file_name,'/',-1))
HAVING COUNT(*) > 1;

-- Get full path of duplicate files
SELECT file_name, status, tablespace_name
FROM dba_data_files
WHERE SUBSTR(file_name, INSTR(file_name,'/',-1)) IN (
  SELECT SUBSTR(file_name, INSTR(file_name,'/',-1))
  FROM dba_data_files
  GROUP BY SUBSTR(file_name, INSTR(file_name,'/',-1))
  HAVING COUNT(*) > 1
);`} />
          </Section>

          <Section title="14. RAC Cluster Commands">
            <CodeBlock language="bash" code={`# Check cluster resource status
crsctl stat res -t

# Database operations
srvctl status database -d PRODDB
srvctl start  database -d PRODDB
srvctl stop   database -d PRODDB
srvctl start  database -d PRODDB -o mount

# Instance level
srvctl start instance -d PRODDB -i PRODDB1
srvctl stop  instance -d PRODDB -i PRODDB1

# ASM disk check
oracleasm querydisk -d DISK_NAME

# ASM diskgroup space
SELECT name,
       ROUND(total_mb/1024, 2) total_GB,
       ROUND(free_mb/1024, 2)  free_GB,
       ROUND(free_mb/total_mb*100) "FREE%"
FROM v$asm_diskgroup
WHERE name LIKE '%DATA%';`} />
          </Section>

          <Section title="15. SGA / PGA Tuning">
            <CodeBlock language="sql" code={`-- Show current SGA settings
SHOW PARAMETER sga;

-- Modify SGA
ALTER SYSTEM SET sga_target   = 2G;
ALTER SYSTEM SET sga_max_size = 2G SCOPE=SPFILE;

-- Show and modify PGA
SHOW PARAMETER pga;
ALTER SYSTEM SET pga_aggregate_target = 1G;`} />
          </Section>

          <Section title="16. Archive Location from Primary">
            <CodeBlock language="sql" code={`-- Find specific archive log files on primary
SELECT name FROM v$archived_log
WHERE thread# = 1
  AND dest_id  = 1
  AND sequence# BETWEEN 460 AND 464;

-- Current archive max sequence
SELECT MAX(sequence#) FROM v$archived_log;

-- Applied sequences per thread
SELECT thread#, MAX(sequence#) applied_seq
FROM v$archived_log
WHERE applied = 'YES'
GROUP BY thread#;`} />
          </Section>

          <Section title="17. User Management">
            <CodeBlock language="sql" code={`-- Find user details
SELECT username, created, account_status, profile,
       lock_date, expiry_date
FROM dba_users
WHERE username LIKE UPPER('%&user_name%');

-- Object count per owner
SELECT owner, object_type, COUNT(*)
FROM dba_objects
WHERE owner = 'YOUR_SCHEMA'
GROUP BY owner, object_type
ORDER BY owner, object_type;`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · RAC · RMAN · DBA · Scripts</span>
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
