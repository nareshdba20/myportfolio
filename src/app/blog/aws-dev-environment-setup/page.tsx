import Footer from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import diagram from "./diagram-export-6-3-2026-8_52_03-AM.png";

export const metadata = {
  title: "Setting Up a Production-Mirror Dev Environment on AWS — Naresh Gowda",
  description:
    "How I built a fully isolated dev environment on AWS — separate EC2, RDS PostgreSQL 17, S3, ECR, GitHub Actions CI/CD, and Amplify frontend — mirroring production without touching it.",
};

export default function AwsDevEnvironmentSetup() {
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
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 text-xs font-medium border border-violet-200 dark:border-violet-500/20">
              <Tag size={10} /> DevOps
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 12 min read</span>
            <span className="text-xs text-zinc-400 font-mono">Jun 2, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Setting Up a Production-Mirror Dev Environment on AWS
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Our app launched entirely on production infrastructure — one EC2, one RDS, one everything.
            This post walks through how I created a fully isolated dev environment that mirrors prod exactly:
            separate compute, separate database, separate storage, and a CI/CD pipeline that deploys
            to dev on every push to the <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code> branch.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="The Problem">
            <p>
              When you build fast, everything ends up in production. We were no different —
              the entire stack ran on a single environment. Any feature branch pushed directly to
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">main</code>
              was one mistake away from breaking live users.
            </p>
            <p>
              The fix is straightforward in principle: create a parallel environment that is
              identical to production but completely isolated. The hard part is doing it without
              skipping corners — especially the database.
            </p>
            <Note>
              The database is the most critical reason to keep environments separate. A bad migration,
              a seed script that truncates rows, or a test that corrupts data on a shared RDS instance
              hits real users. Never share a database between dev and prod.
            </Note>
          </Section>

          <Section title="Architecture">
            <p>The target state — two fully isolated stacks inside the same VPC:</p>
            <CodeBlock language="text" code={`VPC: myapp-vpc (10.0.0.0/16)
│
├── PRODUCTION
│   ├── EC2:  myapp-ec2          (t3.micro, public subnet)
│   ├── RDS:  myapp-db           (PostgreSQL 15, private subnet)
│   ├── S3:   myapp-uploads-prod
│   ├── ECR:  myapp-backend
│   └── Amplify → yourapp.com       (main branch)
│
└── DEV
    ├── EC2:  myapp-ec2-dev       (t3.micro, public subnet)
    ├── RDS:  myapp-db-dev        (PostgreSQL 17.9, private subnet)
    ├── S3:   myapp-uploads-dev
    ├── ECR:  myapp-backend-dev
    └── Amplify → dev.yourapp.com   (dev branch)`} />
            <div className="my-4 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <Image
                src={diagram}
                alt="AWS architecture diagram showing production and dev environments side by side"
                className="w-full h-auto"
                placeholder="blur"
              />
            </div>
            <p>
              Both environments share the same VPC, security groups, IAM role, and key pair.
              Everything else is a separate resource. Cost overhead: ~$27/month for the dev EC2 + RDS.
            </p>
          </Section>

          <Section title="Step 1 — Secrets Manager">
            <p>
              Production already used AWS Secrets Manager for the RDS password and JWT secrets.
              Dev gets its own parallel set under a <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">myapp/dev/</code> prefix:
            </p>
            <CodeBlock language="powershell" code={`aws secretsmanager create-secret \`
  --name "myapp/dev/db/password" \`
  --secret-string "YOUR_STRONG_DEV_DB_PASSWORD" \`
  --region us-east-1

aws secretsmanager create-secret \`
  --name "myapp/dev/jwt/secret" \`
  --secret-string "YOUR_JWT_SECRET_MIN_32_CHARS" \`
  --region us-east-1

aws secretsmanager create-secret \`
  --name "myapp/dev/jwt/access" \`
  --secret-string "YOUR_JWT_ACCESS_SECRET_MIN_32_CHARS" \`
  --region us-east-1

aws secretsmanager create-secret \`
  --name "myapp/dev/jwt/refresh" \`
  --secret-string "YOUR_JWT_REFRESH_SECRET_MIN_32_CHARS" \`
  --region us-east-1`} />
            <Note>
              Secrets Manager is used as the source of truth. The actual values are manually placed in
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">/app/.env</code>
              on the EC2 instance — the app reads from the env file at runtime, not from the SDK.
            </Note>
          </Section>

          <Section title="Step 2 — RDS PostgreSQL (Dev)">
            <p>
              Create a dev RDS instance in the same VPC and private subnets as prod,
              reusing the existing subnet group and security group:
            </p>
            <CodeBlock language="bash" code={`aws rds create-db-instance \\
  --db-instance-identifier myapp-db-dev \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --engine-version 17.9 \\
  --master-username postgres \\
  --master-user-password YOUR_DEV_DB_PASSWORD \\
  --db-name myapp \\
  --allocated-storage 20 \\
  --storage-type gp2 \\
  --db-subnet-group-name myapp-db-subnet-group \\
  --vpc-security-group-ids sg-XXXXXXXX \\
  --no-publicly-accessible \\
  --backup-retention-period 3 \\
  --no-multi-az \\
  --tags Key=Environment,Value=dev Key=Project,Value=myapp \\
  --region us-east-1`} />
            <p>
              I chose PostgreSQL 17.9 for dev (prod was on 15) to test compatibility ahead of a planned prod upgrade.
              Prisma 5.7 supports PG 9.6 through 17 — no schema changes required.
            </p>
            <p>Wait for the instance to become available (~8 minutes):</p>
            <CodeBlock language="bash" code={`aws rds describe-db-instances \\
  --db-instance-identifier myapp-db-dev \\
  --query "DBInstances[0].{Status:DBInstanceStatus,Endpoint:Endpoint.Address}" \\
  --output table --region us-east-1`} />
          </Section>

          <Section title="Step 3 — S3 Bucket + ECR Repository">
            <p>Create the dev S3 bucket, lock it down, and set CORS for the dev frontend domain:</p>
            <CodeBlock language="bash" code={`# Create bucket
aws s3api create-bucket \\
  --bucket myapp-uploads-dev \\
  --region us-east-1

# Block all public access
aws s3api put-public-access-block \\
  --bucket myapp-uploads-dev \\
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# CORS — dev frontend only, no localhost
aws s3api put-bucket-cors --bucket myapp-uploads-dev \\
  --cors-configuration '{"CORSRules":[{"AllowedOrigins":["https://dev.yourapp.com"],"AllowedMethods":["GET","PUT","POST","DELETE"],"AllowedHeaders":["*"],"MaxAgeSeconds":3000}]}'`} />
            <p>Create the dev ECR repository with a lifecycle policy to keep storage lean:</p>
            <CodeBlock language="bash" code={`aws ecr create-repository \\
  --repository-name myapp-backend-dev \\
  --region us-east-1

aws ecr put-lifecycle-policy \\
  --repository-name myapp-backend-dev \\
  --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 5 images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}' \\
  --region us-east-1`} />
          </Section>

          <Section title="Step 4 — Dev EC2 Instance">
            <p>
              Launch a dev EC2 reusing the same key pair, IAM instance profile, and security groups as prod:
            </p>
            <CodeBlock language="bash" code={`aws ec2 run-instances \\
  --image-id ami-XXXXXXXX \\
  --instance-type t3.micro \\
  --key-name myapp-ec2-prod \\
  --security-group-ids sg-XXXXXXXX \\
  --subnet-id subnet-XXXXXXXX \\
  --iam-instance-profile Name=myapp-ec2-profile \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=myapp-ec2-dev},{Key=Environment,Value=dev}]' \\
  --region us-east-1`} />
            <p>Allocate and associate a dedicated Elastic IP for the dev instance:</p>
            <CodeBlock language="bash" code={`# Allocate
ALLOC_ID=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text)

# Associate
aws ec2 associate-address \\
  --instance-id i-XXXXXXXXXXXXXXXXX \\
  --allocation-id $ALLOC_ID`} />
          </Section>

          <Section title="Step 5 — Server Setup on Dev EC2">
            <p>SSH into the dev EC2 and run the server setup in order:</p>
            <CodeBlock language="bash" code={`# 1. Install Docker, Nginx, Certbot
sudo dnf update -y
sudo dnf install -y docker nginx certbot python3-certbot-nginx

# 2. Start services
sudo systemctl start docker && sudo systemctl enable docker
sudo systemctl start nginx && sudo systemctl enable nginx
sudo usermod -aG docker ec2-user

# Log out and back in for docker group to take effect`} />
            <p>Write the Nginx config (HTTP only — Certbot upgrades it to HTTPS):</p>
            <CodeBlock language="nginx" code={`# /etc/nginx/conf.d/myapp-dev.conf
server {
    listen 80;
    server_name api-dev.yourapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`} />
            <p>
              Add the DNS A record for <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">api-dev.yourapp.com</code> pointing
              to the dev Elastic IP, wait a few minutes, then run Certbot:
            </p>
            <CodeBlock language="bash" code={`sudo certbot --nginx -d api-dev.yourapp.com`} />
            <p>
              Certbot rewrites the Nginx config automatically — adds SSL directives, installs the certificate,
              and sets up the HTTP-to-HTTPS redirect. Verify it worked:
            </p>
            <CodeBlock language="bash" code={`curl -I https://api-dev.yourapp.com
# HTTP/1.1 502 Bad Gateway  ← correct, no container running yet`} />
            <Note>
              A 502 at this stage is the right answer. Nginx is up and SSL is working — the 502 just means
              there is no Docker container on port 3000 yet. The app deploy will fix that.
            </Note>
          </Section>

          <Section title="Step 6 — /app/.env on Dev EC2">
            <p>Create the environment file the Docker container reads at startup:</p>
            <CodeBlock language="bash" code={`sudo mkdir -p /app
sudo tee /app/.env > /dev/null << 'EOF'
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:PASSWORD@myapp-db-dev.XXXX.us-east-1.rds.amazonaws.com:5432/myapp
JWT_SECRET=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=myapp-uploads-dev
AWS_S3_CDN_URL=https://myapp-uploads-dev.s3.amazonaws.com
FRONTEND_URL=https://dev.yourapp.com
EOF

sudo chmod 644 /app/.env   # Docker needs read access`} />
            <Note>
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">chmod 600</code> feels more secure but breaks Docker's
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">--env-file</code> flag,
              which runs as a non-root user. Use <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">644</code> — the EC2 is already locked down at the network level.
            </Note>
          </Section>

          <Section title="Step 7 — GitHub Actions Deploy Workflow">
            <p>
              The dev deploy workflow mirrors the prod workflow exactly — the only differences are the
              ECR repository name, the SSH target host, and the trigger branch:
            </p>
            <CodeBlock language="yaml" code={`# .github/workflows/deploy-dev.yml
name: Deploy to Dev

on:
  push:
    branches: [dev]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: myapp-backend-dev
  IMAGE_TAG: \${{ github.sha }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Login to ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: \${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/\${{ env.ECR_REPOSITORY }}:\${{ env.IMAGE_TAG }} .
          docker push $ECR_REGISTRY/\${{ env.ECR_REPOSITORY }}:\${{ env.IMAGE_TAG }}

      - name: Deploy to Dev EC2
        uses: appleboy/ssh-action@v1
        with:
          host: \${{ secrets.DEV_EC2_HOST }}
          username: ec2-user
          key: \${{ secrets.EC2_SSH_KEY }}
          envs: IMAGE_TAG,AWS_REGION
          script: |
            set -e
            ECR_URI=\${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.$AWS_REGION.amazonaws.com/myapp-backend-dev:$IMAGE_TAG

            aws ecr get-login-password --region $AWS_REGION | \\
              docker login --username AWS --password-stdin \\
              \${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.$AWS_REGION.amazonaws.com

            docker pull $ECR_URI
            docker run --rm --env-file /app/.env $ECR_URI npx prisma migrate deploy

            docker stop myapp-backend-dev || true
            docker rm myapp-backend-dev || true

            docker run -d \\
              --name myapp-backend-dev \\
              --restart unless-stopped \\
              --env-file /app/.env \\
              -p 3000:3000 \\
              $ECR_URI

            docker image prune -f
            sleep 8
            curl -f http://localhost:3000/health || exit 1`} />
            <p>
              Add <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">DEV_EC2_HOST</code> to GitHub repository secrets
              (the dev Elastic IP). All other secrets are shared with the prod workflow.
            </p>
          </Section>

          <Section title="Step 8 — Frontend Dev Branch on Amplify">
            <p>
              The frontend is hosted on AWS Amplify. Adding a dev branch is a one-step operation inside
              the existing Amplify app — no new app needed.
            </p>
            <p>
              In the Amplify Console:
            </p>
            <ul>
              <li><strong>Hosting → Connect branch</strong> → select <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code></li>
              <li><strong>App settings → Environment variables</strong> → add <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">NEXT_PUBLIC_API_URL = https://api-dev.yourapp.com</code>, scoped to the <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code> branch only</li>
              <li><strong>Hosting → Custom domains → yourapp.com → Manage subdomains</strong> → add subdomain <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code> → branch <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code></li>
            </ul>
            <p>
              Because the domain is managed in Route 53 in the same AWS account, Amplify provisions
              the SSL certificate and creates the CNAME record automatically — no manual DNS work.
            </p>
            <Note>
              Scope the environment variable to the <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">dev</code> branch specifically,
              not &quot;All branches&quot;. If set globally, the prod Amplify build also picks it up and your
              production frontend starts hitting the dev API.
            </Note>
          </Section>

          <Section title="Verification">
            <p>After the first GitHub Actions deploy completes, verify both ends are live:</p>
            <CodeBlock language="bash" code={`# Backend health check
curl https://api-dev.yourapp.com/health
# {"status":"OK","timestamp":"2026-01-15T12:00:00.000Z"}

# Frontend — open in browser
# https://dev.yourapp.com`} />
          </Section>

          <Section title="Final State">
            <CodeBlock language="text" code={`Resource              Production              Dev
─────────────────────────────────────────────────────────────
EC2                   myapp-ec2             myapp-ec2-dev
RDS                   myapp-db (PG 15)      myapp-db-dev (PG 17.9)
S3                    myapp-uploads-prod    myapp-uploads-dev
ECR                   myapp-backend         myapp-backend-dev
Git branch            main                    dev
Backend domain        api.yourapp.com          api-dev.yourapp.com
Frontend              yourapp.com              dev.yourapp.com
Amplify branch        main                    dev
CI trigger            push to main            push to dev`} />
            <p>The workflow going forward:</p>
            <CodeBlock language="text" code={`feature branch
    → PR → merge into dev
           → auto-deploys to dev.yourapp.com
                  → test
                       → PR → merge into main
                              → auto-deploys to yourapp.com`} />
          </Section>

          <Section title="Cost Impact">
            <p>
              Dev EC2 t3.micro: ~$8.50/month. Dev RDS t3.micro: ~$18/month.
              Total dev overhead: <strong>~$27/month</strong>.
            </p>
            <p>
              If cost is a concern, stop both resources when not actively developing — they won&apos;t
              auto-deploy while stopped, but data persists and they restart in seconds.
            </p>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">AWS · EC2 · RDS · Docker · GitHub Actions · Amplify</span>
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
