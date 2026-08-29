import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { buttonVariants } from "@/components/ui/kit";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/guides/$slug")({ component: GuidePage });

function GuidePage() {
  const { slug } = Route.useParams();
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) throw notFound();

  return (
    <PublicLayout>
      <PageHero kicker="Guide" title={guide.title} lede={guide.dek} />
      <article className="mx-auto max-w-2xl px-4 pb-10">
        {guide.body.map((p) => (
          <p key={p.slice(0, 32)} className="mt-5 text-lg leading-relaxed">
            {p}
          </p>
        ))}
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/signup" className={buttonVariants()}>
            Run this on a listing
          </Link>
          <Link to="/guides" className={buttonVariants({ variant: "outline" })}>
            All guides
          </Link>
        </div>
      </article>
    </PublicLayout>
  );
}
