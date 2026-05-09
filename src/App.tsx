import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Board } from './components/Kanban/Board';
import { TaskModal } from './components/Modals/TaskModal';
import { Task } from './types/task';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>(undefined);

  const handleAddTask = (columnId?: string) => {
    setSelectedTask(null);
    setDefaultColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setDefaultColumnId(undefined);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onAddTask={() => handleAddTask()} />
      
      <main className="flex-1 overflow-hidden">
        <Board onAddTask={handleAddTask} onTaskClick={handleTaskClick} />
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
}

export default App;
