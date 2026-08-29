import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, addMonths, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { useState } from "react";
import { Button, Field, Input } from "@/components/ui/kit";
import { formatWhen, leaveByCopy } from "@/lib/format";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/calendar")({ component: CalendarPage });

function CalendarPage() {
  const events = useKit((s) => s.events);
  const addEvent = useKit((s) => s.addEvent);
  const showings = useKit((s) => s.showings);
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [address, setAddress] = useState("");
  const [copy, setCopy] = useState("");

  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(start, i));

  return (
    <div>
      <h1 className="font-display text-4xl">Calendar</h1>
      <div className="mt-4 flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, -1))}>
          Prev
        </Button>
        <p className="font-display text-2xl">{format(cursor, "MMMM yyyy")}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => setCursor(addMonths(cursor, 1))}>
          Next
        </Button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center font-mono text-[10px] uppercase text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
        {days.map((d) => {
          const dayEvents = events.filter((e) => isSameDay(new Date(e.startsAt), d));
          return (
            <div
              key={d.toISOString()}
              className={`min-h-20 rounded-md p-1 text-left text-xs ${isSameMonth(d, cursor) ? "bg-paper-dark" : "opacity-40"}`}
            >
              <span className="font-mono">{format(d, "d")}</span>
              {dayEvents.map((e) =>
                e.showingId ? (
                  <Link
                    key={e.id}
                    to="/app/showings/$id"
                    params={{ id: e.showingId }}
                    className="mt-1 block truncate text-copper"
                  >
                    {e.title}
                  </Link>
                ) : (
                  <span key={e.id} className="mt-1 block truncate text-copper">
                    {e.title}
                  </span>
                ),
              )}
            </div>
          );
        })}
      </div>
      <form
        className="mt-8 grid max-w-lg gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title || !when) return;
          addEvent({ title, startsAt: new Date(when).toISOString(), address, minutes: 20 });
          setTitle("");
        }}
      >
        <h2 className="font-display text-2xl">Add a time</h2>
        <Field label="Title">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="When">
          <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
        </Field>
        <Field label="Address">
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </Field>
        <Button type="submit">Add</Button>
      </form>
      <div className="mt-8">
        <h2 className="font-display text-2xl">Leave-the-house copy</h2>
        <select
          className="mt-2 h-11 rounded-md bg-paper-dark px-3"
          onChange={(e) => {
            const s = showings.find((x) => x.id === e.target.value);
            if (s?.scheduledAt) setCopy(leaveByCopy(s.scheduledAt, s.minutes));
          }}
        >
          <option value="">Pick a showing</option>
          {showings
            .filter((s) => s.scheduledAt)
            .map((s) => (
              <option key={s.id} value={s.id}>
                {s.address} · {formatWhen(s.scheduledAt)}
              </option>
            ))}
        </select>
        {copy ? <p className="mt-3 max-w-xl text-ink-soft">{copy}</p> : null}
      </div>
    </div>
  );
}
