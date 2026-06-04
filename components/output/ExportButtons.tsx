"use client";
import { useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import type { FullGenerationResult } from '@/lib/types';

export function ExportButtons({ result }: { result: FullGenerationResult }) {
  const [copied, setCopied] = useState(false);

  function downloadJson() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.chapter_title.replace(/[^a-z0-9]+/gi, '_')}_${result.duration_minutes}min.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyNarration() {
    await navigator.clipboard.writeText(result.full_narration);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={copyNarration}
        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 transition-colors"
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? 'Copied' : 'Copy script'}
      </button>
      <button
        onClick={downloadJson}
        className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 transition-colors"
      >
        <Download className="w-3 h-3" />
        Download JSON
      </button>
    </div>
  );
}