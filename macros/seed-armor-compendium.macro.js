// Long Drift: Seed Armor Compendium macro
// Creates/updates armor items in the world compendium "Long Drift — Armor".
(async () => {
  const PACK_LABEL = "Long Drift — Armor";
  const PACK_NAME = "long-drift-armor";

  async function ensurePack() {
    const existing = game.packs.find((pack) => {
      const isItemPack = pack.documentName === "Item";
      const isWorldPack = pack.metadata?.packageType === "world";
      const sameName = pack.metadata?.name === PACK_NAME;
      const sameLabel = pack.metadata?.label === PACK_LABEL;
      return isItemPack && isWorldPack && (sameName || sameLabel);
    });

    if (existing) return existing;

    const metadata = {
      type: "Item",
      label: PACK_LABEL,
      name: PACK_NAME,
      package: "world",
      system: game.system.id
    };

    const created = await CompendiumCollection.createCompendium(metadata);
    return game.packs.get(created.collection) ?? created;
  }

  try {
    ui.notifications.info("Seeding Long Drift armor compendium...");

    const armorPath = foundry.utils.getRoute("systems/long-drift/module/data/armor-compendium.js");
    const { CPR_ARMOR_COMPENDIUM } = await import(`${armorPath}?v=${game.system.version}`);
    if (!Array.isArray(CPR_ARMOR_COMPENDIUM)) throw new Error("CPR_ARMOR_COMPENDIUM export missing or invalid");

    const pack = await ensurePack();
    const existingItems = await pack.getDocuments();
    const existingByName = new Map(existingItems.map((item) => [item.name, item]));

    let createdCount = 0;
    let updatedCount = 0;

    for (const entry of CPR_ARMOR_COMPENDIUM) {
      const itemPayload = {
        name: entry.name,
        type: entry.type,
        img: entry.img || "",
        system: entry.system || {}
      };

      const existing = existingByName.get(entry.name);
      if (!existing) {
        const created = await Item.createDocuments([itemPayload], { pack: pack.collection });
        if (!created?.[0]) throw new Error(`Failed to create item: ${entry.name}`);
        existingByName.set(entry.name, created[0]);
        createdCount += 1;
      } else {
        await existing.update(itemPayload);
        updatedCount += 1;
      }
    }

    console.log(`Long Drift | Armor compendium synced: ${createdCount} created, ${updatedCount} updated.`);
    ui.notifications.info(`Armor compendium synced: ${createdCount} created, ${updatedCount} updated (${PACK_LABEL}).`);
  } catch (err) {
    console.error("Long Drift | Armor compendium seed error", err);
    ui.notifications.error(`Armor compendium seeding failed: ${err.message ?? err}`);
  }
})();
