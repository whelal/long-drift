export const LONG_DRIFT_CORE_POWERS = [
  {
    name: "Overclock",
    type: "spell",
    system: {
      school: "Interface",
      cost: 2,
      test: "INT",
      effect: "Push your rig or cyberdeck beyond limits for a short burst of speed and throughput."
    }
  },
  {
    name: "Signal Jam",
    type: "spell",
    system: {
      school: "Interface",
      cost: 3,
      test: "INT",
      effect: "Disrupt local comms and targeting feeds in a short radius."
    }
  },
  {
    name: "Static Field",
    type: "spell",
    system: {
      school: "Tech",
      cost: 2,
      test: "INT",
      effect: "Project a crackling control zone that slows movement and interferes with precision actions."
    }
  },
  {
    name: "Kinetic Screen",
    type: "spell",
    system: {
      school: "Tech",
      cost: 2,
      test: "INT",
      effect: "Generate a temporary defensive barrier that absorbs incoming damage."
    }
  },
  {
    name: "Mood Spike",
    type: "spell",
    system: {
      school: "Neural",
      cost: 2,
      test: "WILL",
      effect: "Briefly destabilize a target's emotional state, making social checks against them easier."
    }
  }
];

// Legacy alias retained temporarily for compatibility with older imports.
export const WITCHER_SIGNS = LONG_DRIFT_CORE_POWERS;
