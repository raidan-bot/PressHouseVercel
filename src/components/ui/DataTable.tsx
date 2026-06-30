import React, { useState, useMemo, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Skeleton } from './Skeleton';

// Types
export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  searchable?: boolean;
  selectable?: boolean;
  loading?: boolean;
  onRowSelect?: (selected: T[]) => void;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchable = false,
  selectable = false,
  loading = false,
  onRowSelect,
  onRowClick,
  className,
  emptyMessage = 'No data available',
  emptyIcon,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Search filter
    if (searchable && searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((row) =>
        columns.some((col) => {
          const value = (row as any)[col.key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        })
      );
    }

    // Sort
    if (sortState.key && sortState.direction) {
      filtered.sort((a, b) =>
        {if (!sortState.key) return 0;
        const aValue = (a as any)[sortState.key!];
        const bValue = (b as any)[sortState.key!];
        if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortState, columns, searchable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Handle sort
  const handleSort = useCallback((key: string) => {
    setSortState((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: null };
        return { key, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // Handle row selection
  const handleSelectRow = useCallback((row: T, rowId: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      const selectedData = data.filter((item) => 
        newSet.has(String((item as any).id || JSON.stringify(item)))
      );
      onRowSelect?.(selectedData);
      return newSet;
    });
  }, [data, onRowSelect]);

  // Handle select all
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const allIds = paginatedData.map((row) => String((row as any).id || JSON.stringify(row)));
      const newSet = new Set(allIds);
      setSelectedRows(newSet);
      onRowSelect?.(paginatedData);
    }
    setSelectAll(!selectAll);
  }, [selectAll, paginatedData, onRowSelect]);

  // Get sort icon
  const getSortIcon = (key: string) => {
    if (sortState.key !== key) return <ArrowUpDown size={14} className="text-slate-400" />;
    if (sortState.direction === 'asc') return <ChevronUp size={14} className="text-blue-600" />;
    if (sortState.direction === 'desc') return <ChevronDown size={14} className="text-blue-600" />;
    return <ArrowUpDown size={14} className="text-slate-400" />;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and actions */}
      {searchable && (
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {selectedRows.size > 0 && (
            <span className="text-sm text-slate-600 font-medium">
              {selectedRows.size} selected
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {selectable && (
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'p-4 text-left text-xs font-black uppercase tracking-widest text-slate-500',
                    "cursor-pointer select-none hover:text-slate-700 transition-colors",
                    col.width && `w-[${col.width}]`
                  )}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <div className="flex items-center gap-2">
                    {col.header}
                    {col.sortable && getSortIcon(String(col.key))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="p-12 text-center"
                >
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    {emptyIcon || <Search size={48} className="opacity-50" />}
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowId = String((row as any).id || JSON.stringify(row));
                const isSelected = selectedRows.has(rowId);
                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'transition-colors hover:bg-slate-50',
                      isSelected && 'bg-blue-50',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row, rowId)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={String(col.key)} className="p-4 text-slate-700">
                        {col.render ? (
                          col.render(row, rowIndex)
                        ) : (
                          <span className="font-medium">
                            {String((row as any)[col.key] ?? '-')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-medium">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} results
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, and around current
                const show =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!show && (page === currentPage - 2 || page === currentPage + 2)) {
                  return <span key={page} className="px-2 text-slate-400">...</span>;
                }
                if (!show) return null;

                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      'w-10 h-10 rounded-xl text-sm font-bold transition-colors',
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;