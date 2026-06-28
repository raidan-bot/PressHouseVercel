import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, Save, Loader2, Image as ImageIcon, 
  Upload, ChevronRight, Layout, Type, AlignLeft,
  Settings as SettingsIcon, Plus, Trash2, Globe
} from 'lucide-react';
import { api } from '../../services/api';
import { MediaLibraryModal } from '../../components/media/MediaLibraryModal';

interface ContentSection {
  id: string;
  page_name: string;
  section_name: string;
  content: any;
}

const DEFAULT_PAGES = [
  { id: 'home', label_ar: 'الرئيسية', label_en: 'Home' },
  { id: 'about', label_ar: 'عن المنصة', label_en: 'About' },
  { id: 'contact', label_ar: 'اتصل بنا', label_en: 'Contact' },
  { id: 'services', label_ar: 'خدماتنا', label_en: 'Services' },
  { id: 'programs', label_ar: 'برامجنا', label_en: 'Programs' },
  { id: 'academy', label_ar: 'الأكاديمية والندوات', label_en: 'Academy & Seminars' },
  { id: 'news', label_ar: 'الأخبار والتقارير', label_en: 'News & Reports' },
  { id: 'events', label_ar: 'الفعاليات', label_en: 'Events' },
  { id: 'projects', label_ar: 'المشاريع', label_en: 'Projects' },
  { id: 'violations', label_ar: 'مرصد الانتهاكات', label_en: 'Violations Observatory' },
  { id: 'jobs', label_ar: 'الوظائف والفرص', label_en: 'Jobs & Opportunities' },
  { id: 'tenders', label_ar: 'المناقصات', label_en: 'Tenders' },
  { id: 'volunteer', label_ar: 'بوابة المتطوعين', label_en: 'Volunteer Portal' },
];

