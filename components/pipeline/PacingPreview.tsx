"use client";
import { motion } from "framer-motion";
import { Clock, Film, Layers, Mic } from "lucide-react";
import type { PacingEstimate } from "@/lib/types";

type Props = {
  pacing: PacingEstimate;
  duration: number;
};

export function PacingPreview({ pacing, duration }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon={<Film className="w-4 h-4" />} label="Scenes" value={pacing.scene_count} />
        <Stat icon={<Mic className="w-4 h-4" />} label="Narration" value={`${pacing.narration_words} words`} />
        <Stat icon={<Clock className="w-4 h-4" />} label="Per scene" value={`~${pacing.avg_scene_seconds}s`} />
        <Stat icon={<Layers className="w-4 h-4" />} label="Depth" value={pacing.depth} />
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-400">
        A {duration}-minute video at <span className="text-neutral-200 font-medium">{pacing.pacing_style}</span> pace.
        Longer durations get richer narration, more analogies, and deeper storytelling.
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-neutral-500">
        {icon}
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <motion.div
        key={String(value)}
        initial={{ opacity: 0.3, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="text-lg font-semibold text-white mt-1 capitalize"
      >
        {value}
      </motion.div>
    </div>
  );
}