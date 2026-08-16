import { useEffect, useRef, useState } from 'react';
import { Grid } from '@/components/canvasui/Grid';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ProjectsView } from '@/components/ProjectsView';
import { StatsView } from '@/components/StatsView';
import { useLinkPreview } from '@/components/LinkPreview';
import { getInitialLang, LANGS, LANG_LABELS, translations, type Lang } from '@/lib/i18n';
import './App.css';

type ViewName = 'projects' | 'stats';

function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [activeView, setActiveView] = useState<ViewName | null>(null);
  const [viewOpacity, setViewOpacity] = useState(0);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const [panelsClose, setPanelsClose] = useState(false);
  const [hideSignature, setHideSignature] = useState(false);
  const { bind: bindPreview, node: previewNode } = useLinkPreview();

  const t = translations[lang];
  const year = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => setPanelsOpen(true), 4200);
    return () => clearTimeout(timer);
  }, []);

  function openView(name: ViewName) {
    setPanelsOpen(false);
    setHideSignature(true);
    setPanelsClose(true);
    setTimeout(() => {
      setActiveView(name);
      setTimeout(() => setViewOpacity(1), 50);
    }, 2000);
  }

  function closeView() {
    setViewOpacity(0);
    setHideSignature(true);
    setTimeout(() => {
      setActiveView(null);
      setPanelsClose(false);
      setPanelsOpen(true);
    }, 300);
  }

  const activeViewRef = useRef(activeView);
  activeViewRef.current = activeView;

  useEffect(() => {
    if (!activeView) return;

    function onDocClick(e: MouseEvent) {
      const target = e.target as Element;
      if (activeViewRef.current === 'projects') {
        if (target.closest('.projects-arrows') || target.closest('.github-card') || target.closest('#projectsBtn')) return;
        closeView();
      } else if (activeViewRef.current === 'stats') {
        if (target.closest('.stats-columns') || target.closest('#statsBtn')) return;
        closeView();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activeViewRef.current === 'stats') closeView();
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeView]);

  const loaderClass = [
    panelsOpen ? 'panels-open' : '',
    panelsClose ? 'panels-close' : '',
    hideSignature ? 'hide-signature' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <Grid tileSize={60} tint={[0.05, 0.05, 0.05]} tintStrength={0.85} amplitude={2} liftHeight={40}>
        <div className="site-root">
          <BackgroundVideo />

          <div className="top-bar" />

          <div className="wrapper">
            <p className="sub-title">enderr.win</p>
            <h1>EnderMythex</h1>
            <p className="description" dangerouslySetInnerHTML={{ __html: t.description }} />

            <div id="links">
              <a href="https://x.com/Endermythex_" target="_blank" rel="noreferrer" {...bindPreview('/pictures/x.png')}>
                {t.links.twitter}
              </a>
              <a href="https://discord.enderr.win/" target="_blank" rel="noreferrer" {...bindPreview('/pictures/discord.png')}>
                {t.links.discord}
              </a>
              <a href="https://axiom.trade/@ender0x" target="_blank" rel="noreferrer" {...bindPreview('/videos/axiom.mp4')}>
                {t.links.axiom}
              </a>
              <a href="https://invoapp.com/join/endermythex" target="_blank" rel="noreferrer">
                {t.links.invo}
              </a>
              <a href="https://status.enderr.win/" target="_blank" rel="noreferrer">
                {t.links.status}
              </a>
              <a
                href="#"
                id="projectsBtn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openView('projects');
                }}
              >
                {t.links.projects}
              </a>
              <a
                href="#"
                id="statsBtn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openView('stats');
                }}
              >
                {t.links.stats}
              </a>
              <a href="mailto:endermythex@enderr.win">{t.links.email}</a>
            </div>

            <div className="footer">
              <div className="footer-left">
                <div className="langs">
                  {LANGS.map((l) => (
                    <span
                      key={l}
                      className={`lang-btn${lang === l ? ' active' : ''}`}
                      onClick={() => setLang(l)}
                    >
                      {LANG_LABELS[l]}
                    </span>
                  ))}
                </div>
                <p>{t.copy.replace('{year}', String(year))}</p>
              </div>
              <MusicPlayer />
            </div>
          </div>

          <div className="bottom-bar" />

          <ProjectsView active={activeView === 'projects'} opacity={viewOpacity} t={t} />
          <StatsView active={activeView === 'stats'} opacity={viewOpacity} t={t} />

          {previewNode}
        </div>
      </Grid>

      <div id="loader-container" className={loaderClass}>
        <div id="panel-top" className="loader-panel" />
        <div id="panel-bottom" className="loader-panel" />
        <svg className="signature-loader" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
          <text className="signature-text" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
            {'EnderMythex'.split('').map((ch, i) => (
              <tspan key={i} className="sig-letter">
                {ch}
              </tspan>
            ))}
          </text>
          <line className="signature-underline" x1="20%" y1="120" x2="80%" y2="120" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

export default App;
