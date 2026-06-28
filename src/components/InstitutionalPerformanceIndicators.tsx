import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, ShieldAlert, Award, Newspaper, BookOpen, Target, Sparkles } from 'lucide-react';

const AnimatedCounter: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, '');

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * numericValue));
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [numericValue, duration]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
};

export const InstitutionalPerformanceIndicators: React.FC = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const stats = [
    {
      icon: Newspaper,
      value: '450+',
      title: isRtl ? 'تحقيق مخرجات وتقارير رصدية' : 'Reports & Investigative Outputs',
      desc: isRtl ? 'تقارير وتحقيقات صحفية استقصائية معتمدة.' : 'Accredited investigative reports and data pieces.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      value: '2,800+',
      title: isRtl ? 'صحفي وصحفية مستفيدين' : 'Beneficiary Journalists',
      desc: isRtl ? 'بناء القدرات والتأهيل الأكاديمي والمهني.' : 'Capacity building and professional qualification.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: ShieldAlert,
      value: '1,250+',
      title: isRtl ? 'بلاغ انتهاك تمت معالجته' : 'Resolved Violation Reports',
      desc: isRtl ? 'مساندة قانونية وحماية رقمية وميدانية مباشرة.' : 'Direct legal advocacy and digital protection safety.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Award,
      value: '98%',
      title: isRtl ? 'معدل الاستجابة والنزاهة' : 'Response & Integrity Rate',
      desc: isRtl ? 'التزام تام بأخلاقيات المهنة ومعايير الجودة.' : 'Strict commitment to journalistic codes & quality.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const chartData = [
    { name: isRtl ? '2021' : '2021', reports: 60, trainees: 450, violations: 180 },
    { name: isRtl ? '2022' : '2022', reports: 110, trainees: 850, violations: 290 },
    { name: isRtl ? '2023' : '2023', reports: 195, trainees: 1400, violations: 480 },
    { name: isRtl ? '2024' : '2024', reports: 310, trainees: 2100, violations: 810 },
    { name: isRtl ? '2025' : '2025', reports: 450, trainees: 2800, violations: 1250 },
  ];

  return (
    <section className="py-32 bg-slate-50/50 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-24 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black ${isRtl ? 'normal-case tracking-normal' : 'uppercase tracking-[0.2em]'}`}
          >
            <Sparkles size={12} className="fill-current" />
            {isRtl ? 'التأثير والحوكمة' : 'Impact & Governance'}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-4xl md:text-6xl font-black text-slate-900 tracking-tight ${isRtl ? 'leading-[1.4]' : 'leading-[1.1]'}`}
          >
            {isRtl ? 'مؤشرات الأداء المؤسسي والتأثير' : 'Institutional Performance & Impact Indicators'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
          >
            {isRtl 
              ? 'متابعة شفافة ودقيقة لمدى تقدم وإنجاز مشاريع بيت الصحافة، وتأثير مبادراتنا على المشهد الإعلامي والحقوقي اليمني.'
              : 'Transparent and precise tracking of the progress of Press House projects, and the impact of our initiatives on the Yemeni media and human rights landscape.'
            }
          </motion.p>
        </div>

        {/* Highlighted KPIs Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-current/10`}>
                <item.icon size={32} />
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                <AnimatedCounter value={item.value} />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">{item.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Professional Impact Analytics & Progression Chart */}
        <div className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={14} />
                {isRtl ? 'تحليل النمو السنوي للمبادرات' : 'Annual Growth Analysis of Initiatives'}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{isRtl ? 'المخطط البياني التراكمي للإنجاز' : 'Cumulative Achievement Chart'}</h3>
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                {isRtl ? 'الصحفيون المتدربون' : 'Trained Journalists'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500" />
                {isRtl ? 'بلاغات الحماية' : 'Protection Reports'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                {isRtl ? 'التقارير الرصدية' : 'Monitoring Reports'}
              </span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrainees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '16px', 
                    border: 'none',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '13px'
                  }} 
                />
                <Area type="monotone" dataKey="trainees" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTrainees)" />
                <Area type="monotone" dataKey="violations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViolations)" />
                <Area type="monotone" dataKey="reports" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
