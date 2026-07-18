# UI Visual Review

| Screen | Issue | Severity | Fix | Verification | Status |
|---|---|---:|---|---|---|
| Dashboard | Needs operating-center density without clutter | Low | Existing metric cards, charts, blocker/activity sections retained | Source + build | PASS |
| Project Room | Must remain central and not collapse into narrow strips | Low | Header, tabs, milestone, chat, feedback, file, finance, activity grid retained | Source + build | PASS |
| Task Detail | Icon controls needed visible behavior and accessible labels | Medium | Attach/send buttons now have handlers and aria-labels | `qa:source` | FIXED |
| Profile | Avatar/save/edit controls needed safe behavior | Medium | Buttons show safe local toast; toggles update local state | `qa:source` | FIXED |
| Settings | Integration actions must not imply real sync | Medium | Drive/export buttons show safe prototype toast | `qa:source` | FIXED |
| People / Workload | Missing first-class module signal | Medium | Added nav item and scaffolded internal workload list | Source + build | FIXED |
| Talent Pool | ATS foundation not visible in UI | Medium | Added safe parking-lot Talent Pool module | Source + build | FIXED |
| All screens | Mojibake, lorem, unfinished placeholder risk | High | Source QA blocks known markers | `npm run qa:source` | PASS |
| All screens | Icon-only buttons without labels | High | Source QA blocks unlabeled icon buttons | `npm run qa:source` | PASS |
| Responsive risk | Full console is dense desktop SaaS | Low | CSS has desktop baseline and constrained tablet fallback | Source inspection | PASS |
