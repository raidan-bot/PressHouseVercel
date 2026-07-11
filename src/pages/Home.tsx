import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { 
  ArrowRight, Newspaper, ShieldAlert, 
  GraduationCap, Users, FileText, 
  Play, CheckCircle2, Heart,
  Sparkles, Zap, 
  MousePointer2,
  ShieldCheck, Search, Database,
  Target, Award, Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { YemenJPTSection } from '../components/YemenJPTSection';
import { HeroSlider } from '../components/home/HeroSlider';
import { RealtimeViolationFeed } from '../components/home/RealtimeViolationFeed';
import YemenMap from '../components/YemenMap';
import { ProjectGrid } from '../components/projects/ProjectGrid';
import { api } from '../services/api';
import { SEO } from '../components/common/SEO';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, Legend 
} from 'recharts';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Swiper for news slider
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorSubmit, setErrorSubmit] = React.useState('');
  const [featuredProjects, setFeaturedProjects] = React.useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const [latestNews, setLatestNews] = React.useState<any[]>([]);
  const [pageContent, setPageContent] = React.useState<any[]>([]);
  const [comprehensiveStats, setComprehensiveStats] = React.useState<any>(null);
  const [liveIndicators, setLiveIndicators] = React.useState<any[]>([]);
  const [violations, setViolations] = React.useState<any[]>([]);

  const [performanceActiveTab, setPerformanceActiveTab] = React.useState<'academy' | 'growth' | 'sectors'>('academy');
  const [violationsChartType, setViolationsChartType] = React.useState<'pie' | 'bar'>('pie');

  const violationsTrend = React.useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    const months = isRtl 
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    months.forEach(m => { monthlyCounts[m] = 0; });

    violations.forEach(v => {
      if (v.date) {
        const dateObj = new Date(v.date);
        if (!isNaN(dateObj.getTime())) {
          const monthIndex = dateObj.getMonth();
          const mName = months[monthIndex];
          monthlyCounts[mName] = (monthlyCounts[mName] || 0) + 1;
        }
      }
    });

    return months.map(m => ({ name: m, cases: monthlyCounts[m] }));
  }, [violations, isRtl]);

  const violationsByType = React.useMemo(() => {
    const counts = violations.reduce((acc: any, curr: any) => {
      if (curr.type) {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
      }
      return acc;
    }, {});
    
    const defaultData = isRtl ? [
      { name: 'اعتداءات جسدية', value: 12 },
      { name: 'اعتقال واحتجاز', value: 8 },
      { name: 'تهديد ومضايقة', value: 15 },
      { name: 'حجب وإيقاف وسائل إعلام', value: 5 }
    ] : [
      { name: 'Physical Assaults', value: 12 },
      { name: 'Arrests & Detentions', value: 8 },
      { name: 'Threats & Harassment', value: 15 },
      { name: 'Media Blocking', value: 5 }
    ];

    if (Object.keys(counts).length === 0) {
      return defaultData;
    }

    return Object.entries(counts)
      .map(([name, value]) => {
        let displayName = name;
        if (isRtl) {
          if (name === 'assault') displayName = 'اعتداء جسدي';
          else if (name === 'detention' || name === 'arrest') displayName = 'اعتقال واحتجاز';
          else if (name === 'threat') displayName = 'تهديد ومضايقة';
          else if (name === 'blocking') displayName = 'حجب وسائل إعلام';
        } else {
          if (name === 'assault') displayName = 'Physical Assault';
          else if (name === 'detention' || name === 'arrest') displayName = 'Detention / Arrest';
          else if (name === 'threat') displayName = 'Threats';
          else if (name === 'blocking') displayName = 'Media Censorship';
        }
        return { name: displayName, value: value as number };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [violations, isRtl]);

  const academyImpactData = React.useMemo(() => {
    const stats = comprehensiveStats?.stats;
    if (!stats) {
      return [
        { name: isRtl ? 'المناهج والدورات' : 'Courses', count: 85 },
        { name: isRtl ? 'طلبات التسجيل' : 'Applications', count: 1240 },
        { name: isRtl ? 'الخريجون الفعليون' : 'Graduates', count: 450 },
        { name: isRtl ? 'الشهادات الصادرة' : 'Certificates', count: 380 }
      ];
    }
    return [
      { name: isRtl ? 'الدورات المنجزة' : 'Courses Conducted', count: stats.totalCourses || 85 },
      { name: isRtl ? 'طلبات التسجيل' : 'Applications Recv', count: stats.totalApplications || 1240 },
      { name: isRtl ? 'الصحفيون المتخرجون' : 'Graduates Trained', count: stats.totalGraduated || 450 },
      { name: isRtl ? 'الشهادات الصادرة' : 'Certificates Issued', count: stats.totalCertificates || 380 }
    ];
  }, [comprehensiveStats, isRtl]);

  const growthData = React.useMemo(() => {
    const charts = comprehensiveStats?.charts;
    if (charts?.yearlyGrowth && charts.yearlyGrowth.length > 0) {
      return charts.yearlyGrowth;
    }
    return [
      { year: 2023, projects: 1, beneficiaries: 400 },
      { year: 2024, projects: 2, beneficiaries: 1200 },
      { year: 2025, projects: 4, beneficiaries: 2400 },
      { year: 2026, projects: 6, beneficiaries: 3800 }
    ];
  }, [comprehensiveStats]);

  const sectorData = React.useMemo(() => {
    const charts = comprehensiveStats?.charts;
    if (charts?.sectorDistribution && charts.sectorDistribution.length > 0) {
      return charts.sectorDistribution;
    }
    return [
      { name: isRtl ? 'بناء القدرات الإعلامية' : 'Capacity Building', value: 5 },
      { name: isRtl ? 'رصد الحريات وحقوق الإنسان' : 'Rights & Freedoms', value: 3 },
      { name: isRtl ? 'الحماية والمناصرة القانونية' : 'Protection & Advocacy', value: 4 }
    ];
  }, [comprehensiveStats, isRtl]);

  React.useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const { data } = await api.get('/api/page-content/home');
        setPageContent(data.map((s: any) => ({
          ...s,
          content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content
        })));
      } catch (err) {
        console.error("Error fetching home content:", err);
      }
    };
    fetchHomeContent();

    const fetchComprehensive = async () => {
      try {
        const { data } = await api.get('/api/analytics/comprehensive');
        setComprehensiveStats(data);
      } catch (err) {
        console.error("Error fetching comprehensive stats:", err);
      }
    };
    fetchComprehensive();

    const fetchLiveIndicators = async () => {
      try {
        const { data } = await api.get('/api/analytics/indicators');
        if (data.success) {
          setLiveIndicators(data.indicators || []);
        }
      } catch (err) {
        console.error("Error fetching live indicators:", err);
      }
    };
    fetchLiveIndicators();

    const fetchViolations = async () => {
      try {
        const { data } = await api.get('/api/violations');
        setViolations(data.filter((v: any) => v.status === 'verified'));
      } catch (err) {
        console.error("Error fetching violations:", err);
      }
    };
    fetchViolations();
  }, []);

  const statsByGov = React.useMemo(() => {
    return violations.reduce((acc: any, curr: any) => {
      if (curr.governorate) {
        acc[curr.governorate] = (acc[curr.governorate] || 0) + 1;
      }
      return acc;
    }, {});
  }, [violations]);

  const getSection = (name: string) => pageContent.find(s => s.section_name === name)?.content;

  const impactData = getSection('impact_stats') || {
    stats: [
      { type: 'system', metricId: 'total_violations', ar: '1,240+', en: '1,240+', labelAr: 'انتهاك موثق', labelEn: 'Violations Documented', descAr: 'رصد دقيق ومستمر للانتهاكات', descEn: 'Accurate and continuous monitoring' },
      { type: 'system', metricId: 'total_beneficiaries', ar: '450+', en: '450+', labelAr: 'صحفي مستفيد', labelEn: 'Journalists Supported', descAr: 'دعم قانوني ونفسي ومهني', descEn: 'Legal, psychological and professional support' },
      { type: 'system', metricId: 'total_courses', ar: '85+', en: '85+', labelAr: 'دورة تدريبية', labelEn: 'Training Courses', descAr: 'بناء قدرات الكوادر الإعلامية', descEn: 'Capacity building for media cadres' },
      { type: 'system', metricId: 'total_volunteers', ar: '120+', en: '120+', labelAr: 'متطوع مسجل', labelEn: 'Registered Volunteers', descAr: 'متطوعون ومناصرون مسجلون', descEn: 'Registered volunteers and advocates' },
      { type: 'custom', ar: '12+', en: '12+', labelAr: 'دراسات وبحوث معمقة', labelEn: 'Studies & Deep Research', descAr: 'تقارير بحثية وأكاديمية متخصصة', descEn: 'Specialized research & academic reports' },
      { type: 'custom', ar: '48+', en: '48+', labelAr: 'تقارير رصد دورية', labelEn: 'Periodic Monitoring Reports', descAr: 'توثيق دوري وشامل للحقوق والحريات', descEn: 'Periodic and comprehensive documentation of rights & freedoms' },
      { type: 'custom', ar: '35+', en: '35+', labelAr: 'مؤسسات شريكة', labelEn: 'Partner Institutions', descAr: 'شبكة علاقات محلية ودولية', descEn: 'Local and international relationship network' }
    ]
  };

  const getLiveMetricValue = React.useCallback((metricId: string) => {
    if (!comprehensiveStats) return null;
    switch (metricId) {
      case 'total_projects': return comprehensiveStats.totalProjects;
      case 'total_beneficiaries': return comprehensiveStats.totalBeneficiaries;
      case 'total_courses': return comprehensiveStats.totalCourses;
      case 'total_violations': return comprehensiveStats.totalViolations;
      case 'total_reports': return comprehensiveStats.totalReports;
      case 'total_volunteers': return comprehensiveStats.totalVolunteers;
      default: return null;
    }
  }, [comprehensiveStats]);

  const statsToRender = React.useMemo(() => {
    const rawStats = impactData.stats || [];
    return rawStats.map((item: any) => {
      let valueStr = isRtl ? item.ar : item.en;
      let hasNoData = false;

      if (item.type === 'system') {
        const val = getLiveMetricValue(item.metricId);
        if (item.metricId === 'total_volunteers' && (!val || val === 0)) {
          valueStr = '--';
          hasNoData = true;
        } else if (val !== null && val !== undefined) {
          valueStr = `${Number(val).toLocaleString()}+`;
        }
      } else if (item.type === 'pmis') {
        const liveInd = liveIndicators.find(ind => String(ind.id) === String(item.indicatorId));
        if (liveInd) {
          valueStr = `${liveInd.current_value} / ${liveInd.target_value} ${liveInd.unit || ''}`;
        } else {
          valueStr = isRtl ? 'لا توجد بيانات' : 'No Data';
          hasNoData = true;
        }
      } else {
        if (item.labelAr?.includes('تطوع') || item.labelAr?.includes('متطوع') || item.labelEn?.includes('Volunteer')) {
          const val = comprehensiveStats?.totalVolunteers;
          if (!val || val === 0) {
            valueStr = '--';
            hasNoData = true;
          } else {
            valueStr = `${val}+`;
          }
        }
      }

      return {
        ...item,
        renderedValue: valueStr,
        hasNoData
      };
    }).filter((s: any) => !s.hasNoData);
  }, [impactData, comprehensiveStats, liveIndicators, isRtl, getLiveMetricValue]);

  const programsIntro = getSection('programs_intro') || {
    title: { ar: 'برامجنا الرئيسية لتمكين الإعلام', en: 'Our Main Programs to Empower Media' },
    text: { ar: 'نقدم حزمة متكاملة من الخدمات التي تضمن سلامة الصحفي واستمرارية عمله المهني بحرية واستقلالية.', en: 'We provide an integrated package of services that ensure the safety of the journalist and the continuity of their professional work freely and independently.' }
  };

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/api/projects');
        // Filter featured or just take latest 6
        const featured = data.filter((p: any) => p.isFeatured === 1 || p.isFeatured === true);
        if (featured.length > 0) {
          setFeaturedProjects(featured.slice(0, 6));
        } else {
          setFeaturedProjects(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Error fetching projects for home:", err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();

    const fetchNews = async () => {
      try {
        const { data } = await api.get('/api/articles');
        const mapped = data.slice(0, 4).map((n: any) => {
          const title = typeof n.title === 'string' ? JSON.parse(n.title) : n.title;
          return {
            id: n.id,
            title: isRtl ? title?.ar || title?.en : title?.en || title?.ar,
            date: new Date(n.published_at || n.created_at).toISOString().slice(0, 10),
            category: isRtl ? 'خبر' : 'News',
            image: n.featured_image || 'https://picsum.photos/seed/news/800/600',
            icon: Newspaper
          };
        });
        setLatestNews(mapped);
      } catch (err) {
        setLatestNews([]);
      }
    };
    fetchNews();
  }, [isRtl]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorSubmit('');
    setSuccess(false);
    try {
      await api.post('/api/subscribers', { email, source: 'Home Grid' });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setErrorSubmit(err.response?.data?.message || (isRtl ? 'فشل الاتصال بالخادم.' : 'Connection to server failed.'));
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      label: isRtl ? 'انتهاك موثق' : 'Violations Documented', 
      value: '1,240+', 
      icon: ShieldAlert, 
      color: 'text-red-600', 
      bg: 'bg-red-50',
      desc: isRtl ? 'رصد دقيق ومستمر للانتهاكات' : 'Accurate and continuous monitoring'
    },
    { 
      label: isRtl ? 'صحفي مستفيد' : 'Journalists Supported', 
      value: '450+', 
      icon: Users, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      desc: isRtl ? 'دعم قانوني ونفسي ومهني' : 'Legal, psychological and professional support'
    },
    { 
      label: isRtl ? 'دورة تدريبية' : 'Training Courses', 
      value: '85+', 
      icon: GraduationCap, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      desc: isRtl ? 'بناء قدرات الكوادر الإعلامية' : 'Capacity building for media cadres'
    },
    { 
      label: isRtl ? 'تقرير حقوقي' : 'Rights Reports', 
      value: '120+', 
      icon: FileText, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      desc: isRtl ? 'توثيق للعدالة والمساءلة' : 'Documentation for justice and accountability'
    },
  ];

  const programs = [
    { 
      title: isRtl ? 'برنامج الحماية' : 'Protection Program', 
      desc: isRtl ? 'توفير الدعم القانوني والجسدي للصحفيين المعرضين للخطر.' : 'Providing legal and physical support for journalists at risk.',
      icon: ShieldCheck,
      color: 'bg-red-500'
    },
    { 
      title: isRtl ? 'أكاديمية الإعلام' : 'Media Academy', 
      desc: isRtl ? 'تدريب مهني متقدم في الصحافة الاستقصائية والسلامة الرقمية.' : 'Advanced professional training in investigative journalism and digital safety.',
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    { 
      title: isRtl ? 'مرصد الانتهاكات' : 'Violations Observatory', 
      desc: isRtl ? 'توثيق ورصد كافة الانتهاكات ضد الحريات الإعلامية في اليمن.' : 'Documenting and monitoring all violations against media freedoms in Yemen.',
      icon: Search,
      color: 'bg-emerald-500'
    }
  ];

  const seoTitle = isRtl ? 'بيت الصحافة - صحافة من أجل الإنسان أولاً' : 'Press House - Journalism for Humanity First';
  const seoDescription = isRtl 
    ? 'مؤسسة مجتمع مدني تهدف إلى تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين، وتبني قضاياهم.' 
    : 'A civil society organization aiming to promote media freedom and create a professional discussion space for journalists.';

  return (
    <div className="space-y-16 md:space-y-32 pb-20 md:pb-32 overflow-hidden bg-slate-50/50">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        type="website"
      />
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Bento Stats Section */}
      {statsToRender.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 md:mb-6"
            >
              <Zap size={12} className="fill-current" />
              {isRtl ? 'تأثيرنا بالأرقام' : 'Our Impact in Numbers'}
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
            >
              {isRtl ? 'إنجازات نفخر بها' : 'Achievements We Are Proud Of'}
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {statsToRender.map((stat: any, idx: number) => {
              const icons = [ShieldAlert, Users, GraduationCap, FileText];
              const colors = ['text-red-600', 'text-blue-600', 'text-amber-600', 'text-emerald-600'];
              const bg = 'bg-white';
              const Icon = icons[idx % icons.length];
              const color = colors[idx % colors.length];

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, rotateX: -15, y: 20 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6, type: 'spring' }}
                  className="relative group p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-500 overflow-hidden"
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-current/10", color, "bg-slate-50")}>
                    <Icon size={28} />
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-1">
                      {stat.renderedValue}
                  </div>
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">{isRtl ? stat.labelAr : stat.labelEn}</div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Professional Performance and Training Impact Dashboard */}
          <motion.div
            id="performance-impact-dashboard"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6 md:space-y-8 mt-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">
                  {isRtl ? 'لوحة قياس الأثر والتدريب المؤسسي' : 'Institutional Impact & Training Dashboard'}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  {isRtl 
                    ? 'رصد تفاعلي لمخرجات التدريب وبناء القدرات، التمكين المجتمعي، وتوزيع المشاريع.' 
                    : 'Interactive tracking of training outputs, capacity building, community empowerment, and project distribution.'}
                </p>
              </div>
              
              {/* Tabs for different charts */}
              <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                <button
                  onClick={() => setPerformanceActiveTab('academy')}
                  className={cn(
                    "px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer",
                    performanceActiveTab === 'academy' 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {isRtl ? 'أثر أكاديمية الإعلام' : 'Media Academy'}
                </button>
                <button
                  onClick={() => setPerformanceActiveTab('growth')}
                  className={cn(
                    "px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer",
                    performanceActiveTab === 'growth' 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {isRtl ? 'النمو والوصول السنوي' : 'Annual Reach'}
                </button>
                <button
                  onClick={() => setPerformanceActiveTab('sectors')}
                  className={cn(
                    "px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer",
                    performanceActiveTab === 'sectors' 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {isRtl ? 'توزيع القطاعات' : 'Sectors'}
                </button>
              </div>
            </div>

            <div className="h-[320px] md:h-[380px] w-full relative">
              {performanceActiveTab === 'academy' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={academyImpactData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="academyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 12 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-xl border border-slate-800 font-sans text-xs space-y-1.5">
                              <p className="font-black text-[13px]">{data.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                <span className="text-slate-400 font-bold">{isRtl ? 'العدد الموثق:' : 'Documented Count:'}</span>
                                <span className="font-black text-blue-400 text-sm">{data.count.toLocaleString()}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#academyGrad)" 
                      radius={[12, 12, 0, 0]} 
                      maxBarSize={60}
                    >
                      {academyImpactData.map((entry, index) => {
                        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}

              {performanceActiveTab === 'growth' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={growthData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="benGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="year" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#10b981', fontSize: 11 }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: '#3b82f6', fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-slate-950 text-white p-4 rounded-2xl shadow-xl border border-slate-800 font-sans text-xs space-y-2">
                              <p className="font-black text-sm text-slate-300">{isRtl ? 'مؤشرات عام' : 'Year'} {payload[0].payload.year}</p>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between gap-4">
                                  <span className="flex items-center gap-1.5 text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    {isRtl ? 'المستفيدون:' : 'Beneficiaries:'}
                                  </span>
                                  <span className="font-black text-emerald-400">{payload[0].payload.beneficiaries.toLocaleString()}+</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="flex items-center gap-1.5 text-slate-400">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    {isRtl ? 'المشاريع النشطة:' : 'Active Projects:'}
                                  </span>
                                  <span className="font-black text-blue-400">{payload[0].payload.projects}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="beneficiaries" 
                      name={isRtl ? 'المستفيدون (دعم وتأهيل)' : 'Supported Beneficiaries'}
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#benGrad)" 
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="projects" 
                      name={isRtl ? 'المشاريع المنفذة' : 'Projects Implemented'}
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#projGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {performanceActiveTab === 'sectors' && (
                <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center">
                  <div className="h-64 md:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sectorData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {sectorData.map((entry, index) => {
                            const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-950 text-white p-3 rounded-xl shadow-lg border border-slate-800 font-sans text-xs">
                                  <p className="font-black">{data.name}</p>
                                  <p className="text-blue-400 font-bold mt-1">
                                    {isRtl ? 'عدد المشاريع:' : 'Projects Count:'} <span className="font-black">{data.value}</span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3 px-4">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'التصنيف الهيكلي للمبادرات' : 'Structural Allocation of Initiatives'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {sectorData.map((item, index) => {
                        const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'];
                        return (
                          <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-2.5">
                              <span className={cn("w-3 h-3 rounded-full", colors[index % colors.length])} />
                              <span className="font-bold text-slate-700 text-xs md:text-sm">{item.name}</span>
                            </div>
                            <span className="font-black text-slate-900 text-sm">{item.value} {isRtl ? 'مشاريع' : 'projects'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
      )}

      {/* Programs Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(16,185,129,0.1),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-3 gap-10 md:gap-16 items-start">
            <div className="lg:col-span-1 space-y-6 md:space-y-8 lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <MousePointer2 size={12} />
                {isRtl ? 'ماذا نقدم؟' : 'What We Offer?'}
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                {isRtl ? programsIntro.title.ar : programsIntro.title.en}
              </h2>
              <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                {isRtl ? programsIntro.text.ar : programsIntro.text.en}
              </p>
              <Link to="/about" className="group inline-flex items-center gap-4 text-white font-black uppercase tracking-widest text-[11px] md:text-sm hover:text-blue-400 transition-colors">
                <span className="relative">
                  {isRtl ? 'تعرف على المزيد' : 'Learn More'}
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </span>
                <div className={cn("w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all", isRtl && "rotate-180")}>
                  <ArrowRight size={18} />
                </div>
              </Link>
            </div>
            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6 md:gap-8">
              {projectsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
                ))
              ) : featuredProjects.length > 0 ? (
                featuredProjects.map((proj, i) => {
                  const title = typeof proj.title === 'string' ? JSON.parse(proj.title) : proj.title;
                  const desc = typeof proj.description === 'string' ? JSON.parse(proj.description) : proj.description;
                  return (
                    <motion.div 
                      key={proj.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group p-6 md:p-10 rounded-3xl md:rounded-[48px] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/20 transition-all duration-500 flex flex-col h-full"
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 text-white bg-blue-600 overflow-hidden">
                        {proj.image ? (
                          <img src={proj.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ShieldCheck size={28} />
                        )}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 tracking-tight">
                        {isRtl ? title?.ar : (title?.en || title?.ar)}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-xs md:text-sm font-medium line-clamp-3">
                        {isRtl ? desc?.ar : (desc?.en || desc?.ar)}
                      </p>
                      
                      <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/5">
                        <Link to={`/projects/${proj.id}`} className="inline-flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                          {isRtl ? 'تفاصيل المشروع' : 'Project Details'}
                          <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="lg:col-span-2 flex items-center justify-center p-12 text-white/50 bg-white/5 rounded-3xl border border-white/10">
                  {isRtl ? 'لا توجد مشاريع مضافة حالياً.' : 'No projects added currently.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Observatory & Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <ShieldAlert size={12} />
            {isRtl ? 'مرصد الانتهاكات' : 'Violations Observatory'}
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            {isRtl ? 'خريطة الانتهاكات التفاعلية' : 'Interactive Violations Map'}
          </h2>
          <p className="text-slate-500 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
            {isRtl 
              ? 'تتبع حيوي لجميع الحوادث والانتهاكات المسجلة على مستوى جميع المحافظات اليمنية.' 
              : 'Live tracking of all recorded incidents and violations across all Yemeni governorates.'}
          </p>
        </div>
        
        <div className="w-full">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm relative z-10 w-full overflow-hidden p-2 md:p-6">
            <YemenMap 
              data={statsByGov} 
              violationsList={violations} 
            />
          </div>
        </div>
        
        {/* Violation Statistics Charts */}
        <div id="violations-charts" className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
             <h3 className="text-xl font-black mb-6 text-slate-900">{isRtl ? 'توزيع الانتهاكات حسب النوع' : 'Violations Distribution by Type'}</h3>
             <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationsByType}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {violationsByType.map((entry, index) => {
                      const colors = ['#ef4444', '#f97316', '#f59e0b', '#ec4899', '#8b5cf6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3 rounded-xl shadow-lg border border-slate-800 font-sans text-xs">
                            <p className="font-black">{data.name}</p>
                            <p className="text-red-400 font-bold mt-1">
                              {isRtl ? 'الحالات المسجلة:' : 'Registered Cases:'} <span className="font-black text-sm">{data.value}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
             </div>
           </div>
           
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
             <h3 className="text-xl font-black mb-6 text-slate-900">{isRtl ? 'الانتهاكات عبر الزمن' : 'Violations Over Time'}</h3>
             <div className="h-72 w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={violationsTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="violationsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-3 rounded-xl shadow-lg border border-slate-800 font-sans text-xs">
                            <p className="font-black text-slate-300">{data.name}</p>
                            <p className="text-red-400 font-bold mt-1">
                              {isRtl ? 'عدد الانتهاكات:' : 'Violations Count:'} <span className="font-black text-sm">{data.cases}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cases" 
                    stroke="#ef4444" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#violationsGrad)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
             </div>
           </div>
        </div>
      </section>

      {/* Featured Projects - Modern Grid */}
      <section className="py-16 md:py-32 bg-slate-50 relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-100/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 space-y-16 md:space-y-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">{isRtl ? 'مبادرات متميزة' : 'Key Initiatives'}</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900">{isRtl ? 'أبرز مشاريعنا' : 'Featured Projects'}</h2>
            </div>
            <p className="text-slate-500 max-w-md font-medium text-sm md:text-base">
              {isRtl ? 'مبادرات مستمرة لإحداث تغيير حقيقي في المشهد الإعلامي اليمني.' : 'Ongoing initiatives to make a real difference in the Yemeni media landscape.'}
            </p>
          </div>

          <ProjectGrid />
        </div>
      </section>

      {/* Latest News Slider */}
      {latestNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mb-10 md:mb-20">
            <div className="space-y-3 md:space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.2em]"
              >
                <Newspaper size={12} />
                {isRtl ? 'آخر المستجدات' : 'Latest Updates'}
              </motion.div>
              <h2 className="text-2xl md:text-6xl font-black text-slate-900 tracking-tight">
                {isRtl ? 'أخبار وتقارير' : 'News & Reports'}
              </h2>
            </div>
            <Link to="/news" className="group flex items-center gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
              {isRtl ? 'عرض كافة الأخبار' : 'View All News'}
              <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isRtl && "rotate-180 group-hover:-translate-x-1")} />
            </Link>
          </div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation={true}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-16"
          >
            {latestNews.map((news, idx) => (
              <SwiperSlide key={news.id}>
                <motion.article 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.7, delay: idx * 0.1 }}
                  className="group flex flex-col h-full bg-white rounded-3xl md:rounded-[48px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 rtl:left-auto rtl:right-4 md:rtl:right-6 flex gap-2">
                      <div className="bg-white/90 backdrop-blur-md text-blue-900 text-[9px] md:text-[10px] uppercase font-black px-3.5 py-1.5 md:px-4 md:py-2 rounded-full shadow-xl flex items-center gap-1.5 md:gap-2">
                         <news.icon size={11} className="text-blue-600" />
                        {news.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-10 flex flex-col flex-grow space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {news.date}
                    </div>
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 leading-[1.2] group-hover:text-blue-600 transition-colors line-clamp-3">
                      {news.title}
                    </h3>
                    <div className="pt-3 md:pt-4 mt-auto">
                      <Link to={`/news/${news.id}`} className="inline-flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] group/link">
                        <span className="relative">
                          {isRtl ? 'اقرأ المزيد' : 'Read More'}
                          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
                        </span>
                        <div className={cn("w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-600 group-hover/link:text-white transition-all", isRtl && "rotate-180")}>
                          <ArrowRight size={14} />
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* Partners - Marquee Style */}
      <section className="max-w-7xl mx-auto px-4 space-y-20">
        <div className="text-center space-y-4">
          <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">{isRtl ? 'شبكة التعاون' : 'Collaboration Network'}</span>
          <h2 className="text-4xl font-black text-slate-900">{isRtl ? 'شركاؤنا في النجاح' : 'Our Partners'}</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { name: 'مؤسسة أرنيادا للتنمية الثقافية', logo: 'https://ui-avatars.com/api/?name=Arniada&background=e2e8f0&color=1e293b&size=100' },
            { name: 'مؤسسة قرار للإعلام والتنمية', logo: 'https://ui-avatars.com/api/?name=Qarar&background=e2e8f0&color=1e293b&size=100' },
            { name: 'منصة يوب يوب', logo: 'https://ui-avatars.com/api/?name=YopYop&background=e2e8f0&color=1e293b&size=100' },
            { name: 'مؤسسة ألف لدعم وحماية التعليم', logo: 'https://ui-avatars.com/api/?name=Alef&background=e2e8f0&color=1e293b&size=100' },
            { name: 'تكتل وهج الشبابي', logo: 'https://ui-avatars.com/api/?name=Wahaj&background=e2e8f0&color=1e293b&size=100' }
          ].map((partner, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-4 bg-white px-8 py-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all grayscale hover:grayscale-0 group w-48 text-center"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-slate-700 text-sm leading-tight">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[64px] p-16 md:p-24 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 space-y-10">
            <Handshake className="mx-auto text-white/40 animate-bounce" size={64} />
            <h2 className="text-4xl md:text-6xl font-black leading-tight">
              {isRtl ? 'انضم إلينا في رحلة' : 'Join us in the journey'} <br />
              {isRtl ? 'تمكين الكلمة الحرة' : 'of empowering the free word'}
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/projects" className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors shadow-xl inline-block">
                {isRtl ? 'شاهد مشاريعنا' : 'View Our Projects'}
              </Link>
              <Link to="/contact" className="px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-colors inline-block">
                {isRtl ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
