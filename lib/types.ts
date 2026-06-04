export type Chapter = {
  chapter_number: number;
  title: string;
  start_page: number;
  end_page: number;
  page_count: number;
  detection_method: string;
};

export type DocumentAnalysis = {
  doc_id: string;
  filename: string;
  total_pages: number;
  has_toc: boolean;
  chapters: Chapter[];
  detection_summary: string;
};

export type PacingDepth = "concise" | "light" | "balanced" | "deep" | "very deep";
export type PacingStyle = "fast" | "moderate" | "storytelling";

export type PacingEstimate = {
  scene_count: number;
  narration_words: number;
  avg_scene_seconds: number;
  depth: PacingDepth;
  pacing_style: PacingStyle;
};

export type ScriptSection = {
  title: string;
  narration: string;
};

export type Script = {
  hook: string;
  introduction: string;
  sections: ScriptSection[];
  conclusion: string;
  call_to_action: string;
};

export type ArtStyle = {
  style_name: string;
  key_descriptors: string[];
  color_palette: string;
  motion_style: string;
};

export type CharacterDesign = {
  name: string;
  role: string;
  visual_description: string;
};

export type Understanding = {
  core_concepts: string[];
  difficulty_hotspots: string[];
  story_arc: string;
  key_figures: string[];
  analogy_hooks: string[];
  emotional_beats: string[];
  hook_ideas: string[];
  art_style: ArtStyle;
  character_designs: CharacterDesign[];
};

export type SceneSoundDesign = {
  music_mood: string;
  sfx_cues: string[];
};

export type Scene = {
  scene_id: number;
  duration_seconds: number;
  voiceover: string;
  scene_description: string;
  emotion: string;
  camera_motion: string;
  visual_style: string;
  shot_type: string;
  environmental_motion: string;
  transition_to_next: string;
  sound_design: SceneSoundDesign | null;
  veo_prompt: string;
  negative_prompt: string;
};

export type MCQItem = {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: string;
};

export type Flashcard = {
  term: string;
  definition: string;
};

export type QuizPackage = {
  mcqs: MCQItem[];
  revision_notes: string[];
  flashcards: Flashcard[];
};

export type FullGenerationResult = {
  chapter_title: string;
  duration_minutes: number;
  pacing: {
    duration_minutes: number;
    scene_count: number;
    narration_words: number;
    avg_scene_seconds: number;
    depth: string;
    pacing_style: string;
  };
  understanding: Understanding;
  script: Script;
  full_narration: string;
  scenes: Scene[];
  quiz: QuizPackage;
  word_count: number;
  timings: {
    pacing_seconds: number;
    understanding_seconds: number;
    rewrite_seconds: number;
    script_seconds: number;
    scenes_seconds: number;
    parallel_stage_seconds: number;
    total_seconds: number;
  };
};

export type ModelOverrides = {
  understanding?: string;
  rewriter?: string;
  script?: string;
  scene_planner?: string;
  visual_prompt?: string;
  quiz?: string;
};