import { LONG_DRIFT_CORE_SKILLS } from "./data/skills.js";
import { CPR_WEAPONS_COMPENDIUM } from "./data/weapons-compendium.js";
import { CPR_CYBERWARE_COMPENDIUM } from "./data/cyberware-compendium.js";


const HARD_MECHA_GUNNERY = "Mecha Gunnery (H)";
// Legacy variants we want to collapse into canonical HARD_MECHA_GUNNERY
const LEGACY_MECHA_GUNNERY_NAMES = ["Mecha Gunnery", "Mecha Gunnery [H]"];
// Legacy skill renames introduced in 0.0.10
const LEGACY_SKILL_RENAMES = {
  "Resist Magic": "Resist Magic (2)",
  "Military Intelligence": "Expert: Military Intelligence"
};
// Deprecated skill names to purge (non-PSI duplicates)
const DEPRECATED_SKILL_NAMES = ["Stat Boost"]; // keep only Stat Boost (phys) in PSI list
const WEAPONS_PACK_LABEL = "Long Drift — Weapons";
const WEAPONS_PACK_NAME = "long-drift-weapons";
const CYBERWARE_PACK_LABEL = "Long Drift — Cyberware";
const CYBERWARE_PACK_NAME = "long-drift-cyberware";

function ensureRuntimeCyberwareTypeRegistration() {
  try {
    const itemTypes = game.system?.documentTypes?.Item;
    if (itemTypes && !Object.prototype.hasOwnProperty.call(itemTypes, "cyberware")) {
      itemTypes.cyberware = {};
    }

    const itemModel = game.model?.Item;
    if (itemModel && !Object.prototype.hasOwnProperty.call(itemModel, "cyberware")) {
      // Keep a minimal runtime fallback so Item validation accepts the type.
      itemModel.cyberware = foundry.utils.deepClone(itemModel.armor ?? {});
    }
  } catch (err) {
    console.warn("long-drift | Failed to ensure cyberware runtime type registration", err);
  }
}

function normalizeStatKey(stat) {
  const s = String(stat || "").toUpperCase();
  const map = {
    MA: "MOVE",
    ATTR: "COOL",
    EDU: "INT",
    PSI: "WILL"
  };
  return map[s] || s;
}

async function ensureFolder(name, type) {
  let folder = game.folders.find(f => f.name === name && f.type === type);
  if (!folder) folder = await Folder.create({ name, type });
  return folder;
}

function prepareSkillSystem(source = {}) {
  const sys = foundry.utils.deepClone(source);
  if (sys.stat) sys.stat = normalizeStatKey(sys.stat);
  if (sys.category) sys.category = String(sys.category);
  if (sys.rank === undefined || sys.rank === null) sys.rank = 0;
  if (sys.favorite == null) sys.favorite = false;
  if (sys.ip == null) sys.ip = 0;
  if (sys.hard == null) sys.hard = /\(H\)|\[H\]/i.test(source?.name || "") ? true : false;
  return sys;
}

function normaliseSeedData(entry, folderId) {
  const { data, system, ...rest } = entry;
  const type = rest.type ?? entry.type;
  const baseSystem = foundry.utils.deepClone(system ?? data ?? {});
  const sys = type === "skill" ? prepareSkillSystem(baseSystem) : baseSystem;

  return {
    ...rest,
    folder: folderId,
    system: sys
  };
}

function normaliseWeaponCompendiumEntry(entry) {
  const clone = foundry.utils.deepClone(entry);
  const system = clone.system ?? {};

  clone.type = "weapon";
  clone.system = {
    ...system,
    concealable: !!system.concealable,
    hands: Number.isFinite(Number(system.hands)) ? Number(system.hands) : 2,
    cost: Number.isFinite(Number(system.cost)) ? Number(system.cost) : 0,
    autofire: Number.isFinite(Number(system.autofire)) ? Number(system.autofire) : 0,
    pen: Number.isFinite(Number(system.pen)) ? Number(system.pen) : 0,
    quality: ["Poor", "Standard", "Excellent"].includes(String(system.quality || "")) ? String(system.quality) : "Standard",
    isMecha: !!system.isMecha
  };

  return clone;
}

