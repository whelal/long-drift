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