import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/kit";
import { useKit } from "@/lib/store";

export const Route = createFileRoute("/app/settings/")({ component: Overview });

function Overview() {
  const resetDemo = useKit((s) => s.resetDemo);
  const user = useKit((s) => s.user);
  return (
    <div className="max-w-lg space-y-4">
      <p className="text-ink-soft">
        Signed in as {user?.name}. Data stays in this browser. Resetting reloads Maya’s four showings.
      </p>
      <div className="rounded-xl bg-paper-dark p-5">
        <h2 className="font-display text-2xl">Danger zone</h2>
        <p className="mt-2 text-sm text-ink-soft">Wipe local kit and restore demo data.</p>
        <Button type="button" variant="danger" className="mt-3" onClick={() => resetDemo()}>
          Reset demo data
        </Button>
      </div>
    </div>
  );
}
