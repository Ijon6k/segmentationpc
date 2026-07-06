"use client";

import React, { useState } from "react";
import { AppHeader } from "@/components/header/app-header";
import { UploadDropzone } from "@/components/upload/upload-dropzone";
import { UploadPreview } from "@/components/upload/upload-preview";
import { PreprocessingGrid } from "@/components/preprocessing/preprocessing-grid";
import { SegmentationGrid } from "@/components/segmentation/segmentation-grid";
import { ComparisonTable } from "@/components/comparison/comparison-table";
import { AnalysisCard } from "@/components/analysis/analysis-card";
import { useSegmentation } from "@/hooks/use-segmentation";
import { AlertCircle, Loader2, X } from "lucide-react";

function SkeletonCard({ height = "180px" }: { height?: string }) {
  return (
    <div className="bg-background border border-border-custom rounded-md p-4 animate-pulse flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <div className="h-4 bg-foreground/10 rounded w-1/3"></div>
        <div className="h-3 bg-foreground/5 rounded w-2/3"></div>
      </div>
      <div 
        className="w-full bg-foreground/5 rounded-md border border-border-custom flex items-center justify-center text-muted-text/30"
        style={{ height }}
      >
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [zoomImage, setZoomImage] = useState<{ src: string; title: string } | null>(null);
  
  const {
    isLoading,
    error,
    result,
    triggerSegmentation,
    reset
  } = useSegmentation();

  const handleImageSelected = (file: File) => {
    setSelectedFile(file);
    triggerSegmentation(file);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    reset();
  };

  return (
    <div className="relative min-h-screen bg-secondary-bg flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-accent-subtle/60" aria-hidden="true" />
      <AppHeader />

      <main className="relative flex-1 w-full max-w-[1600px] mx-auto py-12 px-6 lg:px-8 flex flex-col justify-start">
        {error && (
          <div className="w-full max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Kesalahan Pemrosesan</h4>
              <p className="text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="w-full py-8 flex flex-col items-center justify-center">
          {!selectedFile ? (
            <div className="w-full flex flex-col gap-6 items-center animate-fade-in-up">
              <div className="text-center max-w-md mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Pilih gambar untuk dianalisis
                </h2>
                <p className="text-sm text-muted-text mt-1">
                  Unggah citra digital untuk memproses segmentasi menggunakan 6 algoritma berbeda.
                </p>
              </div>
              <UploadDropzone
                onImageSelected={handleImageSelected}
                onError={(msg) => alert(msg)}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col gap-6 items-center animate-fade-in-up">
              <div className="text-center max-w-md mb-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Citra Workspace Terpilih
                </h2>
                <p className="text-sm text-muted-text mt-1">
                  {isLoading ? "Menjalankan algoritma visi komputer..." : "Analisis berhasil diselesaikan!"}
                </p>
              </div>

              <UploadPreview 
                file={selectedFile} 
                onClear={handleClearImage} 
                onZoom={(src) => setZoomImage({ src, title: "Citra Asli" })}
              />

              {/* Skeletons for Results Area while Loading */}
              {isLoading && (
                <div className="w-full flex flex-col gap-10 mt-8 animate-fade-in-up">
                  <div className="flex flex-col gap-4">
                    <div className="h-6 bg-foreground/10 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SkeletonCard height="250px" />
                      <SkeletonCard height="250px" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="h-6 bg-foreground/10 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <SkeletonCard height="180px" />
                      <SkeletonCard height="180px" />
                      <SkeletonCard height="180px" />
                      <SkeletonCard height="180px" />
                      <SkeletonCard height="180px" />
                      <SkeletonCard height="180px" />
                    </div>
                  </div>
                </div>
              )}

              {/* Preprocessing Grid Output */}
              {result && !isLoading && (
                <div className="w-full animate-fade-in-up" style={{ animationDelay: "0ms" }}>
                  <PreprocessingGrid
                    grayscale={result.preprocessing.grayscale}
                    gaussianBlur={result.preprocessing.gaussianBlur}
                    onZoom={(src, title) => setZoomImage({ src, title })}
                  />
                </div>
              )}

              {/* Segmentation Grid Output */}
              {result && !isLoading && (
                <div className="w-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                  <SegmentationGrid
                    segmentation={result.segmentation}
                    metrics={result.metrics}
                    onZoom={(src, title) => setZoomImage({ src, title })}
                  />
                </div>
              )}

              {/* Performance Table Output */}
              {result && !isLoading && (
                <div className="w-full animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                  <ComparisonTable metrics={result.metrics} />
                </div>
              )}

              {/* Recommendation Analysis Output */}
              {result && !isLoading && (
                <div className="w-full animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                  <AnalysisCard analysis={result.analysis} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Centralized Zoom Modal Overlay */}
      {zoomImage && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in-up"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="bg-background border border-border-custom rounded-md overflow-hidden max-w-4xl w-full flex flex-col cursor-default shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border-custom bg-gradient-to-r from-accent-subtle to-secondary-bg flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {zoomImage.title}
                </span>
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="p-1 rounded-sm border border-border-custom bg-background hover:bg-accent-subtle hover:text-accent-foreground text-muted-text transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 bg-gradient-to-b from-accent-subtle/20 to-secondary-bg/25 flex justify-center items-center max-h-[75vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomImage.src}
                alt={zoomImage.title}
                className="max-h-[65vh] w-auto h-auto object-contain rounded-md border border-border-custom bg-white shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

