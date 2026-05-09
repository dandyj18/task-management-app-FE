export type TaskLabel = 'Feature' | 'Bug' | 'Issue' | 'Undefined';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Comment {
  id: string;
  userId: string; // member id
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  label: TaskLabel;
  priority: TaskPriority;
  dueAt: string;
  assignees: string[]; // avatar urls
  subtasks: Subtask[];
  comments: Comment[];
  attachments: string[]; // dummy file names
  coverImage?: string;
  isCompleted: boolean;
  projectId: string;
}

export interface Column {
  id: string;
  title: string;
}
