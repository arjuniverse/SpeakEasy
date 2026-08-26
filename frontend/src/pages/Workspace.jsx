import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NlpPreview from "../components/NlpPreview";
import VoicePanel from "../components/VoicePanel";
import { analyzeText, generateAudio, speakInBrowser } from "../api/speech";
import { downloadBlob, loadAudio } from "../lib/audio";
import { estimateDurationSeconds, formatDuration, processTextLocal } from "../nlp/engine";
import { PROJECT_TYPES, useStore } from "../store";

export default function Workspace() {
  const { id } = useParams();
  const store = useStore();
  const project = store.state.projects.find((item) => item.id === id);
  const [chapterId, setChapterId] = useState(project?.chapters[0]?.id);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [bookmarkNote, setBookmarkNote] = useState("Important scene");
  const [bookmarkTime, setBookmarkTime] = useState("12:42");

  useEffect(() => {
    if (project) {
      store.touch(project.id);
      setChapterId((current) => project.chapters.some((chapter) => chapter.id === current)
        ? current
        : project.chapters[0]?.id);
    }
  }, [id]);

  const chapter = project?.chapters.find((item) => item.id === chapterId);
  const live = useMemo(() => processTextLocal(chapter?.text || ""), [chapter?.text]);
  const analysis = chapter?.stats ? { ...chapter.stats, flags: live.flags, original_text: chapter.text, processed_text: chapter.processed || live.processed_text, engine: chapter.engine } : live;
  const stats = project ? store.statsFor(project) : null;
  const type = PROJECT_TYPES.find((item) => item.id === project?.type);
  const words = chapter?.text.trim() ? chapter.text.trim().split(/\s+/).length : 0;

  if (!project) {
    return (
      <div className="page">
        <div className="glass empty">This project is gone. <Link to="/projects">Back to projects</Link></div>
      </div>
    );
  }

  async function generate() {
    if (!chapter?.text.trim()) return;
    setBusy(true);
    setMessage("Running NLP, then generating speech…");
    try {
      const nlp = await analyzeText(chapter.text);
      store.updateChapter(project.id, chapter.id, {
        processed: nlp.processed_text,
        stats: nlp,
        engine: nlp.engine,
        status: "ready",
      });
      try {
        const audio = await generateAudio(nlp.processed_text, store.state.voice.language);
        const audioId = await store.attachAudio(project.id, chapter.id, audio.blob, {
          processed: nlp.processed_text,
          stats: nlp,
          engine: nlp.engine,
          duration: estimateDurationSeconds(nlp.statistics.words),
        });
        await store.playAudio(audioId, chapter.title, project.title);
        setMessage("Spoken with gTTS.");
      } catch {
        await speakInBrowser(nlp.processed_text, store.state.voice);
        setMessage("Played with the system voice. gTTS needs the Python bridge.");
      }
    } catch (error) {
      setMessage(String(error.message || error));
    } finally {
      setBusy(false);
    }
  }

  async function compile() {
    setBusy(true);
    setMessage("Compiling chapters…");
    try {
      const audioId = await store.compileProject(project.id);
      await store.playAudio(audioId, project.title, "Compiled audiobook");
      setMessage("Audiobook compiled. You can export it now.");
    } catch (error) {
      setMessage(String(error.message || error));
    } finally {
      setBusy(false);
    }
  }

  async function exportAudio() {
    const audioId = project.compiledAudioId || chapter?.audioId;
    if (!audioId) {
      setMessage("Generate or compile audio first.");
      return;
    }
    const blob = await loadAudio(audioId);
    downloadBlob(blob, `${project.title}.mp3`);
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">{type?.glyph} {type?.label}</div>
        <input
          className="field"
          style={{ fontSize: 42, fontWeight: 650, letterSpacing: "-0.045em", background: "transparent", paddingLeft: 0 }}
          value={project.title}
          onChange={(event) => store.renameProject(project.id, event.target.value)}
        />
      </section>

      <div className="grid grid-4 section">
        <div className="glass insight"><div className="tiny muted">Total words</div><h2>{stats.words}</h2></div>
        <div className="glass insight"><div className="tiny muted">Chapters</div><h2>{stats.chapters}</h2></div>
        <div className="glass insight"><div className="tiny muted">Estimated duration</div><h2>{stats.durationLabel}</h2></div>
        <div className="glass insight"><div className="tiny muted">Characters</div><h2>{stats.characters}</h2></div>
      </div>

      <div className="workspace">
        <aside className="glass">
          <div className="section-title">
            <h3>Chapters</h3>
            <button className="tiny" onClick={() => {
              const next = store.addChapter(project.id);
              setChapterId(next);
            }}>+ Add</button>
          </div>
          <div className="chapter-list">
            {project.chapters.map((item, index) => (
              <div key={item.id} className={`chapter-item ${item.id === chapterId ? "active" : ""}`}>
                <button onClick={() => setChapterId(item.id)} style={{ textAlign: "left" }}>
                  <div>{item.title || `Chapter ${index + 1}`}</div>
                  <div className={`status ${item.status === "spoken" ? "done" : ""}`}>{item.status}</div>
                </button>
                <div>
                  <button className="tiny" onClick={() => store.moveChapter(project.id, item.id, -1)}>↑</button>
                  <button className="tiny" onClick={() => store.moveChapter(project.id, item.id, 1)}>↓</button>
                </div>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn ghost" onClick={compile} disabled={busy}>Compile</button>
            <button className="btn" onClick={exportAudio}>Export</button>
          </div>
        </aside>

        <div className="grid">
          <div className="glass">
            <input
              className="field"
              value={chapter?.title || ""}
              onChange={(event) => store.updateChapter(project.id, chapter.id, { title: event.target.value })}
            />
            <textarea
              className="editor"
              placeholder="Write or paste the chapter…"
              value={chapter?.text || ""}
              onChange={(event) => store.updateChapter(project.id, chapter.id, { text: event.target.value })}
            />
            <div className="editor-stats">
              <span>{words} words</span>
              <span>{chapter?.text.length || 0} characters</span>
              <span>{live.statistics.sentences} sentences</span>
              <span>{formatDuration(estimateDurationSeconds(words))} estimated</span>
            </div>
            <div className="row" style={{ marginTop: 16 }}>
              <button className="btn accent" onClick={generate} disabled={busy}>
                ✨ Generate Speech
              </button>
              {chapter?.audioId && (
                <button className="btn ghost" onClick={() => store.playAudio(chapter.audioId, chapter.title, project.title)}>
                  Listen
                </button>
              )}
            </div>
            {message && <p className="tiny muted" style={{ marginTop: 12 }}>{message}</p>}
          </div>
          <NlpPreview analysis={analysis} originalFallback={chapter?.text} />
          <VoicePanel />
          <div className="glass">
            <div className="kicker">Bookmarks</div>
            <h3>Remember a moment</h3>
            <div className="row">
              <input className="field" value={bookmarkTime} onChange={(event) => setBookmarkTime(event.target.value)} />
              <input className="field" value={bookmarkNote} onChange={(event) => setBookmarkNote(event.target.value)} />
              <button
                className="btn ghost"
                onClick={() => store.addBookmark(project.id, {
                  time: bookmarkTime,
                  note: bookmarkNote,
                  chapter: chapter?.title,
                })}
              >
                Save
              </button>
            </div>
            {project.bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bookmark">
                <strong>{bookmark.time} — {bookmark.note}</strong>
                <span className="tiny muted">{bookmark.chapter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
