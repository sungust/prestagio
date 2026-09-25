export interface SavedEscape {
  id: string;
  name: string;
  url: string;
  savedAt: string;
}

const KEY = "prestagio:saved-escapes";

/** Saved escapes live only in this browser. Nothing is sent to Prestagio. */
export function readSaved(): SavedEscape[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedEscape[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function writeSaved(list: SavedEscape[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new Event("prestagio:saved"));
  } catch {
    /* storage unavailable (private mode): saving is a convenience only */
  }
}
