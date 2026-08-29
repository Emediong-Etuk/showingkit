import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AgentLog } from "@/components/agent-log";
import { Button, Field, Input, Textarea, chipClass, pillClass } from "@/components/ui/kit";
import { SCRIPT_TICKS, defaultClaimsFromText } from "@/lib/agent";
import { CITY_LIST } from "@/lib/cities";
import { newShowingDraft, useKit } from "@/lib/store";
import type { CitySlug, EvidencePhoto, MechanicalComfort, Minutes, Role } from "@/lib/types";
import { CITY_SLUGS } from "@/lib/types";
import { nowIso, uid } from "@/lib/utils";

type Search = { city?: string; template?: string };

export const Route = createFileRoute("/app/showings/new")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    city: typeof s.city === "string" ? s.city : undefined,
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  component: Wizard,
});

function Wizard() {
  const { city: cityQ, template: tplQ } = Route.useSearch();
  const user = useKit((s) => s.user);
  const dealbreakers = useKit((s) => s.dealbreakers);
  const templates = useKit((s) => s.templates);
  const upsert = useKit((s) => s.upsertShowing);
  const generateScriptFor = useKit((s) => s.generateScriptFor);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(() => {
    const d = newShowingDraft(user);
    if (cityQ && (CITY_SLUGS as string[]).includes(cityQ)) {
      d.city = cityQ as CitySlug;
      d.currency = cityQ === "london" ? "GBP" : "USD";
    }
    return d;
  });
  const [tpl, setTpl] = useState(tplQ ?? "");
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState("");
  const [claim, setClaim] = useState("");

  const onDone = useCallback(() => {
    generateScriptFor(draft.id, tpl || undefined);
    void navigate({ to: "/app/showings/$id/script", params: { id: draft.id } });
  }, [draft.id, generateScriptFor, navigate, tpl]);

  function patch<K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function submit() {
    if (!draft.address.trim()) {
      setErr("Address is required.");
      setStep(1);
      return;
    }
    const claims = draft.claims.length
      ? draft.claims
      : defaultClaimsFromText(draft.listingText, draft.city).map((c) => ({
          id: uid("claim"),
          ...c,
        }));
    const scheduledAt = draft.scheduledAt ?? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const showing = {
      ...draft,
      claims,
      scheduledAt,
      currency: draft.city === "london" ? ("GBP" as const) : ("USD" as const),
      updatedAt: nowIso(),
    };
    upsert(showing);
    setDraft(showing);
    setRunning(true);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper">New showing</p>
      <h1 className="font-display text-4xl">File a unit</h1>
      <p className="mt-2 text-ink-soft">Three steps, then a script. Not a modal.</p>
      <ol className="mt-4 flex gap-2 font-mono text-[11px] uppercase tracking-wider">
        {["Listing", "You", "Constraints"].map((l, i) => (
          <li key={l} className={chipClass(step === i + 1, "px-3 py-1 font-mono text-[11px] uppercase tracking-wider")}>
            {i + 1}. {l}
          </li>
        ))}
      </ol>

      {running ? (
        <div className="mt-8">
          <AgentLog ticks={SCRIPT_TICKS} running onDone={onDone} />
        </div>
      ) : (
        <>
          {step === 1 ? (
            <div className="mt-8 space-y-4">
              <Field label="Listing URL or paste">
                <Input
                  value={draft.listingUrl ?? ""}
                  onChange={(e) => patch("listingUrl", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Listing copy">
                <Textarea
                  value={draft.listingText}
                  onChange={(e) => {
                    patch("listingText", e.target.value);
                  }}
                  onBlur={() => {
                    if (!draft.claims.length && draft.listingText.trim()) {
                      patch(
                        "claims",
                        defaultClaimsFromText(draft.listingText, draft.city).map((c) => ({
                          id: uid("claim"),
                          ...c,
                        })),
                      );
                    }
                  }}
                  placeholder="Sun-filled 2 bed…"
                />
              </Field>
              <Field label="Address">
                <Input value={draft.address} onChange={(e) => patch("address", e.target.value)} required />
              </Field>
              <Field label="Neighborhood">
                <Input value={draft.neighborhood} onChange={(e) => patch("neighborhood", e.target.value)} />
              </Field>
              <div className="grid gap-4 md:grid-cols-4">
                <Field label="Rent / price">
                  <Input
                    type="number"
                    value={draft.price || ""}
                    onChange={(e) => patch("price", Number(e.target.value))}
                  />
                </Field>
                <Field label="Kind">
                  <select
                    className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep"
                    value={draft.priceKind}
                    onChange={(e) => patch("priceKind", e.target.value as "rent" | "sale")}
                  >
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </Field>
                <Field label="Beds">
                  <Input type="number" value={draft.beds} onChange={(e) => patch("beds", Number(e.target.value))} />
                </Field>
                <Field label="Baths">
                  <Input type="number" value={draft.baths} onChange={(e) => patch("baths", Number(e.target.value))} />
                </Field>
              </div>
              <Field label="Listing photos (3–12)">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).slice(0, 12);
                    const photos: EvidencePhoto[] = files.map((f) => ({
                      id: uid("lp"),
                      src: URL.createObjectURL(f),
                      caption: f.name,
                      kind: "listing",
                      source: "listing",
                      createdAt: nowIso(),
                    }));
                    patch("listingPhotos", [...draft.listingPhotos, ...photos].slice(0, 12));
                  }}
                />
              </Field>
              <div className="flex flex-wrap gap-2">
                {draft.listingPhotos.map((p) => (
                  <img key={p.id} src={p.src} alt="" className="field-photo size-16 object-cover" />
                ))}
              </div>
              <p className="font-mono text-xs text-muted">{draft.listingPhotos.length} listing stills on file.</p>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Claim chips</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.claims.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      className={chipClass(!!c.riskToken, "px-3 py-1 font-mono text-xs")}
                      onClick={() => patch("claims", draft.claims.filter((x) => x.id !== c.id))}
                    >
                      {c.label}: {c.value}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="Add a claim — flex, new kitchen…"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!claim.trim()) return;
                      patch("claims", [
                        ...draft.claims,
                        { id: uid("claim"), label: "Claim", value: claim.trim(), riskToken: true },
                      ]);
                      setClaim("");
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="mt-8 space-y-4">
              <Field label="Role">
                <select
                  className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep"
                  value={draft.role}
                  onChange={(e) => patch("role", e.target.value as Role)}
                >
                  <option value="renter">Renter</option>
                  <option value="buyer">Buyer</option>
                </select>
              </Field>
              <Field label="Budget">
                <Input type="number" value={draft.budget || ""} onChange={(e) => patch("budget", Number(e.target.value))} />
              </Field>
              <Field label="City preset">
                <select
                  className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep"
                  value={draft.city}
                  onChange={(e) => patch("city", e.target.value as CitySlug)}
                >
                  {CITY_LIST.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Dealbreakers</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {dealbreakers.filter((d) => d.enabled).map((d) => {
                    const on = draft.dealbreakerIds.includes(d.id);
                    return (
                      <button
                        type="button"
                        key={d.id}
                        className={chipClass(on)}
                        onClick={() =>
                          patch(
                            "dealbreakerIds",
                            on
                              ? draft.dealbreakerIds.filter((x) => x !== d.id)
                              : [...draft.dealbreakerIds, d.id],
                          )
                        }
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="mt-8 space-y-4">
              <Field label="Minutes">
                <div className="flex gap-2">
                  {([10, 15, 20, 30] as Minutes[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={pillClass(draft.minutes === m, "h-11 flex-1")}
                      onClick={() => patch("minutes", m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </Field>
              <label className="flex h-11 items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.withPartner}
                  onChange={(e) => patch("withPartner", e.target.checked)}
                />
                Partner on site
              </label>
              <Field label="Comfort with mechanicals">
                <select
                  className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep"
                  value={draft.mechanicalComfort}
                  onChange={(e) => patch("mechanicalComfort", e.target.value as MechanicalComfort)}
                >
                  <option value="low">Low — skip panels</option>
                  <option value="mid">Mid</option>
                  <option value="high">High — hatch and nameplates</option>
                </select>
              </Field>
              <Field label="Apply a template (optional)">
                <select className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep" value={tpl} onChange={(e) => setTpl(e.target.value)}>
                  <option value="">None — generate from listing</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Showing time">
                <Input
                  type="datetime-local"
                  onChange={(e) => patch("scheduledAt", new Date(e.target.value).toISOString())}
                />
              </Field>
            </div>
          ) : null}

          {err ? <p className="mt-4 text-sm text-danger">{err}</p> : null}
          <div className="mt-8 flex gap-3">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            ) : null}
            {step < 3 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={submit}>
                Generate script
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
