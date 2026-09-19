import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Player from "./components/Player";
import Home from "./pages/Home";
import Library from "./pages/Library";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import QuickSpeak from "./pages/QuickSpeak";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import { StoreProvider } from "./store";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="app">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<NewProject />} />
            <Route path="/project/:id" element={<Workspace />} />
            <Route path="/quick" element={<QuickSpeak />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Player />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
