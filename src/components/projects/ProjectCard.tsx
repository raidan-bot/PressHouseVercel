import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    title: { [key: string]: string };
    description: { [key: string]: string };
    image: string;
    status: 'ongoing' | 'completed' | 'seeking_funding';
    fundingGoal?: number;
    currentFunding?: number;
    indicators?: any[];
  };
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === 'ar';

  const progress = project.fundingGoal 
    ? Math.min(100, (project.currentFunding || 0) / project.fundingGoal * 100) 
    : 0;

  const statusColors = {
    ongoing: 'bg-blue-100 text-blue-700',
    completed: 'bg-emerald-100 text-emerald-700',
    seeking_funding: 'bg-amber-100 text-amber-700',
  };

  const statusLabels = {
    ongoing: isRtl ? 'قيد التنفيذ' : 'Ongoing',
    completed: isRtl ? 'مكتمل' : 'Completed',
    seeking_funding: isRtl ? 'بانتظار التمويل' : 'Seeking Funding',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 ease-out flex flex-col h-full"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title?.[lang] || 'Project'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className={cn(
          "absolute top-5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg backdrop-blur-md border border-white/20",
          isRtl ? "right-5" : "left-5",
          project.status === 'ongoing' ? 'bg-blue-600/90 text-white' : 
          project.status === 'completed' ? 'bg-emerald-600/90 text-white' : 
          'bg-amber-500/90 text-white'
        )}>
          {statusLabels[project.status]}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow space-y-6">
        <div className="space-y-3 flex-grow">
          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
            {project.title?.[lang]}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
            {project.description?.[lang]}
          </p>
        </div>

        {project.status !== 'completed' && project.fundingGoal && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{isRtl ? 'التمويل' : 'Funding'}</span>
              <span className="text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs font-black text-slate-900 tabular-nums">
              <span>${(project.currentFunding || 0).toLocaleString()}</span>
              <span className="text-slate-400 font-bold">/ ${(project.fundingGoal).toLocaleString()}</span>
            </div>
          </div>
        )}

        <Link to={`/projects/${project.id}`} className="w-full py-4 mt-4 rounded-2xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm text-center block">
          {isRtl ? 'عرض التفاصيل' : 'View Details'}
        </Link>
      </div>
    </motion.div>
  );
};
