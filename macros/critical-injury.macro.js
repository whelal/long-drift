// macros/critical-injury.macro.js
// Source: Cyberpunk RED GM screen
// Triggered when 2+ dice show 6s on a damage roll.
// Roll 2d6 and read result. All injuries deal +5 bonus damage.

export const CRITICAL_INJURIES_BODY = {
  2:  { name: "Dismembered Arm",  effect: "Items in hand dropped. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" },
  3:  { name: "Dismembered Hand", effect: "Items in hand dropped. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" },
  4:  { name: "Collapsed Lung",   effect: "-2 to MOVE (min 1). Base Death Save Penalty +1.", quickFix: "Paramedic DV15", treatment: "Surgery DV15" },
  5:  { name: "Broken Ribs",      effect: "Moving further than 4m on foot re-suffers Critical Injury bonus damage at end of Turn.", quickFix: "Paramedic DV13", treatment: "Paramedic DV15 or Surgery DV13" },
  6:  { name: "Broken Arm",       effect: "Arm cannot be used. Drop items in that hand immediately.", quickFix: "Paramedic DV13", treatment: "Paramedic DV15 or Surgery DV13" },
  7:  { name: "Foreign Object",   effect: "Moving further than 4m on foot re-suffers Critical Injury bonus damage at end of Turn.", quickFix: "First Aid or Paramedic DV13", treatment: "Quick Fix removes" },
  8:  { name: "Broken Leg",       effect: "-4 to MOVE (min 1).", quickFix: "Paramedic DV13", treatment: "Paramedic DV15 or Surgery DV13" },
  9:  { name: "Torn Muscle",      effect: "-2 to Melee Attacks.", quickFix: "First Aid or Paramedic DV13", treatment: "Quick Fix removes" },
  10: { name: "Spinal Injury",    effect: "Next Turn: Move Action only, no other Actions. Base Death Save Penalty +1.", quickFix: "Paramedic DV15", treatment: "Surgery DV15" },
  11: { name: "Crushed Fingers",  effect: "-4 to all Actions involving that hand.", quickFix: "Paramedic DV13", treatment: "Surgery DV15" },
  12: { name: "Dismembered Leg",  effect: "-6 to MOVE (min 1). Cannot dodge attacks. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" }
};

export const CRITICAL_INJURIES_HEAD = {
  2:  { name: "Lost Eye",         effect: "-4 to Ranged Attacks and Perception checks involving vision. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" },
  3:  { name: "Brain Injury",     effect: "-2 to all Actions. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" },
  4:  { name: "Damaged Eye",      effect: "-2 to Ranged Attacks and Perception checks involving vision.", quickFix: "Paramedic DV15", treatment: "Surgery DV13" },
  5:  { name: "Concussion",       effect: "-2 to all Actions.", quickFix: "First Aid or Paramedic DV13", treatment: "Quick Fix removes" },
  6:  { name: "Broken Jaw",       effect: "-4 to all Actions involving speech.", quickFix: "Paramedic DV13", treatment: "Paramedic or Surgery DV13" },
  7:  { name: "Foreign Object",   effect: "Moving further than 4m on foot re-suffers Critical Injury bonus damage at end of Turn.", quickFix: "First Aid or Paramedic DV13", treatment: "Quick Fix removes" },
  8:  { name: "Whiplash",         effect: "Base Death Save Penalty +1.", quickFix: "Paramedic DV13", treatment: "Paramedic or Surgery DV13" },
  9:  { name: "Cracked Skull",    effect: "Damage from Aimed Shots to the head x3. Base Death Save Penalty +1.", quickFix: "Paramedic DV15", treatment: "Paramedic or Surgery DV15" },
  10: { name: "Damaged Ear",      effect: "Cannot take Move Action on next Turn after moving further than 4m. -2 to Perception checks involving hearing.", quickFix: "Paramedic DV13", treatment: "Surgery DV13" },
  11: { name: "Crushed Windpipe", effect: "Cannot speak. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV15" },
  12: { name: "Lost Ear",         effect: "Moving further than 4m on foot means no Move Action next Turn. -4 to Perception checks involving hearing. Base Death Save Penalty +1.", quickFix: "N/A", treatment: "Surgery DV17" }
};

export const MECH_CRITICAL_INJURIES = {
  2:  { name: "Catastrophic Powerplant Overload", effect: "Immediate shutdown. Eject or take 6d6 damage." },
  3:  { name: "Ammo Cookoff",                     effect: "8d6 extra damage if missiles or projectile weapons aboard." },
  4:  { name: "Sensor Overload",                  effect: "-4 to all ranged attacks, no radar. 1d6 turns." },
  5:  { name: "Thruster Malfunction",             effect: "Flight systems offline. 1d6 turns." },
  6:  { name: "Weapon Disabled",                  effect: "One weapon jammed. Field repair DV15." },
  7:  { name: "Hydraulics Hit",                   effect: "-2 Pilot, MOVE -2, weapon arm disabled." },
  8:  { name: "Control Jam",                      effect: "-2 to all actions until repaired DV15." },
  9:  { name: "Cockpit Compromised",              effect: "3d6 damage to pilot + Critical Injury roll on Body table." },
  10: { name: "Flight System Cut",                effect: "No flight capability. Half ground MOVE." },
  11: { name: "Cinematic Damage",                 effect: "Narrative only. GM chooses effect." },
  12: { name: "Powerplant Overload",              effect: "Shutdown 1 turn, then -2 to all actions for remainder of fight." }
};
