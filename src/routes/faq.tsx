import { createFileRoute } from "@tanstack/react-router";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";

export const Route = createFileRoute("/faq")({ component: Faq });

const ITEMS = [
  {
    q: "How accurate is this?",
    a: "As accurate as the photos and captions you give it. It is a field notebook with city heuristics, not a lab and not a license. Dollar figures are ranges. Confidence is a percentage of completeness, not a court number.",
  },
  {
    q: "What photos do I need?",
    a: "The script tells you. In practice: every claimed bedroom window, under the sink, the toe-kick, a slope shot, GFCI, the actual HVAC, the second exit. Caption them. A photo named IMG_4031.jpg is a vibe.",
  },
  {
    q: "Does it work without photos?",
    a: "Yes. Notes-only briefs are allowed and labeled weaker. The agent still reads listing tokens and your sliders. The range stays wide on purpose.",
  },
  {
    q: "Which cities?",
    a: "NYC, Los Angeles, Chicago, Austin, London playbooks. Other cities still get a script; they just inherit less local heuristic weight.",
  },
  {
    q: "Are you an inspector?",
    a: "No. Not a licensed inspection, not a lawyer, not an appraisal. Read the disclaimer. Hire those people when the number is large.",
  },
  {
    q: "Where does my data go?",
    a: "This demo stores it in your browser (localStorage). It does not leave the machine. Do not upload anything you would not leave on a café table.",
  },
  {
    q: "Partner sharing?",
    a: "Household tier is two seats. In this demo, settings will mint a mock share link. Nothing is actually synced to another phone.",
  },
  {
    q: "How are the dollar numbers estimated?",
    a: "From defect class (leak, damp, flex, portable-as-central) as a slice of asking rent or price. Ranges, not fake precision. A dishwasher leak on a $2,850 walk-up is hundreds a month, not $37.50.",
  },
];

function Faq() {
  return (
    <PublicLayout>
      <PageHero kicker="FAQ" title="The questions we would ask before trusting a stamp." />
      <div className="mx-auto max-w-3xl px-4 pb-16">
        {ITEMS.map((item) => (
          <details key={item.q} className="border-b border-rule py-4">
            <summary className="cursor-pointer font-display text-xl">{item.q}</summary>
            <p className="mt-3 text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </PublicLayout>
  );
}
