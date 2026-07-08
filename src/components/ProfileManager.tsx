import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User as UserIcon, Mail, Lock, Shield, Loader2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProfileManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { userData, user, updateUserContext } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  
  // Form State
  const [name, setName] = useState(userData?.displayName || userData?.name || '');
  const [email, setEmail] = useState(userData?.email || user?.email || '');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.put('/api/users/profile', { name, email });
      // Update local context
      if (res.data && res.data.user) {
         updateUserContext(res.data.user);
      }
      setStatus({
        type: 'success',
        message: isRtl ? 'تم تحديث المعلومات الشخصية بنجاح' : 'Profile information updated successfully'
      });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || (isRtl ? 'حدث خطأ أثناء التحديث' : 'Error updating profile')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: isRtl ? 'كلمات المرور غير متطابقة' : 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await api.put('/api/users/profile/password', { currentPassword, newPassword });
      setStatus({
        type: 'success',
        message: isRtl ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully'
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || (isRtl ? 'كلمة المرور الحالية غير صحيحة' : 'Incorrect current password')
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'إدارة الملف الشخصي' : 'Profile Management'}</h1>
          <p className="text-slate-500 text-sm mt-1">{isRtl ? 'تحديث المعلومات الشخصية وإعدادات الأمان' : 'Update personal info and security settings'}</p>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'info' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          <UserIcon size={16} />
          {isRtl ? 'المعلومات الشخصية' : 'Personal Info'}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'security' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Shield size={16} />
          {isRtl ? 'الأمان وكلمة المرور' : 'Security & Password'}
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {status.type === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" /> : <AlertTriangle className="mt-0.5 shrink-0" />}
          <p className="font-bold">{status.message}</p>
        </div>
      )}

      {activeTab === 'info' && (
        <form onSubmit={handleUpdateInfo} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'البريد الإلكتروني' : 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'الدور / الصلاحية' : 'Role / Permission'}</label>
              <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono font-bold cursor-not-allowed">
                {userData?.role || 'User'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              {isRtl ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'كلمة المرور الحالية' : 'Current Password'}</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'كلمة المرور الجديدة' : 'New Password'}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  minLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
              {isRtl ? 'تحديث كلمة المرور' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
