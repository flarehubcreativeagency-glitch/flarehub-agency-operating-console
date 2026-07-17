# Fix Plan

## Product Fixes
- Built Project Room as the operating center.
- Added module screens for CRM, projects, tasks, chat, feedback, deliverables, files, finance, users, activity, settings, and profile.

## UI Fixes
- Matched FLARE references with white/off-white background, soft cards, blue actions, pale sidebar, compact header, and Vietnamese labels.
- Prevented profile and task layouts from collapsing into narrow strips.

## Security Fixes
- Added fail-closed runtime guards.
- Added finance scoping, project membership checks, disabled CLIENT portal, and Firestore rules model.

## Test Fixes
- Added permission, runtime read/write, Firestore rules model, and domain aggregate tests.

## Staging Fixes
- Added staging plan and hosting security headers plan.

## Unresolved Non-Blockers
- Git commit/push needs an initialized repository and remote.
- Live Firebase emulator rule tests require staging Firebase setup.
