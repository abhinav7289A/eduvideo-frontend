"use client";
import { useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, FileText, Loader2, Upload } from "lucide-react";
import { analyzePdf } from "@/lib/api";
import type { DocumentAnalysis } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  onAnalyzed: (result: DocumentAnalysis) => void;
};

export function UploadCard({ onAnalyzed }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    setIsUploading(true);
    setFileName(file.name);
    try {
      const result = await analyzePdf(file);
      onAnalyzed(result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Upload failed";
      setError(msg);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all",
          "flex flex-col items-center justify-center text-center min-h-[140px]",
          isDragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-white/10 hover:border-white/30 hover:bg-white/[0.03]",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
              <p className="text-sm text-neutral-300 mt-2">Analyzing chapters…</p>
              <p className="text-xs text-neutral-500 mt-1 truncate max-w-[200px]">{fileName}</p>
            </motion.div>
          ) : fileName && !error ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <FileText className="w-7 h-7 text-emerald-400" />
              <p className="text-sm text-neutral-200 mt-2 truncate max-w-[220px] font-medium">{fileName}</p>
              <p className="text-xs text-neutral-500 mt-1">Click to replace</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Upload className="w-7 h-7 text-neutral-400" />
              <p className="text-sm text-neutral-300 mt-2 font-medium">Drop a textbook PDF</p>
              <p className="text-xs text-neutral-500 mt-1">or click to browse</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}