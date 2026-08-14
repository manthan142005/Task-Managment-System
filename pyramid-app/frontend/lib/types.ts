export type Priority = 'NO_PRIORITY' | 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'TODO' | 'DOING' | 'ON_HOLD' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  fullName?: string;
  title?: string;
  username?: string;
  avatarUrl?: string;
  themeMode: string;
  colorMode: string;
}

export interface Project {
  id: string;
  title: string;
  priority: Priority;
  leadId?: string;
  lead?: User;
  dueDate?: string;
  _count?: { tasks: number };
}

export interface TaskMember {
  userId: string;
  user: User;
}

export interface TaskLabel {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Activity {
  id: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  projectId?: string;
  project?: Project;
  reporter?: User;
  members: TaskMember[];
  labels: TaskLabel[];
  subtasks?: Task[];
  comments?: Comment[];
  activities?: Activity[];
  createdAt: string;
}

export const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: 'To Do',
  DOING: 'Doing',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  NO_PRIORITY: 'No Priority',
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};
