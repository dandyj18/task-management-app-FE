import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Column, TaskLabel, Comment } from '../types/task';

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
}

interface TaskState {
  projects: Project[];
  activeProjectId: string;
  tasks: Task[];
  columns: Column[];
  searchQuery: string;
  filters: {
    label: TaskLabel | 'All';
    assignee: string | 'All';
  };
  members: Record<string, Member[]>; // Map projectId -> Member[]
  
  setSearchQuery: (query: string) => void;
  setFilter: (filter: Partial<TaskState['filters']>) => void;
  
  // Project Actions
  setActiveProject: (id: string) => void;
  addProject: (name: string) => void;
  deleteProject: (id: string) => void;
  
  // Column Actions
  addColumn: (title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'projectId' | 'comments'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
  reorderTasks: (columnId: string, startIndex: number, endIndex: number) => void;
  
  // Comment Actions
  addComment: (taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  
  exportTasks: () => void;
  importTasks: (fileContent: string) => void;
  
  // Member Actions
  addMember: (projectId: string, member: Omit<Member, 'id'>) => void;
  removeMember: (projectId: string, memberId: string) => void;
}

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Adhivasindo' },
  { id: 'p2', name: 'Northern Light' },
];

const INITIAL_MEMBERS: Record<string, Member[]> = {
  'p1': [
    { id: 'm1', name: 'Alex Rivera', email: 'alex@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 'm2', name: 'Sofia Chen', email: 'sofia@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' },
    { id: 'm3', name: 'Jordan Smith', email: 'jordan@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
    { id: 'm4', name: 'Mia Wong', email: 'mia@example.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia' },
  ],
  'p2': [
    { id: 'm5', name: 'Steve Jobs', email: 'steve@apple.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve' },
  ]
};

const INITIAL_TASKS: Task[] = [
  // PROJECT ADHIVASINDO (p1)
  {
    id: '1', projectId: 'p1', title: 'Riset untuk website podcast dan video',
    description: 'Tahap riset awal untuk proyek website streaming baru.',
    columnId: 'todo', label: 'Feature', priority: 'Medium', dueAt: '2026-08-08',
    assignees: [INITIAL_MEMBERS['p1'][0].avatar, INITIAL_MEMBERS['p1'][1].avatar],
    subtasks: [{ id: 'st1', title: 'Analisis kompetitor', isCompleted: true }, { id: 'st2', title: 'Wawancara pengguna', isCompleted: false }],
    comments: [
        { id: 'c1', userId: 'm1', userName: 'Alex Rivera', userAvatar: INITIAL_MEMBERS['p1'][0].avatar, text: 'Saya sudah menyelesaikan analisis kompetitor!', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'c2', userId: 'm2', userName: 'Sofia Chen', userAvatar: INITIAL_MEMBERS['p1'][1].avatar, text: 'Bagus! Saya akan lanjut wawancara besok.', createdAt: new Date(Date.now() - 1800000).toISOString() }
    ],
    attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3', projectId: 'p1', title: 'Desain wireframe untuk landing page baru',
    description: 'Membuat wireframe low-fidelity untuk perombakan halaman beranda.',
    columnId: 'doing', label: 'Feature', priority: 'High', dueAt: '2026-08-12',
    assignees: [INITIAL_MEMBERS['p1'][2].avatar],
    subtasks: [{ id: 'st3', title: 'Wireframe halaman utama', isCompleted: true }, { id: 'st4', title: 'Menu navigasi', isCompleted: true }],
    comments: [
        { id: 'c3', userId: 'm3', userName: 'Jordan Smith', userAvatar: INITIAL_MEMBERS['p1'][2].avatar, text: 'Sedang mengerjakan responsivitas mobile sekarang.', createdAt: new Date().toISOString() }
    ], 
    attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4', projectId: 'p1', title: 'Perbaikan bug proses checkout',
    description: 'Memperbaiki error 500 saat integrasi payment gateway.',
    columnId: 'todo', label: 'Bug', priority: 'High', dueAt: '2026-08-15',
    assignees: [INITIAL_MEMBERS['p1'][0].avatar, INITIAL_MEMBERS['p1'][3].avatar],
    subtasks: [], 
    comments: [
        { id: 'c4', userId: 'm4', userName: 'Mia Wong', userAvatar: INITIAL_MEMBERS['p1'][3].avatar, text: 'Ketemu masalahnya, ternyata ada di rotasi API key.', createdAt: new Date(Date.now() - 7200000).toISOString() }
    ], 
    attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '5', projectId: 'p1', title: 'Buat library ikon kustom',
    description: 'Ikon SVG kustom untuk dashboard admin.',
    columnId: 'review', label: 'Feature', priority: 'Low', dueAt: '2026-08-10',
    assignees: [INITIAL_MEMBERS['p1'][1].avatar],
    subtasks: [{ id: 'st5', title: 'Drafting ikon', isCompleted: true }],
    comments: [
        { id: 'c10', userId: 'm2', userName: 'Sofia Chen', userAvatar: INITIAL_MEMBERS['p1'][1].avatar, text: 'Ikon sudah siap di-review Bang.', createdAt: new Date().toISOString() }
    ], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1541461985943-9bb5a8ce631c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '15', projectId: 'p1', title: 'Setup tools marketing dan analitik',
    description: 'Pemasangan tracking pixel dan Google Analytics.',
    columnId: 'doing', label: 'Undefined', priority: 'Medium', dueAt: '2026-08-14',
    assignees: [INITIAL_MEMBERS['p1'][0].avatar, INITIAL_MEMBERS['p1'][3].avatar],
    subtasks: [], comments: [
        { id: 'c5', userId: 'm1', userName: 'Alex Rivera', userAvatar: INITIAL_MEMBERS['p1'][0].avatar, text: 'Hampir selesai setup Google Tag Manager.', createdAt: new Date().toISOString() }
    ], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '6', projectId: 'p1', title: 'Peningkatan usabilitas dashboard',
    description: 'Iterasi berdasarkan hasil pengujian pengguna.',
    columnId: 'done', label: 'Feature', priority: 'Medium', dueAt: '2026-08-01',
    assignees: [INITIAL_MEMBERS['p1'][2].avatar],
    subtasks: [], comments: [], attachments: [], isCompleted: true,
    coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '11', projectId: 'p1', title: 'Revamp Aplikasi Mobile v2.0',
    description: 'Desain UI baru untuk aplikasi mobile versi terbaru.',
    columnId: 'todo', label: 'Feature', priority: 'Medium', dueAt: '2026-09-15',
    assignees: [INITIAL_MEMBERS['p1'][2].avatar, INITIAL_MEMBERS['p1'][3].avatar],
    subtasks: [], comments: [], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '16', projectId: 'p1', title: 'Optimasi Performa Backend',
    description: 'Meningkatkan waktu respon query database.',
    columnId: 'rework', label: 'Issue', priority: 'High', dueAt: '2026-08-20',
    assignees: [INITIAL_MEMBERS['p1'][0].avatar],
    subtasks: [], comments: [
        { id: 'c6', userId: 'm1', userName: 'Alex Rivera', userAvatar: INITIAL_MEMBERS['p1'][0].avatar, text: 'Sepertinya bottleneck ada di indexing table.', createdAt: new Date().toISOString() }
    ], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '17', projectId: 'p1', title: 'Strategi Peluncuran Q3',
    description: 'Perencanaan kampanye di media sosial.',
    columnId: 'doing', label: 'Feature', priority: 'Low', dueAt: '2026-09-01',
    assignees: [INITIAL_MEMBERS['p1'][1].avatar, INITIAL_MEMBERS['p1'][2].avatar],
    subtasks: [], comments: [], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop'
  },

  // PROJECT NORTHERN LIGHT (p2)
  {
    id: '2', projectId: 'p2', title: 'Kampanye Northern Light',
    description: 'Kampanye pemasaran untuk brand Northern Light.',
    columnId: 'todo', label: 'Feature', priority: 'High', dueAt: '2026-09-12',
    assignees: [INITIAL_MEMBERS['p2'][0].avatar],
    subtasks: [], comments: [
        { id: 'c7', userId: 'm5', userName: 'Steve Jobs', userAvatar: INITIAL_MEMBERS['p2'][0].avatar, text: 'Mari kita buat sesuatu yang revolusioner.', createdAt: new Date().toISOString() }
    ], attachments: [], isCompleted: false,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  }
];

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      projects: INITIAL_PROJECTS,
      activeProjectId: 'p1',
      columns: [
        { id: 'todo', title: 'To do' },
        { id: 'doing', title: 'Doing' },
        { id: 'review', title: 'Review' },
        { id: 'done', title: 'Done' },
        { id: 'rework', title: 'Rework' },
      ],
      tasks: INITIAL_TASKS,
      searchQuery: '',
      filters: {
        label: 'All',
        assignee: 'All',
      },
      members: INITIAL_MEMBERS,
      
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setFilter: (filter) => set((state) => ({ filters: { ...state.filters, ...filter } })),
      
      setActiveProject: (activeProjectId) => set({ activeProjectId }),
      addProject: (name) => set((state) => {
        const id = Math.random().toString(36).substring(2, 9);
        return {
            projects: [...state.projects, { id, name }],
            members: { ...state.members, [id]: [] },
            activeProjectId: id
        };
      }),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        tasks: state.tasks.filter(t => t.projectId !== id),
        activeProjectId: state.activeProjectId === id ? (state.projects[0]?.id || '') : state.activeProjectId
      })),

      addColumn: (title) => set((state) => ({
        columns: [...state.columns, { id: Math.random().toString(36).substring(2, 9), title }]
      })),
      updateColumn: (id, title) => set((state) => ({
        columns: state.columns.map(c => c.id === id ? { ...c, title } : c)
      })),
      deleteColumn: (id) => set((state) => ({
        columns: state.columns.filter(c => c.id !== id),
        tasks: state.tasks.filter(t => t.columnId !== id)
      })),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: Math.random().toString(36).substring(2, 9), projectId: state.activeProjectId, comments: [] }],
        })),
      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      moveTask: (taskId, newColumnId) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, columnId: newColumnId } : t)),
        })),
      reorderTasks: (columnId, startIndex, endIndex) =>
        set((state) => {
          const columnTasks = state.tasks.filter((t) => t.columnId === columnId && t.projectId === state.activeProjectId);
          const otherTasks = state.tasks.filter((t) => t.columnId !== columnId || t.projectId !== state.activeProjectId);
          const reordered = Array.from(columnTasks);
          const [removed] = reordered.splice(startIndex, 1);
          reordered.splice(endIndex, 0, removed);
          return { tasks: [...otherTasks, ...reordered] };
        }),
        
      addComment: (taskId, comment) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? {
            ...t,
            comments: [...t.comments, { ...comment, id: Math.random().toString(36).substring(2, 9), createdAt: new Date().toISOString() }]
        } : t)
      })),

      exportTasks: async () => {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        
        const doc = new jsPDF();
        const activeProject = get().projects.find(p => p.id === get().activeProjectId);
        const tasks = get().tasks.filter(t => t.projectId === get().activeProjectId);
        
        doc.setFontSize(20);
        doc.text(`Proyek: ${activeProject?.name || 'Tidak Diketahui'}`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Diekspor pada: ${new Date().toLocaleString()}`, 14, 30);
        
        const headers = [['ID', 'Judul', 'Kolom', 'Label', 'Prioritas', 'Tenggat', 'Status']];
        const rows = tasks.map(t => [
            t.id,
            t.title,
            t.columnId.toUpperCase(),
            t.label,
            t.priority,
            t.dueAt,
            t.isCompleted ? 'Selesai' : 'Aktif'
        ]);

        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [79, 70, 229] },
            styles: { fontSize: 9 }
        });

        doc.save(`${activeProject?.name || 'proyek'}-tugas.pdf`);
      },
      importTasks: (fileContent) => {
        try {
          const tasks = JSON.parse(fileContent);
          if (Array.isArray(tasks)) {
            const remapped = tasks.map(t => ({ ...t, projectId: get().activeProjectId }));
            set((state) => ({ tasks: [...state.tasks, ...remapped] }));
          }
        } catch (e) { console.error(e); }
      },
      
      addMember: (projectId, member) => set((state) => {
        const projectMembers = state.members[projectId] || [];
        return {
            members: {
                ...state.members,
                [projectId]: [...projectMembers, { ...member, id: Math.random().toString(36).substring(2, 9) }]
            }
        };
      }),
      removeMember: (projectId, memberId) => set((state) => {
        const projectMembers = state.members[projectId] || [];
        return {
            members: {
                ...state.members,
                [projectId]: projectMembers.filter(m => m.id !== memberId)
            }
        };
      }),
    }),
    {
      name: 'kanban-storage-v10',
    }
  )
);
