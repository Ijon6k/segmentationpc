import React from "react";
import { AnalysisSchema } from "../../types/api";
import { Award, TrendingUp, TrendingDown, Timer, FileText } from "lucide-react";

interface AnalysisCardProps {
  analysis: AnalysisSchema;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <div className="w-full mt-12 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Analisis Hasil Segmentasi
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Analisis Hasil
        </span>
      </div>

      {/* Best Algorithm & Reason */}
      <div className="bg-background border border-border-custom rounded-md p-6 flex flex-col md:flex-row gap-5 items-start">
        <div className="w-12 h-12 rounded-md bg-foreground flex items-center justify-center text-background shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
              Metode Direkomendasikan:
            </span>
            <span className="text-xs font-bold text-foreground bg-secondary-bg border border-border-custom px-2.5 py-0.5 rounded-sm">
              {analysis.bestAlgorithm}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed font-normal">
            {analysis.reason}
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-background border border-border-custom rounded-md p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
              Strengths
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-sm text-foreground/80 leading-relaxed flex gap-2">
                <span className="text-emerald-500 shrink-0 mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-background border border-border-custom rounded-md p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
              Weaknesses
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {analysis.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-foreground/80 leading-relaxed flex gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">−</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Execution Summary */}
      <div className="bg-background border border-border-custom rounded-md p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-muted-text shrink-0" />
          <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
            Execution Summary
          </span>
        </div>
        <p className="text-sm text-foreground/70 font-mono leading-relaxed break-all">
          {analysis.executionSummary}
        </p>
      </div>

      {/* Conclusion */}
      <div className="bg-background border border-border-custom rounded-md p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-text shrink-0" />
          <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
            Conclusion
          </span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          {analysis.conclusion}
        </p>
      </div>
    </div>
  );
}
