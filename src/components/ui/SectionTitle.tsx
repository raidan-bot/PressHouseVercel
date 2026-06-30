import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  light?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const sizeStyles = {
  sm: { title: 'text-xl md:text-2xl', subtitle: 'text-sm', gap: 'gap-2' },
  md: { title: 'text-2xl md:text-3xl lg:text-4xl', subtitle: 'text-sm md:text-base', gap: 'gap-3' },
  lg: { title: 'text-3xl md:text-4xl lg:text-5xl', subtitle: 'text-base md:text-lg', gap: 'gap-4' },
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  size = 'md',
  icon,
  light = false,
  className,
  titleClassName,
  subtitleClassName,
}) => {
  const styles = sizeStyles[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={cn(
        'flex flex-col',
        styles.gap,
        alignStyles[align],
        align === 'center' && 'items-center',
        align === 'right' && 'items-end',
        className
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 mb-1"
        >
          {icon}
        </motion.div>
      )}
      <h2
        className={cn(
          'font-bold font-heading tracking-tight',
          styles.title,
          light ? 'text-white' : 'text-slate-900 dark:text-white',
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl leading-relaxed',
            styles.subtitle,
            light ? 'text-white/70' : 'text-slate-500 dark:text-slate-400',
            align === 'center' && 'mx-auto',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
      {/* Decorative line */}
      <div
        className={cn(
          'h-1 w-16 rounded-full mt-2',
          align === 'center' && 'mx-auto',
          light ? 'bg-blue-400' : 'bg-blue-600'
        )}
      />
    </motion.div>
  );
};
