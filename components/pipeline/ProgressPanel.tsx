"use client";
import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import type { PipelineEvent } from '@/lib/sse';
import { cn } from '@/lib/utils';

// Stage IDs MUST match what orchestrator.py emits in PipelineEvent.stage
const STAGES = [
  { id: 'pacing', label: 'Computing pacing' },
  { id: 'understanding', label: 'Understanding chapter' },
  { id: 'rewriter', label: 'Rewriting in original prose' },
  { id: 'script', label: 'Writing Hinglish script' },
  { id: 'scene_planner', label: 'Planning visual scenes' },
  { id: 'veo_prompts_quiz', label: 'Visual prompts + quiz' },
];

export function ProgressPanel({
  events,
  elapsedSeconds,
}: {
  events: PipelineEvent[];
  elapsedSeconds: number;
}) {
  const stageState: Record<string, 'pending' | 'running' | 'completed'> = {};
  STAGES.forEach((s) => (stageState[s.id] = 'pending'));
  for (const e of events) {
    if (!e.stage) continue;
    if (e.type === 'stage_started') stageState[e.stage] = 'running';
    if (e.type === 'stage_completed') stageState[e.stage] = 'completed';
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-neutral-200">Generating script</h3>
        <span className="text-xs text-neutral-500 tabular-nums">{elapsedSeconds.toFixed(1)}s elapsed</span>
      </div>
      <div className="space-y-3">
        {STAGES.map((stage) => {
          const state = stageState[stage.id];
          const completedEvent = [...events]
            .reverse()
            .find((e) => e.stage === stage.id && e.type === 'stage_completed');
          return (
            <motion.div
              key={stage.id}
              animate={{ opacity: state === 'pending' ? 0.45 : 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {state === 'completed' && <Check className="w-4 h-4 text-emerald-400" />}
                {state === 'running' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                {state === 'pending' && <Circle className="w-3 h-3 text-neutral-600" />}
              </div>
              <span className={cn('text-sm', state === 'pending' ? 'text-neutral-500' : 'text-neutral-200')}>
                {stage.label}
              </span>
              {completedEvent?.message && (
                <span className="text-xs text-neutral-500 italic ml-2 truncate">
                  — {completedEvent.message}
                </span>
              )}
              {completedEvent?.duration_seconds != null && (
                <span className="ml-auto text-xs text-neutral-600 tabular-nums">
                  {completedEvent.duration_seconds.toFixed(1)}s
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}