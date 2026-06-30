import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: { icon: 'w-10 h-10', title: 'text-lg', description: 'text-sm', padding: 'p-8' },
  md: { icon: 'w-14 h-14', title: 'text-xl', description: 'text-sm', padding: 'p-12' },
  lg: { icon: 'w-20 h-20', title: 'text-2xl', description: 'text-base', padding: 'p-16' },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}) => {
  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.padding,
        className
      )}
    >
      {icon ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className={cn(
            'flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4',
            styles.icon
          )}
        >
          {icon}
        </motion.div>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4',
            styles.icon
          )}
        >
          <svg className="w-1/2 h-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
      )}
      <h3 className={cn('font-bold text-slate-900 dark:text-white mb-2', styles.title)}>
        {title}
      </h3>
      {description && (
        <p className={cn('text-slate-500 dark:text-slate-400 max-w-md', styles.description)}>
          {description}
        </p>
      )}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Button onClick={action.onClick} size={size === 'sm' ? 'sm' : 'md'}>
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
