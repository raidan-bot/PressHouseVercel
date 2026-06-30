import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'motion/react';
import { ShieldCheck, Sparkles, Monitor, Smartphone, Tablet, BrainCircuit, Database, Search, Zap, Network } from 'lucide-react';
import { Badge, Button, Card } from '../components/ui';
import { useResponsiveLayout } from '../components/ResponsiveLayoutWrapper';
import { YemenJPTDetailSection } from '../components/YemenJPTDetailSection';
import BetaRegistrationForm from '../components/BetaRegistrationForm';
import { SEO } from '../components/common/SEO';

export default function YemenJPT() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { width, tier, isMobile, isTablet } = useResponsiveLayout();
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  const seoTitle = isRtl ? 'YemenJPT | البوابة الصحفية والتقنية لليمن' : 'YemenJPT | Yemeni Journalistic Platform & Technology';
  const seoDescription = isRtl 
    ? 'البنية التقنية المتطورة لبيت الصحافة: نظام رصد وتحليل البيانات الصحفية والانتهاكات وحوكمة الذكاء الاصطناعي.' 
    : 'The advanced technological infrastructure of Press House: monitoring, analyzing journalistic data, violations, and AI governance.';

  const features = [
    { 
      icon: BrainCircuit, 
      title: isRtl ? 'التحليل السياقي بالذكاء الاصطناعي' : 'AI Contextual Analysis',
      desc: isRtl ? 'نماذج لغوية متطورة مدربة على فهم السياق المعقد للإعلام اليمني ورصد المصطلحات بدقة.' : 'Advanced language models trained to understand the complex context of Yemeni media & monitor terms precisely.'
    },
    { 
      icon: Database, 
      title: isRtl ? 'قاعدة البيانات السيادية الموحدة' : 'Unified Sovereign Database',
      desc: isRtl ? 'أرشفة شاملة للتقارير والانتهاكات والقصص الإنسانية على خوادم آمنة ومشفرة تماماً.' : 'Comprehensive archiving of reports, violations, and human stories on fully secure, encrypted servers.'
    },
    { 
      icon: Search, 
      title: isRtl ? 'البحث المعرفي والتقصي الذكي' : 'Smart Cognitive Search',
      desc: isRtl ? 'أدوات بحث متقدمة تتيح للصحفيين والباحثين تتبع مسارات الأحداث والتحقق من مصداقيتها.' : 'Advanced search tools enabling journalists and researchers to trace event pathways and verify credibility.'
    },
    { 
      icon: Zap, 
      title: isRtl ? 'سرعة فائقة في معالجة البلاغات' : 'Ultra-Fast Claims Processing',
      desc: isRtl ? 'نظام استقبال وتصنيف تلقائي للبلاغات لتسريع الاستجابة والمساندة القانونية والميدانية.' : 'Automatic intake and classification of violation reports to speed up legal and field response.'
    },
    { 
      icon: Network, 
      title: isRtl ? 'ربط وتحليل شبكات المعلومات' : 'Knowledge Graphs & Networks',
      desc: isRtl ? 'رسم الروابط التفاعلية بين الفاعلين والأحداث والانتهاكات لتقديم رؤى صحفية استقصائية متكاملة.' : 'Mapping interactive connections between actors, events, and violations to yield integrated investigative insights.'
    },
    { 
      icon: ShieldCheck, 
      title: isRtl ? 'منظومة الأمان الرقمي الصارم' : 'Strict Cyber Security Shield',
      desc: isRtl ? 'حماية شاملة لهويات الصحفيين والمصادر والمبلغين مع تطبيق تشفير متماثل وتدقيق مستمر.' : 'Full protection of journalists, sources, and whistleblowers using symmetric encryption & ongoing audits.'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        type="website"
      />
      
      {/* Hero Section - Immersive (replicated style from Projects page) */}
      <section className="relative min-h-[75vh] flex items-center bg-slate-900 pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.15),transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-10">
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-400 text-xs font-black ${isRtl ? 'normal-case tracking-normal' : 'uppercase tracking-[0.3em]'}`}
            >
              <Sparkles size={14} className="animate-pulse" />
              YemenJPT : {isRtl ? 'المنصة التقنية لبيت الصحافة' : 'Press House Tech Platform'}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-emerald-400"
            >
              {isMobile ? <Smartphone size={12} /> : isTablet ? <Tablet size={12} /> : <Monitor size={12} />}
              <span>{width}px</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="uppercase text-slate-400 font-bold tracking-widest">{tier}</span>
            </motion.div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-5xl md:text-8xl font-black text-white max-w-5xl mx-auto tracking-tight ${isRtl ? 'leading-[1.4]' : 'leading-[1.1]'}`}
          >
            {isRtl 
              ? 'بوابة بيت الصحافة التقنية والتحليلية المستقلة' 
              : 'The Independent Journalistic Tech Gateway for Yemen'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            {isRtl 
              ? 'بوابتكم الصحفية المتكاملة المدعومة بالذكاء الاصطناعي لرصد الانتهاكات، إدارة المحتوى، وحفظ الذاكرة الإعلامية اليمنية بأحدث التقنيات.' 
              : 'Your integrated journalistic platform powered by AI to monitor violations, manage content, and preserve Yemeni media memory using state-of-the-art technologies.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Button variant="primary" size="lg" href="#test-program" className="px-12 py-5 rounded-2xl uppercase tracking-widest shadow-2xl shadow-blue-600/20">
              {isRtl ? 'انضم للاختبار التجريبي' : 'Join Beta Testing'}
            </Button>
            <Button variant="outline" size="lg" href="#features" className="px-12 py-5 rounded-2xl uppercase tracking-widest bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-sm">
              {isRtl ? 'اكتشف الميزات' : 'Explore Features'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Intro Problem Context - Stunning minimalist divider */}
      <section className="py-24 bg-slate-50 relative border-y border-slate-100">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.p 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-slate-900 leading-tight"
          >
            {isRtl 
              ? '“ليست المشكلة في ندرة الأخبار اليوم في اليمن، بل في صعوبة فهم سياقاتها، تتبع مصداقيتها، وربط خيوطها لحماية الحقيقة وصناعها.”' 
              : '"The problem is not the lack of news today, but the difficulty in understanding its contexts, tracing its credibility, and connecting its dots to safeguard the truth."'}
          </motion.p>
        </div>
      </section>

      {/* Main Features / Modules Grid */}
      <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">{isRtl ? 'بنية تحتية متكاملة' : 'Integrated Infrastructure'}</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">{isRtl ? 'ماذا تقدم منصة YemenJPT؟' : 'What YemenJPT Delivers'}</h2>
            </div>
            <p className="text-slate-500 max-w-md font-medium">
              {isRtl ? 'تقنيات تم تطويرها وتخصيصها لتلبية احتياجات الإعلام الاستقصائي والحماية المهنية للمؤسسات والصحفيين.' : 'Technologies crafted and tuned to serve investigative journalism and professional security for teams & individuals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card variant="ghost" className="bg-slate-50 p-10 rounded-[48px] border border-slate-100/80 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-6">
                    <feat.icon size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{feat.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-medium">{feat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YemenJPT Detail Section (Moved from Projects page to here) */}
      <YemenJPTDetailSection />

      {/* Beta Registration / Call to Action */}
      <section id="test-program" className="py-32 bg-slate-900 text-white rounded-t-[64px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-slate-950" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
                {isRtl ? 'كن جزءاً من البداية' : 'Be Part of the Genesis'}
              </span>
              <h2 className="text-4xl md:text-6xl font-black leading-tight">
                {isRtl ? 'البرنامج التجريبي لمنصة YemenJPT' : 'YemenJPT Beta Testing Program'}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {isRtl 
                  ? 'ندعو الزملاء الصحفيين، الباحثين، والمؤسسات الإعلامية والمدنية المهتمة لتسجيل اهتمامهم بالانضمام للمرحلة التجريبية المغلقة والمساهمة في صقل وتطوير هذه المنظومة التقنية.' 
                  : 'We invite journalists, independent researchers, and media or civil society organizations to register interest to join the closed beta phase & co-create this technical shield.'}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-white/10 text-xs font-bold text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{isRtl ? 'اختبار ميزات حوكمة الذكاء الاصطناعي متاح حالياً' : 'AI Governance modules testing is now active.'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>{isRtl ? 'الالتزام التام ببروتوكولات الخصوصية والمصادر المغلقة' : 'Total compliance with closed-source privacy protocols.'}</span>
                </div>
              </div>
            </div>

            <Card variant="glass" className="lg:col-span-7 bg-white/5 border border-white/10 p-8 md:p-12 rounded-[48px] backdrop-blur-md">
              <BetaRegistrationForm />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
