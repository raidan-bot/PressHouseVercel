import React, { createContext, useContext, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

// Context
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  variant: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Tabs Container
interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
  variant?: 'horizontal' | 'vertical';
  className?: string;
}

export function Tabs({ children, defaultTab, variant = 'horizontal', className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant }}>
      <div
        className={cn(
          'w-full',
          variant === 'horizontal' ? 'flex flex-col' : 'flex flex-row gap-6',
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// Tab List
interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  const { variant } = useTabs();

  return (
    <div
      className={cn(
        'flex',
        variant === 'horizontal'
          ? 'flex-row gap-1 p-1 bg-slate-100 rounded-2xl'
          : 'flex-col gap-1 w-64',
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

// Tab
interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ value, children, disabled = false, className }: TabProps) {
  const { activeTab, setActiveTab, variant } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        'relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        isActive
          ? 'bg-white text-blue-600 shadow-sm'
          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
      {isActive && variant === 'horizontal' && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"
        />
      )}
    </button>
  );
}

// Tab Panel
interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <motion.div
      role="tabpanel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('w-full', className)}
    >
      {children}
    </motion.div>
  );
}

export { useTabs };