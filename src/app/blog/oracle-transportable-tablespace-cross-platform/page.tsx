import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Transportable Tablespace with Cross-Platform Incremental Backup — Naresh Gowda",
  description:
    "The V4 method for moving tablespaces across OS platforms (Solaris to Linux, HP-UX to RHEL) using RMAN cross-platform incremental backups to minimize downtime during the final cutover.",
};

export default function TransportableTablespace() {
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
            Reduce Transportable Tablespace Downtime Using Cross-Platform Incremental Backup (V4)
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Reference: Oracle MOS <span className="font-mono text-violet-600 dark:text-violet-400">DocID 2471245.1</span>
          </p>
        </div>

        <div className="space-y-1">

          <Section title="Overview">
            <p>
              The <strong>Transportable Tablespace (TTS)</strong> feature lets you move tablespaces between Oracle databases —
              including across different operating systems and platforms (e.g., Solaris → Linux, HP-UX → RHEL).
            </p>
            <p>
              The traditional TTS approach requires the tablespace to be in <code>READ ONLY</code> mode for the entire
              duration of the copy — which can mean hours or days of downtime for large tablespaces.
            </p>
            <p>
              The <strong>V4 cross-platform incremental backup method</strong> reduces this downtime to minutes:
            </p>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 my-3 font-mono text-xs">
              <p className="text-zinc-600 dark:text-zinc-300">Traditional TTS: READ ONLY → full copy (days) → import</p>
              <p className="text-emerald-700 dark:text-emerald-400 mt-1">V4 method:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READ WRITE → full copy → incrementals → READ ONLY (minutes) → final incremental → import</p>
            </div>
          </Section>

          <Section title="Prerequisites">
            <ul>
              <li>Oracle 12.1.0.2+ on source and target</li>
              <li>Source and target DB block size must match</li>
              <li>Both platforms must be in Oracle's supported cross-platform list</li>
              <li>Target platform must be confirmed with: <code>SELECT * FROM v$transportable_platform ORDER BY platform_name;</code></li>
              <li>RMAN must have access to both source and target (or shared staging area)</li>
            </ul>
            <CodeBlock language="sql" code={`-- Check compatible cross-platform targets
SELECT platform_name, endian_format
FROM v$transportable_platform
ORDER BY platform_name;

-- Check source platform endian
SELECT platform_name, endian_format
FROM v$database d
JOIN v$transportable_platform tp ON d.platform_id = tp.platform_id;`} />
          </Section>

          <Section title="Phase 1 — Initial Full Cross-Platform Backup (Source READ WRITE)">
            <p>The tablespace stays <strong>open for writes</strong> during this phase — no downtime yet.</p>
            <CodeBlock language="sql" code={`-- On SOURCE: create a cross-platform backup of the tablespace(s)
-- The tablespace remains READ WRITE during this step
BACKUP
  FOR TRANSPORT
  ALLOW INCONSISTENT
  TABLESPACE sales_data, sales_idx
  FORMAT '/oracle/staging/xtt/full_%U'
  DATAPUMP FORMAT '/oracle/staging/xtt/meta_%U';`} />
            <p>Transfer the initial backup files to the target staging area:</p>
            <CodeBlock language="bash" code={`scp /oracle/staging/xtt/full_* oracle@target-server:/oracle/staging/xtt/
scp /oracle/staging/xtt/meta_* oracle@target-server:/oracle/staging/xtt/`} />
          </Section>

          <Section title="Phase 2 — Apply Incremental Backups (Repeated, Source READ WRITE)">
            <p>
              Apply incremental backups on the <strong>target</strong> repeatedly over days or weeks
              while the tablespace is still online. Each application reduces the final sync window.
            </p>
            <CodeBlock language="sql" code={`-- On SOURCE: take incremental backup since last SCN
-- Run this command multiple times over the migration period
BACKUP
  FOR TRANSPORT
  ALLOW INCONSISTENT
  FROM SCN <last_applied_scn>
  TABLESPACE sales_data, sales_idx
  FORMAT '/oracle/staging/xtt/incr_%U';`} />
            <CodeBlock language="bash" code={`# On TARGET: restore incremental to advance the datafiles
rman target /

RMAN> RECOVER
  FOREIGN TABLESPACE sales_data, sales_idx
  FROM BACKUPSET '/oracle/staging/xtt/incr_*'
  FOREIGN DATAFILECOPY '/oracle/staging/xtt/datafiles/*';`} />
            <Note>
              Run Phase 2 daily (or more frequently) as the migration date approaches. Each run reduces the SCN gap,
              meaning the final READ ONLY window shrinks. For a 2TB tablespace, daily incrementals typically take
              only minutes if change rate is low.
            </Note>
          </Section>

          <Section title="Phase 3 — Final Cutover (Minimal Downtime Window)">
            <p>
              During the maintenance window, put the tablespace in <code>READ ONLY</code> and take the
              final incremental backup. This is the only period of actual downtime.
            </p>
            <CodeBlock language="sql" code={`-- On SOURCE: set tablespace READ ONLY (START of downtime)
ALTER TABLESPACE sales_data READ ONLY;
ALTER TABLESPACE sales_idx  READ ONLY;

-- Take the final incremental backup
BACKUP
  FOR TRANSPORT
  FROM SCN <last_applied_scn>
  TABLESPACE sales_data, sales_idx
  FORMAT '/oracle/staging/xtt/final_%U'
  DATAPUMP FORMAT '/oracle/staging/xtt/final_meta_%U';`} />
            <CodeBlock language="bash" code={`# Transfer final backup to target
scp /oracle/staging/xtt/final_* oracle@target-server:/oracle/staging/xtt/`} />
          </Section>

          <Section title="Phase 4 — Apply Final Incremental on Target">
            <CodeBlock language="bash" code={`# On TARGET: apply the final incremental
rman target /

RMAN> RECOVER
  FOREIGN TABLESPACE sales_data, sales_idx
  FROM BACKUPSET '/oracle/staging/xtt/final_*'
  FOREIGN DATAFILECOPY '/oracle/staging/xtt/datafiles/*';`} />
          </Section>

          <Section title="Phase 5 — Import Tablespace on Target">
            <CodeBlock language="sql" code={`-- On TARGET: import the tablespace using Data Pump metadata file
-- The metadata dump was created in Phase 1/Phase 3 DATAPUMP FORMAT step

impdp '/ as sysdba'
  DUMPFILE=final_meta_%U.dmp
  DIRECTORY=DATA_PUMP_DIR
  TRANSPORT_DATAFILES='/oracle/staging/xtt/datafiles/sales_data_01.dbf',
                      '/oracle/staging/xtt/datafiles/sales_idx_01.dbf'`} />
            <CodeBlock language="sql" code={`-- Verify tablespace is now part of target DB
SELECT tablespace_name, status FROM dba_tablespaces
WHERE tablespace_name IN ('SALES_DATA','SALES_IDX');

-- Make tablespace READ WRITE on target
ALTER TABLESPACE sales_data READ WRITE;
ALTER TABLESPACE sales_idx  READ WRITE;`} />
          </Section>

          <Section title="Phase 6 — Drop or Migrate Source Tablespace">
            <CodeBlock language="sql" code={`-- On SOURCE: after confirming target is working,
-- drop the tablespace (or leave READ ONLY temporarily for rollback window)
DROP TABLESPACE sales_data INCLUDING CONTENTS AND DATAFILES;
DROP TABLESPACE sales_idx  INCLUDING CONTENTS AND DATAFILES;`} />
          </Section>

          <Section title="Endian Conversion Handling">
            <p>
              When source and target platforms have <strong>different endian formats</strong> (e.g., Solaris Big Endian → Linux Little Endian),
              Oracle RMAN automatically converts blocks during the backup/restore. No manual conversion needed when using the
              <code>FOR TRANSPORT</code> syntax.
            </p>
            <CodeBlock language="sql" code={`-- Verify endian compatibility before starting
SELECT platform_name, endian_format FROM v$transportable_platform
WHERE platform_name IN ('Solaris[tm] OE (SPARC)', 'Linux x86 64-bit');

-- Output:
-- Solaris[tm] OE (SPARC)   Big
-- Linux x86 64-bit          Little
-- Endian differs → RMAN handles conversion automatically in V4`} />
            <Note>
              Endian conversion only applies to datafile blocks — the metadata (Data Pump export/import) is
              always platform-neutral XML. The V4 method handles this transparently unlike older methods
              that required RMAN CONVERT commands.
            </Note>
          </Section>

          <Section title="Comparison — V1/V2 vs V4 Method">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="text-left py-2 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">Feature</th>
                    <th className="text-left py-2 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">V1/V2 (old)</th>
                    <th className="text-left py-2 font-semibold text-zinc-900 dark:text-zinc-100">V4 (DocID 2471245.1)</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-600 dark:text-zinc-400">
                  {[
                    ["Downtime", "Full copy duration (hours/days)", "Final incremental only (minutes)"],
                    ["Source during copy", "READ ONLY", "READ WRITE"],
                    ["Endian conversion", "Manual RMAN CONVERT", "Automatic"],
                    ["Incremental apply", "Not supported", "Supported (key advantage)"],
                    ["Min Oracle version", "8i+", "12.1.0.2+"],
                  ].map(([feat, old, v4]) => (
                    <tr key={feat} className="border-b border-zinc-100 dark:border-zinc-800/50">
                      <td className="py-2 pr-4 font-medium text-zinc-700 dark:text-zinc-300">{feat}</td>
                      <td className="py-2 pr-4 text-red-600 dark:text-red-400">{old}</td>
                      <td className="py-2 text-emerald-600 dark:text-emerald-400">{v4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Oracle · TTS · Cross-Platform · RMAN · MOS 2471245.1</span>
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
