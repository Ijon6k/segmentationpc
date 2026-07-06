import React from "react";

export function AppHeader() {
  return (
    <header className="w-full border-b border-border-custom bg-background/80 backdrop-blur-sm py-5 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40">
      <span className="font-semibold text-lg tracking-tight text-foreground">
        Perbandingan Segmentasi Citra
      </span>
      <div className="flex items-center gap-3">
        <div className="h-4 w-px bg-accent/30 hidden sm:block" />
        <span className="text-xs tracking-wider uppercase font-medium text-accent-foreground hidden sm:block">
          Pengolahan Citra
        </span>
      </div>
    </header>
  );
}
