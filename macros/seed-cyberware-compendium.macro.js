// Long Drift: Seed Cyberware Compendium macro
// Creates/updates world compendium entries from CPR_CYBERWARE_COMPENDIUM.
(async () => {
  const modulePath = foundry.utils.getRoute("systems/long-drift/module/seed.js");
  try {
    ui.notifications.info("Seeding Long Drift cyberware compendium...");
    const { seedCyberwareCompendium } = await import(`${modulePath}?v=${game.system.version}`);
    if (typeof seedCyberwareCompendium !== "function") throw new Error("seedCyberwareCompendium export missing");
    await seedCyberwareCompendium();
    ui.notifications.info("Long Drift cyberware compendium seeding complete.");
  } catch (err) {
    console.error("Long Drift | Cyberware compendium seed error", err);
    ui.notifications.error(`Cyberware compendium seeding failed: ${err.message ?? err}`);
  }
})();
