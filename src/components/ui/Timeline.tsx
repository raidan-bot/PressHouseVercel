import React from 'react';
import { cn } from '../../lib/utils';

interface TimelineItemData {
  id: string;
  title: string;
  description?: string;
  date: string;
  status?: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
  variant?: 'vertical' | 'horizontal';
}

export function Timeline({ items, className, variant = 'vertical' }: TimelineProps) {
  return (
    <div
      className={cn(
        variant === 'vertical' ? 'space-y-8' : 'flex gap-8',
        className
      )}
    >
      {items.map((item, index) => (
        <TimelineItem
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
          variant={variant}
        />
      ))}
    </div>
  );
}

interface TimelineItemProps {
  item: TimelineItemData;
  isLast: boolean;
  variant: 'vertical' | 'horizontal';
  key?: React.Key;
}

function TimelineItem({
  item,
  isLast,
  variant,
}: TimelineItemProps) {
  const statusColors = {
    completed: 'bg-blue-600',
    current: 'bg-blue-500 animate-pulse',
    pending: 'bg-slate-300',
  };

  const statusBorderColors = {
    completed: 'border-blue-600',
    current: 'border-blue-500',
    pending: 'border-slate-300',
  };

  if (variant === 'horizontal') {
    return (
      <div className="flex-1 relative">
        {/* Connector */}
        {!isLast && (
          <div className="absolute top-4 left-1/2 w-full h-0.5 bg-slate-200" />
        )}

        <div className="flex flex-col items-center text-center">
          {/* Dot */}
          <div
            className={cn(
              'w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 relative bg-white',
              statusBorderColors[item.status || 'pending']
            )}
          >
            {item.icon && <div className="text-xs">{item.icon}</div>}
          </div>

          {/* Content */}
          <div className="mt-3">
            <p className="text-sm font-bold text-slate-900">{item.title}</p>
            {item.description && (
              <p className="text-xs text-slate-500 mt-1">{item.description}</p>
            )}
            <p className="text-xs text-slate-400 mt-1">{item.date}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-4 h-4 rounded-full border-4 z-10',
            statusBorderColors[item.status || 'pending'],
            item.status === 'current' && 'animate-pulse'
          )}
        />
        {!isLast && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900">{item.title}</p>
          <span className="text-xs text-slate-400">{item.date}</span>
        </div>
        {item.description && (
          <p className="text-sm text-slate-600 mt-1">{item.description}</p>
        )}
      </div>
    </div>
  );
}

export function TimelineItemComponent({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4">{children}</div>;
}

export default Timeline;