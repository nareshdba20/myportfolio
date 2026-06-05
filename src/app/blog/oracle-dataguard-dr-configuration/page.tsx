import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Oracle Data Guard DR Configuration — Naresh Gowda",
  description:
    "Complete guide to setting up Oracle Data Guard with Far Sync and COLO2 DR for a 6-node RAC cluster — Primary, Local HA, COLO2 Standby, Far Sync, and DG Broker configuration.",
};

export default function OracleDGConfig() {
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
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 15 min read</span>
            <span className="text-xs text-zinc-400 font-mono">May 29, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Oracle Data Guard DR Configuration — Primary, Local HA, COLO2 & Far Sync
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            End-to-end configuration of Oracle Data Guard for a 6-node RAC cluster with Far Sync and COLO2 DR.
            Covers all four roles: Primary (P), Local HA Standby (S), COLO2 DR Standby (R), and Far Sync (F).
          </p>
        </div>

        <div className="space-y-1">

          {/* Architecture */}
          <Section title="Architecture Overview">
            <p>Oracle Data Guard naming convention used throughout this guide:</p>
            <div className="grid grid-cols-2 gap-3 my-3">
              {[
                { badge: "P", label: "Primary", example: "SFDCP", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" },
                { badge: "S", label: "Local HA Standby", example: "SFDCS", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
                { badge: "R", label: "COLO2 DR Standby", example: "SFDCR", color: "bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300" },
                { badge: "F", label: "Far Sync", example: "SFDCF", color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300" },
              ].map((r) => (
                <div key={r.badge} className={`flex items-center gap-3 p-3 rounded-xl border ${r.color} border-current/20`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${r.color}`}>{r.badge}</span>
                  <div>
                    <p className="text-xs font-semibold">{r.label}</p>
                    <p className="text-[10px] opacity-70 font-mono">{r.example}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 my-3">
              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                EE Applications → Far Sync + COLO2 DR<br />
                MC Applications → Far Sync + Local HA DR + COLO2 DR
              </p>
            </div>
          </Section>

          {/* PART A */}
          <SectionHeader label="A" title="Primary Database Configuration" />

          <Section title="A1. Enable Force Logging">
            <CodeBlock language="sql" code={`-- Check current force logging state
SELECT force_logging FROM v$database;

-- Enable if not already ON
ALTER DATABASE ENABLE FORCE LOGGING;`} />
          </Section>

          <Section title="A2. Change SYS Password">
            <CodeBlock language="sql" code={`ALTER USER sys IDENTIFIED BY <SYS_PASSWORD>;`} />
          </Section>

          <Section title="A3. Configure Standby Redo Log Groups">
            <p>First, check existing online redo log sizes to match standby redo log size:</p>
            <CodeBlock language="sql" code={`SET LINES 180
COL MEMBER FOR A60
SELECT b.thread#, a.group#, a.member, b.bytes
FROM v$logfile a, v$log b
WHERE a.group# = b.group#;

SELECT group#, dbid, thread#, sequence#, status
FROM v$standby_log;`} />
            <p>Add standby redo log groups — one extra group per thread beyond the online redo log count:</p>
            <CodeBlock language="sql" code={`-- Thread 1
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 19 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 20 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 21 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 22 SIZE 128M;
-- Thread 2
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 23 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 24 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 25 SIZE 128M;
ALTER DATABASE ADD STANDBY LOGFILE THREAD 2 GROUP 26 SIZE 128M;
-- Threads 3-6: follow same pattern (groups 27-42)`} />
            <Note>Add (n+1) standby redo log groups per thread where n = number of online redo log groups per thread.</Note>
          </Section>

          <Section title="A4. Set Standby File Management">
            <CodeBlock language="sql" code={`ALTER SYSTEM SET STANDBY_FILE_MANAGEMENT=AUTO SCOPE=BOTH SID='*';`} />
          </Section>

          <Section title="A5. Set Data Guard Parameters">
            <CodeBlock language="sql" code={`-- DG member list
ALTER SYSTEM SET LOG_ARCHIVE_CONFIG=
  'DG_CONFIG=(sfdcp,sfdcs,sfdcf,sfdcr)' SCOPE=BOTH SID='*';

-- Far Sync (SYNC, AFFIRM)
ALTER SYSTEM SET LOG_ARCHIVE_DEST_2=
  'service=sfdcf_DGMGRL SYNC AFFIRM
   valid_for=(online_logfile,all_roles) db_unique_name=sfdcf
   delay=0 optional compression=disable
   max_failure=1 reopen=300 net_timeout=30
   group=1 priority=1' SCOPE=BOTH SID='*';

-- Local HA DR (ASYNC, NOAFFIRM)
ALTER SYSTEM SET LOG_ARCHIVE_DEST_3=
  'service=sfdcs_DGMGRL ASYNC NOAFFIRM
   delay=0 optional compression=disable max_failure=0
   reopen=30 db_unique_name=sfdcs net_timeout=30
   group=1 priority=2
   valid_for=(online_logfile,all_roles)' SCOPE=BOTH SID='*';

-- COLO2 DR (ASYNC, NOAFFIRM)
ALTER SYSTEM SET LOG_ARCHIVE_DEST_4=
  'service=sfdcr_DGMGRL ASYNC NOAFFIRM
   delay=0 optional compression=disable max_failure=0
   reopen=30 db_unique_name=sfdcr net_timeout=30
   group=1 priority=3
   valid_for=(online_logfile,all_roles)' SCOPE=BOTH SID='*';

ALTER SYSTEM SET fal_client=sfdcp_DGMGRL SCOPE=BOTH SID='*';
ALTER SYSTEM SET fal_server=sfdcs_DGMGRL,sfdcr_DGMGRL,sfdcf_DGMGRL SCOPE=BOTH SID='*';
ALTER SYSTEM SET service_names='sfdcp,sfdcp_app,sfdcp_DGMGRL';`} />
          </Section>

          <Section title="A6. Create PFILE and Copy Password File">
            <CodeBlock language="sql" code={`-- Create pfile from spfile (to use as base for standby pfiles)
CREATE PFILE='/tmp/pfile_sfdcp.ora' FROM SPFILE;`} />
            <CodeBlock language="bash" code={`-- Copy password file from ASM to /tmp
asmcmd
ASMCMD> pwget --dbuniquename sfdcp
# Returns: +SFDCP_DATA/SFDCP/PASSWORD/pwdsfdcp.xxx
ASMCMD> pwcopy pwdsfdcp.xxx /tmp
ASMCMD> exit`} />
          </Section>

          <Section title="A7. Configure TNS Entries">
            <p>Add entries to <code>tnsnames.ora</code> on ALL nodes in the cluster. Use SCAN addresses for Primary and Local HA DGMGRL entries:</p>
            <CodeBlock language="bash" code={`# Example TNS entry (create similar entries for sfdcs, sfdcf, sfdcr)
sfdcp =
  (DESCRIPTION =
    (ADDRESS_LIST =
      (ADDRESS = (PROTOCOL=TCP)(PORT=1521)(HOST=primary-scan1.domain.internal))
      (ADDRESS = (PROTOCOL=TCP)(PORT=1521)(HOST=primary-scan2.domain.internal))
    )
    (CONNECT_TIMEOUT = 10)
    (RETRY_COUNT = 5)
    (RETRY_DELAY = 2)
    (TRANSPORT_CONNECT_TIMEOUT = 2)
    (LOAD_BALANCE = off)
    (FAILOVER = on)
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = sfdcp)
      (FAILOVER_MODE =
        (TYPE = SELECT)(METHOD = BASIC)(RETRIES = 180)(DELAY = 5)
      )
    )
  )`} />
          </Section>

          <Section title="A8. Create Symbolic Links & Configure Listener">
            <p>Create symbolic links on ALL cluster nodes (run as oracle user):</p>
            <CodeBlock language="bash" code={`ln -s /u01/app/19.0.0/grid/network/admin/listener.ora \
      /u01/app/oracle/product/19.0.0/db/network/admin

ln -s /u01/app/19.0.0/grid/network/admin/sqlnet.ora \
      /u01/app/oracle/product/19.0.0/db/network/admin`} />
            <p>Add to <code>$GRID_HOME/network/admin/listener.ora</code> on ALL nodes:</p>
            <CodeBlock language="bash" code={`# IPC listeners (if not present)
LISTENER_BULK=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=IPC)(KEY=LISTENER_BULK))))
LISTENER_REP=(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=IPC)(KEY=LISTENER_REP))))

