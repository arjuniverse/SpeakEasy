import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { PROJECT_TYPES, useStore } from "../store";

export default function Home() {
  const { state } = useStore();
  const recent = [...state.projects].sort((a, b) => b.updatedAt - a.updatedAt);
  const current = recent.find((project) => project.id === state.lastProjectId) || recent[0];

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">SpeakEasy</div>
        <h1>Turn Words<br />Into Voice.</h1>
        <p className="lede">
          Write a chapter. Watch the NLP pipeline make it speech-ready. Then listen —
          one calm, clear voice at a time.
        </p>
        <div className="row" style={{ marginTop: 28 }}>
          <Link className="btn accent" to="/projects/new">+ New Project</Link>
          <Link className="btn ghost" to="/quick">Quick Speak</Link>
        </div>
      </section>

      {current && (
        <section className="section">
          <div className="section-title">
            <h2>Continue creating</h2>
            <Link className="tiny" to={`/project/${current.id}`}>Open</Link>
          </div>
          <Link to={`/project/${current.id}`}>
            <ProjectCard project={current} />
          </Link>
        </section>
      )}

      <section className="section">
        <div className="section-title">
          <h2>Recent projects</h2>
          <Link className="tiny" to="/projects">View all</Link>
        </div>
        <div className="grid grid-3">
          {recent.slice(0, 6).map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Quick Speak</h2>
        </div>
        <Link to="/quick" className="glass clickable" style={{ display: "block" }}>
          <h3>Text → NLP → Voice</h3>
          <p className="muted">Paste a sentence, see the speech-ready version, and play it instantly.</p>
        </Link>
      </section>

      <section className="section">
        <div className="grid grid-4">
          {PROJECT_TYPES.map((type) => (
            <Link key={type.id} to={`/projects/new?type=${type.id}`} className="glass clickable type-tile">
              <div className="glyph">{type.glyph}</div>
              <div>
                <h3>{type.label}</h3>
                <p className="tiny muted">{type.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
