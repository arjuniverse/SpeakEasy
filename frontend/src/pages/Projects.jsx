import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { useStore } from "../store";

export default function Projects() {
  const { state } = useStore();
  const projects = [...state.projects].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">Library</div>
        <h1>Projects</h1>
        <p className="lede">Audiobooks, podcasts, and study notes — each one a glass tile you can pick up again.</p>
        <div className="row" style={{ marginTop: 24 }}>
          <Link className="btn accent" to="/projects/new">+ New Project</Link>
        </div>
      </section>
      {projects.length === 0 ? (
        <div className="glass empty">Nothing here yet. Start with a new project.</div>
      ) : (
        <div className="grid grid-3">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`}>
              <ProjectCard project={project} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
