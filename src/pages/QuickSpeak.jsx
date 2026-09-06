import { useMemo, useState } from "react";
import NlpPreview from "../components/NlpPreview";
import VoicePanel from "../components/VoicePanel";
import { analyzeText, generateAudio, speakInBrowser } from "../api/speech";
import { processTextLocal } from "../nlp/engine";
import { useStore } from "../store";

const SAMPLE = "Dr. Sharma bought 2 kg of apples for ₹500.";

export default function QuickSpeak() {
  const store = useStore();
  const [text, setText] = useState(SAMPLE);
  const [analysis, setAnalysis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const live = useMemo(() => processTextLocal(text), [text]);

  async function run() {
    if (!text.trim()) return;
    setBusy(true);
    setMessage("Text → NLP → speech");
    try {
      const nlp = await analyzeText(text);
      setAnalysis(nlp);
      try {
        const audio = await generateAudio(nlp.processed_text, store.state.voice.language);
        await store.playBlob(audio.blob, "Quick Speak", nlp.processed_text.slice(0, 72));
        setMessage(nlp.engine === "python" ? "Spoken with gTTS. Use the player below." : "Ready. Use the player below.");
      } catch {
        await speakInBrowser(nlp.processed_text, store.state.voice);
        setMessage("Played with the system voice. Start the Vite app so gTTS can save an MP3.");
      }
    } catch (error) {
      setMessage(String(error.message || error));
    } finally {
      setBusy(false);
    }
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">Instant</div>
        <h1>Quick Speak</h1>
        <p className="lede">One box. The pipeline does the rest.</p>
      </section>
      <div className="glass">
        <textarea
          className="editor"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="editor-stats">
          <span>{words} words</span>
          <span>{text.length} characters</span>
          <span>{live.statistics.sentences} sentences</span>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn accent" onClick={run} disabled={busy}>
            ✨ Generate Speech
          </button>
        </div>
        {message && <p className="tiny muted" style={{ marginTop: 12 }}>{message}</p>}
      </div>
      <div className="section">
        <NlpPreview analysis={analysis || live} originalFallback={text} />
      </div>
      <VoicePanel />
    </div>
  );
}
