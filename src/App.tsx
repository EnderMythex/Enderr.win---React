import { useEffect, useRef, useState } from 'react';
import { Magnify, supportsHtmlInCanvas } from '@/components/canvasui/Magnify';
import { Grid } from '@/components/canvasui/Grid';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ProjectsView } from '@/components/ProjectsView';
import { TradingView } from '@/components/TradingView';
import { Signature } from '@/components/Signature';
import { useLinkPreview } from '@/components/LinkPreview';
import { getInitialLang, LANGS, LANG_LABELS, translations, type Lang } from '@/lib/i18n';
import './App.css';

type ViewName = 'projects' | 'trading';

function App() {
  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [activeView, setActiveView] = useState<ViewName | null>(null);
  const [viewOpacity, setViewOpacity] = useState(0);
  const [panelsOpen, setPanelsOpen] = useState(false);
  const [panelsClose, setPanelsClose] = useState(false);
  const [hideSignature, setHideSignature] = useState(false);
  const { bind: bindPreview, node: previewNode } = useLinkPreview();
  const [magnifySupported, setMagnifySupported] = useState(false);

  const t = translations[lang];
  const year = new Date().getFullYear();

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    // Magnify's actual zoom only renders through the experimental
    // html-in-canvas API — with it disabled (the default everywhere) the
    // component falls back to a bare HUD readout with no lens. Skip
    // wrapping in it entirely for visitors who don't have the flag on.
    setMagnifySupported(supportsHtmlInCanvas());
  }, []);

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
        if (target.closest('.projects-grid') || target.closest('.github-card') || target.closest('#projectsBtn')) return;
        closeView();
      } else if (activeViewRef.current === 'trading') {
        if (target.closest('.trading-columns') || target.closest('.trading-lightbox') || target.closest('#tradingBtn')) return;
        closeView();
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && activeViewRef.current === 'trading') closeView();
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

  const content = (
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
            id="tradingBtn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openView('trading');
            }}
          >
            {t.links.trading}
          </a>
          <a href="mailto:endermythex@enderr.win">{t.links.email}</a>
        </div>

        <div className="footer">
          <div className="footer-left">
            <div className="langs">
              {LANGS.map((l) => (
                <span key={l} className={`lang-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
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
      <TradingView active={activeView === 'trading'} opacity={viewOpacity} t={t} />

      {previewNode}
    </div>
  );

  const withMagnify = magnifySupported ? (
    <Magnify
      zoomModifier="shift"
      size={64}
      zoom={1.5}
      follow={0.25}
      hud={0.8}
      aberration={0.8}
      haze={0.2}
      rippleSpeed={900}
      rippleWidth={2}
      rippleBendWidth={100}
      rippleBend={20}
      rippleGlow={1}
      ring={false}
      crosshair={false}
      ticks={false}
      brackets={false}
      dot={false}
      grid={false}
      readout
      ripples={false}
      scrollZoom={false}
      color={[0.8, 0.8, 0.8]}
    >
      {content}
    </Magnify>
  ) : (
    content
  );

  return (
    <>
      <Grid tileSize={60} tint={[0.05, 0.05, 0.05]} tintStrength={0.85} amplitude={2} liftHeight={40} tileOpacity={0} edgeGlow={0.35}>
        {withMagnify}
      </Grid>

      <div id="loader-container" className={loaderClass}>
        <div id="panel-top" className="loader-panel" />
        <div id="panel-bottom" className="loader-panel" />
        <Signature />
      </div>
    </>
  );
}

export default App;
