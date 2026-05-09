import React, { useState, useCallback, useMemo } from 'react';
import { Plus } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { useTaskStore } from '../../store/useTaskStore';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Task } from '../../types/task';
import { createPortal } from 'react-dom';
import { ColumnModal } from '../Modals/ColumnModal';

interface BoardProps {
  onAddTask: (columnId?: string) => void;
  onTaskClick: (task: Task) => void;
}

export const Board: React.FC<BoardProps> = ({ onAddTask, onTaskClick }) => {
  const { tasks, columns, moveTask, addColumn, searchQuery, filters, activeProjectId } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [maximizedColumnId, setMaximizedColumnId] = useState<string | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => t.projectId === activeProjectId)
      .filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLabel = filters.label === 'All' || task.label === filters.label;
        return matchesSearch && matchesLabel;
      });
  }, [tasks, activeProjectId, searchQuery, filters.label]);

  const getTasksByColumn = useCallback((columnId: string) => {
    return filteredTasks.filter((task) => task.columnId === columnId);
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = () => {};

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
        setActiveTask(null);
        return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const draggingTask = tasks.find((t) => t.id === activeId);
    if (!draggingTask) {
        setActiveTask(null);
        return;
    }

    const isOverAColumn = columns.find((col) => col.id === overId);
    
    if (isOverAColumn) {
      if (draggingTask.columnId !== overId) {
        moveTask(activeId, overId);
      }
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask && draggingTask.columnId !== overTask.columnId) {
        moveTask(activeId, overTask.columnId);
      }
    }

    setActiveTask(null);
  };

  return (
    <div className={`board-container ${maximizedColumnId ? 'flex justify-center p-8' : ''}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {columns
          .filter(col => !maximizedColumnId || col.id === maximizedColumnId)
          .map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onAddTask={onAddTask}
              onTaskClick={onTaskClick}
              isMaximized={maximizedColumnId === column.id}
              onMaximize={() => setMaximizedColumnId(maximizedColumnId === column.id ? null : column.id)}
            />
          ))}

        {!maximizedColumnId && (
          <div className="shrink-0 w-80">
            <button 
              onClick={() => setIsColumnModalOpen(true)}
              className="w-full py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center gap-3 text-slate-400 font-bold text-sm transition-all hover:bg-slate-100 hover:border-slate-300"
            >
                <Plus className="w-5 h-5" />
                Add new List
            </button>
          </div>
        )}

        {createPortal(
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: '0.5',
                  },
                },
              }),
            }}
          >
            {activeTask ? (
              <TaskCard task={activeTask} onClick={() => {}} />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSave={addColumn}
        mode="add"
      />
    </div>
  );
};
