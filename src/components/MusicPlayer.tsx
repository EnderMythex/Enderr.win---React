import { useEffect, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.08;
  }, []);

  function togglePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
    setCurrentTime(formatTime(audio.currentTime));
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = Number(e.target.value);
    setProgress(value);
    audio.currentTime = (value / 100) * audio.duration;
  }

  return (
    <div id="music-player">
      <audio
        ref={audioRef}
        src="/music/music.mp3"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setTotalTime(formatTime(audioRef.current?.duration ?? 0))}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
          setCurrentTime('0:00');
        }}
        onError={() => setErrored(true)}
      />
      <img id="player-cover" src="/pictures/music_cover.jpeg" alt="Album cover" />
      <div className="player-info">
        <span className="song-title">Pretty Cvnt (Hardstyle)</span>
        <span className="artist-name">Saibotaje</span>
      </div>
      <button id="play-pause-btn" onClick={togglePlayPause}>
        <svg viewBox="0 0 24 24" fill="white" style={{ display: playing ? 'none' : 'block' }}>
          <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
        <svg viewBox="0 0 24 24" fill="white" style={{ display: playing ? 'block' : 'none' }}>
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </button>
      <div className="progress-container">
        <span>{errored ? 'Error' : currentTime}</span>
        <input id="progress" type="range" value={progress} min={0} max={100} onChange={handleSeek} />
        <span>{errored ? 'Error' : totalTime}</span>
      </div>
    </div>
  );
}
