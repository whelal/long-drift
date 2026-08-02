// module/script/sheets/actor-sheet.js
import { STAT_DEFAULT_VALUES, applyStatDefaults } from "../../module/data/defaults.js";
import { LONG_DRIFT_CORE_SKILLS } from "../../module/data/skills.js";
import { WEAPON_RANGE_DVS, getDVForRange } from "../../module/data/weapon-ranges.js";
import { CPR_WEAPONS_COMPENDIUM } from "../../module/data/weapons-compendium.js";

const normalizeSkillName = (name) => String(name || "").trim().toLowerCase();
const CPR_CORE_SKILL_NAMES = new Set(LONG_DRIFT_CORE_SKILLS.map(skill => normalizeSkillName(skill.name)));

const SITUATIONAL_MODIFIERS = [
  { label: "Complimentary Skill", value: 1 },
  { label: "Taking Extra Time", value: 1 },
  { label: "Night/Low Light", value: -1 },
  { label: "Never done task before", value: -1 },
  { label: "Complex action", value: -2 },
  { label: "Wrong tools/parts for job", value: -2 },
  { label: "Bad Sleep", value: -2 },
  { label: "Extremely stressed", value: -2 },
  { label: "Extremely tired", value: -4 },
  { label: "Very drunk/sedated", value: -4 },
  { label: "Attempting task stealthily", value: -4 },
  { label: "Smoke/darkness", value: -4 },
];

export class LongDriftActorSheet extends foundry.appv1.sheets.ActorSheet {
  static _getWeaponTemplatesForType(weaponType) {
    const type = String(weaponType || "").trim();
    if (!type) return [];
    return CPR_WEAPONS_COMPENDIUM.filter((w) => String(w?.system?.weaponType || "") === type);
  }

  static _getWeaponTemplateForType(weaponType) {
    const matches = this._getWeaponTemplatesForType(weaponType);
    return matches[0] || null;
  }

  static _weaponDocFromTemplate(template, fallbackType = "Pistol") {
    const weaponType = String(template?.system?.weaponType || fallbackType || "Pistol");
    const qualityRaw = String(template?.system?.quality || "Standard");
    const quality = ["Poor", "Standard", "Excellent"].includes(qualityRaw) ? qualityRaw : "Standard";
    return {
      name: String(template?.name || `New ${weaponType}`),
      type: "weapon",
      img: template?.img || "",
      system: {
        wa: this._num(template?.system?.wa, 0),
        range: String(template?.system?.range || ""),
        weaponType,
        damage: String(template?.system?.damage || ""),
        rof: Math.max(1, this._num(template?.system?.rof, 1)),
        shots: this._num(template?.system?.shots, 0),
        quality,
        skill: String(template?.system?.skill || ""),
        isMecha: !!template?.system?.isMecha,
        note: String(template?.system?.note || "")
      }
    };
  }

  async _promptWeaponTypeChoice(defaultType = "Pistol") {
    const options = Object.keys(WEAPON_RANGE_DVS || {});
    const selected = await Dialog.prompt({
      title: "Add Weapon",
      content: `
        <p>Select weapon type:</p>
        <select name="weaponType" style="width:100%;">
          ${options.map((type) => `<option value="${type}" ${type === defaultType ? "selected" : ""}>${type}</option>`).join("")}
        </select>
      `,
      label: "Create",
      callback: (html) => String(html.find("[name='weaponType']").val() || defaultType)
    });
    return String(selected || defaultType);
  }

  async _promptWeaponTemplateChoice(weaponType, defaultTemplateName = "") {
    const templates = this.constructor._getWeaponTemplatesForType(weaponType);
    if (!templates.length) return null;
    if (templates.length === 1) return templates[0];

    const defaultName = templates.some((t) => t.name === defaultTemplateName)
      ? defaultTemplateName
      : templates[0].name;

    const selectedName = await Dialog.prompt({
      title: `Choose ${weaponType} Template`,
      content: `
        <p>Select weapon profile:</p>
        <select name="weaponTemplate" style="width:100%;">
          ${templates.map((t) => `<option value="${t.name}" ${t.name === defaultName ? "selected" : ""}>${t.name}</option>`).join("")}
        </select>
      `,
      label: "Use Template",
      callback: (html) => String(html.find("[name='weaponTemplate']").val() || defaultName)
    });

    const chosen = templates.find((t) => t.name === String(selectedName || defaultName));
    return chosen || templates[0];
  }

  static _getWeaponTypeConfig(weaponType) {
    const key = String(weaponType || "").trim();
    return WEAPON_RANGE_DVS?.[key] || null;
  }

  static _toDisplayDv(rawDv) {
    return Number.isFinite(Number(rawDv)) ? Number(rawDv) : "-";
  }

  static _getWeaponRangeBands(weaponType) {
    const ranges = this._getWeaponTypeConfig(weaponType)?.ranges;

    if (Array.isArray(ranges)) {
      return ranges.map((band) => ({
        label: String(band?.label || "-"),
        dv: this._toDisplayDv(band?.dv)
      }));
    }

    // Backward-compatible shape support for older object-based range data.
    const legacy = ranges || {};
    const order = ["close", "medium", "long", "extreme"];
    return order.map((key) => {
      const band = legacy?.[key];
      return {
        label: String(band?.label || "-"),
        dv: this._toDisplayDv(band?.dv)
      };
    });
  }

  static _getWeaponRangeTooltip(weaponType) {
    const bands = this._getWeaponRangeBands(weaponType);
    return bands.map((band) => `${band.label}: DV ${band.dv}`).join("\n");
  }

  static _getWeaponAutofireSummary(weaponType) {
    const config = this._getWeaponTypeConfig(weaponType);
    if (!config?.hasAutofire) return "";

    const dvTable = Array.isArray(config.autofireDVs)
      ? config.autofireDVs
          .map((band) => `${String(band?.label || "-")}: DV ${this._toDisplayDv(band?.dv)}`)
          .join(" | ")
      : "";

    const maxInfo = Number.isFinite(Number(config.autofireMax))
      ? `Max ${Number(config.autofireMax)}`
      : "";

    return [maxInfo, dvTable].filter(Boolean).join(" • ");
  }

  _updateWeaponDvDisplay(rowElement, weaponType) {
    if (!rowElement) return;
    const bands = this.constructor._getWeaponRangeBands(weaponType);
    const tooltip = this.constructor._getWeaponRangeTooltip(weaponType);
    const grid = rowElement.querySelector('.weapon-dv-grid');
    if (!grid) return;

    grid.innerHTML = "";

    for (const band of bands) {
      const node = document.createElement('span');
      node.textContent = `${band.label}: DV ${band.dv}`;
      grid.appendChild(node);
    }

    const autofireSummary = this.constructor._getWeaponAutofireSummary(weaponType);
    if (autofireSummary) {
      const afNode = document.createElement('span');
      afNode.classList.add('weapon-autofire-inline');
      afNode.textContent = `AF mode: ${autofireSummary}`;
      grid.appendChild(afNode);
    }

    grid.title = tooltip;
  }

  // Sort by .system.sort (or .item.system.sort), then by name
  static bySortThenName(a, b, collator) {
    const as = Number(a.system?.sort ?? a.item?.system?.sort ?? 999999);
    const bs = Number(b.system?.sort ?? b.item?.system?.sort ?? 999999);
    if (as !== bs) return as - bs;
    return collator.compare(a.name, b.name);
  }

  async _purgeNonCprSkills() {
    if (!this.actor || !this.isEditable) return 0;

    const staleSkills = this.actor.items.filter(it => {
      if (it.type !== "skill") return false;
      if (it.system?.custom) return false;
      if (String(it.system?.category || "").toUpperCase() === "CUSTOM") return false;
      return !CPR_CORE_SKILL_NAMES.has(normalizeSkillName(it.name));
    });

    if (!staleSkills.length) return 0;
    await this.actor.deleteEmbeddedDocuments("Item", staleSkills.map(it => it.id));
    return staleSkills.length;
  }

