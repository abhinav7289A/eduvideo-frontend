"use client";
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, ChevronDown, Copy, Film, Mic, Music, Palette, Sparkles, Users } from 'lucide-react';
import type { ArtStyle, CharacterDesign, Scene } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  scenes: Scene[];
  artStyle?: ArtStyle;
  characterDesigns?: CharacterDesign[];
};

export function SceneTimeline({ scenes, artStyle, characterDesigns }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {/* Chapter-level style + character reference (collapsible) */}
      {(artStyle || characterDesigns?.length) && (
        <StyleAndCharacters artStyle={artStyle} characterDesigns={characterDesigns} />
      )}

      {/* Scene cards */}
      <div className="space-y-2">
        {scenes.map((scene, i) => {
          const isOpen = expanded === scene.scene_id;
          return (
            <motion.div
              key={scene.scene_id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.025 }}
              className="rounded-lg border border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isOpen ? null : scene.scene_id)}
                className="w-full p-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center">
                  {scene.scene_id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-200 truncate">{scene.scene_description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 flex-wrap">
                    <span>{scene.duration_seconds.toFixed(1)}s</span>
                    <span>·</span>
                    <span className="capitalize">{scene.emotion}</span>
                    {scene.shot_type && (
                      <>
                        <span>·</span>
                        <span>{scene.shot_type}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{scene.camera_motion}</span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-neutral-500 transition-transform flex-shrink-0',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/10 overflow-hidden bg-black/20"
                  >
                    <div className="p-4 space-y-4">
                      {/* Veo 3 prompt — the most important field, with copy button */}
                      <Section
                        icon={<Sparkles className="w-3 h-3" />}
                        label="Veo 3 prompt"
                        copyValue={scene.veo_prompt}
                      >
                        <div className="rounded bg-neutral-900/60 p-3 text-sm text-neutral-200 font-mono leading-relaxed">
                          {scene.veo_prompt || <span className="text-neutral-500 italic">(not generated)</span>}
                        </div>
                        {scene.negative_prompt && (
                          <div className="mt-2 text-[11px] text-neutral-500">
                            <span className="font-semibold">Avoid:</span> {scene.negative_prompt}
                          </div>
                        )}
                      </Section>

                      {/* Voiceover */}
                      <Section icon={<Mic className="w-3 h-3" />} label="Voiceover" copyValue={scene.voiceover}>
                        <p className="text-sm text-neutral-200 leading-relaxed">{scene.voiceover}</p>
                      </Section>

                      {/* Visual details grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <DetailItem label="Shot type" value={scene.shot_type} />
                        <DetailItem label="Camera motion" value={scene.camera_motion} />
                        <DetailItem label="Visual treatment" value={scene.visual_style} />
                        <DetailItem label="Emotion" value={scene.emotion} capitalize />
                      </div>

                      {scene.environmental_motion && (
                        <Section icon={<Film className="w-3 h-3" />} label="Environmental motion">
                          <p className="text-sm text-neutral-300 leading-relaxed">{scene.environmental_motion}</p>
                        </Section>
                      )}

                      {/* Sound design */}
                      {scene.sound_design && (
                        <div className="rounded-lg border border-white/5 p-3 bg-white/[0.02]">
                          <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
                            <Music className="w-3 h-3" />
                            Sound design
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <div>
                              <span className="text-neutral-500">Music: </span>
                              <span className="text-neutral-200">{scene.sound_design.music_mood}</span>
                            </div>
                            {scene.sound_design.sfx_cues?.length > 0 && (
                              <div>
                                <span className="text-neutral-500">SFX: </span>
                                <span className="text-neutral-200">{scene.sound_design.sfx_cues.join(' · ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Transition */}
                      {scene.transition_to_next && (
                        <div className="text-xs text-neutral-400 border-t border-white/5 pt-3">
                          <span className="text-neutral-500 uppercase tracking-wider">→ Transition: </span>
                          <span className="italic">{scene.transition_to_next}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StyleAndCharacters({ artStyle, characterDesigns }: { artStyle?: ArtStyle; characterDesigns?: CharacterDesign[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 flex items-center gap-2 hover:bg-white/[0.03] transition-colors text-left"
      >
        <Palette className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-neutral-200">Locked style & character refs</span>
        <span className="text-xs text-neutral-500 ml-2">(applied to every scene's Veo prompt)</span>
        <ChevronDown className={cn('w-4 h-4 text-neutral-500 ml-auto transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="p-4 space-y-4 bg-black/20">
              {artStyle && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold mb-2">Art style</div>
                  <p className="text-sm text-neutral-200 font-medium mb-1">{artStyle.style_name}</p>
                  <p className="text-xs text-neutral-400">
                    <span className="text-neutral-500">Descriptors: </span>
                    {artStyle.key_descriptors.join(' · ')}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    <span className="text-neutral-500">Palette: </span>
                    {artStyle.color_palette}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    <span className="text-neutral-500">Motion: </span>
                    {artStyle.motion_style}
                  </p>
                </div>
              )}
              {characterDesigns && characterDesigns.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-purple-400 font-semibold mb-2 flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    Character designs
                  </div>
                  <div className="space-y-2">
                    {characterDesigns.map((c, i) => (
                      <div key={i} className="rounded border border-white/5 bg-white/[0.02] p-2.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-semibold text-neutral-200">{c.name}</span>
                          <span className="text-[11px] text-neutral-500 italic">{c.role}</span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{c.visual_description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  icon,
  label,
  copyValue,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  copyValue?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {icon}
          <span>{label}</span>
        </div>
        {copyValue && <CopyButton text={copyValue} />}
      </div>
      {children}
    </div>
  );
}

function DetailItem({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-neutral-500 mb-0.5">{label}</div>
      <div className={cn('text-sm text-neutral-200', capitalize && 'capitalize')}>{value}</div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}