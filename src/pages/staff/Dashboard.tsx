import React from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  ImageIcon,
  UserCircle,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import manager modules
import PageContentManager from '../admin/PageContentManager';
import HeroSliderManager from '../admin/HeroSliderManager';
import ProjectManager from '../admin/ProjectManager';
import EventManager from '../admin/EventManager';
import CourseManager from '../admin/CourseManager';
import JobEditor from '../admin/JobEditor';
import StatsDashboard from '../admin/StatsDashboard';
import MediaCenter from '../admin/MediaCenter';
import ProfileManager from '../../components/ProfileManager';
import ObservatoryManager from '../admin/ObservatoryManager';

export default function StaffDashboard() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getActivePath = () => {
    const parts = location.pathname.split('/');
    return parts[parts.length - 1] || 'overview';
  };
  
  const currentPath = getActivePath();

  const navItems = [
    { id: 'overview', path: '', icon: LayoutDashboard, label: isRtl ? 'نظرة عامة والتحليلات' : 'Overview & Analytics' },
    { id: 'content', path: 'content', icon: FileText, label: isRtl ? 'محتوى الصفحات' : 'Page Content' },
    { id: 'slider', path: 'slider', icon: ImageIcon, label: isRtl ? 'شريط العرض' : 'Hero Slider' },
    { id: 'projects', path: 'projects', icon: FileText, label: isRtl ? 'المشاريع' : 'Projects' },
    { id: 'events', path: 'events', icon: FileText, label: isRtl ? 'الفعاليات' : 'Events' },
    { id: 'courses', path: 'courses', icon: FileText, label: isRtl ? 'الدورات التدريبية' : 'Courses' },
    { id: 'jobs', path: 'jobs', icon: FileText, label: isRtl ? 'الوظائف' : 'Jobs' },
    { id: 'observatory', path: 'observatory', icon: ShieldAlert, label: isRtl ? 'مرصد الانتهاكات' : 'Observatory' },
    { id: 'media', path: 'media', icon: ImageIcon, label: isRtl ? 'مركز الوسائط' : 'Media Center' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Professional Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white shadow-md">
            PH
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {isRtl ? 'بيت الصحافة - بوابة النشر' : 'PressHouse Publishing'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">Staff Portal</p>
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
            <span className="text-xs text-emerald-400 uppercase tracking-widest font-mono font-bold">Staff Editor</span>
          </div>

          <button 
            onClick={() => { signOut(); navigate('/'); }}
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
        <aside className="lg:w-64 bg-slate-900 border-r lg:border-r border-b lg:border-b-0 border-slate-800 p-4 space-y-1 overflow-y-auto h-[calc(100vh-73px)] sticky top-[73px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-2">
            {isRtl ? 'نظام النشر' : 'Publishing System'}
          </p>

          {navItems.map(item => {
            const isActive = currentPath === item.id || (currentPath === 'staff' && item.id === 'overview');
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </aside>

        {/* Content Panel Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full bg-slate-50 text-slate-900">
          <Routes>
            <Route path="/" element={<StatsDashboard />} />
            <Route path="/content" element={<PageContentManager />} />
            <Route path="/slider" element={<HeroSliderManager />} />
            <Route path="/projects" element={<ProjectManager />} />
            <Route path="/events" element={<EventManager />} />
            <Route path="/courses" element={<CourseManager />} />
            <Route path="/jobs" element={<JobEditor />} />
            <Route path="/observatory" element={<ObservatoryManager />} />
            <Route path="/media" element={<MediaCenter />} />
            <Route path="/profile" element={<div className="p-4"><ProfileManager /></div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
