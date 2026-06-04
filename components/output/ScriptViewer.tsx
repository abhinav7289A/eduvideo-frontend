"use client";
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { Script } from '@/lib/types';

export function ScriptViewer({ script }: { script: Script }) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border-l-4 border-l-indigo-500 bg-indigo-500/5 p-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">Hook</span>
        </div>
        <p className="text-lg text-white leading-relaxed">{script.hook}</p>
      </motion.div>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">Introduction</h3>
        <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">{script.introduction}</p>
      </motion.section>

      <div className="space-y-5">
        {script.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            className="border-l-2 border-l-white/10 pl-4"
          >
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold mb-2">
              {section.title}
            </h4>
            <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">{section.narration}</p>
          </motion.div>
        ))}
      </div>

      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">Conclusion</h3>
        <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">{script.conclusion}</p>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-5"
      >
        <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-2">Call to action</div>
        <p className="text-neutral-200 leading-relaxed">{script.call_to_action}</p>
      </motion.div>
    </div>
  );
}