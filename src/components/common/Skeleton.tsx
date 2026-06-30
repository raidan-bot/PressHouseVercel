import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn('animate-pulse rounded-xl bg-slate-200', className)}
  />
);

/** Card skeleton: image block + 2 text lines */
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

/** List row skeleton: avatar + 2 text lines */
export const ListSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
    <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Skeleton className="h-4 w-20 shrink-0" />
  </div>
);

/** Detail page skeleton: header + content blocks */
export const DetailSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <Skeleton className="h-6 w-40" />
    <Skeleton className="h-72 w-full rounded-2xl" />
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-1/3" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  </div>
);

/** Grid of card skeletons */
export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
