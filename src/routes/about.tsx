import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, PublicLayout } from "@/components/layout/public-layout";
import { Button, Field, Input, Textarea } from "@/components/ui/kit";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  const addMessage = useKit((s) => s.addMessage);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  return (
    <PublicLayout>
      <PageHero
        kicker="About"
        title="Open houses are theater."
        lede="ShowingKit exists because listing photos hide leaks, patch jobs, illegal flex bedrooms, and fake parking — and because first-time renters are not contractors. Team of one. Built in a notebook, then in a browser."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 md:grid-cols-2">
        <div className="space-y-4 text-ink-soft">
          <p>
            The origin is not a pitch deck. It is a Saturday in Bushwick where the kitchen was “new” and the kick was
            black, and a guest house in Silver Lake that had one door and a portable AC with a hose. People left with
            vibes. Some overpaid. Some lost the place by going home to think.
          </p>
          <p>
            The kit is opinionated and dry on purpose. If you want a coach, this is the wrong product. If you want a
            same-day page with a stamp, it is the right one.
          </p>
        </div>
        <form
          className="space-y-4 rounded-xl bg-paper-dark p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.includes("@") || !message.trim()) {
              setToast("Name, a real email, and a message.");
              return;
            }
            addMessage(name.trim(), email.trim(), message.trim());
            setName("");
            setEmail("");
            setMessage("");
            setToast("Filed locally. We do not email from this demo.");
          }}
        >
          <h2 className="font-display text-2xl">Write to the desk</h2>
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Message">
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
          </Field>
          <Button type="submit">File it</Button>
          {toast ? <p className="font-mono text-xs text-copper">{toast}</p> : null}
        </form>
      </div>
    </PublicLayout>
  );
}
