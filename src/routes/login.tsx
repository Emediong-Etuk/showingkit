import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Button, Field, Input } from "@/components/ui/kit";
import { useKit } from "@/lib/store";

type Search = { returnTo?: string };

function destFrom(returnTo?: string) {
  if (returnTo && returnTo.startsWith("/") && !returnTo.startsWith("/login") && !returnTo.startsWith("/signup")) {
    return returnTo;
  }
  return "/app";
}

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    returnTo: typeof s.returnTo === "string" ? s.returnTo : undefined,
  }),
  component: Login,
});

function Login() {
  const { returnTo } = Route.useSearch();
  const login = useKit((s) => s.login);
  const session = useKit((s) => s.session);
  const hydrated = useKit((s) => s.hydrated);
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  function goToKit(path = destFrom(returnTo)) {
    if (path === "/app") {
      void navigate({ to: "/app" });
      return;
    }
    router.history.push(path);
  }

  useEffect(() => {
    if (hydrated && session) goToKit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, session]);

  function go(demo: boolean) {
    if (!demo && (!email.includes("@") || password.length < 1)) {
      setErr("Any email and any password will do. Both are required.");
      return;
    }
    login(demo ? "maya@showingkit.demo" : email, demo ? "Maya Chen" : undefined, demo);
    goToKit();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-shell px-4 py-10">
      <div className="relative w-full max-w-md">
        <div className="rounded-xl bg-paper p-8 shadow-[var(--shadow-paper)]">
        <Logo />
        <h1 className="mt-6 font-display text-3xl">Open the kit</h1>
        <p className="mt-2 text-sm text-ink-soft">Mock session. Any email and password works. Stored locally.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            go(false);
          }}
        >
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </Field>
          <Field label="Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </Field>
          {err ? <p className="text-sm text-danger">{err}</p> : null}
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </form>
        <Button type="button" variant="ink" className="mt-3 w-full" onClick={() => go(true)}>
          Continue as demo user
        </Button>
        <p className="mt-4 text-sm text-ink-soft">
          No account?{" "}
          <Link to="/signup" className="text-ink underline">
            Sign up
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
}
