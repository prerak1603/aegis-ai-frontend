"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { motion } from "framer-motion";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

export default function UploadZone({
  onFileSelected,
  selectedFile,
  onClear,
  disabled,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected, disabled]
  );

  if (selectedFile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-xl border border-border-strong bg-surface px-5 py-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-5 h-5 text-signal shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-muted font-mono-num">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        {!disabled && (
          <button
            onClick={onClear}
            aria-label="Remove file"
            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`rounded-xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-colors
        ${isDragging ? "border-signal bg-signal/5" : "border-border-strong hover:border-text-faint"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
        }}
      />
      <UploadCloud className="w-8 h-8 mx-auto text-text-faint mb-3" strokeWidth={1.5} />
      <p className="text-sm text-text-primary font-medium">
        Drop a CICFlowMeter CSV here, or click to browse
      </p>
      <p className="text-xs text-text-muted mt-1">
        Network flow exports only · max file size enforced server-side
      </p>
    </div>
  );
}
