# UAT Checklist

| Screen | Access Control | Layout | Vietnamese Copy | Data Exposure | Role Behavior | Owner Result |
|---|---|---|---|---|---|---|
| Dashboard | Auth required | Sidebar/header/cards | Clean | Demo only | All internal roles | Pending |
| Clients | CRM roles | List readable | Clean | Fictional clients | Viewer blocked if unscoped | Pending |
| Project Room | Membership | Header/tabs/cards | Clean | Project-linked demo | Finance scoped | Pending |
| Task Detail | Membership | List/detail/rail | Clean | Project task demo | Viewer read-only | Pending |
| Chat | Internal only | Thread list/cards | Clean | No client leakage | Client disabled | Pending |
| Files & Contracts | Scope guard | Document cards/list | Clean | Demo files only | Contract owner/admin | Pending |
| Finance Lite | Finance scope | Snapshot/list | Clean | Fictional numbers | Non-finance blocked | Pending |
| Users & Permission | Owner/Admin | Role rows | Clean | Demo users | Admin only | Pending |
| Activity Log | Owner/Admin | Audit rows | Clean | Object-level demo | Immutable model | Pending |
| Settings | Owner/Admin | Safe placeholders | Clean | No credentials | Placeholder only | Pending |
| Profile | Auth required | Cards and right rail | Clean | Demo profile | Personal settings | Pending |
