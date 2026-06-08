// module/data/weapon-ranges.js
export const WEAPON_RANGE_DVS = {
  "Pistol": {
    label: "Pistol",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 13 },
      { label: "7–12m",    dv: 15 },
      { label: "13–25m",   dv: 20 },
      { label: "26–50m",   dv: 25 },
      { label: "51–100m",  dv: 30 },
      { label: "101–200m", dv: 30 },
      { label: "201–400m", dv: null },
      { label: "401–800m", dv: null }
    ]
  },
  "SMG": {
    label: "SMG",
    hasAutofire: true,
    autofireMax: 3,
    autofireDVs: [
      { label: "0–6m",    dv: 20 },
      { label: "7–12m",   dv: 17 },
      { label: "13–25m",  dv: 20 },
      { label: "26–50m",  dv: 25 },
      { label: "51–100m", dv: 30 }
    ],
    ranges: [
      { label: "0–6m",     dv: 15 },
      { label: "7–12m",    dv: 13 },
      { label: "13–25m",   dv: 15 },
      { label: "26–50m",   dv: 20 },
      { label: "51–100m",  dv: 25 },
      { label: "101–200m", dv: 25 },
      { label: "201–400m", dv: 30 },
      { label: "401–800m", dv: null }
    ]
  },
  "Shotgun": {
    label: "Shotgun (Slug)",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 13 },
      { label: "7–12m",    dv: 15 },
      { label: "13–25m",   dv: 20 },
      { label: "26–50m",   dv: 25 },
      { label: "51–100m",  dv: 30 },
      { label: "101–200m", dv: 35 },
      { label: "201–400m", dv: null },
      { label: "401–800m", dv: null }
    ]
  },
  "Assault Rifle": {
    label: "Assault Rifle",
    hasAutofire: true,
    autofireMax: 4,
    autofireDVs: [
      { label: "0–6m",    dv: 22 },
      { label: "7–12m",   dv: 20 },
      { label: "13–25m",  dv: 17 },
      { label: "26–50m",  dv: 20 },
      { label: "51–100m", dv: 25 }
    ],
    ranges: [
      { label: "0–6m",     dv: 17 },
      { label: "7–12m",    dv: 16 },
      { label: "13–25m",   dv: 15 },
      { label: "26–50m",   dv: 13 },
      { label: "51–100m",  dv: 15 },
      { label: "101–200m", dv: 20 },
      { label: "201–400m", dv: 25 },
      { label: "401–800m", dv: 30 }
    ]
  },
  "Sniper Rifle": {
    label: "Sniper Rifle",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 30 },
      { label: "7–12m",    dv: 25 },
      { label: "13–25m",   dv: 25 },
      { label: "26–50m",   dv: 20 },
      { label: "51–100m",  dv: 15 },
      { label: "101–200m", dv: 16 },
      { label: "201–400m", dv: 17 },
      { label: "401–800m", dv: 20 }
    ]
  },
  "Bow": {
    label: "Bows & Crossbows",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 15 },
      { label: "7–12m",    dv: 13 },
      { label: "13–25m",   dv: 15 },
      { label: "26–50m",   dv: 17 },
      { label: "51–100m",  dv: 20 },
      { label: "101–200m", dv: 22 },
      { label: "201–400m", dv: null },
      { label: "401–800m", dv: null }
    ]
  },
  "Grenade Launcher": {
    label: "Grenade Launcher",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 16 },
      { label: "7–12m",    dv: 15 },
      { label: "13–25m",   dv: 15 },
      { label: "26–50m",   dv: 17 },
      { label: "51–100m",  dv: 20 },
      { label: "101–200m", dv: 22 },
      { label: "201–400m", dv: 25 },
      { label: "401–800m", dv: null }
    ]
  },
  "Rocket Launcher": {
    label: "Rocket Launcher",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 17 },
      { label: "7–12m",    dv: 16 },
      { label: "13–25m",   dv: 15 },
      { label: "26–50m",   dv: 15 },
      { label: "51–100m",  dv: 20 },
      { label: "101–200m", dv: 20 },
      { label: "201–400m", dv: 25 },
      { label: "401–800m", dv: 30 }
    ]
  },
  "Thrown": {
    label: "Thrown",
    hasAutofire: false,
    ranges: [
      { label: "0–6m",     dv: 13 },
      { label: "7–12m",    dv: 15 },
      { label: "13–25m",   dv: 20 },
      { label: "26–50m",   dv: 25 },
      { label: "51–100m",  dv: null },
      { label: "101–200m", dv: null },
      { label: "201–400m", dv: null },
      { label: "401–800m", dv: null }
    ]
  },
  "Melee": {
    label: "Melee",
    hasAutofire: false,
    ranges: [
      { label: "1m",       dv: 15 },
      { label: "—",        dv: null },
      { label: "—",        dv: null },
      { label: "—",        dv: null },
      { label: "—",        dv: null },
      { label: "—",        dv: null },
      { label: "—",        dv: null },
      { label: "—",        dv: null }
    ]
  }
};

function _parseBandLabel(label) {
  const rangeMatch = label.match(/^(\d+)[–\-](\d+)m$/);
  if (rangeMatch) return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
  const singleMatch = label.match(/^(\d+)m$/);
  if (singleMatch) return { min: 0, max: Number(singleMatch[1]) };
  return null;
}

/**
 * Returns the applicable DV and range band label for a weapon type at a given distance.
 * @param {string} weaponType  Key from WEAPON_RANGE_DVS (e.g. "Pistol", "SMG")
 * @param {number} distanceMeters  Distance in meters
 * @returns {{ dv: number|null, rangeLabel: string }|null}  null if weaponType unknown
 */
export function getDVForRange(weaponType, distanceMeters) {
  const entry = WEAPON_RANGE_DVS[weaponType];
  if (!entry) return null;
  for (const band of entry.ranges) {
    if (!band.label || band.label === "—") continue;
    const bounds = _parseBandLabel(band.label);
    if (!bounds) continue;
    if (distanceMeters >= bounds.min && distanceMeters <= bounds.max) {
      return { dv: band.dv, rangeLabel: band.label };
    }
  }
  return { dv: null, rangeLabel: "Out of Range" };
}

export const WEAPON_DAMAGE = {
  "Medium Pistol":    { damage: "2d6", rof: 2 },
  "Heavy Pistol":     { damage: "3d6", rof: 2 },
  "Very Heavy Pistol":{ damage: "4d6", rof: 1 },
  "SMG":              { damage: "2d6", rof: 1 },
  "Heavy SMG":        { damage: "3d6", rof: 1 },
  "Shotgun (Slug)":   { damage: "5d6", rof: 1 },
  "Assault Rifle":    { damage: "5d6", rof: 1 },
  "Sniper Rifle":     { damage: "5d6", rof: 1 },
  "Bows & Crossbows": { damage: "4d6", rof: 1 },
  "Grenade Launcher": { damage: "6d6", rof: 1 },
  "Rocket Launcher":  { damage: "8d6", rof: 1 },
  "Light Melee":      { damage: "1d6", rof: 2 },
  "Medium Melee":     { damage: "2d6", rof: 2 },
  "Heavy Melee":      { damage: "3d6", rof: 2 },
  "Very Heavy Melee": { damage: "4d6", rof: 1 }
};