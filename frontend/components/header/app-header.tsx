import React from "react";

export function AppHeader() {
  return (
    <header className="w-full border-b border-border-custom bg-background py-5 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background font-semibold text-sm tracking-wider">
          IS
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">
          Image Segmentation Comparison
        </span>
      </div>
      <div className="text-xs tracking-wider uppercase font-medium text-muted-text hidden sm:block">
        Computer Vision Lab
      </div>
    </header>
  );
}
