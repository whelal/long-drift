const MIGRATION_VERSION = 1;

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

function buildSkillPatch(item) {
  const patch = { _id: item.id };
  let changed = false;

  const currentStat = String(item.system?.stat || "").toUpperCase();
  const normalizedStat = normalizeStatKey(currentStat || "INT");
  if (!currentStat || currentStat !== normalizedStat) {
    patch["system.stat"] = normalizedStat;
    changed = true;
  }

  return changed ? patch : null;
}

function buildItemPatch(item) {
  if (item.type === "skill") return buildSkillPatch(item);
  return null;
}

async function migrateActorItems(actor) {
  const updates = actor.items
    .filter(item => item.type === "skill")
    .map(buildItemPatch)
    .filter(Boolean);

  if (!updates.length) return 0;
  await actor.updateEmbeddedDocuments("Item", updates);
  return updates.length;
}

async function migrateWorldItems() {
  let updated = 0;
  const items = game.items?.contents || [];
  for (const item of items) {
    if (item.type !== "skill") continue;
    const patch = buildItemPatch(item);
    if (!patch) continue;
    const { _id, ...updateData } = patch;
    await item.update(updateData);
    updated += 1;
  }
  return updated;
}

export async function runOneTimeWorldMigration() {
  if (!game.user?.isGM) return;

  const currentVersion = Number(game.settings.get("long-drift", "migrationVersion") || 0);
  if (currentVersion >= MIGRATION_VERSION) return;

  console.log(`long-drift | Running world migration v${MIGRATION_VERSION}...`);
  let actorItemUpdates = 0;
  let worldItemUpdates = 0;

  for (const actor of game.actors?.contents || []) {
    actorItemUpdates += await migrateActorItems(actor);
  }

  worldItemUpdates = await migrateWorldItems();

  await game.settings.set("long-drift", "migrationVersion", MIGRATION_VERSION);

  const summary = `Migrated ${actorItemUpdates} actor items and ${worldItemUpdates} world items to RED stat keys.`;
  console.log(`long-drift | ${summary}`);
  ui.notifications.info(`Long Drift migration complete. ${summary}`);
}

export { MIGRATION_VERSION };
