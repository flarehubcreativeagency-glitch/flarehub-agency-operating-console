# Security Hardening Review

| Area | Check | Result | Fix | Remaining Risk | Production Requirement |
|---|---|---|---|---|---|
| Authentication | Anonymous and disabled Client fail closed | PASS | `isAuthenticated` rejects missing, inactive, and Client identities | Demo frontend only | Replace demo user with Firebase Auth session |
| Authorization | Route access by role | PASS | `canAccessRoute` guards finance/admin/CRM areas | Client-side guard is not authority | Mirror all checks in backend |
| Project isolation | Project read/write scoped | PASS | `canReadProject` and `canWriteProject` enforce membership/role | Demo data is bundled | Fetch project data only after auth |
| Finance isolation | Finance records scoped | PASS | `canReadFinance` requires financeAccess, Finance, Owner, or Admin | Demo owner can see finance | Backend and Firestore must enforce same rule |
| File/contract isolation | Contract/file scope | PASS | `canReadFileContract` supports owner-admin, finance, project-members, client-disabled | No live storage integration | Signed storage URLs must be auth-scoped |
| Chat boundary | Internal/client boundary | PASS | `client-visible` denied while client portal deferred | No client portal yet | Explicit client portal approval and separate data model |
| Firestore rules | Deny by default, no allow-if-true | PASS | `firestoreRulesModel` denies unmatched docs and audit update/delete | Model is not deployed rules file | Convert to live rules and emulator tests |
| Secrets | Search patterns and .gitignore | PASS | QA blocks key patterns and repo ignores env/service account artifacts | Manual credential handling still needed | Store production secrets only in provider secret manager |
| Dependencies | Critical/High audit | PASS | `npm audit --audit-level=high` returns 0 vulnerabilities | Future dependency drift | Re-run audit before deploy |
| XSS | Unsafe HTML rendering | PASS | No `dangerouslySetInnerHTML` usage found | Future rich text | Add sanitizer before markdown/rich text |
| Supply chain | No Huly/Svelte/Google AI Studio dependency | PASS | QA/search found no source adaptation or dependency | Benchmark docs mention Huly only | Keep benchmark-only policy |
| Repo hygiene | No generated junk committed | PASS | `.gitignore` excludes `node_modules`, `dist`, `graphify-out`, envs | Local build creates ignored `dist` | Verify staged files before deploy branch |
