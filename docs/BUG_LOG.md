# Bug Log

| ID | Severity | Area | Root Cause | Impact | Fix | Verification | Status |
|---|---|---|---|---|---|---|---|
| BUG-001 | Medium | Workspace | Fresh folder was not a git repository | Commit/push cannot complete until repo is initialized or remote is provided | Report blocker, keep files safe locally | `git status` returned not a repository | Open |
| BUG-002 | Medium | Tooling | ESLint lacked TypeScript parser | Lint could not parse TS/TSX | Added `typescript-eslint` config | `npm.cmd run lint` passed | Fixed |
| BUG-003 | Medium | Build/Test | Vite/Vitest needed esbuild outside sandbox | Build/test failed with access denied while loading config | Approved/rebuilt esbuild and ran gates with approved escalation | Build and tests passed | Fixed |
