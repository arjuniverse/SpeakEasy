import { useEffect, useRef, useState } from "react";
import { useStore } from "../store";
import { downloadBlob, loadAudio } from "../lib/audio";

function stamp(seconds) {
  const value = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

export default function Player() {
  const { player, state, setVoice } = useStore();
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
          className="icon-btn play-btn"
          disabled={!player.url}
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
        <span className="tiny muted">{stamp(current)}{duration ? ` / ${stamp(duration)}` : ""}</span>
      </div>
      <div className="transport player-extras">
        <label className="tiny muted">
          Vol
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.voice.volume}
            onChange={(event) => setVoice({ volume: Number(event.target.value) })}
          />
        </label>
        <label className="tiny muted">
          {state.voice.speed.toFixed(2)}×
          <input
            type="range"
            min="0.7"
            max="1.4"
            step="0.05"
            value={state.voice.speed}
            onChange={(event) => setVoice({ speed: Number(event.target.value) })}
          />
        </label>
        <button className="btn ghost" onClick={downloadCurrent} disabled={!player.audioId}>
          Download
        </button>
      </div>
    </aside>
  );
}