  _refreshBodyItemIcons() {
    try {
      const locs = this.actor.system?.body?.locations || {};
      const svgel = this.element[0].querySelector('.mf-doll-svg');
      if (!svgel) return;
      const icons = svgel.querySelectorAll('.item-icon');
      icons.forEach(img => {
        const loc = img.dataset.loc;
        const itemId = locs?.[loc]?.itemId;
        if (itemId) {
          const item = this.actor.items.get(itemId);
          img.setAttribute('href', item?.img || '');
          img.style.display = item?.img ? '' : 'none';
        } else {
          img.setAttribute('href', '');
          img.style.display = 'none';
        }
      });
    } catch (e) { console.warn('long-drift | Failed to refresh body item icons', e); }
  }
  constructor(...args) {
    super(...args);
    // Skills tab view state; loaded from actor flag lazily.
    this._tabViewState = {
      skills: { favOnly: false }
    };
    this._viewStateLoaded = false;
    this._autoFitObserver = null;
    this._autoFitRAF = null;
  }
  get template() {
    if (this.actor?.type === "npc") return "systems/long-drift/templates/actor/npc-sheet.hbs";
    return "systems/long-drift/templates/actor/actor-sheet.hbs";
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["long-drift", "sheet", "actor"],
      template: "systems/long-drift/templates/actor/actor-sheet.hbs",
      width: 740,
      height: 700,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }],
      submitOnChange: true,
      submitOnClose: true,
      closeOnSubmit: false,
      scrollY: [".tab.stats", ".tab.combat", ".tab.skills", ".tab.equipment", ".tab.notes", ".tab.vehicle"]
    });
  }

  // Utility: coerce to number and strip commas
  static _num(v, fallback = 0) {
    if (v === null || v === undefined) return fallback;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    const s = String(v).replace(/,/g, "").trim();
    const n = Number(s);
    return Number.isFinite(n) ? n : fallback;
  }

  // Returns the armor-penalty-reduced value for REF/DEX/MOVE; raw stat value for all others.
  // Falls back to raw when effectiveXxx is 0 (uninitialized, before first prepareDerivedData).
  static _effectiveStatVal(system, stat) {
    const effectiveMap = { REF: 'effectiveREF', DEX: 'effectiveDEX', MOVE: 'effectiveMOVE' };
    const effectiveKey = effectiveMap[stat];
    if (effectiveKey) {
      const v = Number(system?.substats?.[effectiveKey]);
      if (v > 0) return v;
    }
    const raw = system?.stats?.[stat];
    return typeof raw === 'object' && raw !== null ? Number(raw.value) || 0 : Number(raw) || 0;
  }

  // Keep display text fields readable by dropping punctuation-only junk values.
  static _cleanDisplayText(v) {
    const s = String(v ?? '').trim();
    if (!s) return '';
    return /[\p{L}\p{N}]/u.test(s) ? s : '';
  }

  _fitInputFontSize(input, options = {}) {
    if (!input) return;
    const computed = Number.parseFloat(globalThis.getComputedStyle?.(input)?.fontSize || "14") || 14;
    if (!input.dataset.fitBase || !Number.isFinite(Number(input.dataset.fitBase))) {
      input.dataset.fitBase = String(computed);
    }

    const basePx = Number(input.dataset.fitBase) || computed;
    const maxPx = Number(options.maxPx ?? input.dataset.fitMax ?? basePx);
    const minPx = Number(options.minPx ?? input.dataset.fitMin ?? 10);
    const stepPx = Number(options.stepPx ?? 0.5);

    if (input.clientWidth <= 0) return;

    input.style.fontSize = `${maxPx}px`;
    if (!input.value) return;

    let size = maxPx;
    while (size > minPx && input.scrollWidth > input.clientWidth - 4) {
      size -= stepPx;
      input.style.fontSize = `${size}px`;
    }
  }

  _applyAutoFitInputs(root) {
    const container = root?.[0] ?? root;
    if (!container?.querySelectorAll) return;
    const inputs = container.querySelectorAll('.auto-fit-input');
    inputs.forEach(input => this._fitInputFontSize(input));
  }

  _scheduleAutoFitInputs(root) {
    if (this._autoFitRAF) {
      cancelAnimationFrame(this._autoFitRAF);
      this._autoFitRAF = null;
    }

    this._autoFitRAF = requestAnimationFrame(() => {
      this._autoFitRAF = null;
      this._applyAutoFitInputs(root);
    });
  }

  _setupAutoFitObserver(html) {
    const container = html?.[0] ?? html;
    if (!container || typeof ResizeObserver === 'undefined') return;

    if (this._autoFitObserver) {
      this._autoFitObserver.disconnect();
      this._autoFitObserver = null;
    }

    this._autoFitObserver = new ResizeObserver(() => this._scheduleAutoFitInputs(container));
    this._autoFitObserver.observe(container);
  }

  _teardownAutoFitObserver() {
    if (this._autoFitObserver) {
      this._autoFitObserver.disconnect();
      this._autoFitObserver = null;
    }
    if (this._autoFitRAF) {
      cancelAnimationFrame(this._autoFitRAF);
      this._autoFitRAF = null;
    }
  }

  static normalizeStatKey(stat) {
    const s = String(stat || "").toUpperCase();
    const map = {
      MA: "MOVE",
      ATTR: "COOL",
      EDU: "INT",
      PSI: "WILL"
    };
    return map[s] || s || "INT";
  }

  // Exploding d10: roll at least once; while a die shows 10, roll again and accumulate.
  // Bidirectional exploding d10:
  //  - Roll initial d10.
  //  - If initial roll is 10: keep rolling while you get 10s, include the final non-10.
  //  - If initial roll is 1: Critical Failure - roll ONE additional d10 and subtract it (no chain).
  // Returns a consolidated Roll (for module parsing) plus breakdown arrays.
  static async _rollBidirectionalExplodingD10() {
    const plusDice = [];
    const minusDice = [];
    const MAX_EXTRA = 10; // cap on additional dice beyond the first
    let extraCount = 0;
    let capped = false;

    // roll helper
    async function rollD10() {
      const r = new Roll('1d10');
      await r.evaluate();
      return r.total || 0;
    }

    // Initial roll determines the explosion direction
    const first = await rollD10();
    
    if (first === 10) {
      // Upward explosion chain - keep rolling while we get 10s, include final non-10
      plusDice.push(first);
      while (extraCount < MAX_EXTRA) {
        const current = await rollD10();
        extraCount++;
        plusDice.push(current); // Always include the die in upward explosion
        if (current !== 10) {
          // Different value rolled - explosion stops, but this die is included
          break;
        }
        if (extraCount >= MAX_EXTRA) {
          capped = true;
          break;
        }
      }
    } else if (first === 1) {
      // Critical Failure - roll ONE additional d10 and subtract it
      plusDice.push(first); // The initial 1 goes in plus dice
      const criticalFailureRoll = await rollD10();
      minusDice.push(criticalFailureRoll); // Subtract the critical failure roll
      extraCount = 1; // Only one extra roll for critical failure
    } else {
      // Normal roll - no explosion
      plusDice.push(first);
    }

    const plusTotal = plusDice.reduce((a,b)=>a+b,0);
    const minusTotal = minusDice.reduce((a,b)=>a+b,0);
    const net = plusTotal - minusTotal;

    // Build a synthetic Roll expression for compatibility: represent all individual dice.
    // Example: (10+10+4) for upward explosion, or (1)-(7) for critical failure
    let formula;
    if (minusDice.length > 0) {
      const plusExpr = plusDice.map(d=>d).join('+') || '0';
      const minusExpr = minusDice.map(d=>d).join('+');
      formula = `${plusExpr}-(${minusExpr})`;
    } else {
      formula = plusDice.map(d=>d).join('+') || '0';
    }
    
    const total = net;
    // Create Roll object from formula (no dice terms, purely numeric) for compatibility
    const roll = new Roll(formula);
    await roll.evaluate();
    // Attach raw arrays for external modules / debugging
    roll.flags ??= {};
    roll.flags['long-drift'] = { plusDice: [...plusDice], minusDice: [...minusDice], capped };
    return { roll, total, plusDice, minusDice, capped, maxExtra: MAX_EXTRA };
  }

  /** @override */
  async _updateObject(event, formData) {
    // Ensure proper data synchronization when updating actor
    console.log("long-drift | _updateObject called with:", formData);
    console.log("long-drift | Actor ID:", this.actor.id);
    console.log("long-drift | Is Token Actor:", this.actor.isToken);
    console.log("long-drift | Actor Link:", this.actor.token?.actorLink);
    
    // Normalize substats to preserve decimal values for run/leap/swim
    try {
      // Text fields can arrive as arrays when duplicate inputs bind to the same path.
      // Collapse to a single value to avoid Array.toString() introducing commas.
      const normalizeTextField = (key, fallback = '') => {
        let val = formData[key];
        if (Array.isArray(val)) {
          const cleaned = val.map(v => String(v ?? '').trim());
          const nonEmpty = cleaned.filter(v => v.length > 0);
          if (key === 'name') {
            // Actor name can collide with other stray name inputs; keep the first value.
            val = nonEmpty.length ? nonEmpty[0] : cleaned[0] ?? '';
          } else {
            val = nonEmpty.length ? nonEmpty[nonEmpty.length - 1] : cleaned[cleaned.length - 1] ?? '';
          }
        }
        if (val === null || val === undefined) val = fallback;
        val = String(val).trim();
        // Repair old artifact from duplicate-field array serialization (",", ",,", etc.).
        if (key === 'system.role.name') {
          val = val.replace(/^[\s,]+|[\s,]+$/g, '');
        }
        formData[key] = val;
      };

  normalizeTextField('name', String(this.actor.name ?? ''));
      normalizeTextField('system.role.name', String(this.actor.system?.role?.name ?? ''));
      normalizeTextField('system.role.ability', String(this.actor.system?.role?.ability ?? ''));
      normalizeTextField('system.role.notes', String(this.actor.system?.role?.notes ?? ''));

      const decimalFields = ['run', 'leap', 'swim'];
      for (const field of decimalFields) {
        const key = `system.substats.${field}`;
        if (formData[key] !== undefined && formData[key] !== '') {
          formData[key] = parseFloat(formData[key]) || 0;
        }
      }
      
      // Normalize initiative (MV) - integer only
      let mv = formData["system.substats.initiative"];
      if (Array.isArray(mv)) {
        const nonEmpty = mv.filter(v => v !== '' && v !== null && v !== undefined);
        mv = nonEmpty.length ? nonEmpty[nonEmpty.length - 1] : mv[mv.length - 1];
      }
      if (mv === '' || mv === null || mv === undefined) {
        mv = this.actor.system?.substats?.initiative ?? 0;
      }
      const mvNum = Number.isFinite(Number(mv)) ? parseInt(mv, 10) : 0;
      formData["system.substats.initiative"] = mvNum;

      // Normalize role/meta numeric fields that can arrive as empty strings
      // (e.g. submitOnChange after editing portrait).
      const normalizeIntField = (key, fallback) => {
        let val = formData[key];
        if (Array.isArray(val)) {
          const nonEmpty = val.filter(v => v !== '' && v !== null && v !== undefined);
          val = nonEmpty.length ? nonEmpty[nonEmpty.length - 1] : val[val.length - 1];
        }
        if (val === '' || val === null || val === undefined) {
          val = fallback;
        }
        formData[key] = Number.isFinite(Number(val)) ? parseInt(val, 10) : fallback;
      };

      normalizeIntField("system.role.rank", Number(this.actor.system?.role?.rank ?? 4));
      normalizeIntField("system.meta.points", Number(this.actor.system?.meta?.points ?? 0));
      normalizeIntField("system.meta.reputation", Number(this.actor.system?.meta?.reputation ?? 0));
      normalizeIntField("system.meta.eurobucks", Number(this.actor.system?.meta?.eurobucks ?? 500));
      normalizeIntField("system.substats.humanity", Number(this.actor.system?.substats?.humanity ?? 0));
      normalizeIntField("system.substats.hp.value", Number(this.actor.system?.substats?.hp?.value ?? 0));

      // Core stat values can come through as arrays when multiple tabs include the same fields.
      // Coerce all to integers so DataModel schema validation always receives numbers.
      const statKeys = ["INT", "REF", "DEX", "TECH", "COOL", "WILL", "LUCK", "MOVE", "BODY", "EMP"];
      for (const stat of statKeys) {
        normalizeIntField(
          `system.stats.${stat}.value`,
          Number(this.actor.system?.stats?.[stat]?.value ?? STAT_DEFAULT_VALUES[stat] ?? 0)
        );
      }

      // Keep key derived vitals in sync even when DataModel derivation is delayed/skipped.
      const bodyVal = Number(formData["system.stats.BODY.value"] ?? this.actor.system?.stats?.BODY?.value ?? STAT_DEFAULT_VALUES.BODY);
      const empVal = Number(formData["system.stats.EMP.value"] ?? this.actor.system?.stats?.EMP?.value ?? STAT_DEFAULT_VALUES.EMP);
      const willVal = Number(formData["system.stats.WILL.value"] ?? this.actor.system?.stats?.WILL?.value ?? STAT_DEFAULT_VALUES.WILL);
      const body = Number.isFinite(bodyVal) ? bodyVal : STAT_DEFAULT_VALUES.BODY;
      const emp = Number.isFinite(empVal) ? empVal : STAT_DEFAULT_VALUES.EMP;
      const will = Number.isFinite(willVal) ? willVal : STAT_DEFAULT_VALUES.WILL;

      const hpMax = 10 + (5 * Math.ceil(body / 2)) + (5 * Math.ceil(will / 2));
      const humanityMax = emp * 10;
      formData["system.substats.hp.max"] = hpMax;
      formData["system.substats.humanityMax"] = humanityMax;
      formData["system.substats.death"] = body;

      // Clamp current pools to their derived max values.
      const hpCurrent = Number(formData["system.substats.hp.value"]);
      const humanityCurrent = Number(formData["system.substats.humanity"]);
      formData["system.substats.hp.value"] = Number.isFinite(hpCurrent)
        ? Math.max(0, Math.min(Math.trunc(hpCurrent), hpMax))
        : hpMax;
      formData["system.substats.humanity"] = Number.isFinite(humanityCurrent)
        ? Math.max(0, Math.min(Math.trunc(humanityCurrent), humanityMax))
        : humanityMax;

      // Update wound state text from the same derived values to avoid stale labels.
      const seriousThreshold = Math.ceil(hpMax / 2);
      let woundState = "Healthy";
      let woundStateSubtitle = "No penalties";
      if (formData["system.substats.hp.value"] <= 0) {
        woundState = "Mortally Wounded";
        woundStateSubtitle = "-4 all Actions / -6 MOVE / Death Save each Turn";
      } else if (formData["system.substats.hp.value"] < seriousThreshold) {
        woundState = "Seriously Wounded";
        woundStateSubtitle = "-2 all Actions / Stabilization DV13";
      } else if (formData["system.substats.hp.value"] < hpMax) {
        woundState = "Lightly Wounded";
        woundStateSubtitle = "Stabilization DV10";
      }
      formData["system.substats.woundState"] = woundState;
      formData["system.substats.woundStateSubtitle"] = woundStateSubtitle;
    } catch (e) {
      console.warn('long-drift | Failed to normalize substats before update', e);
    }
    
    // Call the parent method to handle the update
    const result = await super._updateObject(event, formData);
    
    // For unlinked tokens, we need to manually sync with other sheets. Use multiple heuristics
    // (prototype token, token.actorId, fallback name) to avoid false-positive mismatches.
    function likelySameActorInstance(a, b) {
      if (!a || !b) return false;
      if (a.id === b.id) return true;
      // If either has a token document with a recorded actorId that references the other, match
      try {
        const aToken = a.token ?? {};
        const bToken = b.token ?? {};
        if (aToken.actorId && aToken.actorId === b.id) return true;
        if (bToken.actorId && bToken.actorId === a.id) return true;

        // Compare prototype token definitions when available (stringified compare)
        const aProto = a.prototypeToken ?? a.system?.prototypeToken ?? aToken.prototypeToken ?? null;
        const bProto = b.prototypeToken ?? b.system?.prototypeToken ?? bToken.prototypeToken ?? null;
        if (aProto && bProto) {
          try {
            if (JSON.stringify(aProto) === JSON.stringify(bProto)) return true;
          } catch (e) {
            // ignore stringify errors
          }
        }
      } catch (e) {
        console.warn('long-drift | Error comparing actor prototypes', e);
      }
      // Fallback to name match
      return a.name === b.name;
    }

    if (this.actor.isToken && !this.actor.token?.actorLink) {
      console.log("long-drift | Handling unlinked token update - syncing by heuristics");

      // Find other sheets that likely represent the same actor data and manually update them
      Object.values(ui.windows).forEach(app => {
        if (app.constructor.name === "LongDriftActorSheet" && app.rendered && app !== this && app.actor) {
          if (likelySameActorInstance(app.actor, this.actor)) {
            console.log("long-drift | Manually syncing unlinked actor (heuristic):", app.actor.name);
            // Only sync to other unlinked tokens or to the base actor (not to linked token sheets)
            if ((!app.actor.isToken) || (app.actor.isToken && !app.actor.token?.actorLink)) {
              // Expand the flat form data into nested object, but strip keys that would
              // cause Foundry to try to update embedded Documents (items/token) on
              // a TokenDocument-backed actor. Such updates throw when the target actor
              // is not a proper base Actor document.
              const expanded = foundry.utils.expandObject(formData);
              const disallowedTopLevel = ['items', 'token', 'prototypeToken', 'actor', 'tokenId'];
              for (const k of disallowedTopLevel) {
                if (Object.prototype.hasOwnProperty.call(expanded, k)) {
                  console.debug(`long-drift | Stripping disallowed update key from sync: ${k}`);
                  delete expanded[k];
                }
              }
              // Also ensure we don't accidentally pass an "actor" object nested under token
              if (expanded.token && typeof expanded.token === 'object') {
                delete expanded.token.actor;
                delete expanded.token.actorId;
              }
              app.actor.update(expanded).catch(err => console.warn("long-drift | Failed to sync unlinked actor data:", err));
            }
          }
        }
      });
    } else {
      console.log("long-drift | Standard linked actor update");
    }
    
    // Force refresh of all related sheets
    console.log("long-drift | Forcing refresh of all related sheets");
    Object.values(ui.windows).forEach(app => {
      if (app.constructor.name === "LongDriftActorSheet" && 
          app.rendered && 
          app !== this &&
          (app.actor?.id === this.actor.id || 
           (app.actor?.name === this.actor.name && !app.actor?.token?.actorLink))) {
        console.log("long-drift | Force refreshing sheet for:", app.actor.name);
        app.render(false);
      }
    });
    
    return result;
  }

  async getData(options = {}) {
    const ctx = await super.getData(options);
    ctx.actor = this.actor;

    ctx.system = this.actor.system ?? {};
    ctx.system.stats = applyStatDefaults(ctx.system.stats ?? {});
    ctx.system.substats ??= {};

    // Fallback derivation for fresh/legacy actors when DataModel-derived values are still zero.
    const bodyStat = this.constructor._num(
      ctx.system.stats?.BODY?.value ?? ctx.system.stats?.BODY,
      STAT_DEFAULT_VALUES.BODY
    );
    const empStat = this.constructor._num(
      ctx.system.stats?.EMP?.value ?? ctx.system.stats?.EMP,
      STAT_DEFAULT_VALUES.EMP
    );
    const willStat = this.constructor._num(
      ctx.system.stats?.WILL?.value ?? ctx.system.stats?.WILL,
      STAT_DEFAULT_VALUES.WILL
    );
    const derivedHpMax = 10 + (5 * Math.ceil(bodyStat / 2)) + (5 * Math.ceil(willStat / 2));
    const derivedHumanityMax = empStat * 10;

    // Snapshot current values before overwriting max fields, since ctx.system is a live reference.
    const snapHp = this.constructor._num(ctx.system.substats.hp?.max, 0);
    const snapHpCurrent = this.constructor._num(ctx.system.substats.hp?.value, 0);
    const snapHumanityMax = this.constructor._num(ctx.system.substats.humanityMax, 0);
    const snapHumanity = this.constructor._num(ctx.system.substats.humanity, 0);

    // Max values are always derived from stats. Unconditionally override whatever prepareDerivedData
    // or stored data has, so the sheet reflects the correct caps even if the DataModel lifecycle
    // did not call prepareDerivedData() (e.g. DataModel vs TypeDataModel base class difference).
    ctx.system.substats.hp.max = derivedHpMax;
    ctx.system.substats.humanityMax = derivedHumanityMax;
    ctx.system.substats.death = bodyStat;

    // Current values: initialize to max for fresh actors (both snapped 0 = schema default, never set).
    // For used actors clamp to the new max to handle stat-change edge cases.
    if (snapHp === 0 && snapHpCurrent === 0) {
      ctx.system.substats.hp.value = derivedHpMax;
    } else {
      ctx.system.substats.hp.value = Math.max(0, Math.min(snapHpCurrent, derivedHpMax));
    }

    if (snapHumanityMax === 0 && snapHumanity === 0) {
      ctx.system.substats.humanity = derivedHumanityMax;
    } else {
      ctx.system.substats.humanity = Math.max(0, Math.min(snapHumanity, derivedHumanityMax));
    }

    ctx.items = this.actor.items ?? [];
    ctx.editable = this.isEditable;

    const weaponTypeOptions = Object.keys(WEAPON_RANGE_DVS || {});
    const weaponSkillOptions = LONG_DRIFT_CORE_SKILLS
      .filter(skill => ["Fighting", "Ranged Weapon"].includes(String(skill.system?.category || "")))
      .map(skill => skill.name);
    const weaponQualityOptions = ["Poor", "Standard", "Excellent"];
    ctx.weaponTypeOptions = weaponTypeOptions;
    ctx.weaponSkillOptions = weaponSkillOptions;
    ctx.weaponQualityOptions = weaponQualityOptions;
    ctx.combatWeapons = this.actor.items
      .filter(i => i.type === "weapon")
      .map(item => {
        const weaponType = String(item.system?.weaponType || "Pistol");
        const qualityRaw = String(item.system?.quality || "Standard");
        const quality = ["Poor", "Standard", "Excellent"].includes(qualityRaw) ? qualityRaw : "Standard";
        const hasAutofire = !!this.constructor._getWeaponTypeConfig(weaponType)?.hasAutofire;
        const autofireSummary = this.constructor._getWeaponAutofireSummary(weaponType);
        const attackModes = [{ key: "single", label: "ATK", title: "Attack roll (linked skill)" }];
        if (hasAutofire) {
          attackModes.push({ key: "autofire", label: "AF", title: "Autofire roll (Autofire (x2))" });
        }
        return {
          id: item.id,
          type: item.type,
          name: item.name,
          system: {
            ...item.system,
            weaponType,
            quality,
            isMecha: !!item.system?.isMecha,
            rof: this.constructor._num(item.system?.rof, 1)
          },
          displayScale: item.system?.isMecha ? "MS" : "PS",
          hasAutofire,
          autofireSummary,
          attackModes,
          rangeBands: this.constructor._getWeaponRangeBands(weaponType),
          rangeTooltip: this.constructor._getWeaponRangeTooltip(weaponType)
        };
      });

    // Migration: legacy abilities -> stats
    if (ctx.system.abilities && !ctx.system.stats) {
      console.warn("long-drift | Migrating legacy system.abilities -> RED stat schema.");
      const abil = ctx.system.abilities; const migrated = {};
      const map = {
        ref: "REF",
        int: "INT",
        body: "BODY",
        tech: "TECH",
        cool: "COOL",
        will: "WILL",
        luck: "LUCK",
        move: "MOVE",
        emp: "EMP"
      };
      for (const [k, data] of Object.entries(abil)) {
        const upperKey = map[k] || k.toUpperCase();
        migrated[upperKey] = { value: this.constructor._num(data?.value, STAT_DEFAULT_VALUES[upperKey] ?? 5) };
      }
      ctx.system.stats = applyStatDefaults(migrated);
    }

    // With DataModel schema defining substats, manual seeding is no longer required. Keep a one-time
    // migration path: if legacy actors lack substats container, ensure it's present, but do not write defaults.
    if (!this.actor.system?.substats) {
      await this.actor.update({ 'system.substats': {} });
    }

    // Ensure a body model exists for the paperdoll. If absent, seed with a minimal default structure.
    if (!this.actor.system?.body || !this.actor.system?.body?.locations) {
      console.log('long-drift | Initializing body locations for', this.actor.name);
      const defaultBody = {
        locations: {
          head:   { label: "Head", itemId: "", notes: "" },
          torso:  { label: "Torso", itemId: "", notes: "" },
          rArm:   { label: "Right Arm", itemId: "", notes: "" },
          lArm:   { label: "Left Arm", itemId: "", notes: "" },
          rHand:  { label: "Right Hand", itemId: "", notes: "" },
          lHand:  { label: "Left Hand", itemId: "", notes: "" },
          rLeg:   { label: "Right Leg", itemId: "", notes: "" },
          lLeg:   { label: "Left Leg", itemId: "", notes: "" },
          rFoot:  { label: "Right Foot", itemId: "", notes: "" },
          lFoot:  { label: "Left Foot", itemId: "", notes: "" }
        },
        notes: ""
      };
      try {
        await this.actor.update({ 'system.body': defaultBody });
        console.log('long-drift | Body locations initialized successfully');
        // Refresh context after update
        ctx.system = this.actor.system ?? {};
      } catch (e) {
        console.warn('long-drift | Failed to initialize actor.body default', e);
      }
    } else {
      console.log('long-drift | Body locations found:', this.actor.system.body.locations);
      const requiredBodyLocations = {
        rHand: { label: "Right Hand", itemId: "", notes: "" },
        lHand: { label: "Left Hand", itemId: "", notes: "" },
        rFoot: { label: "Right Foot", itemId: "", notes: "" },
        lFoot: { label: "Left Foot", itemId: "", notes: "" }
      };
      const patch = {};
      const currentLocations = this.actor.system?.body?.locations || {};
      for (const [k, def] of Object.entries(requiredBodyLocations)) {
        if (!currentLocations[k]) patch[`system.body.locations.${k}`] = def;
      }
      if (Object.keys(patch).length) {
        try {
          await this.actor.update(patch);
          ctx.system = this.actor.system ?? {};
          console.log('long-drift | Added missing body locations:', Object.keys(patch));
        } catch (e) {
          console.warn('long-drift | Failed adding missing body locations', e);
        }
      }
    }

    const bodyLocations = ctx.system?.body?.locations || {};
    const spaceByLocation = {};
    const installedByLocation = [];
    let totalUsedSpaces = 0;
    let installedCount = 0;
    for (const [locKey, locData] of Object.entries(bodyLocations)) {
      const itemId = locData?.itemId;
      const item = itemId ? this.actor.items.get(itemId) : null;
      let usedSpaces = 0;
      if (item?.type === 'cyberware') {
        usedSpaces = this.constructor._num(item.system?.slotsUsed, 1);
        installedCount += 1;
      }
      spaceByLocation[locKey] = usedSpaces;
      totalUsedSpaces += usedSpaces;

      installedByLocation.push({
        key: locKey,
        itemId: item?.type === 'cyberware' ? item.id : '',
        label: String(locData?.label || locKey),
        hasCyberware: item?.type === 'cyberware',
        itemName: item?.type === 'cyberware' ? String(item.name || 'Unknown Cyberware') : 'None',
        slotsUsed: usedSpaces,
        humanityCost: item?.type === 'cyberware' ? this.constructor._num(item.system?.humanityLoss, 0) : 0,
        cost: item?.type === 'cyberware' ? this.constructor._num(item.system?.cost, 0) : 0,
        description: item?.type === 'cyberware' ? String(item.system?.description || item.system?.note || '') : ''
      });
    }
    ctx.cyberwareSpaces = {
      byLocation: spaceByLocation,
      totalUsed: totalUsedSpaces,
      installedCount
    };
    ctx.cyberwareInstalledByLocation = installedByLocation;

    // Build cyberware-by-category hierarchy for the body tab
    {
      const CATEGORY_ORDER = ["Neuralware", "Cyberoptics", "Cyberaudio", "Cyberarm", "Cyberleg", "Internal Cyberware", "External Cyberware", "Fashionware", "Borgware"];
      const allCw = this.actor.items.filter(i => i.type === 'cyberware');
      const cwOptions = allCw.filter(i => !!i.system?.isOption && String(i.system?.requiresFoundation || '') !== '');
      const cwNonOptions = allCw.filter(i => !i.system?.isOption || String(i.system?.requiresFoundation || '') === '');

      const cwCatMap = new Map();
      for (const cat of CATEGORY_ORDER) cwCatMap.set(cat, []);

      for (const item of cwNonOptions) {
        const cat = String(item.system?.category || '');
        if (!cwCatMap.has(cat)) cwCatMap.set(cat, []);
        const slotsMax = this.constructor._num(item.system?.optionSlots, 0);
        const isFoundation = slotsMax > 0;
        const slotsUsed = isFoundation
          ? allCw
              .filter(opt => String(opt.system?.requiresFoundation || '') === item.name)
              .reduce((sum, opt) => sum + this.constructor._num(opt.system?.slotsUsed, 1), 0)
          : 0;
        const slotColorClass = isFoundation
          ? (slotsUsed < slotsMax ? 'slots-ok' : slotsUsed === slotsMax ? 'slots-full' : 'slots-over')
          : '';
        const options = isFoundation
          ? cwOptions
              .filter(opt => String(opt.system?.requiresFoundation || '') === item.name)
              .map(opt => ({ id: opt.id, name: opt.name, foundationName: item.name }))
          : [];
        cwCatMap.get(cat)?.push({ id: item.id, name: item.name, isFoundation, slotsUsed, slotsMax, slotColorClass, options });
      }

      ctx.cyberwareByCategory = CATEGORY_ORDER.map(category => {
        const items = cwCatMap.get(category) || [];
        return { category, items, hasItems: items.length > 0 };
      });
    }

    // Debug: Always log body state before template render
    console.log('long-drift | getData body check:', {
      hasBody: !!ctx.system.body,
      hasLocations: !!ctx.system?.body?.locations,
      locationKeys: ctx.system?.body?.locations ? Object.keys(ctx.system.body.locations) : [],
      fullBody: ctx.system?.body
    });

    // Compute resource objects for template (current/max/percent)
    const makeResource = (maxKey, curKey) => {
      // Ensure values are numeric after update
      const maxRaw = foundry.utils.getProperty(ctx.system, `substats.${maxKey}`);
      const curRaw = foundry.utils.getProperty(ctx.system, `substats.${curKey}`);
      const max = LongDriftActorSheet._num(maxRaw, 0);
      const cur = LongDriftActorSheet._num(curRaw, max);
      const percent = max > 0 ? Math.round((Number(cur) / Number(max)) * 100) : 0;
      return { max, current: cur, percent };
    };
    ctx.resources = {
      witcherHP: makeResource('hp','hp_current'),
      stamina: makeResource('sta','sta_current'),
      vigor: makeResource('rec','rec_current'),
      psi: makeResource('psi','psi_current'),
      psihybrid: makeResource('psihybrid','psihybrid_current')
    };

    // RED role ability tracking and critical injury list.
    ctx.system.role ??= { name: '', ability: '', rank: 4, notes: '' };
    ctx.system.role.name = this.constructor._cleanDisplayText(ctx.system.role.name);
    const woundState = String(ctx.system?.substats?.woundState || 'Healthy');
    const woundStateClassMap = {
      'Healthy': 'wound-healthy',
      'Lightly Wounded': 'wound-light',
      'Seriously Wounded': 'wound-serious',
      'Mortally Wounded': 'wound-mortal'
    };
    ctx.woundStateClass = woundStateClassMap[woundState] || 'wound-healthy';
    ctx.system.criticalInjuries ??= { entries: [] };
    const injuryEntries = Array.isArray(ctx.system.criticalInjuries.entries)
      ? ctx.system.criticalInjuries.entries
      : [];
    ctx.criticalInjuries = injuryEntries.map((entry, index) => ({
      index,
      name: String(entry?.name || ''),
      healed: !!entry?.healed,
      notes: String(entry?.notes || '')
    }));
    ctx.system.vehicles ??= [];
    const vehicleEntries = Array.isArray(ctx.system.vehicles) ? ctx.system.vehicles : [];
    ctx.vehicles = vehicleEntries.map((entry, index) => ({
      index,
      name: String(entry?.name || ''),
      notes: String(entry?.notes || '')
    }));

    // Legacy inline skills object (still supported, but prefer Item skills)
    ctx.system.skills ??= {};
    for (const [key, sk] of Object.entries(ctx.system.skills)) {
      if (sk && typeof sk === "object") sk.value = this.constructor._num(sk.value, 0);
      else ctx.system.skills[key] = { label: key, value: this.constructor._num(sk, 0) };
    }

    // Load persisted per-tab view state once (actor-level persistence)
    if (!this._viewStateLoaded) {
      try {
        // Attempt to read from actor flag first
        let saved = await this.actor.getFlag('long-drift', 'tabViewState');
        if (!saved) {
          saved = await this.actor.getFlag('mekton-fusion', 'tabViewState');
        }
        // Migration: if no actor flag but user flag exists (legacy), copy it over
        if (!saved) {
          const legacy = await game.user.getFlag('long-drift', 'tabViewState')
            ?? await game.user.getFlag('mekton-fusion', 'tabViewState');
            if (legacy && typeof legacy === 'object') {
              saved = legacy;
              // Don't delete user flag automatically (safety); could clear later if desired
            }
        }
        if (saved && typeof saved === 'object') {
          for (const tab of ['skills']) {
            if (saved[tab]) this._tabViewState[tab] = foundry.utils.mergeObject(this._tabViewState[tab], saved[tab]);
          }
        }
      } catch (e) { console.warn('long-drift | Failed loading actor tabViewState flag', e); }
      this._viewStateLoaded = true;
      // Debounced saver -> actor flag
      this._saveViewState = foundry.utils.debounce(async () => {
        try { await this.actor.setFlag('long-drift', 'tabViewState', this._tabViewState); }
        catch (e) { console.warn('long-drift | Failed saving actor tabViewState', e); }
      }, 300);
    }

    const vsSkills = this._tabViewState.skills;

    // Build skill Items listing (preferred representation)
    let needsPsiFix = false;
      // Use class-level collator cache for efficiency
      if (!LongDriftActorSheet._collator || LongDriftActorSheet._collatorLang !== (game.i18n.lang || 'en')) {
        LongDriftActorSheet._collator = new Intl.Collator(game.i18n.lang || 'en', { sensitivity: 'base' });
        LongDriftActorSheet._collatorLang = game.i18n.lang || 'en';
      }
      const collator = LongDriftActorSheet._collator;
    let flatSkills = this.actor.items
      .filter(i => i.type === "skill")
      .map(it => {
        let stat = this.constructor.normalizeStatKey(it.system?.stat || "REF");
        const rawCategory = String(it.system?.category || stat);
        const category = rawCategory.toUpperCase();
        // If category is PSI, force stat to WILL for RED compatibility.
        if (category === 'PSI' && stat !== 'WILL') { stat = 'WILL'; needsPsiFix = true; }
        const statVal = LongDriftActorSheet._effectiveStatVal(ctx.system, stat);
        const rank = this.constructor._num(it.system?.rank, 0);
        const total = statVal + rank;
        const nameHasHard = /\(H\)|\[H\]/i.test(it.name);
        const hard = !!it.system?.hard || nameHasHard;
        const custom = !!it.system?.custom || category === 'CUSTOM'; // Track custom skills (legacy-safe)

        const resolveDisplayCategory = (skillName, skillStat, originalCategory, isCustom) => {
          if (isCustom) return 'CUSTOM';
          if (originalCategory === 'PSI') return 'PSI';

          const categoryMap = {
            AWARENESS: 'Awareness',
            BODY: 'Body',
            CONTROL: 'Control',
            EDUCATION: 'Education',
            FIGHTING: 'Fighting',
            PERFORMANCE: 'Performance',
            RANGED: 'Ranged Weapon',
            RANGED_WEAPON: 'Ranged Weapon',
            SOCIAL: 'Social',
            TECHNIQUE: 'Technique'
          };
          if (categoryMap[originalCategory]) return categoryMap[originalCategory];

          const name = String(skillName || '').toLowerCase();
          if ([
            'conceal/reveal object', 'lip reading', 'perception', 'tracking'
          ].includes(name)) return 'Awareness';
          if ([
            'athletics', 'contortionist', 'endurance', 'resist torture/drugs', 'stealth', 'swimming'
          ].includes(name)) return 'Body';
          if ([
            'drive land vehicle', 'pilot air vehicle', 'pilot air vehicle (x2)', 'pilot sea vehicle', 'riding'
          ].includes(name)) return 'Control';
          if ([
            'accounting', 'bureaucracy', 'business', 'composition', 'criminology',
            'cryptography', 'deduction', 'education', 'language: streetslang',
            'library search', 'local expert', 'science', 'wilderness survival'
          ].includes(name)) return 'Education';
          if ([
            'brawling', 'evasion', 'martial arts (x2)', 'melee weapon'
          ].includes(name)) return 'Fighting';
          if ([
            'acting', 'dance', 'paint/draw/sculpt', 'photography/film', 'play instrument'
          ].includes(name)) return 'Performance';
          if ([
            'archery', 'autofire (x2)', 'handgun', 'heavy weapons', 'shoulder arms'
          ].includes(name)) return 'Ranged Weapon';
          if ([
            'bribery', 'conversation', 'human perception', 'interrogation', 'personal grooming',
            'persuasion', 'streetwise', 'trading', 'wardrobe & style'
          ].includes(name)) return 'Social';
          if ([
            'air vehicle tech', 'basic tech', 'cybertech', 'demolitions (x2)', 'electronics/security tech',
            'first aid', 'forgery', 'land vehicle tech', 'paramedic (x2)', 'pick lock',
            'pick pocket', 'sea vehicle tech', 'weaponstech'
          ].includes(name)) return 'Technique';

          const fallbackByStat = {
            INT: 'Education',
            REF: 'Ranged Weapon',
            DEX: 'Fighting',
            TECH: 'Technique',
            COOL: 'Social',
            WILL: 'Body',
            EMP: 'Social',
            BODY: 'Body',
            MOVE: 'Control',
            LUCK: 'Social'
          };
          return fallbackByStat[skillStat] || rawCategory || 'Education';
        };

        const displayCategory = resolveDisplayCategory(it.name, stat, category, custom);
        return {
          id: it.id,
          name: it.name,
          stat,
          rank,
          total,
          favorite: !!it.system?.favorite,
          item: it,
          system: it.system,
          category,
          displayCategory,
          hard,
          hasHardMarker: nameHasHard,
          custom
        };
      });

    const visibleNonPsiSkills = flatSkills.filter(sk => sk.category !== 'PSI');

    // Prefer the canonical CPR set, but fall back to existing non-PSI skills for older actors
    // whose items have not been normalized yet.
    let nonPsi = visibleNonPsiSkills.filter(sk => sk.custom || CPR_CORE_SKILL_NAMES.has(normalizeSkillName(sk.name)));
    if (!nonPsi.length && visibleNonPsiSkills.length) {
      nonPsi = visibleNonPsiSkills;
    }

    // Favorites filtering per tab
    if (vsSkills.favOnly) nonPsi = nonPsi.filter(sk => sk.favorite);

    // Keep skills in persistent manual order, with name as a stable fallback.
    nonPsi.sort((a, b) => LongDriftActorSheet.bySortThenName(a, b, collator));

  // Extract custom (non-PSI) skills so they can render in their own section at the bottom.
  // We do this AFTER sorting so customSkills preserve the active sort order.
  let customSkills = nonPsi.filter(sk => sk.custom && sk.category !== 'PSI');
  // Remove them from the normal category grouping list to avoid duplicate rows
  nonPsi = nonPsi.filter(sk => !(sk.custom && sk.category !== 'PSI'));

    // Group non-PSI categories (custom skills removed above)
    const byCategory = new Map();
    for (const sk of nonPsi) {
      if (!byCategory.has(sk.displayCategory)) byCategory.set(sk.displayCategory, []);
      byCategory.get(sk.displayCategory).push(sk);
    }
    const cyberpunkRedCategoryOrder = ["Awareness", "Body", "Control", "Education", "Fighting", "Performance", "Ranged Weapon", "Social", "Technique"];
    const skillGroupLocalizeKey = {
      "Awareness": "MF.SkillGroup.AWARENESS",
      "Body": "MF.SkillGroup.BODY",
      "Control": "MF.SkillGroup.CONTROL",
      "Education": "MF.SkillGroup.EDUCATION",
      "Fighting": "MF.SkillGroup.FIGHTING",
      "Performance": "MF.SkillGroup.PERFORMANCE",
      "Ranged Weapon": "MF.SkillGroup.RANGED",
      "Social": "MF.SkillGroup.SOCIAL",
      "Technique": "MF.SkillGroup.TECHNIQUE"
    };
    const grouped = Array.from(byCategory.entries())
      .sort((a, b) => {
        const ai = cyberpunkRedCategoryOrder.indexOf(a[0]);
        const bi = cyberpunkRedCategoryOrder.indexOf(b[0]);
        const aRank = ai === -1 ? Number.MAX_SAFE_INTEGER : ai;
        const bRank = bi === -1 ? Number.MAX_SAFE_INTEGER : bi;
        if (aRank !== bRank) return aRank - bRank;
        return a[0].localeCompare(b[0]);
      })
      .map(([category, skills]) => ({
        category,
        localizeKey: skillGroupLocalizeKey[category],
        skills: skills.sort((a,b)=>a.name.localeCompare(b.name))
      }));

    const skillGroupsLeft = [];
    const skillGroupsRight = [];
    grouped.forEach((group, index) => {
      if (index % 2 === 0) skillGroupsLeft.push(group);
      else skillGroupsRight.push(group);
    });

    ctx.skillGroups = grouped;
    ctx.skillGroupsLeft = skillGroupsLeft;
    ctx.skillGroupsRight = skillGroupsRight;
    ctx.customSkills = customSkills || [];
    const vehicleControlSkillOrder = [
      'drive land vehicle',
      'pilot air vehicle',
      'pilot sea vehicle',
      'riding'
    ];
    const vehicleControlSkillSet = new Set(vehicleControlSkillOrder);
    const controlSkillsByName = new Map();
    for (const sk of flatSkills) {
      const normalized = normalizeSkillName(sk.name);
      if (!vehicleControlSkillSet.has(normalized)) continue;
      if (!controlSkillsByName.has(normalized)) {
        controlSkillsByName.set(normalized, sk);
      }
    }
    ctx.vehicleControlSkills = vehicleControlSkillOrder
      .map((name) => controlSkillsByName.get(name))
      .filter(Boolean);
  ctx.skillItems = flatSkills; // full flat list (pre-tab filtering, for potential use)
    // Render the skills table if either grouped non-PSI skills or custom skills exist.
    // This avoids hiding rollable custom skills when the non-PSI grouped list is empty.
    ctx.hasSkillItems = nonPsi.length > 0 || ctx.customSkills.length > 0;
    
    // Expose per-tab view states
    ctx._skillViewStateSkills = vsSkills;

    // Pre-render tab templates to avoid partial-registration timing issues.
    try {
    ctx._tabStatsHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/stats.hbs", ctx);
      ctx._tabCombatHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/combat.hbs", ctx);
      ctx._tabSkillsHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/skills.hbs", ctx);
      ctx._tabEquipmentHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/equipment.hbs", ctx);
      ctx._tabNotesHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/notes.hbs", ctx);
        ctx._tabVehicleHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/vehicle.hbs", ctx);
  // Optional paperdoll/body tab (empty by default until filled)
  console.log('long-drift | Before rendering body tab:', {
    hasSystemBody: !!ctx.system?.body,
    hasLocations: !!ctx.system?.body?.locations,
    locations: ctx.system?.body?.locations
  });
  ctx._tabBodyHtml = await renderTemplate("systems/long-drift/templates/actor/tabs/body.hbs", ctx);
    } catch (err) {
      console.error('long-drift | Failed to pre-render actor tab templates', err);
      // Fall back to empty strings so template rendering doesn't throw further
  ctx._tabStatsHtml = ctx._tabStatsHtml || '';
      ctx._tabCombatHtml = ctx._tabCombatHtml || '';
      ctx._tabSkillsHtml = ctx._tabSkillsHtml || '';
      ctx._tabEquipmentHtml = ctx._tabEquipmentHtml || '';
      ctx._tabNotesHtml = ctx._tabNotesHtml || '';
      ctx._tabVehicleHtml = ctx._tabVehicleHtml || '';
  ctx._tabBodyHtml = ctx._tabBodyHtml || '';
    }

    return ctx;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    this._scheduleAutoFitInputs(html);
    this._setupAutoFitObserver(html);

    // Runtime fallback: ensure the Substats block is placed under the Stats tab.
    // Some older or cached templates may leave the markup in the header; move it into the stats container so it displays correctly.
    try {
      const sub = html.find('.substats-wrapper')[0];
      const statsContainer = html.find('.tab.stats .stats-container')[0];
      if (sub && statsContainer && !statsContainer.contains(sub)) {
        statsContainer.appendChild(sub);
      }
    } catch (e) {
      // Non-fatal; best-effort UI fix
      console.debug?.('long-drift | substats relocation failed', e);
    }

    // Anchor the header height to the initial (Stats tab) render so it stays consistent across tabs.
    try {
      const headerEl = html[0]?.querySelector('.sheet-header');
      if (headerEl) {
        requestAnimationFrame(() => {
          const baseline = headerEl.getBoundingClientRect().height;
          if (baseline > 0) headerEl.style.minHeight = `${baseline}px`;
        });
      }
    } catch (e) {
      console.debug?.('long-drift | header height lock failed', e);
    }

    html.on("click", ".item-control.item-edit", ev => {
      const id = ev.currentTarget.closest("[data-item-id]")?.dataset.itemId;
      this.actor.items.get(id)?.sheet?.render(true);
    });
    html.on("click", ".ability-roll, .stat-roll", ev => this._onRollStat(ev));
    html.on("click", ".stun-save-roll", ev => this._onRollStunSave(ev));
    html.on("click", ".death-save-roll", ev => this._onRollDeathSave(ev));
    html.on("click", ".skill-roll", ev => this._onRollSkill(ev));
    html.on("click", ".skill-fav", ev => this._onToggleFavorite(ev));
    html.on("change", ".skill-rank", ev => this._onChangeSkillRank(ev));
    html.on("click", ".seed-skills", ev => this._onSeedSkills(ev));
  html.on("click", ".custom-skill-add", ev => this._onAddCustomSkill(ev));
  html.on("click", ".custom-skill-delete", ev => this._onDeleteCustomSkill(ev));
  html.on("click", ".crit-injury-add", ev => this._onAddCriticalInjury(ev));
  html.on("click", ".crit-injury-delete", ev => this._onDeleteCriticalInjury(ev));
  html.on("change", ".crit-injury-name", ev => this._onChangeCriticalInjuryField(ev));
  html.on("change", ".crit-injury-healed", ev => this._onChangeCriticalInjuryField(ev));
  html.on("change", ".crit-injury-notes", ev => this._onChangeCriticalInjuryField(ev));
  html.on("click", ".vehicle-add", ev => this._onAddVehicle(ev));
  html.on("click", ".vehicle-delete", ev => this._onDeleteVehicle(ev));
  html.on("change", ".vehicle-name", ev => this._onChangeVehicleField(ev));
  html.on("change", ".vehicle-notes", ev => this._onChangeVehicleField(ev));
  html.on("click", ".link-token-button", ev => this._onLinkTokenClick(ev));
  html.on("click", ".unlink-token-button", ev => this._onUnlinkTokenClick(ev));
  html.on("input change", ".auto-fit-input", ev => this._fitInputFontSize(ev.currentTarget));
  // Paperdoll region clicks
  html.on('click', '.paperdoll-svg .pd-region', ev => this._onPaperdollClick(ev));
    // Legacy: also support newer .hit-zone elements in the redesigned body tab
    // Click a body zone -> focus row + toggle highlight (delegated)
    html.on('click', '.hit-zone', ev => {
      const loc = ev.currentTarget.dataset.loc;
      // Clear previous active markers
      html.find('.hit-zone').removeClass('active');
      // Ensure jQuery wrapped element for class toggling
      const $t = $(ev.currentTarget);
      $t.addClass('active');
      // Focus the first numeric input for that location if present
      const row = html.find(`.mf-row[data-loc="${loc}"] input:first`);
      if (row && row.length) row[0].focus();
    });

    html.on('click', '[data-action="unequip-cyberware"]', ev => this._onUnequipBodyItem(ev));
    html.on('click', '[data-action="remove-delete-cyberware"]', ev => this._onRemoveDeleteBodyItem(ev));
    html.on('click', '[data-action="cw-edit"]', ev => {
      ev.preventDefault();
      const id = ev.currentTarget.dataset.itemId;
      this.actor.items.get(id)?.sheet?.render(true);
    });
    html.on('click', '[data-action="cw-remove"]', async ev => {
      ev.preventDefault();
      const id = ev.currentTarget.dataset.itemId;
      if (!id) return;
      const item = this.actor.items.get(id);
      if (!item) return;
      const confirmed = await Dialog.confirm({
        title: 'Remove Cyberware',
        content: `<p>Delete <strong>${item.name}</strong> from this actor?</p>`,
        yes: () => true,
        no: () => false
      });
      if (!confirmed) return;
      try {
        const locs = this.actor.system?.body?.locations || {};
        const patch = {};
        for (const [k, v] of Object.entries(locs)) {
          if (v?.itemId === id) patch[`system.body.locations.${k}.itemId`] = null;
        }
        if (Object.keys(patch).length) await this.actor.update(patch);
        await item.delete();
        this._refreshBodyItemIcons();
        this.render(false);
      } catch (e) {
        console.error('long-drift | Failed to remove cyberware', e);
        ui.notifications.error('Failed to remove cyberware.');
      }
    });

    // Quick actions for new single action row
    html.on('click', '#mf-btn-adjust-sp', async ev => {
      ev.preventDefault();
      const loc = html.find('#mf-selected-loc').val();
      if (!loc) return;
      const path = `system.body.locations.${loc}`;
      const data = foundry.utils.getProperty(this.actor, path);
      if (!data) return;
      const spInput = html.find('#mf-adjust-sp');
      const spAdjust = parseInt(spInput.val()) || 0;
      if (spAdjust !== 0) {
        const newSP = Math.max((data.sp ?? 0) + spAdjust, 0);
        await this.actor.update({ [`${path}.sp`]: newSP });
        spInput.val('');
        this.render(false);
      }
    });
    html.on('click', '#mf-btn-adjust-sdp', async ev => {
      ev.preventDefault();
      const loc = html.find('#mf-selected-loc').val();
      if (!loc) return;
      const path = `system.body.locations.${loc}`;
      const data = foundry.utils.getProperty(this.actor, path);
      if (!data) return;
      const sdpInput = html.find('#mf-adjust-sdp');
      const sdpAdjust = parseInt(sdpInput.val()) || 0;
      if (sdpAdjust !== 0) {
        // Default sdpMax per Mekton table (5-7 column) for reference/percent only
        let defaultMax = 9;
        if (loc === 'head') defaultMax = 6;
        else if (loc === 'torso') defaultMax = 12;
        const sdpMax = (data.mektonHpMax && data.mektonHpMax > 0) ? data.mektonHpMax : defaultMax;
        // Allow SDP to exceed MaxSDP (no clamping)
        const newSDP = (data.mektonHp ?? 0) + sdpAdjust;
        console.log('long-drift | SDP adjust (no clamp):', { loc, path, sdpAdjust, sdpMax, oldSDP: data.mektonHp, newSDP });
        // Set SDP value directly in the input and trigger change event
        const sdpInputField = html.find(`tr[data-loc="${loc}"] input[name="system.body.locations.${loc}.mektonHp"]`);
        if (sdpInputField.length) {
          sdpInputField.val(newSDP).trigger('change');
          console.log('long-drift | SDP input set and change triggered:', { loc, newSDP });
        } else {
          console.warn('long-drift | SDP input not found for location:', loc);
        }
        sdpInput.val('');
      }
    });

    // Mecha configuration selection
    html.on('click', '[data-action="select-config"]', async ev => {
      ev.preventDefault();
      const configNum = parseInt(ev.currentTarget.dataset.config);
      if (configNum >= 1 && configNum <= 3) {
        await this.actor.update({ 'system.mecha.activeConfig': configNum });
        ui.notifications.info(`Configuration ${configNum} activated`);
      }
    });

    // Mecha image selection
    html.on('click', '[data-action="select-mecha-image"]', async ev => {
      ev.preventDefault();
      const current = this.actor.system.mecha?.imageUrl || "";
      const fp = new FilePicker({
        type: "image",
        current: current,
        callback: async (path) => {
          await this.actor.update({ 'system.mecha.imageUrl': path });
        },
        top: this.position.top + 40,
        left: this.position.left + 10
      });
      fp.browse(current);
    });

    // Mecha image right-click to clear (when image exists)
    html.on('contextmenu', '[data-action="select-mecha-image"]', async ev => {
      ev.preventDefault();
      const currentImage = this.actor.system.mecha?.imageUrl;
      if (currentImage) {
        const confirmed = await Dialog.confirm({
          title: "Clear Mecha Image",
          content: "Remove the current mecha image?",
          yes: () => true,
          no: () => false
        });
        if (confirmed) {
          await this.actor.update({ 'system.mecha.imageUrl': "" });
        }
      }
    });

    // Keep other actions (ablate, heal1, dmg1, unequip, show-item) as before

    // Drag armor/cyberware item -> slot
    const zones = html.find('.hit-zone');
    zones.on('dragover', ev => {
      ev.preventDefault();
      if (ev.originalEvent?.dataTransfer) ev.originalEvent.dataTransfer.dropEffect = 'copy';
    });
    zones.on('drop', async ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const loc = ev.currentTarget.dataset.loc;
      const nativeEvent = ev.originalEvent ?? ev;

      let data = {};
      try {
        data = TextEditor.getDragEventData(nativeEvent) || {};
      } catch (_) {
        data = {};
      }

      // Fallback for drag sources that only provide raw transfer text.
      if (!data?.type && nativeEvent?.dataTransfer) {
        const raw = nativeEvent.dataTransfer.getData('text/plain') || nativeEvent.dataTransfer.getData('text');
        if (raw) {
          try { data = JSON.parse(raw); } catch (_) {}
        }
      }

      // Accept Items only
      if (data?.type !== 'Item' || !data?.uuid) return;

      const sourceItem = await fromUuid(data.uuid);
      if (!sourceItem || !['armor', 'cyberware'].includes(sourceItem.type)) return;

      if (sourceItem.type === 'cyberware') {
        const slotRaw = String(sourceItem.system?.slot || '').trim();
        const slotKey = slotRaw.toLowerCase();
        const targetLoc = String(loc || '');
        const targetKey = targetLoc.toLowerCase();
        const bodyLocs = this.actor.system?.body?.locations || {};

        const canonicalByKey = {
          head: 'head',
          torso: 'torso',
          rarm: 'rArm',
          larm: 'lArm',
          rleg: 'rLeg',
          lleg: 'lLeg',
          rhand: 'rHand',
          lhand: 'lHand',
          rfoot: 'rFoot',
          lfoot: 'lFoot'
        };

        const slotAliases = {
          eye: ['head'],
          eyes: ['head'],
          arm: ['lArm', 'rArm'],
          arms: ['lArm', 'rArm'],
          hand: ['lHand', 'rHand'],
          hands: ['lHand', 'rHand'],
          leg: ['lLeg', 'rLeg'],
          legs: ['lLeg', 'rLeg'],
          foot: ['lFoot', 'rFoot'],
          feet: ['lFoot', 'rFoot'],
          any: null,
          all: null,
          universal: null
        };

        let allowedLocs = null;
        if (!slotKey || slotAliases[slotKey] === null) {
          allowedLocs = null;
        } else if (Array.isArray(slotAliases[slotKey])) {
          allowedLocs = slotAliases[slotKey];
        } else if (canonicalByKey[slotKey]) {
          allowedLocs = [canonicalByKey[slotKey]];
        } else {
          // If the slot already matches a body location key, allow it.
          const direct = Object.keys(bodyLocs).find(k => k.toLowerCase() === slotKey);
          allowedLocs = direct ? [direct] : null;
        }

        if (Array.isArray(allowedLocs) && !allowedLocs.includes(targetLoc) && !allowedLocs.some(k => k.toLowerCase() === targetKey)) {
          const targetLabel = bodyLocs?.[targetLoc]?.label || targetLoc;
          const allowedLabels = allowedLocs
            .map(k => bodyLocs?.[k]?.label || k)
            .join(', ');
          ui.notifications.warn(`${sourceItem.name} can only be installed in: ${allowedLabels}. You dropped it on ${targetLabel}.`);
          return;
        }
      }

      // Ensure dropped item exists on this actor so slot itemId and icon lookup work.
      let item = this.actor.items.get(sourceItem.id);
      if (!item) {
        const created = await this.actor.createEmbeddedDocuments('Item', [sourceItem.toObject()]);
        item = created?.[0] || null;
      }
      if (!item) return;

      const path = `system.body.locations.${loc}`;
      try {
        await this.actor.update({ [`${path}.itemId`]: item.id });
        // Refresh icons after equip
        this._refreshBodyItemIcons();
      } catch (err) {
        console.warn('long-drift | Failed equipping item to body slot', err);
      }
    });
    html.on("input", ".skill-rank, .skill-ip", ev => {
      const input = ev.currentTarget;
      const value = parseInt(input.value);
      const min = parseInt(input.min) || 0;
      const max = parseInt(input.max) || 999;
      
      if (isNaN(value) || value < min) {
        input.value = min;
      } else if (value > max) {
        input.value = max;
      }
    });
    
    // Tab helpers
    const getTabFromEvent = () => 'skills';
    // Favorites toggle
    html.on('click', '.skill-filter-fav-toggle', ev => {
      ev.preventDefault();
      const tab = getTabFromEvent(ev);
      const state = this._tabViewState[tab];
      state.favOnly = !state.favOnly;
      this._saveViewState?.();
      this.render(false);
    });
    // Substat controls: +/- buttons and direct input changes
    html.on('click', '.substat-incr', ev => this._onAdjustSubstat(ev, +1));
    html.on('click', '.substat-decr', ev => this._onAdjustSubstat(ev, -1));
    // Note: substat inputs rely on Foundry's submitOnChange for persistence
    // Resource bars need custom handling for visual preview
    html.on('change input', '.resource-input', ev => this._queueSubstatChange(ev));

    // Keep duplicate Initiative (MV) inputs across tabs in sync and persist via queued substat handler
    html.on('change input', 'input[name="system.substats.initiative"]', ev => {
      const val = ev.currentTarget.value;
      html.find('input[name="system.substats.initiative"]').each((_, el) => {
        if (el !== ev.currentTarget) el.value = val;
      });
      this._queueSubstatChange?.(ev);
    });

    // Weapon handlers
    html.on('click', '.create-weapon-item', ev => this._onCreateWeapon(ev));
    html.on('click', '.weapon-roll', ev => this._onRollWeapon(ev));
    html.on('click', '.weapon-damage-roll', ev => this._onRollWeaponDamage(ev));
    html.on('click', '.item-delete', ev => this._onDeleteWeapon(ev));
    html.on('click', 'details.weapon-card summary input, details.weapon-card summary select, details.weapon-card summary button', ev => {
      ev.stopPropagation();
    });
    html.on('change', '.weapon-field', ev => this._onChangeWeaponField(ev));

    html.find('[data-item-id].weapon-card').each((_, row) => {
      const select = row.querySelector('select[data-field="weaponType"]');
      if (select) this._updateWeaponDvDisplay(row, select.value || 'Pistol');
    });

    // (Category collapse feature removed)
    // Refresh body item icons now that listeners are attached
    try { this._refreshBodyItemIcons(); } catch (e) { /* ignore */ }
  }

  async close(options = {}) {
    this._teardownAutoFitObserver();
    return super.close(options);
  }

  /** Focus the inputs for a paperdoll location when the SVG region is clicked */
  _onPaperdollClick(ev) {
    ev.preventDefault();
    const target = ev.currentTarget;
    const loc = target.dataset?.loc;
    if (!loc) return;
    // Deselect other regions
    this.element.find('.paperdoll-svg .pd-region').forEach(el => el.classList.remove('selected'));
    target.classList.add('selected');

    // Focus the first numeric input for that location
    const inputSelector = `[name="system.body.locations.${loc}.sp"]`;
    const input = this.element[0].querySelector(inputSelector);
    if (input) {
      input.focus();
      // also visually highlight the inputs container
      const container = input.closest('.body-loc');
      if (container) {
        this.element.find('.body-loc').forEach(el => el.classList.remove('selected'));
        container.classList.add('selected');
      }
    }
  }

  /**
   * Link the actor to a currently controlled token (if present) by setting actorLink=true
   * If no token is controlled that matches this actor, informs the user to re-place the actor.
   */
  async _onLinkTokenClick(ev) {
    ev.preventDefault();
    // Find a controlled token on the canvas that refers to this actor
    const controlled = canvas?.tokens?.controlled || [];
    let found = null;
    for (const t of controlled) {
      try {
        if (t.document?.actorId === this.actor.id || t.document?.name === this.actor.name) {
          found = t;
          break;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!found) {
      return ui.notifications.warn("No matching controlled token found. Please select the token representing this actor on the canvas and try again.");
    }

    // Confirm with the user before linking
    new Dialog({
      title: "Link Token to Actor",
      content: `<p>Link the selected token '<strong>${found.document.name}</strong>' to actor '<strong>${this.actor.name}</strong>'? This will make the token use the actor's data directly.</p>`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-link"></i>',
          label: 'Link Token',
          callback: async () => {
            try {
              await found.document.update({ actorLink: true });
              ui.notifications.info("Token linked to actor. Reopening sheets to refresh.");
              // Force re-render of open sheets for this actor
              Object.values(ui.windows).forEach(app => {
                if (app.constructor.name === "LongDriftActorSheet" && app.actor?.id === this.actor.id) app.render(false);
              });
            } catch (err) {
              console.error('long-drift | Failed to link token to actor', err);
              ui.notifications.error('Failed to link token to actor. See console for details.');
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        }
      },
      default: 'confirm'
    }).render(true);
  }

  /**
   * Unlink the actor from a currently controlled token (if present) by setting actorLink=false
   * If no token is controlled that matches this actor, informs the user to re-select the token.
   */
  async _onUnlinkTokenClick(ev) {
    ev.preventDefault();
    const controlled = canvas?.tokens?.controlled || [];
    let found = null;
    for (const t of controlled) {
      try {
        if (t.document?.actorId === this.actor.id || t.document?.name === this.actor.name) {
          found = t;
          break;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!found) {
      return ui.notifications.warn("No matching controlled token found. Please select the token representing this actor on the canvas and try again.");
    }

    new Dialog({
      title: "Unlink Token from Actor",
      content: `<p>Unlink the selected token '<strong>${found.document.name}</strong>' from actor '<strong>${this.actor.name}</strong>'? This will make the token independent of the actor's data.</p>`,
      buttons: {
        confirm: {
          icon: '<i class="fas fa-unlink"></i>',
          label: 'Unlink Token',
          callback: async () => {
            try {
              await found.document.update({ actorLink: false });
              ui.notifications.info("Token unlinked from actor. Reopening sheets to refresh.");
              Object.values(ui.windows).forEach(app => {
                if (app.constructor.name === "LongDriftActorSheet" && app.actor?.id === this.actor.id) app.render(false);
              });
            } catch (err) {
              console.error('long-drift | Failed to unlink token from actor', err);
              ui.notifications.error('Failed to unlink token from actor. See console for details.');
            }
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Cancel'
        }
      },
      default: 'confirm'
    }).render(true);
  }

  /* ---------- Body tab actions ---------- */

  async _onBodyAblate(ev) {
    ev.preventDefault();
    const loc = ev.currentTarget.dataset?.loc; if (!loc) return;
    try {
      const cur = LongDriftActorSheet._num(this.actor.system?.body?.locations?.[loc]?.sp ?? 0, 0);
      await this.actor.update({ [`system.body.locations.${loc}.sp`]: Math.max(0, cur - 1) });
      this.render(false);
    } catch (e) { console.error('long-drift | Failed ablate', e); }
  }

  async _onBodyHeal(ev, amt = 1) {
    ev.preventDefault();
    const loc = ev.currentTarget.dataset?.loc; if (!loc) return;
    try {
      const cur = LongDriftActorSheet._num(this.actor.system?.body?.locations?.[loc]?.hp ?? 0, 0);
      const max = LongDriftActorSheet._num(this.actor.system?.body?.locations?.[loc]?.hpMax ?? 0, 0);
      await this.actor.update({ [`system.body.locations.${loc}.hp`]: Math.min(max, cur + amt) });
      this.render(false);
    } catch (e) { console.error('long-drift | Failed heal', e); }
  }

  async _onBodyDamage(ev, amt = 1) {
    ev.preventDefault();
    const loc = ev.currentTarget.dataset?.loc; if (!loc) return;
    try {
      const cur = LongDriftActorSheet._num(this.actor.system?.body?.locations?.[loc]?.hp ?? 0, 0);
      await this.actor.update({ [`system.body.locations.${loc}.hp`]: Math.max(0, cur - amt) });
      this.render(false);
    } catch (e) { console.error('long-drift | Failed damage', e); }
  }

  _onShowBodyItem(ev) {
    ev.preventDefault();
    const id = ev.currentTarget.dataset?.itemId; if (!id) return;
    const item = this.actor.items.get(id);
    if (item) item.sheet?.render(true);
  }

  async _onUnequipBodyItem(ev) {
    ev.preventDefault();
    const loc = ev.currentTarget.dataset?.loc; if (!loc) return;
    try {
      await this.actor.update({ [`system.body.locations.${loc}.itemId`]: null });
      this._refreshBodyItemIcons();
      this.render(false);
    } catch (e) { console.error('long-drift | Failed unequip', e); }
  }

  async _onRemoveDeleteBodyItem(ev) {
    ev.preventDefault();
    const loc = ev.currentTarget.dataset?.loc;
    const itemId = ev.currentTarget.dataset?.itemId;
    if (!loc || !itemId) return;

    const item = this.actor.items.get(itemId);
    if (!item) {
      await this.actor.update({ [`system.body.locations.${loc}.itemId`]: null });
      this._refreshBodyItemIcons();
      this.render(false);
      return;
    }

    const confirmed = await Dialog.confirm({
      title: 'Remove and Delete Cyberware',
      content: `<p>Remove <strong>${item.name}</strong> from this location and delete it from the actor inventory?</p>`,
      yes: () => true,
      no: () => false
    });
    if (!confirmed) return;

    try {
      await this.actor.update({ [`system.body.locations.${loc}.itemId`]: null });
      await this.actor.deleteEmbeddedDocuments('Item', [itemId]);
      this._refreshBodyItemIcons();
      this.render(false);
    } catch (e) {
      console.error('long-drift | Failed remove+delete cyberware', e);
      ui.notifications.error('Failed to remove and delete cyberware.');
    }
  }


  /** Increment/decrement a substat by delta and persist immediately */
  async _onAdjustSubstat(ev, delta) {
    ev.preventDefault();
    const btn = ev.currentTarget;
    const card = btn.closest('.substat-card'); if (!card) return;
    const key = card.dataset.subkey;
    const input = card.querySelector('.substat-input'); if (!input) return;
    const cur = LongDriftActorSheet._num(input.value, 0);
    const next = Math.max(0, cur + delta);
    input.value = next;
    try { await this.actor.update({ [`system.substats.${key}`]: next }); }
    catch (e) { console.warn('long-drift | Failed to update substat', key, e); }
  }

  /** Queue substat/resource input changes; debounced batch update for performance */
  _queueSubstatChange(ev) {
    const input = ev.currentTarget;
    const name = input.name;
    if (!name) return;
    const m = name.match(/^system\.substats\.([\w-]+)$/);
    if (!m) return;
    const key = m[1];

    // Skip transient empty or '-' while user typing
    const raw = input.value;
    if (raw === '' || raw === '-' || raw === '+') return;
    let val = this.constructor._num(raw, 0);
    
    // Allow negative values for initiative modifier, but force non-negative for other substats
    if (val < 0 && key !== 'initiative') val = 0;
    
    // Allow decimal values for run, leap, swim
    // For other fields, round to integer if not a resource pair max/current
    const allowDecimals = ['run', 'leap', 'swim', 'hp', 'hp_current', 'sta', 'sta_current', 'rec', 'rec_current', 'psi', 'psi_current', 'psihybrid', 'psihybrid_current'];
    if (!allowDecimals.includes(key)) {
      val = Math.round(val);
    }

    // Initialize batching structures
    this._pendingSubstat = this._pendingSubstat || {};
    this._pendingResourcePairs = this._pendingResourcePairs || {
      hp: ['hp','hp_current'],
      stamina: ['sta','sta_current'],
      vigor: ['rec','rec_current'],
      psi: ['psi','psi_current'],
      psihybrid: ['psihybrid','psihybrid_current']
    };

    this._pendingSubstat[key] = val;

    // If a max changed, clamp its current if queued or existing > new max
    const maxCurrentMap = {
      hp: 'hp_current',
      sta: 'sta_current',
      rec: 'rec_current',
      psi: 'psi_current',
      psihybrid: 'psihybrid_current'
    };
    if (maxCurrentMap[key]) {
      const curKey = maxCurrentMap[key];
      const currentVal = this._pendingSubstat[curKey] ?? this.actor.system?.substats?.[curKey] ?? 0;
      if (currentVal > val) this._pendingSubstat[curKey] = val; // clamp
    }

    // Immediate lightweight DOM preview for resource bars
    const row = input.closest('.resource-row');
    if (row) {
      const bar = row.querySelector('.resource-bar');
      const resource = bar?.dataset?.resource;
      if (resource) {
        const pairMap = {
          hp: ['hp','hp_current'],
          stamina: ['sta','sta_current'],
          vigor: ['rec','rec_current'],
          psi: ['psi','psi_current'],
          psihybrid: ['psihybrid','psihybrid_current']
        };
        const [maxKey, curKey] = pairMap[resource] || [];
        if (maxKey && curKey) {
          const maxVal = (this._pendingSubstat[maxKey] ?? this.actor.system?.substats?.[maxKey] ?? 0);
          const curVal = (this._pendingSubstat[curKey] ?? this.actor.system?.substats?.[curKey] ?? 0);
          const percent = maxVal > 0 ? Math.round((curVal / maxVal) * 100) : 0;
          const fill = row.querySelector('.resource-fill'); if (fill) fill.style.width = percent + '%';
          const values = row.querySelector('.resource-values'); if (values) values.textContent = `${curVal} / ${maxVal}`;
        }
      }
    }

    // Debounce save
    if (!this._flushSubstatsDebounced) {
      this._flushSubstatsDebounced = foundry.utils.debounce(async () => {
        const payload = this._pendingSubstat; this._pendingSubstat = {};
        const updateData = {};
        for (const [k,v] of Object.entries(payload)) {
          updateData[`system.substats.${k}`] = v;
        }
        if (Object.keys(updateData).length) {
          try { await this.actor.update(updateData); } catch (e) { console.warn('long-drift | Batched substat update failed', e); }
        }
      }, 250);
    }
    this._flushSubstatsDebounced();
  }

  /** Immediately flush pending substat changes (called on blur) */
  async _flushSubstats() {
    if (!this._pendingSubstat || Object.keys(this._pendingSubstat).length === 0) return;
    const payload = this._pendingSubstat;
    this._pendingSubstat = {};
    const updateData = {};
    for (const [k,v] of Object.entries(payload)) {
      updateData[`system.substats.${k}`] = v;
    }
    if (Object.keys(updateData).length) {
      try { await this.actor.update(updateData); } catch (e) { console.warn('long-drift | Flush substat update failed', e); }
    }
  }
  /** Handle stat input changes */
  async _onChangeStatInput(ev) {
    const input = ev.currentTarget;
    const name = input.name;
    if (!name) return;
    const match = name.match(/^system\.stats\.(\w+)\.value$/);
    if (!match) return;
    const li = input.closest("[data-skill-id]"); if (!li) return;
    const skill = this.actor.items.get(li.dataset.skillId); if (!skill) return;
    const val = LongDriftActorSheet._num(input.value, 0);
    await skill.update({ "system.ip": val });
  }

  async _onToggleFavorite(ev) {
    ev.preventDefault();
    const li = ev.currentTarget.closest("[data-skill-id]"); if (!li) return;
    const skill = this.actor.items.get(li.dataset.skillId); if (!skill) return;
    await skill.update({ "system.favorite": !skill.system.favorite });
    this.render(false);
  }

  async _onChangeSkillRank(ev) {
    const input = ev.currentTarget;
    const li = input.closest("[data-skill-id]"); if (!li) return;
    const skill = this.actor.items.get(li.dataset.skillId); if (!skill) return;
    const val = LongDriftActorSheet._num(input.value, 0);
    await skill.update({ "system.rank": val });
    
    // Update the total display without full re-render
    const totalCell = li.querySelector('.skill-total');
    if (totalCell) {
      const stat = this.constructor.normalizeStatKey(skill.system?.stat || 'REF');
      const statVal = LongDriftActorSheet._effectiveStatVal(this.actor.system, stat);
      totalCell.textContent = statVal + val;
    }
  }

  async _onSeedSkills(ev) {
    ev.preventDefault();
    try {
      ui.notifications.info("Adding default skills...");
      const { syncActorCoreItems } = await import("../../module/seed.js");
      const result = await syncActorCoreItems(this.actor);
      if (result.created > 0) {
        ui.notifications.info(`Added ${result.created} default skills to ${this.actor.name}`);
        this.render(false); // Refresh the sheet to show new skills
      } else {
        ui.notifications.info("No new skills were needed");
      }
    } catch (err) {
      console.error("long-drift | Manual seeding failed", err);
      ui.notifications.error("Failed to add skills. See console for details.");
    }
  }

  /** Create a new generic custom (non-PSI) skill. */
  async _onAddCustomSkill(ev) {
    ev.preventDefault();
    try {
      const existingNames = this.actor.items
        .filter(i => i.type === 'skill' && i.system?.category !== 'PSI' && i.system?.custom)
        .map(i => i.name.toLowerCase());

      // Always expose the full CPR stat set, plus any extra actor-specific keys.
      const canonicalStats = ["INT", "REF", "DEX", "TECH", "COOL", "WILL", "LUCK", "MOVE", "BODY", "EMP"];
      const actorStatKeys = Object.keys(this.actor.system?.stats || {})
        .map(k => String(k).toUpperCase())
        .filter(Boolean);
      const extraStats = actorStatKeys.filter(k => !canonicalStats.includes(k));
      const stats = [...canonicalStats, ...extraStats];

      let name, chosenStat;
      try {
        const result = await Dialog.prompt({
          title: game.i18n.localize('MF.AddCustomSkill') || 'Add Custom Skill',
            content: `
              <p>${game.i18n.localize('MF.CustomSkillNamePrompt') || 'Enter name for the new custom skill:'}</p>
              <input type="text" name="skillName" value="" style="width:100%;margin-bottom:6px;" placeholder="${game.i18n.localize('MF.NewCustomSkill') || 'New Custom Skill'}"/>
              <label style="display:block;margin-top:4px;">Stat:
                <select name="skillStat" style="width:100%;">
                  ${stats.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </label>
            `,
          label: game.i18n.localize('MF.Create') || 'Create',
          callback: html => {
            const nm = html.find("[name='skillName']").val().trim();
            const st = (html.find("[name='skillStat']").val() || 'REF').toUpperCase();
            return { name: nm || (game.i18n.localize('MF.NewCustomSkill') || 'New Custom Skill'), stat: st };
          }
        });
        if (!result) return; // cancelled
        name = result.name;
        chosenStat = result.stat;
      } catch (_) { return; }

      if (existingNames.includes(name.toLowerCase())) {
        ui.notifications.warn(game.i18n.format('MF.DuplicateCustomSkillName', { name }) || `A custom skill named "${name}" already exists.`);
        return;
      }

      const doc = await this.actor.createEmbeddedDocuments('Item', [{
        name,
        type: 'skill',
        system: {
          stat: chosenStat || 'REF',
          category: 'CUSTOM',
          rank: 0,
          favorite: false,
          hard: false,
          ip: 0,
          custom: true
        }
      }]);
      if (doc?.length) {
        const created = doc[0];
        ui.notifications.info(game.i18n.format('MF.CreatedCustomSkill', { name: created.name }));
        this.render(false);
      }
    } catch (e) {
      console.error('long-drift | Failed to create custom skill', e);
      ui.notifications.error(game.i18n.localize('MF.ErrorCreateCustomSkill') || 'Failed to create custom skill');
    }
  }

  /** Delete a custom skill (non-PSI) */
  async _onDeleteCustomSkill(ev) {
    ev.preventDefault();
    const btn = ev.currentTarget;
    const id = btn?.dataset.itemId || btn.closest('[data-skill-id]')?.dataset.skillId;
    if (!id) return;
    const item = this.actor.items.get(id);
    if (!item || item.type !== 'skill' || !item.system?.custom) return;

    const confirmed = await Dialog.confirm({
      title: game.i18n.localize('MF.DeleteCustomSkill') || 'Delete Custom Skill',
      content: game.i18n.format('MF.DeleteCustomSkillConfirm', { name: item.name }) || `Delete custom skill "${item.name}"?`,
      yes: () => true,
      no: () => false
    });
    if (!confirmed) return;
    try {
      await item.delete();
      ui.notifications.info(game.i18n.format('MF.DeletedCustomSkill', { name: item.name }) || `Deleted custom skill: ${item.name}`);
      this.render(false);
    } catch (e) {
      console.error('long-drift | Failed to delete custom skill', e);
      ui.notifications.error(game.i18n.localize('MF.ErrorDeleteCustomSkill') || 'Failed to delete custom skill');
    }
  }

  _getCriticalInjuries() {
    const list = this.actor.system?.criticalInjuries?.entries;
    return Array.isArray(list) ? list.map(entry => ({
      name: String(entry?.name || ''),
      healed: !!entry?.healed,
      notes: String(entry?.notes || '')
    })) : [];
  }

  async _onAddCriticalInjury(ev) {
    ev.preventDefault();
    const entries = this._getCriticalInjuries();
    entries.push({ name: '', healed: false, notes: '' });
    await this.actor.update({ 'system.criticalInjuries.entries': entries });
    this.render(false);
  }

  async _onDeleteCriticalInjury(ev) {
    ev.preventDefault();
    const row = ev.currentTarget.closest('[data-injury-index]');
    if (!row) return;
    const index = Number(row.dataset.injuryIndex);
    if (!Number.isInteger(index) || index < 0) return;

    const entries = this._getCriticalInjuries();
    if (index >= entries.length) return;
    entries.splice(index, 1);
    await this.actor.update({ 'system.criticalInjuries.entries': entries });
    this.render(false);
  }

  async _onChangeCriticalInjuryField(ev) {
    const input = ev.currentTarget;
    const row = input.closest('[data-injury-index]');
    if (!row) return;
    const index = Number(row.dataset.injuryIndex);
    if (!Number.isInteger(index) || index < 0) return;

    const entries = this._getCriticalInjuries();
    const current = entries[index];
    if (!current) return;

    if (input.classList.contains('crit-injury-name')) {
      current.name = String(input.value || '');
    } else if (input.classList.contains('crit-injury-healed')) {
      current.healed = !!input.checked;
    } else if (input.classList.contains('crit-injury-notes')) {
      current.notes = String(input.value || '');
    } else {
      return;
    }

    await this.actor.update({ 'system.criticalInjuries.entries': entries });
  }

  _getVehicles() {
    const list = this.actor.system?.vehicles;
    return Array.isArray(list)
      ? list.map((entry) => ({
        name: String(entry?.name || ''),
        notes: String(entry?.notes || '')
      }))
      : [];
  }

  async _onAddVehicle(ev) {
    ev.preventDefault();
    const vehicles = this._getVehicles();
    vehicles.push({ name: '', notes: '' });
    await this.actor.update({ 'system.vehicles': vehicles });
    this.render(false);
  }

  async _onDeleteVehicle(ev) {
    ev.preventDefault();
    const row = ev.currentTarget.closest('[data-vehicle-index]');
    if (!row) return;
    const index = Number(row.dataset.vehicleIndex);
    if (!Number.isInteger(index) || index < 0) return;

    const vehicles = this._getVehicles();
    if (index >= vehicles.length) return;
    vehicles.splice(index, 1);
    await this.actor.update({ 'system.vehicles': vehicles });
    this.render(false);
  }

  async _onChangeVehicleField(ev) {
    const input = ev.currentTarget;
    const row = input.closest('[data-vehicle-index]');
    if (!row) return;
    const index = Number(row.dataset.vehicleIndex);
    if (!Number.isInteger(index) || index < 0) return;

    const vehicles = this._getVehicles();
    const current = vehicles[index];
    if (!current) return;

    if (input.classList.contains('vehicle-name')) {
      current.name = String(input.value || '');
    } else if (input.classList.contains('vehicle-notes')) {
      current.notes = String(input.value || '');
    } else {
      return;
    }

    await this.actor.update({ 'system.vehicles': vehicles });
  }


  /** Build the checklist markup for the common situational roll modifiers */
  static _situationalModifiersListHtml() {
    return SITUATIONAL_MODIFIERS.map(m => `
      <label style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;padding:4px 6px;border:1px solid #a33;margin-bottom:3px;">
        <span>${m.label}</span>
        <span style="display:flex;align-items:center;gap:8px;">
          <span>${m.value >= 0 ? '+' : ''}${m.value}</span>
          <input type="checkbox" class="sit-mod-check" data-value="${m.value}"/>
        </span>
      </label>
    `).join('');
  }

  /** Prompt for a roll modifier/difficulty, including optional situational modifiers. Returns {mod, difficulty} or null if cancelled. */
  async _promptRollModifiers(title) {
    try {
      return await Dialog.prompt({
        title,
        content: `
          <div style="margin-bottom: 10px;">
            <label>Modifier:</label>
            <input type="number" name="mod" value="0" style="width:100%"/>
          </div>
          <div style="margin-bottom: 10px;">
            <label>${game.i18n.localize('MF.RollDifficultyPrompt')}:</label>
            <input type="number" name="difficulty" placeholder="Optional" style="width:100%"/>
          </div>
          <div style="margin: 8px 0;">
            <strong>Situational Modifiers Total: <span class="sit-mod-total">+0</span></strong>
          </div>
          <details open>
            <summary style="cursor:pointer;font-weight:bold;">Situational Modifiers</summary>
            <div style="margin-top:6px;max-height:260px;overflow-y:auto;">
              ${this.constructor._situationalModifiersListHtml()}
            </div>
          </details>
        `,
        label: "Roll",
        options: { width: 480 },
        render: html => {
          const sumChecked = () => html.find('.sit-mod-check:checked').toArray()
            .reduce((acc, el) => acc + Number(el.dataset.value), 0);
          const updateTotal = () => {
            const sum = sumChecked();
            html.find('.sit-mod-total').text(`${sum >= 0 ? '+' : ''}${sum}`);
          };
          html.find('.sit-mod-check').on('change', updateTotal);
          updateTotal();
        },
        callback: html => {
          const modVal = Number(html.find("[name='mod']").val() || 0);
          const diffVal = html.find("[name='difficulty']").val();
          const sitSum = html.find('.sit-mod-check:checked').toArray()
            .reduce((acc, el) => acc + Number(el.dataset.value), 0);
          return { mod: modVal + sitSum, difficulty: diffVal ? Number(diffVal) : null };
        }
      });
    } catch (_) {
      return null;
    }
  }

  /** Roll a stat */
  async _onRollStat(ev) {
    ev.preventDefault();
    const button = ev.currentTarget;
    const stat = this.constructor.normalizeStatKey(button.dataset.ability);
    if (!stat) return;
    
    const statSource = this.actor.system?.stats?.[stat];
    const statVal = typeof statSource === 'object' && statSource !== null ? Number(statSource.value) || 0 : Number(statSource) || 0;
    
    let mod = 0;
    let difficulty = null;

    if (!ev.shiftKey) {
      const result = await this._promptRollModifiers(game.i18n.format('MF.RollSimple', { name: stat }));
      if (!result) return;
      mod = result.mod || 0;
      difficulty = result.difficulty;
    }

    const { roll, total: base, plusDice, minusDice, capped, maxExtra } = await this.constructor._rollBidirectionalExplodingD10();
    const finalTotal = base + statVal + (mod||0);
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    
    const plusStr = plusDice.join(' + ');
    const minusStr = minusDice.length ? ' - (' + minusDice.join(' + ') + ')' : '';
    const flavorParts = [`(${plusStr}${minusStr})`, `${stat} ${statVal}`];
    if (mod) flavorParts.push(`Mod ${mod >= 0 ? '+' : ''}${mod}`);
    
    const explodedUp = plusDice.some(d=>d===10) ? 'Up' : '';
    const explodedDown = minusDice.some(d=>d===1) ? (explodedUp ? '/Down' : 'Down') : '';
    const tag = (explodedUp || explodedDown) ? `<span class="exploding">[Exploding ${explodedUp}${explodedDown}]</span>` : '';
    const capTag = capped ? ` <span class="exploding cap">[Cap ${maxExtra}]</span>` : '';
    
    let resultText = '';
    if (difficulty !== null) {
      const success = finalTotal >= difficulty;
      resultText = ` vs Difficulty ${difficulty} = <strong style="color: ${success ? 'green' : 'red'}">${success ? 'SUCCESS' : 'FAILURE'}</strong>`;
    }
    
    const rollTitle = difficulty !== null ? 
      game.i18n.format('MF.RollWithDifficulty', { name: stat, difficulty }) :
      game.i18n.format('MF.RollSimple', { name: stat });
    
    const flavor = `<strong>${this.actor.name}</strong> rolls ${rollTitle} ${tag}${capTag} = ${flavorParts.join(' + ')} = <strong>${finalTotal}</strong>${resultText}`;
    await roll.toMessage({ speaker, flavor });
  }

  /** Roll 1d10 for Stun Save */
  async _onRollStunSave(ev) {
    ev.preventDefault();
    const stunVal = Number(this.actor.system?.substats?.stun) || 0;
    const roll = new Roll('1d10');
    await roll.evaluate();
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const flavor = `<strong>${this.actor.name}</strong> rolls Stun Save (${stunVal}) � 1d10 = <strong>${roll.total}</strong> � ${roll.total <= stunVal ? '<span style="color:green">SUCCESS</span>' : '<span style="color:red">FAILURE</span>'}`;
    await roll.toMessage({ speaker, flavor });
  }

  async _onRollDeathSave(ev) {
    ev.preventDefault();
    const threshold = Number(this.actor.system?.substats?.death) || 0;
    const roll = new Roll("1d10");
    await roll.evaluate();

    const survived = roll.total <= threshold;
    const outcome = survived
      ? '<strong style="color:green">SURVIVED</strong>'
      : '<strong style="color:red">DEAD</strong>';
    const note = survived ? '<div>Roll again next turn.</div>' : '';
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const flavor = `
      <div>
        <div><strong>${this.actor.name}</strong> rolls Death Save</div>
        <div>Roll Result: <strong>${roll.total}</strong></div>
        <div>Threshold: <strong>${threshold}</strong></div>
        <div>Outcome: ${outcome}</div>
        ${note}
      </div>
    `;

    await roll.toMessage({ speaker, flavor });
  }

  /** Roll a skill */
  async _onRollSkill(ev) {
    ev.preventDefault();
    const li = ev.currentTarget.closest("[data-skill-id]");
    if (!li) return;
    const id = li.dataset.skillId;
    const skill = this.actor.items.get(id);
    if (!skill) return;
    
    const stat = this.constructor.normalizeStatKey(skill.system?.stat || "INT");
    const rank = LongDriftActorSheet._num(skill.system?.rank, 0);
    const statLabel = stat;
    const statVal = LongDriftActorSheet._effectiveStatVal(this.actor.system, stat);

    let mod = 0;
    let difficulty = null;

    if (!ev.shiftKey) {
      const result = await this._promptRollModifiers(game.i18n.format('MF.RollSimple', { name: skill.name }));
      if (!result) return;
      mod = result.mod || 0;
      difficulty = result.difficulty;
    }
    
    const { roll, total: base, plusDice, minusDice, capped, maxExtra } = await this.constructor._rollBidirectionalExplodingD10();
    const finalTotal = base + statVal + rank + (mod||0);
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    
    const plusStr = plusDice.join(' + ');
    const minusStr = minusDice.length ? ' - (' + minusDice.join(' + ') + ')' : '';
    const flavorParts = [`(${plusStr}${minusStr})`];
    flavorParts.push(`${statLabel} ${statVal}`);
    if (rank) flavorParts.push(`Rank ${rank}`);
    if (mod) flavorParts.push(`Mod ${mod >= 0 ? '+' : ''}${mod}`);
    
    const explodedUp = plusDice.some(d=>d===10) ? 'Up' : '';
    const explodedDown = minusDice.some(d=>d===1) ? (explodedUp ? '/Down' : 'Down') : '';
    const tag = (explodedUp || explodedDown) ? `<span class="exploding">[Exploding ${explodedUp}${explodedDown}]</span>` : '';
    const capTag = capped ? ` <span class="exploding cap">[Cap ${maxExtra}]</span>` : '';
    
    let resultText = '';
    if (difficulty !== null) {
      const success = finalTotal >= difficulty;
      resultText = ` vs Difficulty ${difficulty} = <strong style="color: ${success ? 'green' : 'red'}">${success ? 'SUCCESS' : 'FAILURE'}</strong>`;
    }
    
    const rollTitle = difficulty !== null ? 
      game.i18n.format('MF.RollWithDifficulty', { name: skill.name, difficulty }) :
      game.i18n.format('MF.RollSimple', { name: skill.name });
    
    const flavor = `<strong>${this.actor.name}</strong> rolls ${rollTitle} ${tag}${capTag} = ${flavorParts.join(' + ')} = <strong style="font-size: 1.2em; color: #4a90e2;">${finalTotal}</strong>${resultText}`;
    await roll.toMessage({ speaker, flavor });
  }

  /** Create a new weapon item */
  async _onCreateWeapon(ev) {
    ev.preventDefault();

    try {
      const selectedType = await this._promptWeaponTypeChoice("Pistol");
      const template = await this._promptWeaponTemplateChoice(selectedType);
      const createData = this.constructor._weaponDocFromTemplate(template, selectedType);
      await this.actor.createEmbeddedDocuments('Item', [createData]);
      this.render(false);
    } catch (err) {
      console.error('long-drift | Failed to create weapon', err);
      ui.notifications.error("Failed to create weapon");
    }
  }

  /** Delete a weapon item */
  async _onDeleteWeapon(ev) {
    ev.preventDefault();
    const itemId = ev.currentTarget.dataset.itemId;
    if (!itemId) return;
    
    const item = this.actor.items.get(itemId);
    if (!item) return;

    const confirmed = await Dialog.confirm({
      title: "Delete Weapon",
      content: `Delete weapon "${item.name}"?`,
      yes: () => true,
      no: () => false
    });

    if (confirmed) {
      try {
        await item.delete();
        ui.notifications.info(`Deleted weapon: ${item.name}`);
        this.render(false);
      } catch (err) {
        console.error('long-drift | Failed to delete weapon', err);
        ui.notifications.error("Failed to delete weapon");
      }
    }
  }

  /** Change weapon field */
  async _onChangeWeaponField(ev) {
    const input = ev.currentTarget;
    const row = input.closest('[data-item-id]');
    if (!row) return;
    
    const itemId = row.dataset.itemId;
    const field = input.dataset.field;
    if (!itemId || !field) return;

    const item = this.actor.items.get(itemId);
    if (!item) return;

    let val = input.type === 'checkbox' ? input.checked : input.value;
    
    // Parse numbers for numeric fields
    if (['wa', 'shots', 'rof'].includes(field)) {
      val = LongDriftActorSheet._num(val, 0);
      if (field === 'rof') val = Math.max(1, val);
    }

    if (field === 'weaponType') {
      const previousType = String(item.system?.weaponType || 'Pistol');
      const selectedType = String(val || 'Pistol');

      let template = null;
      try {
        template = await this._promptWeaponTemplateChoice(selectedType, item.name);
      } catch (err) {
        console.warn('long-drift | Weapon template choice cancelled/failed', err);
      }

      if (!template) {
        // Revert select if selection flow was cancelled.
        input.value = previousType;
        this._updateWeaponDvDisplay(row, previousType);
        return;
      }

      this._updateWeaponDvDisplay(row, selectedType);
      const defaults = this.constructor._weaponDocFromTemplate(template, selectedType);
      const updateData = {
        name: defaults.name,
        img: defaults.img,
        'system.weaponType': defaults.system.weaponType,
        'system.damage': defaults.system.damage,
        'system.rof': defaults.system.rof,
        'system.shots': defaults.system.shots,
        'system.quality': defaults.system.quality,
        'system.skill': defaults.system.skill,
        'system.note': defaults.system.note,
        'system.isMecha': defaults.system.isMecha
      };

      try {
        await item.update(updateData);
      } catch (err) {
        console.error('long-drift | Failed to apply weapon type defaults', err);
        ui.notifications.error('Failed to apply weapon type defaults');
      }
      return;
    }

    const updateData = field === 'name'
      ? { name: String(val || '').trim() }
      : { [`system.${field}`]: val };

    try {
      await item.update(updateData);
    } catch (err) {
      console.error(`long-drift | Failed to update weapon field ${field}`, err);
      ui.notifications.error(`Failed to update weapon ${field}`);
    }
  }

  /** @override — intercept armor drops; update SP fields only, do not embed the item */
  async _onDropItem(event, data) {
    const item = await fromUuid(data.uuid);
    if (!item || item.type !== "armor") {
      return super._onDropItem(event, data);
    }

    const sp = item.system?.sp ?? 0;
    const spMax = item.system?.spMax ?? sp;
    const penalty = item.system?.penalty ?? 0;
    const locations = item.system?.locations ?? ["head", "body"];

    const update = {};
    if (locations.includes("head")) {
      update["system.armor.head.sp.value"] = sp;
      update["system.armor.head.sp.max"] = spMax;
      update["system.armor.head.penalty"] = penalty;
    }
    if (locations.includes("body")) {
      update["system.armor.body.sp.value"] = sp;
      update["system.armor.body.sp.max"] = spMax;
      update["system.armor.body.penalty"] = penalty;
    }

    if (Object.keys(update).length) await this.actor.update(update);
    ui.notifications.info(`${item.name} equipped — Head SP ${sp} / Body SP ${sp}, Penalty ${penalty}`);
  }

  /** Roll weapon damage from the formula stored in item.system.damage */
  async _onRollWeaponDamage(ev) {
    ev.preventDefault();
    const button = ev.currentTarget;
    const itemId = button.dataset.itemId;
    if (!itemId) return;

    const weapon = this.actor.items.get(itemId);
    if (!weapon) return;

    const formula = (weapon.system?.damage ?? '').trim();
    if (!formula) {
      ui.notifications.warn(`${weapon.name} has no damage formula set.`);
      return;
    }

    // Validate formula before rolling
    let roll;
    try {
      roll = new Roll(formula);
      await roll.evaluate();
    } catch (err) {
      ui.notifications.error(`Invalid damage formula "${formula}" for ${weapon.name}.`);
      return;
    }

    const weaponName = weapon.name;
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const flavor = `<strong>${this.actor.name}</strong> rolls damage for <strong>${weaponName}</strong>: <em>${formula}</em> = <strong style="font-size: 1.2em; color: #c0392b;">${roll.total}</strong>`;
    await roll.toMessage({ speaker, flavor });
  }

  /** Roll a weapon attack */
  async _onRollWeapon(ev) {    ev.preventDefault();
    const button = ev.currentTarget;
    const itemId = button.dataset.itemId;
    if (!itemId) return;

    const weapon = this.actor.items.get(itemId);
    if (!weapon) return;

    const mode = String(button.dataset.mode || "single");
    const skillName = mode === "autofire" ? "Autofire (x2)" : weapon.system?.skill;
    const wa = LongDriftActorSheet._num(weapon.system?.wa, 0);
    const qualityRaw = String(weapon.system?.quality || "Standard");
    const quality = ["Poor", "Standard", "Excellent"].includes(qualityRaw) ? qualityRaw : "Standard";
    const qualityBonus = quality === "Excellent" ? 1 : 0;

    // Find the corresponding skill in the actor's items
    let skillTotal = 0;
    if (skillName) {
      const skill = this.actor.items.find(i => i.type === 'skill' && i.name === skillName);

      if (skill) {
        const statKey = this.constructor.normalizeStatKey(skill.system?.stat || "INT");
        const statVal = LongDriftActorSheet._effectiveStatVal(this.actor.system, statKey);
        const rank = LongDriftActorSheet._num(skill.system?.rank, 0);
        skillTotal = statVal + rank;
      }
    }

    // Range DV section — targeted or reference table
    const weaponType = String(weapon.system?.weaponType || "");
    let dvSection = "";
    let attackDV = null;
    const targetToken = game.user.targets?.size > 0 ? [...game.user.targets][0] : null;
    const attackerToken = canvas?.tokens?.controlled?.[0] ?? null;

    if (targetToken && attackerToken) {
      try {
        const pathResult = canvas.grid.measurePath([attackerToken.center, targetToken.center]);
        const distanceMeters = Math.round(pathResult.distance * 10) / 10;
        const dvResult = getDVForRange(weaponType, distanceMeters);
        attackDV = dvResult?.dv ?? null;
        const dvDisplay = attackDV != null
          ? `<strong>${attackDV}</strong>`
          : `<em style="color:#999;">Out of Range</em>`;
        const rangeBand = dvResult?.rangeLabel ?? "—";
        dvSection = `
          <div style="margin-top:0.4rem;border-top:1px solid #555;padding-top:0.4rem;">
            <div>Target: <strong>${targetToken.name}</strong> @ ${distanceMeters}m [${rangeBand}]</div>
            <div>Attack DV: ${dvDisplay}</div>
          </div>`;
      } catch (err) {
        console.warn("Long Drift | Range DV lookup failed:", err);
      }
    } else {
      const entry = WEAPON_RANGE_DVS[weaponType];
      if (entry) {
        const rows = entry.ranges
          .filter(b => b.dv != null)
          .map(b => `<tr><td>${b.label}</td><td style="text-align:right;padding-left:1rem;">${b.dv}</td></tr>`)
          .join("");
        if (rows) {
          dvSection = `
            <div style="margin-top:0.4rem;border-top:1px solid #555;padding-top:0.4rem;">
              <div style="margin-bottom:0.2rem;font-style:italic;font-size:0.85em;color:#aaa;">Range DVs (no target selected):</div>
              <table style="width:100%;border-collapse:collapse;font-size:0.9em;">
                <thead><tr><th style="text-align:left;">Range</th><th style="text-align:right;">DV</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
            </div>`;
        }
      }
    }

    const total = skillTotal + wa + qualityBonus;
    const { roll, total: baseTotal, plusDice, minusDice, capped, maxExtra } = await this.constructor._rollBidirectionalExplodingD10();
    const isPoorJam = quality === "Poor" && Number(plusDice?.[0] || 0) === 1;

    const rollTotal = baseTotal + total;

    const plusStr = plusDice.join(' + ');
    const minusStr = minusDice.length ? ' - (' + minusDice.join(' + ') + ')' : '';
    const explodedUp = plusDice.some(d=>d===10) ? 'Up' : '';
    const explodedDown = minusDice.some(d=>d===1) ? (explodedUp ? '/Down' : 'Down') : '';
    const tag = (explodedUp || explodedDown) ? ` <span style="color: #999; font-size: 0.85em;">[Exploding ${explodedUp}${explodedDown}]</span>` : '';
    const capTag = capped ? ` <span style="color: #999; font-size: 0.85em;">[Cap ${maxExtra}]</span>` : '';

    // HIT/MISS — only shown when a target DV is known
    let hitMissHTML = '';
    if (attackDV !== null) {
      const isHit = rollTotal >= attackDV;
      hitMissHTML = `<div style="margin-top:0.35rem;font-size:1.2em;font-weight:700;color:${isHit ? '#27ae60' : '#c0392b'};">${isHit ? 'HIT' : 'MISS'}</div>`;
    }

    // Single damage roll button showing the formula label
    const damageFormula = (weapon.system?.damage ?? '').trim();
    const safeWeaponName = weapon.name.replace(/"/g, '&quot;');
    const damageBtnHTML = damageFormula
      ? `<div style="margin-top:0.5rem;"><button type="button" class="long-drift-damage-btn" data-actor-id="${this.actor.id}" data-item-id="${itemId}" data-damage="${damageFormula}" data-weapon-name="${safeWeaponName}">Roll Damage: ${damageFormula}</button></div>`
      : '';

    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const weaponName = weapon.name;
    const modeLabel = mode === "autofire" ? "Autofire" : "Attack";
    const qualityDisplay = qualityBonus ? `+${qualityBonus}` : "+0";
    const jamText = isPoorJam
      ? `<p style="margin:0.35rem 0 0 0;color:#b30000;font-weight:700;">Poor Weapon Jam: clear jam with an Action.</p>`
      : "";
    const flavor = `
      <div class="long-drift weapon-roll-card">
        <div><strong>${this.actor.name}</strong> rolls <strong>${weaponName}</strong> [${modeLabel}]${tag}${capTag}</div>
        <div style="margin-top:0.35rem;">
          <div>Exploding d10: (${plusStr}${minusStr}) = <strong>${baseTotal}</strong></div>
          <div>Skill (${skillName || "Unlinked"}): <strong>${skillTotal}</strong></div>
          <div>WA: <strong>${wa}</strong></div>
          <div>Quality (${quality}): <strong>${qualityDisplay}</strong></div>
        </div>
        <div style="margin-top:0.35rem;">Final Total: <strong style="font-size: 1.2em; color: #4a90e2;">${rollTotal}</strong></div>
        ${dvSection}
        ${hitMissHTML}
        ${jamText}
        ${damageBtnHTML}
      </div>
    `;

    await roll.toMessage({ speaker, flavor });
    if (isPoorJam) {
      ui.notifications.warn(`${weaponName} jammed (Poor Quality).`);
    }
  }
}
