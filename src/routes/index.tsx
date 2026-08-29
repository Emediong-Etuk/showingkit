import { createFileRoute, Link } from "@tanstack/react-router";
import { Polaroid } from "@/components/polaroid";
import { PublicLayout } from "@/components/layout/public-layout";
import { Stamp } from "@/components/stamp";
import { buttonVariants } from "@/components/ui/kit";
import { priceLabel } from "@/lib/format";
import { buildDemoShowings } from "@/lib/seed";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const demo = buildDemoShowings();
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-copper">Field kit for renters</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.05] md:text-6xl">
            Twenty minutes. Don’t leave with vibes.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            ShowingKit reads the listing, tells you exactly what to photograph, then turns your photos into a
            same-day Walk / Negotiate / Offer brief.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/signup" className={buttonVariants({ size: "lg" })}>
              Start a showing
            </Link>
            <Link to="/sample-brief" className={buttonVariants({ variant: "outline", size: "lg" })}>
              See a sample brief
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <Polaroid
            src="/photos/bushwick-toekick.jpg"
            alt="Visit photo of a stained dishwasher toe-kick"
            caption="Visit · toe-kick · 418 Troutman"
            rotate={-3}
          />
          <div className="absolute -right-2 -bottom-6 hidden w-56 rounded-lg bg-paper p-3 shadow-[var(--shadow-paper)] sm:block">
            <Stamp verdict="NEGOTIATE" />
            <p className="mt-2 font-mono text-[11px] text-ink-soft">Ask $280–$450 off. Listing cropped the kick.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-paper-dark">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          {[
            ["01", "Listing in", "Paste the copy. Drop the listing stills. We circle the tokens: flex, cozy, recently updated."],
            ["02", "Timed script", "A clipboard for 10, 15, 20, or 30 minutes. Each shot has a why, a fail, and a line to say out loud."],
            ["03", "Stamped brief", "Walk, negotiate, or offer — with a discrepancy table, a dollar range, and three texts to send now."],
          ].map(([n, t, b]) => (
            <div key={n}>
              <p className="font-mono text-xs text-copper">{n}</p>
              <h2 className="mt-2 font-display text-2xl">{t}</h2>
              <p className="mt-2 text-ink-soft">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Cropped brief</p>
        <h2 className="mt-2 font-display text-3xl">The page you send from the sidewalk</h2>
        <div className="relative mt-6 overflow-hidden rounded-xl bg-paper shadow-[var(--shadow-paper)]">
          <div className="pointer-events-none max-h-[420px] overflow-hidden p-6 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Field brief · New York</p>
                <p className="mt-2 font-display text-3xl">418 Troutman St</p>
                <p className="text-ink-soft">Bushwick, Brooklyn · $2,850/mo</p>
              </div>
              <Stamp verdict="NEGOTIATE" />
            </div>
            <p className="mt-6 max-w-3xl text-lg">
              The two-bed at 418 Troutman is a real two-bed: both rooms have exterior windows. It is not a clean $2,850.
              The listing kitchen photo crops a stained, swollen toe-kick; the visit still from the floor shows the stain.
            </p>
            <p className="mt-4 font-mono text-sm text-copper">Ask range: $280–$450 off monthly</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-paper to-transparent" />
          <div className="relative px-6 pb-6">
            <Link to="/sample-brief" className={buttonVariants({ variant: "outline" })}>
              Read the full Troutman brief
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">This weekend</p>
        <h2 className="mt-2 font-display text-3xl">Four units already on the board</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {demo.map((s) => (
            <article key={s.id} className="flex gap-4 rounded-xl bg-paper-dark p-4">
              <img
                src={s.listingPhotos[0]?.src}
                alt=""
                className="field-photo size-24 shrink-0 object-cover"
              />
              <div className="min-w-0">
                <Stamp verdict={s.brief?.verdict ?? "UPCOMING"} className="text-[10px]" />
                <p className="mt-2 font-display text-xl">{s.address}</p>
                <p className="text-sm text-ink-soft">{s.neighborhood}</p>
                <p className="mt-1 font-mono text-xs tabular-nums">
                  {priceLabel(s.price, s.priceKind, s.currency)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="font-display text-3xl">From people who stopped guessing</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Amina, Bushwick", "The listing kitchen was a lie. The kick was black. We sent the concession on the stoop and signed $300 off the same night."],
            ["Joel, Silver Lake", "I would have taken the guest house for the lemon tree. The script made me walk the building. One door. We left."],
            ["Priya, first buyer", "I am not a contractor. I needed someone to tell me which twelve photos actually matter. The brief is blunt. Good."],
          ].map(([n, q]) => (
            <blockquote key={n} className="rounded-xl bg-paper-dark p-5">
              <p className="text-ink-soft">“{q}”</p>
              <footer className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted">{n}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Works after</p>
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-sm text-ink-soft">
            {["Zillow paste", "Rightmove paste", "StreetEasy paste", "Photos from your camera roll"].map((x) => (
              <span key={x} className="rounded-full bg-paper-dark px-3 py-2">
                {x}
              </span>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
