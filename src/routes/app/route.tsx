import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppGate, AppLayout } from "@/components/layout/app-layout";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

function AppShell() {
  return (
    <AppGate>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AppGate>
  );
}
