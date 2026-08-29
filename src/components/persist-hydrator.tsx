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
    const t = window.setTimeout(finish, 80);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
