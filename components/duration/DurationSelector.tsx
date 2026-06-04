"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const PRESETS = [1, 3, 5, 8, 10, 15] as const;

type Props = {
  value: number;
  onChange: (minutes: number) => void;
};

export function DurationSelector({ value, onChange }: Props) {
  const isPreset = (PRESETS as readonly number[]).includes(value);
  const [customInput, setCustomInput] = useState<string>(isPreset ? "" : String(value));

  useEffect(() => {
    if (isPreset) setCustomInput("");
  }, [isPreset, value]);

  function handleCustom(raw: string) {
    setCustomInput(raw);
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= 0.5 && n <= 60) {
      onChange(n);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((m) => {
        const selected = isPreset && value === m;
        return (
          <button
            key={m}
            onClick={() => {
              onChange(m);
              setCustomInput("");
            }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              selected
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white/[0.04] text-neutral-300 hover:bg-white/[0.08] ring-1 ring-white/10",
            )}
          >
            {m}m
          </button>
        );
      })}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
          !isPreset
            ? "bg-indigo-500/15 ring-1 ring-indigo-500/40"
            : "bg-white/[0.04] ring-1 ring-white/10",
        )}
      >
        <input
          type="number"
          min={0.5}
          max={60}
          step={0.5}
          placeholder="custom"
          value={customInput}
          onChange={(e) => handleCustom(e.target.value)}
          className="w-16 bg-transparent text-sm text-neutral-200 outline-none placeholder:text-neutral-500"
        />
        <span className="text-xs text-neutral-500">min</span>
      </div>
    </div>
  );
}