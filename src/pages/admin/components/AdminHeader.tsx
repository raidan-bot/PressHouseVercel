import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../context/AuthContext';

interface AdminHeaderProps {
  isRtl: boolean;
  onLanguageChange: (lang: string) => void;
}

function AdminHeader({ isRtl, onLanguageChange }: AdminHeaderProps) {
  const { t } = useTranslation();
  const { userData, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">PH</div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {isRtl ? 'بيت الصحافة - لوحة التحكم' : 'PressHouse Dashboard'}
          </h1>
          <p className="text-xs text-slate-400 font-mono">Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onLanguageChange(isRtl ? 'en' : 'ar')}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-black text-slate-300 transition-colors border border-slate-700"
        >
          {isRtl ? 'English LTR' : 'العربية RTL'}
        </button>

        <Link to="/admin/profile" className="flex items-center gap-2 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
          <UserCircle size={18} />
          <span className="hidden md:inline text-xs font-bold">{isRtl ? 'الملف الشخصي' : 'Profile'}</span>
        </Link>

        <div className="hidden md:flex flex-col text-end border-l border-slate-700 pl-4 rtl:border-l-0 rtl:border-r rtl:pr-4 rtl:pl-0">
          <span className="text-sm font-bold text-white">{userData?.displayName || userData?.email}</span>
          <span className="text-xs text-rose-400 uppercase tracking-widest font-mono font-bold">{userData?.role || 'User'}</span>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 transition-all border border-rose-900/30 cursor-pointer ml-2 rtl:ml-0 rtl:mr-2"
          title={isRtl ? 'تسجيل الخروج' : 'Logout'}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
