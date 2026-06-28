
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function BetaRegistrationForm() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [formData, setFormData] = useState({ fullName: '', email: '', organization: '', specialization: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/yemenjpt/register', formData);
      toast.success(isRtl ? 'تم التسجيل بنجاح!' : 'Registered successfully!');
      setFormData({ fullName: '', email: '', organization: '', specialization: '' });
    } catch (error) {
      toast.error(isRtl ? 'حدث خطأ ما' : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <input 
        required
        placeholder={isRtl ? 'الاسم الكامل' : 'Full Name'}
        className="w-full p-4 rounded-xl border border-slate-200"
        value={formData.fullName}
        onChange={e => setFormData({...formData, fullName: e.target.value})}
      />
      <input 
        required
        type="email"
        placeholder={isRtl ? 'البريد الإلكتروني' : 'Email'}
        className="w-full p-4 rounded-xl border border-slate-200"
        value={formData.email}
        onChange={e => setFormData({...formData, email: e.target.value})}
      />
      <input 
        placeholder={isRtl ? 'المؤسسة' : 'Organization'}
        className="w-full p-4 rounded-xl border border-slate-200"
        value={formData.organization}
        onChange={e => setFormData({...formData, organization: e.target.value})}
      />
      <input 
        placeholder={isRtl ? 'التخصص' : 'Specialization'}
        className="w-full p-4 rounded-xl border border-slate-200"
        value={formData.specialization}
        onChange={e => setFormData({...formData, specialization: e.target.value})}
      />
      <button 
        disabled={submitting}
        className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
      >
        {submitting ? (isRtl ? 'جاري التسجيل...' : 'Registering...') : (isRtl ? 'تسجيل' : 'Register')}
      </button>
    </form>
  );
}
