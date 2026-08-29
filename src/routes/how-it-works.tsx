import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { Polaroid } from "@/components/polaroid";
import { buttonVariants } from "@/components/ui/kit";

export const Route = createFileRoute("/how-it-works")({ component: How });

function How() {
  return (
    <PublicLayout>
      <PageHero
        kicker="Method"
        title="Listing in. Timed script. Visit evidence. Stamped brief."
        lede="Four chapters. The broker can rush you; the remaining list just gets shorter."
        action={
          <Link to="/signup" className={buttonVariants()}>
            Start a showing
          </Link>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-16 px-4 pb-16">
        <Chapter n="01" title="Listing intake" img="/photos/eastvillage-listing.jpg" cap="Listing still">
          Paste a URL or the copy. Drop 3–12 listing photos. Tag the claims the ad is making: beds, air, parking, “recently updated.” We circle risk tokens — cozy, flex, garden level — so the script is not generic.
        </Chapter>
        <Chapter n="02" title="Timed script" img="/photos/hallway-slope.jpg" cap="Clipboard shot" reverse>
          Minutes per room. Each shot has a why, a fail condition, and a sentence to say out loud. Check them off. If the broker is rushing you, the agent shortens the remaining list live: décor dies first, toe-kick and egress stay.
        </Chapter>
        <Chapter n="03" title="Visit evidence" img="/photos/bushwick-undersink.jpg" cap="Under sink">
          Upload what you actually shot. Caption it: Under sink, Sash, Hall slope. Paste broker quotes. Move the sliders for smell, noise, gut. Notes-only is allowed. We label that brief weaker.
        </Chapter>
        <Chapter n="04" title="Stamped brief" img="/photos/bushwick-toekick.jpg" cap="Floor-height kick">
          Walk / Negotiate / Offer on one page. Discrepancy table, photo pairs, dollar ranges, three texts. Print it. Send it from the sidewalk. Advisory only — we are not the inspector you hire if you buy.
        </Chapter>
      </div>

      <section className="border-t border-rule bg-paper-dark">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-3xl">A Saturday</h2>
          <ol className="mt-6 space-y-4">
            {[
              ["9:40", "Script on the train. East Village 1-bed. Flex alcove already on the list."],
              ["10:00", "Showing. Broker starts the skyline speech. You are on the kick."],
              ["10:18", "Broker is rushing you. Remaining list collapses to egress, under-sink, noise video."],
              ["10:26", "Brief on the sidewalk. NEGOTIATE. Three texts. You send the first before the next train."],
            ].map(([t, b]) => (
              <li key={t} className="grid grid-cols-[88px_1fr] gap-4">
                <span className="font-mono text-sm text-copper">{t}</span>
                <span>{b}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </PublicLayout>
  );
}

function Chapter({
  n,
  title,
  img,
  cap,
  children,
  reverse,
}: {
  n: string;
  title: string;
  img: string;
  cap: string;
  children: string;
  reverse?: boolean;
}) {
  return (
    <article className={`grid items-center gap-8 md:grid-cols-2 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
      <div>
        <p className="font-mono text-xs text-copper">{n}</p>
        <h2 className="mt-2 font-display text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl text-ink-soft">{children}</p>
      </div>
      <Polaroid src={img} alt={cap} caption={cap} rotate={reverse ? 2 : -2} className="max-w-xs" />
    </article>
  );
}
