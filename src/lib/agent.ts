import { CITY_PLAYBOOKS } from "./cities";
import { money, priceLabel } from "./format";
import type {
  Brief,
  CitySlug,
  Dealbreaker,
  Minutes,
  Shot,
  Showing,
  Template,
  TextDraft,
} from "./types";
import { uid } from "./utils";

const RISK_TOKENS: { token: string; note: string }[] = [
  { token: "flex", note: "Not a legal bedroom until the window agrees." },
  { token: "alcove", note: "Sleeping nook, often no door and no egress." },
  { token: "cozy", note: "Small, often dark. Measure it." },
  { token: "garden level", note: "Below grade: damp, light, egress." },
  { token: "garden flat", note: "Below grade rear or well. Damp first." },
  { token: "garden-level", note: "Below grade." },
  { token: "recently updated", note: "Paint and hardware. Ask what was opened." },
  { token: "recently refreshed", note: "Paint over problems, especially damp." },
  { token: "recently renovated", note: "Cosmetic until the kick and the panel say otherwise." },
  { token: "new kitchen", note: "New boxes on old shutoffs." },
  { token: "utilities included", note: "No cap is not generosity with electric heat." },
  { token: "parking included", note: "A distance. Walk it." },
  { token: "central air", note: "Nameplate or it is a story." },
  { token: "central heating", note: "Radiator vs air handler. Photograph the appliance." },
  { token: "charming", note: "Old, and the defects are original." },
  { token: "must see", note: "Clock. Brief the same afternoon." },
  { token: "bright", note: "Listing-time sun. Return at dusk." },
  { token: "quiet", note: "Saturday noon is not data." },
  { token: "guest house", note: "One-exit boxes. Second egress." },
  { token: "adu", note: "Ask for the permit. Photograph the old header." },
  { token: "period", note: "Single glaze, drafts, original stack." },
  { token: "bills included", note: "Cap? Who holds the thermostat?" },
];

export function listingTokens(text: string): { token: string; note: string }[] {
  const lower = text.toLowerCase();
  return RISK_TOKENS.filter((t) => lower.includes(t.token));
}

export const SCRIPT_TICKS = ["Reading claims", "Ranking failure points", "Building timed route", "Writing shot list"] as const;
export const BRIEF_TICKS = ["Pair photos", "Concealment", "Dealbreakers + city heuristics", "Negotiation numbers"] as const;

function scaleMinutes(shots: Shot[], minutes: Minutes): Shot[] {
  const sum = shots.reduce((s, x) => s + Math.max(1, x.priority), 0) || 1;
  let used = 0;
  return shots.map((s, i) => {
    const m = i === shots.length - 1 ? Math.max(1, minutes - used) : Math.max(1, Math.round((s.priority / sum) * minutes));
    used += m;
    return { ...s, minutes: m };
  });
}

