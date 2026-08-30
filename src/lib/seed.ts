import type {
  Brief,
  CalendarEvent,
  Dealbreaker,
  EvidencePhoto,
  Shot,
  Showing,
  Template,
  TextDraft,
  User,
} from "./types";
import { PRESET_DEALBREAKERS, STARTER_TEMPLATES } from "./templates-data";

export const DEMO_USER: User = {
  id: "user-maya",
  name: "Maya Chen",
  email: "maya@showingkit.demo",
  role: "renter",
  defaultCity: "nyc",
  defaultMinutes: 20,
  partnerSharing: false,
  notifications: { briefReady: true, showingInTwoHours: true, unsentTexts: true },
};

function photo(id: string, file: string, caption: string, kind: string, source: "listing" | "visit"): EvidencePhoto {
  return { id, src: `/photos/${file}`, caption, kind, source, createdAt: "2026-08-20T12:00:00.000Z" };
}

function shot(id: string, room: string, title: string, why: string, failCondition: string, askOutLoud: string, minutes: number, captionHint: string, checked: boolean, order: number, skipped = false): Shot {
  return { id, room, title, why, failCondition, askOutLoud, minutes, captionHint, checked, skipped, priority: 8, order };
}

const TROUTMAN_TEXTS: TextDraft[] = [
  { id: "txt-t-1", kind: "clarify", title: "Clarifying question", body: "Hi — I was at 418 Troutman this afternoon. The dishwasher toe-kick is stained and the cabinet floor under the sink is wet (photos attached in follow-up). Was this disclosed, and has the supply line been replaced or only wiped?" },
  { id: "txt-t-2", kind: "concession", title: "Concession request", body: "Given the active leak at the dishwasher and the listing photos cropping the kick plate, I can sign today at $2,400–$2,570 (asking $280–$450 off the $2,850 rent) with a plumber’s ticket in writing before keys, or we keep $2,850 and you replace the line and the kick this week. Which is cleaner for the owner?" },
  { id: "txt-t-3", kind: "deadline", title: "Deadline / other-listing pressure", body: "I have a second unit in the East Village at 11:00 Saturday with a clean script. I can apply to Troutman today if the leak is priced in. Need a yes or no on the $280–$450 range by 6pm." },
];

