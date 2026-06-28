import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const ContentContainer = ({ children, className = '' }: Props) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 ${className}`}>
      {children}
    </div>
  );
};
