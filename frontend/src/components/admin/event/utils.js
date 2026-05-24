// Utilities for event management
const STORAGE_KEY = "sheisdesign_events";

export function loadEvents(seedEvents) {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) return JSON.parse(r);
  } catch {}
  return seedEvents;
}

export function saveEvents(evs) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evs)); } catch {}
}

export function genId() {
  return "evt-" + Date.now().toString(36);
}

export function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d + "T00:00:00").toLocaleDateString("en-ZA", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return d; }
}

export function calcPct(count, max) {
  return max > 0 ? Math.min(100, Math.round((count / max) * 100)) : 0;
}
