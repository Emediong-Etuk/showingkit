import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Logo } from "@/components/logo";
import { buttonVariants } from "@/components/ui/kit";
import { useKit } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/sample-brief", label: "Product" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/cities", label: "Cities" },
  { to: "/guides", label: "Guides" },
] as const;

export function PublicLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const session = useKit((s) => s.session);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="no-print sticky top-0 z-40 border-b border-rule/70 bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-md px-2 py-1 text-sm text-ink-soft transition-colors duration-150 hover:bg-paper-dark hover:text-ink",
                  pathname.startsWith(n.to) && "bg-paper-dark text-ink",
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            {session ? (
              <Link to="/app" className={buttonVariants({ variant: "ink", size: "sm" })}>
                Open field kit
              </Link>
            ) : (
              <>
                <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Log in
                </Link>
                <Link to="/signup" className={buttonVariants({ size: "sm" })}>
                  Start a showing
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              className="relative size-11"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
            {open ? <X className="mx-auto size-5" /> : <Menu className="mx-auto size-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-rule bg-paper px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-2 py-2 transition-colors duration-150 hover:bg-paper-dark",
                    pathname.startsWith(n.to) && "bg-paper-dark text-ink",
                  )}
                >
                  {n.label}
                </Link>
              ))}
              <Link to="/signup" onClick={() => setOpen(false)} className={buttonVariants()}>
                Start a showing
              </Link>
            </div>
          </div>
        ) : null}
      </header>
      {children}
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="no-print border-t border-rule bg-paper-dark">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            Twenty minutes. Don’t leave with vibes. Same-day Walk / Negotiate / Offer briefs.
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/how-it-works" className="text-ink-soft hover:text-ink">How it works</Link></li>
            <li><Link to="/features" className="text-ink-soft hover:text-ink">Features</Link></li>
            <li><Link to="/pricing" className="text-ink-soft hover:text-ink">Pricing</Link></li>
            <li><Link to="/sample-brief" className="text-ink-soft hover:text-ink">Sample brief</Link></li>
            <li><Link to="/faq" className="text-ink-soft hover:text-ink">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Field notes</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/cities" className="text-ink-soft hover:text-ink">Cities</Link></li>
            <li><Link to="/cities/$slug" params={{ slug: "nyc" }} className="text-ink-soft hover:text-ink">NYC playbook</Link></li>
            <li><Link to="/guides" className="text-ink-soft hover:text-ink">Guides</Link></li>
            <li><Link to="/about" className="text-ink-soft hover:text-ink">About</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Legal</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/legal/disclaimer" className="text-ink-soft hover:text-ink">Disclaimer</Link></li>
            <li><Link to="/legal/privacy" className="text-ink-soft hover:text-ink">Privacy</Link></li>
            <li><Link to="/legal/terms" className="text-ink-soft hover:text-ink">Terms</Link></li>
            <li><Link to="/login" className="text-ink-soft hover:text-ink">Log in</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-10 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        Advisory only. ShowingKit is not a licensed inspection and not a lawyer.
      </p>
    </footer>
  );
}

export function PageHero({
  kicker,
  title,
  lede,
  action,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 md:pt-16">
      {kicker ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-copper">{kicker}</p>
      ) : null}
      <h1 className="mt-2 max-w-3xl font-display text-4xl md:text-5xl">{title}</h1>
      {lede ? <p className="mt-4 max-w-2xl text-lg text-ink-soft">{lede}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
