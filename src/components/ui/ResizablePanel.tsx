import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number; // percentage (0-100)
  minSize?: number;
  maxSize?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  direction = 'horizontal',
  className,
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        newSize = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSize = ((e.clientY - rect.top) / rect.height) * 100;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    },
    [isDragging, direction, minSize, maxSize]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp, direction]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* First panel */}
      <div
        className="flex-shrink-0 overflow-auto"
        style={{ [direction === 'horizontal' ? 'width' : 'height']: `${size}%` }}
      >
        {Array.isArray(children) ? children[0] : children}
      </div>

      {/* Resizer */}
      <div
        onMouseDown={handleMouseDown}
        className={cn(
          'flex-shrink-0 bg-slate-200 hover:bg-blue-400 transition-colors cursor-col-resize flex items-center justify-center',
          direction === 'horizontal'
            ? 'w-4 cursor-col-resize'
            : 'h-4 cursor-row-resize'
        )}
      >
        <div
          className={cn(
            'bg-slate-400 rounded-full',
            direction === 'horizontal' ? 'w-1 h-8' : 'w-8 h-1'
          )}
        />
      </div>

      {/* Second panel */}
      <div className="flex-1 overflow-auto">
        {Array.isArray(children) ? children[1] : null}
      </div>
    </div>
  );
}

export default ResizablePanel;