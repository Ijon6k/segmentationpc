import React from "react";
import { SegmentationSchema, MetricItem } from "../../types/api";
import { ZoomIn } from "lucide-react";

interface AlgorithmInfo {
  key: string;
  name: string;
  description: string;
}

const ALGORITHMS: AlgorithmInfo[] = [
  {
    key: "threshold",
    name: "Global Threshold",
    description: "Mengubah grayscale menjadi biner menggunakan batas intensitas tetap (127).",
  },
  {
    key: "adaptiveThreshold",
    name: "Adaptive Threshold",
    description: "Menghitung batas ambang secara lokal untuk setiap area kecil piksel.",
  },
  {
    key: "otsu",
    name: "Otsu's Thresholding",
    description: "Mencari ambang batas optimal otomatis berdasarkan varians histogram.",
  },
  {
    key: "regionGrowing",
    name: "Region Growing",
    description: "Mengelompokkan piksel dengan intensitas serupa mulai dari koordinat benih pusat.",
  },
  {
    key: "watershed",
    name: "Watershed Segmentation",
    description: "Segmentasi topologi morfologi dengan menandai batas gradien gambar.",
  },
  {
    key: "kmeans",
    name: "K-Means Clustering",
    description: "Mengelompokkan warna piksel menjadi K=3 segmen wilayah warna utama.",
  },
];

interface SegmentationGridProps {
  segmentation: SegmentationSchema;
  metrics: MetricItem[];
  onZoom: (src: string, title: string) => void;
}

export function SegmentationGrid({ segmentation, metrics, onZoom }: SegmentationGridProps) {
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
          Hasil Segmentasi Citra
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Komparasi Algoritma
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
              className="bg-background border border-border-custom rounded-md overflow-hidden flex flex-col hover:border-foreground/20 transition-all duration-200"
            >
              <div className="p-4 border-b border-border-custom bg-secondary-bg flex items-center justify-between gap-2">
                <div className="flex flex-col min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{algo.name}</h4>
                  <p className="text-[10px] text-muted-text mt-0.5 truncate" title={algo.description}>
                    {algo.description}
                  </p>
                </div>
                {metric && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border shrink-0 ${
                    isPlaceholder
                      ? "bg-slate-50 border-slate-200/60 text-slate-400 text-[9px] italic"
                      : "bg-foreground/5 border-foreground/10 text-foreground font-semibold"
                  }`}>
                    {isPlaceholder ? "placeholder" : `${metric.executionTimeMs} ms`}
                  </span>
                )}
              </div>
              <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center h-[220px] overflow-hidden">
                <div 
                  onClick={() => onZoom(imageSrc, algo.name)}
                  className="relative group cursor-zoom-in overflow-hidden rounded-md border border-border-custom bg-white shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={`${algo.name} Mask`}
                    className={`max-h-[180px] w-auto h-auto object-contain transition-all duration-300 ${
                      isPlaceholder ? "opacity-40 grayscale" : "opacity-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
                    <span className="text-white text-xs font-medium bg-black/60 px-3 py-1.5 rounded-sm flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5" />
                      Click to Zoom
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