function normaliseCyberwareCompendiumEntry(entry) {
  const clone = foundry.utils.deepClone(entry);
  const system = clone.system ?? {};

  clone.type = "cyberware";
  clone.system = {
    ...system,
    slot: String(system.slot || "torso"),
    description: String(system.description || ""),
    spaces: Number.isFinite(Number(system.spaces)) ? Math.max(0, Number(system.spaces)) : 1,
    humanityLoss: Number.isFinite(Number(system.humanityLoss)) ? Number(system.humanityLoss) : 0,
    cost: Number.isFinite(Number(system.cost)) ? Math.max(0, Number(system.cost)) : 0,
    armor: Number.isFinite(Number(system.armor)) ? Number(system.armor) : 0,
    integrity: Number.isFinite(Number(system.integrity)) ? Number(system.integrity) : 0,
    note: String(system.note || "")
  };

  return clone;
}

async function ensureWeaponsCompendiumPack() {
  const existing = game.packs.find((pack) => {
    const isItemPack = pack.documentName === "Item";
    const isWorldPack = pack.metadata?.packageType === "world";
    const sameName = pack.metadata?.name === WEAPONS_PACK_NAME;
    const sameLabel = pack.metadata?.label === WEAPONS_PACK_LABEL;
    return isItemPack && isWorldPack && (sameName || sameLabel);
  });

  if (existing) return existing;

  const metadata = {
    type: "Item",
    label: WEAPONS_PACK_LABEL,
    name: WEAPONS_PACK_NAME,
    package: "world",
    system: game.system.id
  };

  const created = await CompendiumCollection.createCompendium(metadata);
  return game.packs.get(created.collection) ?? created;
}

async function ensureCyberwareCompendiumPack() {
  const existing = game.packs.find((pack) => {
    const isItemPack = pack.documentName === "Item";
    const isWorldPack = pack.metadata?.packageType === "world";
    const sameName = pack.metadata?.name === CYBERWARE_PACK_NAME;
    const sameLabel = pack.metadata?.label === CYBERWARE_PACK_LABEL;
    return isItemPack && isWorldPack && (sameName || sameLabel);
  });

  if (existing) return existing;

  const metadata = {
    type: "Item",
    label: CYBERWARE_PACK_LABEL,
    name: CYBERWARE_PACK_NAME,
    package: "world",
    system: game.system.id
  };

  const created = await CompendiumCollection.createCompendium(metadata);
  return game.packs.get(created.collection) ?? created;
}

export async function seedWeaponsCompendium() {
  try {
    const pack = await ensureWeaponsCompendiumPack();
    const existingDocs = await pack.getDocuments();
    const existingByName = new Map(existingDocs.map((doc) => [doc.name, doc]));

    const toCreate = [];
    const toUpdate = [];

    for (const source of CPR_WEAPONS_COMPENDIUM) {
      const desired = normaliseWeaponCompendiumEntry(source);
      const current = existingByName.get(desired.name);

      if (!current) {
        toCreate.push(desired);
        continue;
      }

      const patch = {};
      if (current.type !== desired.type) patch.type = desired.type;
      if ((current.img || "") !== (desired.img || "")) patch.img = desired.img;
      if (!foundry.utils.objectsEqual(current.system ?? {}, desired.system ?? {})) {
        patch.system = desired.system;
      }

      if (Object.keys(patch).length) {
        toUpdate.push({ _id: current.id, ...patch });
      }
    }

    if (toCreate.length) {
      await Item.createDocuments(toCreate, { pack: pack.collection });
    }

    if (toUpdate.length) {
      await Item.updateDocuments(toUpdate, { pack: pack.collection });
    }

    ui.notifications.info(
      `Weapons compendium synced: ${toCreate.length} created, ${toUpdate.length} updated (${WEAPONS_PACK_LABEL}).`
    );

    return {
      pack: pack.collection,
      created: toCreate.length,
      updated: toUpdate.length
    };
  } catch (err) {
    console.error("long-drift | Weapons compendium seed failed", err);
    ui.notifications.error("Long Drift weapons compendium seed failed. See console.");
    throw err;
  }
}

