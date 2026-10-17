import { useEffect, useRef, useState } from 'react';
import { loadGithubContributions, MONTH_NAMES, type ContribCell } from '@/lib/github';
import type { Translation } from '@/lib/i18n';

interface Project {
  name: string;
  url: string;
  host: string;
  kind: 'repo' | 'website' | 'extension';
}

const PROJECTS: Project[] = [
  {
    name: 'enderr.win',
    url: 'https://github.com/EnderMythex/enderr.win',
    host: 'github.com',
    kind: 'repo',
  },
  {
    name: 'Cyber-Cookie',
    url: 'http://cybercookie.party/',
    host: 'cybercookie.party',
    kind: 'website',
  },
  {
    name: 'HTML-CSS-Code-Viewer',
    url: 'https://chromewebstore.google.com/detail/html-css-code-viewer/dgildcjamghbgngmnmegikihfcopnmlg',
    host: 'chromewebstore.google.com',
    kind: 'extension',
  },
];

interface ProjectsViewProps {
  active: boolean;
  opacity: number;
  t: Translation;
}

export function ProjectsView({ active, opacity, t }: ProjectsViewProps) {
  const [weeks, setWeeks] = useState<ContribCell[][]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; left: number; top: number } | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!active || loadedRef.current) return;
    loadedRef.current = true;
    loadGithubContributions().then((result) => {
      if (result) {
        setWeeks(result.weeks);
        setTotal(result.total);
      } else {
        setTotal(-1);
      }
    });
  }, [active]);

  function showTooltip(e: React.MouseEvent<HTMLDivElement>, day: ContribCell) {
    if (day.count === null) return;
    const text = `${day.count} contribution${day.count === 1 ? '' : 's'} on ${MONTH_NAMES[day.dateObj.getMonth()]} ${day.dateObj.getDate()}, ${day.dateObj.getFullYear()}`;
    const rect = e.currentTarget.getBoundingClientRect();
    const tw = 200;
    let left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(6, Math.min(left, window.innerWidth - tw - 6));
    setTooltip({ text, left, top: rect.top - 40 });
  }

  let lastMonth = -1;

  return (
    <div id="projects-view" className={active ? 'active' : ''} style={{ opacity }}>
      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <a
            key={project.url}
            className="project-card"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="project-card-top">
              <span className="project-card-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-card-kind">{t.projects.kinds[project.kind]}</span>
            </div>
            <h3 className="project-card-name">{project.name}</h3>
            <div className="project-card-bottom">
              <span className="project-card-host">{project.host}</span>
              <span className="project-card-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="github-card">
        <a className="github-card-header" href="https://github.com/EnderMythex" target="_blank" rel="noreferrer">
          <svg className="github-icon" viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"></path>
          </svg>
          <span>github/EnderMythex</span>
        </a>
        <div className="contrib-graph-wrap">
          <div className="contrib-months" style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)` }}>
            {weeks.map((week, wi) => {
              const firstValidDay = week.find((d) => d.count !== null) || week[0];
              const month = firstValidDay.dateObj.getMonth();
              if (month === lastMonth) return null;
              lastMonth = month;
              return (
                <span key={wi} className="contrib-month-label" style={{ gridColumn: String(wi + 1) }}>
                  {MONTH_NAMES[month]}
                </span>
              );
            })}
          </div>
          <div className="contrib-grid" style={{ gridTemplateColumns: `repeat(${weeks.length}, 10px)` }}>
            {weeks.map((week, wi) =>
              week.map((day, di) => (
                <div
                  key={`${wi}-${di}`}
                  className={`contrib-cell${day.count === null ? ' contrib-cell-empty' : ''}`}
                  style={{ gridColumn: String(wi + 1), gridRow: String(di + 1) }}
                  data-level={day.count === null ? undefined : String(day.level)}
                  onMouseOver={(e) => showTooltip(e, day)}
                  onMouseOut={() => setTooltip(null)}
                />
              )),
            )}
          </div>
        </div>
        <div className="contrib-footer">
          <span className="contrib-total">
            {total === null
              ? 'loading contributions…'
              : total === -1
                ? 'unable to load contributions'
                : `${total.toLocaleString()} contributions in the last 12 months`}
          </span>
          <div className="contrib-legend">
            <span>{t.projects.less}</span>
            <span className="contrib-cell" data-level="0"></span>
            <span className="contrib-cell" data-level="1"></span>
            <span className="contrib-cell" data-level="2"></span>
            <span className="contrib-cell" data-level="3"></span>
            <span className="contrib-cell" data-level="4"></span>
            <span>{t.projects.more}</span>
          </div>
        </div>
        <div className={`contrib-tooltip${tooltip ? ' active' : ''}`} style={tooltip ? { left: tooltip.left, top: tooltip.top } : undefined}>
          {tooltip?.text}
        </div>
      </div>

      <p className="projects-hint">{t.projects.hint}</p>
    </div>
  );
}
