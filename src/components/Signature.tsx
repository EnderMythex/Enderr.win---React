const NAME = 'EnderMythex';

// Loader signature: letters are traced one at a time (0.3s → 3.2s), then a
// swoosh underline is drawn led by a glowing nib (3.2s → 3.8s).
export function Signature() {
  return (
    <svg className="signature-loader" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" aria-label={NAME}>
      <defs>
        <filter id="sig-nib-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <linearGradient id="sig-swoosh" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <text className="signature-text" x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
        {NAME.split('').map((ch, i) => (
          <tspan key={i} className="sig-letter">
            {ch}
          </tspan>
        ))}
      </text>

      <path
        id="sig-swoosh-path"
        className="sig-swoosh"
        d="M 160 128 C 260 144, 420 138, 540 124 S 630 108, 650 104"
        fill="none"
        stroke="url(#sig-swoosh)"
        strokeWidth={2}
        strokeLinecap="round"
        pathLength={1}
      />

      <g className="sig-nib">
        <circle r="7" fill="#fff" filter="url(#sig-nib-glow)" />
        <circle r="2" fill="#fff" />
        <animateMotion begin="3.2s" dur="0.6s" fill="freeze" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.65 0 0.35 1">
          <mpath href="#sig-swoosh-path" />
        </animateMotion>
      </g>
    </svg>
  );
}
