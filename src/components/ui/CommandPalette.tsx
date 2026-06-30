import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowRight, Command } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  commands: CommandItem[];
  className?: string;
}

export function CommandPalette({ commands, className }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const cmd = filteredCommands[selectedIndex];
          if (cmd) {
            cmd.action();
            setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors',
          className
        )}
      >
        <Search size={16} />
        <span className="text-sm">Search...</span>
        <kbd className="px-2 py-0.5 bg-white rounded text-xs font-mono ml-auto">
          Ctrl K
        </kbd>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[10vh] p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-slate-200">
              <Search size={20} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-lg placeholder:text-slate-400"
              />
              <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-500">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Search size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No commands found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((cmd, index) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        index === selectedIndex
                          ? 'bg-blue-50 text-blue-900'
                          : 'hover:bg-slate-50'
                      )}
                    >
                      {cmd.icon && (
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          {cmd.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{cmd.label}</p>
                        {cmd.category && (
                          <p className="text-xs text-slate-500">{cmd.category}</p>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-mono">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      {index === selectedIndex && (
                        <ArrowRight size={16} className="text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-slate-50 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-xs">
                    {'↑↓'}
                  </kbd>{' '}
                  Navigate
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-xs">
                    {'⏎'}
                  </kbd>{' '}
                  Select
                </span>
              </div>
              <span>{filteredCommands.length} commands</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommandPalette;