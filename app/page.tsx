import Link from "next/link";

const layers = [
  {
    name: "app",
    description: "Routes, layouts, and page composition.",
  },
  {
    name: "features",
    description: "Business capabilities such as auth, products, and checkout.",
  },
  {
    name: "core",
    description: "Reusable infrastructure such as HTTP, errors, config, and auth rules.",
  },
  {
    name: "shared",
    description: "Reusable UI, hooks, and utilities that do not belong to one feature.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-slate-100" dir="ltr">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
          NEXT.JS APPLICATION STARTER
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
          A reusable foundation for repeated frontend work
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Requests, errors, sessions, permissions, forms, tests, and feature
          folders have clear contracts so each new project starts with a strong
          structure.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            href="/docs"
          >
            Read Web Docs
          </Link>
          <a
            className="rounded-full border border-white/15 px-5 py-3 font-bold text-slate-100 transition hover:bg-white/10"
            href="https://nextjs.org/docs"
            rel="noreferrer"
            target="_blank"
          >
            Next.js Docs
          </a>
        </div>

        <section className="mt-16 grid gap-4 sm:grid-cols-2">
          {layers.map((layer) => (
            <article
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
              key={layer.name}
            >
              <code className="text-lg font-bold text-cyan-300">
                {layer.name}/
              </code>
              <p className="mt-3 leading-7 text-slate-300">
                {layer.description}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-3xl bg-cyan-400 p-8 text-slate-950">
          <h2 className="text-2xl font-black">Documentation is now a website</h2>
          <p className="mt-3 max-w-3xl leading-8">
            The architecture guide is available at{" "}
            <Link className="font-black underline" href="/docs">
              /docs
            </Link>
            . The Markdown file can still stay as a written reference, but the
            user-facing guide now lives inside the app.
          </p>
        </section>
      </div>
    </main>
  );
}
