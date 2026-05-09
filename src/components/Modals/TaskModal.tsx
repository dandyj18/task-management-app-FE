import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Calendar, Image as ImageIcon, ChevronDown, Check, Send, Pencil, Paperclip, Eye, Download } from 'lucide-react';
import { useTaskStore } from '../../store/useTaskStore';
import { Task, TaskLabel, TaskPriority, Subtask } from '../../types/task';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { ConfirmModal } from '../UI/ConfirmModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultColumnId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  defaultColumnId,
}) => {
  const { addTask, updateTask, deleteTask, addComment, columns, members, activeProjectId} = useTaskStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState<TaskLabel>('Feature');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [dueAt, setDueAt] = useState(new Date().toISOString().split('T')[0]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [columnId, setColumnId] = useState('todo');
  const [isCompleted, setIsCompleted] = useState(false);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const [newComment, setNewComment] = useState('');
  
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const assigneePickerRef = useRef<HTMLDivElement>(null);

  const projectMembers = members[activeProjectId] || [];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setLabel(task.label);
      setPriority(task.priority);
      setDueAt(task.dueAt);
      setSubtasks(task.subtasks);
      setColumnId(task.columnId);
      setIsCompleted(task.isCompleted || false);
      setAssignees(task.assignees);
      setAttachments(task.attachments || []);
      setCoverImage(task.coverImage);
    } else {
      setTitle('');
      setDescription('');
      setLabel('Feature');
      setPriority('Medium');
      setDueAt(new Date().toISOString().split('T')[0]);
      setSubtasks([]);
      setColumnId(defaultColumnId || 'todo');
      setIsCompleted(false);
      setAssignees([]);
      setAttachments([]);
      setCoverImage(undefined);
    }
  }, [task, isOpen, defaultColumnId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      title,
      description,
      label,
      priority,
      dueAt,
      subtasks,
      columnId,
      isCompleted,
      assignees,
      attachments,
      coverImage,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const confirmDelete = () => {
    if (!task) return;
    deleteTask(task.id);
    onClose();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;
    const currentUser = projectMembers[0] || { id: 'guest', name: 'Guest', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest' };
    addComment(task.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        text: newComment
    });
    setNewComment('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachments(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
    });
    // Clear input value to allow uploading the same file again
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks([...subtasks, { id: Math.random().toString(36).substring(2, 9), title: newSubtask, isCompleted: false }]);
    setNewSubtask('');
    setShowSubtaskInput(false);
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
  const progress = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        
        <motion.form
          onSubmit={handleSubmit}
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100">
            <button
              onClick={() => setIsCompleted(!isCompleted)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              <Check className="w-4 h-4" />
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Cover Image Placeholder */}
            <div 
              className={`w-full relative bg-slate-50 border-b border-slate-100 group ${coverImage ? 'h-64' : 'h-72'} flex flex-col items-center justify-center overflow-hidden`}
            >
              {coverImage ? (
                <>
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button onClick={() => coverInputRef.current?.click()} className="p-3 bg-white text-slate-800 rounded-2xl hover:bg-slate-100 transition-all font-bold text-xs flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> Change Cover
                        </button>
                        <button onClick={() => setCoverImage(undefined)} className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all font-bold text-xs flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Remove
                        </button>
                    </div>
                </>
              ) : (
                <button onClick={() => coverInputRef.current?.click()} className="flex flex-col items-center gap-3 text-brand-primary">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-bold">Add Cover Image</span>
                </button>
              )}
              <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setCoverImage(reader.result as string);
                    reader.readAsDataURL(file);
                }
                // Clear input value to allow uploading the same file again
                e.target.value = '';
              }} />
            </div>

            <div className="p-10 space-y-12">
              {/* Title Section */}
              <div className="flex items-center gap-4 group">
                <input
                  type="text"
                  value={title}
                  placeholder="Task Title"
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold text-slate-900 border-none p-0 focus:ring-0 bg-transparent flex-1"
                />
                <Pencil className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {/* Assignee */}
                <div className="space-y-3 relative" ref={assigneePickerRef}>
                  <label className="text-sm font-bold text-slate-500">Assignee</label>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {assignees.map((url, i) => (
                        <div key={i} className="relative group/avatar">
                          <img src={url} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                          <button type="button" onClick={() => setAssignees(assignees.filter(a => a !== url))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity z-10 shadow-sm"><X className="w-2.5 h-2.5" /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setShowAssigneePicker(!showAssigneePicker)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"><Plus className="w-5 h-5" /></button>
                  </div>
                  <AnimatePresence>
                    {showAssigneePicker && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {projectMembers.map(m => (
                            <button key={m.id} onClick={() => {
                                setAssignees(assignees.includes(m.avatar) ? assignees.filter(a => a !== m.avatar) : [...assignees, m.avatar]);
                            }} className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all">
                                <img src={m.avatar} className="w-8 h-8 rounded-full" alt={m.name} />
                                <div className="text-left"><p className="text-xs font-bold text-slate-800">{m.name}</p></div>
                                {assignees.includes(m.avatar) && <Check className="w-3.5 h-3.5 text-brand-primary ml-auto" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500">Due Date</label>
                  <div 
                    className="relative w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none cursor-pointer flex items-center justify-between group hover:bg-slate-100 transition-all"
                    onClick={() => dateInputRef.current?.showPicker()}
                  >
                    <span>{dueAt ? format(new Date(dueAt), 'd MMM, yyyy') : 'Set Date'}</span>
                    <Calendar className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    <input 
                      ref={dateInputRef}
                      type="date" 
                      value={dueAt} 
                      onChange={(e) => setDueAt(e.target.value)} 
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                {/* Column */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500">Column</label>
                  <div className="relative">
                    <select value={columnId} onChange={(e) => setColumnId(e.target.value)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none appearance-none pr-12">
                      {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Label */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500">Label</label>
                  <div className="relative">
                    <select value={label} onChange={(e) => setLabel(e.target.value as TaskLabel)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none appearance-none pr-12">
                      <option value="Feature">Feature</option>
                      <option value="Bug">Bug</option>
                      <option value="Issue">Issue</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500">Priority</label>
                  <div className="relative">
                    <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-700 outline-none appearance-none pr-12">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* Description Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Description</h3>
                <div className="relative">
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        rows={3} 
                        className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium text-slate-600 outline-none resize-none pl-14" 
                    />
                    <Pencil className="absolute left-6 top-6 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* Attachments Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Attachments</h3>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-50 group hover:border-brand-primary/30 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-brand-primary transition-colors">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-sm font-bold">Drag & Drop files here or <span className="text-brand-primary">browse from device</span></span>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
                
                {/* List of Attachments */}
                {attachments.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                        {attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group/file relative overflow-hidden cursor-pointer hover:border-brand-primary/30 transition-all" onClick={() => setPreviewFile(file)}>
                                {file.startsWith('data:image') ? (
                                    <img src={file} className="w-12 h-12 rounded-xl object-cover" alt="attachment" />
                                ) : (
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center"><Paperclip className="w-5 h-5 text-slate-400" /></div>
                                )}
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-bold text-slate-800 truncate">Attachment_{i+1}</p>
                                    <p className="text-[10px] text-slate-400">File Attachment</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity">
                                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }} className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all" title="View">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <a href={file} download={`Attachment_${i+1}`} onClick={(e) => e.stopPropagation()} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all" title="Download">
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeAttachment(i); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* CheckList Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Check List</h3>
                    <span className="text-xs font-bold text-slate-400">{completedSubtasks}/{subtasks.length}</span>
                </div>
                <div className="w-full h-[2px] bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-brand-primary" />
                </div>
                <div className="space-y-4">
                    {subtasks.map(st => (
                        <div key={st.id} className="flex items-center gap-3">
                            <input type="checkbox" checked={st.isCompleted} onChange={() => toggleSubtask(st.id)} className="w-4 h-4 rounded-md border-slate-300 text-brand-primary" />
                            <span className={`text-sm font-medium ${st.isCompleted ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{st.title}</span>
                            <button onClick={() => setSubtasks(subtasks.filter(s => s.id !== st.id))} className="ml-auto p-1 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                    ))}
                    {showSubtaskInput ? (
                        <div className="flex items-center gap-3">
                            <input type="text" autoFocus placeholder="New subtask..." value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()} className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm outline-none" />
                            <button onClick={handleAddSubtask} className="p-2 bg-brand-primary text-white rounded-xl"><Check className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <button onClick={() => setShowSubtaskInput(true)} className="w-full py-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-slate-500 transition-all">
                            <Plus className="w-4 h-4" /> Add subtask
                        </button>
                    )}
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* Activity & Comments Section */}
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-slate-900">Activity</h3>
                
                {/* Comment Input */}
                <div className="flex gap-4">
                   <img src={projectMembers[0]?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'} className="w-10 h-10 rounded-full shrink-0" alt="me" />
                   <div className="flex-1 relative">
                        <textarea placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={1} className="w-full bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm font-medium outline-none resize-none" onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment(e))} />
                        <button type="button" onClick={handleAddComment} disabled={!newComment.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-brand-primary disabled:text-slate-300 transition-all"><Send className="w-5 h-5" /></button>
                   </div>
                </div>

                <div className="space-y-6 pt-4">
                  {task?.comments.map(c => (
                    <div key={c.id} className="flex gap-4">
                       <img src={c.userAvatar} className="w-10 h-10 rounded-full shrink-0" alt={c.userName} />
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-slate-900">{c.userName}</span>
                             <span className="text-xs text-slate-400">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{c.text}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-end gap-4 sticky bottom-0">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all">Discard</button>
            <button type="submit" className="px-8 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-95">Save</button>
          </div>
        </motion.form>

        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Task"
          message={`Are you sure you want to delete the task "${task?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          type="danger"
        />

        {/* File Preview Lightbox */}
        <AnimatePresence>
          {previewFile && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setPreviewFile(null)}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {previewFile.startsWith('data:image') ? (
                  <img src={previewFile} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-3xl" />
                ) : (
                  <div className="bg-white p-16 rounded-3xl flex flex-col items-center gap-6">
                    <Paperclip className="w-16 h-16 text-slate-300" />
                    <p className="text-lg font-bold text-slate-700">File preview not available</p>
                    <a href={previewFile} download className="px-6 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-primary/90 transition-all flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download File
                    </a>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <a href={previewFile} download className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-slate-700 hover:bg-white transition-all shadow-lg" title="Download">
                    <Download className="w-5 h-5" />
                  </a>
                  <button type="button" onClick={() => setPreviewFile(null)} className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-slate-700 hover:bg-white transition-all shadow-lg" title="Close">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};
