// Foundry Macro: Mech Critical
(async () => {
  const macroPath = foundry.utils.getRoute("systems/long-drift/macros/critical-injury.macro.js");

  try {
    const { MECH_CRITICAL_INJURIES } = await import(`${macroPath}?v=${game.system.version}`);

    const roll = new Roll("2d6");
    await roll.evaluate();

    const total = Number(roll.total) || 2;
    const injury = MECH_CRITICAL_INJURIES[total] || {
      name: "Unknown Mech Critical",
      effect: "No entry found."
    };

    const headerNote = "+5 bonus damage applied separately";

    const content = `
      <div class="long-drift critical-injury-card">
        <h2 style="margin:0 0 0.25rem 0;">Mech Critical</h2>
        <p style="margin:0 0 0.4rem 0;"><strong>${headerNote}</strong></p>
        <p style="margin:0.2rem 0;"><strong>Roll:</strong> 2d6 = <strong>${total}</strong></p>
        <p style="margin:0.2rem 0;"><strong>Injury:</strong> ${injury.name}</p>
        <p style="margin:0.2rem 0;"><strong>Effect:</strong> ${injury.effect}</p>
        <p style="margin:0.2rem 0;"><strong>Quick Fix DV:</strong> N/A</p>
        <p style="margin:0.2rem 0;"><strong>Treatment DV:</strong> N/A</p>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content
    });
  } catch (err) {
    console.error("long-drift | Mech Critical macro failed", err);
    ui.notifications.error(`Mech Critical macro failed: ${err.message ?? err}`);
  }
})();
