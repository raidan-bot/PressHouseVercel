import React from 'react';
import { cn } from '../../lib/utils';
import { FileQuestion, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
  className?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        'min-h-[60vh] flex flex-col items-center justify-center px-4 text-center',
        className,
      )}
    >
      <FileQuestion className="w-20 h-20 text-slate-300 mb-6" />
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <p className="text-lg text-slate-600 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </button>
    </div>
  );
};
