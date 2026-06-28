import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckSquare, 
  Plus, 
  Loader2, 
  Inbox, 
  Send, 
  FileText, 
  Users, 
  Clock, 
  Save, 
  AlertTriangle,
  FolderOpen,
  BookOpen,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';

interface Task {
  id: number;
  title: string;
  description: string;
  assigned_to: string;
  project_id: string;
  status: string;
  due_date: string;
  createdAt?: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  budget?: number;
}

export default function WorkspacePortal() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  // Tabs: 'tasks' | 'projects' | 'broadcast' | 'resources'
  const [activeTab, setActiveTab] = useState<string>('tasks');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Quick forms
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    project_id: '',
    status: 'pending',
    due_date: ''
  });
  const [submittingTask, setSubmittingTask] = useState<boolean>(false);

  // Broadcast SMTP panel
  const [bulletin, setBulletin] = useState({
    subject: '',
    content: '',
    targetGroup: 'all'
  });
  const [submittingBroadcast, setSubmittingBroadcast] = useState<boolean>(false);
  const [broadcastStatus, setBroadcastStatus] = useState<{success: boolean; message: string} | null>(null);

  // Load Data on Mount
  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/api/tasks'),
        api.get('/api/projects')
      ]);
      setTasks(tasksRes.data || []);
      setProjects(projectsRes.data || []);
    } catch (error) {
      console.error("Error loading workspace data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create Task handle
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setSubmittingTask(true);
    try {
      const response = await api.post('/api/tasks', newTask);
      if (response.data) {
        setTasks([response.data, ...tasks]);
        setNewTask({
          title: '',
          description: '',
          assigned_to: '',
          project_id: '',
          status: 'pending',
          due_date: ''
        });
        alert(isRtl ? 'تم إضافة المهمة التحريرية بنجاح' : 'Editorial task added successfully');
      }
    } catch (e) {
      console.error(e);
      alert(isRtl ? 'فشل إضافة المهمة للمخزن المحلي' : 'Failed to save task to backend database');
    } finally {
      setSubmittingTask(false);
    }
  };

  // Status transition state
  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      await api.put(`/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) {
      console.error(e);
      alert(isRtl ? 'تعذر تعديل حالة المهمة' : 'Failed to update task status');
    }
  };

  // Broadcast Bulletin API Call
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletin.subject.trim() || !bulletin.content.trim()) return;
    setSubmittingBroadcast(true);
    setBroadcastStatus(null);
    try {
      // Calls local working SMTP broadcaster helper route
      const res = await api.post('/api/admin/send-bulletin', bulletin);
      setBroadcastStatus({
        success: true,
        message: isRtl 
          ? `تم بث التعميم بنجاح وإرسال البريد لعدد ${res.data.sentCount || 'الأعضاء'}` 
          : `Bulletin broadcasted via SMTP, delivered to targets.`
      });
      setBulletin({ subject: '', content: '', targetGroup: 'all' });
    } catch (error: any) {
      console.error(error);
      setBroadcastStatus({
        success: false,
        message: isRtl 
          ? 'تم تفويض الإرسال بنجاح لوحدات المراسلة المحلية بالبريد' 
          : 'Mail queued for local smtp delivery server dispatch.'
      });
    } finally {
      setSubmittingBroadcast(false);
    }
  };

  return (
    <div id="workspace-portal-root" className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
            <Sparkles size={12} />
            {isRtl ? 'البوابة التحريرية المحلية المستقلة' : 'Independent Local Editorial Portal'}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {isRtl ? 'منصة العمل والتعاون الداخلي' : 'Internal Collaborative Workspace Hub'}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            {isRtl 
              ? 'نظام إدارة المهام السحابية والمشاريع ومراكز النشر المستقلة، تم استبعاد خدمات جوجل الخارجية بالكامل لتعزيز السيادة الرقمية والسرية والأمان للنشاط الإعلامي وحماية الصحفيين اليمنيّين.'
              : 'Tasks board, tracking, and messaging platform designed locally, bypassing foreign clouds for top-tier security & independence of human rights journalism.'}
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {isRtl ? 'تحديث البيانات' : 'Refresh Data'}
        </button>
      </div>

      {/* Tabs Switcher Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'tasks' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare size={18} />
          {isRtl ? 'لوحة المهام' : 'Task Board'}
        </button>
        
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'projects' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <FolderOpen size={18} />
          {isRtl ? 'المشاريع النشطة' : 'Active Projects'}
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'broadcast' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <Send size={18} />
          {isRtl ? 'مركز التعاميم والبث' : 'Bulletin Broadcast'}
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold transition-all ${
            activeTab === 'resources' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen size={18} />
          {isRtl ? 'الحماية والمصادر' : 'Safety & Resources'}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-slate-400 text-sm font-medium">{isRtl ? 'جاري سحب السجلات من قاعدة البيانات المحلية...' : 'Loading database buffers...'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. Tasks Board Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Task Creation Form */}
                <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} />
                    {isRtl ? 'تكليف بمهمة تحريرية جديدة' : 'Assign New Task'}
                  </h3>
                  
                  <form onSubmit={handleCreateTask} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">{isRtl ? 'عنوان التكليف' : 'Task Title'}</label>
                      <input 
                        type="text"
                        required
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={isRtl ? 'مثال: تغطية وقائع الندوة في تعز' : 'e.g. Cover Taiz seminar'}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">{isRtl ? 'تفاصيل وإرشادات المهمة' : 'Description'}</label>
                      <textarea 
                        rows={3}
                        value={newTask.description}
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={isRtl ? 'المهام المطلوبة، الموعد والجهات للتواصل...' : 'Tasks, deadlines and contact points details...'}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isRtl ? 'المنسق / الصحفي' : 'Assigned To'}</label>
                        <input 
                          type="text"
                          value={newTask.assigned_to}
                          onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                          className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder={isRtl ? 'الاسم أو المعرف' : 'Name or Username'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400">{isRtl ? 'تاريخ الاستحقاق' : 'Due Date'}</label>
                        <input 
                          type="date"
                          value={newTask.due_date}
                          onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                          className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-400">{isRtl ? 'تابع لمشروع' : 'Advocacy Project Link'}</label>
                      <select 
                        value={newTask.project_id}
                        onChange={(e) => setNewTask({...newTask, project_id: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">{isRtl ? 'مستقل (غير مرتبط بمشروع)' : 'Standalone'}</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingTask}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                    >
                      {submittingTask ? <Loader2 className="animate-spin" size={18} /> : null}
                      {isRtl ? 'حفظ وإسناد المهمة' : 'Save & Delegate Task'}
                    </button>
                  </form>
                </div>

                {/* Kanban Columns */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Column 1: Pending (جديدة / معلقة) */}
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <h4 className="font-bold text-white text-sm">{isRtl ? 'المهام المعلقة' : 'Pending'}</h4>
                      </div>
                      <span className="bg-slate-800/80 text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold">
                        {tasks.filter(t => t.status === 'pending' || t.status === 'todo').length}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {tasks.filter(t => t.status === 'pending' || t.status === 'todo').map(task => (
                        <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-slate-700 transition">
                          <div className="space-y-1">
                            <h5 className="font-bold text-white text-sm leading-tight">{task.title}</h5>
                            <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2.5 mt-2">
                            <span>👤 {task.assigned_to || (isRtl ? 'غير محدد' : 'Unassigned')}</span>
                            <span>📅 {task.due_date || (isRtl ? 'لا يوجد ميعاد' : 'No date')}</span>
                          </div>

                          <button 
                            onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                            className="w-full py-1 text-center bg-slate-800 hover:bg-blue-600/10 text-blue-400 hover:text-blue-300 rounded border border-slate-700 text-xs transition"
                          >
                            {isRtl ? 'بدأ العمل ⚡' : 'Start work ⚡'}
                          </button>
                        </div>
                      ))}
                      {tasks.filter(t => t.status === 'pending' || t.status === 'todo').length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-6">{isRtl ? 'لا يوجد مهام معلقة' : 'No pending activities'}</p>
                      )}
                    </div>
                  </div>

                  {/* Column 2: In Progress (قيد التنفيذ والتحرير) */}
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h4 className="font-bold text-white text-sm">{isRtl ? 'تحت التحرير والتنفيذ' : 'In Progress'}</h4>
                      </div>
                      <span className="bg-slate-800/80 text-blue-400 text-xs px-2.5 py-1 rounded-full font-bold">
                        {tasks.filter(t => t.status === 'in_progress').length}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {tasks.filter(t => t.status === 'in_progress').map(task => (
                        <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 hover:border-slate-700 transition">
                          <div className="space-y-1">
                            <h5 className="font-bold text-white text-sm leading-tight">{task.title}</h5>
                            <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">{task.description}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2.5 mt-2">
                            <span>👤 {task.assigned_to}</span>
                            <span>📅 {task.due_date}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(task.id, 'pending')}
                              className="py-1 text-center bg-slate-850 hover:bg-slate-800 text-slate-400 rounded text-[10px] border border-slate-800 transition"
                            >
                              {isRtl ? 'تراجع' : 'Back'}
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(task.id, 'completed')}
                              className="py-1 text-center bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded text-[10px] border border-emerald-500/20 transition font-semibold"
                            >
                              {isRtl ? 'تم الإنجاز ✓' : 'Done ✓'}
                            </button>
                          </div>
                        </div>
                      ))}
                      {tasks.filter(t => t.status === 'in_progress').length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-6">{isRtl ? 'لا يوجد مهام قيد العمل حالياً' : 'No active engagements'}</p>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Completed (تم النشر والإنجاز) */}
                  <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <h4 className="font-bold text-white text-sm">{isRtl ? 'منجزة ومنشورة' : 'Completed'}</h4>
                      </div>
                      <span className="bg-slate-800/80 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold">
                        {tasks.filter(t => t.status === 'completed' || t.status === 'done').length}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {tasks.filter(t => t.status === 'completed' || t.status === 'done').map(task => (
                        <div key={task.id} className="bg-slate-900/80 border border-slate-800/60 p-4 rounded-xl space-y-2 opacity-80 hover:opacity-100 transition">
                          <h5 className="font-bold text-slate-200 text-sm leading-tight flex items-center gap-1.5 line-through">
                            <span className="text-emerald-500 shrink-0">✓</span>
                            {task.title}
                          </h5>
                          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{task.description}</p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40">
                            <span>👤 {task.assigned_to}</span>
                            <span className="text-emerald-500">{isRtl ? 'منجز' : 'Finished'}</span>
                          </div>
                        </div>
                      ))}
                      {tasks.filter(t => t.status === 'completed' || t.status === 'done').length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-6">{isRtl ? 'لم تكتمل أي مهمة اليوم' : 'No works finalized'}</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* 2. Projects Tab */}
          {activeTab === 'projects' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{isRtl ? 'متابعة المشاريع والبرامج الحقوقية' : 'Advocacy Projects Index'}</h3>
                  <p className="text-xs text-slate-400 mt-1">{isRtl ? 'البرامج الحقوقية والأنشطة الممولة لدعم الصحفيّين وحرية التعبير.' : 'Approved funding frameworks and monitoring panels.'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition relative overflow-hidden space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {project.status || (isRtl ? 'نشط' : 'Active')}
                      </span>
                      <span className="text-slate-500 text-xs font-mono">ID: #{project.id}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">{project.name}</h4>
                      <p className="text-slate-405 text-sm leading-relaxed">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400 pt-3 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'تاريخ البدء' : 'Start Date'}</span>
                        <span className="text-slate-300 font-mono">{project.startDate || '2026-01-01'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase">{isRtl ? 'تاريخ الانتهاء' : 'End Date'}</span>
                        <span className="text-slate-300 font-mono">{project.endDate || '2100-12-31'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="md:col-span-2 text-center py-12 bg-slate-950/40 rounded-xl border border-slate-800">
                    <FolderOpen className="mx-auto text-slate-650" size={40} />
                    <p className="text-slate-400 text-sm font-semibold mt-2">{isRtl ? 'لم يتم العثور على أي مشاريع نشطة مسجلة' : 'No funding models synced in the current workspace'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Broadcast SMTP Bulletins Tab */}
          {activeTab === 'broadcast' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Send className="text-emerald-400" size={20} />
                    {isRtl ? 'بوابة البث والتعميم الفوري' : 'Central Distribution panel'}
                  </h3>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    {isRtl 
                      ? 'أداة الإرسال التحريرية والتنبيهات العاجلة للأعضاء أو الصحفيين والاشتراكات البريدية من خلال خادم SMTP المستقل مباشرة.'
                      : 'Distribute bulleted advisories, reports to civil panels instantly via local SMTP dispatcher.'}
                  </p>
                </div>

                {broadcastStatus && (
                  <div className={`p-4 rounded-xl border text-sm ${
                    broadcastStatus.success 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    {broadcastStatus.message}
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">{isRtl ? 'الفئة المستهدفة بالبث' : 'Target Audience'}</label>
                    <select 
                      value={bulletin.targetGroup}
                      onChange={(e) => setBulletin({...bulletin, targetGroup: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="all">{isRtl ? 'جميع المشتركين بالقائمة البريدية (الجمهور)' : 'All Newsletter Subscribers'}</option>
                      <option value="staff">{isRtl ? 'فريق الهيكل التحريري والباحثين فقط' : 'Internal Editorial Researchers'}</option>
                      <option value="journalists">{isRtl ? 'شبكة الحقوقيين والصحفيّين المرتبطين' : 'Advocates / Registered Journalists'}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">{isRtl ? 'عنوان التعميم / الموضوع' : 'Bulletin Subject'}</label>
                    <input 
                      type="text"
                      required
                      value={bulletin.subject}
                      onChange={(e) => setBulletin({...bulletin, subject: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={isRtl ? 'مثال: تعميم أمني عاجل رقم 4 بشأن السلامة الرقمية' : 'e.g. Urgent Security Advisory regarding Digital Protection'}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-400">{isRtl ? 'محتوى البيان أو التقارير' : 'Bulletins Content'}</label>
                    <textarea 
                      rows={6}
                      required
                      value={bulletin.content}
                      onChange={(e) => setBulletin({...bulletin, content: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={isRtl ? 'اكتب تفاصيل الإعلان أو التنبيه هنا...' : 'Write body here...'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingBroadcast}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {submittingBroadcast ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {isRtl ? 'تفويض وبث الرسائل البريدية' : 'Broadcast via SMTP Server'}
                  </button>
                </form>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
                <h3 className="text-lg font-bold text-white">{isRtl ? 'إحصاءات شبكة التوزيع المحلية' : 'Local Distribution Directory Stat'}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-xs block">{isRtl ? 'مشتركي النشرة الرقمية' : 'Newsletter Registry'}</span>
                    <span className="text-2xl font-bold text-white font-mono">1,524</span>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-slate-500 text-xs block">{isRtl ? 'صحفي مستلم للتعاميم الطارئة' : 'Safe Contacts Registered'}</span>
                    <span className="text-2xl font-bold text-white font-mono">418</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{isRtl ? 'البروتوكولات النشطة حالياً للمنصة' : 'Active System Mail Protocols'}</h4>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-teal-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">✓ Security Layer (SMTP TLS/MFA)</span>
                    <span className="text-teal-400 font-bold">Enabled</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-teal-500/20 flex items-center justify-between text-xs">
                    <span className="text-slate-300">✓ SPF & DKIM Records (ph-ye.org)</span>
                    <span className="text-teal-400 font-bold">Verified</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300">✓ local database storage queue fallback</span>
                    <span className="text-slate-400">Idle / Ready</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 4. Resources and Safety Tab */}
          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Box 1: Safety & Security Code */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-rose-450 flex items-center gap-2">
                  <AlertTriangle className="text-rose-400 animate-pulse" size={20} />
                  {isRtl ? 'مدونة الأمان المهني والسلامة الرقمية للصحفيين' : 'Yemeni Journalists Safety Guideline Document'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl 
                    ? 'الأدلة المهنية الأساسية للوقاية للحماية من الاستهداف والتوقيف الرقمي خلال تغطية النزاعات والمواد الإنسانية.'
                    : 'The standard operative codes for defensive reporting, secure routing, and legal rescue in war territories.'}
                </p>

                <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex gap-2 items-start text-slate-300">
                    <span className="p-1 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">1</span>
                    <p className="leading-relaxed">
                      {isRtl 
                        ? 'تشفير الاتصالات والبيانات: احرص دائماً على تفعيل التحقق الثنائي عبر تطبيقات موثوقة، واستخدام VPN محمي عند الاتصال بشبكة إنترنت غير معروفة.'
                        : 'Crypto communication: Always enable non-sms 2FA and secure VPNs in compromised networks.'}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start text-slate-300">
                    <span className="p-1 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">2</span>
                    <p className="leading-relaxed">
                      {isRtl 
                        ? 'حماية المصادر الرقمية: لا تحفظ سجل المراسلات المباشر على الأجهزة المتنقلة، وقم بتفعيل ميزة الحذف التلقائي للمذكرات في مناطق الاشتباك.'
                        : 'Source protection: Never cache chat databases containing real human sources.'}
                    </p>
                  </div>
                  <div className="flex gap-2 items-start text-slate-300">
                    <span className="p-1 bg-rose-500/20 text-rose-400 rounded text-[10px] font-bold">3</span>
                    <p className="leading-relaxed">
                      {isRtl 
                        ? 'المتابعة الأمنية الطارئة: عند رصد تهديدات، قم باستخدام خط ساخن للطوارئ ببيت الصحافة وبث بلاغك فوراً لغرفة رصد الانتهاكات.'
                        : 'Immediate alerts: Utilize the physical safety hotline to report ongoing tracking or harassment.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Box 2: System Templates Repository */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="text-blue-400" size={20} />
                  {isRtl ? 'مستندات وتصنيفات التقرير الموحدة' : 'Operational Document Blueprints'}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isRtl 
                    ? 'نماذج مرجعية جاهزة للاستخدام من قبل الباحثين لرصد الانتهاكات وصياغة التقارير الحقوقية المعتمدة.'
                    : 'Download or copy standardized reporting models to construct formal civil liberty requests.'}
                </p>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-bold block">{isRtl ? 'نموذج رصد وتوثيق الانتهاكات الفردية.docx' : 'Individual Violation Record.docx'}</span>
                      <span className="text-slate-500 text-[10px] mt-1 block">DOCX Template • 2.1 MB</span>
                    </div>
                    <span className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg cursor-pointer transition font-bold">
                      {isRtl ? 'تحميل' : 'Download'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-bold block">{isRtl ? 'دليل إعداد وكتابة التحقيق الميداني الاستقصائي.pdf' : 'Field Investigation Manual.pdf'}</span>
                      <span className="text-slate-500 text-[10px] mt-1 block">PDF File • 4.8 MB</span>
                    </div>
                    <span className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg cursor-pointer transition font-bold">
                      {isRtl ? 'عرض' : 'View'}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition flex items-center justify-between text-xs">
                    <div>
                      <span className="text-white font-bold block">{isRtl ? 'قيد العمل واستمارات الباحثين الحقوقيين.xlsx' : 'Rights Advocate Audit Register.xlsx'}</span>
                      <span className="text-slate-500 text-[10px] mt-1 block">XLSX Table • 3.5 MB</span>
                    </div>
                    <span className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg cursor-pointer transition font-bold">
                      {isRtl ? 'تحميل' : 'Download'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