function baseShots(showing: Showing): Shot[] {
  const tokens = listingTokens(showing.listingText);
  const city = CITY_PLAYBOOKS[showing.city];
  const drafts: Array<Omit<Shot, "id" | "checked" | "order" | "skipped">> = [];
  drafts.push({ room: "Entry", title: "Door, lock, and the first 20 seconds", why: "You will do this door with shopping. Test the lock and anything that buzzes.", failCondition: "Lock you do not control, dead intercom, riser smell in the stair.", askOutLoud: "Who has keys to the street door, and does this buzzer reach the unit?", minutes: 1, captionHint: "Entry door", priority: 7 });
  drafts.push({ room: "Claimed bedroom", title: "Full room from the door, then the window opening", why: city.legalBedroom.split(".")[0] + ".", failCondition: "No exterior window, borrowed light, or opening you cannot climb through.", askOutLoud: "Is this a legal sleeping room, and can I see it on the paperwork?", minutes: 2, captionHint: "Bedroom window", priority: 10 });
  if (showing.beds >= 2 || tokens.some((t) => t.token === "flex" || t.token === "alcove")) {
    drafts.push({ room: "Bedroom 2 / flex", title: "Prove the second bedroom", why: "Flex is the expensive adjective. Count exterior windows, not bed icons.", failCondition: "Windowless, curtain wall, glass block, or a closet with a bed drawn on the plan.", askOutLoud: "When you say two bed, do you mean two legal sleeping rooms?", minutes: 2, captionHint: "Flex room", priority: 10 });
  }
  drafts.push({ room: "Kitchen", title: "Toe-kick from the floor, then under-sink with flash", why: tokens.some((t) => t.token.includes("kitchen") || t.token.includes("updated")) ? "The listing uses an update token. New boxes on old shutoffs. Crop happens at standing height." : "Dishwashers and supplies leak onto the kick. Listing photos crop this.", failCondition: "Stain, swollen MDF, wet cardboard, supply-line bulge.", askOutLoud: "Has the dishwasher leaked, and were the lines replaced or wiped?", minutes: 3, captionHint: "Under sink", priority: 10 });
  drafts.push({ room: "Hall", title: "Marble / bottle roll both directions", why: "Slope toward a wet wall is a leak or a joist story. Rugs exist to kill this shot.", failCondition: "Marble runs with intent; a door will not latch.", askOutLoud: "Any leaks from above this year?", minutes: 1, captionHint: "Hall slope", priority: 7 });
  drafts.push({ room: "Bath", title: "GFCI at the water, and the caulk line", why: "Two-prong next to a tub means the electric was never opened. Fresh caulk is a costume.", failCondition: "No TEST/RESET near water; mildew under new caulk; spongey floor.", askOutLoud: "When was this bath last opened, not just recaulked?", minutes: 2, captionHint: "Bath GFCI", priority: 8 });
  if (showing.city === "los-angeles" || showing.city === "austin" || /central air|ac |a\/c/i.test(showing.listingText)) {
    drafts.push({ room: "HVAC", title: "The actual cooling equipment, nameplate in frame", why: "LA + Austin heuristic: portable-as-central is a walk if that is a dealbreaker.", failCondition: "Rolling unit, window hose, or no condenser on the pad.", askOutLoud: "Where is the air handler, and did this hold last August?", minutes: 2, captionHint: "AC nameplate", priority: 10 });
  }
  if (showing.city === "chicago" || /heat|radiator|boiler/i.test(showing.listingText)) {
    drafts.push({ room: "Heat", title: "Radiator vs air handler, plus the thermostat", why: "Chicago heuristic: listing heat claims vs the appliance in the room.", failCondition: "No heat in a claimed bedroom; boiler story with no access.", askOutLoud: "What actually heats this room, and who pays the gas?", minutes: 2, captionHint: "Heat source", priority: 8 });
  }
  if (showing.city === "london" || /sash|period|refreshed|damp/i.test(showing.listingText)) {
    drafts.push({ room: "Sash / damp", title: "Sash operation and the skirting on the cold wall", why: "London heuristic: condensation language and paint over tide marks.", failCondition: "Painted shut, heavy condensation, bubbling at the board.", askOutLoud: "Has there been a damp report, and may I see it?", minutes: 3, captionHint: "Sash", priority: 10 });
  }
  drafts.push({ room: "Egress", title: "Second way out, full run", why: city.egress.split(".")[0] + ".", failCondition: "One door on a guest house; fire escape painted shut; locked well grate.", askOutLoud: "If the kitchen is on fire, how does someone leave the sleeping room?", minutes: 2, captionHint: "Second exit", priority: 9 });
  if (/parking/i.test(showing.listingText) || showing.dealbreakerIds.includes("db-parking")) {
    drafts.push({ room: "Parking", title: "The stall, the number, the walk, the light", why: "Parking included is a distance. Time the walk.", failCondition: "Tandem, four blocks, unlit, or a permit you will not get.", askOutLoud: "Which painted number is mine after dark?", minutes: 2, captionHint: "Parking stall", priority: 7 });
  }
  drafts.push({ room: "Ceilings", title: "Raking light on patches", why: "A rectangle of different texture is a leak from above.", failCondition: "Patch over a bed or table; stain returning through new paint.", askOutLoud: "Whose leak was that, and did it return?", minutes: 1, captionHint: "Ceiling patch", priority: 6 });
  if (showing.mechanicalComfort !== "low") {
    drafts.push({ room: "Mechanicals", title: "Panel, shutoffs, water heater if you can reach them", why: "Comfort with mechanicals is on. Use it. Age and rust are the tell.", failCondition: "Fuse board, rust at the heater base, no pan.", askOutLoud: "May I photograph the panel and the heater sticker?", minutes: 2, captionHint: "Panel", priority: 6 });
  }
  drafts.push({ room: "Street", title: "Twenty seconds of video with audio in the quietest claimed room", why: "Saturday noon is not the bus. The slider for noise is a prompt, not a meter.", failCondition: "You can already hear the street with the sash down.", askOutLoud: "Any nightlife or mechanical noise complaints on this line?", minutes: 1, captionHint: "Noise video", priority: 5 });
  return scaleMinutes(drafts.map((d, i) => ({ ...d, id: uid("shot"), checked: false, order: i + 1 })), showing.minutes);
}

