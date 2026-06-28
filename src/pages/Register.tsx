import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUserContext } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/register', { email, password, name });
      updateUserContext(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ أثناء إنشاء الحساب' : 'Error creating account'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 md:p-12 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'إنشاء حساب جديد' : 'Create Account'}</h1>
          <p className="text-slate-500 text-sm">{isRtl ? 'انضم إلى مجتمع بيت الصحافة' : 'Join Press House community'}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={isRtl ? 'اسمك الكامل' : 'Your full name'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{isRtl ? 'كلمة المرور' : 'Password'}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={18} />}
            {isRtl ? 'إنشاء الحساب' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {isRtl ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">{isRtl ? 'سجل دخولك' : 'Login here'}</Link>
        </p>
      </motion.div>
    </div>
  );
}
