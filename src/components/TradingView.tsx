import { useEffect, useState } from 'react';
import type { Translation } from '@/lib/i18n';

interface TradingViewProps {
  active: boolean;
  opacity: number;
  t: Translation;
}

interface DeployedCoin {
  name: string;
  ca: string;
  twitter: string;
  cards: string[];
}

const COINS: DeployedCoin[] = [
  {
    name: 'Posynt',
    ca: '8bkmfVXUycaEQvwUWbeczZ6KK285b1ebDzUX7bFkpump',
    twitter: 'https://x.com/posynt_sol',
    cards: ['/pnl/posynt/7wvj94n.png', '/pnl/posynt/3tnf6bf.png', '/pnl/posynt/4wh6q1x.png'],
  },
  {
    name: 'Voicer',
    ca: '2Mt3EPdaXSNdAWRngFKNqF9w2Pg3PbMGRbAXAEHCpump',
    twitter: 'https://x.com/voicerpad',
    cards: ['/pnl/voicerpad/h9mb1b7.png', '/pnl/voicerpad/9mf2hb3.png', '/pnl/voicerpad/9fjxbp4.png'],
  },
];

function shortCa(ca: string) {
  return `${ca.slice(0, 4)}…${ca.slice(-4)}`;
}

export function TradingView({ active, opacity, t }: TradingViewProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState<string | null>(null);

  useEffect(() => {
    if (!active) setZoomed(null);
  }, [active]);

  function copyCa(ca: string) {
    navigator.clipboard?.writeText(ca).then(() => {
      setCopied(ca);
      setTimeout(() => setCopied((c) => (c === ca ? null : c)), 1500);
    });
  }

  return (
    <div id="trading-view" className={active ? 'active' : ''} style={{ opacity }}>
      <div className="trading-columns">
        {COINS.map((coin) => (
          <div key={coin.ca} className="trading-coin">
            <div className="trading-coin-head">
              <h2 className="trading-coin-title">{coin.name}</h2>
              <div className="trading-coin-links">
                <a href={coin.twitter} target="_blank" rel="noreferrer">
                  twitter
                </a>
                <a href={`https://dexscreener.com/solana/${coin.ca}`} target="_blank" rel="noreferrer">
                  chart
                </a>
              </div>
            </div>
            <button type="button" className="trading-ca" onClick={() => copyCa(coin.ca)} title={coin.ca}>
              <span className="trading-ca-label">CA</span>
              <span className="trading-ca-value">{shortCa(coin.ca)}</span>
              <span className="trading-ca-action">{copied === coin.ca ? t.trading.copied : t.trading.copy}</span>
            </button>
            <p className="trading-cards-label">{t.trading.cards}</p>
            <div className="trading-cards">
              {coin.cards.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={`${coin.name} PnL card`}
                  loading="lazy"
                  className="trading-card"
                  onClick={() => setZoomed(src)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="trading-hint">{t.trading.hint}</p>

      {zoomed ? (
        <div className="trading-lightbox" onClick={() => setZoomed(null)}>
          <img src={zoomed} alt="PnL card" />
        </div>
      ) : null}
    </div>
  );
}