export function generateScript(showing: Showing, opts?: { template?: Template; rushed?: boolean }): Shot[] {
  if (opts?.rushed) {
    const remaining = showing.shots.filter((s) => !s.checked && !s.skipped);
    const keep = remaining.sort((a, b) => b.priority - a.priority).slice(0, Math.max(3, Math.ceil(remaining.length * 0.4))).map((s, i) => ({ ...s, order: i + 1, why: `Broker is rushing you. Kept because: ${s.why}` }));
    const checked = showing.shots.filter((s) => s.checked);
    const dropped = remaining.filter((s) => !keep.some((k) => k.id === s.id)).map((s) => ({ ...s, skipped: true }));
    return scaleMinutes([...checked, ...keep, ...dropped].map((s, i) => ({ ...s, order: i + 1 })), Math.max(10, Math.floor(showing.minutes * 0.45) as Minutes) as Minutes);
  }
  if (opts?.template) {
    return scaleMinutes(opts.template.shots.map((s, i) => ({ ...s, id: uid("shot"), checked: false, skipped: false, order: i + 1 })), showing.minutes);
  }
  if (!showing.listingText.trim()) {
    const city = CITY_PLAYBOOKS[showing.city];
    return scaleMinutes(city.topShots.map((t, i) => ({ id: uid("shot"), room: `City shot ${i + 1}`, title: t.title, why: `${t.why} City-generic because no listing copy was pasted.`, failCondition: "The thing this shot is meant to catch is present.", askOutLoud: "Can we pause here while I take this?", minutes: 2, captionHint: t.title.slice(0, 24), priority: 10 - i, checked: false, order: i + 1 })), showing.minutes);
  }
  return baseShots(showing);
}

function visitCaptionBlob(showing: Showing): string {
  return showing.evidence.photos.map((p) => `${p.caption} ${p.kind}`.toLowerCase()).join(" | ");
}
function hasCaption(showing: Showing, re: RegExp): boolean {
  return showing.evidence.photos.some((p) => re.test(p.caption) || re.test(p.kind) || re.test(p.src));
}

