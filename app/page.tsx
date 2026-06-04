"use client";
import { useState } from "react";
import { UploadCard } from "@/components/upload/UploadCard";
import { ChapterList } from "@/components/chapters/ChapterList";
import { ChapterDetail } from "@/components/chapters/ChapterDetail";
import type { Chapter, DocumentAnalysis } from "@/lib/types";

export default function HomePage() {
  const [doc, setDoc] = useState<DocumentAnalysis | null>(null);
  const [selected, setSelected] = useState<Chapter | null>(null);

  function handleAnalyzed(result: DocumentAnalysis) {
    setDoc(result);
    setSelected(result.chapters[0] || null);
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-white/10 bg-neutral-950/60 backdrop-blur-xl p-6 overflow-y-auto max-h-screen">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            EduVideo
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Textbook → script generator
          </p>
        </div>

        <div className="mt-6">
          <UploadCard onAnalyzed={handleAnalyzed} />
        </div>

        {doc && (
          <>
            <div className="mt-5 rounded-lg bg-white/[0.03] border border-white/5 p-3 text-[11px] text-neutral-400 leading-relaxed">
              {doc.detection_summary}
              <div className="mt-1 text-neutral-500">
                {doc.total_pages} pages · {doc.has_toc ? "has TOC" : "no embedded TOC"}
              </div>
            </div>

            <div className="mt-6">
              <ChapterList
                chapters={doc.chapters}
                selectedNumber={selected?.chapter_number}
                onSelect={setSelected}
              />
            </div>
          </>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {!doc && <EmptyState />}
        {doc && selected && <ChapterDetail chapter={selected} document={doc} />}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-neutral-200">Upload a textbook to begin</h2>
        <p className="mt-2 text-neutral-500 leading-relaxed">
          Drop a PDF on the left — we'll auto-detect chapters. Pick a chapter and a target
          video duration to see the script pacing plan, then generate.
        </p>
      </div>
    </div>
  );
}