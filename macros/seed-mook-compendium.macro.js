// Long Drift: Seed Mook NPC Compendium macro
// Creates/updates NPC actors in the world compendium "Long Drift — Mooks".
// Note: on first-time creation the system auto-seeds all core skills via a hook.
// Run the macro a second time to ensure only the archetype skills below are present.
(async () => {
  const PACK_LABEL = "Long Drift — Mooks";
  const PACK_NAME = "long-drift-mooks";

  // Canonical metadata for every skill used across mook builds.
  // syncActorSkills replaces the full auto-seeded skill list with only these archetype skills.
  const SKILL_DEFS = {
    "Handgun":             { stat: "REF", category: "Ranged Weapon", hard: false },
    "Shoulder Arms":       { stat: "REF", category: "Ranged Weapon", hard: false },
    "Autofire (x2)":       { stat: "REF", category: "Ranged Weapon", hard: true  },
    "Heavy Weapons":       { stat: "REF", category: "Ranged Weapon", hard: false },
    "Pilot Air Vehicle":   { stat: "REF", category: "Control",       hard: false },
    "Drive Land Vehicle":  { stat: "REF", category: "Control",       hard: false },
    "Brawling":            { stat: "DEX", category: "Fighting",      hard: false },
    "Evasion":             { stat: "DEX", category: "Fighting",      hard: false },
    "Melee Weapon":        { stat: "DEX", category: "Fighting",      hard: false },
    "Athletics":           { stat: "DEX", category: "Body",          hard: false },
    "Perception":          { stat: "INT", category: "Awareness",     hard: false }
  };

  const MOOKS = [
    {
      name: "Pirate Grunt",
      rank: "Mook",
      stats: { INT: 4, REF: 6, DEX: 5, TECH: 4, COOL: 5, WILL: 4, LUCK: 4, MOVE: 5, BODY: 6, EMP: 4 },
      armor: { head: 11, body: 11 },
      weapons: ["Heavy Pistol"],
      cyberware: ["Interface Plugs"],
      skills: [
        { name: "Handgun",       rank: 4 },
        { name: "Shoulder Arms", rank: 4 },
        { name: "Autofire (x2)", rank: 2 },
        { name: "Brawling",      rank: 2 },
        { name: "Evasion",       rank: 2 }
      ]
    },
    {
      name: "Boarding Specialist",
      rank: "Mook",
      // EMP 3: base 4, Wolvers –7 humanity → floor(33/10) = 3
      stats: { INT: 4, REF: 7, DEX: 6, TECH: 4, COOL: 6, WILL: 6, LUCK: 4, MOVE: 6, BODY: 7, EMP: 3 },
      armor: { head: 13, body: 13 },
      weapons: ["Shotgun", "Medium Melee Weapon", "Wolvers"],
      cyberware: ["Wolvers"],
      skills: [
        { name: "Brawling",      rank: 5 },
        { name: "Melee Weapon",  rank: 4 },
        { name: "Athletics",     rank: 4 },
        { name: "Shoulder Arms", rank: 3 },
        { name: "Evasion",       rank: 3 }
      ]
    },
    {
      name: "Heavy Gunner",
      rank: "Mook",
      stats: { INT: 4, REF: 6, DEX: 5, TECH: 4, COOL: 5, WILL: 5, LUCK: 4, MOVE: 5, BODY: 7, EMP: 4 },
      armor: { head: 11, body: 11 },
      weapons: ["Heavy SMG"],
      cyberware: ["Cybereye", "Targeting Scope"],
      skills: [
        { name: "Heavy Weapons",  rank: 6 },
        { name: "Autofire (x2)", rank: 4 },
        { name: "Shoulder Arms",  rank: 4 },
        { name: "Brawling",       rank: 2 }
      ]
    },
    {
      name: "Pirate Veteran",
      rank: "Lieutenant",
      stats: { INT: 6, REF: 7, DEX: 6, TECH: 5, COOL: 7, WILL: 7, LUCK: 5, MOVE: 6, BODY: 7, EMP: 5 },
      armor: { head: 13, body: 13 },
      weapons: ["Assault Rifle", "Heavy Pistol"],
      cyberware: ["Neural Link", "Interface Plugs"],
      skills: [
        { name: "Shoulder Arms",  rank: 5 },
        { name: "Handgun",        rank: 5 },
        { name: "Autofire (x2)", rank: 4 },
        { name: "Evasion",        rank: 3 },
        { name: "Perception",     rank: 4 }
      ]
    },
    {
      name: "Pirate Pilot",
      rank: "Lieutenant",
      stats: { INT: 5, REF: 8, DEX: 6, TECH: 6, COOL: 6, WILL: 5, LUCK: 5, MOVE: 6, BODY: 6, EMP: 5 },
      armor: { head: 11, body: 11 },
      weapons: ["Heavy Pistol"],
      cyberware: ["Neural Link", "Interface Plugs"],
      skills: [
        { name: "Pilot Air Vehicle",  rank: 6 },
        { name: "Handgun",            rank: 4 },
        { name: "Evasion",            rank: 3 },
        { name: "Drive Land Vehicle", rank: 2 }
      ]
    },
    {
      name: "Pirate Captain",
      rank: "Boss",
      // EMP 4: base 6, Neural Link –7, Kerenzikov –7, Targeting Scope –3 → floor(43/10) = 4
      stats: { INT: 7, REF: 8, DEX: 7, TECH: 6, COOL: 8, WILL: 8, LUCK: 6, MOVE: 7, BODY: 8, EMP: 4 },
      armor: { head: 15, body: 15 },
      weapons: ["Very Heavy Pistol", "Heavy Melee Weapon"],
      cyberware: ["Neural Link", "Kerenzikov Booster", "Targeting Scope"],
      skills: [
        { name: "Handgun",       rank: 6 },
        { name: "Shoulder Arms", rank: 6 },
        { name: "Evasion",       rank: 5 },
        { name: "Brawling",      rank: 4 },
        { name: "Melee Weapon",  rank: 4 },
        { name: "Perception",    rank: 5 }
      ]
    },
    {
      name: "Cyberpsycho",
      rank: "Boss",
      stats: { INT: 4, REF: 8, DEX: 8, TECH: 4, COOL: 6, WILL: 3, LUCK: 0, MOVE: 7, BODY: 8, EMP: 0 },
      armor: { head: 11, body: 11 },
      weapons: ["Wolvers", "Very Heavy Pistol"],
      cyberware: ["Wolvers", "Subdermal Armor", "Cybereye", "Targeting Scope", "Pain Editor"],
      notes: "Pain Editor: ignores all wound state action penalties. Immune to Intimidation and Fear. Does not negotiate."
      // No skills: Cyberpsycho retains the full auto-seeded core skill list.
    }
  ];

  function buildStatsPayload(stats) {
    return {
      INT: { value: Number(stats.INT) || 0 },
      REF: { value: Number(stats.REF) || 0 },
      DEX: { value: Number(stats.DEX) || 0 },
      TECH: { value: Number(stats.TECH) || 0 },
      COOL: { value: Number(stats.COOL) || 0 },
      WILL: { value: Number(stats.WILL) || 0 },
      LUCK: { value: Number(stats.LUCK) || 0 },
      MOVE: { value: Number(stats.MOVE) || 0 },
      BODY: { value: Number(stats.BODY) || 0 },
      EMP: { value: Number(stats.EMP) || 0 }
    };
  }

  async function ensurePack() {
    const existing = game.packs.find((pack) => {
      const isActorPack = pack.documentName === "Actor";
      const isWorldPack = pack.metadata?.packageType === "world";
      const sameName = pack.metadata?.name === PACK_NAME;
      const sameLabel = pack.metadata?.label === PACK_LABEL;
      return isActorPack && isWorldPack && (sameName || sameLabel);
    });

    if (existing) return existing;

    const metadata = {
      type: "Actor",
      label: PACK_LABEL,
      name: PACK_NAME,
      package: "world",
      system: game.system.id
    };

    const created = await CompendiumCollection.createCompendium(metadata);
    return game.packs.get(created.collection) ?? created;
  }

  function weaponToItemData(weaponSource) {
    const cloned = foundry.utils.deepClone(weaponSource);
    return { name: cloned.name, type: "weapon", img: cloned.img || "", system: cloned.system || {} };
  }

  function cywareToItemData(source) {
    const cloned = foundry.utils.deepClone(source);
    return { name: cloned.name, type: "cyberware", img: cloned.img || "", system: cloned.system || {} };
  }

  async function syncActorWeapons(actorDoc, weaponsByName, wantedNames) {
    const desiredItems = wantedNames.map((weaponName) => {
      const source = weaponsByName.get(weaponName);
      if (!source) throw new Error(`Weapon not found in CPR_WEAPONS_COMPENDIUM: ${weaponName}`);
      return weaponToItemData(source);
    });

    const existingWeaponIds = actorDoc.items.filter((i) => i.type === "weapon").map((i) => i.id);
    if (existingWeaponIds.length) await actorDoc.deleteEmbeddedDocuments("Item", existingWeaponIds);
    if (desiredItems.length) await actorDoc.createEmbeddedDocuments("Item", desiredItems);
  }

  async function syncActorCyberware(actorDoc, cywareByName, wantedNames) {
    const desiredItems = wantedNames.map((name) => {
      const source = cywareByName.get(name);
      if (!source) throw new Error(`Cyberware not found in CPR_CYBERWARE_COMPENDIUM: ${name}`);
      return cywareToItemData(source);
    });

    const existingIds = actorDoc.items.filter((i) => i.type === "cyberware").map((i) => i.id);
    if (existingIds.length) await actorDoc.deleteEmbeddedDocuments("Item", existingIds);
    if (desiredItems.length) await actorDoc.createEmbeddedDocuments("Item", desiredItems);
  }

  async function syncActorSkills(actorDoc, wantedSkills) {
    const desiredItems = wantedSkills.map(({ name, rank }) => {
      const def = SKILL_DEFS[name];
      if (!def) throw new Error(`Skill not found in SKILL_DEFS: ${name}`);
      return {
        name,
        type: "skill",
        img: "",
        system: { stat: def.stat, category: def.category, rank, hard: def.hard, favorite: false, ip: 0, custom: false }
      };
    });

    const existingIds = actorDoc.items.filter((i) => i.type === "skill").map((i) => i.id);
    if (existingIds.length) await actorDoc.deleteEmbeddedDocuments("Item", existingIds);
    if (desiredItems.length) await actorDoc.createEmbeddedDocuments("Item", desiredItems);
  }

  try {
    ui.notifications.info("Seeding Long Drift mook compendium...");

    const weaponsPath = foundry.utils.getRoute("systems/long-drift/module/data/weapons-compendium.js");
    const { CPR_WEAPONS_COMPENDIUM } = await import(`${weaponsPath}?v=${game.system.version}`);
    if (!Array.isArray(CPR_WEAPONS_COMPENDIUM)) throw new Error("CPR_WEAPONS_COMPENDIUM export missing or invalid");

    const cywarePath = foundry.utils.getRoute("systems/long-drift/module/data/cyberware-compendium.js");
    const { CPR_CYBERWARE_COMPENDIUM } = await import(`${cywarePath}?v=${game.system.version}`);
    if (!Array.isArray(CPR_CYBERWARE_COMPENDIUM)) throw new Error("CPR_CYBERWARE_COMPENDIUM export missing or invalid");

    const weaponsByName = new Map(CPR_WEAPONS_COMPENDIUM.map((w) => [String(w.name), w]));
    const cywareByName = new Map(CPR_CYBERWARE_COMPENDIUM.map((c) => [String(c.name), c]));
    const pack = await ensurePack();
    const existingActors = await pack.getDocuments();
    const existingByName = new Map(existingActors.map((actor) => [actor.name, actor]));

    let createdCount = 0;
    let updatedCount = 0;

    for (const mook of MOOKS) {
      const actorPayload = {
        name: mook.name,
        type: "npc",
        system: {
          rank: mook.rank,
          stats: buildStatsPayload(mook.stats),
          armor: {
            head: { sp: mook.armor.head, spMax: mook.armor.head },
            body: { sp: mook.armor.body, spMax: mook.armor.body }
          },
          notes: mook.notes ?? ""
        }
      };

      let actorDoc = existingByName.get(mook.name);
      if (!actorDoc) {
        const created = await Actor.createDocuments([actorPayload], { pack: pack.collection });
        actorDoc = created?.[0];
        if (!actorDoc) throw new Error(`Failed to create actor: ${mook.name}`);
        existingByName.set(mook.name, actorDoc);
        createdCount += 1;
      } else {
        await actorDoc.update(actorPayload);
        updatedCount += 1;
      }

      await syncActorWeapons(actorDoc, weaponsByName, mook.weapons);
      await syncActorCyberware(actorDoc, cywareByName, mook.cyberware ?? []);
      if (mook.skills) await syncActorSkills(actorDoc, mook.skills);
    }

    ui.notifications.info(`Mook compendium synced: ${createdCount} created, ${updatedCount} updated (${PACK_LABEL}).`);
  } catch (err) {
    console.error("Long Drift | Mook compendium seed error", err);
    ui.notifications.error(`Mook compendium seeding failed: ${err.message ?? err}`);
  }
})();
