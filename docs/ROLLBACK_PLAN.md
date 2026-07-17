# Rollback Plan

## Last Known Good Commit
Record the verified commit SHA after git initialization and successful local gates.

## Hosting Rollback
Use the hosting provider's previous staging release rollback. Verify auth, data fetches, noindex headers, and finance scoping after rollback.

## Git Rollback
Preferred: create a revert commit for the faulty change. Avoid force push. Use branch protection for main.

## Verification After Rollback
Run lint, build, security tests, audit, source QA, and smoke primary routes.

## Emergency Flow
1. Freeze deploys.
2. Disable affected integration.
3. Roll back staging or production release.
4. Verify access boundaries.
5. Document root cause in `BUG_LOG.md`.
