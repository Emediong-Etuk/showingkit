import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/legal/terms")({ component: Page });

function Page() {
  return (
    <PublicLayout>
      <PageHero kicker="Legal" title="Terms" lede="A demo field kit, not a contract for inspection services." />
      <article className="mx-auto max-w-2xl space-y-4 px-4 pb-16 text-ink-soft">
        <p>
          By using ShowingKit you agree that output is advisory, that mock login is not a real identity system, and
          that payment tiers on the pricing page are not billed in this demo.
        </p>
        <p>
          You keep the rights to your listing copy and photographs. Seeded demo units are fictionalized composites
          for the product, not live listings you can apply to.
        </p>
        <p>
          We may change the heuristics. We will keep labeling them as heuristics. If you need a professional opinion,
          hire one. The stamp on the brief is ours, not theirs.
        </p>
      </article>
    </PublicLayout>
  );
}
