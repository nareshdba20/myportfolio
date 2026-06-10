import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Google OAuth in Next.js — Naresh Gowda",
  description:
    "How to implement Google Sign-In in a Next.js app — covering frontend setup, backend token verification, DB schema changes, and the build-time env var pitfalls that cause Error 401: invalid_client.",
};

export default function GoogleOAuthNextjs() {
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
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 8 min read</span>
            <span className="text-xs text-zinc-400 font-mono">Jun 10, 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Google OAuth in Next.js — And the Build-Time Env Var Trap That Causes 401
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            Adding Google Sign-In to a Next.js app sounds straightforward until you hit
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">Error 401: invalid_client</code>
            after deployment. Here is the full implementation — frontend, backend, DB schema — and the common pitfalls that waste hours of debugging.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="The Flow We're Implementing">
            <p>
              There are two common approaches for Google OAuth. We use the <strong>access token flow</strong>:
            </p>
            <CodeBlock language="text" code={`1. Frontend opens Google popup (useGoogleLogin)
2. User approves → Google returns an access_token to the frontend
3. Frontend sends access_token to your backend
4. Backend calls https://www.googleapis.com/oauth2/v3/userinfo with the token
5. Google returns the user's email, name, and Google ID
6. Backend creates or links the account, issues JWT tokens
7. User is logged in`} />
            <p>
              This approach does not require storing the Google Client Secret on the backend — the token
              is verified by calling Google's userinfo endpoint directly.
            </p>
          </Section>

          <Section title="Google Cloud Console Setup">
            <p>
              Before writing any code, create an OAuth 2.0 Client ID from Google Cloud Console.
            </p>
            <CodeBlock language="text" code={`1. Go to console.cloud.google.com
2. APIs & Services → OAuth consent screen
   → User type: External
   → Fill in app name, support email, developer email
   → Add scopes: email, profile, openid

3. APIs & Services → Credentials → Create Credentials
   → OAuth 2.0 Client ID → Web application
   → Authorised JavaScript origins:
       https://your-domain.com
       http://localhost:3000  (for local dev)
   → Authorised redirect URIs: leave empty for the token flow

4. Copy the Client ID — it ends with .apps.googleusercontent.com`} />
            <Note>
              Do not add redirect URIs unless you are using the authorization code flow. The access token flow does not need them.
            </Note>
          </Section>

          <Section title="Frontend: Install and Wrap the App">
            <CodeBlock language="bash" code={`npm install @react-oauth/google`} />
            <p>
              Wrap your root layout with <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">GoogleOAuthProvider</code> so every page can access the Google context:
            </p>
            <CodeBlock language="tsx" code={`// src/app/ClientLayout.tsx
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
}`} />
          </Section>

          <Section title="Frontend: Wire Up the Google Button">
            <p>
              Use the <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">useGoogleLogin</code> hook on your login and signup pages:
            </p>
            <CodeBlock language="tsx" code={`import { useGoogleLogin } from "@react-oauth/google";

const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const data = await googleAuth(tokenResponse.access_token);
      router.replace("/dashboard");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  },
  onError: () => setError("Google sign-in was cancelled or failed."),
});

// In JSX — attach to any button:
<button type="button" onClick={() => handleGoogleLogin()}>
  Continue with Google
</button>`} />
            <p>
              Send the access token to your API:
            </p>
            <CodeBlock language="ts" code={`// auth.service.ts
export const googleAuth = async (accessToken: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/google", { accessToken });
  saveTokens(res.data);
  return res.data;
};`} />
          </Section>

          <Section title="Backend: DB Schema Changes">
            <p>
              Google accounts have no password, and each Google account needs a unique identifier stored.
              Two schema changes are needed:
            </p>
            <CodeBlock language="prisma" code={`model User {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String?  // nullable — Google accounts have no password
  googleId   String?  @unique
  isVerified Boolean  @default(false)
  // ...
}`} />
            <CodeBlock language="sql" code={`ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_key" ON "users"("google_id");`} />
          </Section>

          <Section title="Backend: Verify the Token and Handle the Account">
            <p>
              The backend receives the access token, verifies it with Google, then handles three cases:
              existing Google account, existing email account (link Google to it), or brand new user.
            </p>
            <CodeBlock language="js" code={`export const googleAuth = async (accessToken) => {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: \`Bearer \${accessToken}\` },
  });
  if (!res.ok) throw new Error("Invalid Google token");

  const {
    sub: googleId,
    email,
    given_name: firstName = "",
    family_name: lastName = "",
  } = await res.json();

  const normalizedEmail = email.toLowerCase();

  // Case 1: already signed in with Google before
  let user = await findByGoogleId(googleId);
  if (user) return issueSession(user);

  // Case 2: email exists — link Google to it
  const existing = await findByEmail(normalizedEmail);
  if (existing) {
    user = await linkGoogleId(existing.id, googleId);
    return issueSession(user);
  }

  // Case 3: brand new user
  user = await createGoogleUser({ email: normalizedEmail, googleId, firstName, lastName });
  return issueSession(user);
};`} />
            <Note>
              Google accounts are automatically marked as verified since the email is confirmed by Google.
              No separate email verification step is needed.
            </Note>
          </Section>

          <Section title="Add the Route">
            <CodeBlock language="js" code={`// routes.js
router.post("/auth/google", googleAuthController);

// controller
export const googleAuthController = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    const result = await googleAuth(accessToken);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};`} />
          </Section>

          <Section title="The Env Var Trap — Error 401: invalid_client">
            <p>
              After deploying, the Google popup opened correctly but every sign-in returned
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">Error 401: invalid_client</code>.
              Two separate issues caused this.
            </p>
            <p><strong>Trap 1 — Wrong credential in the env var.</strong></p>
            <p>
              The env var was set in the deployment dashboard but the value pasted was the Client Secret, not the Client ID.
              They look completely different — make sure you copy the right one:
            </p>
            <CodeBlock language="text" code={`Client ID:     1234567890-abcdefgh.apps.googleusercontent.com  ✅ use this in NEXT_PUBLIC_
Client Secret: GOCSPX-xxxxxxxxxxxxxxxxxxxx                      ❌ never goes in the frontend`} />
            <p><strong>Trap 2 — NEXT_PUBLIC_ vars are baked at build time, not runtime.</strong></p>
            <p>
              In Next.js, any variable prefixed with
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">NEXT_PUBLIC_</code>
              is inlined into the JavaScript bundle during <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">next build</code>.
              If the variable is not present in the build environment, it bakes in as an empty string —
              no error is thrown, the build succeeds, and you only find out at runtime when Google rejects the empty client ID.
            </p>
            <p>
              Always verify the value made it into the deployed bundle by checking in the browser console:
            </p>
            <CodeBlock language="js" code={`// Run in browser console after deploy
Array.from(document.querySelectorAll('script'))
  .some(s => s.textContent.includes('your-client-id-prefix'))
// Should return true — if false, the var was empty at build time`} />
            <Note>
              If your CI/CD pipeline injects env vars from a secrets manager or parameter store,
              confirm the build step has permission to read them before
              <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded mx-1">next build</code> runs.
              A silent read failure is the most common reason a correctly-configured env var still ends up empty in the bundle.
            </Note>
          </Section>

          <Section title="What Does Not Need to Change">
            <CodeBlock language="text" code={`Backend .env    → no Google credentials needed for the token flow
Client Secret   → unused in this approach entirely
Redirect URIs   → not needed for the access token flow
isVerified      → set true automatically (Google already verified the email)`} />
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Google OAuth · Next.js · Node.js · Prisma · Auth</span>
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
