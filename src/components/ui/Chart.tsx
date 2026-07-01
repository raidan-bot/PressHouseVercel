import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

// Simple Bar Chart
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  className?: string;
  showValues?: boolean;
}

export function BarChart({ data, maxValue, className, showValues = true }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">{item.label}</span>
            {showValues && <span className="font-bold text-slate-900">{item.value}</span>}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                item.color || 'bg-blue-600'
              )}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Line Chart (simplified SVG)
interface LineChartProps {
  data: {x: number | string; y: number }[];
  width?: number;
  height?: number;
  className?: string;
}

export function LineChart({ data, width = 400, height = 200, className }: LineChartProps) {
  const maxY = Math.max(...data.map((d) => d.y));
  const minY = Math.min(...data.map((d) => d.y));
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - ((d.y - minY) / (maxY - minY)) * chartHeight,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('w-full', className)} style={{ maxWidth: width }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + chartHeight * t}
          x2={width - padding}
          y2={padding + chartHeight * t}
          stroke="#e2e8f0"
          strokeDasharray="4"
        />
      ))}

      {/* Line */}
      <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={2} />

      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#2563eb" className="hover:r-6 transition-all" />
      ))}
    </svg>
  );
}

// Pie Chart
interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  className?: string;
}

export function PieChart({ data, className }: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = 0;

  return (
    <div className={cn('flex items-center gap-8', className)}>
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          currentAngle += angle;
          const endAngle = currentAngle;

          const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
          const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
          const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
          const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

          return (
            <path
              key={index}
              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="white"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-sm font-bold text-slate-900">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}