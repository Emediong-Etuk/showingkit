import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, Input, chipClass } from "@/components/ui/kit";
import { useKit } from "@/lib/store";
import type { DealbreakerSeverity } from "@/lib/types";

export const Route = createFileRoute("/app/dealbreakers")({ component: Dealbreakers });

function Dealbreakers() {
  const list = useKit((s) => s.dealbreakers);
  const setDealbreakers = useKit((s) => s.setDealbreakers);
  const addDealbreaker = useKit((s) => s.addDealbreaker);
  const [label, setLabel] = useState("");
  const [sev, setSev] = useState<DealbreakerSeverity>("negotiate");

  return (
    <div>
      <h1 className="font-display text-4xl">Dealbreakers</h1>
      <p className="mt-2 max-w-xl text-ink-soft">
        Hard walk, negotiate, or note. These chips flow into the wizard and the brief score.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {list.map((d) => (
          <button
            type="button"
            key={d.id}
            className={chipClass(d.enabled, d.enabled ? "" : "text-muted")}
            onClick={() =>
              setDealbreakers(list.map((x) => (x.id === d.id ? { ...x, enabled: !x.enabled } : x)))
            }
          >
            {d.label}
            <span className="ml-2 font-mono text-[10px] uppercase">{d.severity}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {list.map((d) => (
          <label key={d.id + "-sev"} className="flex items-center gap-2 text-sm">
            {d.label}
            <select
              className="h-9 rounded-md bg-paper-dark px-2 transition-colors hover:bg-paper-deep"
              value={d.severity}
              onChange={(e) =>
                setDealbreakers(
                  list.map((x) =>
                    x.id === d.id ? { ...x, severity: e.target.value as DealbreakerSeverity } : x,
                  ),
                )
              }
            >
              <option value="hard">hard walk</option>
              <option value="negotiate">negotiate</option>
              <option value="note">note</option>
            </select>
          </label>
        ))}
      </div>
      <form
        className="mt-10 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!label.trim()) return;
          addDealbreaker(label.trim(), sev);
          setLabel("");
        }}
      >
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Add a chip" className="max-w-xs" />
        <select className="h-11 rounded-md bg-paper-dark px-2 transition-colors hover:bg-paper-deep" value={sev} onChange={(e) => setSev(e.target.value as DealbreakerSeverity)}>
          <option value="hard">hard walk</option>
          <option value="negotiate">negotiate</option>
          <option value="note">note</option>
        </select>
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
}
