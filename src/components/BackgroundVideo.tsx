import { useEffect, useRef } from 'react';

const VIDEO_SRC = 'https://cdn.enderr.win/background-enderrwin.mp4';
// Seconds of fade from/to black at the start and end of each loop, so the
// restart is hidden behind a black frame.
const FADE_SECONDS = 1.2;

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let raf = 0;
    function tick() {
      const { currentTime, duration } = video!;
      if (duration && isFinite(duration)) {
        const fade = Math.min(FADE_SECONDS, duration / 4);
        const fromStart = currentTime / fade;
        const toEnd = (duration - currentTime) / fade;
        video!.style.opacity = String(Math.max(0, Math.min(1, fromStart, toEnd)));
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Some browsers ignore autoPlay until the muted flag is set as a property.
    video.muted = true;
    video.play().catch(() => {});

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="video-background">
      <video
        ref={videoRef}
        className="video-background-frame"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        tabIndex={-1}
        style={{ opacity: 0 }}
      />
    </div>
  );
}
