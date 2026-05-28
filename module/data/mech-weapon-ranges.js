// module/data/mech-weapon-ranges.js

// Range bands are personal-scale DVs applied to mech-scale distances.
// Multipliers per weapon class: light ×3, medium ×5, missile ×10,
// heavy ×15, capital ×30. Pen rating drives post-hit resolution via
// the Pen/AC system — these DVs determine whether the hit lands at all.

export const MECH_WEAPON_RANGE_DVS = {
  "Point Defense": {
    label: "Point Defense",
    scaleMultiplier: 3,
    hasAutofire: true,
    autofireMax: 3,
    note: "Anti-missile / anti-infantry. Autofire only at close range.",
    ranges: [
      { label: "0–18m",    dv: 15 },
      { label: "19–36m",   dv: 13 },
      { label: "37–75m",   dv: 15 },
      { label: "76–150m",  dv: 20 },
      { label: "151–300m", dv: 25 },
      { label: "301–600m", dv: null },
      { label: "601m+",    dv: null }
    ]
  },
  "Light Autocannon": {
    label: "Light Autocannon",
    scaleMultiplier: 3,
    hasAutofire: true,
    autofireMax: 3,
    note: "Standard light mech primary. Maps to SMG DV progression.",
    ranges: [
      { label: "0–18m",    dv: 15 },
      { label: "19–36m",   dv: 13 },
      { label: "37–75m",   dv: 15 },
      { label: "76–150m",  dv: 20 },
      { label: "151–300m", dv: 25 },
      { label: "301–600m", dv: 25 },
      { label: "601–900m", dv: null }
    ]
  },
  "Particle Cannon": {
    label: "Particle Cannon",
    scaleMultiplier: 5,
    hasAutofire: false,
    note: "Standard light mech long-range primary. Maps to sniper rifle DV progression.",
    ranges: [
      { label: "0–30m",    dv: 30 },
      { label: "31–60m",   dv: 25 },
      { label: "61–125m",  dv: 25 },
      { label: "126–250m", dv: 20 },
      { label: "251–500m", dv: 15 },
      { label: "501–1000m",dv: 16 },
      { label: "1001m+",   dv: null }
    ]
  },
  "Railgun": {
    label: "Railgun",
    scaleMultiplier: 15,
    hasAutofire: false,
    note: "Heavy long-range kinetic. Maps to sniper rifle DVs at extended mech scale.",
    ranges: [
      { label: "0–90m",     dv: 30 },
      { label: "91–180m",   dv: 25 },
      { label: "181–375m",  dv: 20 },
      { label: "376–750m",  dv: 15 },
      { label: "751–1500m", dv: 16 },
      { label: "1501–3000m",dv: 17 },
      { label: "3001m+",    dv: null }
    ]
  },
  "Missile (Smart)": {
    label: "Missile (Smart)",
    scaleMultiplier: 10,
    hasAutofire: false,
    note: "Guided. No minimum range. Maps to rocket launcher DV progression.",
    ranges: [
      { label: "0–60m",    dv: 17 },
      { label: "61–120m",  dv: 16 },
      { label: "121–250m", dv: 15 },
      { label: "251–500m", dv: 15 },
      { label: "501–1000m",dv: 20 },
      { label: "1001–2000m",dv: 20 },
      { label: "2001–4000m",dv: 25 }
    ]
  },
  "Missile (Dumb)": {
    label: "Missile (Dumb)",
    scaleMultiplier: 10,
    hasAutofire: false,
    note: "Unguided. -2 WA at long range. Pen unaffected by range.",
    ranges: [
      { label: "0–60m",    dv: 20 },
      { label: "61–120m",  dv: 18 },
      { label: "121–250m", dv: 17 },
      { label: "251–500m", dv: 17 },
      { label: "501–1000m",dv: 22 },
      { label: "1001–2000m",dv: 25 },
      { label: "2001m+",   dv: null }
    ]
  },
  "Heavy Cannon": {
    label: "Heavy Cannon",
    scaleMultiplier: 15,
    hasAutofire: false,
    note: "Medium/heavy mech primary. Maps to assault rifle DV progression.",
    ranges: [
      { label: "0–90m",     dv: 17 },
      { label: "91–180m",   dv: 16 },
      { label: "181–375m",  dv: 15 },
      { label: "376–750m",  dv: 13 },
      { label: "751–1500m", dv: 15 },
      { label: "1501–3000m",dv: 20 },
      { label: "3001–6000m",dv: 25 }
    ]
  },
  "Plasma Lance": {
    label: "Plasma Lance (Melee)",
    scaleMultiplier: 1,
    hasAutofire: false,
    note: "Melee only. Damage ignores half SP per CPR melee rule.",
    ranges: [
      { label: "Melee (reach)", dv: 15 },
      { label: "—", dv: null },
      { label: "—", dv: null },
      { label: "—", dv: null },
      { label: "—", dv: null },
      { label: "—", dv: null },
      { label: "—", dv: null }
    ]
  },
  "Anti-Ship": {
    label: "Anti-Ship Weapon",
    scaleMultiplier: 30,
    hasAutofire: false,
    note: "Capital scale. Only usable against AC 4–5 targets. Transitions to ship combat rules beyond 5000m.",
    ranges: [
      { label: "0–180m",    dv: 20 },
      { label: "181–360m",  dv: 18 },
      { label: "361–750m",  dv: 15 },
      { label: "751–1500m", dv: 13 },
      { label: "1501–3000m",dv: 15 },
      { label: "3001–5000m",dv: 20 },
      { label: "5001m+",    dv: null }
    ]
  }
};

// Canonical mech weapon damage values for The Long Drift.
// These are campaign-specific, not sourced from a single rulebook.
export const MECH_WEAPON_DAMAGE = {
  "Point Defense":    { damage: "4d6",  pen: 1, rof: 3 },
  "Light Autocannon": { damage: "8d6",  pen: 2, rof: 2 },
  "Particle Cannon":  { damage: "8d6",  pen: 2, rof: 2 },
  "Railgun":          { damage: "12d6", pen: 4, rof: 1 },
  "Missile (Smart)":  { damage: "8d6",  pen: 3, rof: 1 },
  "Missile (Dumb)":   { damage: "10d6", pen: 3, rof: 1 },
  "Heavy Cannon":     { damage: "12d6", pen: 3, rof: 1 },
  "Plasma Lance":     { damage: "7d6",  pen: 2, rof: 1 },
  "Anti-Ship":        { damage: "18d6", pen: 5, rof: 1 }
};