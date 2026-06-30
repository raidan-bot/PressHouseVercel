import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  size?: 'sm' | 'md' | 'lg';
  showBreadcrumbs?: boolean;
  overlay?: boolean;
  overlayOpacity?: string;
  children?: React.ReactNode;
  className?: string;
  pattern?: 'dots' | 'grid' | 'none';
}

const sizeStyles = {
  sm: { padding: 'py-16 md:py-20', title: 'text-3xl md:text-4xl', subtitle: 'text-sm md:text-base' },
  md: { padding: 'py-20 md:py-28', title: 'text-4xl md:text-5xl lg:text-6xl', subtitle: 'text-base md:text-lg' },
  lg: { padding: 'py-28 md:py-36', title: 'text-5xl md:text-6xl lg:text-7xl', subtitle: 'text-lg md:text-xl' },
};

const patternStyles = {
  dots: `bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:20px_20px]`,
  grid: `bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]`,
  none: '',
};

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  backgroundImage,
  size = 'md',
  showBreadcrumbs = true,
  overlay = true,
  overlayOpacity = 'from-slate-900/80 via-slate-900/60 to-slate-900/70',
  children,
  className,
  pattern = 'dots',
}) => {
  const styles = sizeStyles[size];

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        styles.padding,
        backgroundImage
          ? 'text-white'
          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white',
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {overlay && (
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br',
                overlayOpacity
              )}
            />
          )}
        </div>
      )}

      {/* Decorative Pattern */}
      {!backgroundImage && (
        <div className={cn('absolute inset-0 opacity-40', patternStyles[pattern])} />
      )}

      {/* Decorative Gradient Orbs */}
      {!backgroundImage && (
        <>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBreadcrumbs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Breadcrumbs />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1
            className={cn(
              'font-bold font-heading tracking-tight leading-tight',
              styles.title
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                'mt-4 max-w-2xl leading-relaxed text-white/70',
                styles.subtitle
              )}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
};
