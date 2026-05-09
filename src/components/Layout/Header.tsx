import React, { useRef, useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, UserPlus, Plus, Layout, Trash2, Lock, Share2, FileText, Upload, Check } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { TaskLabel } from '../../types/task';
import { InviteModal } from '../Modals/InviteModal';
import { MembersModal } from '../Modals/MembersModal';
import { ProjectModal } from '../Modals/ProjectModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onAddTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ }) => {
  const { 
    searchQuery, setSearchQuery, filters, setFilter, 
    exportTasks, importTasks, activeProjectId, projects, 
    setActiveProject, addProject, deleteProject, members 
  } = useTaskStore();
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const projectMembers = members[activeProjectId] || [];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      importTasks(content);
      setIsExportDropdownOpen(false);
    };
    reader.readAsText(file);
  };

  const handleAddProject = () => {
    setIsProjectDropdownOpen(false);
    setIsProjectModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectDropdownOpen(false);
      }
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const labels: (TaskLabel | 'All')[] = ['All', 'Feature', 'Bug', 'Issue', 'Undefined'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="relative" ref={projectDropdownRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            >
              <Lock className="w-4 h-4 text-slate-900" />
              <h1 className="text-xl font-bold text-slate-900">{activeProject?.name}</h1>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {isProjectDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-2">
                  <div className="space-y-1">
                    {projects.map(project => (
                      <div key={project.id} className="flex items-center justify-between group/p">
                        <button onClick={() => { setActiveProject(project.id); setIsProjectDropdownOpen(false); }} className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${activeProjectId === project.id ? 'bg-blue-50 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                          <Layout className="w-4 h-4" /> {project.name}
                        </button>
                        {projects.length > 1 && (
                          <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/p:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-50">
                    <button onClick={handleAddProject} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-brand-primary hover:bg-blue-50 transition-all"><Plus className="w-4 h-4" /> Add New Project</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex -space-x-3 cursor-pointer" onClick={() => setIsMembersModalOpen(true)}>
                {projectMembers.slice(0, 4).map((member) => (
                   <div key={member.id} className="relative group/avatar" onMouseEnter={() => setHoveredMember(member.id)} onMouseLeave={() => setHoveredMember(null)}>
                      <img src={member.avatar} className="w-8 h-8 rounded-full border-2 border-white shadow-sm relative z-0" alt={member.name} />
                   </div>
                ))}
                {projectMembers.length > 4 && <div className="w-8 h-8 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center border-2 border-white relative z-10 -ml-3">+{projectMembers.length - 4}</div>}
             </div>
             <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"><UserPlus className="w-4 h-4" /> Invite</button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            {/* Filter Dropdown */}
            <div className="relative" ref={filterDropdownRef}>
                <button 
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`flex items-center gap-2 transition-colors text-sm font-bold ${isFilterDropdownOpen || filters.label !== 'All' ? 'text-brand-primary' : 'text-slate-700 hover:text-brand-primary'}`}
                >
                   <Filter className="w-4 h-4" />
                   Filter {filters.label !== 'All' ? `(${filters.label})` : ''}
                </button>
                <AnimatePresence>
                    {isFilterDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-2">
                           <div className="space-y-1">
                                {labels.map(label => (
                                    <button 
                                        key={label}
                                        onClick={() => { setFilter({ label }); setIsFilterDropdownOpen(false); }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${filters.label === label ? 'bg-blue-50 text-brand-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {label}
                                        {filters.label === label && <Check className="w-3.5 h-3.5" />}
                                    </button>
                                ))}
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Export/Import Dropdown */}
            <div className="relative" ref={exportDropdownRef}>
                <button 
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-brand-primary transition-colors text-sm font-bold"
                >
                   <Share2 className="w-4 h-4" />
                   Export / Import
                </button>
                <AnimatePresence>
                    {isExportDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden p-2">
                           <div className="space-y-1">
                                <button 
                                    onClick={() => { exportTasks(); setIsExportDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    <FileText className="w-4 h-4 text-red-500" />
                                    Export as PDF
                                </button>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                    <Upload className="w-4 h-4 text-blue-500" />
                                    Import Tasks (JSON)
                                </button>
                           </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-primary/20 w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <InviteModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <MembersModal isOpen={isMembersModalOpen} onClose={() => setIsMembersModalOpen(false)} />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={addProject}
      />
      <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
    </header>
  );
};
