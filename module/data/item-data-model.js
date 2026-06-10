export class ItemDataModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      // Shared fields for all item types
      description: new fields.StringField({ initial: "" }),
      sort: new fields.NumberField({ initial: 0, integer: true })
    };
  }
}

// Schema for weapon items
export class WeaponDataModel extends ItemDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const parentSchema = super.defineSchema();
    return foundry.utils.mergeObject(parentSchema, {
      name: new fields.StringField({ initial: "" }),
      wa: new fields.NumberField({ initial: 0, integer: true }),
      range: new fields.StringField({ initial: "" }),
      weaponType: new fields.StringField({ initial: "Pistol" }),
      damage: new fields.StringField({ initial: "" }),
      rof: new fields.NumberField({ initial: 1, integer: true, min: 1 }),
      shots: new fields.NumberField({ initial: 0, integer: true }),
      concealable: new fields.BooleanField({ initial: false }),
      hands: new fields.NumberField({ initial: 2, integer: true, min: 1 }),
      cost: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      autofire: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      pen: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      quality: new fields.StringField({ initial: "Standard" }),
      skill: new fields.StringField({ initial: "" }),
      note: new fields.StringField({ initial: "" }),
      isMecha: new fields.BooleanField({ initial: false })
    });
  }
}

// Schema for skill items
export class SkillDataModel extends ItemDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const parentSchema = super.defineSchema();
    return foundry.utils.mergeObject(parentSchema, {
      stat: new fields.StringField({ initial: "INT" }),
      category: new fields.StringField({ initial: "" }),
      rank: new fields.NumberField({ initial: 0, integer: true }),
      favorite: new fields.BooleanField({ initial: false }),
      ip: new fields.NumberField({ initial: 0, integer: true }),
      hard: new fields.BooleanField({ initial: false }),
      custom: new fields.BooleanField({ initial: false })
    });
  }
}

// Schema for armor items
export class ArmorDataModel extends ItemDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const parentSchema = super.defineSchema();
    return foundry.utils.mergeObject(parentSchema, {
      armorValue: new fields.NumberField({ initial: 0, integer: true })
    });
  }
}

// Schema for cyberware items
export class CyberwareDataModel extends ItemDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const parentSchema = super.defineSchema();
    return foundry.utils.mergeObject(parentSchema, {
      slot: new fields.StringField({ initial: "torso" }),
      category: new fields.StringField({ initial: "" }),
      slotsUsed: new fields.NumberField({ initial: 1, integer: true, min: 0 }),
      optionSlots: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      isOption: new fields.BooleanField({ initial: false }),
      requiresFoundation: new fields.StringField({ initial: "" }),
      humanityLoss: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      cost: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      armor: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      integrity: new fields.NumberField({ initial: 0, integer: true, min: 0 }),
      note: new fields.StringField({ initial: "" })
    });
  }
}
