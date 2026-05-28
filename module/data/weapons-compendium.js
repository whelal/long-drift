// module/data/weapons-compendium.js
// Canonical CPR personal-scale weapons.
// Source: Cyberpunk RED core rulebook pp.340-341, GM screen.
// All weapons are weapon type archetypes — not named variants.
// Named variants (Stolbovoy ST-5 etc.) are not included per RTG policy.

import { WEAPON_RANGE_DVS } from "./weapon-ranges.js";

export const CPR_WEAPONS_COMPENDIUM = [

  // ── MELEE ──────────────────────────────────────────────────────────────
  {
    name: "Light Melee Weapon",
    type: "weapon",
    img: "icons/weapons/swords/sword-short.svg",
    system: {
      description: "Combat knife, tomahawk. Varies by type.",
      weaponType: "Melee",
      skill: "Melee Weapon",
      damage: "1d6",
      rof: 2,
      shots: 0,
      wa: 0,
      concealable: true,
      hands: 1,
      cost: 50,
      isMecha: false,
      pen: 0,
      note: "Melee damage ignores half SP (round up)."
    }
  },
  {
    name: "Medium Melee Weapon",
    type: "weapon",
    img: "icons/weapons/swords/sword-broad.svg",
    system: {
      description: "Baseball bat, crowbar, machete. Varies by type.",
      weaponType: "Melee",
      skill: "Melee Weapon",
      damage: "2d6",
      rof: 2,
      shots: 0,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 50,
      isMecha: false,
      pen: 0,
      note: "Melee damage ignores half SP (round up)."
    }
  },
  {
    name: "Heavy Melee Weapon",
    type: "weapon",
    img: "icons/weapons/swords/sword-guard.svg",
    system: {
      description: "Lead pipe, sword, spiked bat. Varies by type.",
      weaponType: "Melee",
      skill: "Melee Weapon",
      damage: "3d6",
      rof: 2,
      shots: 0,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 100,
      isMecha: false,
      pen: 0,
      note: "Melee damage ignores half SP (round up). BODY 8+ can wield one-handed."
    }
  },
  {
    name: "Very Heavy Melee Weapon",
    type: "weapon",
    img: "icons/weapons/axes/axe-battle.svg",
    system: {
      description: "Chainsaw, sledgehammer, naginata. Varies by type.",
      weaponType: "Melee",
      skill: "Melee Weapon",
      damage: "4d6",
      rof: 1,
      shots: 0,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      note: "Melee damage ignores half SP (round up). Cannot attack twice in one Action."
    }
  },

  // ── PISTOLS ────────────────────────────────────────────────────────────
  {
    name: "Medium Pistol",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol.svg",
    system: {
      description: "Standard sidearm.",
      weaponType: "Pistol",
      skill: "Handgun",
      damage: "2d6",
      rof: 2,
      shots: 12,
      wa: 0,
      concealable: true,
      hands: 1,
      cost: 50,
      isMecha: false,
      pen: 0,
      note: "Standard magazine: 12 (M Pistol)."
    }
  },
  {
    name: "Heavy Pistol",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol.svg",
    system: {
      description: "High-calibre sidearm.",
      weaponType: "Pistol",
      skill: "Handgun",
      damage: "3d6",
      rof: 2,
      shots: 8,
      wa: 0,
      concealable: true,
      hands: 1,
      cost: 100,
      isMecha: false,
      pen: 0,
      note: "Standard magazine: 8 (H Pistol)."
    }
  },
  {
    name: "Very Heavy Pistol",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol.svg",
    system: {
      description: "Hand cannon. Requires one hand but not concealable.",
      weaponType: "Pistol",
      skill: "Handgun",
      damage: "4d6",
      rof: 1,
      shots: 8,
      wa: 0,
      concealable: false,
      hands: 1,
      cost: 100,
      isMecha: false,
      pen: 0,
      note: "Standard magazine: 8 (VH Pistol)."
    }
  },

  // ── SMGs ───────────────────────────────────────────────────────────────
  {
    name: "SMG",
    type: "weapon",
    img: "icons/weapons/guns/gun-submachine.svg",
    system: {
      description: "Compact automatic weapon.",
      weaponType: "SMG",
      skill: "Handgun",
      damage: "2d6",
      rof: 1,
      shots: 30,
      wa: 0,
      concealable: true,
      hands: 1,
      cost: 100,
      isMecha: false,
      pen: 0,
      autofire: 3,
      note: "Autofire (3). Suppressive Fire. Standard magazine: 30 (M Pistol)."
    }
  },
  {
    name: "Heavy SMG",
    type: "weapon",
    img: "icons/weapons/guns/gun-submachine.svg",
    system: {
      description: "High-calibre compact automatic.",
      weaponType: "SMG",
      skill: "Handgun",
      damage: "3d6",
      rof: 1,
      shots: 40,
      wa: 0,
      concealable: false,
      hands: 1,
      cost: 100,
      isMecha: false,
      pen: 0,
      autofire: 3,
      note: "Autofire (3). Suppressive Fire. Standard magazine: 40 (H Pistol)."
    }
  },

  // ── LONG ARMS ──────────────────────────────────────────────────────────
  {
    name: "Shotgun",
    type: "weapon",
    img: "icons/weapons/guns/gun-blunderbuss.svg",
    system: {
      description: "Slug-loaded combat shotgun.",
      weaponType: "Shotgun",
      skill: "Shoulder Arms",
      damage: "5d6",
      rof: 1,
      shots: 4,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      note: "Shotgun Shell special rules. Standard magazine: 4."
    }
  },
  {
    name: "Assault Rifle",
    type: "weapon",
    img: "icons/weapons/guns/gun-automatic-assault.svg",
    system: {
      description: "Standard military rifle.",
      weaponType: "Assault Rifle",
      skill: "Shoulder Arms",
      damage: "5d6",
      rof: 1,
      shots: 25,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      autofire: 4,
      note: "Autofire (4). Suppressive Fire. Standard magazine: 25 (Rifle)."
    }
  },
  {
    name: "Sniper Rifle",
    type: "weapon",
    img: "icons/weapons/guns/gun-sniper.svg",
    system: {
      description: "Long-range precision rifle.",
      weaponType: "Sniper Rifle",
      skill: "Shoulder Arms",
      damage: "5d6",
      rof: 1,
      shots: 4,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      note: "Standard magazine: 4 (Rifle)."
    }
  },
  {
    name: "Bows & Crossbows",
    type: "weapon",
    img: "icons/weapons/bows/bow-simple-brown.svg",
    system: {
      description: "Archery weapons. Uses arrows.",
      weaponType: "Bow",
      skill: "Archery",
      damage: "4d6",
      rof: 1,
      shots: 0,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 100,
      isMecha: false,
      pen: 0,
      note: "Uses arrows. See Arrows special rules."
    }
  },

  // ── HEAVY WEAPONS ──────────────────────────────────────────────────────
  {
    name: "Grenade Launcher",
    type: "weapon",
    img: "icons/weapons/guns/gun-pistol-flintlock.svg",
    system: {
      description: "Under-barrel or standalone grenade launcher.",
      weaponType: "Grenade Launcher",
      skill: "Heavy Weapons",
      damage: "6d6",
      rof: 1,
      shots: 2,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      note: "Explosive. Standard magazine: 2 (Grenade). Burst area applies."
    }
  },
  {
    name: "Rocket Launcher",
    type: "weapon",
    img: "icons/weapons/guns/gun-bazooka.svg",
    system: {
      description: "Single-shot anti-vehicle rocket.",
      weaponType: "Rocket Launcher",
      skill: "Heavy Weapons",
      damage: "8d6",
      rof: 1,
      shots: 1,
      wa: 0,
      concealable: false,
      hands: 2,
      cost: 500,
      isMecha: false,
      pen: 0,
      note: "Single shot (Rocket). Explosive. Pen unaffected by range."
    }
  }
];
