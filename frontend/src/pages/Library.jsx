import { Link } from "react-router-dom";
import { downloadBlob, loadAudio } from "../lib/audio";
import { PROJECT_TYPES, formatDuration, useStore } from "../store";

export default function Library() {
  const { state, statsFor, playAudio } = useStore();

  const items = [];
  for (const project of state.projects) {
    const type = PROJECT_TYPES.find((item) => item.id === project.type);
    if (project.compiledAudioId) {
      items.push({
        id: project.compiledAudioId,
        title: project.title,
        subtitle: "Compiled audiobook",
        meta: type?.label,
        projectId: project.id,
        kind: "book",
      });
    }
    project.chapters.forEach((chapter, index) => {
      if (!chapter.audioId) return;
      items.push({
        id: chapter.audioId,
        title: chapter.title || `Chapter ${index + 1}`,
        subtitle: project.title,
        meta: formatDuration(chapter.duration || statsFor(project).duration),
        projectId: project.id,
        kind: "chapter",
      });
    });
  }

  async function download(item) {
    const blob = await loadAudio(item.id);
    if (blob) downloadBlob(blob, `${item.title}.mp3`);
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">Listening</div>
        <h1>Audio Library</h1>
        <p className="lede">Every chapter and compiled book you have spoken lives here, ready to play or take with you.</p>
      </section>

      {items.length === 0 ? (
        <div className="glass empty">
          Nothing spoken yet. Open a project, generate speech, and it will appear here.
          <div style={{ marginTop: 16 }}>
            <Link className="btn accent" to="/projects">Go to projects</Link>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="glass library-row">
              <div>
                <div className="pill">{item.kind === "book" ? "Audiobook" : "Chapter"}</div>
                <h3 style={{ marginTop: 12 }}>{item.title}</h3>
                <p className="tiny muted">{item.subtitle} · {item.meta}</p>
              </div>
              <div className="row">
                <button className="btn ghost" onClick={() => playAudio(item.id, item.title, item.subtitle)}>
                  Play
                </button>
                <button className="btn" onClick={() => download(item)}>Download</button>
                <Link className="btn ghost" to={`/project/${item.projectId}`}>Open</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
