import { useEffect, useState } from "react";
import VoicePanel from "../components/VoicePanel";
import { checkBackend } from "../api/backend";
import { useStore } from "../store";

export default function Settings() {
  const { state, toggleTheme, reset } = useStore();
  const [backend, setBackend] = useState(null);

  useEffect(() => {
    checkBackend().then(setBackend);
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">Preferences</div>
        <h1>Settings</h1>
        <p className="lede">Light or dark, voice, and a quiet connection to the Python NLP + TTS pipeline.</p>
      </section>

      <div className="grid grid-2">
        <div className="glass">
          <div className="kicker">Appearance</div>
          <h3>{state.theme === "dark" ? "Dark" : "Light"} mode</h3>
          <p className="muted tiny">Matches the room. Switch anytime.</p>
          <button className="btn ghost" style={{ marginTop: 16 }} onClick={toggleTheme}>
            Use {state.theme === "dark" ? "light" : "dark"} appearance
          </button>
        </div>
        <div className="glass">
          <div className="kicker">Pipeline</div>
          <h3>{backend ? "Python connected" : backend === false ? "Preview only" : "Checking…"}</h3>
          <p className="muted tiny">
            {backend
              ? "Generate Speech uses NLTK + gTTS from the existing backend."
              : "If Python is unavailable, SpeakEasy still previews NLP locally and can speak with the system voice."}
          </p>
        </div>
      </div>

      <div className="section">
        <VoicePanel />
      </div>

      <div className="glass">
        <div className="kicker">Data</div>
        <h3>Reset local projects</h3>
        <p className="muted tiny">Clears titles, chapters, and bookmarks saved in this browser. Audio files in generated_audio/ are not deleted.</p>
        <button className="btn ghost" style={{ marginTop: 16 }} onClick={reset}>
          Restore demo project
        </button>
      </div>
    </div>
  );
}
