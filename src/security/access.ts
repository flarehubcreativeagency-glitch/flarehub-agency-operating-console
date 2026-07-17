import type { FinanceRecord, FileContract, Role, User, Visibility } from '../domain/types';

const adminRoles: Role[] = ['Owner', 'Admin'];
const crmRoles: Role[] = ['Owner', 'Admin', 'Project Manager', 'Account / CRM'];
const writeRoles: Role[] = ['Owner', 'Admin', 'Project Manager', 'Account / CRM', 'Finance', 'Member'];

export function isAuthenticated(user: User | null | undefined): user is User {
  return Boolean(user && user.status === 'active' && user.role !== 'Client');
}

export function canAccessRoute(user: User | null | undefined, route: string): boolean {
  if (!isAuthenticated(user)) return false;
  if (route === 'settings' || route === 'users' || route === 'activity') return adminRoles.includes(user.role);
  if (route === 'finance') return user.financeAccess || user.role === 'Finance' || adminRoles.includes(user.role);
  if (route === 'clients') return crmRoles.includes(user.role);
  return true;
}

export function canReadProject(user: User | null | undefined, projectId: string): boolean {
  if (!isAuthenticated(user)) return false;
  if (adminRoles.includes(user.role) || user.role === 'Finance') return true;
  return user.projectMemberships.includes(projectId);
}

export function canWriteProject(user: User | null | undefined, projectId: string): boolean {
  if (!isAuthenticated(user)) return false;
  if (!writeRoles.includes(user.role) || user.role === 'Viewer') return false;
  if (adminRoles.includes(user.role)) return true;
  return user.projectMemberships.includes(projectId);
}

export function canReadFinance(user: User | null | undefined, record: FinanceRecord): boolean {
  if (!isAuthenticated(user)) return false;
  if (record.permissionScope !== 'finance') return false;
  return user.financeAccess || user.role === 'Finance' || adminRoles.includes(user.role);
}

export function canReadFileContract(user: User | null | undefined, item: FileContract): boolean {
  if (!isAuthenticated(user)) return false;
  if (item.permissionScope === 'client-disabled') return false;
  if (item.permissionScope === 'owner-admin') return adminRoles.includes(user.role);
  if (item.permissionScope === 'finance') return user.financeAccess || user.role === 'Finance' || adminRoles.includes(user.role);
  return canReadProject(user, item.projectId);
}

export function canReadThread(user: User | null | undefined, visibility: Visibility, participants: string[]): boolean {
  if (!isAuthenticated(user)) return false;
  if (visibility === 'client-visible') return false;
  if (visibility === 'dm') return participants.includes(user.id);
  return true;
}

export const firestoreRulesModel = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null && request.auth.token.status == 'active'; }
    function ownerAdmin() { return signedIn() && request.auth.token.role in ['Owner', 'Admin']; }
    function projectMember(projectId) { return signedIn() && projectId in request.auth.token.projectMemberships; }
    function financeAllowed() { return signedIn() && (request.auth.token.financeAccess == true || request.auth.token.role in ['Owner', 'Admin', 'Finance']); }

    match /clients/{clientId} {
      allow read: if signedIn() && request.auth.token.role in ['Owner', 'Admin', 'Project Manager', 'Account / CRM'];
      allow write: if ownerAdmin() || request.auth.token.role == 'Account / CRM';
    }
    match /projects/{projectId} {
      allow read: if ownerAdmin() || projectMember(projectId) || request.auth.token.role == 'Finance';
      allow write: if ownerAdmin() || (projectMember(projectId) && request.auth.token.role in ['Project Manager', 'Member']);
    }
    match /financeRecords/{recordId} {
      allow read, write: if financeAllowed();
    }
    match /activityLogs/{logId} {
      allow read: if ownerAdmin();
      allow create: if signedIn();
      allow update, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
`;
