import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

// Auto-generate breadcrumb from route path
export function useBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return pathnames.map((value, index) => {
    const path = `/${pathnames.slice(0, index + 1).join('/')}`;
    return {
      label: value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' '),
      path,
      active: index === pathnames.length - 1,
    };
  });
}

export function Breadcrumb({ items, className, separator }: BreadcrumbProps) {
  const autoItems = useBreadcrumb();
  const breadcrumbItems = items || autoItems;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-2 flex-wrap">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Home size={16} className="flex-shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Separator */}
        <li className="text-slate-400">
          {separator || <ChevronRight size={16} className="flex-shrink-0" />}
        </li>

        {/* Breadcrumb items */}
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li className="flex items-center">
              {item.active || !item.path ? (
                <span className={cn('text-sm font-bold text-slate-900', item.active && 'text-blue-600')}>
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>

            {/* Separator */}
            {index < breadcrumbItems.length - 1 && (
              <li className="text-slate-400">
                {separator || <ChevronRight size={16} className="flex-shrink-0" />}
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Compact breadcrumb for small spaces
export function CompactBreadcrumb({ items, className }: BreadcrumbProps) {
  const autoItems = useBreadcrumb();
  const breadcrumbItems = items || autoItems;

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center', className)}>
      <ol className="flex items-center gap-1 text-sm">
        <li>
          <Link to="/" className="text-slate-500 hover:text-blue-600 transition-colors">
            <Home size={14} />
          </Link>
        </li>

        {breadcrumbItems.length > 2 && (
          <li className="text-slate-400">
            <span>...</span>
          </li>
        )}

        {breadcrumbItems.slice(-2).map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-slate-400">/</li>
            <li>
              {item.active ? (
                <span className="font-bold text-slate-900">{item.label}</span>
              ) : (
                <Link to={item.path || '#'} className="text-slate-500 hover:text-blue-600 transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;