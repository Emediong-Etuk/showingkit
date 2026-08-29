import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateBrief, generateScript, generateTexts } from "./agent";
import {
  buildDemoDealbreakers,
  buildDemoEvents,
  buildDemoShowings,
  buildDemoTemplates,
  DEMO_USER,
} from "./seed";
import type {
  CalendarEvent,
  ContactMessage,
  Dealbreaker,
  DealbreakerSeverity,
  EvidencePhoto,
  Session,
  Showing,
  Template,
  User,
} from "./types";
import { EMPTY_EVIDENCE } from "./types";
import { nowIso, uid } from "./utils";

const STORAGE_KEY = "showingkit-v1";

function seedBundle() {
  const showings = buildDemoShowings();
  return {
    user: { ...DEMO_USER },
    showings,
    templates: buildDemoTemplates(),
    dealbreakers: buildDemoDealbreakers(),
    events: buildDemoEvents(showings),
    messages: [] as ContactMessage[],
  };
}

export interface AppState {
  hydrated: boolean;
  session: Session | null;
  user: User | null;
  showings: Showing[];
  templates: Template[];
  dealbreakers: Dealbreaker[];
  events: CalendarEvent[];
  messages: ContactMessage[];
  markHydrated: () => void;
  login: (email: string, name?: string, isDemo?: boolean) => void;
  logout: () => void;
  resetDemo: () => void;
  updateUser: (patch: Partial<User>) => void;
  upsertShowing: (showing: Showing) => void;
  patchShowing: (id: string, patch: Partial<Showing>) => void;
  deleteShowing: (id: string) => void;
  duplicateAsTemplate: (id: string, name: string) => void;
  addTemplate: (t: Template) => void;
  deleteTemplate: (id: string) => void;
  setDealbreakers: (list: Dealbreaker[]) => void;
  addDealbreaker: (label: string, severity: DealbreakerSeverity) => void;
  addEvent: (e: Omit<CalendarEvent, "id">) => void;
  addMessage: (name: string, email: string, message: string) => void;
  generateScriptFor: (id: string, templateId?: string, rushed?: boolean) => void;
  generateBriefFor: (id: string) => void;
  markTextCopied: (showingId: string, textId: string) => void;
  markTextSent: (showingId: string, textId: string) => void;
  updateTextBody: (showingId: string, textId: string, body: string) => void;
  toggleShot: (showingId: string, shotId: string, checked: boolean) => void;
  addVisitPhoto: (showingId: string, photo: EvidencePhoto) => void;
  removeVisitPhoto: (showingId: string, photoId: string) => void;
  captionVisitPhoto: (showingId: string, photoId: string, caption: string) => void;
}

