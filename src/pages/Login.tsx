import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { supabase } from '../lib/db';

export default function Login() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUserContext } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      updateUserContext(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || (isRtl ? 'خطأ في البريد الإلكتروني أو كلمة المرور' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (signInError) throw signInError;
      // Note: Supabase OAuth redirects the user. The session will be available upon return.
    } catch (err: any) {
      console.error(err);
      setError(err?.message || (isRtl ? 'فشل تسجيل الدخول عبر جوجل' : 'Google login failed'));
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-slate-100 p-8 md:p-12 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'تسجيل الدخول' : 'Login'}</h1>
          <p className="text-slate-500 text-sm">{isRtl ? 'مرحباً بك مجدداً في بيت الصحافة' : 'Welcome back to Press House'}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-6">
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
            <div className="flex justify-between">
              <label className="text-sm font-bold text-slate-700">{isRtl ? 'كلمة المرور' : 'Password'}</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-blue-600 hover:underline">{isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
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
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={18} />}
            {isRtl ? 'دخول' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {isRtl ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">{isRtl ? 'أنشئ حساباً' : 'Register now'}</Link>
        </p>
      </motion.div>
    </div>
  );
}
