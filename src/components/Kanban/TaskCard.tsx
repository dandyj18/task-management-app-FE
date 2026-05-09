import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, MessageSquare, CheckSquare, Check, Trash2 } from 'lucide-react';
import { Task } from '../../types/task';
import { Badge } from '../UI/Badge';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useTaskStore } from '../../store/useTaskStore';
import { ConfirmModal } from '../UI/ConfirmModal';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { deleteTask } = useTaskStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => { if (!showDeleteConfirm) onClick(); }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-grab active:cursor-grabbing group relative"
    >
      {task.coverImage && (
        <img
          src={task.coverImage}
          alt="Cover"
          className="w-full h-44 object-cover rounded-2xl mb-5"
        />
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDeleteConfirm(true);
        }}
        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm z-10"
        title="Delete Task"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Delete Task"
        message={`Are you sure you want to delete the task "${task.title}"?`}
        confirmText="Delete"
        type="danger"
      />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <Badge variant={task.label}>
            {task.label}
           </Badge>
           {task.isCompleted && <div className="bg-green-100 text-green-600 p-0.5 rounded-full"><Check className="w-2.5 h-2.5" /></div>}
        </div>

        {task.subtasks.length > 0 && (
          <div className="w-full h-[3px] bg-slate-50 rounded-full overflow-hidden">
             <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full ${task.columnId === 'done' ? 'bg-green-500' : 'bg-blue-400'}`}
             />
          </div>
        )}

        <h3 className={`text-sm font-semibold leading-relaxed text-slate-800 ${task.isCompleted ? 'text-slate-400 line-through' : ''}`}>
          {task.title}
        </h3>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 text-[11px] font-bold ${task.columnId === 'done' ? 'text-slate-400' : 'text-blue-400'}`}>
               <Clock className="w-3.5 h-3.5" />
               {format(new Date(task.dueAt), 'd MMM')}
            </div>
            
            {task.subtasks.length > 0 && (
               <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <CheckSquare className="w-3.5 h-3.5" />
                  {completedSubtasks}/{task.subtasks.length}
               </div>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
               <MessageSquare className="w-3.5 h-3.5" />
               {task.comments.length}
            </div>
          </div>

          <div className="flex -space-x-2">
            {task.assignees.slice(0, 3).map((url, i) => (
              <img 
                key={i} 
                src={url} 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                alt="avatar" 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
