// module/data/cyberware-compendium.js
// Expanded core-book inspired cyberware catalog for drag/drop installation.

function cyberware(name, img, slot, humanityLoss, armor, integrity, spaces, cost, description, note = "") {
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
      spaces,
      description,
      note
    }
  };
}

export const CPR_CYBERWARE_COMPENDIUM = [
  cyberware(
    "Neural Link",
    "icons/svg/circuitry.svg",
    "head",
    7,
    0,
    6,
    1,
    500,
    "Baseline interface implant that unlocks many advanced cyberware options.",
    "Core neural backbone"
  ),
  cyberware(
    "Interface Plugs",
    "icons/svg/circuitry.svg",
    "head",
    7,
    0,
    6,
    1,
    500,
    "Hardline data ports for direct machine connection and vehicle control.",
    "Commonly mounted near neck or wrist"
  ),
  cyberware(
    "Cybereye",
    "icons/svg/eye.svg",
    "head",
    7,
    0,
    6,
    1,
    100,
    "Replacement optical platform that supports visual augment upgrades.",
    "Vision enhancement base"
  ),
  cyberware(
    "Low-Light Vision Upgrade",
    "icons/svg/eye.svg",
    "head",
    3,
    0,
    4,
    1,
    100,
    "Enhances visibility in dim conditions without external illumination.",
    "Cybereye option"
  ),
  cyberware(
    "Targeting Scope",
    "icons/svg/target.svg",
    "head",
    3,
    0,
    4,
    1,
    500,
    "Digital reticle assist for precise ranged shot placement.",
    "Cybereye option"
  ),
  cyberware(
    "Audio Suite",
    "icons/svg/sound.svg",
    "head",
    3,
    0,
    5,
    1,
    500,
    "Enhanced hearing package with directional and filtered capture.",
    "Auditory enhancement"
  ),
  cyberware(
    "Internal Agent",
    "icons/svg/item-bag.svg",
    "head",
    3,
    0,
    4,
    1,
    1000,
    "Embedded personal assistant and comms stack with local storage.",
    "Headware utility"
  ),
  cyberware(
    "Radar/Sonar Implant",
    "icons/svg/aura.svg",
    "head",
    7,
    0,
    6,
    2,
    1000,
    "Short-range active scanning that maps nearby movement and obstructions.",
    "Advanced sensor suite"
  ),
  cyberware(
    "Subdermal Grip",
    "icons/svg/upgrade.svg",
    "arm",
    3,
    0,
    5,
    1,
    100,
    "Palm reinforcement and texture control for improved weapon handling.",
    "Install in either arm"
  ),
  cyberware(
    "Cyberarm (Right)",
    "icons/svg/bones.svg",
    "rArm",
    7,
    7,
    9,
    2,
    500,
    "Right arm replacement chassis with modular hardpoints.",
    "Limb replacement"
  ),
  cyberware(
    "Cyberarm (Left)",
    "icons/svg/bones.svg",
    "lArm",
    7,
    7,
    9,
    2,
    500,
    "Left arm replacement chassis with modular hardpoints.",
    "Limb replacement"
  ),
  cyberware(
    "Wolvers",
    "icons/svg/claw.svg",
    "arm",
    7,
    0,
    7,
    1,
    500,
    "Retractable forearm blades designed for sudden close-quarters attacks.",
    "Install in either arm"
  ),
  cyberware(
    "Popup Shield",
    "icons/svg/shield.svg",
    "arm",
    7,
    4,
    7,
    2,
    500,
    "Deployable forearm shield panel for emergency cover.",
    "Install in either arm"
  ),
  cyberware(
    "Tool Hand",
    "icons/svg/wrench.svg",
    "arm",
    3,
    0,
    6,
    1,
    100,
    "Micro-tool package in the hand for field repairs and bypass work.",
    "Install in either arm"
  ),
  cyberware(
    "Cyberleg (Right)",
    "icons/svg/wingfoot.svg",
    "rLeg",
    7,
    6,
    9,
    2,
    500,
    "Right leg replacement with reinforced servos and sockets.",
    "Limb replacement"
  ),
  cyberware(
    "Cyberleg (Left)",
    "icons/svg/wingfoot.svg",
    "lLeg",
    7,
    6,
    9,
    2,
    500,
    "Left leg replacement with reinforced servos and sockets.",
    "Limb replacement"
  ),
  cyberware(
    "Jump Booster",
    "icons/svg/wingfoot.svg",
    "legs",
    7,
    0,
    8,
    2,
    500,
    "High-output actuator package tuned for vertical and long jumps.",
    "Install in either leg"
  ),
  cyberware(
    "Grip Foot",
    "icons/svg/wingfoot.svg",
    "leg",
    3,
    0,
    6,
    1,
    100,
    "Magnetic and gecko-surface contact pads for improved footing.",
    "Install in either leg"
  ),
  cyberware(
    "Subdermal Armor",
    "icons/svg/shield.svg",
    "torso",
    14,
    11,
    12,
    2,
    1000,
    "Integrated ballistic plating bonded under the skin.",
    "Body armor cyberware"
  ),
  cyberware(
    "Skinwatch",
    "icons/svg/clockwork.svg",
    "torso",
    3,
    0,
    5,
    1,
    100,
    "Subdermal display surface for notifications and telemetry.",
    "Lifestyle implant"
  ),
  cyberware(
    "Biomonitor",
    "icons/svg/heart.svg",
    "torso",
    7,
    0,
    7,
    1,
    1000,
    "Tracks critical vitals and can alert medtech contacts.",
    "Medical telemetry"
  ),
  cyberware(
    "Gills",
    "icons/svg/water.svg",
    "torso",
    7,
    0,
    7,
    2,
    1000,
    "Respiratory conversion package for extended underwater operation.",
    "Aquatic adaptation"
  ),
  cyberware(
    "Pain Editor",
    "icons/svg/mystery-man.svg",
    "torso",
    14,
    0,
    8,
    2,
    1000,
    "Filters pain response to preserve combat effectiveness under stress.",
    "Neural dampening suite"
  ),
  cyberware(
    "Kerenzikov Booster",
    "icons/svg/lightning.svg",
    "torso",
    7,
    0,
    7,
    2,
    500,
    "Reflex acceleration package tuned for sudden reaction windows.",
    "Speedware class"
  ),
  cyberware(
    "Sandevistan",
    "icons/svg/lightning.svg",
    "torso",
    14,
    0,
    8,
    3,
    1000,
    "Burst-time action overclock for brief periods of extreme speed.",
    "High-end speedware"
  )
];
