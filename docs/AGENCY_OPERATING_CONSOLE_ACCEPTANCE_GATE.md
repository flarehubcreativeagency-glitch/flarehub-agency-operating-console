# Agency Operating Console Acceptance Gate

| Gate | Result | Evidence |
|---|---:|---|
| Product is Agency Operating Console | PASS | Dashboard, Project Room, Task Detail, modules |
| Not generic admin dashboard | PASS | Project-linked operations and role guards |
| Not CRM-only | PASS | Tasks, chat, files, finance, users, activity, settings |
| Not Huly clone | PASS | Native React/CSS, no Huly dependency |
| Project Room centrality | PASS | Main project aggregate links all operations |
| Chat linked to project/task | PASS | `ChatThread.projectId` and Task Detail comments |
| Tasks linked to project/milestone | PASS | `Task.projectId`, milestone roadmap |
| Files/contracts linked to project/client | PASS | `FileContract.projectId/clientId` |
| Finance Lite permission-scoped | PASS | `canReadFinance` and locked finance route |
| Activity Log object-level | PASS | `ActivityLog.objectType/objectId` |
| Users/Permission role/status/project membership | PASS | Role matrix implemented in runtime guards |
| People/Workload mini HRM direction | PASS | Profile, user roles, project participation |
| CLIENT portal disabled/deferred | PASS | Client role is disabled and unauthenticated |
| Visual direction preserved | PASS | Light SaaS shell, blue accents, soft cards |
| Security gates passed | PASS | Lint, build, audit, source QA, permission/auth/runtime/rules/domain tests passed |
