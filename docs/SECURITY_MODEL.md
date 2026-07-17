# Security Model

## Auth And Session
Prototype uses a demo active Owner user only. The model is designed for Firebase Auth custom claims: role, status, projectMemberships, and financeAccess. Disabled Client identities fail authentication.

## Route Guards
`canAccessRoute` blocks anonymous users, disabled users, CLIENT portal users, finance routes without finance scope, and admin routes without Owner/Admin.

## Backend Guard Model
Cloud Functions should repeat the same checks server-side before reading or writing CRM, project, finance, user, and activity data. Frontend guards are UX protection, not the authority.

## Database Rule Model
`firestoreRulesModel` is fail-closed: unmatched documents deny read/write. Projects require owner/admin, project membership, or finance role; finance requires finance scope; audit logs cannot be updated or deleted.

## Runtime Read/Write Model
Runtime read functions filter finance, file/contract, project, and chat visibility. Runtime write guards block Viewer and all Client identities.

## Finance Isolation
FinanceRecord data requires financeAccess, Finance, Owner, or Admin. Project managers cannot see global finance unless granted.

## HR And People Isolation
Users and access routes require Owner/Admin. Future HR fields must be protected as sensitive workspace data.

## Project Membership
Project read/write checks require `projectMemberships` except for Owner/Admin and finance-only read cases.

## Internal/Client Boundary
`client-visible` threads currently return false because CLIENT portal is disabled. Internal notes are never readable by Client.

## Activity Log Protection
Activity supports create by signed-in users and denies update/delete in the rule model.

## Crawler And Indexing Limits
`robots.txt` and meta noindex are included, but they are guidance only. Auth, backend guards, database rules, and runtime guards are the real security boundary.

## Zero-Known Critical/High Target
Run `npm audit` before handoff. Do not add secrets, broad allow rules, real client data, or unauthenticated CRM fetches.
