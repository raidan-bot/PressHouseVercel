import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowUpRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FormValues {
  email: string;
}

export default function NewsletterSubscription() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, source: 'Footer' })
      });

      if (response.ok) {
        toast.success(isRtl ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!');
        reset();
      } else {
        const errJson = await response.json().catch(() => ({}));
        toast.error(errJson.message || (isRtl ? 'هذا البريد مسجل مسبقاً أو غير صالح.' : 'This email is already registered or invalid.'));
      }
    } catch (err) {
      toast.error(isRtl ? 'تعذر الاتصال بالخادم.' : 'Could not connect to the server.');
    }
  };

  return (
    <div className="bg-transparent space-y-5 max-w-full rounded-none relative overflow-hidden transition-all duration-300">
      <div className="space-y-3 relative z-10 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl flex items-center justify-center bg-white/10 text-blue-400">
            <Mail size={16} />
          </div>
          <h3 className="text-base font-black tracking-tight text-white">
            {isRtl ? 'النشرة البريدية' : 'Newsletter'}
          </h3>
        </div>
        <p className="text-xs leading-relaxed font-medium text-slate-400/80">
          {isRtl 
            ? 'احصل على آخر التحديثات والأخبار مباشرة.' 
            : 'Get the latest updates directly.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3 relative z-10"
      >
        <div className="relative">
          <input 
            type="email" 
            placeholder={isRtl ? "البريد الإلكتروني" : "Email address"}
            disabled={isSubmitting}
            {...register('email', { 
              required: isRtl ? "البريد الإلكتروني مطلوب" : "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: isRtl ? "البريد الإلكتروني غير صالح" : "Invalid email address"
              }
            })}
            className={`w-full text-sm rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 transition-all duration-300 bg-white/5 border text-white placeholder:text-slate-600 focus:ring-blue-500/50 ${
              errors.email ? 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/20' : 'border-white/10'
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-rose-500 font-bold mt-1">
            {errors.email.message}
          </p>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-900/20 ${
            isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <Loader2 size={14} className="animate-spin text-white" />
          ) : (
            <>
              <span>{isRtl ? 'اشترك' : 'Subscribe'}</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
