import type { ActivityLog, ChatThread, Client, FileContract, FinanceRecord, Project, Task, User } from './types';

export const currentUser: User = {
  id: 'u-owner',
  name: 'Quốc Uy (Flarehub)',
  email: 'quocuy@example.com',
  role: 'Owner',
  department: 'Product Development',
  status: 'active',
  projectMemberships: ['p-web-redesign', 'p-launch-q3'],
  financeAccess: true
};

export const users: User[] = [
  currentUser,
  { id: 'u-pm', name: 'Minh Anh', email: 'minhanh@example.com', role: 'Project Manager', department: 'Delivery', status: 'active', projectMemberships: ['p-web-redesign'], financeAccess: false },
  { id: 'u-crm', name: 'Hải Yến', email: 'haiyen@example.com', role: 'Account / CRM', department: 'Account', status: 'active', projectMemberships: ['p-web-redesign'], financeAccess: false },
  { id: 'u-fin', name: 'Lan Chi', email: 'lanchi@example.com', role: 'Finance', department: 'Finance', status: 'active', projectMemberships: [], financeAccess: true },
  { id: 'u-viewer', name: 'Tuấn Kiệt', email: 'tuankiet@example.com', role: 'Viewer', department: 'Strategy', status: 'active', projectMemberships: ['p-web-redesign'], financeAccess: false },
  { id: 'u-client', name: 'Client Portal Disabled', email: 'client-disabled@example.com', role: 'Client', department: 'External', status: 'disabled', projectMemberships: [], financeAccess: false }
];

export const clients: Client[] = [
  {
    id: 'c-abc',
    name: 'Công ty ABC Demo',
    contact: 'Nguyễn Minh Anh - ceo@example.com',
    industry: 'Thương mại điện tử',
    relationshipOwner: 'Hải Yến',
    projects: ['p-web-redesign'],
    notes: ['Đang chờ xác nhận CTA cuối cùng', 'Ưu tiên tốc độ tải trang'],
    activity: ['Đã gửi feedback mới', 'Đã duyệt milestone phân tích']
  }
];

export const projects: Project[] = [
  {
    id: 'p-web-redesign',
    clientId: 'c-abc',
    code: 'FLA-PRJ-012',
    name: 'Website Redesign Q2',
    status: 'active',
    owner: 'Quốc Uy',
    team: ['Minh Anh', 'Hải Yến', 'Designer Huy'],
    deadline: '2026-08-30',
    progress: 68,
    health: 82,
    milestones: [
      { id: 'm1', title: 'Khởi động', date: '2026-06-10', status: 'done' },
      { id: 'm2', title: 'Phân tích', date: '2026-06-18', status: 'done' },
      { id: 'm3', title: 'Thiết kế UI/UX', date: '2026-07-30', status: 'current' },
      { id: 'm4', title: 'Phát triển', date: '2026-08-15', status: 'upcoming' },
      { id: 'm5', title: 'Kiểm thử', date: '2026-08-25', status: 'upcoming' },
      { id: 'm6', title: 'Bàn giao', date: '2026-08-30', status: 'upcoming' }
    ],
    tasks: ['t-home-ui', 't-styleguide', 't-performance', 't-content'],
    chatThreads: ['chat-project'],
    files: ['f-styleguide'],
    contracts: ['fc-contract'],
    financeSnapshot: { budget: 150000000, paid: 75000000, remaining: 75000000, margin: 32 },
    risks: ['Thiếu feedback CTA từ khách hàng', 'Tối ưu tốc độ tải trang cần xác nhận kỹ thuật'],
    nextActions: ['Chốt CTA trang chủ', 'Review UI mobile', 'Gửi bản demo milestone 3'],
    activity: ['Designer Huy upload bản thiết kế v2', 'Minh Anh cập nhật feedback', 'Quốc Uy tạo task mới']
  }
];

