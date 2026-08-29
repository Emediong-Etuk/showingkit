import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/legal/privacy")({ component: Page });

function Page() {
  return (
    <PublicLayout>
      <PageHero kicker="Legal" title="Privacy" lede="This demo lives in your browser." />
      <article className="mx-auto max-w-2xl space-y-4 px-4 pb-16 text-ink-soft">
        <p>
          ShowingKit’s demo stores session, showings, photos you upload (as local object URLs or data URLs), briefs,
          and the contact form in <span className="font-mono text-sm">localStorage</span> on this device. We do not
          operate a user database in this build.
        </p>
        <p>
          “Continue as demo user” writes seeded showings onto that same store. Reset demo data in settings wipes it.
        </p>
        <p>
          Do not upload identity documents, lease PDFs with SSNs, or anything you would not leave on a café table.
          Object URLs are local; clearing site data deletes the kit.
        </p>
        <p>If a hosted AI model is used to generate a script or brief, that call is user-initiated and capped.</p>
      </article>
    </PublicLayout>
  );
}
