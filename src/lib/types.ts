export type Role = "renter" | "buyer";
export type Verdict = "WALK" | "NEGOTIATE" | "OFFER";
export type ShowingStatus = "listing" | "script" | "evidence" | "brief" | "texts";
export type DealbreakerSeverity = "hard" | "negotiate" | "note";
export type CitySlug = "nyc" | "los-angeles" | "chicago" | "austin" | "london";
export type Minutes = 10 | 15 | 20 | 30;
export type Currency = "USD" | "GBP";
export type PriceKind = "rent" | "sale";
export type MechanicalComfort = "low" | "mid" | "high";
export type Severity = "low" | "mid" | "high";
export type TextKind = "clarify" | "concession" | "deadline";

export interface Session {
  email: string;
  name: string;
  isDemo: boolean;
  loggedInAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  defaultCity: CitySlug;
  defaultMinutes: Minutes;
  partnerSharing: boolean;
  shareLink?: string;
  notifications: {
    briefReady: boolean;
    showingInTwoHours: boolean;
    unsentTexts: boolean;
  };
}

export interface ListingClaim {
  id: string;
  label: string;
  value: string;
  riskToken?: boolean;
}

export interface Shot {
  id: string;
  room: string;
  title: string;
  why: string;
  failCondition: string;
  askOutLoud: string;
  minutes: number;
  checked: boolean;
  skipped?: boolean;
  captionHint: string;
  priority: number;
  order: number;
}

export interface EvidencePhoto {
  id: string;
  src: string;
  caption: string;
  kind: string;
  source: "listing" | "visit";
  createdAt: string;
}

export interface Evidence {
  photos: EvidencePhoto[];
  brokerQuotes: string;
  smell: number;
  noise: number;
  gut: number;
  notes: string;
  notesOnly: boolean;
}

export interface Discrepancy {
  claim: string;
  evidence: string;
  severity: Severity;
  dollarImpact: string;
}

export interface PhotoPair {
  listingSrc?: string;
  visitSrc?: string;
  listingLabel: string;
  visitLabel: string;
  callout: string;
}

export interface DealbreakerResult {
  id: string;
  label: string;
  result: "pass" | "fail" | "unknown";
  note: string;
}

export interface CityFlag {
  flag: string;
  heuristic: string;
}

export interface Brief {
  verdict: Verdict;
  verdictSentences: string;
  confidence: number;
  confidenceWhy: string;
  discrepancies: Discrepancy[];
  photoPairs: PhotoPair[];
  dealbreakerResults: DealbreakerResult[];
  cityFlags: CityFlag[];
  walkAwayRange: string;
  bestCaseRange: string;
  missingShots: string[];
  dollarAsk?: string;
  generatedAt: string;
  weaker?: boolean;
}

export interface TextDraft {
  id: string;
  kind: TextKind;
  title: string;
  body: string;
  copiedAt?: string;
  sentAt?: string;
}

export interface AgentTick {
  at: string;
  tick: string;
}

export interface Showing {
  id: string;
  address: string;
  neighborhood: string;
  city: CitySlug;
  listingUrl?: string;
  listingText: string;
  listingPhotos: EvidencePhoto[];
  price: number;
  priceKind: PriceKind;
  currency: Currency;
  beds: number;
  baths: number;
  claims: ListingClaim[];
  role: Role;
  budget: number;
  dealbreakerIds: string[];
  minutes: Minutes;
  withPartner: boolean;
  mechanicalComfort: MechanicalComfort;
  status: ShowingStatus;
  shots: Shot[];
  evidence: Evidence;
  brief?: Brief;
  texts: TextDraft[];
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  agentLogs: AgentTick[];
  templateId?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  city?: CitySlug;
  minutes: Minutes;
  shots: Array<Omit<Shot, "checked" | "skipped">>;
}

export interface Dealbreaker {
  id: string;
  label: string;
  severity: DealbreakerSeverity;
  enabled: boolean;
  preset: boolean;
}

export interface CityShot {
  title: string;
  why: string;
}

export interface CityPlaybook {
  slug: CitySlug;
  name: string;
  shortName: string;
  fingerprint: string;
  legalBedroom: string;
  egress: string;
  patterns: string;
  topShots: CityShot[];
  redFlags: { phrase: string; means: string }[];
  heuristics: string[];
  currency: Currency;
}

export interface Guide {
  slug: string;
  title: string;
  dek: string;
  minutes: number;
  body: string[];
}

export interface CalendarEvent {
  id: string;
  showingId?: string;
  title: string;
  startsAt: string;
  address: string;
  minutes: number;
}

export interface GlossaryEntry {
  slug: string;
  term: string;
  looksLike: string;
  why: string;
  shot: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  at: string;
}

export const CITY_SLUGS: CitySlug[] = [
  "nyc",
  "los-angeles",
  "chicago",
  "austin",
  "london",
];

export const EMPTY_EVIDENCE: Evidence = {
  photos: [],
  brokerQuotes: "",
  smell: 5,
  noise: 5,
  gut: 5,
  notes: "",
  notesOnly: false,
};
