import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Newspaper, FolderTree, Tags, FileText, ImageIcon,
  Briefcase, Calendar, BookOpen, ScrollText, Globe, Building2, Handshake, Palette,
  UsersRound,   ShieldAlert, AlertOctagon, Users, Mail, Megaphone, BrainCircuit, Terminal, Key, Activity,
  UserCircle, Glasses, Database, Share2
} from 'lucide-react';

interface AdminSidebarProps {
  isRtl: boolean;
  currentPath: string;
}

function AdminSidebar({ isRtl, currentPath }: AdminSidebarProps) {
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
        { id: 'violations-monitoring', path: 'violations-monitoring', icon: AlertOctagon, label: isRtl ? 'مركز قيادة الإنتهاكات' : 'Violations Control Center' },
        { id: 'volunteers', path: 'volunteers', icon: Users, label: isRtl ? 'المتطوعون' : 'Volunteers' },
        { id: 'messages', path: 'messages', icon: Mail, label: isRtl ? 'رسائل التواصل' : 'Contact Messages' },
        { id: 'newsletter', path: 'newsletter', icon: Megaphone, label: isRtl ? 'النشرة البريدية' : 'Newsletter' },
      ]
    },
    {
      title: isRtl ? 'الذكاء الاصطناعي والتطوير' : 'AI & Development',
      items: [
        { id: 'hermes', path: 'hermes', icon: BrainCircuit, label: isRtl ? 'وكيل هيرمس' : 'Hermes AI Agent' },
        { id: 'pressagent', path: 'pressagent', icon: Activity, label: isRtl ? 'وكيل الصحافة' : 'PressAgent AI' },
        { id: 'api', path: 'api', icon: Terminal, label: isRtl ? 'مستكشف API' : 'API Explorer' },
        { id: 'apikeys', path: 'apikeys', icon: Key, label: isRtl ? 'مفاتيح API' : 'API Keys' },
      ]
    }
  ];

  return (
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
  );
}

export default AdminSidebar;
