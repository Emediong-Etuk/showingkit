import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/kit";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/templates")({ component: Templates });

function Templates() {
  const templates = useKit((s) => s.templates);
  const deleteTemplate = useKit((s) => s.deleteTemplate);
  const showings = useKit((s) => s.showings);

  return (
    <div>
      <h1 className="font-display text-4xl">Shot templates</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Apply one when you file a new showing. Save a script from a hub with Duplicate as template.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <article key={t.id} className="rounded-xl bg-paper-dark p-5 transition-colors duration-150 hover:bg-paper-deep">
            <h2 className="font-display text-2xl">{t.name}</h2>
            <p className="text-sm text-ink-soft">{t.description}</p>
            <p className="mt-2 font-mono text-xs">
              {t.minutes} min · {t.shots.length} shots {t.city ? `· ${t.city}` : ""}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
              {t.shots.slice(0, 5).map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ol>
            <div className="mt-4 flex gap-2">
              <Link to="/app/showings/new" search={{ template: t.id }} className="text-sm underline">
                Use in new showing
              </Link>
              {!t.id.startsWith("tpl-") ? (
                <Button type="button" size="sm" variant="ghost" onClick={() => deleteTemplate(t.id)}>
                  Delete
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Create from a script</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {showings
          .filter((s) => s.shots.length)
          .map((s) => (
            <li key={s.id}>
              <Link to="/app/showings/$id" params={{ id: s.id }} className="underline">
                {s.address}
              </Link>{" "}
              — duplicate from the hub.
            </li>
          ))}
      </ul>
    </div>
  );
}
