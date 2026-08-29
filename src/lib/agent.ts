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

export const SCRIPT_TICKS = [
  "Reading claims",
  "Ranking failure points",
  "Building timed route",
  "Writing shot list",
] as const;

export const BRIEF_TICKS = [
  "Pair photos",
  "Concealment",
  "Dealbreakers + city heuristics",
  "Negotiation numbers",
] as const;

function scaleMinutes(shots: Shot[], minutes: Minutes): Shot[] {
  const sum = shots.reduce((s, x) => s + Math.max(1, x.priority), 0) || 1;
  let used = 0;
  const out = shots.map((s, i) => {
    const m =
      i === shots.length - 1
        ? Math.max(1, minutes - used)
        : Math.max(1, Math.round((s.priority / sum) * minutes));
    used += m;
    return { ...s, minutes: m };
  });
  return out;
}

function baseShots(showing: Showing): Shot[] {
  const tokens = listingTokens(showing.listingText);
  const city = CITY_PLAYBOOKS[showing.city];
  const drafts: Array<Omit<Shot, "id" | "checked" | "order" | "skipped">> = [];

  drafts.push({
    room: "Entry",
    title: "Door, lock, and the first 20 seconds",
    why: "You will do this door with shopping. Test the lock and anything that buzzes.",
    failCondition: "Lock you do not control, dead intercom, riser smell in the stair.",
    askOutLoud: "Who has keys to the street door, and does this buzzer reach the unit?",
    minutes: 1,
    captionHint: "Entry door",
    priority: 7,
  });

  drafts.push({
    room: "Claimed bedroom",
    title: "Full room from the door, then the window opening",
    why: city.legalBedroom.split(".")[0] + ".",
    failCondition: "No exterior window, borrowed light, or opening you cannot climb through.",
    askOutLoud: "Is this a legal sleeping room, and can I see it on the paperwork?",
    minutes: 2,
    captionHint: "Bedroom window",
    priority: 10,
  });

  if (showing.beds >= 2 || tokens.some((t) => t.token === "flex" || t.token === "alcove")) {
    drafts.push({
      room: "Bedroom 2 / flex",
      title: "Prove the second bedroom",
      why: "Flex is the expensive adjective. Count exterior windows, not bed icons.",
      failCondition: "Windowless, curtain wall, glass block, or a closet with a bed drawn on the plan.",
      askOutLoud: "When you say two bed, do you mean two legal sleeping rooms?",
      minutes: 2,
      captionHint: "Flex room",
      priority: 10,
    });
  }

  drafts.push({
    room: "Kitchen",
    title: "Toe-kick from the floor, then under-sink with flash",
    why: tokens.some((t) => t.token.includes("kitchen") || t.token.includes("updated"))
      ? "The listing uses an update token. New boxes on old shutoffs. Crop happens at standing height."
      : "Dishwashers and supplies leak onto the kick. Listing photos crop this.",
    failCondition: "Stain, swollen MDF, wet cardboard, supply-line bulge.",
    askOutLoud: "Has the dishwasher leaked, and were the lines replaced or wiped?",
    minutes: 3,
    captionHint: "Under sink",
    priority: 10,
  });

  drafts.push({
    room: "Hall",
    title: "Marble / bottle roll both directions",
    why: "Slope toward a wet wall is a leak or a joist story. Rugs exist to kill this shot.",
    failCondition: "Marble runs with intent; a door will not latch.",
    askOutLoud: "Any leaks from above this year?",
    minutes: 1,
    captionHint: "Hall slope",
    priority: 7,
  });

  drafts.push({
    room: "Bath",
    title: "GFCI at the water, and the caulk line",
    why: "Two-prong next to a tub means the electric was never opened. Fresh caulk is a costume.",
    failCondition: "No TEST/RESET near water; mildew under new caulk; spongey floor.",
    askOutLoud: "When was this bath last opened, not just recaulked?",
    minutes: 2,
    captionHint: "Bath GFCI",
    priority: 8,
  });

  if (showing.city === "los-angeles" || showing.city === "austin" || /central air|ac |a\/c/i.test(showing.listingText)) {
    drafts.push({
      room: "HVAC",
      title: "The actual cooling equipment, nameplate in frame",
      why: "LA + Austin heuristic: portable-as-central is a walk if that is a dealbreaker.",
      failCondition: "Rolling unit, window hose, or no condenser on the pad.",
      askOutLoud: "Where is the air handler, and did this hold last August?",
      minutes: 2,
      captionHint: "AC nameplate",
      priority: 10,
    });
  }

  if (showing.city === "chicago" || /heat|radiator|boiler/i.test(showing.listingText)) {
    drafts.push({
      room: "Heat",
      title: "Radiator vs air handler, plus the thermostat",
      why: "Chicago heuristic: listing heat claims vs the appliance in the room.",
      failCondition: "No heat in a claimed bedroom; boiler story with no access.",
      askOutLoud: "What actually heats this room, and who pays the gas?",
      minutes: 2,
      captionHint: "Heat source",
      priority: 8,
    });
  }

  if (showing.city === "london" || /sash|period|refreshed|damp/i.test(showing.listingText)) {
    drafts.push({
      room: "Sash / damp",
      title: "Sash operation and the skirting on the cold wall",
      why: "London heuristic: condensation language and paint over tide marks.",
      failCondition: "Painted shut, heavy condensation, bubbling at the board.",
      askOutLoud: "Has there been a damp report, and may I see it?",
      minutes: 3,
      captionHint: "Sash",
      priority: 10,
    });
  }

  drafts.push({
    room: "Egress",
    title: "Second way out, full run",
    why: city.egress.split(".")[0] + ".",
    failCondition: "One door on a guest house; fire escape painted shut; locked well grate.",
    askOutLoud: "If the kitchen is on fire, how does someone leave the sleeping room?",
    minutes: 2,
    captionHint: "Second exit",
    priority: 9,
  });

  if (/parking/i.test(showing.listingText) || showing.dealbreakerIds.includes("db-parking")) {
    drafts.push({
      room: "Parking",
      title: "The stall, the number, the walk, the light",
      why: "Parking included is a distance. Time the walk.",
      failCondition: "Tandem, four blocks, unlit, or a permit you will not get.",
      askOutLoud: "Which painted number is mine after dark?",
      minutes: 2,
      captionHint: "Parking stall",
      priority: 7,
    });
  }

  drafts.push({
    room: "Ceilings",
    title: "Raking light on patches",
    why: "A rectangle of different texture is a leak from above.",
    failCondition: "Patch over a bed or table; stain returning through new paint.",
    askOutLoud: "Whose leak was that, and did it return?",
    minutes: 1,
    captionHint: "Ceiling patch",
    priority: 6,
  });

  if (showing.mechanicalComfort !== "low") {
    drafts.push({
      room: "Mechanicals",
      title: "Panel, shutoffs, water heater if you can reach them",
      why: "Comfort with mechanicals is on. Use it. Age and rust are the tell.",
      failCondition: "Fuse board, rust at the heater base, no pan.",
      askOutLoud: "May I photograph the panel and the heater sticker?",
      minutes: 2,
      captionHint: "Panel",
      priority: 6,
    });
  }

  drafts.push({
    room: "Street",
    title: "Twenty seconds of video with audio in the quietest claimed room",
    why: "Saturday noon is not the bus. The slider for noise is a prompt, not a meter.",
    failCondition: "You can already hear the street with the sash down.",
    askOutLoud: "Any nightlife or mechanical noise complaints on this line?",
    minutes: 1,
    captionHint: "Noise video",
    priority: 5,
  });

  const shots: Shot[] = drafts.map((d, i) => ({
    ...d,
    id: uid("shot"),
    checked: false,
    order: i + 1,
  }));

  return scaleMinutes(shots, showing.minutes);
}

