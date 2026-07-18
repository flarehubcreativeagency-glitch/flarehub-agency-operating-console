# Interaction Audit

Scope: Dashboard, Clients / CRM, Projects, Project Room, Task Detail, Project Chat, Client Feedback, Deliverables, Files / Drive, Finance Lite, Users & Quyen truy cap, Activity Log, Settings, Profile.

## Summary

| Metric | Result |
|---|---:|
| Total primary screens checked | 15 |
| Dead buttons found | 18 |
| Buttons fixed | 18 |
| Buttons disabled with reason | 0 |
| Permission-sensitive buttons verified | 6 |
| Remaining blocked actions | 0 |
| No primary CRM button silently does nothing | PASS |

## Audit Table

| Screen | Element / Button | Intended business purpose | Current behavior | Final behavior | Permission rule if any | Status | Verification method |
|---|---|---|---|---|---|---|---|
| Global Shell | Sidebar collapse icon | Collapse navigation | Previously visual-only | Shows safe local toast | Authenticated shell only | FIXED | Source QA + manual source inspection |
| Global Shell | Notification icon | Open notification center | Previously visual-only | Navigates to Profile notification rail | Authenticated shell only | FIXED | Source QA |
| Global Shell | Search input Enter | Search CRM objects | Previously passive input | Keeps local query and shows safe local search toast on Enter | No restricted backend fetch | FIXED | Source inspection |
| Global Shell | Sidebar nav | Navigate modules | Working navigation | Navigates correct in-app view or locked view | Route guard via `canAccessRoute` | PASS | Source inspection |
| Dashboard | Dashboard filter tabs | Change operating lens | Static active state | Switches active tab and visible "Dang xem" panel | None | FIXED | Source QA + UI logic |
| Dashboard | Xem bao cao tai chinh | Open finance report | Previously anchor without action | Safe finance demo toast | Finance data remains scoped | FIXED | Source QA |
| Dashboard | Xem chi tiet links | Drill into charts | Previously anchor without action | Safe demo action toast | None | FIXED | Source QA |
| Clients / CRM | Client rows | Review client data | Read-only module list | Fictional client data only, no external fetch | CRM route guard | PASS | Source inspection |
| Projects | Project Room navigation | Open operational project room | Working module route | Shows Project Room aggregate | Project membership documented | PASS | Source inspection |
| Project Room | Project tabs | Switch room sections | Static active state | Switches active tab and visible tab panel label | None | FIXED | Source QA |
| Project Room | Xem tat ca / Xem chi tiet | Drill into feedback/files/finance/activity | Previously anchor without action | Safe demo toast per action | Finance action warns scoped access | FIXED | Source QA |
| Project Room | Chat send | Add internal project message | Icon-only visual | Adds message to local internal thread and shows boundary toast | Internal only; client portal disabled | FIXED | Source QA |
| Project Room | Chat attach | Attach file to thread | Icon-only visual | Safe Drive-not-connected toast | No real Drive credential | FIXED | Source QA |
| Task Detail | Tao task | Create task | Previously dead button | Opens safe demo form toast | Write requires backend permission | FIXED | Source QA |
| Task Detail | Task cards | Select task detail | Previously visual selection | Shows selected-task demo toast | Project membership | FIXED | Source QA |
| Task Detail | Quay lai danh sach | Return to task list | Previously dead button | Focus/navigation toast | Project membership | FIXED | Source QA |
| Task Detail | Sua task | Edit task | Previously dead button | Safe edit drawer toast | Write guard required for real backend | FIXED | Source QA |
| Task Detail | Tao subtask | Create subtask | Previously anchor without action | Safe demo action toast | Write guard required for real backend | FIXED | Source QA |
| Task Detail | Comment attach/send | Attach or send comment | Icon-only visual | Safe attach toast and internal comment toast | Internal/project scope | FIXED | Source QA |
| Task Detail | Row action menu | Open row actions | Static icon | Icon button with aria-label and safe toast | Respects screen route | FIXED | Source QA |
| Project Chat | Send message | Add internal thread message | Static icons | Adds local demo message, clears draft, shows internal boundary toast | No client-visible leakage | FIXED | Source QA |
| Client Feedback | Feedback rows | Review feedback queue | Read-only module list | Fictional feedback linked to project | CRM/project scope | PASS | Source inspection |
| Deliverables | Deliverable rows | View deliverable status | Read-only module list | Fictional deliverable data only | Project scope | PASS | Source inspection |
| Files / Drive | File rows | Inspect file/contract status | Read-only module list | Shows safe demo scope/status only | `canReadFileContract` documented | PASS | Source inspection |
| Finance Lite | Finance rows | Inspect finance records | Guarded list | Filters with `canReadFinance` | Owner/Admin/Finance/financeAccess | PASS | Unit tests |
| Users & Permission | User rows | Inspect role matrix | Guarded list | Owner/Admin route only | `canAccessRoute` | PASS | Unit tests |
| People / Workload | Workload rows | Inspect team capacity and project membership | Scaffolded module list | Shows fictional team workload and status only | Internal authenticated route | PASS | Source inspection |
| Talent Pool | Talent rows | Park future vendor/freelancer/ATS foundation | Scaffolded parking-lot module | Shows safe locked roadmap with no real candidate data | Client/candidate portal not enabled | PASS | Source inspection |
| Activity Log | Audit rows | Inspect immutable activity | Guarded list | Owner/Admin route only; rule model denies update/delete | Audit protected | PASS | Unit tests |
| Settings | System tabs | Switch settings section | Static active state | Switches active tab and visible panel label | Owner/Admin route | FIXED | Source QA |
| Settings | Dong bo file mo phong | Drive sync placeholder | Previously dead button | Safe toast: no real Drive sync, no credentials | No real integration | FIXED | Source QA |
| Settings | Mo phong xuat du lieu | Export placeholder | Previously dead button | Safe toast: no real DB/export | No production data | FIXED | Source QA |
| Settings | Toggle switches | Change local setting | Static visual switch | Toggles local state | No backend write | FIXED | Source QA |
| Profile | Chinh sua | Edit profile | Previously anchor without action | Safe demo action toast | Authenticated profile | FIXED | Source QA |
| Profile | Tai anh len / Xoa anh | Avatar update | Previously dead button | Safe local toast, no file write | Backend required for real avatar | FIXED | Source QA |
| Profile | Xem chi tiet quyen han | Review access | Previously dead button | Safe permission detail toast | Auth claims/backend for real rights | FIXED | Source QA |
| Profile | Luu tuy chon | Save notification preferences | Previously dead button | Safe local save toast | Backend required for persistence | FIXED | Source QA |
| Profile | Notification toggles | Change preference | Static switch | Toggles local state | No backend write | FIXED | Source QA |

## Automated QA

`npm run qa:source` checks:
- mojibake markers;
- lorem text and unfinished placeholder labels;
- broad public database rules;
- Huly dependency/import patterns;
- credential copy hazards;
- buttons without `onClick`, `disabled`, or `data-action`;
- buttons without `type`;
- icon buttons without `aria-label`;
- anchors without `href`, `onClick`, or `data-action`.
