import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefDocument } from "@/components/brief-document";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { Button, buttonVariants } from "@/components/ui/kit";
import { buildDemoShowings } from "@/lib/seed";

export const Route = createFileRoute("/sample-brief")({ component: Sample });

function Sample() {
  const showing = buildDemoShowings().find((s) => s.id === "showing-troutman")!;
  return (
    <PublicLayout>
      <PageHero
        kicker="Sample"
        title="418 Troutman, as briefed the same afternoon."
        lede="Read-only. Photo-pair callouts, discrepancy table, a dollar range, and three copyable texts."
        action={
          <Link to="/signup" className={buttonVariants()}>
            Run this on your next listing
          </Link>
        }
      />
      <div className="mx-auto max-w-4xl px-4 pb-8">
        <BriefDocument showing={showing} />
      </div>
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <h2 className="font-display text-2xl">Three texts from that brief</h2>
        <div className="mt-4 space-y-4">
          {showing.texts.map((t) => (
            <article key={t.id} className="rounded-xl bg-paper-dark p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-copper">{t.title}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm">{t.body}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigator.clipboard.writeText(t.body)}
              >
                Copy
              </Button>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
