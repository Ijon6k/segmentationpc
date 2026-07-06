import React from "react";
import { X, Image as ImageIcon, ZoomIn } from "lucide-react";

interface UploadPreviewProps {
  file: File;
  onClear: () => void;
  onZoom: (src: string) => void;
}

export function UploadPreview({ file, onClear, onZoom }: UploadPreviewProps) {
  const imageUrl = URL.createObjectURL(file);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-background border border-border-custom rounded-md overflow-hidden">
      <div className="p-4 border-b border-border-custom bg-secondary-bg flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground/80">
          <ImageIcon className="w-4 h-4 text-muted-text" />
          <span className="text-sm font-medium truncate max-w-xs md:max-w-md">
            {file.name}
          </span>
          <span className="text-xs text-muted-text bg-background border border-border-custom px-2 py-0.5 rounded-full">
            {formatFileSize(file.size)}
          </span>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded-sm border border-border-custom bg-background hover:bg-secondary-bg hover:text-foreground text-muted-text transition-colors cursor-pointer"
          title="Hapus Gambar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-6 bg-secondary-bg/25 flex justify-center items-center max-h-[400px] overflow-hidden">
        <div 
          onClick={() => onZoom(imageUrl)}
          className="relative group cursor-zoom-in overflow-hidden rounded-md border border-border-custom bg-white shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Upload Preview"
            className="max-h-[350px] w-auto h-auto object-contain"
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
}
