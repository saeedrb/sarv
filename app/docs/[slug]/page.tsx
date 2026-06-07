import { notFound } from "next/navigation";
import { docPages, getDocPage } from "../content";
import { DocsShell } from "../docs-shell";

export function generateStaticParams() {
  return docPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    return {
      title: "Documentation | Base Project",
    };
  }

  return {
    title: `${page.title} | Base Project`,
    description: page.description,
  };
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getDocPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <DocsShell>
      <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-sm font-semibold tracking-[0.25em] text-cyan-300">
          DOCUMENTATION
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
          {page.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          {page.description}
        </p>

        <div className="mt-10 grid gap-8">
          {page.sections.map((section) => (
            <section
              className="rounded-3xl border border-white/10 bg-slate-900/70 p-6"
              key={section.title}
            >
              <h2 className="text-2xl font-black">{section.title}</h2>
              <div className="mt-4 grid gap-3 text-base leading-8 text-slate-300">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.code ? (
                <pre
                  className="mt-5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950 p-4 text-left text-sm leading-7 text-cyan-100"
                  dir="ltr"
                >
                  <code>{section.code}</code>
                </pre>
              ) : null}
            </section>
          ))}
        </div>
      </article>
    </DocsShell>
  );
}
