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

// Safety cap: any single generation longer than this is abnormal.
// Tune up if you regularly generate 30-min videos.
const SAFETY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function streamGeneration(
  docId: string,
  chapterNumber: number,
  durationMinutes: number,
  callbacks: StreamCallbacks,
  modelOverrides: ModelOverrides = {},
): () => void {
  // Build query string: standard params + non-empty model overrides
  const params = new URLSearchParams({
    doc_id: docId,
    chapter_number: String(chapterNumber),
    duration_minutes: String(durationMinutes),
  });

  for (const [stage, modelId] of Object.entries(modelOverrides)) {
    if (modelId && modelId !== '') {
      params.set(`model_${stage}`, modelId);
    }
  }

  const url = `${API_URL}/generate/stream?${params}`;
  const es = new EventSource(url);

  // Flag to ignore the spurious onerror that fires immediately AFTER es.close()
  // in some browsers (would otherwise call onError twice).
  let isClosed = false;

  const safeClose = () => {
    if (isClosed) return;
    isClosed = true;
    clearTimeout(safetyTimeout);
    es.close();
  };

  const handle = (raw: string) => {
    if (isClosed) return;
    try {
      const event = JSON.parse(raw) as PipelineEvent;
      console.log('[SSE]', event.type, '·', event.stage, '·', event.message);
      callbacks.onEvent(event);

      if (event.type === 'pipeline_complete' && event.result) {
        callbacks.onComplete(event.result);
        safeClose();
      } else if (event.type === 'pipeline_error') {
        callbacks.onError(event.message || event.error || 'Pipeline error');
        safeClose();
      }
    } catch (err) {
      console.error('[SSE] parse error:', err, raw);
    }
  };

  (['stage_started', 'stage_completed', 'pipeline_complete', 'pipeline_error'] as const).forEach(
    (name) => es.addEventListener(name, (e) => handle((e as MessageEvent).data)),
  );

  // Force-close on ANY connection error.
  // EventSource's default behavior is to auto-reconnect to the same URL,
  // which restarts the entire pipeline on the backend (re-running every agent
  // and burning money). We'd rather fail visibly and let the user retry manually.
  es.onerror = (event) => {
    if (isClosed) return;
    console.error('[SSE] connection error, closing to prevent pipeline restart', {
      readyState: es.readyState,
      event,
    });
    safeClose();
    callbacks.onError(
      'Connection lost. Your internet may have dropped briefly. Please click Regenerate to try again.',
    );
  };

  // Hard timeout: if a generation runs longer than SAFETY_TIMEOUT_MS,
  // abort it. Protects against backend hangs or any other case where
  // the connection stays open but no progress is made.
  const safetyTimeout = setTimeout(() => {
    if (isClosed) return;
    console.warn(`[SSE] safety timeout fired after ${SAFETY_TIMEOUT_MS / 1000}s, closing`);
    safeClose();
    callbacks.onError(
      `Generation took too long (>${SAFETY_TIMEOUT_MS / 60000} min). Please try again with faster models.`,
    );
  }, SAFETY_TIMEOUT_MS);

  // Cleanup function returned to caller (called on chapter switch, page nav, etc.)
  return () => {
    safeClose();
  };
}