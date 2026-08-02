export class ActorDataModel extends foundry.abstract.DataModel {
    // Pre-schema-validation fixup: substats.hp and armor.{head,body}.sp used to be flat
    // fields (hp/hp_current, sp/spMax). They're now {value, max} pairs so Foundry's native
    // token bar resolution works. This runs on every load, so old actor data is upgraded
    // transparently without a migration script.
    static migrateData(source, ...args) {
        const substats = source?.substats;
        if (substats && (substats.hp === null || typeof substats.hp !== "object")) {
            const max = Number(substats.hp) || 0;
            const value = Number(substats.hp_current ?? max) || 0;
            substats.hp = { value, max };
            delete substats.hp_current;
        }

        const armor = source?.armor;
        for (const location of ["head", "body"]) {
            const loc = armor?.[location];
            if (loc && (loc.sp === null || typeof loc.sp !== "object")) {
                const max = Number(loc.spMax ?? loc.sp) || 0;
                const value = Number(loc.sp ?? max) || 0;
                loc.sp = { value, max };
                delete loc.spMax;
            }
        }

        // meta.points and meta.eurobucks used to be flat numbers. They're now
        // {value, transactions} so changes can be logged instead of just overwritten.
        const meta = source?.meta;
        for (const key of ["points", "eurobucks"]) {
            const entry = meta?.[key];
            if (entry !== null && entry !== undefined && typeof entry !== "object") {
                meta[key] = { value: Number(entry) || 0, transactions: [] };
            }
        }

        return super.migrateData(source, ...args);
    }

    static defineSchema() {
        const fields = foundry.data.fields;
        const ledgerField = (initialValue, { allowNegative = false } = {}) => new fields.SchemaField({
            value: new fields.NumberField({ initial: initialValue, integer: true, ...(allowNegative ? {} : { min: 0 }) }),
            transactions: new fields.ArrayField(new fields.SchemaField({
                delta: new fields.NumberField({ initial: 0, integer: true }),
                total: new fields.NumberField({ initial: 0, integer: true }),
                note: new fields.StringField({ initial: "" }),
                time: new fields.NumberField({ initial: 0 })
            }), { initial: [] })
        });
    return {
            meta: new fields.SchemaField({
                role: new fields.StringField({initial: ""}),
                age: new fields.NumberField({initial: 25, min: 0, integer: true}),
                points: ledgerField(0),
                reputation: new fields.NumberField({initial: 0, min: 0, integer: true}),
                eurobucks: ledgerField(500, { allowNegative: true })
            }),
            role: new fields.SchemaField({
                name: new fields.StringField({ initial: "" }),
                ability: new fields.StringField({ initial: "" }),
                rank: new fields.NumberField({ initial: 4, min: 0, max: 10, integer: true }),
                notes: new fields.StringField({ initial: "" })
            }),
            criticalInjuries: new fields.SchemaField({
                entries: new fields.ArrayField(new fields.SchemaField({
                    name: new fields.StringField({ initial: "" }),
                    healed: new fields.BooleanField({ initial: false }),
                    notes: new fields.StringField({ initial: "" })
                }), { initial: [] })
            }),
            vehicles: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField({ initial: "" }),
                notes: new fields.StringField({ initial: "" })
            }), { initial: [] }),
            // Player profile / appearance & personal hooks
            profile: new fields.SchemaField({
                hairColor: new fields.StringField({ initial: "" }),
                hairStyle: new fields.StringField({ initial: "" }),
                eyeColor: new fields.StringField({ initial: "" }),
                height: new fields.StringField({ initial: "" }),
                weight: new fields.StringField({ initial: "" }),
                sex: new fields.StringField({ initial: "" }),
                personalityTraits: new fields.StringField({ initial: "" }),
                valueMost: new fields.StringField({ initial: "" }),
                valuedPossession: new fields.StringField({ initial: "" }),
                personValueMost: new fields.StringField({ initial: "" })
            }),
            stats: new fields.SchemaField({
                INT: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                REF: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                DEX: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                TECH: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                COOL: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                WILL: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                LUCK: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                MOVE: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                BODY: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) }),
                EMP: new fields.SchemaField({ value: new fields.NumberField({initial: 5, min: 0, integer: true}) })
            }),
            // Unified substats container (replaces runtime seeding in sheet logic)
            substats: new fields.SchemaField({
                stun: new fields.NumberField({initial: 0, min: 0, integer: true}),
                death: new fields.NumberField({initial: 0, min: 0, integer: true}),
                bodyTypeMod: new fields.NumberField({initial: 0, integer: true}),
                lift: new fields.NumberField({initial: 0, min: 0, integer: true}),
                carry: new fields.NumberField({initial: 0, min: 0, integer: true}),
                run: new fields.NumberField({initial: 0, min: 0, integer: false}),
                leap: new fields.NumberField({initial: 0, min: 0, integer: false}),
                swim: new fields.NumberField({initial: 0, min: 0, integer: false}),
                hp: new fields.SchemaField({
                    value: new fields.NumberField({initial: 0, min: 0, integer: true}),
                    max: new fields.NumberField({initial: 0, min: 0, integer: true})
                }),
                initiative: new fields.NumberField({initial: 0, integer: true}), // removed min: 0 to allow negative modifiers
                dodge: new fields.NumberField({initial: 0, min: 0, integer: true}),
                enc: new fields.NumberField({initial: 0, min: 0, integer: true}),
                humanity: new fields.NumberField({initial: 0, min: 0, integer: true}),
                humanityMax: new fields.NumberField({initial: 0, min: 0, integer: true}),
                woundState: new fields.StringField({initial: "Healthy"}),
                woundStateSubtitle: new fields.StringField({initial: "No penalties"}),
                armorPenalty: new fields.NumberField({initial: 0, min: 0, integer: true}),
                effectiveREF: new fields.NumberField({initial: 0, min: 0, integer: true}),
                effectiveDEX: new fields.NumberField({initial: 0, min: 0, integer: true}),
                effectiveMOVE: new fields.NumberField({initial: 0, min: 0, integer: true})
            }),
            armor: new fields.SchemaField({
                head: new fields.SchemaField({
                    sp: new fields.SchemaField({
                        value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                        max: new fields.NumberField({ initial: 0, min: 0, integer: true })
                    }),
                    penalty: new fields.NumberField({ initial: 0, integer: true }),
                    itemId: new fields.StringField({ initial: "" })
                }),
                body: new fields.SchemaField({
                    sp: new fields.SchemaField({
                        value: new fields.NumberField({ initial: 0, min: 0, integer: true }),
                        max: new fields.NumberField({ initial: 0, min: 0, integer: true })
                    }),
                    penalty: new fields.NumberField({ initial: 0, integer: true }),
                    itemId: new fields.StringField({ initial: "" })
                })
            }),
            /* Body model for paperdoll locations */
            body: new fields.SchemaField({
                locations: new fields.SchemaField({
                    head: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Head" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    torso: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Torso" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    rArm: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Right Arm" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    lArm: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Left Arm" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    rLeg: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Right Leg" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    lLeg: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Left Leg" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    rHand: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Right Hand" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    lHand: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Left Hand" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    rFoot: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Right Foot" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    }),
                    lFoot: new fields.SchemaField({
                        label: new fields.StringField({ initial: "Left Foot" }),
                        itemId: new fields.StringField({ initial: "" }),
                        notes: new fields.StringField({ initial: "" })
                    })
                }),
                notes: new fields.StringField({ initial: "" })
            }),
            equipment: new fields.SchemaField({
                gear: new fields.StringField({ initial: "" }),
                totalWeight: new fields.NumberField({ initial: 0, min: 0 })
            }),
            // NPC rank field (Mook / Lieutenant / Boss)
            rank: new fields.StringField({ initial: "Mook" }),
            // Player notes field
            notes: new fields.StringField({ initial: "" })
        };
    }

    prepareDerivedData() {
        const stats = this.stats ?? {};
        const substats = this.substats ?? {};

        const readStatValue = (...keys) => {
            for (const key of keys) {
                if (!key) continue;
                const statEntry = stats?.[key];
                if (statEntry === null || statEntry === undefined) continue;

                const candidate = (typeof statEntry === "object" && statEntry !== null)
                    ? statEntry.value
                    : statEntry;
                const num = Number(candidate);
                if (Number.isFinite(num)) return num;
            }
            return 0;
        };

        const body = readStatValue("BODY", "body");
        const emp = readStatValue("EMP", "emp");
        const will = readStatValue("WILL", "will");
        const ref = readStatValue("REF", "ref");
        const dex = readStatValue("DEX", "dex");
        const move = readStatValue("MOVE", "move");

        const headPenalty = Number(this.armor?.head?.penalty ?? 0) || 0;
        const bodyPenalty = Number(this.armor?.body?.penalty ?? 0) || 0;
        const armorPenalty = Math.max(headPenalty, bodyPenalty);
        const effectiveREF = Math.max(1, ref - armorPenalty);
        const effectiveDEX = Math.max(1, dex - armorPenalty);
        const effectiveMOVE = Math.max(1, move - armorPenalty);

        const hpMax = 10 + (5 * Math.ceil((body + will) / 2));
        const humanityMax = emp * 10;
        const humanityCurrentRaw = (substats.humanity === 0 && substats.humanityMax === 0)
            ? humanityMax
            : Number(substats.humanity ?? humanityMax);
        const humanityCurrent = Number.isFinite(humanityCurrentRaw)
            ? Math.max(0, Math.min(Math.trunc(humanityCurrentRaw), humanityMax))
            : humanityMax;

        const hpCurrentRaw = (substats.hp.value === 0 && substats.hp.max === 0)
            ? hpMax
            : Number(substats.hp.value ?? hpMax);
        const hpCurrent = Number.isFinite(hpCurrentRaw)
            ? Math.max(0, Math.min(Math.trunc(hpCurrentRaw), hpMax))
            : hpMax;

        const seriousThreshold = Math.ceil(hpMax / 2);
        let woundState = "Healthy";
        let woundStateSubtitle = "No penalties";

        if (hpCurrent <= 0) {
            woundState = "Mortally Wounded";
            woundStateSubtitle = "-4 all Actions / -6 MOVE / Death Save each Turn";
        } else if (hpCurrent < seriousThreshold) {
            woundState = "Seriously Wounded";
            woundStateSubtitle = "-2 all Actions / Stabilization DV13";
        } else if (hpCurrent < hpMax) {
            woundState = "Lightly Wounded";
            woundStateSubtitle = "Stabilization DV10";
        }

        substats.hp.max = hpMax;
        substats.hp.value = hpCurrent;
        substats.humanity = humanityCurrent;
        substats.humanityMax = humanityMax;
        substats.death = body;
        substats.woundState = woundState;
        substats.woundStateSubtitle = woundStateSubtitle;
        substats.armorPenalty = armorPenalty;
        substats.effectiveREF = effectiveREF;
        substats.effectiveDEX = effectiveDEX;
        substats.effectiveMOVE = effectiveMOVE;
    }
}