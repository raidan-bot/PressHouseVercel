import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  activeStep: string;
  className?: string;
}

export function Stepper({ steps, activeStep, className }: StepperProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-start gap-4">
        {steps.map((step, index) => {
          const isActive = index <= activeIndex;
          const isCurrent = index === activeIndex;

          return (
            <div key={step.id} className="flex-1 flex flex-col items-center">
              {/* Step indicator */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                  isActive
                    ? isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-400'
                )}
              >
                {isActive && !isCurrent ? (
                  <Check size={20} />
                ) : (
                  index + 1
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <p
                  className={cn(
                    'text-sm font-bold',
                    isActive ? 'text-slate-900' : 'text-slate-400'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2',
                    isActive ? 'bg-blue-600' : 'bg-slate-200'
                  )}
                  style={{ transform: 'translateX(50%)' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Step({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export default Stepper;