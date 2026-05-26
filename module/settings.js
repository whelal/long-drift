export function registerSystemSettings() {
  game.settings.register("long-drift", "autoSeedOnReady", {
    name: "Auto-seed core data on Ready",
    hint: "Creates Long Drift core skills and powers as World Items if missing.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.registerMenu("long-drift", "seedNow", {
    name: "Seed Core Data Now",
    label: "Run Seeding",
    hint: "Create Long Drift core skills and powers as world Items.",
    icon: "fas fa-seedling",
    type: class extends FormApplication {
      async _onSubmit() { await game.settings.set("long-drift", "autoSeedOnReady", true); ui.notifications.info("Seeding…"); await import("./seed.js").then(m => m.seedWorldData()); }
      render() { super.render(false); } // instantly run
    },
    restricted: true
  });
}