const TROUTMAN_BRIEF: Brief = {
  verdict: "NEGOTIATE",
  verdictSentences: "The two-bed at 418 Troutman is a real two-bed: both rooms have exterior windows. It is not a clean $2,850. The listing kitchen photo is taken from standing height and crops a stained, swollen toe-kick under the dishwasher; the visit photo from the floor shows the stain, and the under-sink cabinet has wet cardboard on the supply line. Price the leak in today — $280–$450 off, or a plumber’s ticket in the lease — and it is livable. Walk only if they pretend the kick is ‘just shadow.’",
  confidence: 78,
  confidenceWhy: "Two visit photos plus a broker quote about a ‘small sweat’ on the line. Missing: a video of the marble in the hall, and the fire-escape sash fully open. Confidence is not higher because we did not see the ceiling of the flat below.",
  discrepancies: [
    { claim: "Renovated kitchen / stainless dishwasher", evidence: "Visit photo captioned ‘Under sink’: wet cardboard, mineral crust on the dishwasher supply. Toe-kick stain visible only from the floor — listing cropped it.", severity: "high", dollarImpact: "$280–$450/mo or a plumber + kick replacement before lease" },
    { claim: "Hardwood throughout", evidence: "Hall slope not fully tested (shot skipped when the broker moved you on). No spongey spot in the kitchen stills.", severity: "low", dollarImpact: "Unknown until the marble shot is done — do not give this away" },
    { claim: "Quiet, tree-lined Bushwick", evidence: "Gut slider 6/10. Saturday afternoon is not the J at 6:40 a.m.", severity: "mid", dollarImpact: "Come back one weeknight or treat as unproven" },
  ],
  photoPairs: [
    { listingSrc: "/photos/bushwick-kitchen-listing.jpg", visitSrc: "/photos/bushwick-toekick.jpg", listingLabel: "Listing kitchen, standing height", visitLabel: "Visit: toe-kick, floor height", callout: "The listing crops the kick. The visit shot is the same cabinet line from the floor: stain, swollen MDF." },
    { listingSrc: "/photos/bushwick-kitchen-listing.jpg", visitSrc: "/photos/bushwick-undersink.jpg", listingLabel: "Listing: closed cabinets", visitLabel: "Visit: under sink", callout: "Caption ‘Under sink’. Wet cardboard, supply-line crust. This is not a shadow." },
  ],
  dealbreakerResults: [
    { id: "db-legal-bed", label: "Legal bedroom", result: "pass", note: "Both claimed bedrooms have exterior windows. Not flex." },
    { id: "db-wd", label: "W/D in unit", result: "fail", note: "Hookups only in the bath. Severity was negotiate, not hard." },
    { id: "db-quiet", label: "Quiet at night", result: "unknown", note: "Saturday noon. Unproven." },
    { id: "db-pets", label: "Pets allowed", result: "pass", note: "Broker said cat OK, dog case-by-case. Get it in the lease." },
  ],
  cityFlags: [
    { flag: "Kitchen leak in a pre-war walk-up", heuristic: "NYC heuristic: ‘new kitchen’ in old stock — photograph the toe-kick and shutoffs. Advisory only." },
    { flag: "Both bedrooms windowed", heuristic: "NYC heuristic: windowless rooms are not bedrooms. This unit clears that bar." },
  ],
  walkAwayRange: "$2,850 as-is with the leak unaddressed",
  bestCaseRange: "$2,400–$2,570 with plumber’s ticket, or $2,850 with line + kick replaced this week",
  dollarAsk: "$280–$450 off monthly",
  missingShots: ["Hall marble both directions", "Fire-escape sash fully open"],
  generatedAt: "2026-08-23T16:26:00.000Z",
};

const EASTERLY_BRIEF: Brief = {
  verdict: "WALK",
  verdictSentences: "The Silver Lake guest house is a one-exit box with a portable AC sold as central air. There is a single door, no second egress from the sleeping alcove, and the cooling equipment is a rolling unit with a hose in the slider. The listing’s ‘central air’ claim does not survive the nameplate shot. If legal bedroom and real AC are dealbreakers — they are, on this profile — you leave. Do not negotiate a missing fire exit.",
  confidence: 86,
  confidenceWhy: "Exterior circuit of the building plus the AC sitting in the room. High confidence on the two hard fails. Did not pull permits; still labeled heuristic.",
  discrepancies: [
    { claim: "Central air", evidence: "Visit photo captioned ‘Portable AC’: rolling unit, accordion hose in the slider. No condenser on the pad.", severity: "high", dollarImpact: "Not a dollar problem — a walk. Replacement AC is $4k–$9k and may need an electrician" },
    { claim: "Guest house / 1 bed", evidence: "One exterior door. Sleeping alcove has a high slider, not a climbable egress. No second path if the kitchenette goes.", severity: "high", dollarImpact: "Illegal or non-conforming sleeping room risk — do not price it in" },
    { claim: "Parking included", evidence: "Ribbon driveway, tandem, 40-second walk, unlit at the gate.", severity: "mid", dollarImpact: "Would have been a negotiate if the unit were otherwise livable" },
  ],
  photoPairs: [
    { listingSrc: "/photos/silverlake-exterior.jpg", visitSrc: "/photos/silverlake-exterior.jpg", listingLabel: "Guest house, one door", visitLabel: "Circuit: still one door", callout: "Walk the building. There is no second exit. Guest-house heuristic." },
    { listingSrc: "/photos/silverlake-exterior.jpg", visitSrc: "/photos/silverlake-ac.jpg", listingLabel: "Listing implies central air", visitLabel: "Visit: portable with a hose", callout: "LA heuristic: nameplate or it is a story. This is a portable." },
  ],
  dealbreakerResults: [
    { id: "db-legal-bed", label: "Legal bedroom", result: "fail", note: "No second egress from the sleeping alcove." },
    { id: "db-ac", label: "Central air actually central", result: "fail", note: "Portable unit. Hard walk on this profile." },
    { id: "db-parking", label: "Parking on site", result: "fail", note: "Tandem ribbon, unlit. Secondary to the egress fail." },
  ],
  cityFlags: [
    { flag: "Portable sold as central", heuristic: "LA + Austin heuristic: AC reality. Photograph the equipment. Advisory only." },
    { flag: "Guest house, one door", heuristic: "LA heuristic: backyard units often fail second egress." },
  ],
  walkAwayRange: "Any rent as-is",
  bestCaseRange: "Do not bid. If you love the lemon tree, look at permitted ADUs only",
  missingShots: ["Water-heater strap", "Permit card if any"],
  generatedAt: "2026-08-20T17:12:00.000Z",
};

