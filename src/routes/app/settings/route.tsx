import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { chipClass } from "@/components/ui/kit";

export const Route = createFileRoute("/app/settings")({ component: SettingsLayout });

const LINKS = [
  { to: "/app/settings", label: "Overview" },
  { to: "/app/settings/profile", label: "Profile" },
  { to: "/app/settings/notifications", label: "Notifications" },
] as const;

function SettingsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div>
      <h1 className="font-display text-4xl">Settings</h1>
      <nav className="mt-4 mb-6 flex gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={chipClass(pathname === l.to, "font-mono text-[11px] uppercase tracking-wider")}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
