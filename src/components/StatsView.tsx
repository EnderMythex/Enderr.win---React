import { useEffect, useRef, useState } from 'react';
import { fetchStats, formatRelative, type TiktokStats, type TwitterStats } from '@/lib/stats';
import type { Translation } from '@/lib/i18n';

interface StatsViewProps {
  active: boolean;
  opacity: number;
  t: Translation;
}

function useAnimatedCount(target: number | null) {
  const [value, setValue] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    if (target === null) return;
    const start = prevRef.current;
    if (start === target) return;
    const duration = 700;
    const t0 = performance.now();
    let raf = 0;
    function step(now: number) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target! - start) * eased);
      setValue(val);
      if (p < 1) raf = requestAnimationFrame(step);
      else prevRef.current = target!;
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return target === null ? '—' : value.toLocaleString();
}

export function StatsView({ active, opacity, t }: StatsViewProps) {
  const [twitter, setTwitter] = useState<TwitterStats | null | 'offline'>(null);
  const [tiktok, setTiktok] = useState<TiktokStats | null | 'offline'>(null);

  useEffect(() => {
    if (!active) return;

    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      const { twitter: tw, tiktok: tk } = await fetchStats(controller.signal);
      if (cancelled) return;
      if (tw.status === 'fulfilled') setTwitter(tw.value);
      else if (tw.reason?.name !== 'AbortError') setTwitter('offline');
      if (tk.status === 'fulfilled') setTiktok(tk.value);
      else if (tk.reason?.name !== 'AbortError') setTiktok('offline');
    }

    run();
    const interval = setInterval(run, 15000);
    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, [active]);

  const replies = useAnimatedCount(twitter && twitter !== 'offline' ? twitter.total_replies ?? 0 : null);
  const likes = useAnimatedCount(twitter && twitter !== 'offline' ? twitter.total_likes ?? 0 : null);
  const claims = useAnimatedCount(twitter && twitter !== 'offline' ? twitter.total_claims ?? 0 : null);
  const flames = useAnimatedCount(tiktok && tiktok !== 'offline' ? tiktok.total_flames ?? 0 : null);

  const twitterMeta =
    twitter === 'offline'
      ? t.stats.offline
      : twitter
        ? t.stats.lastAction
            .replace('{action}', twitter.last_action || '—')
            .replace('{time}', formatRelative(twitter.last_action_at, t.stats.never))
        : t.stats.never;

  const tiktokMeta =
    tiktok === 'offline'
      ? t.stats.offline
      : tiktok
        ? t.stats.lastAction
            .replace('{action}', tiktok.last_action || '—')
            .replace('{time}', formatRelative(tiktok.last_action_at, t.stats.never))
        : t.stats.never;

  return (
    <div id="stats-view" className={active ? 'active' : ''} style={{ opacity }}>
      <div className="stats-columns">
        <div className="stats-bot">
          <h2 className="stats-bot-title">X (Twitter)</h2>
          <div className="stats-bot-list">
            <div className="stats-item">
              <span className="stats-item-label">{t.stats.replies}</span>
              <span className="stats-item-value">{replies}</span>
            </div>
            <div className="stats-item">
              <span className="stats-item-label">{t.stats.likes}</span>
              <span className="stats-item-value">{likes}</span>
            </div>
            <div className="stats-item">
              <span className="stats-item-label">{t.stats.claims}</span>
              <span className="stats-item-value">{claims}</span>
            </div>
          </div>
          <p className="stats-bot-meta">{twitterMeta}</p>
        </div>
        <div className="stats-bot">
          <h2 className="stats-bot-title">TikTok Bot</h2>
          <div className="stats-bot-list">
            <div className="stats-item">
              <span className="stats-item-label">{t.stats.flames}</span>
              <span className="stats-item-value">{flames}</span>
            </div>
          </div>
          <p className="stats-bot-meta">{tiktokMeta}</p>
        </div>
      </div>
      <p className="stats-hint">{t.stats.hint}</p>
    </div>
  );
}
