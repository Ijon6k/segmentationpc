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
import { AlertCircle, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-secondary-bg flex flex-col font-sans pb-16">
      <AppHeader />

      <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6 flex flex-col justify-start">
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
            <div className="w-full flex flex-col gap-6 items-center">
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
            <div className="w-full flex flex-col gap-6 items-center">
              <div className="text-center max-w-md mb-2">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Citra Workspace Terpilih
                </h2>
                <p className="text-sm text-muted-text mt-1">
                  {isLoading ? "Menjalankan algoritma visi komputer..." : "Analisis berhasil diselesaikan!"}
                </p>
              </div>

              <UploadPreview file={selectedFile} onClear={handleClearImage} />

              {/* Skeletons for Results Area while Loading */}
              {isLoading && (
                <div className="w-full flex flex-col gap-10 mt-8">
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
                <PreprocessingGrid
                  grayscale={result.preprocessing.grayscale}
                  gaussianBlur={result.preprocessing.gaussianBlur}
                />
              )}

              {/* Segmentation Grid Output */}
              {result && !isLoading && (
                <SegmentationGrid
                  segmentation={result.segmentation}
                  metrics={result.metrics}
                />
              )}

              {/* Performance Table Output */}
              {result && !isLoading && (
                <ComparisonTable metrics={result.metrics} />
              )}

              {/* Recommendation Analysis Output */}
              {result && !isLoading && (
                <AnalysisCard analysis={result.analysis} />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