const EASTERLY_TEXTS: TextDraft[] = [
  { id: "txt-e-1", kind: "clarify", title: "Clarifying question", body: "Quick check on 914 Easterly: the listing says central air. The unit has a portable with a hose in the slider and no condenser on the pad. Was ‘central’ a copy error, and is there a second means of egress from the sleeping alcove besides the kitchenette door?" },
  { id: "txt-e-2", kind: "concession", title: "Concession request", body: "I’m not going to price a missing fire exit. If I have the wrong read on egress or there is a permitted second door I missed, send the photo and I will come back. Otherwise please pull me from the list." },
  { id: "txt-e-3", kind: "deadline", title: "Deadline / other-listing pressure", body: "I have other Saturday showings. If the owner wants to talk about a permitted ADU with a real condenser, I can look next week. This guest house as shown is a pass for me today." },
];

const BALHAM_BRIEF: Brief = {
  verdict: "NEGOTIATE",
  verdictSentences: "22 Balham High Road is a real one-bed with a street-facing sash and a rear room that actually opens. It is also a condensation story. The sashes are single-glazed and wet on a grey afternoon; the ‘recently refreshed’ cream paint is bubbling at the skirting on the external wall. Liveable if the rent moves and they stop pretending the paint is a damp course. Walk if you need dry walls this winter.",
  confidence: 74,
  confidenceWhy: "Sash close and the skirting stills are enough for damp. Did not lift carpets or run a meter. Labeled weaker on hidden fabric.",
  discrepancies: [
    { claim: "Recently refreshed throughout", evidence: "Visit photo captioned ‘Skirting’: bubbling cream paint, brown tide mark at the board on the external wall.", severity: "high", dollarImpact: "£150–£280/mo, or a damp report + making-good in writing" },
    { claim: "Period sashes / plenty of light", evidence: "Condensation on the glass, meeting-rail gap, lower sash stiff. Character is single glaze.", severity: "mid", dollarImpact: "Secondary glazing conversation, or accept the bill" },
    { claim: "Quiet residential terrace", evidence: "Balham High Road. Noise slider 7/10 at 11 on a Saturday. Buses are not theoretical.", severity: "mid", dollarImpact: "Come back at 7am or treat as a High Road flat" },
  ],
  photoPairs: [
    { listingSrc: "/photos/london-exterior.jpg", visitSrc: "/photos/london-sash.jpg", listingLabel: "Listing: dry glass, July light", visitLabel: "Visit: condensation on the sash", callout: "London heuristic: damp / condensation language. The glass is wet in August." },
    { listingSrc: "/photos/london-exterior.jpg", visitSrc: "/photos/london-damp.jpg", listingLabel: "‘Recently refreshed’", visitLabel: "Visit: paint over damp", callout: "Fresh cream, bubbling at the skirting, tide mark showing through." },
  ],
  dealbreakerResults: [
    { id: "db-legal-bed", label: "Legal bedroom", result: "pass", note: "Street-facing sash opens. Box room is not counted as a bed on this listing." },
    { id: "db-quiet", label: "Quiet at night", result: "fail", note: "High Road. Severity was negotiate." },
    { id: "db-carpet", label: "No carpet", result: "fail", note: "Original boards in the front, carpet in the rear. Note-level." },
  ],
  cityFlags: [
    { flag: "Single-glaze condensation", heuristic: "London heuristic: damp / condensation language. Advisory only." },
    { flag: "Recently refreshed as concealment", heuristic: "Paint over tide marks is a token, not a treatment." },
  ],
  walkAwayRange: "£1,850 as-is with no damp report",
  bestCaseRange: "£1,570–£1,700 with a damp survey and making-good, or secondary glazing on the High Road sashes",
  dollarAsk: "£150–£280 off monthly",
  missingShots: ["Behind the wardrobe on the cold wall", "Boiler age / service sticker"],
  generatedAt: "2026-08-16T12:40:00.000Z",
};

