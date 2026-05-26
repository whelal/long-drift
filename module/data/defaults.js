// Centralized defaults for stats and skills
export const STAT_DEFAULT_VALUES = Object.freeze({
  // RED canonical stats
  INT: 5, REF: 5, DEX: 5, TECH: 5, COOL: 5,
  WILL: 5, LUCK: 5, MOVE: 5, BODY: 5, EMP: 5
});

export function applyStatDefaults(stats = {}, defaults = STAT_DEFAULT_VALUES) {
  const out = { ...defaults }; // shallow copy
  for (const [k, v] of Object.entries(stats)) {
    if (v && typeof v === 'object') out[k] = { value: Number(v.value) };
  }
  // Ensure shape {KEY:{value:number}}
  for (const k of Object.keys(out)) {
    const val = out[k];
    if (typeof val !== 'object') {
      const n = Number(val);
      out[k] = { value: Number.isFinite(n) ? n : defaults[k] };
    } else {
      const n = Number(out[k].value);
      out[k].value = Number.isFinite(n) ? n : defaults[k];
    }
  }
  return out;
}
