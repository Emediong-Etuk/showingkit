import { useEffect } from "react";
import { useKit } from "@/lib/store";

export function PersistHydrator() {
  useEffect(() => {
    const finish = () => useKit.getState().markHydrated();
    if (useKit.persist.hasHydrated()) {
      finish();
      return;
    }
    const unsub = useKit.persist.onFinishHydration(finish);
    void useKit.persist.rehydrate();
    // Fallback only — localStorage rehydrate is usually a microtask.
    // An 80ms timeout raced session restore and bounced people to /login.
    const t = window.setTimeout(finish, 2500);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