export async function seedCyberwareCompendium() {
  try {
    ensureRuntimeCyberwareTypeRegistration();

    const pack = await ensureCyberwareCompendiumPack();
    const existingDocs = await pack.getDocuments();
    const normalizeName = (name) => String(name || "").trim().toLowerCase();
    const existingByName = new Map(existingDocs.map((doc) => [doc.name, doc]));
    const existingByNormalizedName = new Map(existingDocs.map((doc) => [normalizeName(doc.name), doc]));

    const toCreate = [];
    const toUpdate = [];

    for (const source of CPR_CYBERWARE_COMPENDIUM) {
      const desired = normaliseCyberwareCompendiumEntry(source);
      const current = existingByName.get(desired.name)
        ?? existingByNormalizedName.get(normalizeName(desired.name));

      if (!current) {
        toCreate.push(desired);
        continue;
      }

      const patch = {};
      if ((current.name || "") !== (desired.name || "")) patch.name = desired.name;
      if (current.type !== desired.type) patch.type = desired.type;
      if ((current.img || "") !== (desired.img || "")) patch.img = desired.img;
      if (!foundry.utils.objectsEqual(current.system ?? {}, desired.system ?? {})) {
        patch.system = desired.system;
      }

      if (Object.keys(patch).length) {
        toUpdate.push({ _id: current.id, ...patch });
      }
    }

    if (toCreate.length) {
      await Item.createDocuments(toCreate, { pack: pack.collection });
    }

    if (toUpdate.length) {
      await Item.updateDocuments(toUpdate, { pack: pack.collection });
    }

    ui.notifications.info(
      `Cyberware compendium synced: ${toCreate.length} created, ${toUpdate.length} updated (${CYBERWARE_PACK_LABEL}).`
    );

    return {
      pack: pack.collection,
      created: toCreate.length,
      updated: toUpdate.length
    };
  } catch (err) {
    console.error("long-drift | Cyberware compendium seed failed", err);
    ui.notifications.error("Long Drift cyberware compendium seed failed. See console.");
    throw err;
  }
}

async function ensureActorHasSkills(actor) {
  if (!actor) return { created: 0, updated: 0 };
  const allowedTypes = new Set(["character", "npc"]);
  if (!allowedTypes.has(actor.type)) return { created: 0, updated: 0 };

  const defaultSkills = LONG_DRIFT_CORE_SKILLS.map(skill => ({
    name: skill.name,
    type: "skill",
    system: prepareSkillSystem(skill.system ?? skill.data ?? {})
  }));
  const defaultSkillNames = new Set(defaultSkills.map(s => s.name));

  const existingSkills = actor.items.filter(it => it.type === "skill");
  // Perform legacy rename pass BEFORE building name map so new names don't conflict
  for (const it of existingSkills) {
    const newName = LEGACY_SKILL_RENAMES[it.name];
    if (newName && newName !== it.name) {
      // Only rename if target name does not already exist to avoid duplicates
      const already = existingSkills.some(other => other !== it && other.name === newName);
      if (!already) {
        try { await it.update({ name: newName }); } catch (e) { console.warn('long-drift | Failed legacy skill rename', it.name, '->', newName, e); }
      }
    }
  }
  // Purge deprecated non-PSI duplicates
  const toRemove = existingSkills.filter(it => DEPRECATED_SKILL_NAMES.includes(it.name) && String(it.system?.category).toUpperCase() !== 'PSI');
  if (toRemove.length) {
    try { await actor.deleteEmbeddedDocuments('Item', toRemove.map(i=>i.id)); }
    catch (e) { console.warn('long-drift | Failed deleting deprecated skills', e); }
  }
  // Replace legacy built-in skill set with the current canonical list.
  // Preserve only custom skills; all non-custom built-ins not in the default RED list are removed.
  const staleCoreSkills = actor.items.filter(it => {
    if (it.type !== "skill") return false;
    if (it.system?.custom) return false;
    if (defaultSkillNames.has(it.name)) return false;
    return true;
  });
  if (staleCoreSkills.length) {
    try {
      await actor.deleteEmbeddedDocuments("Item", staleCoreSkills.map(i => i.id));
    } catch (e) {
      console.warn("long-drift | Failed deleting stale core skills", e);
    }
  }

  const existingByName = new Map(actor.items.filter(it => it.type === "skill").map(it => [it.name, it]));
  const hardSkill = existingByName.get(HARD_MECHA_GUNNERY);
  const legacyNames = LEGACY_MECHA_GUNNERY_NAMES;
  const toDelete = [];
  let canonicalSkill = hardSkill ?? null;

  for (const legacyName of legacyNames) {
    const legacySkill = existingByName.get(legacyName);
    if (!legacySkill) continue;
    if (canonicalSkill) {
      toDelete.push(legacySkill.id);
      existingByName.delete(legacyName);
      continue;
    }

    await legacySkill.update({ name: HARD_MECHA_GUNNERY });
    existingByName.delete(legacyName);
    existingByName.set(HARD_MECHA_GUNNERY, legacySkill);
    canonicalSkill = legacySkill;
  }

  if (toDelete.length) await actor.deleteEmbeddedDocuments("Item", toDelete);
  const toCreate = [];
  const toUpdate = [];

  for (const skill of defaultSkills) {
    const current = existingByName.get(skill.name);
    if (!current) {
      toCreate.push(skill);
      continue;
    }

    const currentSystem = current.system ?? {};
    const patch = {};
  const normalizedCurrentStat = normalizeStatKey(currentSystem.stat || skill.system.stat || "INT");
  if (!currentSystem.stat || String(currentSystem.stat).toUpperCase() !== normalizedCurrentStat) {
    patch["system.stat"] = normalizedCurrentStat;
  }
  if (skill.system.category && !currentSystem.category) patch["system.category"] = skill.system.category;
  if (currentSystem.hard == null && skill.system.hard) patch["system.hard"] = true;
    if (currentSystem.rank === undefined || currentSystem.rank === null) patch["system.rank"] = skill.system.rank;
    if (currentSystem.favorite === undefined || currentSystem.favorite === null) patch["system.favorite"] = skill.system.favorite;
    if (currentSystem.ip === undefined || currentSystem.ip === null) patch["system.ip"] = skill.system.ip;
    if (Object.keys(patch).length) toUpdate.push({ _id: current.id, ...patch });
  }

  if (toCreate.length) await actor.createEmbeddedDocuments("Item", toCreate);
  if (toUpdate.length) await actor.updateEmbeddedDocuments("Item", toUpdate);

  return { created: toCreate.length, updated: toUpdate.length };
}

