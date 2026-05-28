// Long Drift: Seed Weapons Compendium macro
// Creates/updates world compendium entries from CPR_WEAPONS_COMPENDIUM.
(async () => {
  const modulePath = foundry.utils.getRoute("systems/long-drift/module/seed.js");
  try {
    ui.notifications.info("Seeding Long Drift weapons compendium...");
    const { seedWeaponsCompendium } = await import(`${modulePath}?v=${game.system.version}`);
    if (typeof seedWeaponsCompendium !== "function") throw new Error("seedWeaponsCompendium export missing");
    await seedWeaponsCompendium();
    ui.notifications.info("Long Drift weapons compendium seeding complete.");
  } catch (err) {
    console.error("Long Drift | Weapons compendium seed error", err);
    ui.notifications.error(`Weapons compendium seeding failed: ${err.message ?? err}`);
  }
})();
