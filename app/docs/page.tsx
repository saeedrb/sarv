import Link from "next/link";
import { docsIndex } from "./content";
import { DocsShell } from "./docs-shell";

export const metadata = {
  title: "Documentation | Base Project",
  description: "Web documentation for the Base Project starter.",
};

export default function DocsPage() {
  return (
    <DocsShell>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-semibold tracking-[0.25em] text-cyan-300">
          STARTER GUIDE
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
          Web documentation for the reusable frontend starter
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          These pages explain the structure, contracts, and repeated workflows
          prepared in this project. They are written for both developers and
          non-specialist teammates who need a clear map of the system.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {docsIndex.map((page) => (
          <Link
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-300/60 hover:bg-white/10"
            href={`/docs/${page.slug}`}
            key={page.slug}
          >
            <h2 className="text-2xl font-black text-white">{page.title}</h2>
            <p className="mt-3 leading-7 text-slate-300">
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </DocsShell>
  );
}
