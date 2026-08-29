import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { buttonVariants } from "@/components/ui/kit";

export const Route = createFileRoute("/pricing")({ component: Pricing });

function Pricing() {
  return (
    <PublicLayout>
      <PageHero
        kicker="Pricing"
        title="Pay for the afternoon, not for a LMS."
        lede="No payment in this demo. Every button goes to signup. Field is the one we would actually use."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-8 md:grid-cols-3">
        <Tier name="Scout" price="Free" note="2 showings / month, scripts only" items={["Timed scripts", "City generic if no copy", "Glossary"]} />
        <Tier
          name="Field"
          price="$12"
          recommended
          note="Unlimited showings, briefs, texts, compare"
          items={["Everything in Scout", "Walk / Negotiate / Offer briefs", "Text vault", "Compare two units", "Shot templates"]}
        />
        <Tier
          name="Household"
          price="$20"
          note="Shared showings with a partner, 2 seats"
          items={["Everything in Field", "Partner share link", "Two seats", "Calendar reminder copy"]}
        />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="font-display text-2xl">FAQ</h2>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="font-medium">Is payment wired?</dt>
            <dd className="text-ink-soft">Not in this demo. Coming soon. Buttons go to signup.</dd>
          </div>
          <div>
            <dt className="font-medium">What does Free actually withhold?</dt>
            <dd className="text-ink-soft">Briefs and texts. You can still walk a unit with a script.</dd>
          </div>
          <div>
            <dt className="font-medium">Partner sharing?</dt>
            <dd className="text-ink-soft">Household is two seats. This demo fakes the share link in settings.</dd>
          </div>
        </dl>
      </div>
    </PublicLayout>
  );
}

function Tier({
  name,
  price,
  note,
  items,
  recommended,
}: {
  name: string;
  price: string;
  note: string;
  items: string[];
  recommended?: boolean;
}) {
  return (
    <article className={`rounded-xl p-6 ${recommended ? "bg-ink text-paper" : "bg-paper-dark"}`}>
      {recommended ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-copper">Recommended</p>
      ) : null}
      <h2 className="mt-2 font-display text-3xl">{name}</h2>
      <p className="mt-1 font-mono text-2xl tabular-nums">
        {price}
        {price !== "Free" ? <span className="text-sm">/mo</span> : null}
      </p>
      <p className={`mt-2 text-sm ${recommended ? "text-paper/70" : "text-ink-soft"}`}>{note}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <Link
        to="/signup"
        className={buttonVariants({
          variant: recommended ? "copper" : "ink",
          className: "mt-6 w-full",
        })}
      >
        Start a showing
      </Link>
    </article>
  );
}
