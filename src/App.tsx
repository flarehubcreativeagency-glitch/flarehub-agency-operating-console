import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  FolderKanban,
  Gauge,
  Grid2X2,
  LockKeyhole,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound
} from 'lucide-react';
import { activityLogs, chatThreads, clients, currentUser, files, financeRecords, projects, tasks, users } from './domain/demoData';
import { getProjectRoom } from './domain/domain';
import type { Task, User } from './domain/types';
import { canAccessRoute, canReadFinance, canReadThread } from './security/access';

type Screen =
  | 'dashboard'
  | 'clients'
  | 'projects'
  | 'tasks'
  | 'calendar'
  | 'chat'
  | 'feedback'
  | 'deliverables'
  | 'files'
  | 'finance'
  | 'users'
  | 'people'
  | 'talent'
  | 'activity'
  | 'settings'
  | 'profile';

const navGroups: { label: string; items: { id: Screen; label: string; icon: typeof Gauge }[] }[] = [
  {
    label: 'VẬN HÀNH',
    items: [
      { id: 'dashboard', label: 'Dashboard tổng quan', icon: Grid2X2 },
      { id: 'clients', label: 'Clients', icon: UsersRound },
      { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
      { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
      { id: 'calendar', label: 'Lịch & Milestone', icon: CalendarDays }
    ]
  },
  {
    label: 'CỘNG TÁC',
    items: [
      { id: 'chat', label: 'Project Chat', icon: MessageCircle },
      { id: 'feedback', label: 'Client Feedback', icon: MessageCircle },
      { id: 'deliverables', label: 'Deliverables', icon: FileCheck2 },
      { id: 'files', label: 'Files / Drive', icon: FolderKanban }
    ]
  },
  {
    label: 'KIỂM SOÁT',
    items: [
      { id: 'finance', label: 'Finance Lite', icon: CircleDollarSign },
      { id: 'users', label: 'Users & Quyền truy cập', icon: UserRound },
      { id: 'people', label: 'People / Workload', icon: UsersRound },
      { id: 'talent', label: 'Talent Pool', icon: BriefcaseBusiness },
      { id: 'activity', label: 'Activity Log', icon: Activity },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

const tabs = ['Hôm nay', 'CRM', 'Công việc', 'Vận hành', 'Tài chính', 'Hệ thống'];
const projectTabs = ['Tổng quan', 'Task', 'Chat', 'Feedback khách hàng', 'File & Hợp đồng', 'Deliverables', 'Tài chính', 'Hoạt động'];

function emitAction(message: string) {
  window.dispatchEvent(new CustomEvent<string>('flare-demo-action', { detail: message }));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
}

function Badge({ tone = 'blue', children }: { tone?: 'blue' | 'green' | 'orange' | 'red' | 'gray'; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <section className={`card ${className}`}>{children}</section>;
}

function IconTile({ icon: Icon }: { icon: typeof Gauge }) {
  return (
    <div className="icon-tile">
      <Icon size={22} />
    </div>
  );
}

function Shell({ screen, setScreen, user, children }: { screen: Screen; setScreen: (screen: Screen) => void; user: User; children: ReactNode }) {
  const active = navGroups.flatMap((group) => group.items).find((item) => item.id === screen);
  const [query, setQuery] = useState('');
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">F</div>
          <div>
            <strong>FLARE HUB</strong>
            <span>CRM OS v2</span>
          </div>
          <button type="button" className="ghost-icon" aria-label="Thu gọn sidebar" onClick={() => emitAction('Sidebar đã được thu gọn trong phiên demo local.')}>
            <ChevronRight size={18} />
          </button>
        </div>
        <nav className="nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const allowed = canAccessRoute(user, item.id);
                return (
                  <button type="button" key={item.id} className={`nav-item ${screen === item.id ? 'active' : ''}`} onClick={() => setScreen(item.id)} title={allowed ? item.label : 'Được bảo vệ bằng quyền truy cập'}>
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {!allowed && <LockKeyhole size={14} />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <button type="button" className={`profile-nav ${screen === 'profile' ? 'active' : ''}`} onClick={() => setScreen('profile')}>
          <div className="avatar">QU</div>
          <div>
            <strong>{user.name}</strong>
            <span>SUPER ADMIN</span>
          </div>
          <ChevronDown size={16} />
        </button>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <h1>{active?.label ?? (screen === 'profile' ? 'Hồ sơ cá nhân' : 'FLARE HUB')}</h1>
            <div className="top-meta">
              <Badge tone="green">Đang hoạt động</Badge>
              <Badge tone="blue">DEVELOPMENT</Badge>
            </div>
          </div>
          <div className="header-tools">
            <label className="search">
              <Search size={18} />
              <input
                placeholder="Tìm nhanh..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') emitAction(`Tìm kiếm local: "${query || 'trống'}". Dữ liệu thật cần backend/search index.`);
                }}
              />
            </label>
            <button type="button" className="ghost-icon notify" aria-label="Thông báo" onClick={() => setScreen('profile')}><Bell size={20} /><span>3</span></button>
            <div className="avatar small">QU</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="page">
      <section className="hero-card">
        <IconTile icon={Grid2X2} />
        <div className="hero-copy">
          <div className="eyebrow">HÔM NAY · FLARE HUB CRM OS v2</div>
          <h2>Trung tâm điều phối hôm nay</h2>
          <p>Ưu tiên việc khẩn, blocker, follow-up và các tín hiệu vận hành cần quyết định trong ngày.</p>
        </div>
        <div className="metric-strip">
          <Metric label="Project đang chạy" value="5" icon={CalendarDays} />
          <Metric label="Task quá hạn" value="6" icon={Activity} tone="red" />
          <Metric label="Blocker mở" value="5" icon={ShieldCheck} tone="orange" />
          <Metric label="Feedback mới" value="1" icon={MessageCircle} />
        </div>
      </section>
      <Segmented items={tabs} active="Hôm nay" />
      <div className="quick-grid">
        <MetricCard title="Project đang chạy" value="5" delta="↑ 2 so với tuần trước" tone="green" />
        <MetricCard title="Task quá hạn" value="6" delta="↑ 2 cần xử lý" tone="red" />
        <MetricCard title="Chờ client" value="1" delta="↓ 1 so với tuần trước" tone="blue" />
        <MetricCard title="Chờ duyệt deliverable" value="1" delta="↓ 1 so với tuần trước" tone="green" />
      </div>
      <div className="dashboard-grid">
        <DonutCard title="Báo cáo task" total="13" rows={[['Quá hạn', '6', 'red'], ['Hôm nay', '0', 'orange'], ['Chờ khách', '1', 'blue'], ['Đang mở', '6', 'green']]} />
        <DonutCard title="Sức khỏe dự án" total="10" rows={[['Đang chạy', '5', 'green'], ['Blocker', '5', 'red'], ['Review', '0', 'blue'], ['Hoàn tất', '0', 'gray']]} />
        <Card>
          <CardTitle title="Tín hiệu finance" subtitle="Chỉ hiển thị theo quyền truy cập" />
          <LineChart />
          <ActionLink label="Xem báo cáo tài chính" onClick={() => emitAction('Đã mở báo cáo finance demo. Dữ liệu finance thật chỉ hiển thị cho vai trò có quyền.')} />
        </Card>
      </div>
      <div className="two-col">
        <Card>
          <CardTitle title="Blocker đang mở" subtitle="Các blocker cần xử lý để không ảnh hưởng tiến độ" />
          {projects[0].risks.map((risk, index) => <ListRow key={risk} title={risk} meta={index === 0 ? 'Cao · 2 giờ trước' : 'Trung bình · 1 ngày trước'} tone={index === 0 ? 'red' : 'orange'} />)}
        </Card>
        <Card>
          <CardTitle title="Hoạt động gần đây" subtitle="Cập nhật mới nhất trong hệ thống" />
          {activityLogs.map((log) => <ListRow key={log.id} title={log.action} meta="Vừa cập nhật" tone="blue" />)}
        </Card>
      </div>
    </div>
  );
}

function ProjectRoom() {
  const room = getProjectRoom('p-web-redesign')!;
  const { project } = room;
  return (
    <div className="page">
      <Card className="project-header">
        <IconTile icon={BriefcaseBusiness} />
        <div className="project-name">
          <h2>{project.name}</h2>
          <div><Badge tone="green">Đang thực hiện</Badge><Badge tone="blue">{project.code}</Badge></div>
        </div>
        <Info label="Khách hàng" value={room.client?.name ?? 'Demo client'} />
        <Info label="Chủ sở hữu" value={project.owner} detail="Project Manager" />
        <Info label="Hạn chót" value="30/08/2026" detail="Còn 43 ngày" />
        <div className="progress-cell">
          <span>Tiến độ tổng thể</span>
          <strong>{project.progress}%</strong>
          <div className="bar"><i style={{ width: `${project.progress}%` }} /></div>
        </div>
        <div className="health"><strong>{project.health}</strong><span>Tốt</span></div>
      </Card>
      <Segmented items={projectTabs} active="Tổng quan" compact />
      <div className="project-grid">
        <Card className="wide">
          <CardTitle title="Milestone & Lộ trình dự án" />
          <div className="milestones">
            {project.milestones.map((milestone, index) => (
              <div className={`milestone ${milestone.status}`} key={milestone.id}>
                <span>{index + 1}</span>
                <strong>{milestone.title}</strong>
                <small>{milestone.date}</small>
              </div>
            ))}
          </div>
          <div className="phase">
            <div>
              <span>Giai đoạn hiện tại</span>
              <strong>3. Thiết kế UI/UX</strong>
              <p>Đang thiết kế hệ thống UI và trải nghiệm người dùng cho website mới.</p>
            </div>
            <div className="progress-cell">
              <span>Tiến độ giai đoạn</span>
              <strong>60%</strong>
              <div className="bar"><i style={{ width: '60%' }} /></div>
            </div>
          </div>
        </Card>
        <Card><CardTitle title="Tiến độ dự án" /><LineChart label="68%" /></Card>
        <Card>
          <CardTitle title="Liên hệ & Stakeholder" />
          {['Nguyễn Minh Anh · CEO', 'Trần Hoàng Nam · Marketing Director', 'Lê Thu Hà · Coordinator'].map((person) => <ListRow key={person} title={person} meta="Công ty ABC Demo" tone="blue" />)}
        </Card>
        <ChatCard />
        <Card>
          <CardTitle title="Feedback khách hàng" action="Xem tất cả (6)" />
          {['Giao diện trang chủ', 'CTA chưa nổi bật', 'Tối ưu tốc độ tải trang'].map((item, index) => <ListRow key={item} title={item} meta={index === 0 ? 'Đang xử lý' : 'Đã phản hồi'} tone={index === 0 ? 'orange' : 'green'} />)}
        </Card>
        <Card className="document-card">
          <CardTitle title="Hợp đồng & Tài liệu" action="Xem tất cả" />
          <div className="document-preview">
            <div className="doc-pages"><span>1</span><span>2</span><span>3</span></div>
            <div className="doc-paper"><strong>FLARE HUB</strong><h3>HỢP ĐỒNG CUNG CẤP DỊCH VỤ</h3><p>Số: FLA-2026-012</p><p>Bên A: Công ty ABC Demo</p><p>Bên B: FLARE HUB Technology</p></div>
          </div>
          <ListRow title="Hop_dong_ABC_Website_Redesign.pdf" meta="PDF · 2.4 MB · Cập nhật 2 ngày trước" tone="blue" />
        </Card>
        <Card><CardTitle title="Tài chính dự án" action="Xem chi tiết" /><FinanceSnapshot /></Card>
        <Card><CardTitle title="Hoạt động gần đây" action="Xem tất cả" />{project.activity.map((item) => <ListRow key={item} title={item} meta="2 giờ trước" tone="blue" />)}</Card>
      </div>
      <div className="summary-row">
        {['Task đang chạy 6', 'Quá hạn 1', 'Chờ client 1', 'Feedback mở 2', 'Deliverables 4', 'File & Hợp đồng 12'].map((item) => <Card key={item} className="summary-card">{item}</Card>)}
      </div>
    </div>
  );
}

function TaskDetail() {
  const selected = tasks[0];
  const groups: [string, Task[]][] = [
    ['Việc cần làm', tasks.filter((task) => task.status === 'todo')],
    ['Đang thực hiện', tasks.filter((task) => task.status === 'doing' || task.status === 'blocked')],
    ['Hoàn thành', tasks.filter((task) => task.status === 'done')]
  ];
  return (
    <div className="task-layout">
      <Card className="task-list">
        <div className="task-list-head"><h2>Danh sách task</h2><button type="button" className="primary" onClick={() => emitAction('Mở form tạo task demo. Lưu task thật cần backend và permission write.')}>Tạo task</button></div>
        <div className="toolbar"><span>Nhóm theo: Trạng thái</span><Grid2X2 size={18} /></div>
        {groups.map(([label, items]) => (
          <div className="task-group" key={label}>
            <h3>{label}<Badge tone={label === 'Đang thực hiện' ? 'orange' : 'green'}>{items.length}</Badge></h3>
            {items.map((task) => <button type="button" className={`task-chip ${task.id === selected.id ? 'active' : ''}`} key={task.id} onClick={() => emitAction(`Đã chọn task demo: ${task.title}`)}><strong>{task.title}</strong><span>{task.dueDate} · {task.comments.length} bình luận</span><Badge tone={task.priority === 'P1' ? 'red' : 'gray'}>{task.priority}</Badge></button>)}
          </div>
        ))}
      </Card>
      <Card className="task-detail">
        <div className="task-actions"><button type="button" className="link" onClick={() => emitAction('Đã đưa focus về danh sách task bên trái.')}>Quay lại danh sách</button><button type="button" className="primary" onClick={() => emitAction('Mở drawer sửa task demo. Backend chưa được kết nối nên không ghi dữ liệu thật.')}>Sửa task</button></div>
        <h2>{selected.title}</h2>
        <p>Thiết kế giao diện trang chủ theo style guide đã duyệt. Đảm bảo responsive trên desktop, tablet và mobile.</p>
        <div className="task-properties">
          <Info label="Trạng thái" value="Đang thực hiện" />
          <Info label="Ưu tiên" value="Cao" />
          <Info label="Hạn hoàn thành" value="19/07/2026" />
          <Info label="Người phụ trách" value={selected.owner} />
          <Info label="Followers" value="Minh Anh, Hải Yến, +3" />
        </div>
        <Card className="inner-card">
          <CardTitle title="Subtask" subtitle="2/4 hoàn thành" action="Tạo subtask" />
          {['Thu thập yêu cầu và nội dung', 'Thiết kế UI desktop', 'Thiết kế UI tablet', 'Thiết kế UI mobile'].map((item, index) => <CheckRow key={item} title={item} checked={index < 2} />)}
        </Card>
        <Card className="inner-card">
          <CardTitle title="Bình luận" />
          <div className="comment-box"><input placeholder="Viết bình luận... Gõ @ để nhắc tên" /><button type="button" aria-label="Đính kèm file demo" onClick={() => emitAction('Đính kèm file đang ở chế độ mô phỏng, chưa kết nối Drive thật.')}><Paperclip size={18} /></button><button type="button" aria-label="Gửi bình luận demo" onClick={() => emitAction('Bình luận demo đã được ghi nhận trong phiên local. Không gửi cho client.')}><Send size={18} /></button></div>
          {selected.comments.map((comment) => <ListRow key={comment} title={comment} meta="15/07/2026 10:45" tone="blue" />)}
        </Card>
      </Card>
      <Card className="right-rail">
        <CardTitle title="Người theo dõi" subtitle="Bạn sẽ nhận thông báo cho mọi thay đổi." />
        <div className="avatar-row"><div className="avatar">MA</div><div className="avatar">HY</div><div className="avatar">QU</div><Badge>+3</Badge></div>
        <CardTitle title="Hoạt động" />
        {selected.activity.map((item) => <ListRow key={item} title={item} meta="15/07/2026" tone="blue" />)}
        <CardTitle title="Đính kèm" action="2" />
        {selected.deliverables.concat(['Styleguide_v1.2.pdf']).map((file) => <ListRow key={file} title={file} meta="Tệp dự án" tone="orange" />)}
      </Card>
    </div>
  );
}

function Profile() {
  return (
    <div className="profile-grid">
      <Card className="avatar-card"><CardTitle title="Ảnh đại diện" /><div className="portrait">QU</div><p>JPG, PNG hoặc WEBP. Tối đa 5MB.</p><button type="button" className="primary" onClick={() => emitAction('Tải ảnh demo: chưa ghi file thật, cần backend lưu avatar.')}>Tải ảnh lên</button><button type="button" onClick={() => emitAction('Xóa ảnh demo: chỉ mô phỏng, avatar thật không bị thay đổi.')}>Xóa ảnh</button></Card>
      <Card className="personal-card"><CardTitle title="Thông tin cá nhân" action="Chỉnh sửa" /><div className="form-grid"><Info label="Họ và tên" value="Quốc Uy (Flarehub)" /><Info label="Ngày sinh" value="14/09/1993" /><Info label="Email" value="quocuy@example.com" /><Info label="Giới tính" value="Nam" /><Info label="Số điện thoại" value="0901 234 567" /><Info label="Ngôn ngữ" value="Tiếng Việt" /><Info label="Chức danh" value="Super Admin" /><Info label="Múi giờ" value="(GMT+07:00) Asia/Ho Chi Minh" /></div></Card>
      <Card><CardTitle title="Trung tâm thông báo" action="Xem tất cả" />{['Task “Review tài liệu Q2” đã được giao', 'Project Website Redesign đã cập nhật tiến độ', 'Client ABC Demo gửi phản hồi mới', 'Báo cáo tuần đã sẵn sàng', 'Bạn có 3 task quá hạn'].map((item) => <ListRow key={item} title={item} meta="5 phút trước" tone="orange" />)}</Card>
      <Card><CardTitle title="Vai trò & quyền hạn" /><Badge tone="blue">Super Admin</Badge><p>Toàn quyền quản trị hệ thống và dữ liệu.</p><button type="button" onClick={() => emitAction('Đã mở quyền hạn demo. Quyền thật phải lấy từ auth claims/backend.')}>Xem chi tiết quyền hạn</button></Card>
      <Card><CardTitle title="Phòng ban / Nhóm" /><Info label="Phòng ban" value="Product Development" /><Info label="Nhóm" value="Core Platform" /><Info label="Quản lý trực tiếp" value="Minh Anh · Product Director" /></Card>
      <Card><CardTitle title="Dự án đang tham gia" action="Xem tất cả" />{['Website Redesign 75%', 'Flarehub CRM v2 60%', 'Mobile App Q2 40%', 'Marketing Campaign Q2 20%', 'Internal Dashboard 90%'].map((item) => <ListRow key={item} title={item} meta="Đang chạy" tone="green" />)}</Card>
      <Card><CardTitle title="Thông tin liên hệ" />{['Email liên hệ quocuy@example.com', 'Email phụ personal@example.com', 'Số điện thoại 0901 234 567', 'Telegram / Zalo @quocuyflarehub', 'Địa chỉ 123 Đường Nguyễn Huệ, Quận 1'].map((item) => <ListRow key={item} title={item} meta="Đã xác minh" tone="blue" />)}</Card>
      <Card><CardTitle title="Tùy chọn thông báo" />{['Email', 'Ứng dụng', 'Thông báo đẩy', 'Tóm tắt công việc'].map((item, index) => <CheckRow key={item} title={item} checked={index < 3} toggle />)}<button type="button" className="primary" onClick={() => emitAction('Đã lưu tùy chọn thông báo trong demo local. Chưa ghi database thật.')}>Lưu tùy chọn</button></Card>
      <Card><CardTitle title="Tóm tắt công việc cá nhân" action="Xem tất cả" /><div className="mini-metrics"><Metric label="Tổng task" value="18" /><Metric label="Đang làm" value="6" /><Metric label="Quá hạn" value="3" /><Metric label="Hoàn tất" value="9" /></div>{['Review tài liệu Q2', 'Cập nhật nội dung landing page', 'Họp team triển khai tính năng'].map((item) => <CheckRow key={item} title={item} checked={item !== 'Review tài liệu Q2'} />)}</Card>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="page">
      <section className="hero-card">
        <IconTile icon={Settings} />
        <div className="hero-copy"><div className="eyebrow">SYSTEM · FLARE HUB CRM OS V2</div><h2>Cài đặt hệ thống</h2><p>Thiết lập vận hành, đồng bộ dữ liệu và cấu hình cảnh báo chưa bí mật cho môi trường production.</p></div>
        <div className="metric-strip"><Metric label="Project" value="5" /><Metric label="Task quá hạn" value="6" /><Metric label="Blocker" value="5" /><Metric label="Feedback mở" value="1" /></div>
      </section>
      <Segmented items={['Hôm nay', 'CRM', 'Work', 'Ops', 'Finance', 'System']} active="System" />
      <Segmented items={['Users & Access Control', 'Activity Log', 'Settings', 'Knowledge Base']} active="Settings" compact />
      <h2>Cài đặt hệ thống</h2>
      <p className="notice">Prototype này KHÔNG thực hiện xuất CSDL thật, đồng bộ Google Drive thật hoặc lưu credentials thật.</p>
      <div className="settings-grid">
        <Card><CardTitle title="Google Drive placeholder" /><CheckRow title="Tự động đồng bộ deliverables & notes" checked toggle /><CheckRow title="Tạo báo cáo feedback tự động" checked toggle /><button type="button" className="primary" onClick={() => emitAction('Mô phỏng đồng bộ file: không gọi Google Drive thật và không dùng credential thật.')}>Đồng bộ file mô phỏng</button></Card>
        <Card><CardTitle title="Sao lưu & xuất dữ liệu" /><p>Tải snapshot database CRM hiện tại ở định dạng JSON để sao lưu offline. Chức năng này chỉ mô phỏng.</p><button type="button" onClick={() => emitAction('Mô phỏng xuất dữ liệu JSON. Không đọc CSDL thật, không xuất dữ liệu production.')}>Mô phỏng xuất dữ liệu</button></Card>
        <Card className="wide"><CardTitle title="Placeholder tích hợp" /><p>Prototype frontend này không tải, lưu hoặc gửi credentials API thật.</p><div className="form-grid"><Info label="Kết nối placeholder" value="••••••••••••••••••" /><Info label="API credentials" value="flarehub-oauth-client-placeholder" /></div></Card>
      </div>
    </div>
  );
}

function ModuleScreen({ screen, user }: { screen: Screen; user: User }) {
  if (!canAccessRoute(user, screen)) {
    return <div className="page"><Card className="locked"><LockKeyhole size={32} /><h2>Quyền truy cập được bảo vệ</h2><p>Màn hình này dùng mô hình fail-closed. Vai trò hiện tại không có quyền xem dữ liệu nhạy cảm.</p></Card></div>;
  }
  if (screen === 'clients') return <SimpleList title="Clients" rows={clients.map((client) => [client.name, `${client.industry} · Owner: ${client.relationshipOwner}`])} />;
  if (screen === 'chat') return <SimpleList title="Project Chat" rows={chatThreads.filter((thread) => canReadThread(user, thread.visibility, thread.participants)).map((thread) => ['Internal Thread · Website Redesign', thread.messages.join(' · ')])} />;
  if (screen === 'feedback') return <SimpleList title="Client Feedback" rows={[['Giao diện trang chủ', 'Liên quan: Thiết kế UI/UX · Đang xử lý'], ['CTA chưa nổi bật', 'Liên quan: Thiết kế UI/UX · Mới'], ['Tối ưu tốc độ tải trang', 'Liên quan: Phát triển · Đã phản hồi']]} />;
  if (screen === 'deliverables') return <SimpleList title="Deliverables" rows={tasks.flatMap((task) => task.deliverables.map((item) => [item, `${task.title} · ${task.status}`]))} />;
  if (screen === 'files') return <SimpleList title="Files / Drive" rows={files.map((file) => [file.id, `${file.type} · ${file.status} · ${file.permissionScope}`])} />;
  if (screen === 'finance') return <SimpleList title="Finance Lite" rows={financeRecords.filter((record) => canReadFinance(user, record)).map((record) => [record.type, `${formatMoney(record.amount)} · ${record.status}`])} />;
  if (screen === 'users') return <SimpleList title="Users & Quyền truy cập" rows={users.map((item) => [item.name, `${item.role} · Finance: ${item.financeAccess ? 'Có' : 'Không'} · ${item.status}`])} />;
  if (screen === 'people') return <SimpleList title="People / Workload" rows={users.filter((item) => item.role !== 'Client').map((item) => [item.name, `${item.department} · ${item.projectMemberships.length} dự án · ${item.status}`])} />;
  if (screen === 'talent') return <SimpleList title="Talent Pool" rows={[['Vendor-Freelancer Pool', 'Parking lot đã khóa ở demo · cần owner approval để kích hoạt workflow thật'], ['UI Contractor Bench', 'Scaffold future ATS · không chứa dữ liệu ứng viên thật'], ['Partner Creative Network', 'Danh sách hư cấu · chưa mở cổng client/candidate']]} />;
  if (screen === 'activity') return <SimpleList title="Activity Log" rows={activityLogs.map((log) => [log.action, `${log.objectType} · ${log.visibility}`])} />;
  if (screen === 'calendar') return <SimpleList title="Lịch & Milestone" rows={projects[0].milestones.map((milestone) => [milestone.title, `${milestone.date} · ${milestone.status}`])} />;
  return <ProjectRoom />;
}

function SimpleList({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="page">
      <Card>
        <CardTitle title={title} subtitle="Dữ liệu demo hư cấu, được liên kết với Project Room và guard quyền truy cập." />
        {rows.map(([title, meta]) => <ListRow key={title} title={title} meta={meta} tone="blue" />)}
      </Card>
    </div>
  );
}

function Metric({ label, value, icon: Icon, tone = 'blue' }: { label: string; value: string; icon?: typeof Gauge; tone?: string }) {
  return <div className={`metric ${tone}`}>{Icon && <Icon size={18} />}<span>{label}</span><strong>{value}</strong></div>;
}

function MetricCard({ title, value, delta, tone }: { title: string; value: string; delta: string; tone: string }) {
  return <Card className="metric-card"><span>{title}</span><strong>{value}</strong><em className={tone}>{delta}</em></Card>;
}

function Segmented({ items, active, compact = false }: { items: string[]; active: string; compact?: boolean }) {
  const [selected, setSelected] = useState(active);
  return (
    <div className="segment-block">
      <div className={`segmented ${compact ? 'compact' : ''}`}>
        {items.map((item) => (
          <button type="button" className={item === selected ? 'active' : ''} key={item} onClick={() => setSelected(item)}>
            {item}
          </button>
        ))}
      </div>
      <p className="segment-note">Đang xem: {selected}</p>
    </div>
  );
}

function CardTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: string }) {
  return <div className="card-title"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action && <ActionLink label={action} />}</div>;
}

function ListRow({ title, meta, tone }: { title: string; meta: string; tone: string }) {
  return <div className="list-row"><span className={`dot ${tone}`} /><div><strong>{title}</strong><p>{meta}</p></div><button type="button" className="row-action" aria-label={`Mở menu hành động cho ${title}`} onClick={() => emitAction(`Menu hành động demo cho: ${title}`)}><MoreHorizontal size={16} /></button></div>;
}

function DonutCard({ title, total, rows }: { title: string; total: string; rows: string[][] }) {
  return <Card><CardTitle title={title} subtitle="Tình trạng xử lý trong workspace" /><div className="donut-wrap"><div className="donut"><strong>{total}</strong><span>Tổng số</span></div><div>{rows.map(([label, value, tone]) => <ListRow key={label} title={label} meta={value} tone={tone} />)}</div></div><ActionLink label="Xem chi tiết" /></Card>;
}

function LineChart({ label }: { label?: string }) {
  return <div className="line-chart"><svg viewBox="0 0 360 150" role="img" aria-label="Biểu đồ tiến độ"><polyline points="0,120 40,112 80,88 120,84 160,72 200,66 240,48 280,35 320,54 360,82" fill="none" stroke="#286bf6" strokeWidth="4" /><path d="M0 120 L40 112 L80 88 L120 84 L160 72 L200 66 L240 48 L280 35 L320 54 L360 82 L360 150 L0 150 Z" fill="#eaf1ff" /></svg>{label && <Badge tone="blue">{label}</Badge>}</div>;
}

function ChatCard() {
  const [messages, setMessages] = useState(chatThreads[0].messages);
  const [draft, setDraft] = useState('');
  return <Card><CardTitle title="Chat dự án" subtitle="Đang trực tuyến (5)" />{messages.map((message) => <ListRow key={message} title={message} meta="10:32" tone="green" />)}<div className="comment-box"><input placeholder="Nhập tin nhắn..." value={draft} onChange={(event) => setDraft(event.target.value)} /><button type="button" aria-label="Đính kèm file chat demo" onClick={() => emitAction('Đính kèm chat đang mô phỏng, chưa kết nối Drive thật.')}><Paperclip size={18} /></button><button type="button" aria-label="Gửi tin nhắn nội bộ demo" onClick={() => { setMessages((items) => [...items, draft || 'Tin nhắn demo nội bộ']); setDraft(''); emitAction('Đã thêm tin nhắn vào Project Chat nội bộ demo. Không hiển thị ra client portal.'); }}><Send size={18} /></button></div></Card>;
}

function ActionLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" className="text-action" data-action={label} onClick={onClick ?? (() => emitAction(`${label}: hành động demo an toàn, chưa kết nối backend thật.`))}>
      {label} <ChevronRight size={14} />
    </button>
  );
}

