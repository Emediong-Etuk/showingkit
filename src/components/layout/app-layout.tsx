import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileStack,
  GitCompare,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/kit";
import { cityLabel } from "@/lib/format";
import { useKit } from "@/lib/store";
import { cn } from "@/lib/utils";

const SIDE = [
  { to: "/app", label: "Dashboard", icon: Home },
  { to: "/app/showings", label: "Showings", icon: ClipboardList },
  { to: "/app/showings/new", label: "New showing", icon: Plus },
  { to: "/app/compare", label: "Compare", icon: GitCompare },
  { to: "/app/templates", label: "Templates", icon: FileStack },
  { to: "/app/dealbreakers", label: "Dealbreakers", icon: ShieldAlert },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/app/glossary", label: "Glossary", icon: BookOpen },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

const TABS = [
  { to: "/app", label: "Home", icon: Home },
  { to: "/app/showings", label: "Showings", icon: ClipboardList },
  { to: "/app/showings/new", label: "New", icon: Plus },
  { to: "/app/showings", label: "Briefs", icon: FileStack, briefs: true },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function AppGate({ children }: { children: ReactNode }) {
  const hydrated = useKit((s) => s.hydrated);
  const session = useKit((s) => s.session);
  const navigate = useNavigate();
  useEffect(() => {
    if (hydrated && !session) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      navigate({ to: "/login", search: { returnTo } });
    }
  }, [hydrated, session, navigate]);

  if (!hydrated || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-ink">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Opening the kit…</p>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [more, setMore] = useState(false);
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useKit((s) => s.user);
  const showings = useKit((s) => s.showings);
  const logout = useKit((s) => s.logout);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const n = q.toLowerCase();
    return showings.filter((s) => `${s.address} ${s.neighborhood}`.toLowerCase().includes(n)).slice(0, 6);
  }, [q, showings]);

  const latestBrief = showings.find((s) => s.brief);

  return (
    <div className="min-h-screen bg-paper text-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="no-print hidden flex-col bg-shell text-cream md:flex">
        <div className="px-4 py-5">
          <Logo to="/app" tone="paper" />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-2 pb-6">
          {SIDE.map((item) => {
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to + item.label}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm text-cream/80 hover:bg-shell-lift hover:text-cream",
                  active && "bg-shell-lift text-cream",
                )}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col pb-20 md:pb-0">
        <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-rule bg-paper-dark px-3 md:h-16 md:px-6">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search showings"
              className="h-10 w-full rounded-md bg-paper pr-3 pl-9 text-sm shadow-[0_0_0_1px_rgba(28,25,22,0.12)]"
            />
            {results.length ? (
              <ul className="absolute inset-x-0 top-11 z-40 rounded-md bg-paper py-1 shadow-[var(--shadow-paper)]">
                {results.map((s) => (
                  <li key={s.id}>
                    <Link
                      to="/app/showings/$id"
                      params={{ id: s.id }}
                      className="block px-3 py-2 text-sm hover:bg-paper-dark"
                      onClick={() => setQ("")}
                    >
                      {s.address}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <span className="hidden rounded-full bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft md:inline">
            {user ? cityLabel(user.defaultCity) : "—"}
          </span>
          <Link to="/app/showings/new" className={buttonVariants({ size: "sm" })}>
            New showing
          </Link>
          <div className="relative">
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full bg-ink font-mono text-xs text-paper transition-colors duration-150 hover:brightness-90"
              onClick={() => setMenu((v) => !v)}
              aria-label="User menu"
            >
              {(user?.name ?? "M").split(" ").map((p) => p[0]).join("").slice(0, 2)}
            </button>
            {menu ? (
              <div className="absolute right-0 mt-2 w-52 rounded-lg bg-paper p-2 shadow-[var(--shadow-paper)]">
                <p className="px-2 py-1 font-display">{user?.name}</p>
                <p className="px-2 pb-2 font-mono text-[10px] text-muted">{user?.email}</p>
                <Link to="/app/settings/profile" className="block rounded-md px-2 py-2 text-sm hover:bg-paper-dark" onClick={() => setMenu(false)}>
                  Profile
                </Link>
                <button
                  type="button"
                  className="block w-full rounded-md px-2 py-2 text-left text-sm hover:bg-paper-dark"
                  onClick={() => {
                    logout();
                    navigate({ to: "/" });
                  }}
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-rule bg-shell text-cream md:hidden">
        {TABS.map((t) => {
          const Icon = t.icon;
          const dest =
            "briefs" in t && t.briefs && latestBrief
              ? `/app/showings/${latestBrief.id}/brief`
              : t.to;
          const active =
            t.to === "/app" ? pathname === "/app" : pathname.startsWith(t.to);
          return (
            <Link
              key={t.label}
              to={dest}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors duration-150",
                active ? "bg-shell-lift text-cream" : "text-cream/70 hover:bg-shell-lift hover:text-cream",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          );
        })}
        <button
          type="button"
          className={cn(
            "flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors duration-150",
            more ? "bg-shell-lift text-cream" : "text-cream/70 hover:bg-shell-lift hover:text-cream",
          )}
          onClick={() => setMore(true)}
        >
          <Menu className="size-4" />
          More
        </button>
      </nav>

      {more ? (
        <div className="fixed inset-0 z-50 bg-shell/70 md:hidden" onClick={() => setMore(false)}>
          <div
            className="absolute inset-y-0 right-0 w-[80%] max-w-sm bg-paper p-5 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-xl">More</p>
              <button type="button" className="size-11" onClick={() => setMore(false)} aria-label="Close">
                <X className="mx-auto size-5" />
              </button>
            </div>
            <div className="flex flex-col">
              {SIDE.map((item) => (
                <Link key={item.label} to={item.to} className="flex h-12 items-center gap-2 rounded-md px-2 transition-colors hover:bg-paper-dark" onClick={() => setMore(false)}>
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
