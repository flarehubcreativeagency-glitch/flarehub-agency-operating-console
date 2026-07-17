# Hosting Security Headers Plan

## Recommended Headers
- `Content-Security-Policy`: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' Firebase staging endpoints only.
- `frame-ancestors 'none'` or `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: no-referrer`.
- `Permissions-Policy`: camera=(), microphone=(), geolocation=(), payment=().
- `X-Robots-Tag`: noindex, nofollow, noarchive, noimageindex.
- `Cache-Control`: no-store for authenticated CRM routes and API responses.

## WAF And Bot Protection
Use hosting WAF, rate limiting, abuse monitoring, and bot challenge rules for login and API endpoints.

## Important Limit
Robots and noindex are not security controls. CRM data must not be public static HTML and unauthenticated users must not fetch CRM data.
