import { useMemo, useState } from "react";
import NlpPreview from "../components/NlpPreview";
import VoicePanel from "../components/VoicePanel";
import { analyzeText, generateAudio, speakInBrowser } from "../api/speech";
import { processTextLocal } from "../nlp/engine";
import { useStore } from "../store";

const SAMPLE = "Dr. Sharma bought 2 kg of apples for ₹500.";

export default function QuickSpeak() {
  const { state, attachAudio, playAudio } = useStore();
  const [text, setText] = useState(SAMPLE);
  const [analysis, setAnalysis] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const live = useMemo(() => processTextLocal(text), [text]);

  async function run() {
    setBusy(true);
    setMessage("Text → NLP → speech");
    try {
      const nlp = await analyzeText(text);
      setAnalysis(nlp);
      try {
        const audio = await generateAudio(nlp.processed_text, state.voice.language);
        const demoId = "quick-speak";
        const audioId = await attachAudio(state.projects[0].id, state.projects[0].chapters[0].id, audio.blob).catch(() => null);
        if (audioId) await playAudio(audioId, "Quick Speak", nlp.processed_text.slice(0, 48));
        else {
          const { saveAudio } = await import("../lib/audio");
          await saveAudio(demoId, audio.blob);
          await playAudio(demoId, "Quick Speak", "Instant narration");
        }
        setMessage("Ready. Use the player below.");
      } catch {
        await speakInBrowser(nlp.processed_text, state.voice);
        setMessage("Played with the system voice.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">Instant</div>
        <h1>Quick Speak</h1>
        <p className="lede">One box. The pipeline does the rest.</p>
      </section>
      <div className="glass">
        <textarea className="editor" value={text} onChange={(event) => setText(event.target.value)} />
        <button className="btn accent" onClick={run} disabled={busy}>✨ Generate Speech</button>
        {message && <p className="tiny muted" style={{ marginTop: 12 }}>{message}</p>}
      </div>
      <div className="section">
        <NlpPreview analysis={analysis || live} originalFallback={text} />
      </div>
      <VoicePanel />
    </div>
  );
}
