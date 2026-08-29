import { createFileRoute } from "@tanstack/react-router";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/settings/notifications")({ component: Notes });

function Notes() {
  const user = useKit((s) => s.user);
  const updateUser = useKit((s) => s.updateUser);
  if (!user) return null;
  const n = user.notifications;

  function toggle(key: keyof typeof n) {
    updateUser({ notifications: { ...n, [key]: !n[key] } });
  }

  return (
    <div className="max-w-lg">
      <p className="text-ink-soft">
        Toggles only. This demo does not send push or email. They exist so the field board can remember what you asked for.
      </p>
      <ul className="mt-6 space-y-3">
        {(
          [
            ["briefReady", "Brief ready"],
            ["showingInTwoHours", "Showing in 2 hours"],
            ["unsentTexts", "Unsent texts"],
          ] as const
        ).map(([key, label]) => (
          <li key={key}>
            <label
              className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-4 transition-colors duration-150 ${
                n[key] ? "bg-ink text-paper hover:brightness-90" : "bg-paper-dark hover:bg-paper-deep"
              }`}
            >
              <span>{label}</span>
              <input
                type="checkbox"
                checked={n[key]}
                onChange={() => toggle(key)}
                className="size-5 accent-copper"
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
