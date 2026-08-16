const GITHUB_USERNAME = 'EnderMythex';
const GITHUB_CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
const CONTRIB_CACHE_KEY = 'gh_contrib_cache_v1';

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface ContribDay {
  date: string;
  count: number;
  level: number;
}

export interface ContribResponse {
  contributions: ContribDay[];
}

export interface ContribCell {
  date: string;
  dateObj: Date;
  count: number | null;
  level: number | null;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchJsonWithRetry<T>(url: string, attempts = 3, delayMs = 700): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchJson<T>(url);
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

export function buildContribWeeks(contributions: ContribDay[]): ContribCell[][] {
  if (!contributions || contributions.length === 0) return [];

  const byDate = new Map(contributions.map((d) => [d.date, d]));
  const firstDate = new Date(contributions[0].date + 'T00:00:00');
  const lastDate = new Date(contributions[contributions.length - 1].date + 'T00:00:00');

  const start = new Date(firstDate);
  start.setDate(start.getDate() - start.getDay());

  const weeks: ContribCell[][] = [];
  const cursor = new Date(start);
  while (cursor <= lastDate) {
    const week: ContribCell[] = [];
    for (let i = 0; i < 7; i++) {
      const iso = cursor.toISOString().slice(0, 10);
      const entry = byDate.get(iso);
      week.push({
        date: iso,
        dateObj: new Date(cursor),
        count: entry ? entry.count : null,
        level: entry ? entry.level : null,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export async function loadGithubContributions(): Promise<{ weeks: ContribCell[][]; total: number } | null> {
  let data: ContribResponse | null = null;

  try {
    data = await fetchJsonWithRetry<ContribResponse>(GITHUB_CONTRIB_API);
    localStorage.setItem(CONTRIB_CACHE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('github contributions fetch failed:', err);
    try {
      const cached = localStorage.getItem(CONTRIB_CACHE_KEY);
      if (cached) data = JSON.parse(cached);
    } catch {
      data = null;
    }
  }

  if (!data) return null;

  const contributions = data.contributions || [];
  const weeks = buildContribWeeks(contributions);
  const total = contributions.reduce((sum, d) => sum + (d.count || 0), 0);
  return { weeks, total };
}
