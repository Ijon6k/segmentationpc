import React from "react";
import { SegmentationSchema, MetricItem } from "../../types/api";

interface AlgorithmInfo {
  key: string;
  name: string;
  description: string;
}

const ALGORITHMS: AlgorithmInfo[] = [
  {
    key: "threshold",
    name: "Global Threshold",
    description: "Converts grayscale to binary using a static intensity cutoff (127).",
  },
  {
    key: "adaptiveThreshold",
    name: "Adaptive Threshold",
    description: "Calculates thresholds locally for small pixel neighborhoods.",
  },
  {
    key: "otsu",
    name: "Otsu's Thresholding",
    description: "Calculates threshold automatically by minimizing class variance.",
  },
  {
    key: "regionGrowing",
    name: "Region Growing",
    description: "Groups pixels with similar intensities starting from seed points.",
  },
  {
    key: "watershed",
    name: "Watershed Segmentation",
    description: "Treats grayscale image as topography, flooding from marker seeds.",
  },
  {
    key: "kmeans",
    name: "K-Means Clustering",
    description: "Partitions pixels into K color/intensity cluster segments.",
  },
];

interface SegmentationGridProps {
  segmentation: SegmentationSchema;
  metrics: MetricItem[];
}

export function SegmentationGrid({ segmentation, metrics }: SegmentationGridProps) {
  const getMetric = (name: string) => {
    return metrics.find(
      (m) => m.algorithm.toLowerCase() === name.toLowerCase() ||
             (name === "threshold" && m.algorithm === "Threshold") ||
             (name === "adaptiveThreshold" && m.algorithm === "Adaptive Threshold") ||
             (name === "otsu" && m.algorithm === "Otsu") ||
             (name === "regionGrowing" && m.algorithm === "Region Growing") ||
             (name === "watershed" && m.algorithm === "Watershed") ||
             (name === "kmeans" && m.algorithm === "K-Means")
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Segmentation Results
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Algorithm Comparison
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALGORITHMS.map((algo) => {
          const imageSrc = segmentation[algo.key as keyof SegmentationSchema];
          const metric = getMetric(algo.key);
          const isPlaceholder = false;

          return (
            <div
              key={algo.key}
              className="bg-background border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-foreground/20 transition-all duration-200"
            >
              <div className="p-4 border-b border-border-custom bg-secondary-bg flex items-center justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{algo.name}</h4>
                  <p className="text-[10px] text-muted-text mt-0.5 truncate" title={algo.description}>
                    {algo.description}
                  </p>
                </div>
                {metric && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                    isPlaceholder
                      ? "bg-slate-50 border-slate-200/60 text-slate-400 text-[9px] italic"
                      : "bg-foreground/5 border-foreground/10 text-foreground font-semibold"
                  }`}>
                    {isPlaceholder ? "placeholder" : `${metric.executionTimeMs} ms`}
                  </span>
                )}
              </div>
              <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center h-[220px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={`${algo.name} Mask`}
                  className={`max-h-[180px] w-auto h-auto object-contain rounded-lg border border-border-custom bg-white shadow-sm transition-all duration-300 ${
                    isPlaceholder ? "opacity-40 grayscale" : "opacity-100"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
