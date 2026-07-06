import React from "react";
import { ZoomIn } from "lucide-react";

interface PreprocessingGridProps {
  grayscale: string;
  gaussianBlur: string;
  onZoom: (src: string, title: string) => void;
}

export function PreprocessingGrid({ grayscale, gaussianBlur, onZoom }: PreprocessingGridProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col gap-6">
      <div className="border-b border-border-custom pb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Tahap Pra-pemrosesan (Pre-processing)
        </h3>
        <span className="text-xs text-muted-text font-medium uppercase tracking-wider bg-secondary-bg border border-border-custom px-2.5 py-1 rounded-md">
          Output Pra-proses
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grayscale Card */}
        <div className="bg-background border border-border-custom rounded-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-custom bg-secondary-bg">
            <h4 className="text-sm font-semibold text-foreground">1. Konversi Grayscale</h4>
            <p className="text-xs text-muted-text mt-0.5">Menghilangkan informasi warna, menyederhanakan data menjadi intensitas cahaya 1-channel.</p>
          </div>
          <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center max-h-[300px] overflow-hidden">
            <div 
              onClick={() => onZoom(grayscale, "Konversi Grayscale")}
              className="relative group cursor-zoom-in overflow-hidden rounded-md border border-border-custom bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={grayscale}
                alt="Hasil Grayscale"
                className="max-h-[250px] w-auto h-auto object-contain"
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

        {/* Gaussian Blur Card */}
        <div className="bg-background border border-border-custom rounded-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border-custom bg-secondary-bg">
            <h4 className="text-sm font-semibold text-foreground">2. Gaussian Blur (Kernel 5x5)</h4>
            <p className="text-xs text-muted-text mt-0.5">Menghaluskan gambar (smoothing) untuk mengurangi detail noise frekuensi tinggi.</p>
          </div>
          <div className="p-6 bg-secondary-bg/25 flex-1 flex justify-center items-center max-h-[300px] overflow-hidden">
            <div 
              onClick={() => onZoom(gaussianBlur, "Gaussian Blur (Kernel 5x5)")}
              className="relative group cursor-zoom-in overflow-hidden rounded-md border border-border-custom bg-white shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gaussianBlur}
                alt="Hasil Gaussian Blur"
                className="max-h-[250px] w-auto h-auto object-contain"
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
      </div>
    </div>
  );
}
