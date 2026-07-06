import React from "react";

interface PreprocessingGridProps {
  grayscale: string;
  gaussianBlur: string;
}

export function PreprocessingGrid({ grayscale, gaussianBlur }: PreprocessingGridProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Pre-processing Pipeline
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Phase 4 Output
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grayscale Card */}
        <div className="bg-background border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border-custom bg-secondary-bg">
            <h4 className="text-sm font-semibold text-foreground">1. Grayscale Conversion</h4>
            <p className="text-xs text-muted-text mt-0.5">Removes chromatic noise, reducing dimensions to 1-channel intensity.</p>
          </div>
          <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center max-h-[300px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={grayscale}
              alt="Grayscale Result"
              className="max-h-[250px] w-auto h-auto object-contain rounded-lg border border-border-custom bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Gaussian Blur Card */}
        <div className="bg-background border border-border-custom rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border-custom bg-secondary-bg">
            <h4 className="text-sm font-semibold text-foreground">2. Gaussian Blur (5x5 Kernel)</h4>
            <p className="text-xs text-muted-text mt-0.5">Applies smoothing to reduce high-frequency detail and edge noise.</p>
          </div>
          <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center max-h-[300px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gaussianBlur}
              alt="Gaussian Blur Result"
              className="max-h-[250px] w-auto h-auto object-contain rounded-lg border border-border-custom bg-white shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
