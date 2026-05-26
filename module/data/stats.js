export const RED_STATS = [
  { key: "INT", label: "Intelligence" },
  { key: "REF", label: "Reflexes" },
  { key: "DEX", label: "Dexterity" },
  { key: "TECH", label: "Technical Ability" },
  { key: "COOL", label: "Cool" },
  { key: "WILL", label: "Willpower" },
  { key: "LUCK", label: "Luck" },
  { key: "MOVE", label: "Move" },
  { key: "BODY", label: "Body" },
  { key: "EMP", label: "Empathy" }
];

export const STAT_DEFAULTS = {
  INT: 5,
  REF: 5,
  DEX: 5,
  TECH: 5,
  COOL: 5,
  WILL: 5,
  LUCK: 5,
  MOVE: 5,
  BODY: 5,
  EMP: 5
};

// Backward-compatible export name retained while schema transitions to RED.
export const CP2020_STATS = RED_STATS;
