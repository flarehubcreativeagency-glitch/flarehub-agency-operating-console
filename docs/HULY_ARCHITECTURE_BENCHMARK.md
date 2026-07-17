# HULY Architecture Benchmark

## Why Huly Is A Benchmark
Huly is used only as a product architecture and workspace-density benchmark: object-centric work, connected modules, project/task/chat relationships, and panel-based detail patterns.

## What FLARE Learns
- Workspace shell becomes FLARE Agency Operating Console shell.
- Huly Chat maps to FLARE Project Chat, Internal Thread, and future DM.
- Huly Project Management maps to FLARE Project Room, Task, Milestone, and Activity.
- Huly CRM maps to FLARE Client, Lead, Deal, Proposal, and Relationship History.
- Huly HRM maps to FLARE People, Workload, and Permission.
- Huly ATS maps only to future Talent Pool or Vendor-Freelancer Pool parking lot.

## What FLARE Will Not Copy
FLARE does not copy Huly source code, Svelte components, dependencies, logos, assets, exact CSS, or pixel layouts. React, Vite, TypeScript, and FLARE-native styling are retained.

## Object-Centric Mapping
Project Room is the central object. Client, tasks, milestones, chat, feedback, deliverables, files, contracts, finance, risks, next actions, and activity are linked to a project rather than presented as disconnected dashboard widgets.

## Security Implications
- Chat visibility is separated into internal, client-visible, and DM.
- Finance records are role-scoped.
- Files and contracts are scoped by owner/admin, finance, or project membership.
- Activity logs are immutable after create in the rules model.
- CLIENT portal remains disabled until explicitly approved.

## Roadmap
Add live Firebase Auth, Firestore rule tests with emulator, Cloud Functions guard tests, staging-only Drive integration, and a future Talent Pool after owner approval.
