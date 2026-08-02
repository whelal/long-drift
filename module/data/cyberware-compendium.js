// module/data/cyberware-compendium.js
// Expanded core-book inspired cyberware catalog for drag/drop installation.

function cyberware(name, img, slot, humanityLoss, armor, integrity, slotsUsed, cost, description, note = "", category = "", optionSlots = 0, isOption = false, requiresFoundation = "") {
  return {
    name,
    type: "cyberware",
    img,
    system: {
      slot,
      humanityLoss,
      cost,
      armor,
      integrity,
      slotsUsed,
      category,
      optionSlots,
      isOption,
      requiresFoundation,
      description,
      note
    }
  };
}

export const CPR_CYBERWARE_COMPENDIUM = [

  // ── NEURALWARE ────────────────────────────────────────────────────────────
  cyberware(
    "Neural Link",
    "icons/svg/clockwork.svg",
    "head", 7, 0, 6, 1, 500,
    "Baseline interface implant that unlocks many advanced cyberware options.",
    "Core neural backbone",
    "Neuralware", 5, false, ""
  ),
  cyberware(
    "Interface Plugs",
    "icons/svg/clockwork.svg",
    "head", 7, 0, 6, 1, 500,
    "Hardline data ports for direct machine connection and vehicle control.",
    "Commonly mounted near neck or wrist",
    "Neuralware", 0, true, "Neural Link"
  ),
  cyberware(
    "Chipware Socket",
    "icons/svg/clockwork.svg",
    "head", 7, 0, 5, 1, 500,
    "Expansion socket that accepts a single chipware module.",
    "Neural Link option",
    "Neuralware", 1, true, "Neural Link"
  ),
  cyberware(
    "Internal Agent",
    "icons/svg/item-bag.svg",
    "head", 3, 0, 4, 1, 1000,
    "Embedded personal assistant and comms stack with local storage.",
    "Headware utility",
    "Neuralware", 0, false, ""
  ),
  cyberware(
    "Radar/Sonar Implant",
    "icons/svg/aura.svg",
    "head", 7, 0, 6, 2, 1000,
    "Short-range active scanning that maps nearby movement and obstructions.",
    "Advanced sensor suite",
    "Neuralware", 0, false, ""
  ),

  // ── CYBEROPTICS ───────────────────────────────────────────────────────────
  cyberware(
    "Cybereye",
    "icons/svg/eye.svg",
    "head", 7, 0, 6, 1, 100,
    "Replacement optical platform that supports visual augment upgrades.",
    "Vision enhancement base",
    "Cyberoptics", 3, false, ""
  ),
  cyberware(
    "Low-Light Vision Upgrade",
    "icons/svg/eye.svg",
    "head", 3, 0, 4, 1, 100,
    "Enhances visibility in dim conditions without external illumination.",
    "Cybereye option",
    "Cyberoptics", 0, true, "Cybereye"
  ),
  cyberware(
    "Targeting Scope",
    "icons/svg/target.svg",
    "head", 3, 0, 4, 1, 500,
    "Digital reticle assist for precise ranged shot placement.",
    "Cybereye option",
    "Cyberoptics", 0, true, "Cybereye"
  ),

  // ── CYBERAUDIO ────────────────────────────────────────────────────────────
  cyberware(
    "Cyberaudio Suite",
    "icons/svg/sound.svg",
    "head", 3, 0, 5, 1, 500,
    "Enhanced hearing package with directional and filtered capture.",
    "Auditory enhancement",
    "Cyberaudio", 3, false, ""
  ),

  // ── CYBERARM ─────────────────────────────────────────────────────────────
  cyberware(
    "Cyberarm (Right)",
    "icons/svg/bones.svg",
    "rArm", 7, 7, 9, 2, 500,
    "Right arm replacement chassis with modular hardpoints.",
    "Limb replacement",
    "Cyberarm", 4, false, ""
  ),
  cyberware(
    "Cyberarm (Left)",
    "icons/svg/bones.svg",
    "lArm", 7, 7, 9, 2, 500,
    "Left arm replacement chassis with modular hardpoints.",
    "Limb replacement",
    "Cyberarm", 4, false, ""
  ),
  // Standalone arm cyberweapons — can install in a meat arm, not options
  cyberware(
    "Big Knucks",
    "icons/svg/combat.svg",
    "arm", 3, 0, 5, 1, 100,
    "Armored knuckles. Medium Melee Weapon.",
    "Can be installed as only piece of Cyberware in a meat arm. Concealable.",
    "Cyberarm", 0, false, ""
  ),
  cyberware(
    "Rippers",
    "icons/weapons/fist/claw-grey-black.webp",
    "arm", 3, 0, 6, 1, 500,
    "Carbo-glass claws. Medium Melee Weapon.",
    "Can be installed as only piece of Cyberware in a meat arm. Concealable.",
    "Cyberarm", 0, false, ""
  ),
  cyberware(
    "Scratchers",
    "icons/weapons/fist/claw-grey-black.webp",
    "arm", 2, 0, 4, 1, 100,
    "Carbo-glass fingernails. Light Melee Weapon.",
    "Can be installed as only piece of Cyberware in a meat arm. Concealable.",
    "Cyberarm", 0, false, ""
  ),
  cyberware(
    "Slice N Dice",
    "icons/svg/upgrade.svg",
    "arm", 3, 0, 5, 1, 500,
    "Monofilament whip implanted in the thumb. Medium Melee Weapon.",
    "Can be installed as only piece of Cyberware in a meat arm. Concealable.",
    "Cyberarm", 0, false, ""
  ),
  cyberware(
    "Wolvers",
    "icons/weapons/fist/claw-grey-black.webp",
    "arm", 7, 0, 7, 1, 500,
    "Retractable forearm blades designed for sudden close-quarters attacks.",
    "Install in either arm",
    "Cyberarm", 0, false, ""
  ),
  // Cyberarm options — require an installed Cyberarm
  cyberware(
    "Subdermal Grip",
    "icons/svg/upgrade.svg",
    "arm", 3, 0, 5, 1, 100,
    "Palm reinforcement and texture control for improved weapon handling.",
    "Install in either arm",
    "Cyberarm", 0, true, "Neural Link"
  ),
  cyberware(
    "Popup Shield",
    "icons/svg/shield.svg",
    "arm", 7, 4, 7, 3, 500,
    "Deployable forearm shield panel for emergency cover.",
    "Install in either arm",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Tool Hand",
    "icons/svg/upgrade.svg",
    "arm", 3, 0, 6, 1, 100,
    "Micro-tool package in the hand for field repairs and bypass work.",
    "Install in either arm",
    "Cyberarm", 0, false, ""
  ),
  cyberware(
    "Standard Hand",
    "icons/svg/bones.svg",
    "arm", 2, 0, 5, 0, 100,
    "Standard cybernetic hand.",
    "Does not consume an Option Slot. Can be installed in a meat arm.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Grapple Hand",
    "icons/svg/net.svg",
    "arm", 3, 0, 5, 1, 100,
    "Fires hand and grapple line up to 30m. Cannot be used as a weapon.",
    "Requires Cyberarm.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Medscanner",
    "icons/svg/heal.svg",
    "arm", 7, 0, 6, 2, 500,
    "Medscanner installed in Cyberarm. +2 to First Aid and Paramedic.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Popup Grenade Launcher",
    "icons/weapons/guns/gun-pistol-flintlock.webp",
    "arm", 7, 0, 7, 2, 500,
    "Single shot Grenade Launcher installed in Cyberarm. Weapon can be concealed.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Popup Melee Weapon",
    "icons/weapons/swords/swords-short.webp",
    "arm", 7, 0, 7, 2, 500,
    "Any Light, Medium, or Heavy Melee Weapon installed in Cyberarm. Concealable even if not normally concealable.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Popup Ranged Weapon",
    "icons/weapons/guns/gun-pistol-brass.webp",
    "arm", 7, 0, 7, 2, 500,
    "Any One Handed Ranged Weapon installed in Cyberarm. Concealable even if not normally concealable.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Quick Change Mount",
    "icons/svg/clockwork.svg",
    "arm", 7, 0, 5, 1, 100,
    "Allows user to remove or install a Cyberarm as an Action.",
    "Requires Cyberarm.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Shoulder Cam",
    "icons/svg/eye.svg",
    "arm", 7, 0, 5, 2, 500,
    "Video camera mounted in shoulder. Can be concealed.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Techscanner",
    "icons/svg/upgrade.svg",
    "arm", 7, 0, 6, 2, 500,
    "Techscanner installed in Cyberarm. +2 to multiple TECH-based Skills.",
    "Requires Cyberarm, takes 2 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Cyberdeck (Cyberarm)",
    "icons/svg/clockwork.svg",
    "arm", 3, 0, 7, 3, 500,
    "Cyberdeck installed in Cyberarm.",
    "Requires Cyberarm, takes 3 Option Slots.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Hardened Shielding",
    "icons/svg/shield.svg",
    "arm", 3, 0, 8, 1, 1000,
    "Cyberlimb and installed options cannot be rendered inoperable by EMP or Non-Black ICE effects.",
    "Requires Cyberarm or Cyberleg.",
    "Cyberarm", 0, true, "Cyberarm"
  ),
  cyberware(
    "Plastic Covering",
    "icons/svg/item-bag.svg",
    "arm", 0, 0, 3, 0, 100,
    "Plastic coating for Cyberlimb. Wide variety of colors and patterns.",
    "Does not take an Option Slot. Requires Cyberarm or Cyberleg.",
    "Fashionware", 0, true, "Cyberarm"
  ),
  cyberware(
    "Realskinn Covering",
    "icons/svg/item-bag.svg",
    "arm", 0, 0, 3, 0, 500,
    "Artificial skin coating for Cyberlimb.",
    "Does not take an Option Slot. Requires Cyberarm or Cyberleg.",
    "Fashionware", 0, true, "Cyberarm"
  ),
  cyberware(
    "Superchrome Covering",
    "icons/svg/item-bag.svg",
    "arm", 0, 0, 3, 0, 1000,
    "Shiny metallic coating. +2 to Wardrobe and Style.",
    "Does not take an Option Slot. Requires Cyberarm or Cyberleg.",
    "Fashionware", 0, true, "Cyberarm"
  ),

  // ── CYBERLEG ─────────────────────────────────────────────────────────────
  cyberware(
    "Cyberleg (Right)",
    "icons/svg/wingfoot.svg",
    "rLeg", 3, 6, 9, 2, 100,
    "Right leg replacement with reinforced servos and sockets.",
    "Limb replacement",
    "Cyberleg", 3, false, ""
  ),
  cyberware(
    "Cyberleg (Left)",
    "icons/svg/wingfoot.svg",
    "lLeg", 3, 6, 9, 2, 100,
    "Left leg replacement with reinforced servos and sockets.",
    "Limb replacement",
    "Cyberleg", 3, false, ""
  ),
  // Standalone leg cyberweapon — can install in a meat leg
  cyberware(
    "Talon Foot",
    "icons/svg/wingfoot.svg",
    "leg", 3, 0, 5, 1, 500,
    "Blade mounted in foot. Light Melee Weapon.",
    "Can be installed as only piece of Cyberware in a meat leg. Concealable.",
    "Cyberleg", 0, false, ""
  ),
  // Cyberleg options — require an installed Cyberleg
  cyberware(
    "Jump Booster",
    "icons/svg/wingfoot.svg",
    "leg", 3, 0, 8, 2, 500,
    "High-output actuator package tuned for vertical and long jumps.",
    "Must be paired — install in both Cyberlegs",
    "Cyberleg", 0, true, "Cyberleg"
  ),
  cyberware(
    "Grip Foot",
    "icons/svg/wingfoot.svg",
    "leg", 3, 0, 6, 1, 500,
    "Magnetic and gecko-surface contact pads for improved footing.",
    "Must be paired — install in both Cyberlegs",
    "Cyberleg", 0, true, "Cyberleg"
  ),
  cyberware(
    "Standard Foot",
    "icons/svg/wingfoot.svg",
    "leg", 2, 0, 5, 0, 100,
    "Standard cybernetic foot.",
    "Does not consume an Option Slot. Can be installed in a meat leg.",
    "Cyberleg", 0, true, "Cyberleg"
  ),
  cyberware(
    "Skate Foot",
    "icons/svg/wingfoot.svg",
    "leg", 3, 0, 6, 1, 500,
    "Inline skates built into feet. Increases movement by 6m when using Run Action.",
    "Requires two Cyberlegs, must be paired.",
    "Cyberleg", 0, true, "Cyberleg"
  ),
  cyberware(
    "Web Foot",
    "icons/svg/wingfoot.svg",
    "leg", 3, 0, 5, 1, 500,
    "Thin webbing between toes. Negates movement penalty when swimming.",
    "Requires two Cyberlegs, must be paired.",
    "Cyberleg", 0, true, "Cyberleg"
  ),

  // ── INTERNAL CYBERWARE ────────────────────────────────────────────────────
  cyberware(
    "Nasal Filters",
    "icons/svg/mystery-man.svg",
    "torso", 2, 0, 4, 1, 100,
    "Filters airborne toxins and contaminants. Immune to contact and inhaled poisons.",
    "Internal Cyberware",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Subdermal Armor",
    "icons/svg/shield.svg",
    "torso", 14, 11, 12, 2, 1000,
    "Integrated ballistic plating bonded under the skin.",
    "Body armor cyberware",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Biomonitor",
    "icons/svg/heal.svg",
    "torso", 7, 0, 7, 1, 1000,
    "Tracks critical vitals and can alert medtech contacts.",
    "Medical telemetry",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Gills",
    "icons/svg/whale.svg",
    "torso", 7, 0, 7, 2, 1000,
    "Respiratory conversion package for extended underwater operation.",
    "Aquatic adaptation",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Pain Editor",
    "icons/svg/mystery-man.svg",
    "torso", 14, 0, 8, 2, 1000,
    "Filters pain response to preserve combat effectiveness under stress.",
    "Neural dampening suite",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Kerenzikov Booster",
    "icons/svg/lightning.svg",
    "torso", 7, 0, 7, 2, 500,
    "Reflex acceleration package tuned for sudden reaction windows.",
    "Speedware class",
    "Internal Cyberware", 0, false, ""
  ),
  cyberware(
    "Sandevistan",
    "icons/svg/lightning.svg",
    "torso", 14, 0, 8, 3, 1000,
    "Burst-time action overclock for brief periods of extreme speed.",
    "High-end speedware",
    "Internal Cyberware", 0, false, ""
  ),

  // ── FASHIONWARE ───────────────────────────────────────────────────────────
  cyberware(
    "Skinwatch",
    "icons/svg/clockwork.svg",
    "torso", 3, 0, 5, 1, 100,
    "Subdermal display surface for notifications and telemetry.",
    "Lifestyle implant",
    "Fashionware", 0, false, ""
  )
];
