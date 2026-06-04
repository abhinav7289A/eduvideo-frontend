/**
 * Cosmetic cleanup for chapter titles extracted from PDFs.
 * Backend detection sometimes returns artifacts like:
 *  - "PPPPPastoralists in the Modern W"   ← duplicated leading drop-cap
 *  - "Forest Society and"                  ← title truncated mid-word
 * We handle the duplicated-letter case; truncation is left for inline editing
 * in later phases.
 */
export function cleanChapterTitle(raw: string): string {
  if (!raw) return raw;
  // Collapse 3+ identical leading characters: "PPPPPastoralists" → "Pastoralists"
  const collapsed = raw.replace(/^(.)\1{2,}/, "$1");
  return collapsed.trim();
}