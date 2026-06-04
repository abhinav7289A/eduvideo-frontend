import type { PacingEstimate, PacingDepth, PacingStyle } from "./types";

// Hinglish narration words-per-minute, varying by depth/style
const WPM: Record<PacingDepth, number> = {
  concise: 170,
  light: 165,
  balanced: 160,
  deep: 155,
  "very deep": 150,
};

/**
 * Estimate scene count, narration length, and depth for a given target duration.
 * Mirror this in Python (app/pipeline/pacing_engine.py) when Phase 4 lands.
 */
export function estimatePacing(
  durationMinutes: number,
  chapterPages: number,
): PacingEstimate {
  const d = Math.max(0.5, durationMinutes);

  let depth: PacingDepth;
  let pacing: PacingStyle;
  let scenesPerMin: number;

  if (d <= 1.5) {
    depth = "concise"; pacing = "fast"; scenesPerMin = 5.0;
  } else if (d <= 3.5) {
    depth = "light"; pacing = "fast"; scenesPerMin = 3.0;
  } else if (d <= 6) {
    depth = "balanced"; pacing = "moderate"; scenesPerMin = 2.6;
  } else if (d <= 11) {
    depth = "deep"; pacing = "moderate"; scenesPerMin = 2.4;
  } else {
    depth = "very deep"; pacing = "storytelling"; scenesPerMin = 2.2;
  }

  // Long/complex chapters get a slight scene bump
  let complexity = 1.0;
  if (chapterPages > 30) complexity = 1.10;
  if (chapterPages > 50) complexity = 1.15;

  const sceneCount = Math.max(4, Math.round(d * scenesPerMin * complexity));
  const words = Math.round(d * WPM[depth]);
  const avgSec = Math.round((d * 60) / sceneCount * 10) / 10;

  return {
    scene_count: sceneCount,
    narration_words: words,
    avg_scene_seconds: avgSec,
    depth,
    pacing_style: pacing,
  };
}