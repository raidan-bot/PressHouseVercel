import React from 'react';
import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      className,
    )}
  >
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
      {icon ?? <Inbox className="w-8 h-8" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {action.label}
      </button>
    )}
  </div>
);