const BALHAM_TEXTS: TextDraft[] = [
  { id: "txt-b-1", kind: "clarify", title: "Clarifying question", body: "Hello — viewed 22 Balham High Road this morning. The listing says recently refreshed. The external-wall skirting is bubbling with a tide mark showing through, and the street sashes were condensing while we were there. Has there been a damp report, and may I see it?" },
  { id: "txt-b-2", kind: "concession", title: "Concession request", body: "I can proceed this week at £1,570–£1,700 (asking £150–£280 off) with a damp survey and making-good in the tenancy, or at £1,850 if secondary glazing goes on the High Road sashes before move-in. I’m not going to rent painted-over damp at the asking figure." },
  { id: "txt-b-3", kind: "deadline", title: "Deadline / other-listing pressure", body: "I have a New York decision this weekend and a second London viewing tomorrow. Need the landlord’s position on the damp by 5pm tomorrow if you want this application." },
];

function troutmanShots(): Shot[] {
  return [
    shot("st-t-1", "Entry", "Door and buzzer", "Test the intercom both ways.", "Dead buzzer.", "Does this buzzer reach the unit?", 1, "Entry door", true, 1),
    shot("st-t-2", "Bedroom 1", "Window from the door", "NYC legal-bedroom heuristic.", "No exterior window.", "Is this on the certificate as a bedroom?", 2, "Bedroom window", true, 2),
    shot("st-t-3", "Bedroom 2", "Second bedroom window", "Rule out flex.", "Borrowed light only.", "Two legal sleeping rooms?", 2, "Bedroom 2", true, 3),
    shot("st-t-4", "Kitchen", "Toe-kick, floor height", "Listing crops this.", "Stain or swollen MDF.", "Has the dishwasher leaked?", 3, "Toe-kick", true, 4),
    shot("st-t-5", "Kitchen", "Under sink, flash on", "Supply lines.", "Wet cardboard, bulge.", "Were the lines replaced?", 2, "Under sink", true, 5),
    shot("st-t-6", "Hall", "Marble both directions", "Slope toward wet walls.", "Marble runs.", "Leaks from above?", 1, "Hall slope", false, 6, true),
    shot("st-t-7", "Bath", "GFCI at the sink", "Pre-war electric.", "No TEST/RESET.", "When was the bath last opened?", 2, "Bath GFCI", true, 7),
    shot("st-t-8", "Egress", "Fire escape sash open", "Second exit.", "Painted shut.", "Can we open this fully?", 2, "Fire escape", false, 8, true),
  ];
}

