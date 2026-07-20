import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const serverDir = join(process.cwd(), 'dist', 'server');
mkdirSync(serverDir, { recursive: true });

writeFileSync(
  join(serverDir, 'index.js'),
  `const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-Robots-Tag": "noindex, nofollow, noarchive, noimageindex"
};

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(securityHeaders)) headers.set(key, value);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return withSecurityHeaders(assetResponse);

    if (request.method === "GET" && !url.pathname.includes(".")) {
      const indexRequest = new Request(new URL("/index.html", request.url), request);
      return withSecurityHeaders(await env.ASSETS.fetch(indexRequest));
    }

    return withSecurityHeaders(assetResponse);
  }
};
`,
  'utf8'
);

console.log('Sites worker generated');
