import React, { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreVertical, Minimize2, Pencil, Trash2 } from 'lucide-react';
import { Column as ColumnType, Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../../store/useTaskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ColumnModal } from '../Modals/ColumnModal';
import { ConfirmModal } from '../UI/ConfirmModal';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
  isMaximized?: boolean;
  onMaximize?: () => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onTaskClick,
  isMaximized,
  onMaximize,
}) => {
  const { updateColumn, deleteColumn } = useTaskStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEdit = (newTitle: string) => {
    updateColumn(column.id, newTitle);
  };

  const handleDelete = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  return (
    <div className={`column-container transition-all duration-500 ${isMaximized ? 'w-[1000px] max-w-full' : 'w-80'}`}>
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">
            {column.title}
          </h2>
          <button 
            onClick={() => onAddTask(column.id)}
            className="w-6 h-6 rounded-full bg-blue-100 text-brand-primary flex items-center justify-center hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          
          <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setShowMenu(!showMenu)}
                className="text-slate-300 hover:text-slate-500 transition-colors"
            >
                <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
                {showMenu && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-1"
                    >
                        <button onClick={() => { setIsEditModalOpen(true); setShowMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                            <Pencil className="w-3.5 h-3.5" />
                            Edit List
                        </button>
                        <button onClick={handleDelete} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete List
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
        
        <button 
          onClick={onMaximize}
          className="text-slate-400 hover:text-slate-600 transition-all hover:scale-110"
        >
          {isMaximized ? (
            <Minimize2 className="w-5 h-5" />
          ) : (
             <div className="flex gap-[2px] rotate-45">
                <div className="flex flex-col gap-[2px]">
                   <div className="w-1.5 h-1.5 border-t-2 border-l-2 border-slate-400" />
                   <div className="w-1.5 h-1.5" />
                </div>
                <div className="flex flex-col gap-[2px]">
                   <div className="w-1.5 h-1.5" />
                   <div className="w-1.5 h-1.5 border-b-2 border-r-2 border-slate-400" />
                </div>
             </div>
          )}
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-5 min-h-[200px] rounded-2xl transition-all ${isMaximized ? 'grid grid-cols-2 gap-8' : ''}`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>

      <ColumnModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEdit}
        initialTitle={column.title}
        mode="edit"
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => deleteColumn(column.id)}
        title="Delete List"
        message={`Are you sure you want to delete the "${column.title}" list? All tasks in this list will also be deleted.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};
