export default function NlpPreview({ analysis, originalFallback = "" }) {
  if (!analysis) {
    return (
      <div className="glass">
        <div className="kicker">NLP Preview</div>
        <h3>Speech-ready text appears here</h3>
        <p className="muted">Write or paste a chapter to watch SpeakEasy normalize it.</p>
      </div>
    );
  }

  const original = analysis.original_text || originalFallback;
  const processed = analysis.processed_text || "";
  const stats = analysis.statistics || {};
  const flags = analysis.flags || {};

  return (
    <div className="glass">
      <div className="section-title">
        <div>
          <div className="kicker">NLP Preview</div>
          <h3>How the text will be spoken</h3>
        </div>
        <span className="pill">{analysis.engine === "python" ? "NLTK pipeline" : "Live preview"}</span>
      </div>
      <div className="nlp-pair">
        <div>
          <div className="tiny muted">Original</div>
          <p className="quote">“{original || " "}”</p>
        </div>
        <div className="nlp-arrow">↓</div>
        <div>
          <div className="tiny muted">Speech-ready</div>
          <p className="quote">“{processed || " "}”</p>
        </div>
      </div>
      <div className="stat-row" style={{ marginTop: 18 }}>
        <span>{stats.words ?? 0} words</span>
        <span>{stats.characters ?? 0} characters</span>
        <span>{stats.sentences ?? 0} sentences</span>
        <span>{stats.tokens ?? 0} tokens</span>
      </div>
      <div className="flags">
        <span className={`flag ${flags.numbers ? "" : "off"}`}>Numbers {flags.numbers ? "✓" : "—"}</span>
        <span className={`flag ${flags.abbreviations ? "" : "off"}`}>Abbreviations {flags.abbreviations ? "✓" : "—"}</span>
        <span className={`flag ${flags.units ? "" : "off"}`}>Units {flags.units ? "✓" : "—"}</span>
        <span className={`flag ${flags.symbols ? "" : "off"}`}>Symbols {flags.symbols ? "✓" : "—"}</span>
      </div>
    </div>
  );
}
