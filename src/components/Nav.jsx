import { NavLink } from "react-router-dom";
import { useStore } from "../store";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/quick", label: "Quick Speak" },
  { to: "/library", label: "Audio Library" },
  { to: "/settings", label: "Settings" },
];

export default function Nav() {
  const { state, toggleTheme } = useStore();

  return (
    <header className="nav">
      <NavLink to="/" className="brand">
        SpeakEasy
        <span>Turn Words Into Voice</span>
      </NavLink>
      <nav className="nav-links">
        {LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.to === "/"}>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
        {state.theme === "dark" ? "Light" : "Dark"}
      </button>
    </header>
  );
}