export const tasks: Task[] = [
  { id: 't-home-ui', projectId: 'p-web-redesign', title: 'Thiết kế UI trang chủ', owner: 'Minh Anh', status: 'doing', priority: 'P1', dueDate: '2026-07-19', comments: ['Ưu tiên hero rõ CTA', 'Chỉ dùng animation nhẹ'], deliverables: ['Homepage_UI_v2.fig'], activity: ['Minh Anh cập nhật trạng thái', 'Quốc Uy đính kèm file'] },
  { id: 't-styleguide', projectId: 'p-web-redesign', title: 'Xây dựng style guide', owner: 'Designer Huy', status: 'todo', priority: 'P2', dueDate: '2026-07-21', comments: ['Đồng bộ token màu FLARE'], deliverables: ['Styleguide_v1.2.pdf'], activity: ['Task được tạo từ milestone UI/UX'] },
  { id: 't-performance', projectId: 'p-web-redesign', title: 'Tối ưu tốc độ tải trang', owner: 'Quốc Uy', status: 'blocked', priority: 'P1', dueDate: '2026-07-28', comments: ['Đợi cấu hình hosting staging'], deliverables: [], activity: ['Blocker được mở'] },
  { id: 't-content', projectId: 'p-web-redesign', title: 'Chuẩn bị nội dung trang giới thiệu', owner: 'Hải Yến', status: 'done', priority: 'P3', dueDate: '2026-07-27', comments: ['Nội dung đã gửi client duyệt'], deliverables: ['About_Copy_v1.docx'], activity: ['Client phản hồi tích cực'] }
];

export const chatThreads: ChatThread[] = [
  {
    id: 'chat-project',
    projectId: 'p-web-redesign',
    visibility: 'internal',
    participants: ['u-owner', 'u-pm', 'u-crm'],
    messages: ['@team Minh đã hoàn tất bản thiết kế chính.', 'Client hỏi có thể chỉnh màu CTA nổi bật hơn không?', 'Đã cập nhật timeline kiểm thử.'],
    createdAt: '2026-07-10T08:00:00Z',
    updatedAt: '2026-07-18T03:00:00Z'
  }
];

export const files: FileContract[] = [
  { id: 'f-styleguide', projectId: 'p-web-redesign', clientId: 'c-abc', type: 'file', status: 'review', version: 'v1.2', owner: 'Designer Huy', permissionScope: 'project-members', activity: ['Upload style guide'] },
  { id: 'fc-contract', projectId: 'p-web-redesign', clientId: 'c-abc', type: 'contract', status: 'signed', version: 'SK-FLA-2026-012', owner: 'Quốc Uy', permissionScope: 'owner-admin', activity: ['Hợp đồng đã ký'] }
];

export const financeRecords: FinanceRecord[] = [
  { id: 'fin-quote', projectId: 'p-web-redesign', clientId: 'c-abc', type: 'quote', amount: 150000000, status: 'sent', permissionScope: 'finance', updatedBy: 'u-fin', updatedAt: '2026-07-17T02:00:00Z' },
  { id: 'fin-paid', projectId: 'p-web-redesign', clientId: 'c-abc', type: 'payment', amount: 75000000, status: 'paid', permissionScope: 'finance', updatedBy: 'u-fin', updatedAt: '2026-07-17T06:00:00Z' },
  { id: 'fin-margin', projectId: 'p-web-redesign', clientId: 'c-abc', type: 'margin', amount: 32, status: 'internal', permissionScope: 'finance', updatedBy: 'u-owner', updatedAt: '2026-07-17T08:00:00Z' }
];

export const activityLogs: ActivityLog[] = [
  { id: 'a1', actorId: 'u-pm', objectType: 'project', objectId: 'p-web-redesign', action: 'Cập nhật tiến độ dự án lên 68%', timestamp: '2026-07-18T03:05:00Z', visibility: 'internal', metadata: { source: 'project-room' } },
  { id: 'a2', actorId: 'u-crm', objectType: 'task', objectId: 't-home-ui', action: 'Bình luận về CTA trang chủ', timestamp: '2026-07-18T02:10:00Z', visibility: 'internal', metadata: { source: 'task-detail' } },
  { id: 'a3', actorId: 'u-owner', objectType: 'finance', objectId: 'fin-paid', action: 'Xem snapshot tài chính theo quyền Owner', timestamp: '2026-07-18T01:45:00Z', visibility: 'internal', metadata: { guarded: 'true' } }
];