export function generateScript(
  showing: Showing,
  opts?: { template?: Template; rushed?: boolean },
): Shot[] {
  if (opts?.rushed) {
    const remaining = showing.shots.filter((s) => !s.checked && !s.skipped);
    const keep = remaining
      .sort((a, b) => b.priority - a.priority)
      .slice(0, Math.max(3, Math.ceil(remaining.length * 0.4)))
      .map((s, i) => ({
        ...s,
        order: i + 1,
        why: `Broker is rushing you. Kept because: ${s.why}`,
      }));
    const checked = showing.shots.filter((s) => s.checked);
    const dropped = remaining
      .filter((s) => !keep.some((k) => k.id === s.id))
      .map((s) => ({ ...s, skipped: true }));
    return scaleMinutes(
      [...checked, ...keep, ...dropped].map((s, i) => ({ ...s, order: i + 1 })),
      Math.max(10, Math.floor(showing.minutes * 0.45) as Minutes) as Minutes,
    );
  }

  if (opts?.template) {
    return scaleMinutes(
      opts.template.shots.map((s, i) => ({
        ...s,
        id: uid("shot"),
        checked: false,
        skipped: false,
        order: i + 1,
      })),
      showing.minutes,
    );
  }

  if (!showing.listingText.trim()) {
    const city = CITY_PLAYBOOKS[showing.city];
    const generic: Shot[] = city.topShots.map((t, i) => ({
      id: uid("shot"),
      room: `City shot ${i + 1}`,
      title: t.title,
      why: `${t.why} City-generic because no listing copy was pasted.`,
      failCondition: "The thing this shot is meant to catch is present.",
      askOutLoud: "Can we pause here while I take this?",
      minutes: 2,
      captionHint: t.title.slice(0, 24),
      priority: 10 - i,
      checked: false,
      order: i + 1,
    }));
    return scaleMinutes(generic, showing.minutes);
  }

  return baseShots(showing);
}