function eastVillageScript(): Shot[] {
  return [
    shot("st-6-1", "Alcove", "Is the flex a windowed room?", "NYC: windowless is not a bedroom. Listing already hedges with ‘alcove.’", "No exterior window, or borrowed light only.", "When you say flex, do you mean a legal sleeping room?", 3, "Flex alcove", false, 1),
    shot("st-6-2", "Bedroom", "Railroad rear: window and the path out", "Second exit cannot be through a kitchen fire.", "Window painted shut, or path only through kitchen.", "If the kitchen goes, how do I leave the rear?", 3, "Rear window", false, 2),
    shot("st-6-3", "Kitchen", "Toe-kick and shutoffs, recently updated token", "Updated is paint until the kick says otherwise.", "Stain, wet cabinet, two-prong at the sink.", "What was actually replaced in this kitchen?", 3, "Under sink", false, 3),
    shot("st-6-4", "Hall", "Marble on the railroad run", "Old six-floor walk-ups slope. Rugs hide it.", "Marble runs toward a wet wall.", "Any leaks from above this year?", 2, "Hall slope", false, 4),
    shot("st-6-5", "Bath", "GFCI and the stack smell", "Pre-war bath, updated token.", "No GFCI; riser smell after a tap run.", "When was this bath last opened?", 2, "Bath GFCI", false, 5),
    shot("st-6-6", "Entry", "Walk-up: door, lock, and the stair smell", "You will do these stairs with shopping.", "Single cylinder you do not control; riser smell in the hall.", "Who has keys to the street door?", 2, "Entry", false, 6),
    shot("st-6-7", "Street", "6th St noise, 20-second video", "Must-see Saturday is not Friday 2 a.m.", "Bus and bar spill. Gut will lie at 11 a.m.", "Any nightlife complaints from this line of flats?", 2, "Street video", false, 7),
    shot("st-6-8", "Ceilings", "Raking light on the railroad ceiling", "Patches from upstairs tubs.", "Texture rectangle over the bed wall.", "Whose leak, and did it return?", 2, "Ceiling patch", false, 8),
    shot("st-6-9", "Heat", "Radiator in the alcove", "Heat included is not heat in the flex.", "No radiator in the claimed sleeping nook.", "Does this riser actually heat the alcove?", 1, "Radiator", false, 9),
  ];
}

