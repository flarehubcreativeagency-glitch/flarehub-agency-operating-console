export type Role = 'Owner' | 'Admin' | 'Project Manager' | 'Account / CRM' | 'Finance' | 'Member' | 'Viewer' | 'Client';
export type Visibility = 'internal' | 'client-visible' | 'dm';
export type PermissionScope = 'owner-admin' | 'finance' | 'project-members' | 'client-disabled';
export type ObjectType = 'user' | 'client' | 'project' | 'task' | 'chat' | 'file' | 'finance' | 'activity';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'active' | 'disabled';
  projectMemberships: string[];
  financeAccess: boolean;
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  industry: string;
  relationshipOwner: string;
  projects: string[];
  notes: string[];
  activity: string[];
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'done' | 'current' | 'upcoming';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  owner: string;
  status: 'todo' | 'doing' | 'blocked' | 'review' | 'done';
  priority: 'P1' | 'P2' | 'P3';
  dueDate: string;
  comments: string[];
  deliverables: string[];
  activity: string[];
}

export interface ChatThread {
  id: string;
  projectId?: string;
  taskId?: string;
  visibility: Visibility;
  participants: string[];
  messages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FileContract {
  id: string;
  projectId: string;
  clientId: string;
  type: 'file' | 'contract';
  status: 'draft' | 'review' | 'approved' | 'signed';
  version: string;
  owner: string;
  permissionScope: PermissionScope;
  activity: string[];
}

export interface FinanceRecord {
  id: string;
  projectId: string;
  clientId: string;
  type: 'quote' | 'invoice' | 'payment' | 'cost' | 'margin' | 'retainer';
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'pending' | 'internal';
  permissionScope: PermissionScope;
  updatedBy: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  objectType: ObjectType;
  objectId: string;
  action: string;
  timestamp: string;
  visibility: Visibility;
  metadata: Record<string, string>;
}

export interface Project {
  id: string;
  clientId: string;
  code: string;
  name: string;
  status: 'planning' | 'active' | 'at-risk' | 'paused' | 'done';
  owner: string;
  team: string[];
  deadline: string;
  progress: number;
  health: number;
  milestones: Milestone[];
  tasks: string[];
  chatThreads: string[];
  files: string[];
  contracts: string[];
  financeSnapshot: { budget: number; paid: number; remaining: number; margin: number };
  risks: string[];
  nextActions: string[];
  activity: string[];
}