function severityFrom(showing: Showing): { discrepancies: Brief["discrepancies"]; hardFails: string[]; midFails: string[] } {
  const tokens = listingTokens(showing.listingText);
  const caps = visitCaptionBlob(showing);
  const quotes = showing.evidence.brokerQuotes.toLowerCase();
  const discrepancies: Brief["discrepancies"] = [];
  const hardFails: string[] = [];
  const midFails: string[] = [];
  const notes = showing.evidence.notes.toLowerCase();
  const leak = hasCaption(showing, /sink|toe|kick|leak|dish|supply|under/) || /leak|sweat|stain|wet/.test(quotes) || /leak|wet|stain/.test(notes);
  if (leak) {
    const captioned = showing.evidence.photos.find((p) => /sink|toe|kick|under/i.test(p.caption));
    discrepancies.push({ claim: tokens.find((t) => t.token.includes("kitchen") || t.token.includes("updated")) ? `Kitchen (‘${tokens.find((t) => t.token.includes("kitchen") || t.token.includes("updated"))?.token}’)` : "Kitchen as photographed in the listing", evidence: captioned ? `Visit photo captioned ‘${captioned.caption}’. ${showing.evidence.brokerQuotes ? "Broker: " + showing.evidence.brokerQuotes.slice(0, 140) : "Wet or stained at the kick/supply."}` : "Visit notes or broker language point at a leak at the kick or supply.", severity: "high", dollarImpact: dollarFor("leak", showing) });
    midFails.push("kitchen leak");
  }
  const portable = hasCaption(showing, /portable|ac |a\/c|hose|window unit/) || /portable|window unit/.test(quotes + notes + caps);
  if (portable || (tokens.some((t) => t.token === "central air") && hasCaption(showing, /ac|cool|hvac/))) {
    discrepancies.push({ claim: "Central air", evidence: hasCaption(showing, /portable|hose/) ? "Visit photo of a portable or a hose in the window. Nameplate is not an air handler." : "Cooling claim in the listing; visit evidence does not show a condenser or air handler.", severity: "high", dollarImpact: dollarFor("ac", showing) });
    hardFails.push("portable-as-central");
  }
  const flex = tokens.some((t) => t.token === "flex" || t.token === "alcove") || hasCaption(showing, /flex|windowless|alcove|no window/);
  if (flex) {
    const illegal = hasCaption(showing, /windowless|no window|flex/) || /no window|flex/.test(notes);
    discrepancies.push({ claim: "Bedroom count / flex", evidence: illegal ? "Visit photos or notes show a claimed bedroom without an exterior window." : "Listing uses flex/alcove. Confirm the opening on site — script already queued this.", severity: illegal ? "high" : "mid", dollarImpact: dollarFor("flex", showing) });
    if (illegal) hardFails.push("illegal bedroom"); else midFails.push("flex language");
  }
  const damp = showing.city === "london" || hasCaption(showing, /sash|damp|condens|skirting|mould|mold/) || tokens.some((t) => t.token.includes("refresh") || t.token.includes("period"));
  if (damp && (hasCaption(showing, /sash|damp|condens|skirting/) || /damp|condens|paint/.test(quotes + notes))) {
    discrepancies.push({ claim: tokens.find((t) => t.token.includes("refresh")) ? "Recently refreshed" : "Period windows / dry interior", evidence: hasCaption(showing, /sash|skirting|damp/) ? "Visit photo on the sash or skirting. Condensation or tide mark in frame." : "Broker or notes point at damp; paint is not a damp course.", severity: "high", dollarImpact: dollarFor("damp", showing) });
    midFails.push("damp");
  }
  const egress = hasCaption(showing, /egress|one door|fire escape|second exit/) || /one door|no second|guest house/.test(notes + caps);
  if (egress) {
    discrepancies.push({ claim: "Sleeping-room egress", evidence: "Visit notes or photos: missing second way out of a sleeping room.", severity: "high", dollarImpact: "Not a dollar problem if this is a hard dealbreaker — it is a walk" });
    hardFails.push("egress");
  }
  if (showing.evidence.noise >= 7) {
    discrepancies.push({ claim: tokens.some((t) => t.token === "quiet") ? "Quiet" : "Livability / noise", evidence: `Noise slider ${showing.evidence.noise}/10 after the visit. Saturday noon is still not night, but this is already loud.`, severity: "mid", dollarImpact: "Unpriced until a weeknight — do not give this away in the ask" });
    midFails.push("noise");
  }
  if (showing.evidence.smell >= 7) {
    discrepancies.push({ claim: "Air / smell", evidence: `Smell slider ${showing.evidence.smell}/10. Cellar, riser, or paint-over-mildew until a photo behind furniture says otherwise.`, severity: "mid", dollarImpact: dollarFor("damp", showing) });
    midFails.push("smell");
  }
  if (discrepancies.length === 0) {
    if (showing.evidence.notesOnly || showing.evidence.photos.length === 0) {
      discrepancies.push({ claim: "Listing as written", evidence: showing.evidence.notes.trim() || "Notes-only brief. No visit photos, so concealment cannot be proven — only suspected from copy tokens.", severity: "mid", dollarImpact: "Hold 3–8% until photos exist" });
      midFails.push("unverified");
    } else {
      discrepancies.push({ claim: "Primary listing claims", evidence: `Visit photos (${showing.evidence.photos.map((p) => p.caption || p.kind).join(", ") || "uncaptioned"}) did not obviously contradict the copy. That is not the same as a pass — missing shots still matter.`, severity: "low", dollarImpact: "Ask only for what the missing shots might still hide" });
    }
  }
  return { discrepancies, hardFails, midFails };
}