# Under SID_LIST_LISTENER, add the DG managed entry:
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (GLOBAL_DBNAME = sfdcp_DGMGRL)
      (SID_NAME      = sfdcp1)           -- change per node
      (ORACLE_HOME   = /u01/app/oracle/product/19.0.0/db)
    )
  )`} />
          </Section>

          {/* PART B */}
          <SectionHeader label="B" title="Local HA Standby Configuration" />

          <Section title="B1. Add DB Entry to DBTAB">
            <CodeBlock language="bash" code={`vi /home/oracle/scripts/environment/dbtab
# Add entry for the standby SID on ALL cluster nodes`} />
          </Section>

          <Section title="B2. Prepare Standby PFILE">
            <p>Copy the primary pfile from <code>/tmp</code> and modify key parameters for the standby:</p>
            <CodeBlock language="bash" code={`# Key changes to make in pfile_sfdcs.ora:
# 1. db_unique_name  -> 'sfdcs'
# 2. instance_name   -> 'sfdcs1', 'sfdcs2', ... per instance
# 3. fal_client      -> 'ecgs_DGMGRL'
# 4. fal_server      -> 'ecgp_DGMGRL'
# 5. log_archive_dest_1 -> LOCAL with db_unique_name=sfdcs
# 6. service_names   -> 'sfdcs,sfdcp_app,sfdcs_DGMGRL'
# 7. audit_file_dest -> update path for standby
# 8. log_archive_dest_state_2 -> 'DEFER' (standby ships via Far Sync)`} />
            <p>Full pfile reference (ecgs = Local HA standby for ecgp primary):</p>
            <CodeBlock language="bash" code={`# Critical parameters shown — adapt instance names to your DB
*.db_name='ecgp'                          # same as primary db_name
*.db_unique_name='ecgs'                   # standby unique name
*.fal_client='ecgs_DGMGRL'
*.fal_server='ecgp_DGMGRL'
*.log_archive_config='DG_CONFIG=(ecgs,ecgp,ecgf,ecgr)'
*.log_archive_dest_1='LOCATION=USE_DB_RECOVERY_FILE_DEST VALID_FOR=(ALL_LOGFILES,ALL_ROLES) DB_UNIQUE_NAME=ecgs mandatory'
*.log_archive_dest_state_2='DEFER'        # defer until DG Broker enables
*.standby_file_management='AUTO'
*.dg_broker_start=TRUE
ecgs1.instance_number=1
ecgs2.instance_number=2
# ... continue for all nodes
ecgs1.undo_tablespace='UNDO01'
ecgs2.undo_tablespace='UNDO02'`} />
          </Section>

          <Section title="B3. Create Symbolic Links & Listener on Local HA">
            <CodeBlock language="bash" code={`# Same as primary — run on ALL Local HA nodes
ln -s /u01/app/19.0.0/grid/network/admin/listener.ora \
      /u01/app/oracle/product/19.0.0/db/network/admin
ln -s /u01/app/19.0.0/grid/network/admin/sqlnet.ora \
      /u01/app/oracle/product/19.0.0/db/network/admin

# Add to listener.ora:
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (GLOBAL_DBNAME = sfdcs_DGMGRL)
      (SID_NAME      = sfdcs1)
      (ORACLE_HOME   = /u01/app/oracle/product/19.0.0/db)
    )
  )`} />
          </Section>

          <Section title="B4. Start Standby in NOMOUNT, Create SPFILE">
            <CodeBlock language="sql" code={`-- Start instance in nomount using modified pfile
STARTUP NOMOUNT PFILE='/tmp/pfile_sfdcs.ora';

-- Create SPFILE in ASM
CREATE SPFILE='+SFDCP_DATA' FROM PFILE='/tmp/pfile_sfdcs.ora';

SHUTDOWN IMMEDIATE;
STARTUP NOMOUNT;

ALTER SYSTEM SET service_names='sfdcs,sfdcs_app,sfdcs_DGMGRL';
EXIT;`} />
          </Section>

          <Section title="B5. Copy Password File to ASM">
            <CodeBlock language="bash" code={`# As root: give oracle access to password file in /tmp
chmod 777 /tmp/pwdsfdcp.xxx

# Copy to ASM diskgroup for standby
asmcmd
ASMCMD> pwcopy /tmp/pwdsfdcp.xxx +SFDCP_DATA/SFDCS/orapwsfdcs`} />
          </Section>

          <Section title="B6. Register Database with SRVCTL">
            <CodeBlock language="bash" code={`srvctl add database -d sfdcs \
  -o /u01/app/oracle/product/19.0.0/db \
  -r PHYSICAL_STANDBY \
  -startoption MOUNT \
  -spfile +SFDCP_DATA/SFDCS/PARAMETERFILE/spfile.xxx \
  -pwfile +SFDCP_DATA/SFDCS/orapwsfdcs

# Add instances (one per node)
srvctl add instance -d sfdcs -i sfdcs1 -n node1
srvctl add instance -d sfdcs -i sfdcs2 -n node2
srvctl add instance -d sfdcs -i sfdcs3 -n node3
srvctl add instance -d sfdcs -i sfdcs4 -n node4
srvctl add instance -d sfdcs -i sfdcs5 -n node5
srvctl add instance -d sfdcs -i sfdcs6 -n node6

srvctl modify database -d sfdcs -diskgroup SFDCP_DATA,SFDCP_RECO

# Add services
srvctl add service -db sfdcs -service sfdcp_app \
  -preferred "sfdcs1,sfdcs2" -available "sfdcs3,sfdcs4,sfdcs5,sfdcs6" \
  -role PRIMARY -notification TRUE \
  -failovertype SELECT -failovermethod BASIC -failoverdelay 5 -failoverretry 180 \
  -commit_outcome true

srvctl add service -db sfdcs -service sfdcs_DGMGRL \
  -preferred "sfdcs1,sfdcs2,sfdcs3,sfdcs4,sfdcs5,sfdcs6" \
  -role PRIMARY -notification TRUE \
  -failovertype SELECT -failovermethod BASIC -failoverdelay 5 -failoverretry 180 \
  -commit_outcome true

srvctl start service -d sfdcs -s sfdcs_app
srvctl start service -d sfdcs -s sfdcs_DGMGRL`} />
          </Section>

          <Section title="B7. Verify Connectivity">
            <CodeBlock language="bash" code={`# Verify listener
lsnrctl status LISTENER
lsnrctl status LISTENER_BULK

# Test TNS connectivity
tnsping sfdcp_DGMGRL
tnsping sfdcs_DGMGRL

# Test RMAN login
rman
RMAN> connect TARGET sys/<SYS_PASSWORD>@sfdcp_DGMGRL;
RMAN> connect AUXILIARY sys/<SYS_PASSWORD>@sfdcs_DGMGRL;
RMAN> exit`} />
          </Section>

          <Section title="B8. Run RMAN Active Duplicate">
            <p>Save as <code>/tmp/rman_dup.sh</code> and run with nohup:</p>
            <CodeBlock language="bash" code={`nohup sh /tmp/rman_dup.sh &

# rman_dup.sh contents:
rman TARGET sys/<SYS_PASSWORD>@sfdcp_app \
     AUXILIARY sys/<SYS_PASSWORD>@sfdcs_DGMGRL << EOF
set echo on;
run {
  allocate channel prmy1 type disk;
  allocate channel prmy2 type disk;
  allocate channel prmy3 type disk;
  allocate channel prmy4 type disk;
  allocate auxiliary channel stby1 type disk;
  allocate auxiliary channel stby2 type disk;
  allocate auxiliary channel stby3 type disk;
  allocate auxiliary channel stby4 type disk;
  DUPLICATE TARGET DATABASE FOR STANDBY
    FROM ACTIVE DATABASE DORECOVER NOFILENAMECHECK;
}
exit
EOF`} />
            <Note>Monitor progress in <code>nohup.out</code>. Do not proceed until RMAN returns "Finished Duplicate Db".</Note>
          </Section>

          <Section title="B9. Recreate Standby Redo Logs & Enable MRP">
            <CodeBlock language="sql" code={`-- Drop all groups copied from primary
ALTER DATABASE DROP STANDBY LOGFILE GROUP 19;
-- ... repeat for groups 20-42

-- Verify all dropped
SELECT group#, SUM(bytes/1024/1024) "Size MB"
FROM v$standby_log GROUP BY group#;

-- Recreate standby redo logs (same as primary step A3)
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 19 SIZE 128M;
-- ... add groups 19-42 across threads 1-6

-- Enable MRP
ALTER DATABASE RECOVER MANAGED STANDBY DATABASE DISCONNECT FROM SESSION;`} />
          </Section>

          <Section title="B10. Verify Sync & Archive Deletion Policy">
            <CodeBlock language="sql" code={`-- Check MRP process status
SELECT process, status, thread#, sequence#
FROM gv$managed_standby;

SELECT * FROM v$dataguard_status;
SELECT * FROM gv$archive_gap;`} />
            <CodeBlock language="bash" code={`# Auto-delete applied archives from standby RECO
rman target /
RMAN> CONFIGURE ARCHIVELOG DELETION POLICY TO APPLIED ON ALL STANDBY;`} />
          </Section>

          {/* PART C */}
          <SectionHeader label="C" title="COLO2 DR Standby Configuration" />

          <Section title="C1–C7. Initial Setup">
            <p>Steps 1–7 for COLO2 are identical to Local HA (Parts B1–B7) with these differences:</p>
            <ul>
              <li>Use <code>sfdcr</code> (R suffix) as the DB unique name</li>
              <li>Update pfile: <code>db_unique_name='sfdcr'</code>, <code>fal_client='ecgr_DGMGRL'</code></li>
              <li>Add <code>dg_broker_config_file1/2</code> parameters pointing to COLO2 ASM</li>
              <li>COLO2 uses <code>LISTENER_REP</code> (not <code>LISTENER_BULK</code>)</li>
              <li>COLO2 nodes are in a separate datacenter (e.g., r2lg* prefix)</li>
            </ul>
            <CodeBlock language="bash" code={`# COLO2-specific listener check
lsnrctl status LISTENER      # standard
lsnrctl status LISTENER_REP  # COLO2 uses REP not BULK`} />
          </Section>

          <Section title="C2. RMAN Duplicate with More Channels (Large DB)">
            <p>For large databases across datacenters, use more channels for better throughput:</p>
            <CodeBlock language="bash" code={`rman TARGET sys/<SYS_PASSWORD>@primarydb_DGMGRL \
     AUXILIARY sys/<SYS_PASSWORD>@sfdcr_DGMGRL << EOF
set echo on;
run {
  allocate channel prd1 type disk;
  -- ... prd2 through prd16
  allocate channel prd16 type disk;
  allocate auxiliary channel stand1 type disk;
  -- ... stand2 through stand16
  allocate auxiliary channel stand16 type disk;
  DUPLICATE TARGET DATABASE FOR STANDBY
    FROM ACTIVE DATABASE DORECOVER NOFILENAMECHECK;
}
exit
EOF`} />
          </Section>

          {/* PART D */}
          <SectionHeader label="D" title="Far Sync Instance Configuration" />

          <Section title="D1. Far Sync Pfile Key Differences">
            <p>Far Sync is a <strong>single-node, non-RAC</strong> instance — no ASM, uses local filesystem:</p>
            <CodeBlock language="bash" code={`# Far Sync pfile key parameters (ecgf = Far Sync for ecgp primary)
*.db_unique_name='ecgf'
*.db_name='ecgp'                          # same db_name as primary
*.cluster_database=FALSE                  # NOT a RAC instance
*.fal_client='ecgf_DGMGRL'
*.fal_server='ecgp_DGMGRL','ecgs_DGMGRL','ecgr_DGMGRL'

# Far Sync forwards to COLO2 DR
*.log_archive_dest_2='service="ecgr_DGMGRL" ASYNC NOAFFIRM
  delay=0 optional compression=disable max_failure=0
  reopen=300 db_unique_name="ecgr" net_timeout=30
  valid_for=(standby_logfile,all_roles)'
*.log_archive_dest_state_2='ENABLE'

# Filesystem paths (no ASM on Far Sync)
*.control_files='/u01/data/ecgf/controlfile/control01.ctl',
                '/u01/data/ecgf/fast_recovery_area/controlfile/control02.ctl'
*.db_create_file_dest='/u01/data/ecgf/'
*.db_recovery_file_dest='/u01/data/ecgf/fast_recovery_area/'
*.memory_target=2147483648                # typically smaller than primary
*.processes=200`} />
          </Section>

          <Section title="D2. Create Required Directories on Far Sync">
            <CodeBlock language="bash" code={`mkdir -p /u01/app/oracle/admin/sfdcf/adump
mkdir -p /u01/data/sfdcf/controlfile
mkdir -p /u01/data/sfdcf/fast_recovery_area/controlfile
mkdir -p /u01/data/sfdcf/onlinelog
mkdir -p /u01/data/sfdcf/fast_recovery_area`} />
          </Section>

          <Section title="D3. Create Far Sync Control File on Primary">
            <CodeBlock language="sql" code={`-- Run on Primary
ALTER DATABASE CREATE FAR SYNC INSTANCE CONTROLFILE AS
  '/oracle/backup/SFDCP_DR/SFDCF/stbyfarsyncsfdcp.ctl';`} />
          </Section>

          <Section title="D4. Copy Files to Far Sync Server">
            <CodeBlock language="bash" code={`# From Primary, copy pfile, password file, and Far Sync controlfile
cd /tmp
sftp test_user@<far-sync-server-ip>
sftp> cd /tmp
sftp> put pfile_sfdcp.ora
sftp> put pwdsfdcp.xxx
sftp> put stbyfarsyncsfdcp.ctl`} />
          </Section>

          <Section title="D5. Set Up Control File & Password File on Far Sync">
            <CodeBlock language="bash" code={`# As root on Far Sync server
chown -R oracle:oinstall /tmp/stbyfarsyncsfdcp.ctl
chmod 777 /tmp/stbyfarsyncsfdcp.ctl

# As oracle
cp /tmp/stbyfarsyncsfdcp.ctl /u01/data/sfdcf/controlfile/control01.ctl
cp /tmp/stbyfarsyncsfdcp.ctl /u01/data/sfdcf/fast_recovery_area/controlfile/control02.ctl
cp /tmp/pwdsfdcp.xxx $ORACLE_HOME/dbs/orapwsfdcf`} />
          </Section>

          <Section title="D6. Start Far Sync & Create SPFILE">
            <CodeBlock language="sql" code={`STARTUP NOMOUNT PFILE='/tmp/pfile_sfdcf.ora';
CREATE SPFILE FROM PFILE='/tmp/pfile_sfdcf.ora';
SHUTDOWN IMMEDIATE;
EXIT;

-- Restart and mount
STARTUP MOUNT;`} />
          </Section>

          <Section title="D7. Listener Entry for Far Sync">
            <CodeBlock language="bash" code={`# Add to $ORACLE_HOME/network/admin/listener.ora on Far Sync server
SID_LIST_LISTENER =
  (SID_LIST =
    (SID_DESC =
      (GLOBAL_DBNAME = sfdcf_DGMGRL)
      (SID_NAME      = sfdcf)
      (ORACLE_HOME   = /u01/app/oracle/product/19.0.0/db)
    )
  )

lsnrctl reload LISTENER`} />
          </Section>

          <Section title="D8. Standby Redo Logs & Archive Deletion Policy on Far Sync">
            <CodeBlock language="sql" code={`-- Drop existing standby redo log groups (19-42)
ALTER DATABASE DROP STANDBY LOGFILE GROUP 19;
-- ... repeat for 20-42

-- Recreate
ALTER DATABASE ADD STANDBY LOGFILE THREAD 1 GROUP 19 SIZE 128M;
-- ... add groups 20-42`} />
            <CodeBlock language="bash" code={`rman target /
RMAN> CONFIGURE ARCHIVELOG DELETION POLICY TO APPLIED ON ALL STANDBY;`} />
          </Section>

          {/* DG BROKER */}
          <SectionHeader label="E" title="Data Guard Broker Configuration" />

          <Section title="E1. Enable DG Broker on All Members">
            <p>Run on each member (Primary, Local HA, COLO2, Far Sync) — create DATAGUARDCONFIG directories first in ASM:</p>
            <CodeBlock language="bash" code={`# On ASM nodes (Primary, Local HA, COLO2)
asmcmd
ASMCMD> cd +SFDCP_DATA/SFDCP
ASMCMD> mkdir DATAGUARDCONFIG
ASMCMD> exit`} />
            <CodeBlock language="sql" code={`-- Run per member, adjust paths for each
ALTER SYSTEM SET dg_broker_start=FALSE;
ALTER SYSTEM SET dg_broker_config_file1='+SFDCP_DATA/SFDCP/DATAGUARDCONFIG/dr1sfdcp.dat' SCOPE=BOTH SID='*';
ALTER SYSTEM SET dg_broker_config_file2='+SFDCP_RECO/SFDCP/DATAGUARDCONFIG/dr2sfdcp.dat' SCOPE=BOTH SID='*';
ALTER SYSTEM SET dg_broker_start=TRUE SCOPE=BOTH SID='*';

-- Far Sync uses filesystem paths:
-- dg_broker_config_file1='/u01/data/sfdcf/controlfile/dr1sfdcf.dat'
-- dg_broker_config_file2='/u01/data/sfdcf/fast_recovery_area/controlfile/dr2sfdcf.dat'`} />
          </Section>

          <Section title="E2. Disable Manual Archive Destinations Before Broker">
            <CodeBlock language="sql" code={`-- Clear manual archive destinations — DG Broker will manage them
ALTER SYSTEM SET log_archive_dest_2='';
ALTER SYSTEM SET log_archive_dest_3='';
ALTER SYSTEM SET log_archive_dest_4='';`} />
          </Section>

          <Section title="E3. Create DG Broker Configuration (MC Applications)">
            <CodeBlock language="bash" code={`dgmgrl sys/<SYS_PASSWORD>@sfdcp_DGMGRL

-- Create configuration
CREATE CONFIGURATION 'sfdcp' AS
  PRIMARY DATABASE IS 'sfdcp'
  CONNECT IDENTIFIER IS 'sfdcp_DGMGRL';

-- Add Local HA standby
ADD DATABASE 'sfdcs' AS
  CONNECT IDENTIFIER IS 'sfdcs_DGMGRL'
  MAINTAINED AS PHYSICAL;

-- Add Far Sync
ADD FAR_SYNC 'sfdcf' AS
  CONNECT IDENTIFIER IS 'sfdcf_DGMGRL';

-- Add COLO2 DR
ADD DATABASE 'sfdcr' AS
  CONNECT IDENTIFIER IS 'sfdcr_DGMGRL'
  MAINTAINED AS PHYSICAL;

SHOW CONFIGURATION;
ENABLE CONFIGURATION;
SHOW CONFIGURATION;`} />
          </Section>

          <Section title="E4. Configure Redo Routes (MC Applications)">
            <CodeBlock language="bash" code={`-- Primary: sync to Far Sync (priority 1), async to COLO2 (priority 2), async to Local HA
EDIT DATABASE sfdcp SET PROPERTY
  RedoRoutes='(LOCAL : (sfdcf SYNC PRIORITY=1, sfdcr ASYNC PRIORITY=2), sfdcs ASYNC)';

-- Local HA: same routing pattern as primary (for switchover scenarios)
EDIT DATABASE sfdcs SET PROPERTY
  RedoRoutes='(LOCAL : (sfdcf SYNC PRIORITY=1, sfdcr ASYNC PRIORITY=2), sfdcp ASYNC)';

-- Far Sync: forwards to COLO2 DR
EDIT FAR_SYNC sfdcf SET PROPERTY RedoRoutes='(sfdcp : sfdcr ASYNC)';

-- COLO2 DR: sends back to primary and local HA during switchover
EDIT DATABASE sfdcr SET PROPERTY RedoRoutes='(LOCAL : sfdcp ASYNC, sfdcs ASYNC)';

-- Set apply instances
EDIT DATABASE sfdcr SET STATE='APPLY-ON' WITH APPLY INSTANCE='sfdcr1';
EDIT DATABASE sfdcs SET STATE='APPLY-ON' WITH APPLY INSTANCE='sfdcs1';

-- Set lag thresholds (seconds)
EDIT DATABASE sfdcp SET PROPERTY NetTimeout=45;
EDIT DATABASE sfdcr SET PROPERTY ApplyLagThreshold=30;
EDIT DATABASE sfdcs SET PROPERTY ApplyLagThreshold=30;
EDIT DATABASE sfdcr SET PROPERTY TransportLagThreshold=30;
EDIT DATABASE sfdcs SET PROPERTY TransportLagThreshold=30;

SHOW CONFIGURATION VERBOSE;`} />
          </Section>

          <Section title="E5. Configure Redo Routes (EE Applications — No Local HA)">
            <CodeBlock language="bash" code={`-- EE Apps: Primary → Far Sync (SYNC) → COLO2 DR (ASYNC)
EDIT DATABASE sfdcp SET PROPERTY
  RedoRoutes='(LOCAL : (sfdcf SYNC PRIORITY=1, sfdcr ASYNC PRIORITY=2))';

EDIT FAR_SYNC sfdcf SET PROPERTY RedoRoutes='(sfdcp : sfdcr ASYNC)';

EDIT DATABASE sfdcr SET PROPERTY RedoRoutes='(LOCAL : sfdcp ASYNC)';

EDIT DATABASE sfdcp SET STATE='APPLY-ON' WITH APPLY INSTANCE='sfdcp1';
EDIT DATABASE sfdcr SET STATE='APPLY-ON' WITH APPLY INSTANCE='sfdcr1';

SHOW CONFIGURATION VERBOSE;`} />
            <Note>Configuration shows SUCCESS with no warnings before proceeding.</Note>
          </Section>

          <Section title="E6. Set Archive Deletion Policy on Primary">
            <CodeBlock language="bash" code={`rman target /
RMAN> CONFIGURE ARCHIVELOG DELETION POLICY TO SHIPPED TO ALL STANDBY;`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · DataGuard · RAC · DR · RMAN</span>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mt-12 mb-2">
      <span className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 flex items-center justify-center font-extrabold text-sm shrink-0">
        {label}
      </span>
      <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{title}</h2>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3 pb-1.5 border-b border-zinc-100 dark:border-zinc-800/60">{title}</h3>
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
