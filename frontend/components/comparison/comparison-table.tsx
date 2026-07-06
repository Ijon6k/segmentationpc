import React from "react";
import { MetricItem } from "../../types/api";

interface ComparisonTableProps {
  metrics: MetricItem[];
}

export function ComparisonTable({ metrics }: ComparisonTableProps) {
  const fastest = [...metrics].reduce((prev, current) => 
    prev.executionTimeMs < current.executionTimeMs ? prev : current
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Metrik Performa & Waktu Pemrosesan
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Evaluasi Komparasi
        </span>
      </div>

      <div className="border border-border-custom rounded-md overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-bg border-b border-border-custom text-xs font-semibold uppercase tracking-wider text-muted-text">
                <th className="py-4 px-6">Algoritma</th>
                <th className="py-4 px-6 text-right">Waktu Eksekusi</th>
                <th className="py-4 px-6">Detail Performa & Cara Kerja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom text-sm">
              {metrics.map((metric) => {
                const isFastest = metric.algorithm === fastest.algorithm;
                return (
                  <tr key={metric.algorithm} className="hover:bg-secondary-bg/25 transition-colors">
                    <td className="py-4 px-6 font-medium text-foreground">
                      {metric.algorithm}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className={isFastest ? "text-green-600 font-semibold" : "text-foreground"}>
                          {metric.executionTimeMs.toFixed(3)} ms
                        </span>
                        {isFastest && (
                          <span className="bg-green-50 border border-green-200 text-green-700 text-[9px] font-medium px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Tercepat
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-text text-xs leading-relaxed max-w-md">
                      {metric.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