function dollarFor(kind: "leak" | "ac" | "flex" | "damp", showing: Showing): string {
  const p = showing.price;
  const c = showing.currency;
  if (showing.priceKind === "sale") {
    const table = { leak: [Math.round(p * 0.01), Math.round(p * 0.025)], ac: [4000, 12000], flex: [Math.round(p * 0.06), Math.round(p * 0.14)], damp: [Math.round(p * 0.02), Math.round(p * 0.05)] }[kind];
    return `${money(table[0], c)}–${money(table[1], c)} off price, as a range`;
  }
  const table = { leak: [Math.round(p * 0.08), Math.round(p * 0.16)], ac: [Math.round(p * 0.1), Math.round(p * 0.2)], flex: [Math.round(p * 0.12), Math.round(p * 0.22)], damp: [Math.round(p * 0.08), Math.round(p * 0.16)] }[kind];
  return `${money(table[0], c)}–${money(table[1], c)}/mo off, or a repair in the lease`;
}

function verdictOf(showing: Showing, dealbreakers: Dealbreaker[], hardFails: string[], midFails: string[]): Brief["verdict"] {
  const hard = dealbreakers.filter((d) => d.enabled && showing.dealbreakerIds.includes(d.id) && d.severity === "hard");
  const legalBed = hard.some((d) => d.id === "db-legal-bed");
  const acHard = hard.some((d) => d.id === "db-ac");
  if (legalBed && hardFails.some((f) => f.includes("bedroom") || f === "egress")) return "WALK";
  if (acHard && hardFails.includes("portable-as-central")) return "WALK";
  if (hardFails.includes("egress") && legalBed) return "WALK";
  if (showing.evidence.gut <= 2 && hardFails.length > 0) return "WALK";
  if (midFails.length === 0 && hardFails.length === 0 && showing.evidence.gut >= 7 && showing.evidence.photos.length >= 3) return "OFFER";
  if (midFails.length === 0 && hardFails.length === 0 && !showing.evidence.notesOnly && showing.evidence.gut >= 6) return "OFFER";
  return "NEGOTIATE";
}

