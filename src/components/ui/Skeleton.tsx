import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const sizeStyle = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height: height || (variant === 'text' ? 16 : variant === 'circular' ? 40 : 200),
  };

  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      {items.map((i) => (
        <div
          key={i}
          className={cn(baseClasses, variantClasses[variant], className)}
          style={sizeStyle}
        />
      ))}
    </>
  );
};

// Pre-built skeleton templates
export const ArticleCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden shadow-sm animate-pulse">
    <Skeleton variant="rectangular" height={200} className="rounded-none" />
    <div className="p-5 space-y-3">
      <div className="flex gap-2">
        <Skeleton variant="text" width={60} height={20} className="rounded-full" />
        <Skeleton variant="text" width={80} height={20} className="rounded-full" />
      </div>
      <Skeleton variant="text" height={24} />
      <Skeleton variant="text" height={24} width="75%" />
      <Skeleton variant="text" height={16} count={2} />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={120} height={14} />
      </div>
    </div>
  </div>
);

export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 shadow-sm animate-pulse space-y-3">
    <Skeleton variant="circular" width={48} height={48} />
    <Skeleton variant="text" height={36} width="60%" />
    <Skeleton variant="text" height={16} width="40%" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => (
  <div className="space-y-3 animate-pulse">
    {/* Header */}
    <div className="flex gap-4 p-4">
      {Array.from({ length: cols }, (_, i) => (
        <Skeleton key={i} variant="text" height={20} className="flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-800/40 rounded-xl">
        {Array.from({ length: cols }, (_, j) => (
          <Skeleton key={j} variant="text" height={16} className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/40 rounded-xl animate-pulse">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={16} width="60%" />
          <Skeleton variant="text" height={12} width="40%" />
        </div>
      </div>
    ))}
  </div>
);
