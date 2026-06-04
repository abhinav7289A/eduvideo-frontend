"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, RotateCcw, Sparkles, X } from 'lucide-react';
import { DurationSelector } from '@/components/duration/DurationSelector';
import { ModelSelector } from '@/components/duration/ModelSelector';
import { PacingPreview } from '@/components/pipeline/PacingPreview';
import { ProgressPanel } from '@/components/pipeline/ProgressPanel';
import { ResultViewer } from '@/components/output/ResultViewer';
import { streamGeneration, type PipelineEvent } from '@/lib/sse';
import type {
  Chapter,
  DocumentAnalysis,
  FullGenerationResult,
  ModelOverrides,
} from '@/lib/types';
import { estimatePacing } from '@/lib/pacing';
import { cleanChapterTitle } from '@/lib/titleClean';

type Props = {
  chapter: Chapter;
  document: DocumentAnalysis;
};

export function ChapterDetail({ chapter, document: doc }: Props) {
  const [duration, setDuration] = useState<number>(5);
  const [modelOverrides, setModelOverrides] = useState<ModelOverrides>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [events, setEvents] = useState<PipelineEvent[]>([]);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [result, setResult] = useState<FullGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const pacing = useMemo(
    () => estimatePacing(duration, chapter.page_count),
    [duration, chapter.page_count],
  );

  // Reset everything when switching chapters (model overrides persist via localStorage)
  useEffect(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setIsGenerating(false);
    setEvents([]);
    setElapsedSec(0);
    setResult(null);
    setError(null);
  }, [chapter.chapter_number]);

  // Elapsed time ticker
  useEffect(() => {
    if (!isGenerating) return;
    const start = Date.now();
    const id = setInterval(() => setElapsedSec((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, [isGenerating]);

  function handleGenerate() {
    setIsGenerating(true);
    setEvents([]);
    setElapsedSec(0);
    setResult(null);
    setError(null);

    cleanupRef.current = streamGeneration(
      doc.doc_id,
      chapter.chapter_number,
      duration,
      {
        onEvent: (e) => setEvents((prev) => [...prev, e]),
        onComplete: (r) => {
          setResult(r as FullGenerationResult);
          setIsGenerating(false);
          cleanupRef.current = null;
        },
        onError: (msg) => {
          setError(msg);
          setIsGenerating(false);
          cleanupRef.current = null;
        },
      },
      modelOverrides,
    );
  }

  function handleReset() {
    cleanupRef.current?.();
    cleanupRef.current = null;
    setResult(null);
    setError(null);
    setEvents([]);
    setElapsedSec(0);
    setIsGenerating(false);
  }

  return (
    <motion.div
      key={chapter.chapter_number}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">
          Chapter {chapter.chapter_number}
        </p>
        <h1 className="text-3xl font-bold text-white mt-1 leading-tight">
          {cleanChapterTitle(chapter.title)}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-neutral-400 flex-wrap">
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            Pages {chapter.start_page}–{chapter.end_page} · {chapter.page_count} pages
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-neutral-500 uppercase tracking-wider">
            from {doc.filename}
          </span>
        </div>
      </div>

      {/* Setup view */}
      {!isGenerating && !result && !error && (
        <>
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-neutral-300 mb-3">Target video duration</h2>
            <DurationSelector value={duration} onChange={setDuration} />
          </section>

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-neutral-300 mb-3">Pacing preview</h2>
            <PacingPreview pacing={pacing} duration={duration} />
          </section>

          <section className="mb-8">
            <h2 className="text-sm font-semibold text-neutral-300 mb-3">Model selection</h2>
            <ModelSelector value={modelOverrides} onChange={setModelOverrides} />
          </section>

          <button
            onClick={handleGenerate}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-6 py-3.5 flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-indigo-500/20"
          >
            <Sparkles className="w-4 h-4" />
            Generate script
          </button>
        </>
      )}

      {/* Progress view */}
      {isGenerating && <ProgressPanel events={events} elapsedSeconds={elapsedSec} />}

      {/* Error view */}
      {error && !isGenerating && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-red-300">Generation failed</h3>
            <button
              onClick={handleReset}
              className="p-1 text-neutral-500 hover:text-neutral-300"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-red-200/90 mb-4 leading-relaxed">{error}</p>
          <button
            onClick={handleGenerate}
            className="rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-200 text-sm px-4 py-2 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Result view */}
      {result && (
        <div>
          <div className="mb-4 flex items-center justify-end">
            <button
              onClick={handleReset}
              className="text-xs flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
          <ResultViewer result={result} />
        </div>
      )}
    </motion.div>
  );
}