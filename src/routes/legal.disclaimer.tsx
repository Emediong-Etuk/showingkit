import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/legal/disclaimer")({ component: Page });

function Page() {
  return (
    <PublicLayout>
      <PageHero kicker="Legal" title="Disclaimer" lede="Plain language. Advisory only." />
      <article className="mx-auto max-w-2xl space-y-4 px-4 pb-16 text-ink-soft">
        <p>
          ShowingKit is a field notebook. It generates shot lists and briefs from listing copy, photos, and notes you
          provide. It is not a licensed home inspection, not a pest inspection, not a survey, not an appraisal, and not
          legal advice.
        </p>
        <p>
          City playbooks are heuristics. When we say a windowless room is not a bedroom in New York, that is how those
          rooms are commonly treated — it is not a determination by a housing department, and it will not survive a
          dispute on its own. Hire a lawyer or the inspector whose stamp a bank will take if the number is large.
        </p>
        <p>
          Dollar ranges are order-of-magnitude negotiation brackets, not valuations. Confidence percentages measure
          completeness of evidence, not truth.
        </p>
        <p>
          You are responsible for what you send a listing agent. The three texts are drafts. Edit them.
        </p>
      </article>
    </PublicLayout>
  );
}
