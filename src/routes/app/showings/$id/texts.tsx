import { createFileRoute } from "@tanstack/react-router";
import { ShowingHeader, ShowingNav } from "@/components/showing-nav";
import { Button, Textarea } from "@/components/ui/kit";
import { formatWhen } from "@/lib/format";
import { useKit, useShowing } from "@/lib/store";

export const Route = createFileRoute("/app/showings/$id/texts")({ component: TextsPage });

function TextsPage() {
  const { id } = Route.useParams();
  const showing = useShowing(id);
  const updateTextBody = useKit((s) => s.updateTextBody);
  const markTextCopied = useKit((s) => s.markTextCopied);
  const markTextSent = useKit((s) => s.markTextSent);

  if (!showing) return <p>Missing showing.</p>;
  if (!showing.texts.length) {
    return (
      <div>
        <ShowingHeader showing={showing} />
        <ShowingNav id={id} current="texts" />
        <p className="text-ink-soft">Texts appear after a brief is stamped.</p>
      </div>
    );
  }

  return (
    <div>
      <ShowingHeader showing={showing} />
      <ShowingNav id={id} current="texts" />
      <p className="max-w-2xl text-ink-soft">
        Calm, specific, not lawyer-cosplay. Edit before you copy. History is a local flag.
      </p>
      <div className="mt-6 space-y-6">
        {showing.texts.map((t) => (
          <article key={t.id} className="rounded-xl bg-paper-dark p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-copper">{t.title}</p>
            <Textarea
              className="mt-3 bg-paper"
              value={t.body}
              onChange={(e) => updateTextBody(id, t.id, e.target.value)}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  void navigator.clipboard.writeText(t.body);
                  markTextCopied(id, t.id);
                }}
              >
                Copy
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => markTextSent(id, t.id)}>
                Mark sent
              </Button>
            </div>
            <p className="mt-2 font-mono text-[10px] text-muted">
              {t.copiedAt ? `Copied ${formatWhen(t.copiedAt)}` : "Not copied"}
              {t.sentAt ? ` · Sent ${formatWhen(t.sentAt)}` : ""}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