async function ensureActorHasCoreItems(actor) {
  return ensureActorHasSkills(actor);
}

export async function syncActorCoreItems(actor) {
  return ensureActorHasCoreItems(actor);
}

export async function seedWorldData() {
  try {
    const skillFolder = await ensureFolder("Long Drift Core Skills", "Item");
    const defaultSkillNames = new Set(LONG_DRIFT_CORE_SKILLS.map(skill => skill.name));

    const existing = new Map(game.items.map(item => [item.name, item]));
    // World-level legacy renames (Items in compendium/world item directory)
    for (const [oldName, newName] of Object.entries(LEGACY_SKILL_RENAMES)) {
      const current = existing.get(oldName);
      if (current && !existing.has(newName)) {
        try {
          await current.update({ name: newName });
          existing.delete(oldName);
          existing.set(newName, current);
        } catch (e) { console.warn('long-drift | Failed world skill legacy rename', oldName, '->', newName, e); }
      }
    }
    const staleWorldSkills = game.items.filter(item => {
      if (item.type !== "skill") return false;
      if (defaultSkillNames.has(item.name)) return false;
      return true;
    });
    if (staleWorldSkills.length) {
      await Item.deleteDocuments(staleWorldSkills.map(item => item.id));
      for (const item of staleWorldSkills) existing.delete(item.name);
    }

    const legacyNames = LEGACY_MECHA_GUNNERY_NAMES;
    const hardSkill = existing.get(HARD_MECHA_GUNNERY);
    let canonicalSkill = hardSkill ?? null;

    for (const legacyName of legacyNames) {
      const legacySkill = existing.get(legacyName);
      if (!legacySkill) continue;
      if (canonicalSkill) {
        await legacySkill.delete();
        existing.delete(legacyName);
        continue;
      }

      await legacySkill.update({ name: HARD_MECHA_GUNNERY });
      existing.delete(legacyName);
      existing.set(HARD_MECHA_GUNNERY, legacySkill);
      canonicalSkill = legacySkill;
    }
    const toCreate = [];
    const updates = [];
    const processEntry = (entry, folderId) => {
      const desired = normaliseSeedData(entry, folderId);
      const current = existing.get(entry.name);

      if (!current) {
        toCreate.push(desired);
        return;
      }

      const needsUpdate = !foundry.utils.objectsEqual(current.system, desired.system);
      if (needsUpdate) updates.push(current.update({ system: desired.system }));
    };

    for (const s of LONG_DRIFT_CORE_SKILLS) processEntry(s, skillFolder.id);

    if (toCreate.length) {
      await Item.createDocuments(toCreate);
      ui.notifications.info(`Seeded ${toCreate.length} Items (skills).`);
    }

    if (updates.length) {
      await Promise.all(updates);
      ui.notifications.info(`Updated ${updates.length} existing Items.`);
    }

    let createdCount = 0;
    let updatedCount = 0;
    for (const actor of game.actors.contents ?? []) {
      const { created, updated } = await ensureActorHasCoreItems(actor);
      createdCount += created;
      updatedCount += updated;
    }

    if (createdCount || updatedCount) {
      ui.notifications.info(`Synced actor items: ${createdCount} added, ${updatedCount} refreshed.`);
    }

    if (!toCreate.length && !updates.length && !createdCount && !updatedCount) {
      ui.notifications.info("No new Items to seed.");
    }
  } catch (err) {
    console.error("long-drift | Seeding failed", err);
    ui.notifications.error("Long Drift seeding failed. See console.");
  }
}

