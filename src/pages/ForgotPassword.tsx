import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../services/api';

export default function ForgotPassword() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || (isRtl ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'An error occurred, please try again'));
    } finally {
      setLoading(false);
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
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}</h1>
          <p className="text-slate-500 text-sm">
            {isRtl ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين' : 'Enter your email and we will send you a reset link'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <p className="font-bold">
              {isRtl ? 'تم إرسال رابط الاستعادة بنجاح!' : 'Reset link sent successfully!'}
            </p>
            <p className="text-sm text-emerald-600">
              {isRtl ? 'يرجى التحقق من صندوق الوارد الخاص بك' : 'Please check your inbox'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isRtl ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}
                  {!isRtl && <ArrowRight size={18} />}
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-slate-100">
          <Link to="/login" className="text-slate-500 text-sm hover:text-blue-600 transition-colors font-bold">
            {isRtl ? 'العودة لتسجيل الدخول' : 'Back to Login'}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
