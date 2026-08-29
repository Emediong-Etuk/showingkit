import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui/kit";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/signup")({ component: Signup });

function Signup() {
  const login = useKit((s) => s.login);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-shell px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="rounded-xl bg-paper p-8 shadow-[var(--shadow-paper)]">
        <Logo />
        <h1 className="mt-6 font-display text-3xl">Start a showing</h1>
        <p className="mt-2 text-sm text-ink-soft">Mock account. Or skip the form and load Maya’s seeded board.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.includes("@") || password.length < 1) {
              setErr("Name, email, and a password.");
              return;
            }
            login(email, name.trim(), false);
            void navigate({ to: "/app" });
          }}
        >
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {err ? <p className="text-sm text-danger">{err}</p> : null}
          <Button type="submit" className="w-full">
            Create kit
          </Button>
        </form>
        <Button
          type="button"
          variant="ink"
          className="mt-3 w-full"
          onClick={() => {
            login("maya@showingkit.demo", "Maya Chen", true);
            void navigate({ to: "/app" });
          }}
        >
          Continue as demo user
        </Button>
        <p className="mt-4 text-sm text-ink-soft">
          Already filed?{" "}
          <Link to="/login" className="text-ink underline">
            Log in
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
