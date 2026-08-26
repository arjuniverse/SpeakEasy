import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECT_TYPES, useStore } from "../store";

export default function NewProject() {
  const { createProject } = useStore();
  const navigate = useNavigate();
  const [type, setType] = useState("audiobook");
  const [title, setTitle] = useState("");

  function create() {
    const id = createProject(type, title);
    navigate(`/project/${id}`);
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="kicker">New</div>
        <h1>What are you making?</h1>
      </section>
      <div className="grid grid-2">
        {PROJECT_TYPES.map((item) => (
          <button
            key={item.id}
            className="glass clickable type-tile"
            onClick={() => setType(item.id)}
            style={{ outline: type === item.id ? "2px solid var(--accent)" : "none" }}
          >
            <div className="glyph">{item.glyph}</div>
            <div>
              <h3>{item.label}</h3>
              <p className="tiny muted">{item.blurb}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="glass" style={{ marginTop: 18 }}>
        <label className="tiny muted">Title</label>
        <input
          className="field"
          placeholder="The Quiet River"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button className="btn accent" onClick={create}>Create project</button>
      </div>
    </div>
  );
}
