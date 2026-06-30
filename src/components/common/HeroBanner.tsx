import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface HeroBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  background?: 'blue' | 'red' | 'green' | 'purple' | 'slate';
  backgroundImage?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const gradientMap: Record<string, string> = {
  blue: 'from-blue-600 via-blue-700 to-indigo-800',
  red: 'from-red-600 via-rose-700 to-pink-800',
  green: 'from-emerald-600 via-green-700 to-teal-800',
  purple: 'from-purple-600 via-violet-700 to-indigo-800',
  slate: 'from-slate-700 via-slate-800 to-slate-900',
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  badge,
  background = 'blue',
  backgroundImage,
  cta,
  className,
}) => (
  <section
    className={cn(
      'relative overflow-hidden bg-gradient-to-br py-20 px-4',
      !backgroundImage && gradientMap[background],
      className,
    )}
  >
    {/* Background image overlay */}
    {backgroundImage && (
      <>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80" />
      </>
    )}

    {/* Radial glow */}
    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

    <div className="relative max-w-4xl mx-auto text-center text-white">
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-bold leading-tight mb-4"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/80 max-w-2xl mx-auto mb-6"
        >
          {subtitle}
        </motion.p>
      )}
      {cta && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={cta.onClick}
          className="px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-white/90 transition-colors shadow-lg"
        >
          {cta.label}
        </motion.button>
      )}
    </div>
  </section>
);
