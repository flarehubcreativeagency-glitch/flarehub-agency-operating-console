import { activityLogs, chatThreads, clients, files, financeRecords, projects, tasks, users } from './demoData';

export const domain = {
  users,
  clients,
  projects,
  tasks,
  chatThreads,
  files,
  financeRecords,
  activityLogs
};

export function getProjectRoom(projectId: string) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return undefined;
  return {
    project,
    client: clients.find((item) => item.id === project.clientId),
    tasks: tasks.filter((item) => item.projectId === project.id),
    chats: chatThreads.filter((item) => item.projectId === project.id),
    files: files.filter((item) => item.projectId === project.id),
    finance: financeRecords.filter((item) => item.projectId === project.id),
    activity: activityLogs.filter((item) => item.objectId === project.id || item.metadata.source === 'project-room')
  };
}
