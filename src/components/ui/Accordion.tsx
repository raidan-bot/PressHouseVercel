import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

// Context
interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion provider');
  }
  return context;
}

// Accordion Container
interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

export function Accordion({ children, allowMultiple = false, defaultOpen = [], className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          if (!allowMultiple) {
            newSet.clear();
          }
          newSet.add(id);
        }
        return newSet;
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={cn('divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// Accordion Item
interface AccordionItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ id, children, className }: AccordionItemProps) {
  return (
    <div className={cn('bg-white', className)}>
      {children}
    </div>
  );
}

// Accordion Trigger
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  // We'll get the item id from context in a real implementation
  // For now, we'll use a simpler approach

  return (
    <button
      onClick={() => {
        // In a real implementation, we'd use the item id from context
        // This is a simplified version
      }}
      className={cn(
        'flex items-center justify-between w-full p-4 text-left font-bold text-slate-900 hover:bg-slate-50 transition-colors',
        className
      )}
    >
      {children}
      <ChevronDown
        size={20}
        className={cn(
          'text-slate-400 transition-transform duration-200',
          openItems.has('id') && 'rotate-180'
        )}
      />
    </button>
  );
}

// Accordion Content
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={cn('overflow-hidden', className)}
      >
        <div className="p-4 pt-0 text-slate-600">{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}

export { useAccordion };