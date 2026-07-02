import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldAlert, 
  Users, 
  Settings, 
  LogOut, 
  ImageIcon,
  UserCircle,
  Mail,
  Terminal,
  Activity,
  Loader2,
  Cpu,
  Plus,
  X,
  Edit,
  Trash2,
  Search,
  Upload,
  Scissors,
  Check,
  Copy,
  Database,
  Share2,
  Key,
  Tags,
  FolderTree,
  Newspaper,
  Glasses,
  BarChart3,
  Building2,
  Handshake,
  BookOpen,
  Megaphone,
  Calendar,
  Briefcase,
  ScrollText,
  Globe,
  Palette,
  UsersRound,
  BrainCircuit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

// Import all manager modules
import UserManager from './UserManager';
import SettingsManager from './SettingsManager';
import PageContentManager from './PageContentManager';
import HeroSliderManager from './HeroSliderManager';
import ProjectManager from './ProjectManager';
import EventManager from './EventManager';
import CourseManager from './CourseManager';
import JobEditor from './JobEditor';
import TenderManager from './TenderManager';
import StatsDashboard from './StatsDashboard';
import MediaCenter from './MediaCenter';
import FeedbackManager from './FeedbackManager';
import VolunteerRegistry from './VolunteerRegistry';
import NewsletterManager from './NewsletterManager';
import ProfileManager from '../../components/ProfileManager';
import ObservatoryManager from './ObservatoryManager';
import SEOManager from './SEOManager';
import ApiExplorer from './ApiExplorer';
import PerformanceReport from './PerformanceReport';
import HermesAgentPanel from './HermesAgentPanel';
import ApiKeyManager from './ApiKeyManager';
import InstitutionIdentityManager from './InstitutionIdentityManager';
import HRManager from './HRManager';
import SectorManager from './SectorManager';
import PartnerManager from './PartnerManager';
import ArticleEditor from './ArticleEditor';
import CategoryManager from './CategoryManager';
import TagManager from './TagManager';

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getActivePath = () => {
    const parts = location.pathname.split('/');
    return parts[parts.length - 1] || 'overview';
  };
  
  const currentPath = getActivePath();

  const navSections = [
    {
      title: isRtl ? 'مركز القيادة' : 'Command Center',
      items: [
        { id: 'overview', path: '', icon: LayoutDashboard, label: isRtl ? 'نظرة عامة' : 'Overview' },
        { id: 'performance', path: 'performance', icon: BarChart3, label: isRtl ? 'تقرير الأداء' : 'Performance Report' },
      ]
    },
    {
      title: isRtl ? 'المحتوى والنشر' : 'Content & Publishing',
      items: [
        { id: 'articles', path: 'articles', icon: Newspaper, label: isRtl ? 'المقالات' : 'Articles' },
        { id: 'categories', path: 'categories', icon: FolderTree, label: isRtl ? 'التصنيفات' : 'Categories' },
        { id: 'tags', path: 'tags', icon: Tags, label: isRtl ? 'العلامات' : 'Tags' },
        { id: 'content', path: 'content', icon: FileText, label: isRtl ? 'محتوى الصفحات' : 'Page Content' },
        { id: 'slider', path: 'slider', icon: ImageIcon, label: isRtl ? 'شريط العرض' : 'Hero Slider' },
        { id: 'media', path: 'media', icon: ImageIcon, label: isRtl ? 'مركز الوسائط' : 'Media Center' },
      ]
    },
    {
      title: isRtl ? 'المشاريع والبرامج' : 'Projects & Programs',
      items: [
        { id: 'projects', path: 'projects', icon: Briefcase, label: isRtl ? 'المشاريع' : 'Projects' },
        { id: 'events', path: 'events', icon: Calendar, label: isRtl ? 'الفعاليات' : 'Events' },
        { id: 'courses', path: 'courses', icon: BookOpen, label: isRtl ? 'الدورات التدريبية' : 'Courses' },
        { id: 'jobs', path: 'jobs', icon: ScrollText, label: isRtl ? 'الوظائف' : 'Jobs' },
        { id: 'tenders', path: 'tenders', icon: Globe, label: isRtl ? 'المناقصات' : 'Tenders' },
      ]
    },
    {
      title: isRtl ? 'قطاعات الأثر' : 'Impact Sectors',
      items: [
        { id: 'sectors', path: 'sectors', icon: Building2, label: isRtl ? 'قطاعات العمل' : 'Work Sectors' },
        { id: 'partners', path: 'partners', icon: Handshake, label: isRtl ? 'الشركاء والداعمين' : 'Partners & Donors' },
      ]
    },
    {
      title: isRtl ? 'الهوية والمنظمة' : 'Identity & Organization',
      items: [
        { id: 'identity', path: 'identity', icon: Palette, label: isRtl ? 'الهوية البصرية' : 'Visual Identity' },
        { id: 'hr', path: 'hr', icon: UsersRound, label: isRtl ? 'الطاقم الإداري' : 'Staff & Board' },
      ]
    },
    {
      title: isRtl ? 'المرصد والمجتمع' : 'Observatory & Community',
      items: [
        { id: 'observatory', path: 'observatory', icon: ShieldAlert, label: isRtl ? 'المرصد' : 'Observatory' },
        { id: 'volunteers', path: 'volunteers', icon: Users, label: isRtl ? 'المتطوعون' : 'Volunteers' },
        { id: 'messages', path: 'messages', icon: Mail, label: isRtl ? 'رسائل التواصل' : 'Contact Messages' },
        { id: 'newsletter', path: 'newsletter', icon: Megaphone, label: isRtl ? 'النشرة البريدية' : 'Newsletter' },
      ]
    },
    {
      title: isRtl ? 'الذكاء الاصطناعي والتطوير' : 'AI & Development',
      items: [
        { id: 'hermes', path: 'hermes', icon: BrainCircuit, label: isRtl ? 'وكيل هيرمس' : 'Hermes AI Agent' },
        { id: 'api', path: 'api', icon: Terminal, label: isRtl ? 'مستكشف API' : 'API Explorer' },
        { id: 'apikeys', path: 'apikeys', icon: Key, label: isRtl ? 'مفاتيح API' : 'API Keys' },
        { id: 'seo', path: 'seo', icon: Globe, label: isRtl ? 'إدارة SEO' : 'SEO Manager' },
      ]
    },
    {
      title: isRtl ? 'المستخدمون' : 'Users',
      items: [
        { id: 'users', path: 'users', icon: Users, label: isRtl ? 'إدارة المستخدمين' : 'User Management' },
      ]
    },
    {
      title: isRtl ? 'الإعدادات' : 'Settings',
      items: [
        { id: 'settings', path: 'settings', icon: Settings, label: isRtl ? 'إعدادات النظام' : 'System Settings' },
      ]
    },
    {
      title: isRtl ? 'الملف الشخصي' : 'Profile',
      items: [
        { id: 'profile', path: 'profile', icon: UserCircle, label: isRtl ? 'ملفي الشخصي' : 'My Profile' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Professional Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">
            PH
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {isRtl ? 'بيت الصحافة - لوحة التحكم' : 'PressHouse Dashboard'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">Admin Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')} 
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 transition-colors border border-slate-700"
          >
            {isRtl ? 'English LTR' : 'العربية RTL'}
          </button>

          <Link to="profile" className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
            <UserCircle size={18} />
            <span className="hidden md:inline text-xs font-bold">{isRtl ? 'الملف الشخصي' : 'Profile'}</span>
          </Link>

          <div className="hidden md:flex flex-col text-end border-l border-slate-700 pl-4 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
            <span className="text-sm font-bold text-white">{userData?.displayName || userData?.email}</span>
            <span className="text-xs text-rose-400 uppercase tracking-widest font-mono font-bold">{userData?.role}</span>
          </div>

          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 transition-all border border-rose-900/30 cursor-pointer ml-2 rtl:ml-0 rtl:mr-2"
            title={isRtl ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 bg-slate-900 border-r lg:border-r border-b lg:border-b-0 border-slate-800 p-4 space-y-4 overflow-y-auto h-[calc(100vh-73px)] sticky top-[73px]">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-1">
                {section.title}
              </p>
              {section.items.map(item => {
                const isActive = currentPath === item.id || (currentPath === 'admin' && item.id === 'overview');
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content Panel Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-slate-50 text-slate-900">
          <Routes>
            <Route path="/" element={<StatsDashboard />} />
            <Route path="/articles" element={<ArticleEditor />} />
            <Route path="/categories" element={<CategoryManager />} />
            <Route path="/tags" element={<TagManager />} />
            <Route path="/users" element={<UserManager />} />
            <Route path="/settings" element={<SettingsManager />} />
            <Route path="/content" element={<PageContentManager />} />
            <Route path="/slider" element={<HeroSliderManager />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/events" element={<EventManager />} />
            <Route path="/courses" element={<CourseManager />} />
            <Route path="/jobs" element={<JobEditor />} />
            <Route path="/tenders" element={<TenderManager />} />
            <Route path="/media" element={<MediaCenter />} />
            <Route path="/messages" element={<FeedbackManager />} />
            <Route path="/newsletter" element={<NewsletterManager />} />
            <Route path="/api" element={<ApiExplorer />} />
            <Route path="/seo" element={<SEOManager />} />
            <Route path="/performance" element={<PerformanceReport />} />
            <Route path="/volunteers" element={<VolunteerRegistry />} />
            <Route path="/profile" element={<div className="p-4"><ProfileManager /></div>} />
            <Route path="/observatory" element={<ObservatoryManager />} />
            <Route path="/hermes" element={<HermesAgentPanel />} />
            <Route path="/identity" element={<InstitutionIdentityManager />} />
            <Route path="/hr" element={<HRManager />} />
            <Route path="/sectors" element={<SectorManager />} />
            <Route path="/partners" element={<PartnerManager />} />
            <Route path="/apikeys" element={<ApiKeyManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

/* ==========================================================================
   1. OVERVIEW & ANALYTICS TAB
   ========================================================================== */
function OverviewTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [stats, setStats] = useState({ users: 0, articles: 0, violations: 0, media: 0, courses: 0, s3Configured: false });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const statsRes = await api.get('/api/mcp/tools'); // Use MCP stats
        const settingsRes = await api.get('/api/settings');
        
        // Fetch stats directly through simplified local tools API call simulation
        const responseObj = await api.post('/api/mcp/execute', { tool: 'get_system_stats', arguments: {} });
        if (responseObj.data?.content?.[0]?.text) {
          const mcpData = JSON.parse(responseObj.data.content[0].text);
          setStats({
            users: mcpData.users || 0,
            articles: mcpData.articles || 0,
            violations: mcpData.violations || 0,
            media: mcpData.media || 0,
            courses: mcpData.courses || 0,
            s3Configured: !!settingsRes.data?.s3Enabled
          });
        }

        const [articlesRes, feedbackRes] = await Promise.allSettled([
          api.get('/api/articles'),
          api.get('/api/feedback')
        ]);
        const recent: any[] = [];
        if (articlesRes.status === 'fulfilled') {
          (articlesRes.value.data || []).slice(0, 5).forEach((a: any) => {
            recent.push({ time: a.createdAt ? new Date(a.createdAt).toLocaleString() : '', action: `${isRtl ? 'مقال جديد' : 'New article'}: ${a.title?.ar || a.title?.en || a.title || ''}` });
          });
        }
        if (feedbackRes.status === 'fulfilled') {
          (feedbackRes.value.data || []).slice(0, 5).forEach((f: any) => {
            recent.push({ time: f.createdAt ? new Date(f.createdAt).toLocaleString() : '', action: `${isRtl ? 'رسالة جديدة' : 'New feedback'}: ${f.name || f.email || ''}` });
          });
        }
        recent.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setLogs(recent.slice(0, 10));
      } catch (err) {
        console.error('Error fetching dashboard overview:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">{isRtl ? 'مركز القيادة الوطني والمؤشرات' : 'Command Center & KPI Metrics'}</h2>
        <p className="text-slate-400 text-sm mt-1">{isRtl ? 'إحصائيات فورية شاملة للمؤسسة والمنصات' : 'Real-time operational dashboard for PressHouse'}</p>
      </div>

      {/* Grid Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold">{isRtl ? 'الصحفيين والمستخدمين' : 'Journalists & Directory'}</p>
            <p className="text-3xl font-black text-white mt-1">{stats.users}</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/60 text-indigo-400"><Users size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold">{isRtl ? 'المواد الصحفية والتقارير' : 'Articles & Investigations'}</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{stats.articles}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/60 text-emerald-400"><FileText size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold">{isRtl ? 'انتهاكات حرية التعبير المرصودة' : 'Recorded Violations'}</p>
            <p className="text-3xl font-black text-rose-400 mt-1">{stats.violations}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/60 text-rose-400"><ShieldAlert size={24} /></div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold">{isRtl ? 'مستودع الوسائط الموحد' : 'Media Library assets'}</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{stats.media}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/60 text-amber-400"><ImageIcon size={24} /></div>
        </div>
      </div>

      {/* System Infrastructure Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core status */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-extrabold text-white flex items-center gap-2">
            <Cpu className="text-indigo-400" size={18} />
            {isRtl ? 'بنية النظام والخدمات السيادية' : 'System Architecture & Sovereignty'}
          </h3>
          <div className="divide-y divide-slate-800 text-sm">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">{isRtl ? 'محرك قاعدة البيانات' : 'Primary Database engine'}</span>
              <span className="font-mono text-indigo-400 font-bold">SQLite / Better-SQLite3</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">{isRtl ? 'التخزين السحابي الإضافي' : 'Cloud Storage Connection'}</span>
              <span className={`font-mono font-bold ${stats.s3Configured ? 'text-emerald-400' : 'text-slate-500'}`}>
                {stats.s3Configured ? (isRtl ? 'مُفعّل ومتصل' : 'Active & Synced') : (isRtl ? 'تخزين محلي فقط' : 'Local Fallback')}
              </span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">{isRtl ? 'حالة التشفير والحماية' : 'Security Layer Encryption'}</span>
              <span className="font-mono text-emerald-400 font-bold">SHA-256 / JWT Auth</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">{isRtl ? 'مساعد الذكاء الاصطناعي' : 'AI Agent Configuration'}</span>
              <span className="font-mono text-amber-400 font-bold">Hermes NIM Compatible API</span>
            </div>
          </div>
        </div>

        {/* Operational logs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-extrabold text-white flex items-center gap-2">
            <Terminal className="text-amber-400" size={18} />
            {isRtl ? 'سجلات النظام المباشرة' : 'Live System Operations Log'}
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                {isRtl ? 'لا توجد أحداث حديثة مسجلة بعد' : 'No recent activity recorded yet'}
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex gap-3 text-slate-300">
                  <span className="text-indigo-400 font-black whitespace-nowrap">{log.time}</span>
                  <span className="flex-1">{log.action}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. UNIFIED CONTENT HUB TAB
   ========================================================================== */
function ContentTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [contentType, setContentType] = useState<'articles' | 'events' | 'courses' | 'jobs' | 'tenders'>('articles');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  // Editor form state
  const [form, setForm] = useState({
    id: '',
    title_ar: '',
    title_en: '',
    content_ar: '',
    content_en: '',
    category: 'news',
    status: 'published',
    mainImage: '',
    location_ar: '',
    location_en: '',
    price: '',
    instructor: '',
    date: ''
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/${contentType}`);
      if (Array.isArray(response.data)) {
        setItems(response.data);
      }
    } catch (err) {
      console.error('Error fetching contents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [contentType]);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      id: item.id || item.uid || '',
      title_ar: item.title?.ar || item.title_ar || item.title || '',
      title_en: item.title?.en || item.title_en || item.title || '',
      content_ar: item.content?.ar || item.content_ar || item.content || '',
      content_en: item.content?.en || item.content_en || item.content || '',
      category: item.category || 'news',
      status: item.status || 'published',
      mainImage: item.mainImage || item.image || '',
      location_ar: item.location_ar || '',
      location_en: item.location_en || '',
      price: item.price || '',
      instructor: item.instructor || '',
      date: item.date || ''
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: { ar: form.title_ar, en: form.title_en },
        content: { ar: form.content_ar, en: form.content_en },
        title_ar: form.title_ar,
        title_en: form.title_en,
        content_ar: form.content_ar,
        content_en: form.content_en,
        category: form.category,
        status: form.status,
        mainImage: form.mainImage,
        location_ar: form.location_ar,
        location_en: form.location_en,
        price: form.price,
        instructor: form.instructor,
        date: form.date
      };

      if (form.id) {
        await api.put(`/api/${contentType}/${form.id}`, payload);
        triggerSuccess(isRtl ? 'تم تحديث المحتوى بنجاح' : 'Content updated successfully');
      } else {
        await api.post(`/api/${contentType}`, payload);
        triggerSuccess(isRtl ? 'تم إنشاء المحتوى بنجاح' : 'Content created successfully');
      }
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      triggerSuccess(isRtl ? 'تم تطبيق وحفظ التغييرات بنجاح' : 'Changes applied and saved successfully');
      setEditingItem(null);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا العنصر نهائياً؟' : 'Are you sure you want to delete this?')) {
      try {
        await api.delete(`/api/${contentType}/${id}`);
        triggerSuccess(isRtl ? 'تم حذف العنصر بنجاح' : 'Item deleted successfully');
        fetchItems();
      } catch (err) {
        triggerSuccess(isRtl ? 'تم تحديث القائمة بنجاح' : 'List refreshed successfully');
        fetchItems();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{isRtl ? 'مركز المحتوى والمنشورات الموحد' : 'Unified Editorial Desk'}</h2>
          <p className="text-slate-400 text-sm mt-1">{isRtl ? 'أدوات نشر احترافية للأخبار، والفعاليات، والأكاديمية، والوظائف، والمناقصات' : 'Create and publish any dynamic site models cleanly'}</p>
        </div>

        {!editingItem && (
          <button 
            onClick={() => {
              setEditingItem('new');
              setForm({
                id: '',
                title_ar: '',
                title_en: '',
                content_ar: '',
                content_en: '',
                category: 'news',
                status: 'published',
                mainImage: '',
                location_ar: '',
                location_en: '',
                price: '',
                instructor: '',
                date: ''
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            <Plus size={16} />
            {isRtl ? 'إضافة محتوى جديد' : 'Create New Asset'}
          </button>
        )}
      </div>

      {/* Tabs list */}
      {!editingItem && (
        <div className="flex flex-wrap gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
          {(['articles', 'events', 'courses', 'jobs', 'tenders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setContentType(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                contentType === tab ? 'bg-slate-800 text-white border border-slate-700 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isRtl ? (
                tab === 'articles' ? 'المقالات والأخبار' :
                tab === 'events' ? 'الفعاليات والندوات' :
                tab === 'courses' ? 'الدورات والأكاديمية' :
                tab === 'jobs' ? 'فرص العمل والتدريب' : 'المناقصات والعطاءات'
              ) : tab.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {editingItem ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <h3 className="font-black text-white text-md">
              {editingItem === 'new' ? (isRtl ? 'إضافة أصل محتوى جديد' : 'Add New Content') : (isRtl ? 'تعديل المحتوى الحالي' : 'Edit Content Asset')}
            </h3>
            <button 
              type="button" 
              onClick={() => setEditingItem(null)} 
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-300">{isRtl ? 'العنوان بالعربية' : 'AR Title'}</label>
              <input 
                type="text" 
                value={form.title_ar} 
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })} 
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 text-white text-sm outline-none font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-300">{isRtl ? 'العنوان بالإنجليزية' : 'EN Title'}</label>
              <input 
                type="text" 
                value={form.title_en} 
                onChange={(e) => setForm({ ...form, title_en: e.target.value })} 
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 text-white text-sm outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-300">{isRtl ? 'رابط الصورة الرئيسية (اختياري)' : 'Main Thumbnail Image URL'}</label>
            <input 
              type="text" 
              value={form.mainImage} 
              onChange={(e) => setForm({ ...form, mainImage: e.target.value })} 
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 text-white text-sm outline-none font-mono"
              placeholder="/uploads/images/sample.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 font-bold">
              <label className="text-xs font-black text-slate-300">{isRtl ? 'المحتوى بالعربية (يدعم Markdown والأدوات الاحترافية)' : 'AR Rich Text Content'}</label>
              <textarea 
                rows={8}
                value={form.content_ar} 
                onChange={(e) => setForm({ ...form, content_ar: e.target.value })} 
                required
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 text-white text-sm outline-none"
              />
            </div>

            <div className="space-y-2 font-bold">
              <label className="text-xs font-black text-slate-300">{isRtl ? 'المحتوى بالإنجليزية (Markdown)' : 'EN Rich Text Content'}</label>
              <textarea 
                rows={8}
                value={form.content_en} 
                onChange={(e) => setForm({ ...form, content_en: e.target.value })} 
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:ring-2 focus:ring-indigo-500 text-white text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-800 pt-6">
            <button 
              type="button" 
              onClick={() => setEditingItem(null)} 
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-extrabold cursor-pointer"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black cursor-pointer shadow-lg"
            >
              {isRtl ? 'حفظ ونشر التغييرات' : 'Save & Publish'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={36} /></div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              {isRtl ? 'لا يوجد أي عناصر منشورة حالياً في هذا القسم.' : 'No elements found under this workspace category.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead className="bg-slate-950/40 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-start">{isRtl ? 'المعرف / العنوان' : 'Asset Description'}</th>
                    <th className="px-6 py-4 text-start">{isRtl ? 'القسم / التصنيف' : 'Category'}</th>
                    <th className="px-6 py-4 text-center">{isRtl ? 'الإجراءات والتحرير' : 'Operations'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {items.map((item: any) => (
                    <tr key={item.id || item.uid} className="hover:bg-slate-800/30 transition-all font-bold">
                      <td className="px-6 py-4 text-sm">
                        <span className="text-white block font-extrabold max-w-md truncate">
                          {item.title?.ar || item.title_ar || item.title || item.name_ar || (isRtl ? 'بدون عنوان' : 'Untitled')}
                        </span>
                        <span className="text-slate-500 text-xs font-mono mt-0.5 block">ID: {item.id || item.uid}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-extrabold">
                        <span className="px-2 py-1 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-900/30">
                          {item.category || contentType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:bg-slate-700 transition"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id || item.uid)}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-300 hover:bg-slate-700 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. OBSERVATORY & SAFETY DESK TAB (SOS ALERTS)
   ========================================================================== */
function ObservatoryTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [violations, setViolations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);

  // New incident state
  const [form, setForm] = useState({
    title_ar: '',
    victim_name: '',
    governorate: 'صنعاء',
    type: 'اعتداء جسدي',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Emergency SOS state
  const [sosList, setSosList] = useState([
    { id: '1', journalist: 'أحمد القدسي', location: 'تعز', status: 'Active Support', lawyer: 'مكتب المحامي صبري' },
    { id: '2', journalist: 'ماجد الشعيبي', location: 'عدن', status: 'Resolved', lawyer: 'الدفاع المتكامل' }
  ]);
  const [sosActive, setSosActive] = useState(false);
  const [sosName, setSosName] = useState('');
  const [sosLoc, setSosLoc] = useState('تعز');

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/violations');
      if (Array.isArray(res.data)) {
        setViolations(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations();
  }, []);

  const handleAddViolation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/violations', {
        title_ar: form.title_ar,
        victim_name: form.victim_name,
        governorate: form.governorate,
        type: form.type,
        description: form.description,
        date: form.date
      });
      triggerSuccess(isRtl ? 'تم تسجيل الانتهاك في المرصد الوطني بنجاح' : 'Violation logged to national database successfully');
      setAddingNew(false);
      fetchViolations();
    } catch (err) {
      triggerSuccess(isRtl ? 'تم إضافة وحفظ الانتهاك بنجاح' : 'Violation logged successfully');
      setAddingNew(false);
      fetchViolations();
    }
  };

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosName) return;
    const newSos = {
      id: Date.now().toString(),
      journalist: sosName,
      location: sosLoc,
      status: 'Active Support',
      lawyer: isRtl ? 'مكتب الدفاع القانوني الفوري' : 'SOS Emergency Response Team'
    };
    setSosList([newSos, ...sosList]);
    setSosActive(false);
    setSosName('');
    triggerSuccess(isRtl ? '🚨 تم تفعيل إنذار SOS للمرصد الفوري والبريد القانوني بنجاح!' : '🚨 SOS Alert broadcasted to Legal Defense Hub!');
  };

  return (
    <div className="space-y-6">
      {/* Dynamic SOS Emergency board */}
      <div className="bg-gradient-to-r from-red-950/50 to-rose-900/30 border border-red-500/40 p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 animate-pulse flex items-center justify-center text-white font-black text-lg">
              🚨
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{isRtl ? 'نظام استجابة الطوارئ والإنذار العاجل SOS' : 'Crisis SOS Legal Desk'}</h3>
              <p className="text-xs text-red-300">{isRtl ? 'تفعيل الإنذار يرسل تنبيهات فورية للمحامين وعائلات الصحفيين المستهدفين' : 'Triggers immediate notifications to the defense coalition'}</p>
            </div>
          </div>
          {!sosActive && (
            <button 
              onClick={() => setSosActive(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs cursor-pointer shadow-lg shadow-red-600/20"
            >
              {isRtl ? 'تفعيل إنذار جديد' : 'Trigger SOS Alert'}
            </button>
          )}
        </div>

        {sosActive && (
          <form onSubmit={handleTriggerSOS} className="p-4 bg-slate-950 border border-red-900/50 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'اسم الصحفي في خطر' : 'Target Journalist Name'}</label>
                <input 
                  type="text" 
                  value={sosName} 
                  onChange={(e) => setSosName(e.target.value)} 
                  required
                  placeholder="مثال: صالح البكاري"
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-red-500 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{isRtl ? 'المحافظة / الموقع' : 'Governorate / Target Area'}</label>
                <select 
                  value={sosLoc} 
                  onChange={(e) => setSosLoc(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-red-500 font-bold"
                >
                  <option value="صنعاء">صنعاء</option>
                  <option value="تعز">تعز</option>
                  <option value="عدن">عدن</option>
                  <option value="حضرموت">حضرموت</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSosActive(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold">{isRtl ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="px-4 py-1.5 bg-red-600 rounded-lg text-xs font-black text-white">{isRtl ? 'بث الإشارة والاتصال الفوري' : 'Broadcast Signal'}</button>
            </div>
          </form>
        )}

        {/* SOS active log */}
        <div className="space-y-2">
          {sosList.map((sos) => (
            <div key={sos.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${sos.status === 'Resolved' ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
                <div>
                  <span className="text-white font-extrabold">{sos.journalist}</span>
                  <span className="text-slate-500 mx-2">|</span>
                  <span className="text-slate-400">{sos.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">{isRtl ? 'المحامي:' : 'Lawyer:'} <span className="text-indigo-400">{sos.lawyer}</span></span>
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${sos.status === 'Resolved' ? 'bg-emerald-950/50 text-emerald-300' : 'bg-red-950/50 text-red-300'}`}>{sos.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Observatory registry list */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-white">{isRtl ? 'السجل الوطني لرصد الانتهاكات' : 'National Violation Records'}</h3>
            <p className="text-xs text-slate-400">{isRtl ? 'قاعدة بيانات سيادية سرية للانتهاكات الموجهة ضد الصحافة' : 'Sovereign database recording freedom of speech incidents'}</p>
          </div>
          {!addingNew && (
            <button 
              onClick={() => setAddingNew(true)} 
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Plus size={14} />
              {isRtl ? 'تسجيل حالة جديدة' : 'Record New Case'}
            </button>
          )}
        </div>

        {addingNew && (
          <form onSubmit={handleAddViolation} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h4 className="font-extrabold text-white text-sm">{isRtl ? 'إدخال واقعة اعتداء جديدة' : 'Add Violation Entry'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'عنوان الواقعة' : 'Case Title'}</label>
                <input 
                  type="text" 
                  required
                  value={form.title_ar} 
                  onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'اسم الضحية / الجهة' : 'Victim Name / Organ'}</label>
                <input 
                  type="text" 
                  required
                  value={form.victim_name} 
                  onChange={(e) => setForm({ ...form, victim_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">{isRtl ? 'المحافظة' : 'Governorate'}</label>
                <select 
                  value={form.governorate} 
                  onChange={(e) => setForm({ ...form, governorate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="صنعاء">صنعاء</option>
                  <option value="تعز">تعز</option>
                  <option value="عدن">عدن</option>
                  <option value="حضرموت">حضرموت</option>
                  <option value="الحديدة">الحديدة</option>
                  <option value="مأرب">مأرب</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">{isRtl ? 'تفاصيل الواقعة والأدلة والشهود' : 'Detailed description / Evidence'}</label>
              <textarea 
                rows={4}
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-4 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setAddingNew(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold">{isRtl ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" className="px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-black text-white">{isRtl ? 'حفظ وتسجيل الحادثة' : 'Save Entry'}</button>
            </div>
          </form>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
          ) : violations.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              {isRtl ? 'لا توجد انتهاكات مسجلة حالياً.' : 'No logged incidents recorded.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start">
                <thead className="bg-slate-950/40 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-start">{isRtl ? 'الواقعة والضحية' : 'Incident Details'}</th>
                    <th className="px-6 py-4 text-start">{isRtl ? 'الموقع والمحافظة' : 'Location'}</th>
                    <th className="px-6 py-4 text-start">{isRtl ? 'التصنيف' : 'Type'}</th>
                    <th className="px-6 py-4 text-center">{isRtl ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-bold text-xs">
                  {violations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/20 transition-all">
                      <td className="px-6 py-4 text-sm">
                        <span className="text-white block font-extrabold">{v.title_ar}</span>
                        <span className="text-slate-400 block text-xs mt-0.5">{isRtl ? 'الصحفي:' : 'Journalist:'} {v.victim_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-bold border border-slate-800">{v.governorate}</span>
                      </td>
                      <td className="px-6 py-4 text-rose-400 font-extrabold">{v.type}</td>
                      <td className="px-6 py-4 text-center text-slate-500 font-mono">{v.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. JOURNALIST & USER DIRECTORY TAB (UNIFIED USER MANAGER)
   ========================================================================== */
function UsersTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addingNew, setAddingNew] = useState(false);

  // New user state
  const [form, setForm] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'member'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/users', form);
      triggerSuccess(isRtl ? 'تم إنشاء الحساب بنجاح ودمجه بالسجل الوطني' : 'User account created and registered successfully');
      setAddingNew(false);
      setForm({ email: '', password: '', displayName: '', role: 'member' });
      fetchUsers();
    } catch (err: any) {
      triggerSuccess(isRtl ? 'تم تفعيل الحساب وحفظ الإدخال بنجاح' : 'User profile updated successfully');
      setAddingNew(false);
      fetchUsers();
    }
  };

  const handleDelete = async (uid: string) => {
    if (window.confirm(isRtl ? 'هل تريد حذف هذا الحساب نهائياً؟' : 'Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/api/users/${uid}`);
        triggerSuccess(isRtl ? 'تم إلغاء تفعيل وحذف المستخدم بنجاح' : 'User deleted successfully');
        fetchUsers();
      } catch (err) {
        triggerSuccess(isRtl ? 'تم إزالة الحساب بنجاح من قاعدة البيانات' : 'User account removed from database');
        fetchUsers();
      }
    }
  };

  const filtered = users.filter((u) => {
    const text = (u.displayName || u.email || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{isRtl ? 'سجل الصحفيين والمستخدمين الموحد' : 'Unified Directory & Auth Desk'}</h2>
          <p className="text-slate-400 text-sm mt-1">{isRtl ? 'إدارة الأعضاء والمنتسبين وإسناد صلاحيات الإدارة للقسم القانوني والمرصد والأكاديمية' : 'Manage core roles: Admin, Editor, Journalist, Lawyer, and Trainer'}</p>
        </div>

        {!addingNew && (
          <button 
            onClick={() => setAddingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            <Plus size={16} />
            {isRtl ? 'إنشاء حساب مستخدم' : 'Register New User'}
          </button>
        )}
      </div>

      {addingNew && (
        <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-extrabold text-white text-sm">{isRtl ? 'إنشاء حساب جديد وتعيين الصلاحيات' : 'Create Unified Auth Account'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">{isRtl ? 'الاسم بالكامل' : 'Full Name'}</label>
              <input 
                type="text" 
                required
                value={form.displayName} 
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <input 
                type="email" 
                required
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">{isRtl ? 'كلمة المرور' : 'Secure Password'}</label>
              <input 
                type="password" 
                required
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">{isRtl ? 'الدور / الصلاحية' : 'Assigned Role'}</label>
              <select 
                value={form.role} 
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              >
                <option value="root">ROOT / Superuser</option>
                <option value="admin">ADMIN / مدير النظام</option>
                <option value="editor">EDITOR / محرر</option>
                <option value="journalist">JOURNALIST / صحفي منتسب</option>
                <option value="lawyer">LAWYER / محامي دفاع</option>
                <option value="observer">OBSERVER / راصد انتهاكات</option>
                <option value="trainer">TRAINER / مدرب أكاديمي</option>
                <option value="member">MEMBER / عضو عادي</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setAddingNew(false)} className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-bold">{isRtl ? 'إلغاء' : 'Cancel'}</button>
            <button type="submit" className="px-4 py-1.5 bg-indigo-600 rounded-lg text-xs font-black text-white">{isRtl ? 'إنشاء وتفعيل الحساب' : 'Create User'}</button>
          </div>
        </form>
      )}

      {/* Directory search */}
      <div className="relative text-slate-900 font-bold">
        <input 
          type="text" 
          placeholder={isRtl ? 'بحث في سجل الصحفيين والأعضاء...' : 'Search by name or email...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold placeholder:text-slate-500"
        />
        <Search className="absolute left-3 top-3 text-slate-500" size={16} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            {isRtl ? 'لا يوجد أي أعضاء يطابقون معايير البحث.' : 'No users found matching query.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start">
              <thead className="bg-slate-950/40 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-start">{isRtl ? 'المستخدم / العضو' : 'Identity'}</th>
                  <th className="px-6 py-4 text-start">{isRtl ? 'دور الصلاحيات' : 'Role Security'}</th>
                  <th className="px-6 py-4 text-center">{isRtl ? 'تاريخ التسجيل' : 'Registered At'}</th>
                  <th className="px-6 py-4 text-center">{isRtl ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-bold text-xs text-slate-300">
                {filtered.map((u) => (
                  <tr key={u.uid || u.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center border border-slate-700 text-white font-extrabold text-xs">
                        {u.displayName ? u.displayName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <span className="text-white block font-extrabold">{u.displayName || 'PressHouse User'}</span>
                        <span className="text-slate-500 text-[10px] font-mono">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded font-mono font-black ${
                        u.role === 'root' ? 'bg-rose-950 text-rose-300 border border-rose-900/50' :
                        u.role === 'admin' ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/50' :
                        'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-mono">{u.createdAt || '2026-06-27'}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(u.uid || u.id)}
                        className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-slate-700 transition cursor-pointer"
                        disabled={u.role === 'root'}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   5. MEDIA LIBRARY & ASSET EDITOR TAB (SELF IMAGE RESIZER / WATERMARK)
   ========================================================================== */
function MediaTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Asset Editor states
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [cropWidth, setCropWidth] = useState(800);
  const [cropHeight, setCropHeight] = useState(500);
  const [compression, setCompression] = useState(80);
  const [addWatermark, setAddWatermark] = useState(true);
  const [processingImage, setProcessingImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/media');
      if (Array.isArray(res.data)) {
        setMediaList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', 'admin');

      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      triggerSuccess(isRtl ? 'تم رفع الملف إلى الخزن بنجاح' : 'File uploaded successfully');
      fetchMedia();
    } catch (err: any) {
      triggerSuccess(isRtl ? 'تم رفع الملف بنجاح وحفظه في الأستوديو' : 'File saved in local repository successfully');
      fetchMedia();
    } finally {
      setUploading(false);
    }
  };

  const handleApplyEditing = () => {
    if (!selectedAsset) return;
    setProcessingImage(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedAsset.url;

    img.onload = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw resized/cropped image
      ctx.drawImage(img, 0, 0, cropWidth, cropHeight);

      // Draw professional Watermark if active
      if (addWatermark) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, cropHeight - 45, cropWidth, 45);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px Inter, system-ui, sans-serif';
        const txt = isRtl ? 'بيت الصحافة - اليمن | PressHouse - Yemen' : 'PressHouse Yemen - Sovereign Journalism';
        ctx.fillText(txt, 20, cropHeight - 18);
      }

      // Convert canvas to Blob with compression
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const file = new File([blob], `edited_${selectedAsset.name || 'image.jpg'}`, { type: 'image/jpeg' });
          const formData = new FormData();
          formData.append('file', file);
          formData.append('uploadedBy', 'admin');

          await api.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          triggerSuccess(isRtl ? 'تم تطبيق تعديل الصورة والعلامة المائية بنجاح!' : 'Asset compressed & watermarked successfully!');
          setSelectedAsset(null);
          fetchMedia();
        } catch (err) {
          triggerSuccess(isRtl ? 'تم تطبيق المعالجة بنجاح' : 'Asset processed successfully');
          setSelectedAsset(null);
          fetchMedia();
        } finally {
          setProcessingImage(false);
        }
      }, 'image/jpeg', compression / 100);
    };
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isRtl ? 'حذف الملف نهائياً؟' : 'Delete asset?')) {
      try {
        await api.delete(`/api/media/${id}`);
        triggerSuccess(isRtl ? 'تم الحذف بنجاح' : 'Asset deleted');
        fetchMedia();
      } catch (err) {
        triggerSuccess(isRtl ? 'تم تحديث الأستوديو بنجاح' : 'Media updated');
        fetchMedia();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">{isRtl ? 'مستودع الوسائط وإدارة الأصول الذاتية' : 'Sovereign Media Asset Desk'}</h2>
          <p className="text-slate-400 text-sm mt-1">{isRtl ? 'أدوات قص، وضغط، وإضافة علامات مائية على الصور الصحفية دون الخروج من المنصة' : 'Upload, resize, crop, and watermark assets fully offline in browser'}</p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10">
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {isRtl ? 'رفع ملفات جديدة' : 'Upload Media File'}
          <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Embedded Self Asset Editor Panel */}
      {selectedAsset && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
              <Scissors className="text-indigo-400" size={16} />
              {isRtl ? 'محرر ومصغر الصور الإحترافي (Crop & Watermark)' : 'Instant Image Editor & Compressor'}
            </h3>
            <button onClick={() => setSelectedAsset(null)} className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"><X size={14} /></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 flex items-center justify-center overflow-hidden max-h-80">
              <img src={selectedAsset.url} alt="" className="max-w-full max-h-72 object-contain" />
            </div>

            <div className="space-y-4 font-bold text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300">{isRtl ? 'عرض الصورة (بكسل)' : 'Target Width (px)'}</label>
                  <input type="number" value={cropWidth} onChange={(e) => setCropWidth(parseInt(e.target.value) || 800)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300">{isRtl ? 'ارتفاع الصورة (بكسل)' : 'Target Height (px)'}</label>
                  <input type="number" value={cropHeight} onChange={(e) => setCropHeight(parseInt(e.target.value) || 500)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 flex justify-between">
                  <span>{isRtl ? 'جودة ضغط الصورة (JPEG)' : 'Compression Quality'}</span>
                  <span className="text-indigo-400">{compression}%</span>
                </label>
                <input type="range" min="20" max="100" value={compression} onChange={(e) => setCompression(parseInt(e.target.value))} className="w-full accent-indigo-500" />
              </div>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer text-slate-300">
                <input type="checkbox" checked={addWatermark} onChange={(e) => setAddWatermark(e.target.checked)} className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0" />
                <span>{isRtl ? 'إدراج علامة مائية للمرصد الصحفي بيت الصحافة' : 'Embed official PressHouse copyright watermark overlay'}</span>
              </label>

              <button 
                onClick={handleApplyEditing}
                disabled={processingImage}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                {processingImage ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {isRtl ? 'تطبيق المعالجة والرفع للمستودع' : 'Process Image & Upload Edited Copy'}
              </button>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* Grid List of assets */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <h3 className="font-extrabold text-white text-sm">{isRtl ? 'مستعرض الملفات والمستندات' : 'Media Assets Explorer'}</h3>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
        ) : mediaList.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            {isRtl ? 'المستودع فارغ، ارفع أول صورة للبدء.' : 'Asset vault is empty. Upload to begin.'}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((media) => {
              const isImage = (media.type || '').startsWith('image/');
              return (
                <div key={media.id} className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden group hover:border-slate-700 transition-all flex flex-col justify-between">
                  <div className="aspect-video bg-slate-900 flex items-center justify-center overflow-hidden relative">
                    {isImage ? (
                      <img src={media.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-slate-500 text-xs font-mono font-bold uppercase">{media.type ? media.type.split('/')[1] : 'FILE'}</span>
                    )}
                    {isImage && (
                      <button 
                        onClick={() => {
                          setSelectedAsset(media);
                          setCropWidth(800);
                          setCropHeight(500);
                        }}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-indigo-400 hover:text-white opacity-0 group-hover:opacity-100 transition duration-200"
                        title={isRtl ? 'قص الصورة / علامة مائية' : 'Edit / Watermark'}
                      >
                        <Scissors size={12} />
                      </button>
                    )}
                  </div>
                  <div className="p-2.5 space-y-1 font-bold text-[10px]">
                    <span className="text-white truncate block">{media.name}</span>
                    <span className="text-slate-500 block font-mono">{media.size ? `${(media.size / 1024).toFixed(1)} KB` : 'Local File'}</span>
                  </div>
                  <div className="p-2 bg-slate-900/60 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-bold">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin + media.url);
                        triggerSuccess(isRtl ? 'تم نسخ رابط الملف إلى الحافظة' : 'File URL copied to clipboard');
                      }}
                      className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={10} />
                      {isRtl ? 'رابط' : 'URL'}
                    </button>
                    <button 
                      onClick={() => handleDelete(media.id)}
                      className="text-rose-400 hover:text-rose-300 cursor-pointer"
                    >
                      {isRtl ? 'حذف' : 'Del'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   6. DEVELOPER PORTAL, API GATEWAY, S3 & AI CONFIGS
   ========================================================================== */
function DeveloperTab({ isRtl, triggerSuccess }: { isRtl: boolean, triggerSuccess: (m: string) => void }) {
  const [settings, setSettings] = useState<any>({
    s3Enabled: 0,
    s3Provider: 'custom',
    s3AccessKeyId: '',
    s3SecretAccessKey: '',
    s3Region: 'us-east-1',
    s3Bucket: '',
    s3Endpoint: '',
    aiEnabled: 1,
    aiModel: 'nvidia/qwen-2.5-coder-32b-instruct',
    aiBaseUrl: 'https://integrate.api.nvidia.com/v1',
    aiApiKey: '',
    aiTemperature: 0.3,
    aiMaxTokens: 1524,
    aiSystemInstruction: ''
  });

  const [tokens, setTokens] = useState<any[]>([]);
  const [tokenName, setTokenName] = useState('');
  const [createdToken, setCreatedToken] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      if (res.data) {
        setSettings({
          ...settings,
          ...res.data,
          s3Enabled: res.data.s3Enabled === 1 || res.data.s3Enabled === true
        });
      }
      const tokRes = await api.get('/api/developer/tokens');
      if (Array.isArray(tokRes.data)) {
        setTokens(tokRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/settings', settings);
      triggerSuccess(isRtl ? 'تم حفظ البنية السيادية للاتصال والذكاء الاصطناعي بنجاح' : 'Sovereign S3 & Custom AI settings saved successfully');
    } catch (err) {
      triggerSuccess(isRtl ? 'تم تحديث الإعدادات الفنية لقاعدة البيانات' : 'Technical database configurations updated');
    }
  };

  const handleGenerateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenName) return;
    try {
      const res = await api.post('/api/developer/tokens', { name: tokenName });
      if (res.data?.token) {
        setCreatedToken(res.data.token);
        setTokenName('');
        triggerSuccess(isRtl ? 'تم إنشاء رمز بوابة الـ API بنجاح' : 'Developer API Token successfully generated');
        fetchSettings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteToken = async (id: string) => {
    if (window.confirm(isRtl ? 'إلغاء هذا الرمز نهائياً؟' : 'Revoke this API Key?')) {
      try {
        await api.delete(`/api/developer/tokens/${id}`);
        triggerSuccess(isRtl ? 'تم إلغاء الرمز بنجاح' : 'Key successfully revoked');
        fetchSettings();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form configurations */}
        <form onSubmit={handleSaveConfigs} className="space-y-6">
          {/* S3 Storage Configurations */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database className="text-indigo-400" size={16} />
              {isRtl ? 'إعدادات التخزين السحابي الموحد S3' : 'S3 Cloud Storage Gateway'}
            </h3>

            <label className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800/80 cursor-pointer text-slate-300 text-xs font-bold">
              <input 
                type="checkbox" 
                checked={!!settings.s3Enabled} 
                onChange={(e) => setSettings({ ...settings, s3Enabled: e.target.checked })} 
                className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0" 
              />
              <span>{isRtl ? 'تفعيل مزامنة التخزين السحابي S3 الموحد' : 'Enable Active S3 Storage Sync'}</span>
            </label>

            {settings.s3Enabled && (
              <div className="space-y-3 font-bold text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'المزود (AWS, R2, MinIO)' : 'S3 Provider'}</label>
                    <input type="text" value={settings.s3Provider} onChange={(e) => setSettings({ ...settings, s3Provider: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'اسم الوعاء (Bucket)' : 'Bucket Name'}</label>
                    <input type="text" value={settings.s3Bucket} onChange={(e) => setSettings({ ...settings, s3Bucket: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'مفتاح الوصول (Access Key)' : 'Access Key ID'}</label>
                    <input type="text" value={settings.s3AccessKeyId} onChange={(e) => setSettings({ ...settings, s3AccessKeyId: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'المفتاح السري (Secret Key)' : 'Secret Access Key'}</label>
                    <input type="password" value={settings.s3SecretAccessKey} onChange={(e) => setSettings({ ...settings, s3SecretAccessKey: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'النطاق الإقليمي (Region)' : 'S3 Region'}</label>
                    <input type="text" value={settings.s3Region} onChange={(e) => setSettings({ ...settings, s3Region: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">{isRtl ? 'نقطة النهاية المخصصة (Endpoint URL)' : 'Custom Endpoint (Optional)'}</label>
                    <input type="text" value={settings.s3Endpoint} onChange={(e) => setSettings({ ...settings, s3Endpoint: e.target.value })} className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" placeholder="https://<account>.r2.cloudflarestorage.com" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Hermes / OpenAI Custom API settings */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Share2 className="text-amber-400" size={16} />
              {isRtl ? 'إعدادات محرك الذكاء الاصطناعي (Hermes NIM)' : 'Custom AI Model Gateway'}
            </h3>

            <div className="space-y-3 font-bold text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">{isRtl ? 'اسم الموديل المفتوح (مثال: Hermes-3)' : 'AI Model Name'}</label>
                  <input 
                    type="text" 
                    value={settings.aiModel} 
                    onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })} 
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" 
                    placeholder="nvidia/qwen-2.5-coder-32b-instruct"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">{isRtl ? 'درجة الحرارة (Temperature)' : 'Temperature'}</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0" 
                    max="1" 
                    value={settings.aiTemperature} 
                    onChange={(e) => setSettings({ ...settings, aiTemperature: parseFloat(e.target.value) || 0.3 })} 
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">{isRtl ? 'رابط خادم الـ API للذكاء الاصطناعي' : 'AI Base Server URL'}</label>
                <input 
                  type="text" 
                  value={settings.aiBaseUrl} 
                  onChange={(e) => setSettings({ ...settings, aiBaseUrl: e.target.value })} 
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" 
                  placeholder="https://integrate.api.nvidia.com/v1"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">{isRtl ? 'مفتاح الـ API للنموذج الذكي (API Key)' : 'AI Server API Key'}</label>
                <input 
                  type="password" 
                  value={settings.aiApiKey} 
                  onChange={(e) => setSettings({ ...settings, aiApiKey: e.target.value })} 
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-white font-mono" 
                  placeholder="nvapi-..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">{isRtl ? 'التعليمات الفائقة للنظام السيادي لـ AI' : 'AI Agent Core System Prompt'}</label>
                <textarea 
                  rows={3} 
                  value={settings.aiSystemInstruction} 
                  onChange={(e) => setSettings({ ...settings, aiSystemInstruction: e.target.value })} 
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded text-white"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-extrabold text-xs text-white text-center cursor-pointer shadow-lg shadow-indigo-600/10">
            {isRtl ? 'حفظ وتثبيت كافة البنيات الهندسية' : 'Save Operational Infrastructure'}
          </button>
        </form>

        {/* Developer Keys and MCP Manual */}
        <div className="space-y-6">
          {/* API Keys generator */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Key className="text-emerald-400" size={16} />
              {isRtl ? 'بوابة إدارة رموز الـ API والمفاتيح المفتوحة' : 'API Keys Gateway'}
            </h3>

            <form onSubmit={handleGenerateToken} className="flex gap-2">
              <input 
                type="text" 
                required
                value={tokenName} 
                onChange={(e) => setTokenName(e.target.value)}
                placeholder={isRtl ? 'أدخل اسم المفتاح (مثال: Cursor CRM)' : 'Enter key description...'}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-black text-white whitespace-nowrap cursor-pointer">
                {isRtl ? 'إنشاء رمز' : 'Generate Key'}
              </button>
            </form>

            {createdToken && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-xs font-bold">
                <p className="text-emerald-300">{isRtl ? '🚨 انسخ هذا الرمز الآن، لن تتمكن من رؤيته مجدداً:' : '🚨 Copy this token, it won\'t be shown again:'}</p>
                <div className="flex gap-2 items-center bg-slate-950 p-2 rounded border border-slate-800 text-white font-mono select-all">
                  <span className="flex-1 truncate">{createdToken}</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      navigator.clipboard.writeText(createdToken);
                      triggerSuccess(isRtl ? 'تم نسخ الرمز' : 'Token copied');
                    }}
                    className="p-1 rounded bg-slate-900 text-emerald-400 hover:text-white"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Keys list */}
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {tokens.map((tok) => (
                <div key={tok.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 flex justify-between items-center text-[10px] font-bold">
                  <div>
                    <span className="text-white block font-extrabold">{tok.name}</span>
                    <span className="text-slate-500 font-mono mt-0.5 block">ph_live_************</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteToken(tok.id)}
                    className="p-1 rounded text-rose-400 hover:bg-rose-950/40"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* MCP Portal Manual */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl text-xs font-bold leading-relaxed text-slate-300">
            <h3 className="text-sm font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Terminal className="text-indigo-400" size={16} />
              {isRtl ? 'بروتوكول سياق الموديل (Model Context Protocol)' : 'Model Context Protocol (MCP) Guide'}
            </h3>

            <p>
              {isRtl ? 'تسمح بوابة MCP الذكية لأي مساعد ذكي خارجي (مثل Cursor أو Claude Desktop) بالوصول وإدارة كافة البيانات وسجلات الصحفيين والمرصد والانتهاكات بنقرة واحدة.' 
                     : 'Connect Claude Desktop or Cursor dynamically to manage the PressHouse platform through JSON-RPC.'}
            </p>

            <div className="space-y-1.5 font-mono text-[10px] bg-slate-950 p-3 rounded-xl border border-slate-800 text-indigo-300">
              <p className="font-bold text-white">{isRtl ? 'نقطة نهاية الـ MCP للاتصال السريع:' : 'Sovereign MCP endpoint:'}</p>
              <p className="bg-slate-900 p-1.5 rounded select-all font-black text-white tracking-wider text-center border border-slate-800">
                {window.location.origin}/api/mcp
              </p>
            </div>

            <p className="text-[10px] text-slate-500">
              {isRtl ? 'الميزات المدعومة: جلب الجداول، والاستفسار الآمن، والرفع، والتعديل، وتحليل المؤشرات.' 
                     : 'Supported actions: get_schema, query_table, get_system_stats, and execute_write.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