function photoPairs(showing: Showing): Brief["photoPairs"] {
  const listing = showing.listingPhotos;
  const visit = showing.evidence.photos;
  const pairs: Brief["photoPairs"] = [];
  for (const v of visit) {
    const match = listing.find((l) => l.kind === v.kind) || listing.find((l) => /kitchen|sink|toe/.test(v.kind + v.caption) && /kitchen|living/.test(l.kind + l.caption)) || listing[0];
    pairs.push({ listingSrc: match?.src, visitSrc: v.src, listingLabel: match ? `Listing: ${match.caption}` : "No listing still", visitLabel: `Visit: ${v.caption || v.kind}`, callout: calloutFor(v.caption || v.kind, showing) });
    if (pairs.length >= 3) break;
  }
  if (pairs.length === 0 && listing[0]) {
    pairs.push({ listingSrc: listing[0].src, listingLabel: `Listing: ${listing[0].caption}`, visitLabel: "No visit still", callout: "Notes-only or photos not uploaded. Concealment cannot be proven from this pair." });
  }
  return pairs;
}

function calloutFor(caption: string, showing: Showing): string {
  const c = caption.toLowerCase();
  if (/sink|under/.test(c)) return "Caption ‘Under sink’ (or similar). Treat the cabinet floor as evidence, not as a prop.";
  if (/toe|kick/.test(c)) return "Floor-height kick. If the listing was standing-height, this is the crop.";
  if (/sash|condens/.test(c)) return "Sash in frame. London heuristic: condensation is a bill, not character.";
  if (/damp|skirting|mould|mold/.test(c)) return "Paint over a tide mark is concealment until a report says otherwise.";
  if (/ac|portable|hose/.test(c)) return "This is the cooling. If the listing said central, the claim is dead.";
  if (/flex|windowless|alcove/.test(c)) return "A room without an exterior window is not a bedroom in this brief.";
  if (/gfci|outlet/.test(c)) return "TEST/RESET missing next to water is the electric that was never opened.";
  if (/slope|hall|marble/.test(c)) return "Slope toward a wet wall is a leak story.";
  return `Visit still captioned ‘${caption}’ at ${showing.address}. Tie your ask to this frame.`;
}

function dealbreakerResults(showing: Showing, dealbreakers: Dealbreaker[]): Brief["dealbreakerResults"] {
  const caps = visitCaptionBlob(showing) + showing.evidence.notes + showing.evidence.brokerQuotes;
  return dealbreakers.filter((d) => d.enabled && showing.dealbreakerIds.includes(d.id)).map((d) => {
    let result: "pass" | "fail" | "unknown" = "unknown";
    let note = "Not enough visit evidence.";
    if (d.id === "db-legal-bed") {
      if (/windowless|no window|no second|one door|flex/.test(caps)) { result = "fail"; note = "Visit language or photos point at a missing window or missing second exit."; }
      else if (showing.evidence.photos.some((p) => /bedroom|window|egress/i.test(p.caption))) { result = "pass"; note = "A bedroom/window shot exists and does not show a missing opening. Still a heuristic."; }
    } else if (d.id === "db-ac") {
      if (/portable|hose|window unit/.test(caps)) { result = "fail"; note = "Portable or window unit in the visit record."; }
      else if (/nameplate|condenser|air handler/.test(caps)) { result = "pass"; note = "Equipment photographed."; }
    } else if (d.id === "db-parking") {
      if (/tandem|blocks|unlit|permit/.test(caps)) { result = "fail"; note = "Distance or tandem in the notes."; }
    } else if (d.id === "db-quiet") {
      if (showing.evidence.noise >= 7) { result = "fail"; note = `Noise slider ${showing.evidence.noise}/10.`; }
      else { result = "unknown"; note = showing.evidence.photos.length === 0 ? "No night sample." : "Daytime showing. Unproven."; }
    } else if (d.id === "db-wd") {
      if (/hookup only|no washer|no w\/d|hookups only/.test(caps)) { result = "fail"; note = "Hookups or none, not machines."; }
    } else if (d.id === "db-pets") {
      result = /pet|cat|dog/.test(showing.listingText.toLowerCase() + caps) ? "pass" : "unknown";
      note = result === "pass" ? "Language in the listing or visit. Get it in the lease." : "Ask in the clarifying text.";
    }
    return { id: d.id, label: d.label, result, note };
  });
}

