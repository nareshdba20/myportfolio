import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "GitHub Branch Protection on Private Repos Without Paying for Team Plan — Naresh Gowda",
  description:
    "How to prevent direct pushes to main on a private GitHub repo without upgrading to GitHub Team — using a GitHub Actions workflow as a free enforcement layer.",
};

export default function GithubBranchProtectionFree() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-medium border border-violet-200 dark:border-violet-500/20">
              <Tag size={10} /> DevOps
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 4 min read</span>
            <span className="text-xs text-zinc-400 font-mono">Jun 3, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            GitHub Branch Protection on Private Repos — Without Paying for Team Plan
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            GitHub Rulesets on private repos require the Team plan ($4/user/month).
            If you have a live production app and want to stop direct pushes to
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">main</code>
            without paying, here is a GitHub Actions workaround that gets you 80% of the way there for free.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="The Problem">
            <p>
              You try to set up branch protection on a private repo and GitHub shows you this:
            </p>
            <CodeBlock language="text" code={`Your rulesets won't be enforced on this private repository
until you upgrade this organization account to GitHub Team.`} />
            <p>
              The old branch protection rules UI also prompts an upgrade for private repos.
              For a small team or solo developer, $4/user/month is an unnecessary cost
              when you just want one simple rule: <strong>no direct pushes to main</strong>.
            </p>
          </Section>

          <Section title="The Workaround">
            <p>
              GitHub Actions runs on every push — including direct pushes to
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">main</code>.
              Using the GitHub API, the workflow can check whether the incoming commit
              came from a merged pull request or was pushed directly.
              If it was a direct push, the workflow fails loudly.
            </p>
            <p>
              This does not <em>block</em> the push (nothing free can do that on private repos),
              but it immediately fails CI, making the violation visible to the whole team
              and blocking any downstream deploy workflows from running.
            </p>
          </Section>

          <Section title="The Workflow">
            <p>
              Create <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">.github/workflows/protect-main.yml</code> in your repo:
            </p>
            <CodeBlock language="yaml" code={`name: Protect Main Branch

on:
  push:
    branches: [main]

jobs:
  check-pr-merge:
    runs-on: ubuntu-latest
    steps:
      - name: Check if push came from a merged PR
        env:
          GH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: |
          COMMIT_SHA="\${{ github.sha }}"
          PUSHER="\${{ github.actor }}"

          # Check if this commit is associated with a merged PR
          PR=$(gh api repos/\${{ github.repository }}/commits/$COMMIT_SHA/pulls \\
            --jq '.[0].merged_at' 2>/dev/null || echo "null")

          if [ "$PR" = "null" ] || [ -z "$PR" ]; then
            echo "❌ Direct push to main detected by $PUSHER"
            echo "All changes must go through a pull request."
            exit 1
          fi

          echo "✅ Commit came from a merged PR. Allowed."`} />
            <Note>
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">secrets.GITHUB_TOKEN</code> is automatically
              available in every Actions run — no setup needed.
            </Note>
          </Section>

          <Section title="Block the Deploy Too">
            <p>
              The real enforcement comes from making your deploy workflow depend on this check.
              Add <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">needs: check-pr-merge</code> to your deploy job:
            </p>
            <CodeBlock language="yaml" code={`# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  check-pr-merge:
    uses: ./.github/workflows/protect-main.yml  # reuse the check

  deploy:
    runs-on: ubuntu-latest
    needs: check-pr-merge   # deploy only runs if check passes
    steps:
      - name: Deploy
        run: echo "deploying..."`} />
            <p>
              Now a direct push to <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">main</code> fails
              the check, and because deploy <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">needs</code> the check,
              the deploy never runs. Production is safe.
            </p>
          </Section>

          <Section title="What This Gives You">
            <CodeBlock language="text" code={`✅  Direct push to main → CI fails immediately
✅  Deploy workflow blocked (needs check-pr-merge)
✅  Violation is visible in GitHub Actions tab
✅  Works on free plan, private repos
✅  No setup beyond adding the YAML file
❌  Cannot physically block the push from landing (needs Team plan)
❌  The commit does appear in git history for a few seconds`} />
          </Section>

          <Section title="The Correct Workflow Going Forward">
            <CodeBlock language="text" code={`feature branch
    → push to dev
         → PR from dev to main
              → review & approve
                   → merge
                        → protect-main check passes (came from PR)
                             → deploy runs
                                  → production updated`} />
            <p>
              Any push that bypasses this flow fails CI immediately and never reaches production.
            </p>
          </Section>

          <Section title="Is It Worth Paying for GitHub Team?">
            <p>
              If your team grows beyond 2-3 people, yes — GitHub Team adds:
            </p>
            <ul>
              <li>True push blocking (the commit never lands)</li>
              <li>Required status checks before merge</li>
              <li>CODEOWNERS — specific reviewers required per file</li>
              <li>Required number of approvals</li>
            </ul>
            <p>
              For a solo developer or a small startup with a live production app,
              this workaround is a solid interim solution that costs nothing.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">GitHub · DevOps · CI/CD · Branch Protection · GitHub Actions</span>
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
      <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">{children}</div>
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
