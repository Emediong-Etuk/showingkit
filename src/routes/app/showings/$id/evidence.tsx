import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AgentLog } from "@/components/agent-log";
import { Polaroid } from "@/components/polaroid";
import { ShowingHeader, ShowingNav } from "@/components/showing-nav";
import { Button, Field, Textarea } from "@/components/ui/kit";
import { BRIEF_TICKS } from "@/lib/agent";
import { useKit, useShowing } from "@/lib/store";
import { nowIso, uid } from "@/lib/utils";

export const Route = createFileRoute("/app/showings/$id/evidence")({ component: EvidencePage });

function EvidencePage() {
  const { id } = Route.useParams();
  const showing = useShowing(id);
  const patchShowing = useKit((s) => s.patchShowing);
  const addVisitPhoto = useKit((s) => s.addVisitPhoto);
  const captionVisitPhoto = useKit((s) => s.captionVisitPhoto);
  const generateBriefFor = useKit((s) => s.generateBriefFor);
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);

  const onDone = useCallback(() => {
    generateBriefFor(id);
    void navigate({ to: "/app/showings/$id/brief", params: { id } });
  }, [generateBriefFor, id, navigate]);

  if (!showing) return <p>Missing showing.</p>;
  const ev = showing.evidence;

  return (
    <div>
      <ShowingHeader showing={showing} />
      <ShowingNav id={id} current="evidence" />
      <h2 className="font-display text-2xl">Visit photos</h2>
      <input
        className="mt-3"
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          Array.from(e.target.files ?? []).forEach((f) => {
            addVisitPhoto(id, {
              id: uid("vp"),
              src: URL.createObjectURL(f),
              caption: "",
              kind: "visit",
              source: "visit",
              createdAt: nowIso(),
            });
          });
        }}
      />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {ev.photos.map((p) => (
          <div key={p.id}>
            <Polaroid src={p.src} alt={p.caption || "visit"} caption={p.caption} />
            <input
              className="mt-2 h-10 w-full rounded-md bg-paper-dark px-2 text-sm transition-colors hover:bg-paper-deep"
              placeholder="Caption — Under sink / Sash / Hall slope"
              value={p.caption}
              onChange={(e) => captionVisitPhoto(id, p.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Field label="Broker quotes">
          <Textarea
            value={ev.brokerQuotes}
            onChange={(e) => patchShowing(id, { evidence: { ...ev, brokerQuotes: e.target.value } })}
            placeholder="What they said out loud"
          />
        </Field>
        <Field label="Notes">
          <Textarea
            value={ev.notes}
            onChange={(e) => patchShowing(id, { evidence: { ...ev, notes: e.target.value } })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={ev.notesOnly}
            onChange={(e) => patchShowing(id, { evidence: { ...ev, notesOnly: e.target.checked } })}
          />
          Notes-only brief (labeled weaker)
        </label>
        {[
          ["smell", ev.smell],
          ["noise", ev.noise],
          ["gut", ev.gut],
        ].map(([k, v]) => (
          <label key={k as string} className="block">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {k} {v as number}/10
            </span>
            <input
              type="range"
              min={0}
              max={10}
              value={v as number}
              className="mt-1 w-full"
              onChange={(e) =>
                patchShowing(id, {
                  evidence: { ...ev, [k as "smell"]: Number(e.target.value) },
                })
              }
            />
          </label>
        ))}
      </div>

      {running ? (
        <div className="mt-8">
          <AgentLog ticks={BRIEF_TICKS} running onDone={onDone} />
        </div>
      ) : (
        <Button type="button" className="mt-8" onClick={() => setRunning(true)}>
          Run agent
        </Button>
      )}
    </div>
  );
}