export const useKit = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      session: null,
      user: null,
      showings: [],
      templates: [],
      dealbreakers: [],
      events: [],
      messages: [],
      markHydrated: () => set({ hydrated: true }),
      login: (email, name, isDemo = false) => {
        const session: Session = {
          email,
          name: name || (isDemo ? DEMO_USER.name : email.split("@")[0] || "Field user"),
          isDemo,
          loggedInAt: nowIso(),
        };
        if (isDemo) {
          const seeded = seedBundle();
          set({
            session,
            user: { ...seeded.user, email },
            showings: seeded.showings,
            templates: seeded.templates,
            dealbreakers: seeded.dealbreakers,
            events: seeded.events,
          });
          return;
        }
        const existing = get();
        if (existing.user && existing.showings.length) {
          set({
            session: { ...session, name: existing.user.name },
            user: { ...existing.user, email },
          });
          return;
        }
        set({
          session,
          user: {
            id: uid("user"),
            name: session.name,
            email,
            role: "renter",
            defaultCity: "nyc",
            defaultMinutes: 20,
            partnerSharing: false,
            notifications: {
              briefReady: true,
              showingInTwoHours: true,
              unsentTexts: true,
            },
          },
          showings: [],
          templates: buildDemoTemplates(),
          dealbreakers: buildDemoDealbreakers(),
          events: [],
        });
      },
      logout: () => set({ session: null }),
      resetDemo: () => {
        const seeded = seedBundle();
        set({
          session: {
            email: DEMO_USER.email,
            name: DEMO_USER.name,
            isDemo: true,
            loggedInAt: nowIso(),
          },
          ...seeded,
        });
      },
      updateUser: (patch) => {
        const user = get().user;
        if (!user) return;
        const next = { ...user, ...patch };
        const session = get().session;
        set({
          user: next,
          session: session ? { ...session, name: next.name, email: next.email } : session,
        });
      },
      upsertShowing: (showing) =>
        set({
          showings: [showing, ...get().showings.filter((s) => s.id !== showing.id)],
        }),
      patchShowing: (id, patch) =>
        set({
          showings: get().showings.map((s) =>
            s.id === id ? { ...s, ...patch, updatedAt: nowIso() } : s,
          ),
        }),
      deleteShowing: (id) =>
        set({
          showings: get().showings.filter((s) => s.id !== id),
          events: get().events.filter((e) => e.showingId !== id),
        }),
      duplicateAsTemplate: (id, name) => {
        const showing = get().showings.find((s) => s.id === id);
        if (!showing || showing.shots.length === 0) return;
        const t: Template = {
          id: uid("tpl"),
          name,
          description: `From ${showing.address}`,
          city: showing.city,
          minutes: showing.minutes,
          shots: showing.shots.map(({ checked: _c, skipped: _s, ...rest }) => rest),
        };
        set({ templates: [t, ...get().templates] });
      },
      addTemplate: (t) => set({ templates: [t, ...get().templates] }),
      deleteTemplate: (id) =>
        set({ templates: get().templates.filter((t) => t.id !== id) }),
      setDealbreakers: (list) => set({ dealbreakers: list }),
      addDealbreaker: (label, severity) =>
        set({
          dealbreakers: [
            ...get().dealbreakers,
            { id: uid("db"), label, severity, enabled: true, preset: false },
          ],
        }),
      addEvent: (e) => set({ events: [...get().events, { ...e, id: uid("cal") }] }),
      addMessage: (name, email, message) =>
        set({
          messages: [
            { id: uid("msg"), name, email, message, at: nowIso() },
            ...get().messages,
          ],
        }),
      generateScriptFor: (id, templateId, rushed) => {
        const showing = get().showings.find((s) => s.id === id);
        if (!showing) return;
        const template = get().templates.find((t) => t.id === templateId);
        const shots = generateScript(showing, { template, rushed });
        const events = get().events;
        const hasCal = events.some((e) => e.showingId === id);
        set({
          showings: get().showings.map((s) =>
            s.id === id
              ? {
                  ...s,
                  shots,
                  status: s.status === "listing" ? "script" : s.status,
                  updatedAt: nowIso(),
                  agentLogs: [
                    ...s.agentLogs,
                    { at: nowIso(), tick: rushed ? "Shortened remaining list" : "Writing shot list" },
                  ],
                }
              : s,
          ),
          events:
            hasCal || !showing.scheduledAt
              ? events
              : [
                  ...events,
                  {
                    id: uid("cal"),
                    showingId: id,
                    title: showing.address,
                    startsAt: showing.scheduledAt,
                    address: `${showing.address}, ${showing.neighborhood}`,
                    minutes: showing.minutes,
                  },
                ],
        });
      },
      generateBriefFor: (id) => {
        const showing = get().showings.find((s) => s.id === id);
        if (!showing) return;
        const brief = generateBrief(showing, get().dealbreakers);
        const texts = generateTexts({ ...showing, brief }, brief);
        set({
          showings: get().showings.map((s) =>
            s.id === id
              ? { ...s, brief, texts, status: "brief", updatedAt: nowIso() }
              : s,
          ),
        });
      },
      markTextCopied: (showingId, textId) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  status: "texts",
                  texts: s.texts.map((t) =>
                    t.id === textId ? { ...t, copiedAt: nowIso() } : t,
                  ),
                }
              : s,
          ),
        }),
      markTextSent: (showingId, textId) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  status: "texts",
                  texts: s.texts.map((t) =>
                    t.id === textId ? { ...t, sentAt: nowIso() } : t,
                  ),
                }
              : s,
          ),
        }),
      updateTextBody: (showingId, textId, body) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  texts: s.texts.map((t) => (t.id === textId ? { ...t, body } : t)),
                }
              : s,
          ),
        }),
      toggleShot: (showingId, shotId, checked) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  shots: s.shots.map((sh) => (sh.id === shotId ? { ...sh, checked } : sh)),
                }
              : s,
          ),
        }),
      addVisitPhoto: (showingId, photo) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  status: s.status === "script" ? "evidence" : s.status,
                  evidence: { ...s.evidence, photos: [...s.evidence.photos, photo] },
                }
              : s,
          ),
        }),
      removeVisitPhoto: (showingId, photoId) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  evidence: {
                    ...s.evidence,
                    photos: s.evidence.photos.filter((p) => p.id !== photoId),
                  },
                }
              : s,
          ),
        }),
      captionVisitPhoto: (showingId, photoId, caption) =>
        set({
          showings: get().showings.map((s) =>
            s.id === showingId
              ? {
                  ...s,
                  evidence: {
                    ...s.evidence,
                    photos: s.evidence.photos.map((p) =>
                      p.id === photoId ? { ...p, caption } : p,
                    ),
                  },
                }
              : s,
          ),
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        session: s.session,
        user: s.user,
        showings: s.showings,
        templates: s.templates,
        dealbreakers: s.dealbreakers,
        events: s.events,
        messages: s.messages,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

export function newShowingDraft(user: User | null): Showing {
  const enabled = useKit.getState().dealbreakers.filter((d) => d.enabled).map((d) => d.id);
  return {
    id: uid("showing"),
    address: "",
    neighborhood: "",
    city: user?.defaultCity ?? "nyc",
    listingText: "",
    listingPhotos: [],
    price: 0,
    priceKind: "rent",
    currency: user?.defaultCity === "london" ? "GBP" : "USD",
    beds: 1,
    baths: 1,
    claims: [],
    role: user?.role ?? "renter",
    budget: 0,
    dealbreakerIds: enabled,
    minutes: user?.defaultMinutes ?? 20,
    withPartner: false,
    mechanicalComfort: "mid",
    status: "listing",
    shots: [],
    evidence: { ...EMPTY_EVIDENCE, photos: [] },
    texts: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    agentLogs: [],
  };
}

export function useShowing(id: string | undefined): Showing | undefined {
  return useKit((s) => s.showings.find((x) => x.id === id));
}
