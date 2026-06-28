import React, { useEffect, useState } from 'react';
import { getPerformanceReport } from '../../utils/performance';

export default function PerformanceReport() {
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    setMetrics(getPerformanceReport());
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Performance Report</h2>
      <div className="grid grid-cols-1 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
            <p className="font-bold">{m.name}</p>
            <p className="text-sm text-slate-500">Value: {m.value.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
