import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadDropzoneProps {
  onImageSelected: (file: File) => void;
  onError: (errorMsg: string) => void;
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
      className={`w-full max-w-2xl mx-auto flex flex-col items-center justify-center border-2 border-dashed rounded-md p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-foreground bg-secondary-bg scale-[0.99]"
          : "border-border-custom hover:border-foreground/40 hover:bg-secondary-bg/50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        className="hidden"
        onChange={handleChange}
      />
      <div className="w-12 h-12 rounded-full bg-secondary-bg border border-border-custom flex items-center justify-center mb-4 text-foreground/75">
        <Upload className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">
        Unggah Gambar
      </h3>
      <p className="text-sm text-muted-text mb-4 max-w-sm">
        Seret dan lepas gambar Anda di sini, atau klik untuk mencari berkas dari komputer.
      </p>
      <div className="text-xs text-muted-text/80 bg-secondary-bg border border-border-custom px-3 py-1.5 rounded-md">
        Mendukung PNG, JPG, JPEG (Maks. 10MB)
      </div>
    </div>
  );
}
