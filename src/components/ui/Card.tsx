import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass';

interface CardProps {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-slate-800/80 shadow-sm',
  elevated: 'bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl',
  bordered: 'bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700',
  glass: 'bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/30',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  onClick,
  as: Tag = 'div',
}) => {
  const classes = cn(
    'rounded-2xl transition-all duration-300',
    variantStyles[variant],
    paddingStyles[padding],
    hover && 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
    className
  );

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={hover ? { y: -4 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        className={classes}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return <Tag className={classes}>{children}</Tag>;
};

// Sub-components for convenience
export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('mb-4', className)}>{children}</div>;

export const CardBody: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('', className)}>{children}</div>;

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={cn('mt-4 pt-4 border-t border-slate-100 dark:border-slate-700', className)}>{children}</div>;
