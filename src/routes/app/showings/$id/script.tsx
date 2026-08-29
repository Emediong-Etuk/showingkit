import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AgentLog } from "@/components/agent-log";
import { ShowingHeader, ShowingNav } from "@/components/showing-nav";
import { Button } from "@/components/ui/kit";
import { SCRIPT_TICKS } from "@/lib/agent";
import { useKit, useShowing } from "@/lib/store";

export const Route = createFileRoute("/app/showings/$id/script")({ component: ScriptPage });

function ScriptPage() {
  const { id } = Route.useParams();
  const showing = useShowing(id);
  const toggleShot = useKit((s) => s.toggleShot);
  const generateScriptFor = useKit((s) => s.generateScriptFor);
  const [running, setRunning] = useState(false);
  const [view, setView] = useState<"board" | "text">("board");
  const [left, setLeft] = useState((showing?.minutes ?? 20) * 60);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    if (!timerOn) return;
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [timerOn]);

  const remaining = showing?.shots.filter((s) => !s.checked && !s.skipped).reduce((a, s) => a + s.minutes, 0) ?? 0;

  const textList = useMemo(() => {
    if (!showing) return "";
    return showing.shots
      .filter((s) => !s.skipped)
      .map((s) => `• ${s.room} / ${s.title} (${s.minutes}m)\n  Why: ${s.why}\n  Fail: ${s.failCondition}\n  Ask: ${s.askOutLoud}`)
      .join("\n\n");
  }, [showing]);

  if (!showing) return <p>Missing showing.</p>;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div className="print-script">
      <ShowingHeader showing={showing} />
      <ShowingNav id={id} current="script" />
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <p className="font-mono text-sm tabular-nums">{remaining} min remaining</p>
        <p className="font-mono text-sm tabular-nums text-copper">
          {mm}:{ss}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={() => setTimerOn((v) => !v)}>
          {timerOn ? "Pause timer" : "Start timer"}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setView(view === "board" ? "text" : "board")}>
          {view === "board" ? "Text-to-self" : "Clipboard"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigator.clipboard.writeText(textList)}
        >
          Copy list
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
          Print
        </Button>
        <Button type="button" variant="ink" size="sm" onClick={() => setRunning(true)}>
          Broker is rushing me
        </Button>
      </div>
      {running ? (
        <div className="no-print mb-6">
          <AgentLog
            ticks={SCRIPT_TICKS}
            running
            stepMs={450}
            onDone={() => {
              generateScriptFor(id, undefined, true);
              setRunning(false);
            }}
          />
        </div>
      ) : null}

      {view === "text" ? (
        <pre className="whitespace-pre-wrap rounded-xl bg-paper-dark p-4 font-mono text-xs">{textList}</pre>
      ) : (
        <div className="clipboard p-6 pt-8">
          {showing.shots.map((s) => (
            <label
              key={s.id}
              className={`flex cursor-pointer gap-3 rounded-md border-b border-rule py-4 transition-colors duration-150 ${s.skipped ? "opacity-40" : ""} ${s.checked ? "bg-paper-dark" : "hover:bg-paper-dark/80"}`}
            >
              <input
                type="checkbox"
                className="mt-1 size-5 accent-copper"
                checked={s.checked}
                onChange={(e) => toggleShot(id, s.id, e.target.checked)}
              />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {s.room} · {s.minutes} min
                </p>
                <p className="font-display text-xl">{s.title}</p>
                <p className="mt-1 text-sm text-ink-soft">{s.why}</p>
                <p className="mt-1 text-sm">
                  <span className="font-mono text-[10px] uppercase text-danger">Fail</span> {s.failCondition}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-mono text-[10px] uppercase text-copper">Ask</span> {s.askOutLoud}
                </p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