function cityFlags(showing: Showing): Brief["cityFlags"] {
  const city = CITY_PLAYBOOKS[showing.city];
  const flags = city.heuristics.map((h) => ({ flag: h.split(":")[0] ?? h, heuristic: `${h} Advisory only.` }));
  for (const t of listingTokens(showing.listingText).slice(0, 3)) {
    flags.push({ flag: `Listing token: “${t.token}”`, heuristic: `${t.note} Advisory only.` });
  }
  return flags.slice(0, 5);
}

function ranges(showing: Showing, verdict: Brief["verdict"], midFails: string[]): Pick<Brief, "walkAwayRange" | "bestCaseRange" | "dollarAsk"> {
  const ask = showing.price;
  const c = showing.currency;
  const unit = showing.priceKind === "rent" ? "/mo" : "";
  if (verdict === "WALK") return { walkAwayRange: `${priceLabel(ask, showing.priceKind, c)} as-is`, bestCaseRange: "Do not bid on this unit unless the hard fail is actually a copy error", dollarAsk: undefined };
  const low = Math.round(ask * (midFails.includes("kitchen leak") || midFails.includes("damp") ? 0.84 : 0.9));
  const high = Math.round(ask * 0.95);
  if (verdict === "OFFER") return { walkAwayRange: `${priceLabel(Math.round(ask * 1.04), showing.priceKind, c)} if a bidding war starts without repairs`, bestCaseRange: `${priceLabel(ask, showing.priceKind, c)} with the missing shots still checked off`, dollarAsk: showing.priceKind === "rent" ? "Asking rent, contingent on the remaining shots" : "Ask, with inspection" };
  return { walkAwayRange: `${priceLabel(ask, showing.priceKind, c)} as-is`, bestCaseRange: `${priceLabel(low, showing.priceKind, c)}–${priceLabel(high, showing.priceKind, c)} with the defect in the paper`, dollarAsk: `${money(ask - high, c)}–${money(ask - low, c)}${unit} off, as a range` };
}

function sentences(showing: Showing, verdict: Brief["verdict"], discrepancies: Brief["discrepancies"], weaker: boolean): string {
  const addr = showing.address;
  const price = priceLabel(showing.price, showing.priceKind, showing.currency);
  const top = discrepancies[0];
  const one = verdict === "WALK" ? `${addr} fails a hard condition on this profile. ${top ? top.claim + " does not survive the visit." : "The visit killed a dealbreaker."}` : verdict === "OFFER" ? `${addr} at ${price} mostly survived contact with the floor. The remaining risk is the shots you still skipped, not a hidden disaster in the stills you have.` : `${addr} is livable at a different number than ${price}. ${top ? top.claim + " is the reason." : "The visit produced a defect, not a vibe."}`;
  const two = top ? `${top.evidence}` : "Visit notes are thin. Do not invent a stain that is not in the file.";
  const three = showing.evidence.brokerQuotes.trim() ? `Broker on site: ${showing.evidence.brokerQuotes.trim().slice(0, 180)}` : `Gut ${showing.evidence.gut}/10, smell ${showing.evidence.smell}/10, noise ${showing.evidence.noise}/10. Sliders are not meters; they are how you remember the room on the train.`;
  const four = verdict === "WALK" ? "Do not send a concession text. Send a clarifying question only if you might have the wrong read, otherwise leave." : weaker ? "Notes-only brief — labeled weaker. The ask is a range, and it should stay wide until photos exist." : `Same-afternoon move: ${verdict === "OFFER" ? "send the clarifying question, then apply if the remaining shots are clean." : "send the concession with the photo attached before dinner."}`;
  return `${one} ${two} ${three} ${four}`;
}

