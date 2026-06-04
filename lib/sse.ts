import type { ModelOverrides } from './types';

export type PipelineEvent = {
  type: 'stage_started' | 'stage_completed' | 'pipeline_complete' | 'pipeline_error';
  stage?: string;
  stage_index?: number;
  total_stages: number;
  elapsed_seconds: number;
  duration_seconds?: number;
  message?: string;
  result?: unknown;
  error?: string;
};

export type StreamCallbacks = {
  onEvent: (event: PipelineEvent) => void;
  onComplete: (result: unknown) => void;
  onError: (errorMessage: string) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7860';

export function streamGeneration(
  docId: string,
  chapterNumber: number,
  durationMinutes: number,
  callbacks: StreamCallbacks,
  modelOverrides: ModelOverrides = {},
): () => void {
  const params = new URLSearchParams({
    doc_id: docId,
    chapter_number: String(chapterNumber),
    duration_minutes: String(durationMinutes),
  });

  // Append non-empty model overrides as model_<stage> query params
  // (e.g. model_script=google/gemini-2.5-pro)
  for (const [stage, modelId] of Object.entries(modelOverrides)) {
    if (modelId && modelId !== '') {
      params.set(`model_${stage}`, modelId);
    }
  }

  const url = `${API_URL}/generate/stream?${params}`;
  const es = new EventSource(url);

  const handle = (raw: string) => {
    try {
      const event = JSON.parse(raw) as PipelineEvent;
      console.log('[SSE]', event.type, '·', event.stage, '·', event.message);
      callbacks.onEvent(event);
      if (event.type === 'pipeline_complete' && event.result) {
        callbacks.onComplete(event.result);
        es.close();
      } else if (event.type === 'pipeline_error') {
        callbacks.onError(event.message || event.error || 'Pipeline error');
        es.close();
      }
    } catch (err) {
      console.error('SSE parse error:', err, raw);
    }
  };

  (['stage_started', 'stage_completed', 'pipeline_complete', 'pipeline_error'] as const).forEach(
    (name) => es.addEventListener(name, (e) => handle((e as MessageEvent).data)),
  );

  es.onerror = () => {
    // EventSource auto-retries on transient errors; only treat closed state as fatal
    if (es.readyState === EventSource.CLOSED) {
      callbacks.onError('Connection lost');
    }
  };

  return () => es.close();
}