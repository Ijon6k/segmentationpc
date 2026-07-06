import React from "react";
import { AnalysisSchema } from "../../types/api";
import { Award } from "lucide-react";

interface AnalysisCardProps {
  analysis: AnalysisSchema;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Academic Recommendation
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Phase 8 Analysis
        </span>
      </div>

      <div className="bg-background border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start">
        <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center text-background shrink-0 shadow-sm">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-text uppercase tracking-wider">
              Recommended Method:
            </span>
            <span className="text-xs font-bold text-foreground bg-secondary-bg border border-border-custom px-2.5 py-0.5 rounded-md">
              {analysis.bestAlgorithm}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed font-normal">
            {analysis.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
