# Staging Deployment Plan

## Purpose
Validate FLARE HUB CRM OS v2 with fictional or approved staging data before any production decision.

## Required Credentials
- Firebase staging project credentials.
- Firebase Auth staging provider.
- Optional Google Drive staging OAuth credentials.
- Hosting provider token with staging-only permission.

## Safe Configuration
Credentials must be configured in hosting secret storage or CI/CD protected variables. Never commit `.env`, service account JSON, Firebase private keys, API keys, payment secrets, webhook secrets, or production credentials.

## Deployment Sequence
1. Owner approves staging target.
2. Configure staging secrets outside git.
3. Run lint, build, tests, audit, source QA.
4. Deploy only to staging.
5. Verify auth, route guards, finance scoping, Firestore rules, and noindex headers.

## Verification Sequence
Check Dashboard, Clients, Project Room, Task Detail, Chat, Files, Finance Lite, Users, Activity Log, Settings, and Profile with Owner, PM, Finance, Viewer, and disabled Client roles.

## Owner Checkpoints
Owner approval is required before staging credentials, external integrations, CLIENT portal, production deployment, or real data import.
