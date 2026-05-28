// Foundry Macro: Create Critical Injury Macros
// Run once to create/update the three Script Macros in your world.
(async () => {
  const bodyCommand = `
(async () => {
  const macroPath = foundry.utils.getRoute("systems/long-drift/macros/critical-injury.macro.js");
  const { CRITICAL_INJURIES_BODY } = await import(\`${macroPath}?v=${game.system.version}\`);
  const roll = new Roll("2d6");
  await roll.evaluate();
  const total = Number(roll.total) || 2;
  const injury = CRITICAL_INJURIES_BODY[total] || { name: "Unknown Injury", effect: "No entry found.", quickFix: "N/A", treatment: "N/A" };
  const content = \`
    <div class="long-drift critical-injury-card">
      <h2 style="margin:0 0 0.25rem 0;">Critical Injury — Body</h2>
      <p style="margin:0 0 0.4rem 0;"><strong>+5 bonus damage applied separately</strong></p>
      <p style="margin:0 0 0.4rem 0;"><em>Triggered when 2+ dice show 6s on a damage roll.</em></p>
      <p style="margin:0.2rem 0;"><strong>Roll:</strong> 2d6 = <strong>\${total}</strong></p>
      <p style="margin:0.2rem 0;"><strong>Injury:</strong> \${injury.name}</p>
      <p style="margin:0.2rem 0;"><strong>Effect:</strong> \${injury.effect}</p>
      <p style="margin:0.2rem 0;"><strong>Quick Fix DV:</strong> \${injury.quickFix}</p>
      <p style="margin:0.2rem 0;"><strong>Treatment DV:</strong> \${injury.treatment}</p>
    </div>
  \`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker(), content });
})();`;

  const headCommand = `
(async () => {
  const macroPath = foundry.utils.getRoute("systems/long-drift/macros/critical-injury.macro.js");
  const { CRITICAL_INJURIES_HEAD } = await import(\`${macroPath}?v=${game.system.version}\`);
  const roll = new Roll("2d6");
  await roll.evaluate();
  const total = Number(roll.total) || 2;
  const injury = CRITICAL_INJURIES_HEAD[total] || { name: "Unknown Injury", effect: "No entry found.", quickFix: "N/A", treatment: "N/A" };
  const content = \`
    <div class="long-drift critical-injury-card">
      <h2 style="margin:0 0 0.25rem 0;">Critical Injury — Head</h2>
      <p style="margin:0 0 0.4rem 0;"><strong>+5 bonus damage applied separately</strong></p>
      <p style="margin:0 0 0.4rem 0;"><em>Triggered when 2+ dice show 6s on a damage roll.</em></p>
      <p style="margin:0.2rem 0;"><strong>Roll:</strong> 2d6 = <strong>\${total}</strong></p>
      <p style="margin:0.2rem 0;"><strong>Injury:</strong> \${injury.name}</p>
      <p style="margin:0.2rem 0;"><strong>Effect:</strong> \${injury.effect}</p>
      <p style="margin:0.2rem 0;"><strong>Quick Fix DV:</strong> \${injury.quickFix}</p>
      <p style="margin:0.2rem 0;"><strong>Treatment DV:</strong> \${injury.treatment}</p>
    </div>
  \`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker(), content });
})();`;

  const mechCommand = `
(async () => {
  const macroPath = foundry.utils.getRoute("systems/long-drift/macros/critical-injury.macro.js");
  const { MECH_CRITICAL_INJURIES } = await import(\`${macroPath}?v=${game.system.version}\`);
  const roll = new Roll("2d6");
  await roll.evaluate();
  const total = Number(roll.total) || 2;
  const injury = MECH_CRITICAL_INJURIES[total] || { name: "Unknown Mech Critical", effect: "No entry found." };
  const content = \`
    <div class="long-drift critical-injury-card">
      <h2 style="margin:0 0 0.25rem 0;">Mech Critical</h2>
      <p style="margin:0 0 0.4rem 0;"><strong>+5 bonus damage applied separately</strong></p>
      <p style="margin:0.2rem 0;"><strong>Roll:</strong> 2d6 = <strong>\${total}</strong></p>
      <p style="margin:0.2rem 0;"><strong>Injury:</strong> \${injury.name}</p>
      <p style="margin:0.2rem 0;"><strong>Effect:</strong> \${injury.effect}</p>
      <p style="margin:0.2rem 0;"><strong>Quick Fix DV:</strong> N/A</p>
      <p style="margin:0.2rem 0;"><strong>Treatment DV:</strong> N/A</p>
    </div>
  \`;
  await ChatMessage.create({ speaker: ChatMessage.getSpeaker(), content });
})();`;

  const specs = [
    { name: "Critical Injury — Body", command: bodyCommand },
    { name: "Critical Injury — Head", command: headCommand },
    { name: "Mech Critical", command: mechCommand }
  ];

  for (const spec of specs) {
    const existing = game.macros.find((m) => m.name === spec.name);
    if (existing) {
      await existing.update({ type: "script", command: spec.command });
    } else {
      await Macro.create({ name: spec.name, type: "script", command: spec.command, img: "icons/svg/d20-black.svg" });
    }
  }

  ui.notifications.info("Created/updated: Critical Injury — Body, Critical Injury — Head, Mech Critical");
})();
