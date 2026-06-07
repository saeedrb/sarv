"use client";

import { useEffect } from "react";
import { normalizeError } from "@/core/errors";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const appError = normalizeError(error);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="mb-3 text-sm font-semibold tracking-widest text-cyan-400">
          {appError.code}
        </p>
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="mt-4 text-slate-300">{appError.message}</p>
        <button
          className="mt-8 rounded-full bg-cyan-400 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-300"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
