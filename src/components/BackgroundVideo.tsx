const YOUTUBE_ID = 'Rh-PG5Ac7Cg';

export function BackgroundVideo() {
  return (
    <div className="video-background">
      <iframe
        className="video-background-frame"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&playsinline=1`}
        title="background"
        allow="autoplay; encrypted-media"
        frameBorder={0}
        tabIndex={-1}
      />
    </div>
  );
}
