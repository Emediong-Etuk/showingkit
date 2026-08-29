import { createFileRoute } from "@tanstack/react-router";
import { Button, Field, Input } from "@/components/ui/kit";
import { CITY_LIST } from "@/lib/cities";
import { useKit } from "@/lib/store";
import type { CitySlug, Minutes, Role } from "@/lib/types";
import { uid } from "@/lib/utils";

export const Route = createFileRoute("/app/settings/profile")({ component: Profile });

function Profile() {
  const user = useKit((s) => s.user);
  const updateUser = useKit((s) => s.updateUser);
  if (!user) return null;

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "").trim() || user.name;
        const role = (String(data.get("role")) as Role) || user.role;
        const defaultCity = (String(data.get("city")) as CitySlug) || user.defaultCity;
        const defaultMinutes = Number(data.get("minutes")) as Minutes;
        updateUser({ name, role, defaultCity, defaultMinutes });
      }}
    >
      <p className="text-ink-soft">Name, role, city, default minutes. Partner sharing mints a mock link — nothing syncs.</p>
      <Field label="Name">
        <Input name="name" defaultValue={user.name} />
      </Field>
      <Field label="Role">
        <select name="role" defaultValue={user.role} className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep">
          <option value="renter">Renter</option>
          <option value="buyer">Buyer</option>
        </select>
      </Field>
      <Field label="Default city">
        <select name="city" defaultValue={user.defaultCity} className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep">
          {CITY_LIST.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Default minutes">
        <select
          name="minutes"
          defaultValue={String(user.defaultMinutes)}
          className="h-11 w-full rounded-md bg-paper-dark px-3 transition-colors hover:bg-paper-deep"
        >
          {[10, 15, 20, 30].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>
      <Button type="submit">Save profile</Button>
      <div className="rounded-xl bg-paper-dark p-5">
        <h2 className="font-display text-2xl">Partner sharing</h2>
        <p className="mt-2 text-sm text-ink-soft">Household tier, mocked. The link does not leave this browser.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() =>
            updateUser({
              partnerSharing: !user.partnerSharing,
              shareLink: user.partnerSharing ? undefined : `https://showingkit.demo/share/${uid("kit")}`,
            })
          }
        >
          {user.partnerSharing ? "Turn sharing off" : "Mint a share link"}
        </Button>
        {user.partnerSharing && user.shareLink ? (
          <p className="mt-3 break-all font-mono text-xs text-copper">{user.shareLink}</p>
        ) : null}
      </div>
    </form>
  );
}
