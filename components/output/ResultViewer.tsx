"use client";
import { useState } from 'react';
import { ScriptViewer } from './ScriptViewer';
import { SceneTimeline } from './SceneTimeline';
import { QuizPanel } from './QuizPanel';
import { ExportButtons } from './ExportButtons';
import type { FullGenerationResult } from '@/lib/types';
import { cn } from '@/lib/utils';

type Tab = 'script' | 'scenes' | 'quiz';

export function ResultViewer({ result }: { result: FullGenerationResult }) {
  const [tab, setTab] = useState<Tab>('script');

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 text-xs text-neutral-500 flex-wrap">
        <div className="flex items-center gap-3">
          <span>{result.word_count} words</span>
          <span>·</span>
          <span>{result.scenes.length} scenes</span>
          <span>·</span>
          <span>{result.timings.total_seconds.toFixed(1)}s to generate</span>
        </div>
        <ExportButtons result={result} />
      </div>

      <div className="flex gap-1 mb-6 border-b border-white/10">
        {(
          [
            ['script', 'Script'],
            ['scenes', `Scenes (${result.scenes.length})`],
            ['quiz', 'Quiz & Notes'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2',
              tab === id
                ? 'border-indigo-400 text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'script' && <ScriptViewer script={result.script} />}
      {tab === 'scenes' && (
                        <SceneTimeline
                        scenes={result.scenes}
                        artStyle={result.understanding.art_style}
                        characterDesigns={result.understanding.character_designs}
                    />
                )}
      {tab === 'quiz' && (
        <QuizPanel
          mcqs={result.quiz.mcqs}
          revisionNotes={result.quiz.revision_notes}
          flashcards={result.quiz.flashcards}
        />
      )}
    </div>
  );
}