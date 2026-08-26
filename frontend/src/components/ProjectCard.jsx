import { PROJECT_TYPES, useStore } from "../store";

export default function ProjectCard({ project }) {
  const { statsFor } = useStore();
  const type = PROJECT_TYPES.find((item) => item.id === project.type);
  const stats = statsFor(project);

  return (
    <div className="glass clickable">
      <div className="pill">{type?.glyph} {type?.label}</div>
      <h3 style={{ marginTop: 14 }}>{project.title}</h3>
      <div className="project-meta">
        <span>{stats.chapters} chapters</span>
        <span>{stats.durationLabel}</span>
        <span>{Math.round(stats.progress * 100)}% spoken</span>
      </div>
      <div className="progress" style={{ marginTop: 16 }}>
        <span style={{ width: `${Math.round(stats.progress * 100)}%` }} />
      </div>
    </div>
  );
}
