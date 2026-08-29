import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GLOSSARY } from "@/lib/glossary";

export const Route = createFileRoute("/app/glossary")({ component: Glossary });

function Glossary() {
  const [q, setQ] = useState("");
  const items = useMemo(() => {
    const n = q.toLowerCase();
    return GLOSSARY.filter((g) => `${g.term} ${g.looksLike} ${g.why}`.toLowerCase().includes(n));
  }, [q]);

  return (
    <div>
      <h1 className="font-display text-4xl">Failure-point glossary</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search toe-kick, sash, GFCI…"
        className="mt-4 h-11 w-full max-w-md rounded-md bg-paper-dark px-3"
      />
      <div className="mt-6 space-y-6">
        {items.map((g) => (
          <article key={g.slug} id={g.slug} className="rounded-xl bg-paper-dark p-5">
            <h2 className="font-display text-2xl">{g.term}</h2>
            <p className="mt-3 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-copper">Looks like</span>
              <br />
              {g.looksLike}
            </p>
            <p className="mt-3 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-copper">Why it matters</span>
              <br />
              {g.why}
            </p>
            <p className="mt-3 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-copper">Shot that catches it</span>
              <br />
              {g.shot}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