export function generateBrief(showing: Showing, dealbreakers: Dealbreaker[]): Brief {
  const weaker = showing.evidence.notesOnly || showing.evidence.photos.length === 0;
  const { discrepancies, hardFails, midFails } = severityFrom(showing);
  const verdict = verdictOf(showing, dealbreakers, hardFails, midFails);
  const missing = showing.shots.filter((s) => !s.checked).map((s) => s.title);
  const r = ranges(showing, verdict, midFails);
  const confBase = weaker ? 42 : 70;
  const confidence = Math.max(28, Math.min(92, confBase + showing.evidence.photos.length * 4 - missing.length * 3 - (showing.evidence.gut < 4 ? 6 : 0)));
  return { verdict, verdictSentences: sentences(showing, verdict, discrepancies, weaker), confidence, confidenceWhy: weaker ? "Notes-only or photo-thin. Concealment is suspected from listing tokens, not proven in stills." : `Tied to ${showing.evidence.photos.length} visit still${showing.evidence.photos.length === 1 ? "" : "s"}${showing.evidence.brokerQuotes ? " and a broker quote" : ""}. Missing shots: ${missing.length}. This is not an inspection.`, discrepancies, photoPairs: photoPairs(showing), dealbreakerResults: dealbreakerResults(showing, dealbreakers), cityFlags: cityFlags(showing), ...r, missingShots: missing, generatedAt: new Date().toISOString(), weaker };
}

export function generateTexts(showing: Showing, brief: Brief): TextDraft[] {
  const addr = showing.address;
  const top = brief.discrepancies[0];
  const photoBit = showing.evidence.photos[0] ? ` (see visit photo captioned ‘${showing.evidence.photos[0].caption || showing.evidence.photos[0].kind}’)` : "";
  const clarify = top ? `Hi — I was at ${addr}. ${top.claim} does not match what I saw${photoBit}. ${top.evidence.slice(0, 160)} Was this disclosed, and is there a report or a repair ticket I can see today?` : `Hi — I was at ${addr}. A couple of listing claims I could not verify on site. Can you confirm what was actually replaced in the last update, and whether any leaks or damp treatments are on file?`;
  const concession = brief.verdict === "WALK" ? `I’m not going to price a hard fail on this unit. If I have the wrong read — wrong door, wrong equipment, a permit I missed — send the photo and I will come back. Otherwise please pull me from the list.` : brief.dollarAsk ? `I can sign on a short clock at a number that prices this in: ${brief.dollarAsk} relative to ${priceLabel(showing.price, showing.priceKind, showing.currency)}, or asking rent/price with the repair in writing before keys. ${brief.bestCaseRange}. Which is cleaner for the owner?` : `I can proceed this week if the remaining defects are in the paper. I will not apply at the asking figure as-is.`;
  const deadline = brief.verdict === "WALK" ? `I have other showings on the calendar (including a Saturday East Village slot). This one is a pass for me as shown.` : `I have another listing on the clock. I can apply to ${addr} today if we have a yes or no on the range by 6pm. I’m not bluffing a unit I haven’t seen — the other showing is already on my board.`;
  return [
    { id: uid("txt"), kind: "clarify", title: "Clarifying question", body: clarify },
    { id: uid("txt"), kind: "concession", title: "Concession request", body: concession },
    { id: uid("txt"), kind: "deadline", title: "Deadline / other-listing pressure", body: deadline },
  ];
}

export function defaultClaimsFromText(text: string, city: CitySlug): { label: string; value: string; riskToken?: boolean }[] {
  const tokens = listingTokens(text);
  const claims: { label: string; value: string; riskToken?: boolean }[] = tokens.slice(0, 6).map((t) => ({ label: "Token", value: t.token, riskToken: true }));
  if (!claims.length && text.trim()) claims.push({ label: "Copy", value: text.trim().slice(0, 80), riskToken: false });
  claims.push({ label: "City", value: city });
  return claims;
}
