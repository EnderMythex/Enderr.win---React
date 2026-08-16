const API_BASE = 'https://api.enderr.win';
const TWITTER_API = `${API_BASE}/api/stats/og-task-bot`;
const TIKTOK_API = `${API_BASE}/api/stats/tiktok-task-bot`;

export interface TwitterStats {
  total_replies?: number;
  total_likes?: number;
  total_claims?: number;
  last_action?: string;
  last_action_at?: string;
}

export interface TiktokStats {
  total_flames?: number;
  last_action?: string;
  last_action_at?: string;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchStats(signal?: AbortSignal) {
  const [twitter, tiktok] = await Promise.allSettled([
    fetchJson<TwitterStats>(TWITTER_API, signal),
    fetchJson<TiktokStats>(TIKTOK_API, signal),
  ]);
  return { twitter, tiktok };
}

export function formatRelative(iso: string | undefined, neverLabel: string): string {
  if (!iso) return neverLabel;
  const then = new Date(iso);
  if (isNaN(then.getTime())) return neverLabel;
  const diff = Math.max(0, Date.now() - then.getTime());
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon}mo ago`;
  return `${Math.floor(mon / 12)}y ago`;
}
