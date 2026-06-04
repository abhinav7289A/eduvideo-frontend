import type { DocumentAnalysis } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:7860";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || JSON.stringify(body);
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export async function analyzePdf(file: File): Promise<DocumentAnalysis> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/pdf/analyze`, {
    method: "POST",
    body: form,
  });
  return handle<DocumentAnalysis>(res);
}

export async function getChapters(docId: string): Promise<DocumentAnalysis> {
  const res = await fetch(`${API_URL}/pdf/${docId}/chapters`);
  return handle<DocumentAnalysis>(res);
}