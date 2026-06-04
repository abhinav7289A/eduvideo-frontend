"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { Flashcard, MCQItem } from '@/lib/types';
import { cn } from '@/lib/utils';

type Tab = 'mcq' | 'notes' | 'flashcards';

export function QuizPanel({
  mcqs,
  revisionNotes,
  flashcards,
}: {
  mcqs: MCQItem[];
  revisionNotes: string[];
  flashcards: Flashcard[];
}) {
  const [tab, setTab] = useState<Tab>('mcq');

  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-white/10">
        {(
          [
            ['mcq', `MCQs (${mcqs.length})`],
            ['notes', `Revision (${revisionNotes.length})`],
            ['flashcards', `Flashcards (${flashcards.length})`],
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

      {tab === 'mcq' && (
        <div className="space-y-3">
          {mcqs.map((q, i) => <MCQCard key={i} question={q} index={i} />)}
        </div>
      )}
      {tab === 'notes' && (
        <ul className="space-y-2.5">
          {revisionNotes.map((note, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex gap-3 text-sm text-neutral-200"
            >
              <span className="text-indigo-400 mt-0.5">▸</span>
              <span className="leading-relaxed">{note}</span>
            </motion.li>
          ))}
        </ul>
      )}
      {tab === 'flashcards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {flashcards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-lg border border-white/10 p-4 bg-white/[0.02]"
            >
              <div className="text-sm font-semibold text-indigo-300 mb-1">{card.term}</div>
              <div className="text-sm text-neutral-300 leading-relaxed">{card.definition}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function MCQCard({ question: q, index }: { question: MCQItem; index: number }) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border border-white/10 p-4 bg-white/[0.02]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm text-neutral-200 font-medium leading-relaxed">{q.question}</p>
        <span className={cn(
          'text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold flex-shrink-0',
          q.difficulty === 'easy' && 'bg-emerald-500/20 text-emerald-300',
          q.difficulty === 'medium' && 'bg-amber-500/20 text-amber-300',
          q.difficulty === 'hard' && 'bg-red-500/20 text-red-300',
        )}>
          {q.difficulty}
        </span>
      </div>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct_index;
          const isSelected = i === selected;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={revealed}
              className={cn(
                'w-full text-left rounded p-2.5 text-sm transition-colors flex items-center gap-2.5',
                !revealed && 'hover:bg-white/[0.04] text-neutral-300',
                revealed && isCorrect && 'bg-emerald-500/15 text-emerald-100',
                revealed && !isCorrect && isSelected && 'bg-red-500/15 text-red-100',
                revealed && !isCorrect && !isSelected && 'text-neutral-500',
              )}
            >
              <span className="font-mono text-xs text-neutral-500 flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {revealed && isCorrect && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              {revealed && !isCorrect && isSelected && <X className="w-4 h-4 text-red-400 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs text-neutral-400 italic border-l-2 border-l-white/10 pl-3 leading-relaxed"
        >
          {q.explanation}
        </motion.div>
      )}
    </motion.div>
  );
}