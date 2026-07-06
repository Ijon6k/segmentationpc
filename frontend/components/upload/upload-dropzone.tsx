import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  onImageSelected: (file: File) => void;
  onError: (errorMsg: string) => void;
}

function SegmentationSvg() {
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#7dd3fc" strokeWidth="0.5" strokeOpacity="0.08" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="240" height="160" fill="url(#grid)" />

      <g opacity="0.04">
        <rect x="32" y="28" width="56" height="44" rx="4" fill="#7dd3fc" />
        <rect x="100" y="28" width="44" height="56" rx="4" fill="#38bdf8" />
        <rect x="156" y="36" width="48" height="36" rx="4" fill="#7dd3fc" />
        <rect x="24" y="88" width="48" height="44" rx="4" fill="#38bdf8" />
        <rect x="88" y="92" width="64" height="36" rx="4" fill="#7dd3fc" />
        <rect x="168" y="84" width="48" height="52" rx="4" fill="#38bdf8" />
      </g>

      <g opacity="0.03">
        <path d="M0 80 L240 80" stroke="#7dd3fc" strokeWidth="0.5" strokeDasharray="4 4" />
        <path d="M120 0 L120 160" stroke="#7dd3fc" strokeWidth="0.5" strokeDasharray="4 4" />
        <path d="M60 0 L60 160" stroke="#7dd3fc" strokeWidth="0.5" strokeDasharray="2 6" />
        <path d="M180 0 L180 160" stroke="#7dd3fc" strokeWidth="0.5" strokeDasharray="2 6" />
      </g>
    </svg>
  );
}

export function UploadDropzone({ onImageSelected, onError }: UploadDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File | undefined) => {
    if (!file) return;

    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (!validExtensions.includes(file.type)) {
      onError("Unsupported file format. Please upload JPG, JPEG, or PNG.");
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      onError("File is too large. Maximum size allowed is 10 MB.");
      return;
    }

    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={onButtonClick}
      className={`relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center border-2 rounded-md p-12 text-center cursor-pointer transition-all duration-300 overflow-hidden ${
        isDragActive
          ? "border-accent bg-accent-subtle scale-[0.99]"
          : "border-dashed border-border-custom hover:border-accent/50 hover:bg-accent-subtle/40"
      }`}
    >
      <SegmentationSvg />

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={handleChange}
      />
      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
        isDragActive
          ? "bg-accent text-white scale-110"
          : "bg-accent-subtle border border-accent-border text-accent-foreground"
      }`}>
        <Upload className="w-5 h-5" />
      </div>
      <h3 className={`relative z-10 text-lg font-medium mb-1 transition-colors duration-300 ${
        isDragActive ? "text-accent-foreground" : "text-foreground"
      }`}>
        {isDragActive ? "Lepaskan gambar di sini" : "Unggah Gambar"}
      </h3>
      <p className="relative z-10 text-sm text-muted-text mb-4 max-w-sm">
        Seret dan lepas gambar Anda di sini, atau klik untuk mencari berkas dari komputer.
      </p>
      <div className={`relative z-10 text-xs px-3 py-1.5 rounded-md transition-all duration-300 ${
        isDragActive
          ? "bg-accent text-white"
          : "text-muted-text/80 bg-secondary-bg border border-border-custom"
      }`}>
        Mendukung PNG, JPG, JPEG (Maks. 10MB)
      </div>
    </div>
  );
}