export function buildDemoShowings(): Showing[] {
  const troutman: Showing = {
    id: "showing-troutman", address: "418 Troutman St", neighborhood: "Bushwick, Brooklyn", city: "nyc",
    listingUrl: "https://streeteasy.com/demo/418-troutman",
    listingText: "Sun-filled 2 bed in a renovated Bushwick walk-up. New kitchen with stainless dishwasher, hardwood throughout, heat included. Cozy, quiet tree-lined block. Flex-friendly layout if you need an office. Recently updated bath. Pets case by case.",
    listingPhotos: [photo("lp-t-1", "bushwick-kitchen-listing.jpg", "Kitchen (listing)", "kitchen", "listing"), photo("lp-t-2", "hallway-slope.jpg", "Hall (listing)", "hall", "listing")],
    price: 2850, priceKind: "rent", currency: "USD", beds: 2, baths: 1,
    claims: [{ id: "c-t-1", label: "Beds", value: "2" }, { id: "c-t-2", label: "Kitchen", value: "Renovated, stainless dishwasher", riskToken: true }, { id: "c-t-3", label: "Heat", value: "Included" }, { id: "c-t-4", label: "Copy", value: "Cozy, recently updated, flex-friendly", riskToken: true }],
    role: "renter", budget: 2700, dealbreakerIds: ["db-legal-bed", "db-wd", "db-quiet", "db-pets"], minutes: 20, withPartner: false, mechanicalComfort: "mid", status: "texts",
    shots: troutmanShots(),
    evidence: { photos: [photo("vp-t-1", "bushwick-toekick.jpg", "Toe-kick", "toe-kick", "visit"), photo("vp-t-2", "bushwick-undersink.jpg", "Under sink", "under-sink", "visit"), photo("vp-t-3", "bathroom-gfci.jpg", "Bath outlet", "gfci", "visit")], brokerQuotes: "‘That’s just a little sweat on the line, the super wiped it last week.’ ‘The listing kitchen is the same kitchen, we shot it after the reno.’", smell: 4, noise: 5, gut: 6, notes: "Broker rushed the hall. Could not get the marble down. Fire-escape window painted thick.", notesOnly: false },
    brief: TROUTMAN_BRIEF, texts: TROUTMAN_TEXTS, scheduledAt: "2026-08-23T14:00:00.000Z", createdAt: "2026-08-22T21:10:00.000Z", updatedAt: "2026-08-23T16:40:00.000Z",
    agentLogs: [{ at: "2026-08-23T16:24:00.000Z", tick: "Pair photos" }, { at: "2026-08-23T16:24:40.000Z", tick: "Concealment" }, { at: "2026-08-23T16:25:20.000Z", tick: "Dealbreakers + city heuristics" }, { at: "2026-08-23T16:26:00.000Z", tick: "Negotiation numbers" }],
  };
  const easterly: Showing = {
    id: "showing-easterly", address: "914 Easterly Terr", neighborhood: "Silver Lake, Los Angeles", city: "los-angeles",
    listingText: "Charming Silver Lake guest house. Central air, parking included, cozy 1 bed with lemon tree. Recently updated kitchenette. Perfect for a quiet ADU lifestyle.",
    listingPhotos: [photo("lp-e-1", "silverlake-exterior.jpg", "Guest house (listing)", "exterior", "listing")],
    price: 2450, priceKind: "rent", currency: "USD", beds: 1, baths: 1,
    claims: [{ id: "c-e-1", label: "AC", value: "Central air", riskToken: true }, { id: "c-e-2", label: "Parking", value: "Included", riskToken: true }, { id: "c-e-3", label: "Type", value: "Guest house / ADU", riskToken: true }],
    role: "renter", budget: 2400, dealbreakerIds: ["db-legal-bed", "db-ac", "db-parking"], minutes: 15, withPartner: true, mechanicalComfort: "low", status: "texts",
    shots: [shot("st-e-1", "Exterior", "Circuit of the building", "Second door.", "One door only.", "Is there a second exit?", 2, "Exterior circuit", true, 1), shot("st-e-2", "Sleeping", "Egress from the alcove", "Climbable opening.", "High slider only.", "How do you leave if the kitchenette is on fire?", 2, "Alcove window", true, 2), shot("st-e-3", "HVAC", "Nameplate on the cooling", "Central vs portable.", "Hose in the window.", "Where is the condenser?", 2, "Portable AC", true, 3), shot("st-e-4", "Parking", "Stall and the walk", "Included is a distance.", "Tandem, unlit.", "Which number is mine after dark?", 2, "Parking", true, 4)],
    evidence: { photos: [photo("vp-e-1", "silverlake-exterior.jpg", "One door", "exterior", "visit"), photo("vp-e-2", "silverlake-ac.jpg", "Portable AC", "ac", "visit")], brokerQuotes: "‘Everyone uses a portable up here, the listing just says central.’ ‘The driveway is technically two cars.’", smell: 5, noise: 3, gut: 2, notes: "Partner agreed: no second exit. Lemon tree is not egress.", notesOnly: false },
    brief: EASTERLY_BRIEF, texts: EASTERLY_TEXTS, scheduledAt: "2026-08-20T16:30:00.000Z", createdAt: "2026-08-19T09:00:00.000Z", updatedAt: "2026-08-20T17:20:00.000Z", agentLogs: [],
  };
  const balham: Showing = {
    id: "showing-balham", address: "22 Balham High Rd", neighborhood: "Balham, London", city: "london",
    listingUrl: "https://rightmove.co.uk/demo/22-balham",
    listingText: "Recently refreshed one-bed on Balham High Road. Period sashes, plenty of light, bills on request. Cozy garden-adjacent rear. Perfect for a professional couple. First to see will take it.",
    listingPhotos: [photo("lp-b-1", "london-exterior.jpg", "Terrace (listing)", "exterior", "listing")],
    price: 1850, priceKind: "rent", currency: "GBP", beds: 1, baths: 1,
    claims: [{ id: "c-b-1", label: "Condition", value: "Recently refreshed", riskToken: true }, { id: "c-b-2", label: "Windows", value: "Period sashes" }, { id: "c-b-3", label: "Copy", value: "Cozy, first to see", riskToken: true }],
    role: "renter", budget: 1700, dealbreakerIds: ["db-legal-bed", "db-quiet", "db-carpet"], minutes: 20, withPartner: false, mechanicalComfort: "mid", status: "texts",
    shots: [shot("st-b-1", "Sash", "Street sashes, condensation", "London damp heuristic.", "Wet glass, painted shut.", "Secondary glazing?", 3, "Sash", true, 1), shot("st-b-2", "Wall", "Skirting on the external wall", "Paint over damp.", "Bubbling, tide mark.", "Damp report?", 3, "Skirting", true, 2), shot("st-b-3", "Rear", "Threshold and gully", "Garden-adjacent.", "Soft floor.", "Water at this door?", 2, "Rear threshold", true, 3), shot("st-b-4", "Boiler", "Service sticker", "Who heats this.", "No sticker, rust.", "Last service?", 2, "Boiler", false, 4, true)],
    evidence: { photos: [photo("vp-b-1", "london-sash.jpg", "Sash condensation", "sash", "visit"), photo("vp-b-2", "london-damp.jpg", "Skirting", "damp", "visit")], brokerQuotes: "‘The paint is new, any mark is just old plaster settling.’ ‘High Road is lively, that’s the trade for the Northern Line.’", smell: 6, noise: 7, gut: 5, notes: "Could not pull the wardrobe. Cold wall is the street wall.", notesOnly: false },
    brief: BALHAM_BRIEF, texts: BALHAM_TEXTS, scheduledAt: "2026-08-16T11:00:00.000Z", createdAt: "2026-08-15T18:00:00.000Z", updatedAt: "2026-08-16T12:50:00.000Z", agentLogs: [],
  };
  const eastVillage: Showing = {
    id: "showing-east6", address: "7A, 310 E 6th St", neighborhood: "East Village, Manhattan", city: "nyc",
    listingUrl: "https://streeteasy.com/demo/310-e-6",
    listingText: "Classic East Village 1 bed. Bright railroad, recently updated kitchen, hardwood, heat included. Cozy, walk-up, pets OK. Flex alcove for a desk. Must see this Saturday.",
    listingPhotos: [photo("lp-6-1", "eastvillage-listing.jpg", "Living toward kitchen (listing)", "living", "listing"), photo("lp-6-2", "flex-bedroom.jpg", "Alcove (listing, dark)", "flex", "listing")],
    price: 3200, priceKind: "rent", currency: "USD", beds: 1, baths: 1,
    claims: [{ id: "c-6-1", label: "Beds", value: "1 + flex alcove", riskToken: true }, { id: "c-6-2", label: "Kitchen", value: "Recently updated", riskToken: true }, { id: "c-6-3", label: "Heat", value: "Included" }, { id: "c-6-4", label: "Copy", value: "Cozy, bright, must see", riskToken: true }],
    role: "renter", budget: 3000, dealbreakerIds: ["db-legal-bed", "db-pets", "db-quiet"], minutes: 20, withPartner: false, mechanicalComfort: "mid", status: "script",
    shots: [], evidence: { photos: [], brokerQuotes: "", smell: 5, noise: 5, gut: 5, notes: "", notesOnly: false }, texts: [],
    scheduledAt: "2026-08-29T11:00:00.000Z", createdAt: "2026-08-28T21:40:00.000Z", updatedAt: "2026-08-28T21:42:00.000Z",
    agentLogs: [{ at: "2026-08-28T21:40:30.000Z", tick: "Reading claims" }, { at: "2026-08-28T21:41:00.000Z", tick: "Ranking failure points" }, { at: "2026-08-28T21:41:30.000Z", tick: "Building timed route" }, { at: "2026-08-28T21:42:00.000Z", tick: "Writing shot list" }],
  };
  eastVillage.shots = eastVillageScript();
  return [troutman, easterly, balham, eastVillage];
}

export function buildDemoDealbreakers(): Dealbreaker[] {
  return PRESET_DEALBREAKERS.map((d) => ({ ...d, enabled: true, preset: true }));
}
export function buildDemoTemplates(): Template[] {
  return STARTER_TEMPLATES.map((t) => ({ ...t, shots: t.shots.map((s) => ({ ...s })) }));
}
export function buildDemoEvents(showings: Showing[]): CalendarEvent[] {
  return showings.filter((s) => s.scheduledAt).map((s) => ({ id: `cal-${s.id}`, showingId: s.id, title: s.address, startsAt: s.scheduledAt as string, address: `${s.address}, ${s.neighborhood}`, minutes: s.minutes }));
}
export const SAMPLE_SHOWING_ID = "showing-troutman";
