import React, { useState } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface KanbanItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

interface KanbanColumnType {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
}

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onMoveItem?: (itemId: string, fromColumn: string, toColumn: string) => void;
  className?: string;
}

export function KanbanBoard({ columns, onMoveItem, className }: KanbanBoardProps) {
  const [localColumns, setLocalColumns] = useState(columns);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  const handleDragStart = (itemId: string) => {
    setDraggingItem(itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggingItem) return;

    // Find item and move to new column
    const newColumns = localColumns.map((col) => {
      if (col.items.some((item) => item.id === draggingItem)) {
        return {
          ...col,
          items: col.items.filter((item) => item.id !== draggingItem),
        };
      }
      if (col.id === columnId) {
        const item = localColumns
          .flatMap((c) => c.items)
          .find((i) => i.id === draggingItem);
        if (item) {
          return {
            ...col,
            items: [...col.items, item],
          };
        }
      }
      return col;
    });

    setLocalColumns(newColumns);
    setDraggingItem(null);
  };

  return (
    <div className={cn('flex gap-6 overflow-x-auto pb-4', className)}>
      {localColumns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80 bg-slate-50 rounded-2xl p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          {/* Column header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.color || '#3b82f6' }}
              />
              <h3 className="font-bold text-slate-900">{column.title}</h3>
              <span className="text-sm text-slate-500">{column.items.length}</span>
            </div>
            <button className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
              <Plus size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {column.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                className={cn(
                  'bg-white rounded-xl p-4 shadow-sm border border-slate-200 cursor-grab hover:shadow-md transition-shadow',
                  draggingItem === item.id && 'opacity-50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-slate-900 text-sm">{item.title}</h4>
                  <button className="p-1 rounded hover:bg-slate-100">
                    <MoreHorizontal size={14} className="text-slate-400" />
                  </button>
                </div>

                {item.description && (
                  <p className="text-xs text-slate-500 mt-2">{item.description}</p>
                )}

                {item.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {item.priority && (
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full',
                        item.priority === 'high' && 'bg-red-500',
                        item.priority === 'medium' && 'bg-yellow-500',
                        item.priority === 'low' && 'bg-green-500'
                      )}
                    />
                    <span className="text-xs text-slate-500 capitalize">{item.priority}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function KanbanColumn({ children, title, count }: { children: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex-shrink-0 w-80 bg-slate-50 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900">{title}</h3>
        {count !== undefined && <span className="text-sm text-slate-500">{count}</span>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function KanbanCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-grab">
      {children}
    </div>
  );
}

export default KanbanBoard;