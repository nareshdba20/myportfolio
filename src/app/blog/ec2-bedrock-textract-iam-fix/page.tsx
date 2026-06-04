import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "EC2 Not Authorized to Call Bedrock or Textract — IAM Fix — Naresh Gowda",
  description:
    "How to fix the 'is not authorized to perform: bedrock:InvokeModel' and Textract permission errors when running AI workloads on an EC2 instance using an IAM role.",
};

export default function Ec2BedrockTextractIamFix() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-500/20">
              <Tag size={10} /> Cloud
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 5 min read</span>
            <span className="text-xs text-zinc-400 font-mono">Jun 3, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            EC2 Not Authorized to Call Bedrock or Textract — How to Fix IAM Permissions
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            You set up AWS Bedrock or Textract on your backend, everything looks right, then you hit this
            in production: <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">is not authorized to perform: bedrock:InvokeModel</code>.
            Here is exactly what is wrong and how to fix it in under two minutes.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="The Error">
            <p>You will see one of these in your logs:</p>
            <CodeBlock language="text" code={`User: arn:aws:sts::XXXXXXXXXXXX:assumed-role/your-ec2-role/i-XXXXXXXXXXXXXXXXX
is not authorized to perform: bedrock:InvokeModel
on resource: arn:aws:bedrock:us-east-1::foundation-model/amazon.nova-lite-v1:0
because no identity-based policy allows the bedrock:InvokeModel action`} />
            <CodeBlock language="text" code={`User: arn:aws:sts::XXXXXXXXXXXX:assumed-role/your-ec2-role/i-XXXXXXXXXXXXXXXXX
is not authorized to perform: textract:StartDocumentTextDetection
on resource: *`} />
            <p>
              Both errors mean the same thing — your EC2 instance is making AWS API calls
              using its IAM role, but that role has no permission to call Bedrock or Textract.
            </p>
          </Section>

          <Section title="Why This Happens">
            <p>
              When your application runs on EC2, it authenticates to AWS using the
              <strong> IAM instance role</strong> attached to the instance — not your personal AWS credentials.
              That role only has the permissions you explicitly grant it.
            </p>
            <p>
              Most EC2 setups come with S3, SES, or ECR permissions out of the box.
              Bedrock and Textract are newer services — they are almost never included by default
              and must be added manually.
            </p>
            <Note>
              This is not a code problem. Your SDK calls are correct. The instance role just
              lacks the permission. IAM policy changes take effect immediately — no restart required.
            </Note>
          </Section>

          <Section title="Step 1 — Find Your EC2 Instance Role Name">
            <p>If you do not know your role name, look it up:</p>
            <CodeBlock language="bash" code={`aws ec2 describe-instances \\
  --instance-ids YOUR_INSTANCE_ID \\
  --query "Reservations[0].Instances[0].IamInstanceProfile.Arn" \\
  --output text --region us-east-1`} />
            <p>
              The output looks like <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">arn:aws:iam::XXXX:instance-profile/your-ec2-role</code>.
              The role name is the last segment after the slash.
            </p>
            <p>Or check which policies are already attached:</p>
            <CodeBlock language="bash" code={`aws iam list-attached-role-policies --role-name YOUR_ROLE_NAME
aws iam list-role-policies --role-name YOUR_ROLE_NAME`} />
          </Section>

          <Section title="Step 2 — Add Bedrock Permission">
            <p>
              This allows your EC2 to call <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">InvokeModel</code> and
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">InvokeModelWithResponseStream</code> on all foundation models:
            </p>
            <CodeBlock language="bash" code={`aws iam put-role-policy \\
  --role-name YOUR_ROLE_NAME \\
  --policy-name BedrockAccess \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/*"
    }]
  }' \\
  --region us-east-1`} />
            <Note>
              The wildcard <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">foundation-model/*</code> covers all models —
              Nova, Claude, Titan, Llama, etc. If you want to restrict to a specific model,
              replace <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">*</code> with the model ID,
              e.g. <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">amazon.nova-lite-v1:0</code>.
            </Note>
          </Section>

          <Section title="Step 3 — Add Textract Permission">
            <p>
              If you are using Textract for document or PDF text extraction, add this separately:
            </p>
            <CodeBlock language="bash" code={`aws iam put-role-policy \\
  --role-name YOUR_ROLE_NAME \\
  --policy-name TextractAccess \\
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [{
      "Effect": "Allow",
      "Action": [
        "textract:DetectDocumentText",
        "textract:StartDocumentTextDetection",
        "textract:GetDocumentTextDetection"
      ],
      "Resource": "*"
    }]
  }' \\
  --region us-east-1`} />
            <p>The three actions cover:</p>
            <ul>
              <li><code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">DetectDocumentText</code> — synchronous, single page, images and small PDFs</li>
              <li><code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">StartDocumentTextDetection</code> — async job start, multi-page PDFs from S3</li>
              <li><code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">GetDocumentTextDetection</code> — poll async job results</li>
            </ul>
          </Section>

          <Section title="Step 4 — Verify">
            <CodeBlock language="bash" code={`# Confirm the policies were applied
aws iam list-role-policies --role-name YOUR_ROLE_NAME

# Expected output:
# {
#     "PolicyNames": [
#         "BedrockAccess",
#         "TextractAccess"
#     ]
# }`} />
            <p>
              No restart needed. IAM policy changes are effective immediately.
              Re-run your application and the error will be gone.
            </p>
          </Section>

          <Section title="One More Thing — Model Access in Bedrock Console">
            <p>
              IAM permission is only half the requirement. AWS Bedrock also requires you to
              explicitly enable each model in your account before it can be called.
            </p>
            <p>
              If you still get an error after adding the IAM policy, check this:
            </p>
            <ul>
              <li>Go to <strong>AWS Console → Bedrock → Model access</strong></li>
              <li>Find the model you are trying to use (e.g. Amazon Nova Lite)</li>
              <li>Click <strong>Request access</strong> if it shows as unavailable</li>
              <li>Most models are approved instantly</li>
            </ul>
            <Note>
              IAM controls who can call the API. Model access controls which models are
              enabled in your account. You need both. Missing either one gives the same
              &quot;not authorized&quot; error, which is why it is easy to miss.
            </Note>
          </Section>

          <Section title="Summary">
            <CodeBlock language="text" code={`Problem   EC2 role missing Bedrock / Textract permissions
Symptom   "is not authorized to perform: bedrock:InvokeModel"
Fix       aws iam put-role-policy → add BedrockAccess + TextractAccess
Effect    Immediate — no restart needed
Gotcha    Also check Bedrock Console → Model access is enabled`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">AWS · IAM · Bedrock · Textract · EC2</span>
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
