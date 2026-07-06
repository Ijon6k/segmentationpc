import React from "react";
import { Layers } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full border-b border-border-custom bg-background py-5 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center text-background shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">
          Perbandingan Segmentasi Citra
        </span>
      </div>
      <div className="text-xs tracking-wider uppercase font-medium text-muted-text hidden sm:block">
        Pengolahan Citra
      </div>
    </header>
  );
}
