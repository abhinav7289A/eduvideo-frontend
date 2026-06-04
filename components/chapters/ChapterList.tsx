"use client";
import { motion } from "framer-motion";
import type { Chapter } from "@/lib/types";
import { cleanChapterTitle } from "@/lib/titleClean";
import { cn } from "@/lib/utils";

type Props = {
  chapters: Chapter[];
  selectedNumber?: number;
  onSelect: (chapter: Chapter) => void;
};

export function ChapterList({ chapters, selectedNumber, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Chapters
        </h2>
        <span className="text-xs text-neutral-500">{chapters.length}</span>
      </div>
      <ul className="space-y-1">
        {chapters.map((chapter, i) => {
          const isSelected = chapter.chapter_number === selectedNumber;
          return (
            <motion.li
              key={chapter.chapter_number}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025 }}
            >
              <button
                onClick={() => onSelect(chapter)}
                className={cn(
                  "w-full text-left rounded-lg p-2.5 transition-colors group",
                  isSelected
                    ? "bg-indigo-500/15 ring-1 ring-indigo-500/40"
                    : "hover:bg-white/[0.04]",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "flex-shrink-0 w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center mt-0.5",
                      isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700",
                    )}
                  >
                    {chapter.chapter_number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-white" : "text-neutral-300",
                      )}
                    >
                      {cleanChapterTitle(chapter.title)}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Pages {chapter.start_page}–{chapter.end_page} · {chapter.page_count}p
                    </p>
                  </div>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}