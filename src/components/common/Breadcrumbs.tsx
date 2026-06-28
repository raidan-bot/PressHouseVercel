import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]; // Optional manual override
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const location = useLocation();

  const generateItems = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter((p) => p !== '');
    if (paths.length === 0) return [];

    const segmentMap: Record<string, { ar: string; en: string }> = {
      news: { ar: 'الأخبار والتقارير', en: 'News & Reports' },
      violations: { ar: 'مرصد الانتهاكات', en: 'Violations Observatory' },
      academy: { ar: 'أكاديمية التدريب', en: 'Training Academy' },
      projects: { ar: 'المشاريع والبرامج', en: 'Projects & Programs' },
      about: { ar: 'عن بيت الصحافة', en: 'About PressHouse' },
      contact: { ar: 'اتصل بنا', en: 'Contact Us' },
      jobs: { ar: 'فرص التوظيف والعمل', en: 'Careers & Jobs' },
      tenders: { ar: 'المناقصات والعطاءات', en: 'Tenders & Grants' },
      volunteers: { ar: 'منصة التطوع', en: 'Volunteers Portal' },
      profile: { ar: 'الملف الشخصي', en: 'My Profile' },
      courses: { ar: 'الدورات التدريبية', en: 'Training Courses' },
      search: { ar: 'البحث المتقدم', en: 'Advanced Search' },
      'verify-certificate': { ar: 'التحقق من الشهادات', en: 'Verify Certificate' },
      'media-products': { ar: 'الإنتاج الإعلامي والبودكاست', en: 'Media & Podcasts' },
      dashboard: { ar: 'لوحة التحكم', en: 'Dashboard' },
      admin: { ar: 'لوحة الإدارة', en: 'Admin Area' },
      root: { ar: 'المشرف العام', en: 'System Supervisor' },
      staff: { ar: 'بوابة الموظفين', en: 'Staff Portal' },
      'success-stories': { ar: 'قصص نجاح ملهمة', en: 'Success Stories' },
    };

    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      
      const isId = !isNaN(Number(path)) || path.length > 15; // standard numeric ID or long Firebase/BSON UUID
      let label = '';

      if (isId) {
        // Look at preceding item to determine dynamic context label
        const prevSegment = index > 0 ? paths[index - 1] : '';
        if (prevSegment === 'news') {
          label = isRtl ? 'تفاصيل الخبر' : 'Article Details';
        } else if (prevSegment === 'violations') {
          label = isRtl ? 'بيانات الانتهاك الكامله' : 'Violation Registry';
        } else if (prevSegment === 'projects') {
          label = isRtl ? 'تفاصيل المشروع' : 'Project Insights';
        } else if (prevSegment === 'courses') {
          label = isRtl ? 'تفاصيل البرنامج التدريبي' : 'Course Details';
        } else if (prevSegment === 'jobs') {
          label = isRtl ? 'تفاصيل الوظيفة الشاغرة' : 'Job Description';
        } else if (prevSegment === 'tenders') {
          label = isRtl ? 'تفاصيل المناقصة' : 'Tender Guidelines';
        } else if (prevSegment === 'media-products') {
          label = isRtl ? 'تفاصيل الإنتاج والوسائط' : 'Media Detail';
        } else {
          label = isRtl ? 'معينات المحتوى' : 'Item Details';
        }
      } else {
        const mapped = segmentMap[path.toLowerCase()];
        if (mapped) {
          label = isRtl ? mapped.ar : mapped.en;
        } else {
          // Fallback clean capitalization
          label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        }
      }

      return {
        label,
        path: isLast ? undefined : url,
      };
    });
  };

  const breadcrumbs = items || generateItems();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn("flex text-sm text-slate-500", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 rtl:space-x-reverse overflow-hidden whitespace-nowrap">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-blue-600 transition-colors">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {isRtl ? (
                <ChevronLeft className="w-4 h-4 mx-1 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 mx-1 text-slate-400 shrink-0" />
              )}
              {isLast || !item.path ? (
                <span className="font-medium text-slate-900 truncate max-w-[200px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-blue-600 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
