// Long Drift: Seed Core Data macro
// Drop this into a Script Macro (or load via hotbar) to rebuild default skills.
(async () => {
  const modulePath = foundry.utils.getRoute("systems/long-drift/module/seed.js");
  try {
    ui.notifications.info("Seeding Long Drift core data...");
    const { seedWorldData } = await import(`${modulePath}?v=${game.system.version}`);
    if (typeof seedWorldData !== "function") throw new Error("seedWorldData export missing");
    await seedWorldData();
    ui.notifications.info("Long Drift seeding complete.");
  } catch (err) {
    console.error("Long Drift | Macro seed error", err);
    ui.notifications.error(`Seeding failed: ${err.message ?? err}`);
  }
})();
