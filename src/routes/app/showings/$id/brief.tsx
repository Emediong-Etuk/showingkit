import { createFileRoute, Link } from "@tanstack/react-router";
import { BriefDocument } from "@/components/brief-document";
import { ShowingHeader, ShowingNav } from "@/components/showing-nav";
import { Button, buttonVariants } from "@/components/ui/kit";
import { useShowing } from "@/lib/store";

export const Route = createFileRoute("/app/showings/$id/brief")({ component: BriefPage });

function BriefPage() {
  const { id } = Route.useParams();
  const showing = useShowing(id);
  if (!showing) return <p>Missing showing.</p>;
  if (!showing.brief) {
    return (
      <div>
        <ShowingHeader showing={showing} />
        <ShowingNav id={id} current="brief" />
        <p className="text-ink-soft">No brief yet.</p>
        <Link to="/app/showings/$id/evidence" params={{ id }} className={buttonVariants({ className: "mt-4" })}>
          Open evidence
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print">
        <ShowingHeader showing={showing} />
        <ShowingNav id={id} current="brief" />
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(showing.brief?.verdictSentences ?? "")}
          >
            Copy verdict
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
            Print report
          </Button>
          <Link to="/app/showings/$id/texts" params={{ id }} className={buttonVariants({ size: "sm" })}>
            Open texts
          </Link>
        </div>
      </div>
      <BriefDocument showing={showing} />
    </div>
  );
}
