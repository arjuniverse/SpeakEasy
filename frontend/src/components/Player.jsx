import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { downloadBlob, loadAudio } from "../lib/audio";

export default function Player() {
  const { player, state } = useStore();
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.voice.volume;
    audio.playbackRate = state.voice.speed;
  }, [state.voice.volume, state.voice.speed, player.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && player.url) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [player.url]);

  async function downloadCurrent() {
    if (!player.audioId) return;
    const blob = await loadAudio(player.audioId);
    if (blob) downloadBlob(blob, `${player.title || "speakeasy"}.mp3`);
  }

  return (
    <aside className="player glass">
      <audio
        ref={audioRef}
        src={player.url || undefined}
        onTimeUpdate={(event) => {
          const el = event.currentTarget;
          setCurrent(el.currentTime);
          setDuration(el.duration || 0);
          setProgress(el.duration ? el.currentTime / el.duration : 0);
        }}
        onEnded={() => setPlaying(false)}
      />
      <div>
        <div className="player-title">{player.title}</div>
        <div className="tiny muted">{player.subtitle}</div>
      </div>
      <div className="transport">
        <button
          className="icon-btn"
          onClick={() => {
            const audio = audioRef.current;
            if (!audio) return;
            if (playing) {
              audio.pause();
              setPlaying(false);
            } else {
              audio.play();
              setPlaying(true);
            }
          }}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress || 0}
          onChange={(event) => {
            const audio = audioRef.current;
            if (!audio?.duration) return;
            audio.currentTime = Number(event.target.value) * audio.duration;
          }}
        />
        <span className="tiny muted">
          {Math.floor(current / 60)}:{String(Math.floor(current % 60)).padStart(2, "0")}
          {duration ? ` / ${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, "0")}` : ""}
        </span>
      </div>
      <div className="transport">
        <span className="tiny muted">{state.voice.speed.toFixed(2)}×</span>
        <button className="btn ghost" onClick={downloadCurrent} disabled={!player.audioId}>
          Download
        </button>
      </div>
    </aside>
  );
}
