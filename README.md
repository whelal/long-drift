# Long Drift FoundryVTT System

Long Drift is a custom Foundry VTT system focused on Cyberpunk RED style play.

This project is in an early migration phase (v0.0.x). Data schema, UI layout, and rule handling can change between updates.

---
## Overview
Long Drift aims to provide a complete Cyberpunk RED gameplay foundation in Foundry VTT.

Current focus areas:
- Core stat and skill workflows
- Actor and item sheet stability
- Dice rolling, initiative, and derived value support
- Seed tools for baseline world data

---
## Current Feature Set
- Character sheet with compact stat and skill workflows
- Bidirectional exploding d10 roll behavior
- Initiative handling tied to actor data
- DataModel-backed actor/item structures (Foundry v13+)
- Manual and automatic seed workflows
- Localization scaffold in lang/en.json
- One-time world migration for legacy stat keys on skills

---
## Roadmap
| Phase | Goal | Status |
|-------|------|--------|
| 0.0.x | Foundation stabilization and cleanup | In progress |
| 0.1.0 | Core derived values and combat pass | Planned |
| 0.2.0 | Item/category expansion and sheet UX pass | Planned |
| 0.3.0 | Migration tooling hardening | Planned |
| 0.4.0 | Localization expansion and docs polish | Planned |

---
## Installation (Development)
1. Place (clone or copy) this folder into your Foundry Data/systems directory.
2. Restart Foundry.
3. Create or load a world and select Long Drift as the system.
4. Use macros/seed-core-data.macro.js if you need to repopulate baseline data.

Optional (git):
```bash
cd /path/to/FoundryVTT/Data/systems
git clone https://github.com/whelal/long-drift.git
```

---
## Actor Data Schema (Simplified)
```js
system: {
  meta: { role: string, age: number, points: number },
  stats: {
    INT:{value}, REF:{value}, DEX:{value}, TECH:{value}, COOL:{value},
    WILL:{value}, LUCK:{value}, MOVE:{value}, BODY:{value}, EMP:{value}
  },
  skills: { },
  // preferred workflow is embedded skill and item documents
}
```

---
## Migration and Seeding
- One-time migration (GM-only) runs on ready and normalizes legacy item stat keys:
  - MA -> MOVE
  - ATTR -> COOL
  - EDU -> INT
  - PSI -> WILL
- The migration is version-gated via world setting `long-drift.migrationVersion`.
- World seeding populates `Long Drift Core Skills`.
- New actors can be synchronized with baseline seeded data.

Re-run seeding world-wide (console):
```js
(async ()=>{ const { seedWorldData } = await import(game.modules.get('long-drift') ? '' : 'systems/long-drift/module/seed.js'); await seedWorldData(); })();
```

---
## Rolling System
- Base stat roll uses d10 with configured explosion behavior
- Skill rolls combine stat + rank + dice result
- Roll metadata is written under roll.flags['long-drift']
- Chat messages show roll breakdown details

---
## Development Layout
```
module/
  data/ (defaults, skills, actor/item model files)
  seed.js (world + actor seeding)
  settings.js (system settings)
  sheets/item-sheet.js
scripts/sheets/
  actor-sheet.js (sheet logic, rolls, UI state)
  long-drift.js (init hooks, sheet registration, initiative, auto-seed)
styles/ (CSS: long-drift.css)
templates/actor/
  actor-sheet.hbs (main sheet)
lang/en.json
system.json
```

---
## Internationalization
Add another language by copying lang/en.json (for example to lang/fr.json) and adding the language entry in system.json.

---
## Known Gaps
- Some RED-specific derived formulas are still being finalized
- Validation and migration coverage are still expanding
- Automated regression tests are still minimal

---
## Contributing
Issues and PRs are welcome. Priority areas:
- RED rules alignment and validation
- Sheet UX cleanup
- Migration tooling
- Localization packs

---
## License and Disclaimer
MIT License (see LICENSES/NOTICE.txt). This is a non-commercial fan project for tabletop use.

Report issues: https://github.com/whelal/long-drift/issues

---
## Homebrew / Third-Party Content Notice
This project may reference or summarize rules and numeric values from third-party
published games. Where applicable this module follows the homebrew policies of
the original publishers (for example R. Talsorian Games). The project is free
to use and distribute and does not include copyrighted descriptive text from
published works. For full rules and descriptive text, please consult the
original books.

Required disclaimer from R. Talsorian Games (when referencing their material):
"[This module] is unofficial content provided under the Homebrew Content
Policy of R. Talsorian Games and is not approved or endorsed by RTG. This
content references materials that are the property of R. Talsorian Games and
its licensees."

See `HOMEBREW_NOTICE.md` for full details.