export default function PageContentManager() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [pagesList, setPagesList] = useState(DEFAULT_PAGES);
  const [activePage, setActivePage] = useState('home');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaSection, setActiveMediaSection] = useState<{sectionIndex: number, field: string} | null>(null);
  const [pmisIndicators, setPmisIndicators] = useState<any[]>([]);

  useEffect(() => {
    const loadCustomPages = async () => {
      try {
        const response = await api.get('/api/page-content');
        if (response.data && Array.isArray(response.data)) {
          const customPages = response.data
            .map((p: any) => p.page_name)
            .filter((name: string) => !DEFAULT_PAGES.find(dp => dp.id === name))
            .map((name: string) => ({ id: name, label_ar: name, label_en: name }));
          
          if (customPages.length > 0) {
            setPagesList([...DEFAULT_PAGES, ...customPages]);
          }
        }
      } catch (err) {
        console.error('Error fetching custom pages:', err);
      }
    };
    loadCustomPages();
  }, []);

  useEffect(() => {
    fetchPageContent();
  }, [activePage]);

  useEffect(() => {
    const fetchIndicatorsList = async () => {
      try {
        const response = await api.get('/api/analytics/indicators');
        if (response.data && response.data.success) {
          setPmisIndicators(response.data.indicators || []);
        }
      } catch (err) {
        console.error("Error loading indicators for content manager:", err);
      }
    };
    fetchIndicatorsList();
  }, [activePage]);

  const fetchPageContent = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/page-content/${activePage}`);
      const data = response.data.map((s: any) => ({
        ...s,
        content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content
      }));
      setSections(data);

      // If no sections found, add some defaults based on page
      if (data.length === 0) {
        initializeDefaultSections();
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultSections = () => {
    let defaults: any[] = [];
    if (activePage === 'home') {
      defaults = [
        { section_name: 'hero', content: { title: { ar: 'بيت الصحافة - اليمن', en: 'Press House - Yemen' }, subtitle: { ar: 'نحو صحافة حرة، مستقلة، ومهنية تعزز من حرية الرأي والتعبير', en: 'Towards a free, independent, and professional press promoting freedom of expression' }, button: { ar: 'اقرأ المزيد', en: 'Read More' }, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1200' } },
        { section_name: 'about_brief', content: { title: { ar: 'عن بيت الصحافة', en: 'About Press House' }, text: { ar: 'مؤسسة يمنية مستقلة رائدة تعنى بتمكين الصحفيين والدفاع عن الحريات الإعلامية والتعبير.', en: 'An independent leading Yemeni organization for empowering journalists and defending media freedoms.' }, image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=800' } },
      ];
    } else if (activePage === 'about') {
      defaults = [
        { section_name: 'introduction', content: { title: { ar: 'صحافة من أجل الإنسان أولاً', en: 'Journalism for Humanity First' }, text: { ar: 'مؤسسة مجتمع مدني تهدف إلى تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين، وتبني قضاياهم والعمل على تطوير ودعم الصحافة في اليمن.', en: 'A civil society organization aiming to promote media freedom and create a professional discussion space for journalists, adopting their causes and supporting journalism in Yemen.' }, image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800' } },
        { section_name: 'mission', content: { title: { ar: 'رسالتنا', en: 'Our Mission' }, text: { ar: 'أن تصبح بيت الصحافة المؤسسة الأولى في تعزيز حرية الصحافة وحمل مطالبها والدفاع عن استحقاقاتها.', en: 'To become the leading institution in promoting press freedom and defending its entitlements.' } } },
        { section_name: 'vision', content: { title: { ar: 'رؤيتنا', en: 'Our Vision' }, text: { ar: 'صحافة مهنية حرة أولويتها الإنسان.', en: 'Free professional journalism that prioritizes humanity.' } } },
      ];
    } else if (activePage === 'contact') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'تواصل معنا', en: 'Contact Us' }, subtitle: { ar: 'سواء كان لديك استفسار، اقتراح، أو ترغب في الانضمام إلى مجتمعنا، يسعدنا دائماً سماع صوتك.', en: 'Whether you have an inquiry, suggestion, or want to join us, we are happy to hear from you.' } } },
        { section_name: 'info', content: { email: 'info@phye.org', phone: '04-210613', addressAr: 'تعز، اليمن', addressEn: 'Taiz, Yemen', workingHoursAr: 'الأحد - الخميس: 8 صباحاً - 4 مساءً', workingHoursEn: 'Sun - Thu: 8 AM - 4 PM' } }
      ];
    } else if (activePage === 'services') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'خدماتنا', en: 'Our Services' }, subtitle: { ar: 'نقدم حلولاً متكاملة ودعماً فنياً وقانونياً مستمراً للصحفيين والمؤسسات الإعلامية في اليمن.', en: 'Providing comprehensive solutions and continuous legal and technical support for journalists and media outlets.' } } }
      ];
    } else if (activePage === 'programs') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'برامجنا الاستراتيجية', en: 'Our Strategic Programs' }, subtitle: { ar: 'نعمل عبر حزمة برامج نوعية تسعى لحماية الحريات الإعلامية وتطوير المحتوى ورفع القدرات المهنية.', en: 'Operating through qualitative programs aimed at protecting media freedoms, developing content, and capacity building.' } } }
      ];
    } else if (activePage === 'academy') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'أكاديمية بيت الصحافة', en: 'Press House Academy' }, subtitle: { ar: 'منصة التدريب وبناء قدرات الإعلاميين والصحفيين اليمنيين وفق المعايير الدولية الحديثة.', en: 'The training and capacity building platform for Yemeni journalists and media professionals based on modern international standards.' }, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800' } }
      ];
    } else if (activePage === 'news') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'الأخبار والتقارير', en: 'News & Reports' }, subtitle: { ar: 'تابع آخر مستجدات وتغطيات بيت الصحافة، بالإضافة إلى التقارير الاستقصائية والتحقيقات الحقوقية.', en: 'Follow the latest news from Press House, in addition to investigative and human rights reports.' } } }
      ];
    } else if (activePage === 'events') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'الفعاليات والندوات', en: 'Events & Seminars' }, subtitle: { ar: 'كن شريكاً وحاضراً في ندواتنا الفكرية، ورش العمل، والأنشطة الثقافية والحقوقية المستمرة.', en: 'Be a partner and attend our intellectual seminars, workshops, and ongoing cultural and rights activities.' } } }
      ];
    } else if (activePage === 'projects') {
      defaults = [
        { section_name: 'المشاريع الحالية والمستدامة', content: { title: { ar: 'مشاريعنا وتدخلاتنا الميدانية', en: 'Our Projects & Interventions' }, subtitle: { ar: 'مشاريع ملموسة تهدف لتحسين وتأهيل بيئة العمل الصحفي وحماية الصحفيين بمشاركة الشركاء الدوليين والجاهات المانحة.', en: 'Concrete projects aimed at improving the journalism workspace environment and protecting journalists, with international and donor partners.' } } }
      ];
    } else if (activePage === 'violations') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'مرصد الانتهاكات ضد الصحفيين', en: 'Journalists Violation Observatory' }, subtitle: { ar: 'نظام توثيق ورصد مهني متطور يسعى لكشف الحقائق ومناهضة الإفلات من العقاب للجرائم المرتكبة ضد الحريات الإعلامية في اليمن.', en: 'An advanced monitoring and documentation system seeking to uncover facts and combat impunity for crimes committed against media freedom in Yemen.' }, note: { ar: 'جميع البيانات الواردة في هذا المرصد تخضع لآلية تحقق وتدقيق صارمة.', en: 'All data displayed on this observatory is subject to a strict verification and vetting workflow.' } } }
      ];
    } else if (activePage === 'jobs') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'الفرص والوظائف الشاغرة', en: 'Careers & Opportunities' }, subtitle: { ar: 'انضم لفرص التدريب، التوظيف، والاستشارات المتاحة للمتخصصين في بيئة العمل الإعلامي والإداري.', en: 'Join available training, careers, and consultancy opportunities for specialists in media and administrative environments.' } } }
      ];
    } else if (activePage === 'tenders') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'المناقصات والمشتريات', en: 'Tenders & Procurement' }, subtitle: { ar: 'نعلن في بيت الصحافة عن رغبتنا باستدراج عروض وأسعار لتوريد وتقديم الخدمات المختلفة للمشاريع المعتمدة بجميع شفافية ونزاهة.', en: 'Announcing bidding and price request procedures for sourcing various materials/services for approved projects with full integrity.' } } }
      ];
    } else if (activePage === 'volunteer') {
      defaults = [
        { section_name: 'header', content: { title: { ar: 'بوابة التطوع في بيت الصحافة', en: 'Press House Volunteer Portal' }, subtitle: { ar: 'ساهم بمهاراتك وقدراتك في نصرة الحريات والعمل الإعلامي، وابنِ مستقبلك المهني مع فريق عمل ريادي ومحترف.', en: 'Contribute with your skills to support media freedoms, and build your career with a leading and professional team.' } } }
      ];
    }
    
    setSections(defaults.map(d => ({ ...d, page_name: activePage })));
  };

  const handleUpdateSection = (index: number, content: any) => {
    const newSections = [...sections];
    newSections[index].content = content;
    setSections(newSections);
  };

  const addNewSection = () => {
    const sectionName = prompt(isRtl ? 'أدخل اسم القسم (بالانجليزية):' : 'Enter section name (English):');
    if (!sectionName) return;
    
    setSections([...sections, {
      id: Date.now().toString(),
      page_name: activePage,
      section_name: sectionName,
      content: { title: { ar: '', en: '' }, text: { ar: '', en: '' } }
    }]);
  };

  const handleSave = async (index: number) => {
    const section = sections[index];
    setSaving(section.section_name);
    try {
      await api.post('/api/page-content', {
        page_name: activePage,
        section_name: section.section_name,
        content: section.content
      });
      // Optionally show a toast
    } catch (error) {
      console.error("Error saving section:", error);
      alert(isRtl ? 'فشل حفظ هذا القسم' : 'Failed to save this section');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => {
          if (activeMediaSection) {
            const { sectionIndex, field } = activeMediaSection;
            const newContent = { ...sections[sectionIndex].content, [field]: url };
            handleUpdateSection(sectionIndex, newContent);
          }
          setIsMediaModalOpen(false);
          setActiveMediaSection(null);
        }}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isRtl ? 'تحرير محتوى الصفحات' : 'Page Content Editor'}</h1>
          <p className="text-slate-500 text-sm mt-1">{isRtl ? 'تحرير النصوص والوسائط لكل صفحة في الموقع' : 'Edit text and media for every site page'}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Page Selector Sidebar */}
        <aside className="w-full lg:w-64 space-y-1">
          <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>{isRtl ? 'اختر الصفحة' : 'Select Page'}</span>
            <button 
              onClick={() => {
                const newId = prompt(isRtl ? 'أدخل معرف الصفحة (انجليزي فقط):' : 'Enter page ID (English only):');
                if (newId) {
                  const newLabel = prompt(isRtl ? 'أدخل اسم الصفحة:' : 'Enter page name:');
                  if (newLabel) {
                    setPagesList([...pagesList, { id: newId, label_ar: newLabel, label_en: newLabel }]);
                    setActivePage(newId);
                  }
                }
              }}
              className="text-blue-600 hover:text-blue-700"
              title={isRtl ? "إضافة صفحة جديدة" : "Add New Page"}
            >
              <Plus size={14} />
            </button>
          </div>
          {pagesList.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activePage === page.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout size={18} />
                {isRtl ? page.label_ar : page.label_en}
              </div>
              <ChevronRight size={14} className={activePage === page.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </aside>

        {/* Content Editor Area */}
        <div className="flex-1 space-y-8">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
          ) : (
            <>
              {sections.map((section, idx) => (
                <div key={section.section_name} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                        <Type size={18} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-sm">{section.section_name.replace(/_/g, ' ')}</h3>
                        <p className="text-[10px] text-slate-500">{isRtl ? 'عنصر محتوى قابل للتحرير' : 'Editable content section'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSave(idx)}
                      disabled={saving === section.section_name}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      {saving === section.section_name ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                      {isRtl ? 'حفظ القسم' : 'Save Section'}
                    </button>
                  </div>

                  <div className="p-8 space-y-8">
                    {section.section_name === 'impact_stats' ? (
                      <div className="space-y-6">
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-blue-800 text-xs">
                          <div>
                            <span className="font-extrabold text-sm block">💡 {isRtl ? 'إعداد بنية حائط المؤشرات الرئيسي' : 'Design Home Impactor KPIs'}</span>
                            <p className="opacity-80 mt-1">{isRtl ? 'أضف أي مؤشر في أي مرحلة لتظهر في الصفحة الرئيسية مدمجة إما بتعدادات تلقائية أو مؤشر من مشاريع PMIS أو مدخلة يدوياً.' : 'Add any live/manual indicator at any stage. Pick system telemetry, PMIS project objectives, or write fixed values.'}</p>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const currentStats = section.content.stats || [];
                              const newItem = {
                                type: 'system',
                                metricId: 'total_violations',
                                ar: '0',
                                en: '0',
                                labelAr: isRtl ? 'مؤشر مضاف' : 'Added Metric',
                                labelEn: 'Added Metric',
                                descAr: '',
                                descEn: ''
                              };
                              handleUpdateSection(idx, {
                                ...section.content,
                                stats: [...currentStats, newItem]
                              });
                            }}
                            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md transition-all self-start sm:self-auto cursor-pointer"
                          >
                            <Plus size={16} />
                            {isRtl ? 'إضافة بطاقة مؤشر' : 'Add KPI Card'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(section.content.stats || []).map((stat: any, sIdx: number) => (
                            <div key={sIdx} className="p-6 rounded-3xl border border-slate-200 bg-slate-50 relative space-y-4 shadow-sm">
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = (section.content.stats || []).filter((_: any, i: number) => i !== sIdx);
                                  handleUpdateSection(idx, { ...section.content, stats: filtered });
                                }}
                                className="absolute top-4 ltr:right-4 rtl:left-4 p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-full cursor-pointer border-none bg-transparent transition-colors"
                                title={isRtl ? 'حذف هذا المؤشر' : 'Delete KPI'}
                              >
                                <Trash2 size={16} />
                              </button>

                              <h4 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                                <SettingsIcon size={14} className="text-blue-500" />
                                {isRtl ? `بطاقة المؤشر #${sIdx + 1}` : `KPI Card #${sIdx + 1}`}
                              </h4>

                              <div className="space-y-4 pt-1">
                                <div>
                                  <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'نوع مصدر المؤشر' : 'KPI Data Source Type'}</label>
                                  <select
                                    value={stat.type || 'system'}
                                    onChange={(e) => {
                                      const updatedStats = [...(section.content.stats || [])];
                                      updatedStats[sIdx] = { 
                                        ...updatedStats[sIdx], 
                                        type: e.target.value,
                                        metricId: e.target.value === 'system' ? 'total_violations' : undefined,
                                        indicatorId: e.target.value === 'pmis' ? (pmisIndicators[0]?.id || '') : undefined
                                      };
                                      handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                    }}
                                    className="w-full text-xs px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="system">{isRtl ? 'مقياس إجمالي تلقائي من النظام (أرقام تراكمية)' : 'System Telemetry Metric (Automatic)'}</option>
                                    <option value="pmis">{isRtl ? 'مؤشر تشغيلي لمشروع من بنك PMIS' : 'Operational PMIS Project Indicator'}</option>
                                    <option value="manual">{isRtl ? 'إدخال قيمة ثابتة يدوية' : 'Manual / Static custom value'}</option>
                                  </select>
                                </div>

                                {stat.type === 'system' && (
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'المقياس المطلوب' : 'Telemetry Variable'}</label>
                                    <select
                                      value={stat.metricId || 'total_violations'}
                                      onChange={(e) => {
                                        const updatedStats = [...(section.content.stats || [])];
                                        updatedStats[sIdx] = { ...updatedStats[sIdx], metricId: e.target.value };
                                        handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                      }}
                                      className="w-full text-xs px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="total_violations">{isRtl ? 'إجمالي الانتهاكات المرصودة' : 'Cumulative Documented Violations'}</option>
                                      <option value="total_beneficiaries">{isRtl ? 'إجمالي الصحفيين المستفيدين' : 'Supported Journalists'}</option>
                                      <option value="total_courses">{isRtl ? 'إجمالي محاور التدريب وأكاديمية المواد' : 'Training Courses Academy'}</option>
                                      <option value="total_reports">{isRtl ? 'إجمالي التقارير الحقوقية الصادرة' : 'Drafted Rights Reports'}</option>
                                      <option value="total_projects">{isRtl ? 'إجمالي المشاريع المفتوحة' : 'Total CSO Projects'}</option>
                                      <option value="total_volunteers">{isRtl ? 'إجمالي المتطوعين المسجلين' : 'Registered Volunteers (VMS)'}</option>
                                    </select>
                                  </div>
                                )}

                                {stat.type === 'pmis' && (
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'اختر المؤشر من بنك PMIS' : 'Select Project Indicator'}</label>
                                    {pmisIndicators.length > 0 ? (
                                      <select
                                        value={stat.indicatorId || ''}
                                        onChange={(e) => {
                                          const updatedStats = [...(section.content.stats || [])];
                                          updatedStats[sIdx] = { ...updatedStats[sIdx], indicatorId: e.target.value };
                                          handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                        }}
                                        className="w-full text-xs px-3 py-2.5 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                      >
                                        <option value="">{isRtl ? '-- اختر مؤشراً --' : '-- Select Indicator --'}</option>
                                        {pmisIndicators.map(ind => (
                                          <option key={ind.id} value={ind.id}>
                                            {ind.project_title || 'Project'}: {ind.name} ({ind.current_value}/{ind.target_value} {ind.unit})
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <p className="text-[11px] text-amber-600 block bg-amber-50 p-3 rounded-xl border border-amber-100 mt-1">
                                        ⚠️ {isRtl ? 'لا يوجد مؤشرات مسجلة في PMIS حالياً. يمكنك إضافتها من صفحة الأثر أولاً.' : 'No PMIS indicators found. Go to Admin -> Impact to create them.'}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {stat.type === 'manual' && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'القيمة بالعربية (مثال: +150)' : 'Value AR'}</label>
                                      <input
                                        type="text"
                                        value={stat.ar || ''}
                                        onChange={(e) => {
                                          const updatedStats = [...(section.content.stats || [])];
                                          updatedStats[sIdx] = { ...updatedStats[sIdx], ar: e.target.value };
                                          handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                        }}
                                        className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'القيمة بالإنجليزية' : 'Value EN'}</label>
                                      <input
                                        type="text"
                                        value={stat.en || ''}
                                        onChange={(e) => {
                                          const updatedStats = [...(section.content.stats || [])];
                                          updatedStats[sIdx] = { ...updatedStats[sIdx], en: e.target.value };
                                          handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                        }}
                                        className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500 font-bold font-mono"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'العنوان بالعربية (مثال: انتهاك موثق)' : 'Title AR'}</label>
                                    <input
                                      type="text"
                                      value={stat.labelAr || ''}
                                      onChange={(e) => {
                                        const updatedStats = [...(section.content.stats || [])];
                                        updatedStats[sIdx] = { ...updatedStats[sIdx], labelAr: e.target.value };
                                        handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                      }}
                                      className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'العنوان بالإنجليزية' : 'Title EN'}</label>
                                    <input
                                      type="text"
                                      value={stat.labelEn || ''}
                                      onChange={(e) => {
                                        const updatedStats = [...(section.content.stats || [])];
                                        updatedStats[sIdx] = { ...updatedStats[sIdx], labelEn: e.target.value };
                                        handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                      }}
                                      className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'شرح إضافي بالعربية' : 'Desc AR'}</label>
                                    <input
                                      type="text"
                                      value={stat.descAr || ''}
                                      onChange={(e) => {
                                        const updatedStats = [...(section.content.stats || [])];
                                        updatedStats[sIdx] = { ...updatedStats[sIdx], descAr: e.target.value };
                                        handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                      }}
                                      className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isRtl ? 'شرح بالإنجليزية' : 'Desc EN'}</label>
                                    <input
                                      type="text"
                                      value={stat.descEn || ''}
                                      onChange={(e) => {
                                        const updatedStats = [...(section.content.stats || [])];
                                        updatedStats[sIdx] = { ...updatedStats[sIdx], descEn: e.target.value };
                                        handleUpdateSection(idx, { ...section.content, stats: updatedStats });
                                      }}
                                      className="w-full text-xs px-3 py-2 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      Object.keys(section.content || {}).map((key) => {
                        const value = section.content[key];
                        
                        // Handle nested ar/en objects (Translations)
                        if (value && typeof value === 'object' && ('ar' in value || 'en' in value)) {
                          return (
                            <div key={key} className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Globe size={14} />
                                {key.replace(/_/g, ' ')}
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <span className="text-[10px] text-slate-400 font-bold px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">ARABIC</span>
                                  {key.includes('description') || key.includes('text') || key.includes('content') ? (
                                     <textarea 
                                       rows={4}
                                       value={value.ar}
                                       onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: { ...value, ar: e.target.value } })}
                                       className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                                     />
                                  ) : (
                                    <input 
                                      type="text"
                                      value={value.ar}
                                      onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: { ...value, ar: e.target.value } })}
                                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                                    />
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <span className="text-[10px] text-slate-400 font-bold px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">ENGLISH</span>
                                  {key.includes('description') || key.includes('text') || key.includes('content') ? (
                                     <textarea 
                                       rows={4}
                                       value={value.en}
                                       onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: { ...value, en: e.target.value } })}
                                       className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                                     />
                                  ) : (
                                    <input 
                                      type="text"
                                      value={value.en}
                                      onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: { ...value, en: e.target.value } })}
                                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Handle images
                        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('url') || key.toLowerCase().includes('video')) {
                          return (
                            <div key={key} className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</label>
                              <div className="flex gap-4">
                                <input 
                                  type="text"
                                  value={value}
                                  onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: e.target.value })}
                                  className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                                  placeholder="https://..."
                                />
                                <button 
                                  onClick={() => {
                                    setActiveMediaSection({ sectionIndex: idx, field: key });
                                    setIsMediaModalOpen(true);
                                  }}
                                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-sm"
                                >
                                  <Upload size={18} />
                                  {isRtl ? 'المكتبة' : 'Library'}
                                </button>
                              </div>
                              {value && (
                                <div className="w-full max-w-sm h-48 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                                  <img src={value} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          );
                        }
  
                        // Handle simple strings
                        if (typeof value === 'string' || typeof value === 'number') {
                          return (
                            <div key={key} className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</label>
                              <input 
                                type="text"
                                value={value}
                                onChange={(e) => handleUpdateSection(idx, { ...section.content, [key]: e.target.value })}
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                              />
                            </div>
                          );
                        }
  
                        return null;
                      })
                    )}
                  </div>
                </div>
              ))}

              {/* Add Custom Section */}
              <button 
                onClick={addNewSection}
                className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="font-bold">{isRtl ? 'إضافة قسم جديد مخصص لهذه الصفحة' : 'Add custom section to this page'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
