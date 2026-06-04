"use client";
import { useEffect, useState } from 'react';
import { ChevronDown, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModelOverrides } from '@/lib/types';

// Curated model list — edit when new models drop
const AVAILABLE_MODELS = [
  { id: '',                                  label: 'Default (.env)',    tier: 'auto'    },
  { id: 'google/gemini-2.5-flash',           label: 'Gemini 2.5 Flash',  tier: 'fast'    },
  { id: 'google/gemini-2.5-pro',             label: 'Gemini 2.5 Pro',    tier: 'premium' },
  { id: 'anthropic/claude-haiku-4.5',        label: 'Claude Haiku 4.5',  tier: 'fast'    },
  { id: 'anthropic/claude-sonnet-4.6',       label: 'Claude Sonnet 4.6', tier: 'premium' },
  { id: 'anthropic/claude-opus-4.7',         label: 'Claude Opus 4.7',   tier: 'topmost' },
] as const;

const STAGES = [
  { key: 'understanding',  label: 'Understanding',  hint: 'Chapter analysis, art style, characters' },
  { key: 'rewriter',       label: 'Rewriter',       hint: 'Prose conversion (low-stakes)' },
  { key: 'script',         label: 'Script',         hint: 'Storytelling — voice quality matters' },
  { key: 'scene_planner',  label: 'Scene Planner',  hint: '8-sec scene breakdown' },
  { key: 'visual_prompt',  label: 'Veo Prompts',    hint: 'Consistency-critical — Claude recommended' },
  { key: 'quiz',           label: 'Quiz',           hint: 'MCQs + flashcards' },
] as const;

// Sensible default per stage (what auto-selects on first visit)
const SUGGESTED: Record<string, string> = {
  understanding: 'google/gemini-2.5-flash',
  rewriter:      'google/gemini-2.5-flash',
  script:        'google/gemini-2.5-pro',
  scene_planner: 'google/gemini-2.5-flash',
  visual_prompt: 'anthropic/claude-sonnet-4.6',
  quiz:          'google/gemini-2.5-flash',
};

const STORAGE_KEY = 'edu-video-model-overrides-v1';

const TIER_STYLES: Record<string, string> = {
  auto:    'bg-neutral-700/40 text-neutral-400',
  fast:    'bg-emerald-500/15 text-emerald-300',
  premium: 'bg-indigo-500/15 text-indigo-300',
  topmost: 'bg-amber-500/15 text-amber-300',
};

type Props = {
  value: ModelOverrides;
  onChange: (next: ModelOverrides) => void;
};

export function ModelSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        onChange(parsed);
      } else {
        // First visit — apply suggested defaults
        onChange(SUGGESTED);
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch { /* ignore */ }
  }, [value]);

  function setStage(key: string, modelId: string) {
    onChange({ ...value, [key]: modelId });
  }

  function resetToSuggested() {
    onChange({ ...SUGGESTED });
  }

  function modelById(id: string) {
    return AVAILABLE_MODELS.find(m => m.id === id) ?? AVAILABLE_MODELS[0];
  }

  // Header summary: count of non-default selections
  const nonDefaultCount = Object.values(value).filter(v => v && v !== '').length;

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 flex items-center gap-2 hover:bg-white/[0.03] transition-colors text-left"
      >
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span className="text-sm font-medium text-neutral-200">Models per stage</span>
        <span className="text-xs text-neutral-500 ml-2">
          {nonDefaultCount > 0 ? `${nonDefaultCount} customized` : 'using defaults'}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-500 ml-auto transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="border-t border-white/10 p-3 space-y-2">
          {STAGES.map(stage => {
            const selectedId = value[stage.key] ?? '';
            const selectedModel = modelById(selectedId);
            return (
              <div key={stage.key} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                <div className="min-w-0">
                  <div className="text-sm text-neutral-200">{stage.label}</div>
                  <div className="text-[11px] text-neutral-500 truncate">{stage.hint}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded',
                      TIER_STYLES[selectedModel.tier],
                    )}
                  >
                    {selectedModel.tier === 'auto' ? 'auto' : selectedModel.tier}
                  </span>
                  <select
                    value={selectedId}
                    onChange={e => setStage(stage.key, e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded px-2 py-1.5 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500 min-w-[180px]"
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}

          <button
            onClick={resetToSuggested}
            className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to suggested
          </button>
        </div>
      )}
    </div>
  );
}