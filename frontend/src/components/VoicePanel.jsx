import { useEffect, useState } from "react";
import { useStore } from "../store";

const LANGUAGES = [
  { id: "en", locale: "en-US", label: "English (US)" },
  { id: "en-uk", locale: "en-GB", label: "English (UK)" },
  { id: "hi", locale: "hi-IN", label: "Hindi" },
  { id: "es", locale: "es-ES", label: "Spanish" },
  { id: "fr", locale: "fr-FR", label: "French" },
];

export default function VoicePanel() {
  const { state, setVoice } = useStore();
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices() || []);
    load();
    window.speechSynthesis?.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", load);
  }, []);

  return (
    <div className="glass controls">
      <div className="kicker">Voice</div>
      <h3>How it should sound</h3>
      <label>Language</label>
      <select
        value={state.voice.language}
        onChange={(event) => {
          const next = LANGUAGES.find((item) => item.id === event.target.value);
          setVoice({ language: next.id, locale: next.locale });
        }}
      >
        {LANGUAGES.map((item) => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
      <label>Voice</label>
      <select
        value={state.voice.voice}
        onChange={(event) => setVoice({ voice: event.target.value })}
      >
        <option value="">System default</option>
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
      <label>Speed {state.voice.speed.toFixed(2)}×</label>
      <input
        type="range"
        min="0.7"
        max="1.4"
        step="0.05"
        value={state.voice.speed}
        onChange={(event) => setVoice({ speed: Number(event.target.value) })}
      />
      <label>Pitch {state.voice.pitch.toFixed(2)}</label>
      <input
        type="range"
        min="0.7"
        max="1.4"
        step="0.05"
        value={state.voice.pitch}
        onChange={(event) => setVoice({ pitch: Number(event.target.value) })}
      />
      <label>Volume {Math.round(state.voice.volume * 100)}%</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={state.voice.volume}
        onChange={(event) => setVoice({ volume: Number(event.target.value) })}
      />
    </div>
  );
}