function ToastHost() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const listener = (event: Event) => {
      setMessage((event as CustomEvent<string>).detail);
      window.setTimeout(() => setMessage(''), 3200);
    };
    window.addEventListener('flare-demo-action', listener);
    return () => window.removeEventListener('flare-demo-action', listener);
  }, []);
  if (!message) return null;
  return <div className="toast" role="status">{message}</div>;
}

function FinanceSnapshot() {
  const snapshot = projects[0].financeSnapshot;
  return <div className="finance-snapshot"><Metric label="Tổng ngân sách" value={formatMoney(snapshot.budget)} /><Metric label="Đã thanh toán" value={formatMoney(snapshot.paid)} tone="green" /><Metric label="Còn lại" value={formatMoney(snapshot.remaining)} /><Metric label="Margin nội bộ" value={`${snapshot.margin}%`} tone="orange" /></div>;
}

function Info({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="info"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>;
}

function CheckRow({ title, checked, toggle = false }: { title: string; checked: boolean; toggle?: boolean }) {
  const [enabled, setEnabled] = useState(checked);
  return (
    <div className="check-row">
      <span className={enabled ? 'checked' : ''}>{enabled ? '✓' : ''}</span>
      <strong>{title}</strong>
      {toggle && <button type="button" className={enabled ? 'switch on' : 'switch'} aria-label={`Bật tắt ${title}`} onClick={() => setEnabled((value) => !value)} />}
    </div>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const user = useMemo(() => currentUser, []);
  let content: ReactNode;
  if (screen === 'dashboard') content = <Dashboard />;
  else if (screen === 'tasks') content = <TaskDetail />;
  else if (screen === 'profile') content = <Profile />;
  else if (screen === 'settings') content = <SettingsScreen />;
  else content = <ModuleScreen screen={screen} user={user} />;
  return <><Shell screen={screen} setScreen={setScreen} user={user}>{content}</Shell><ToastHost /></>;
}
