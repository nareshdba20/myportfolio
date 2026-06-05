import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowLeft, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Multiple WebSocket Servers on the Same Node.js HTTP Server — Naresh Gowda",
  description:
    "When you add a second WebSocket server to the same HTTP server in Node.js, connections silently fail. The fix using noServer: true with manual upgrade handling.",
};

export default function NodeJSMultipleWebSockets() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl px-5 sm:px-8 md:px-12 pt-14 pb-20">

        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-10">
          <ArrowLeft size={13} /> Back to Blog
        </Link>

        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-medium border border-blue-200 dark:border-blue-500/20">
              <Tag size={10} /> DevOps
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono"><Clock size={11} /> 4 min read</span>
            <span className="text-xs text-zinc-400 font-mono">Jun 1, 2025</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            Running Multiple WebSocket Servers on the Same Node.js HTTP Server
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            I hit this today while adding a second WebSocket server to an existing Node.js app. The first server worked fine.
            The second one silently failed — WebSocket connections refused with no error on the server side.
            Here&apos;s exactly what happened and how I fixed it.
          </p>
        </div>

        <div className="space-y-1">

          <Section title="The Setup">
            <p>
              I had an existing Node.js Express app with one WebSocket server for real-time streaming on <code>/stream-a</code>.
              I needed to add a second WebSocket server on a different path <code>/stream-b</code>.
            </p>
            <p>The natural thing to do — create two <code>WebSocketServer</code> instances on the same HTTP server:</p>
            <CodeBlock language="javascript" code={`import { WebSocketServer } from 'ws';

const serverA = new WebSocketServer({ server: httpServer, path: '/stream-a' });
const serverB = new WebSocketServer({ server: httpServer, path: '/stream-b' });`} />
          </Section>

          <Section title="The Problem">
            <p>
              After adding <code>serverB</code>, the browser showed:
            </p>
            <CodeBlock language="bash" code={`WebSocket connection to 'wss://api.yourdomain.com/stream-b' failed:`} />
            <p>
              The backend showed <strong>zero logs</strong> — no connection attempt, no error.
              Server A continued working perfectly. Server B was completely silent.
            </p>
            <p>
              Running a curl test confirmed the endpoint was reachable:
            </p>
            <CodeBlock language="bash" code={`curl -i -N \\
  -H "Connection: Upgrade" \\
  -H "Upgrade: websocket" \\
  https://api.yourdomain.com/stream-b

# Returns:
HTTP/1.1 400 Bad Request
Missing or invalid Sec-WebSocket-Key header`} />
            <p>
              The 400 from the ws library meant the endpoint was reachable — but browser WebSocket connections were still failing.
            </p>
          </Section>

          <Section title="Why It Happens">
            <p>
              When you create a <code>WebSocketServer</code> with <code>{'{ server: httpServer }'}</code>,
              the ws library attaches its own <code>upgrade</code> event listener to the HTTP server.
            </p>
            <p>
              The problem: <strong>the first WebSocketServer&apos;s upgrade listener consumes the upgrade event</strong>.
              When a second server is attached the same way, it never receives the upgrade request
              because the first listener already handled it — and rejected it since the path didn&apos;t match.
            </p>
            <CodeBlock language="javascript" code={`// What ws does internally when you pass { server: httpServer }:
httpServer.on('upgrade', (req, socket, head) => {
  // serverA handles ALL upgrade requests
  // If path is /stream-b → serverA rejects it → serverB never sees it
});`} />
            <Note>
              This is a known limitation of the ws library when multiple instances share the same HTTP server.
              The path option does NOT create separate isolated listeners — it just filters inside one shared listener.
            </Note>
          </Section>

          <Section title="The Fix — noServer: true">
            <p>
              The solution is to take manual control of the HTTP upgrade event using <code>noServer: true</code>.
              Each WebSocket server opts out of auto-attaching to the HTTP server, and you route upgrade
              requests to the right server yourself.
            </p>
            <CodeBlock language="javascript" code={`import { WebSocketServer } from 'ws';
import { URL } from 'url';

// Both servers opt out of auto-attaching
const serverA = new WebSocketServer({ noServer: true });
const serverB = new WebSocketServer({ noServer: true });

// You handle the HTTP upgrade event once
httpServer.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, 'http://localhost');

  if (pathname === '/stream-a') {
    serverA.handleUpgrade(request, socket, head, (ws) => {
      serverA.emit('connection', ws, request);
    });
    return;
  }

  if (pathname === '/stream-b') {
    serverB.handleUpgrade(request, socket, head, (ws) => {
      serverB.emit('connection', ws, request);
    });
    return;
  }

  // Unknown path — destroy the socket
  socket.destroy();
});`} />
          </Section>

          <Section title="Clean Pattern for Multiple Servers">
            <p>
              If you have many WebSocket servers, a map-based router is cleaner:
            </p>
            <CodeBlock language="javascript" code={`const wsServers = new Map([
  ['/stream-a', new WebSocketServer({ noServer: true })],
  ['/stream-b', new WebSocketServer({ noServer: true })],
  ['/stream-c', new WebSocketServer({ noServer: true })],
]);

httpServer.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  const wss = wsServers.get(pathname);

  if (!wss) { socket.destroy(); return; }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});`} />
          </Section>

          <Section title="Key Takeaways">
            <ul>
              <li>
                <strong>Never</strong> attach two <code>WebSocketServer</code> instances to the same HTTP server
                using <code>{'{ server: httpServer }'}</code> — only the first one will actually receive connections.
              </li>
              <li>
                Use <code>{'{ noServer: true }'}</code> on all instances and handle routing yourself
                via a single <code>httpServer.on(&apos;upgrade&apos;, ...)</code> listener.
              </li>
              <li>
                The curl 400 &quot;Missing Sec-WebSocket-Key&quot; test is useful — it confirms
                the endpoint is reachable even when browser WebSocket fails.
              </li>
              <li>
                If a path doesn&apos;t match any WebSocket server, call <code>socket.destroy()</code>
                to cleanly close the connection instead of leaving it hanging.
              </li>
            </ul>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft size={14} /> All posts
          </Link>
          <span className="text-xs text-zinc-400 font-mono">Node.js · WebSocket · ws · DevOps</span>
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
