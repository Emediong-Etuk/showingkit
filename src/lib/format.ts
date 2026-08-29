import type { Currency, PriceKind, CitySlug, Verdict } from "./types";

export function money(amount: number, currency: Currency = "USD"): string {
  if (currency === "GBP") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function priceLabel(
  amount: number,
  kind: PriceKind,
  currency: Currency,
): string {
  const base = money(amount, currency);
  return kind === "rent" ? `${base}/mo` : base;
}

export function cityLabel(slug: CitySlug): string {
  switch (slug) {
    case "nyc":
      return "New York";
    case "los-angeles":
      return "Los Angeles";
    case "chicago":
      return "Chicago";
    case "austin":
      return "Austin";
    case "london":
      return "London";
  }
}

export function formatWhen(iso?: string): string {
  if (!iso) return "Unscheduled";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDay(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stampTone(verdict?: Verdict | null): string {
  if (verdict === "WALK") return "stamp-walk";
  if (verdict === "OFFER") return "stamp-offer";
  if (verdict === "NEGOTIATE") return "stamp-negotiate";
  return "stamp-upcoming";
}

export function leaveByCopy(startsAt: string, minutes: number): string {
  const start = new Date(startsAt);
  const leave = new Date(start.getTime() - 35 * 60 * 1000);
  const transit = 25;
  const t = leave.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `Leave the house at ${t}. Budget ${transit} min transit + 10 min early, then ${minutes} min inside. If the broker is already in the lobby, you are not late — they are rushing.`;
}
