import Link from "next/link";
import type { ReactNode } from "react";
import { docsIndex } from "./content";

export function DocsShell({ children }: { children: ReactNode }) {
  return (
    <main
      className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100"
      dir="ltr"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 lg:sticky lg:top-6 lg:h-fit">
          <Link className="text-sm font-bold text-cyan-300" href="/">
            Base Project
          </Link>
          <h2 className="mt-4 text-2xl font-black">Documentation</h2>
          <nav className="mt-6 grid gap-2">
            <Link
              className="rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              href="/docs"
            >
              Overview
            </Link>
            {docsIndex.map((page) => (
              <Link
                className="rounded-2xl px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                href={`/docs/${page.slug}`}
                key={page.slug}
              >
                {page.title}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
