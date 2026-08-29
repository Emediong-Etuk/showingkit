import type { CityPlaybook, CitySlug } from "./types";

export const CITY_PLAYBOOKS: Record<CitySlug, CityPlaybook> = {
  nyc: {
    slug: "nyc",
    name: "New York City",
    shortName: "NYC",
    fingerprint:
      "Windowless rooms sold as bedrooms, illegal partitions, and ‘flex’ that fails egress.",
    legalBedroom:
      "A legal bedroom in NYC generally needs a window to the exterior or a legal court, not a shaft covered by a grate and not a borrowed light through a glass block. Windowless ‘flex’ rooms are almost never bedrooms under the housing code. Listings still count them. Heuristic, not a determination.",
    egress:
      "Every sleeping room should have a second way out — typically a legal window of usable size, not a decorative slit. Garden-level units and railroad apartments often fail this. Fire escapes that are painted shut or blocked by AC units are a fail, not a vibe.",
    patterns:
      "Toe-kick stains in ‘new’ kitchens in pre-war walk-ups. Patch texture on ceilings after leaks from upstairs. Converted parlors with a hollow-core partition. ‘Parking included’ that is a lot four blocks away. Radiators that bang at 5 a.m. sold as ‘heat included.’",
    topShots: [
      { title: "Every claimed bedroom, from the door, showing the window", why: "If there is no exterior window, it is not a bedroom in this city." },
      { title: "Window opening: sash up, measure the clear opening", why: "Egress size, not ‘there is glass.’" },
      { title: "Under-sink and dishwasher toe-kick, flash on", why: "Listing photos crop this. Leaks hide here." },
      { title: "Hallway marble / bottle roll, both directions", why: "Slope toward a neighbor is a leak or a joist story." },
      { title: "Bathroom GFCI and the outlet nearest the tub", why: "Pre-war stock still ships two-prong plates next to water." },
      { title: "Fire escape from inside and from the street", why: "Blocked, rusted, or painted shut is a habitability flag." },
      { title: "Partition wall: tap it, photograph both sides and the ceiling joint", why: "Unpermitted flex walls stop short of the original plaster." },
      { title: "Entry door, lock set, and intercom working", why: "Buzzer theater is common. Test it on the way in and out." },
    ],
    redFlags: [
      { phrase: "flex", means: "A room that is not a legal bedroom. Count windows, not adjectives." },
      { phrase: "garden level", means: "Below grade: damp, light, egress, and street noise through the sidewalk." },
      { phrase: "cozy", means: "Small, often dark. Measure wall-to-wall. Photograph the window from the bed wall." },
      { phrase: "recently updated", means: "Paint and hardware. Ask what was opened: plumbing, electric, roof." },
      { phrase: "alcove", means: "A sleeping nook without a door or a window. Not a bedroom." },
      { phrase: "heat and hot water included", means: "Included is not the same as working. Ask which months it failed last year." },
    ],
    heuristics: [
      "Windowless rooms are not bedrooms (NYC heuristic).",
      "Railroad apartments: confirm two means of egress from the rear room.",
      "‘New kitchen’ in a pre-war walk-up: photograph the toe-kick and shutoffs.",
      "Broker open houses hide slope with area rugs. Bring a marble.",
    ],
    currency: "USD",
  },
  "los-angeles": {
    slug: "los-angeles",
    name: "Los Angeles",
    shortName: "LA",
    fingerprint:
      "Portable AC sold as central air, parking that is a driveway two parcels over, guest-house egress.",
    legalBedroom:
      "A sleeping room still needs a legal egress window or a door to the exterior. Converted garages and ‘ADU energy’ listings skip this. Count actual openings you can climb through, not clerestory slits.",
    egress:
      "Guest houses and backyard units often have one door and no second exit. If a fire starts in the kitchenette, you are in a box. Hillside units add a deck that is not a rated exit.",
    patterns:
      "‘Central air’ that is a portable unit with a hose in the slider. ‘Parking included’ that is tandem on a slope or a street permit. Stucco cracks at the slab. Water heaters in hall closets without combustion air. Wildfire ash in window tracks.",
    topShots: [
      { title: "The actual cooling equipment, nameplate in frame", why: "Portable, window, mini-split, or true air handler. Words lie." },
      { title: "Every exterior door and the path around the building", why: "Second egress. Guest houses fail this constantly." },
      { title: "Parking stall: number painted, distance, and the walk to the door", why: "‘On site’ can mean a lot you will not use after dark." },
      { title: "Window tracks and sills, close, flash on", why: "Ash, rot, and failed weep holes." },
      { title: "Water heater closet: stand, strap, and T&P drain", why: "Unstrapped heaters walk in quakes." },
      { title: "Slab and stucco at grade, all four sides if you can", why: "Moisture and settlement show at the bottom two feet." },
      { title: "ADU / garage conversion: original header and the new partition", why: "Unpermitted conversions hide in the ceiling line." },
      { title: "Street at night-noise proxy: video 20 seconds with audio", why: "LA listings are shot at 10 a.m. on a Tuesday." },
    ],
    redFlags: [
      { phrase: "central air", means: "Demand to see the air handler or the condenser. Portables are not central." },
      { phrase: "parking included", means: "Photograph the stall and walk the distance with a timer." },
      { phrase: "guest house", means: "One-exit boxes. Check second egress and laundry hookups." },
      { phrase: "recently updated", means: "Paint over slab cracks and window rot." },
      { phrase: "cozy", means: "Small, often a converted garage with one window." },
      { phrase: "ADU", means: "Ask for the permit. Photograph the original garage door header." },
    ],
    heuristics: [
      "AC reality: nameplate or it is a story (LA + Austin heuristic).",
      "Parking distance is a deal term, not a perk.",
      "Guest houses: one door is a walk if you need a legal bedroom.",
    ],
    currency: "USD",
  },
  chicago: {
    slug: "chicago",
    name: "Chicago",
    shortName: "Chicago",
    fingerprint:
      "Back porches, radiator vs ‘central heat’ claims, and brick two-flats that leak at the lintels.",
    legalBedroom:
      "Sleeping rooms need proper windows. Garden apartments and ‘garden’ two-flats sell rooms that look onto a well. That is not the same as a street window. Confirm the opening and the well drain.",
    egress:
      "Rear porches and back stairs are the second exit in this city. Rot, missing rails, and locked gates show up in winter. Photograph the whole run from yard to your door.",
    patterns:
      "Steam radiators sold as ‘central heat.’ Boiler in the basement that the listing never mentions. Ice dams and lintel rust. Vintage ‘updated kitchen’ with the original galvanized stack. Alley parking that is a snow story from December to March.",
    topShots: [
      { title: "Rear porch and back stair, full run, winter damage", why: "This is your second exit. Chicago two-flats live or die here." },
      { title: "Heat source: radiator, baseboard, or air handler, plus the thermostat", why: "Listing heat claims vs what is actually in the rooms." },
      { title: "Basement boiler / mechanicals if accessible", why: "Age, leaks, and who pays the gas." },
      { title: "Window wells and lintels on the garden level", why: "Rusted lintels and drowned wells." },
      { title: "Kitchen stack and under-sink, flash on", why: "Galvanized drain + food disposal is a clog waiting." },
      { title: "Storm windows / sash operation on a cold day", why: "Single-pane plus wind off the lake is a bill." },
      { title: "Alley parking and the gate in daylight", why: "Included parking that you will not dig out." },
      { title: "Entry vestibule and the original tile slope to the drain", why: "Salt and melt water eat this first." },
    ],
    redFlags: [
      { phrase: "central heat", means: "Radiators are not forced air. Ask what the boiler last did." },
      { phrase: "garden", means: "Below grade, well windows, damp." },
      { phrase: "recently updated", means: "Cabinets. The porch and the boiler were not." },
      { phrase: "parking included", means: "Alley pad. Photograph and ask about snow contracts." },
      { phrase: "cozy", means: "Small, often the rear room off the porch." },
      { phrase: "vintage charm", means: "Single pane, original stack, knob-and-tube until proven otherwise." },
    ],
    heuristics: [
      "Porch / back-stair is the second egress (Chicago heuristic).",
      "Radiator vs listing heat claims: photograph the appliance, not the adjective.",
      "Garden two-flats: well drains and lintel rust before you talk about quartz.",
    ],
    currency: "USD",
  },
  austin: {
    slug: "austin",
    name: "Austin",
    shortName: "Austin",
    fingerprint:
      "AC that cannot keep 78° in August, slab movement, and parking that is a crushed-granite pad.",
    legalBedroom:
      "Sleeping rooms still need an egress opening. Converted porches and ‘office flex’ rooms in 1970s ranch houses often have a single high window. Measure the opening.",
    egress:
      "One-story ranch is honest about doors until someone enclosed the garage. Check the garage-to-house door and whether the bedroom behind it has a window you can actually use.",
    patterns:
      "HVAC tonnage undersized for additions. Foundation piers mentioned in a sentence at the bottom of the listing. ‘Parking included’ that is a ribbon driveway for two cars that will not fit. Water heaters in attics. Spray foam hiding roof decks you cannot inspect.",
    topShots: [
      { title: "HVAC: outdoor condenser, indoor air handler, filter slot, thermostat", why: "August is the inspector. Nameplate tons vs the addition." },
      { title: "Slab: brick line, interior door trims, and a marble on the hall", why: "Movement shows as cracked brick and doors that catch." },
      { title: "Every window in claimed bedrooms, opening measured", why: "Egress, not atmosphere." },
      { title: "Parking: both cars, the fence, the street overflow", why: "Distance and tandem lies." },
      { title: "Attic hatch: decking, bath fans dumping into the attic, foam", why: "Moisture and undersized returns live here." },
      { title: "Water heater: pan, drain, and expansion", why: "Attic heaters fail onto kitchens." },
      { title: "Grade and downspouts at the slab", why: "Austin clay wants to dump water against the house." },
      { title: "Addition seam: roof line and interior floor transition", why: "The ‘new kitchen’ was a porch. The AC does not know that." },
    ],
    redFlags: [
      { phrase: "central air", means: "Ask age, last service, and whether it held last August. Photograph the nameplate." },
      { phrase: "recently updated", means: "Cosmetic. Foundation and HVAC are the bill." },
      { phrase: "parking included", means: "Count cars, photograph the pad, walk the overflow." },
      { phrase: "flex", means: "Office, porch, or garage. Not a bedroom until the window agrees." },
      { phrase: "cozy", means: "Small, often the original 2/1 with a slick addition." },
      { phrase: "piers", means: "Movement already happened. Photograph doors and brick." },
    ],
    heuristics: [
      "AC reality and parking distance (Austin heuristic).",
      "Slab + clay: marble the hall and photograph door latches.",
      "Additions without extra tons are a summer problem, not a spring one.",
    ],
    currency: "USD",
  },
  london: {
    slug: "london",
    name: "London",
    shortName: "London",
    fingerprint:
      "Single-glaze sashes, condensation language, and ‘recently refreshed’ paint over damp.",
    legalBedroom:
      "A room advertised as a bedroom should have a window that opens to outside air. Inner rooms, ‘box rooms,’ and light-well only rooms are common in converted terraces and mansion blocks. Count openings, not bed outlines on a floor plan.",
    egress:
      "Converted houses stack bedrooms on the top floor with a single stair. Sash windows that are painted shut are not a fire exit. Check restrictors, locks, and whether you can actually get the lower sash up.",
    patterns:
      "Condensation on single glazing sold as ‘character sashes.’ Fresh paint over tide marks. ‘Garden flat’ that is a below-grade rear extension. Mould on the external wall behind the wardrobe. Letting photos taken in July for a January move-in.",
    topShots: [
      { title: "Every sash: condensation, operation, and the staff bead", why: "Single glaze + failed weights = damp and a heating bill." },
      { title: "External wall behind furniture, flash on, skirting close-up", why: "Paint over damp. Smell is not enough; photograph the tide mark." },
      { title: "Bathroom extract: does it run, where does it dump", why: "Many dump into the void. Mould follows." },
      { title: "Garden flat: floor at the rear doors, and the drain outside", why: "Below-grade rear extensions hold water." },
      { title: "Meter cupboard and the consumer unit", why: "Old fuse boards in converted houses." },
      { title: "Communal stair and the actual front door lock", why: "Mansion-block security is a story until you test it." },
      { title: "Heating: boiler age, radiators in every claimed room", why: "‘Gas central heating’ that skips the box room." },
      { title: "Window restrictors and secondary glazing, if any", why: "Noise and heat. Street-facing sashes fail both." },
    ],
    redFlags: [
      { phrase: "recently refreshed", means: "Paint. Often over damp. Photograph skirting and the external wall." },
      { phrase: "recently updated", means: "Same as refreshed. Ask what was actually replaced." },
      { phrase: "garden flat", means: "Damp, light, and privacy. Check the rear extension floor." },
      { phrase: "cozy", means: "Box room. Measure it. Find the window." },
      { phrase: "period features", means: "Single glaze, original sashes, drafts." },
      { phrase: "bills included", means: "Cap? Who sets the thermostat in a house share?" },
    ],
    heuristics: [
      "Damp / condensation language (London heuristic).",
      "‘Recently refreshed’ is a concealment token until the skirting says otherwise.",
      "Sash operation is a habitability shot, not a pretty one.",
    ],
    currency: "GBP",
  },
};

export const CITY_LIST = Object.values(CITY_PLAYBOOKS);
