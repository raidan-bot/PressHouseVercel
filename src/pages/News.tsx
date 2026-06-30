import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper, Clock, Tag } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { SearchFilterBar } from '../components/common/SearchFilterBar';
import { CardGridSkeleton } from '../components/common/Skeleton';
import { cn } from '../lib/utils';
import { AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { supabase } from '../lib/db';

// UI Components
import { 
  PageHero,
  Button, 
  Card, 
  CardBody,
  Badge, 
  Pagination as UIPagination, 
  EmptyState as UIEmptyState,
  StaggerContainer, 
  StaggerItem,
  ScrollReveal,
} from '../components/ui';

const PAGE_SIZE = 9;

export default function News() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [articles, setArticles] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const seoTitle = isRtl ? 'الأخبار والتقارير الصحفية | بيت الصحافة اليمني' : 'News & Press Reports | PressHouse Yemen';
  const seoDescription = isRtl 
    ? 'تابع آخر الأخبار والتقارير الصحفية الاستقصائية والبيانات الصادرة عن بيت الصحافة في اليمن.' 
    : 'Stay updated with the latest news, investigative press reports, and media releases of PressHouse in Yemen.';
  const seoKeywords = isRtl ? 'أخبار اليمن, تقارير صحفية, حرية الرأي, الصحافة الاستقصائية' : 'Yemen news, journalism articles, press freedom, investigative reports';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let rawArticles: any[] = [];
        
        // 1. Try fetching directly from Supabase
        try {
          const { data: supabaseNews, error } = await supabase
            .from('news')
            .select('*');

          if (supabaseNews && supabaseNews.length > 0 && !error) {
            rawArticles = supabaseNews.map((doc: any) => ({
              ...doc,
              title: typeof doc.title === 'string' ? JSON.parse(doc.title) : doc.title,
              content: typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content,
              createdAt: doc.created_at || doc.createdAt,
            }));
          } else {
            throw new Error(error?.message || 'Empty news from Supabase');
          }
        } catch {
          console.warn('Supabase fetch unavailable. Falling back to local database API.');
          const response = await api.get('/api/articles');
          rawArticles = response.data.map((doc: any) => ({
            ...doc,
            title: typeof doc.title === 'string' ? JSON.parse(doc.title) : doc.title,
            content: typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content,
          }));
        }

        const formattedAndFiltered = rawArticles
          .filter((a: any) => a.status === 'published' && (category === 'all' || a.category === category))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setArticles(formattedAndFiltered);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    setCurrentPage(1);
    fetchArticles();
  }, [category]);

  const categories = [
    { id: 'all', label: isRtl ? 'الكل' : 'All', icon: Newspaper },
    { id: 'news', label: isRtl ? 'أخبار' : 'News', icon: Clock },
    { id: 'report', label: isRtl ? 'تقارير' : 'Reports', icon: Tag },
    { id: 'press_release', label: isRtl ? 'بيانات صحفية' : 'Press Releases', icon: Newspaper },
  ];

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const title = article.title?.[i18n.language as 'ar'|'en'] || '';
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [articles, searchTerm, i18n.language]);

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        type="website"
      />

      <PageHero
        title={isRtl ? 'الأخبار والتقارير' : 'News & Reports'}
        subtitle={isRtl 
          ? 'تابع آخر المستجدات والتقارير الحقوقية والبيانات الصحفية الصادرة عن بيت الصحافة.'
          : 'Follow the latest updates, human rights reports, and press releases issued by Press House.'}
        size="md"
        pattern="dots"
        className="mt-20"
      />

      {/* Filter & Search Section */}
      <section className="container mx-auto px-4 md:px-6 -mt-6 md:-mt-12 relative z-20">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white rounded-2xl md:rounded-[32px] shadow-2xl shadow-slate-200/50 p-5 md:p-8 border border-slate-100">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={category === cat.id ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "uppercase tracking-widest font-black",
                      category === cat.id && "shadow-lg shadow-blue-200"
                    )}
                  >
                    <cat.icon size={14} className="shrink-0" />
                    {cat.label}
                  </Button>
                ))}
              </div>

            <SearchFilterBar
              searchValue={searchTerm}
              onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
              searchPlaceholder={isRtl ? 'بحث في الأخبار...' : 'Search news...'}
              className="w-full lg:w-auto"
            />
          </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Articles Grid */}
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-20">
        {loading ? (
          <CardGridSkeleton count={PAGE_SIZE} />
        ) : (
          <>
            <StaggerContainer 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
              staggerDelay={0.05}
            >
              {paginatedArticles.map((article) => (
                <StaggerItem key={article.id} direction="up">
                  <Card as="article" variant="elevated" padding="none" className="group h-full overflow-hidden rounded-3xl md:rounded-[40px]">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={article.mainImage} 
                        alt={article.title[i18n.language as 'ar'|'en']} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 md:top-6 md:left-6 rtl:left-auto rtl:right-4 md:rtl:right-6">
                        <Badge variant="primary" size="sm">
                          {article.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardBody className="p-6 md:p-10 flex flex-col flex-grow space-y-4 md:space-y-6">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        <Calendar size={12} className="text-blue-600 shrink-0" />
                        {new Date(article.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title[i18n.language as 'ar'|'en']}
                      </h2>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3">
                        {stripHtml(article.content[i18n.language as 'ar'|'en'] || article.content[isRtl ? 'ar' : 'en'])}
                      </p>
                      <div className="pt-6 mt-auto">
                        <Link to={`/news/${article.id}`} className="inline-flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] group/link">
                          <span className="relative">
                            {isRtl ? 'اقرأ المزيد' : 'Read More'}
                            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left" />
                          </span>
                          <span className={cn("w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:border-blue-600 group-hover/link:text-white transition-all", isRtl && "rotate-180")}>
                            <ArrowRight size={14} />
                          </span>
                        </Link>
                      </div>
                    </CardBody>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {filteredArticles.length === 0 && !loading && (
              <UIEmptyState
                title={isRtl ? 'لا توجد نتائج' : 'No Results Found'}
                description={isRtl ? 'حاول تغيير معايير البحث أو التصفية' : 'Try changing your search or filter criteria'}
                icon={<Newspaper className="w-8 h-8" />}
                action={{
                  label: isRtl ? 'إعادة تعيين' : 'Reset Filters',
                  onClick: () => { setCategory('all'); setSearchTerm(''); setCurrentPage(1); },
                }}
                size="md"
              />
            )}

            {totalPages > 0 && (
              <UIPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => { setCurrentPage(page); }}
                siblingCount={1}
                className="mt-10 md:mt-16"
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
