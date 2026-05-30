export class MektonFusionItemSheet extends foundry.appv1.sheets.ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["long-drift", "sheet", "item"],
      template: "systems/long-drift/templates/item-sheet.html",
      width: 520,
      height: 420,
      closeOnSubmit: false,
      submitOnChange: true
    });
  }

  getData(options = {}) {
    const context = super.getData(options);
    context.system = this.object.system ?? {};
    
    // Add helper data to context
    context.isSkill = this.object.type === "skill";
    context.isCyberware = this.object.type === "cyberware";
    context.isCustom = this.object.system?.custom;
    
    // Debug logging
    console.log("long-drift | Item sheet getData:", {
      name: this.object.name,
      type: this.object.type,
      system: this.object.system,
      isSkill: context.isSkill,
      isCustom: this.object.system?.custom
    });
    
    // Add stat selections for dropdown - always create for skills
    if (context.isSkill) {
      const stats = ["INT", "REF", "DEX", "TECH", "COOL", "WILL", "LUCK", "MOVE", "BODY", "EMP"];
      const currentStat = this.object.system?.stat || "REF";
      const statChoices = stats.includes(currentStat) ? stats : [...stats, currentStat];
      context.statOptions = statChoices.map(stat => ({
        value: stat,
        label: stat,
        selected: stat === currentStat
      }));
      
      // Create HTML for stat select element
      context.statSelectHTML = statChoices.map(stat => 
        `<option value="${stat}"${stat === currentStat ? ' selected' : ''}>${stat}</option>`
      ).join('');
      
      console.log("long-drift | Created stat options:", context.statOptions);
      console.log("long-drift | Current stat:", currentStat);
    }
    
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    
    // Set the correct value for the stat dropdown
    if (this.object.type === "skill" && this.object.system?.custom) {
      const statSelect = html.find('select[name="system.stat"]');
      if (statSelect.length && this.object.system.stat) {
        statSelect.val(this.object.system.stat);
        console.log("long-drift | Set stat dropdown to:", this.object.system.stat);
      }
    }
    
    // Only handle changes for name and stat (custom skills only)
    html.find('input[name="name"]').change(this._onFormChange.bind(this));
    if (this.object.type === "skill" && this.object.system?.custom) {
      html.find('select[name="system.stat"]').change(this._onFormChange.bind(this));
    }
  }

  async _onFormChange(event) {
    // Auto-save on form changes
    return this._onSubmit(event);
  }

  async _updateObject(event, formData) {
    // Handle the form submission and update the item
    return this.object.update(formData);
  }
}
