import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Polaroid } from "@/components/polaroid";
import { ShowingHeader, ShowingNav } from "@/components/showing-nav";
import { Button, buttonVariants } from "@/components/ui/kit";
import { priceLabel } from "@/lib/format";
import { useKit, useShowing } from "@/lib/store";

export const Route = createFileRoute("/app/showings/$id/")({ component: Hub });

function Hub() {
  const { id } = Route.useParams();
  const showing = useShowing(id);
  const deleteShowing = useKit((s) => s.deleteShowing);
  const duplicateAsTemplate = useKit((s) => s.duplicateAsTemplate);
  const navigate = useNavigate();

  if (!showing) return <p>That showing is not on the board.</p>;

  const steps = ["listing", "script", "evidence", "brief", "texts"] as const;

  return (
    <div>
      <ShowingHeader showing={showing} />
      <ShowingNav id={id} current="listing" />
      <p className="font-mono text-sm tabular-nums">
        {priceLabel(showing.price, showing.priceKind, showing.currency)} · {showing.beds} bd / {showing.baths} ba · {showing.minutes} min
      </p>
      <ol className="mt-6 flex flex-wrap gap-2">
        {steps.map((st) => (
          <li
            key={st}
            className={`rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider ${showing.status === st || (st === "listing" && showing.status !== "listing") ? "bg-ink text-paper" : "bg-paper-dark"}`}
          >
            {st}
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/app/showings/$id/script" params={{ id }} className={buttonVariants()}>
          Script
        </Link>
        <Link to="/app/showings/$id/evidence" params={{ id }} className={buttonVariants({ variant: "outline" })}>
          Evidence
        </Link>
        <Link to="/app/showings/$id/brief" params={{ id }} className={buttonVariants({ variant: "outline" })}>
          Brief
        </Link>
        <Link to="/app/showings/$id/texts" params={{ id }} className={buttonVariants({ variant: "outline" })}>
          Texts
        </Link>
      </div>
      <h2 className="mt-10 font-display text-2xl">Listing claims</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {showing.claims.map((c) => (
          <li
            key={c.id}
            className={`rounded-full px-3 py-1 font-mono text-xs ${c.riskToken ? "bg-ink text-paper" : "bg-paper-dark"}`}
          >
            {c.label}: {c.value}
          </li>
        ))}
      </ul>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {showing.listingPhotos.map((p) => (
          <Polaroid key={p.id} src={p.src} alt={p.caption} caption={p.caption} />
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => duplicateAsTemplate(id, `${showing.address} shots`)}
        >
          Duplicate as template
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            if (confirm("Delete this showing from the local kit?")) {
              deleteShowing(id);
              void navigate({ to: "/app/showings" });
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
