# Anti-Crawl / AI Bot Protection

## Implemented Protection

| Layer | Status | Evidence |
|---|---|---|
| `robots.txt` | PASS | Disallows all crawlers and states robots is guidance only |
| HTML metadata | PASS | `noindex,nofollow,noarchive,noimageindex` in `index.html` |
| Auth-first model | PASS | Runtime guards fail closed for anonymous/inactive/Client identities |
| No public JSON endpoints | PASS | No backend/API endpoints are present in this frontend build |
| No public sitemap | PASS | No sitemap file exists |
| No broad rules | PASS | Source QA blocks public read/write allow rules |

## Required Hosting-Level Protection

| Requirement | Production Action |
|---|---|
| Authentication before CRM data | Serve sensitive data only after Firebase/Auth session and backend permission checks |
| CSP | Configure restrictive Content-Security-Policy for production domain |
| Frame protection | Use `frame-ancestors 'none'` or `X-Frame-Options: DENY` |
| MIME protection | Use `X-Content-Type-Options: nosniff` |
| Referrer control | Use `Referrer-Policy: no-referrer` |
| Permissions policy | Disable camera, microphone, geolocation, payment unless explicitly needed |
| Cache control | `Cache-Control: no-store` for authenticated CRM responses |
| HSTS | Enable HSTS on production HTTPS domain |
| WAF/rate limiting | Add WAF, abuse throttling, and login/API rate limits |
| AI crawler controls | Block common AI crawler user agents at hosting/WAF where possible |

## Verification Checklist

- No unauthenticated request can fetch CRM/client/project/finance payloads.
- Internal app routes are not public static CRM data dumps.
- No public preview endpoint exposes demo data that looks real.
- Robots/noindex are treated as crawler guidance, not as security.
- Backend/database rules are the real protection before production.

## Remaining Owner Action
Provide production hosting, auth, WAF/rate-limit, and Firebase/backend configuration so these controls can be enforced outside the frontend.
