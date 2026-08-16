import { useRef, useState } from 'react';

interface LinkPreviewState {
  src: string;
  isVideo: boolean;
}

export function useLinkPreview() {
  const [preview, setPreview] = useState<LinkPreviewState | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const offset = 15;

  function positionAt(clientX: number, clientY: number) {
    const el = wrapRef.current;
    if (!el) return;
    const maxX = window.innerWidth - 280 - offset;
    const maxY = window.innerHeight - 160 - offset;
    el.style.left = `${Math.min(clientX + offset, maxX)}px`;
    el.style.top = `${Math.min(clientY + offset, maxY)}px`;
  }

  function bind(src?: string) {
    if (!src) return {};
    const isVideo = src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov');
    return {
      onMouseEnter: (e: React.MouseEvent) => {
        setPreview({ src, isVideo });
        // position immediately so it doesn't flash at (0,0) before the next mousemove
        requestAnimationFrame(() => positionAt(e.clientX, e.clientY));
      },
      onMouseLeave: () => setPreview(null),
      // Position imperatively via direct DOM writes instead of React state —
      // updating state on every raw mousemove re-rendered the whole app tree
      // and made the flame effect visibly lag.
      onMouseMove: (e: React.MouseEvent) => positionAt(e.clientX, e.clientY),
    };
  }

  const node = preview ? (
    <div ref={wrapRef} className="link-preview active" style={{ left: -9999, top: -9999 }}>
      {preview.isVideo ? (
        <video
          src={preview.src}
          loop
          muted
          playsInline
          style={{ display: 'block' }}
          ref={(el) => {
            // React's autoPlay attribute isn't reliably honored here — kick playback manually.
            el?.play().catch(() => {});
          }}
        />
      ) : (
        <img src={preview.src} alt="preview" style={{ display: 'block' }} />
      )}
    </div>
  ) : null;

  return { bind, node };
}
