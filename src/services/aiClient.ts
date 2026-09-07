import { Capacitor } from "@capacitor/core";

/**
 * The AI features (chat, document scanner, text-to-speech) are powered by a
 * small Express backend (see server.ts) that proxies requests to the Gemini
 * API. That backend only exists when the app is served by Node (e.g. the
 * AI Studio preview, or a self-hosted deployment) — the packaged Android APK
 * built via Capacitor is a static, offline bundle with no server attached,
 * so calls to "/api/gemini/*" can never succeed there.
 *
 * Rather than let those calls fail with a confusing generic network error,
 * we detect the native app up front and return a clear, friendly bilingual
 * explanation instead.
 */
export class AiUnavailableError extends Error {
  constructor() {
    super(
      "AI features require the web-hosted version of Edu Library and are not available in this app build yet."
    );
    this.name = "AiUnavailableError";
  }
}

export function isAiBackendAvailable(): boolean {
  return !Capacitor.isNativePlatform();
}

export function getAiUnavailableMessage(lang: "bn" | "en"): string {
  return lang === "bn"
    ? "এই মুহূর্তে অ্যাপ ভার্সনে এআই ফিচারটি উপলব্ধ নয় (এটি শুধু ওয়েব ভার্সনে কাজ করে)। শীঘ্রই এটি অ্যাপেও যুক্ত করা হবে।"
    : "This AI feature isn't available in the app build yet (it currently only works on the web version). Support for the app is coming soon.";
}

interface AiFetchOptions {
  path: "/api/gemini/chat" | "/api/gemini/analyze-image" | "/api/gemini/tts";
  body: unknown;
}

/**
 * Calls a Gemini backend endpoint, throwing AiUnavailableError immediately
 * (without an actual network round-trip) when running inside the native app.
 */
export async function callAiBackend<T>({ path, body }: AiFetchOptions): Promise<T> {
  if (!isAiBackendAvailable()) {
    throw new AiUnavailableError();
  }

  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `Request to ${path} failed`);
  }

  return response.json() as Promise<T>;
}
