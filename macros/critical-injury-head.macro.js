// Foundry Macro: Critical Injury - Head
// Triggered when 2+ dice show 6s on a damage roll.
(async () => {
  const macroPath = foundry.utils.getRoute("systems/long-drift/macros/critical-injury.macro.js");

  try {
    const { CRITICAL_INJURIES_HEAD } = await import(`${macroPath}?v=${game.system.version}`);

    const roll = new Roll("2d6");
    await roll.evaluate();

    const total = Number(roll.total) || 2;
    const injury = CRITICAL_INJURIES_HEAD[total] || {
      name: "Unknown Injury",
      effect: "No entry found.",
      quickFix: "N/A",
      treatment: "N/A"
    };

    const headerNote = "+5 bonus damage applied separately";
    const trigger = "Triggered when 2+ dice show 6s on a damage roll.";

    const content = `
      <div class="long-drift critical-injury-card">
        <h2 style="margin:0 0 0.25rem 0;">Critical Injury - Head</h2>
        <p style="margin:0 0 0.4rem 0;"><strong>${headerNote}</strong></p>
        <p style="margin:0 0 0.4rem 0;"><em>${trigger}</em></p>
        <p style="margin:0.2rem 0;"><strong>Roll:</strong> 2d6 = <strong>${total}</strong></p>
        <p style="margin:0.2rem 0;"><strong>Injury:</strong> ${injury.name}</p>
        <p style="margin:0.2rem 0;"><strong>Effect:</strong> ${injury.effect}</p>
        <p style="margin:0.2rem 0;"><strong>Quick Fix DV:</strong> ${injury.quickFix}</p>
        <p style="margin:0.2rem 0;"><strong>Treatment DV:</strong> ${injury.treatment}</p>
      </div>
    `;

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content
    });
  } catch (err) {
    console.error("long-drift | Critical Injury - Head macro failed", err);
    ui.notifications.error(`Critical Injury - Head macro failed: ${err.message ?? err}`);
  }
})();
