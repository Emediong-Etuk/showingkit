import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/features")({ component: Features });

const FEATURES = [
  {
    to: "/app/showings/new",
    title: "Timed walkthrough scripts",
    catch: "A 20-minute NYC renter list that will not let you skip the flex room.",
  },
  {
    to: "/app/showings",
    title: "Listing-vs-visit photo diff",
    catch: "Standing-height kitchen vs floor-height kick. The crop is the tell.",
  },
  {
    to: "/app/dealbreakers",
    title: "Dealbreaker engine",
    catch: "Legal bedroom as a hard walk. W/D as a negotiate. The brief respects the chip.",
  },
  {
    to: "/cities",
    title: "City habitability heuristics",
    catch: "NYC windowless rooms. London condensation. LA portable-as-central. Labeled heuristics.",
  },
  {
    to: "/sample-brief",
    title: "Negotiation text vault",
    catch: "A clarifying question that names the wet cardboard, not ‘following up.’",
  },
  {
    to: "/app/compare",
    title: "Compare two units",
    catch: "Stamp, rent, top risks, which one actually has a legal bedroom.",
  },
  {
    to: "/app/templates",
    title: "Shot templates",
    catch: "20-min renter NYC. 15-min buyer bungalow. Garden-level skepticism.",
  },
  {
    to: "/app/calendar",
    title: "Calendar + reminder copy",
    catch: "Leave the house at 10:25. Budget transit. Do not be the person the broker rushes.",
  },
  {
    to: "/app/glossary",
    title: "Glossary of failure points",
    catch: "Toe-kick stain, sash gap, GFCI, slope, painted-over mildew — what it looks like, which shot catches it.",
  },
] as const;

function Features() {
  return (
    <PublicLayout>
      <PageHero
        kicker="Product"
        title="Every feature is a page you will actually open."
        lede="Not a grid of adjectives. Each card lands in the kit, with an example of what it catches."
      />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="rounded-xl bg-paper-dark p-5 no-underline transition-[transform,background-color] duration-150 hover:-translate-y-0.5 hover:bg-paper-deep"
          >
            <h2 className="font-display text-2xl">{f.title}</h2>
            <p className="mt-3 text-sm text-ink-soft">
              <span className="font-mono text-[10px] uppercase tracking-wider text-copper">What it catches</span>
              <br />
              {f.catch}
            </p>
          </Link>
        ))}
      </div>
    </PublicLayout>
  );
}
