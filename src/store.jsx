import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { estimateDurationSeconds, formatDuration } from "./nlp/engine";
import { concatMp3Blobs, deleteAudio, loadAudio, saveAudio } from "./lib/audio";

const KEY = "speakeasy.ui.v1";
const StoreContext = createContext(null);

export const PROJECT_TYPES = [
  { id: "audiobook", label: "Audiobook", glyph: "📖", blurb: "Chapters, narration, one finished book." },
  { id: "podcast", label: "Podcast", glyph: "🎙️", blurb: "Episodes with a spoken through-line." },
  { id: "study", label: "Study Material", glyph: "📚", blurb: "Notes that read themselves back to you." },
  { id: "custom", label: "Custom Project", glyph: "📝", blurb: "Any text you want turned into voice." },
];

const DEMO_TEXT = "Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!";

function uid() {
  return crypto.randomUUID();
}

function seed() {
  const chapterId = uid();
  const projectId = uid();
  return {
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    lastProjectId: projectId,
    voice: {
      language: "en",
      locale: "en-US",
      voice: "",
      speed: 1,
      pitch: 1,
      volume: 1,
    },
    projects: [
      {
        id: projectId,
        type: "audiobook",
        title: "Welcome to SpeakEasy",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        compiledAudioId: null,
        chapters: [
          {
            id: chapterId,
            title: "Opening",
            text: DEMO_TEXT,
            processed: "",
            stats: null,
            status: "ready",
            audioId: null,
            duration: 0,
          },
        ],
        bookmarks: [],
      },
    ],
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.projects) return saved;
  } catch {
    /* ignore */
  }
  return seed();
}

function projectStats(project) {
  const words = project.chapters.reduce((sum, chapter) => {
    const count = chapter.text.trim() ? chapter.text.trim().split(/\s+/).length : 0;
    return sum + count;
  }, 0);
  const characters = project.chapters.reduce((sum, chapter) => sum + chapter.text.length, 0);
  const spoken = project.chapters.filter((chapter) => chapter.status === "spoken").length;
  const duration = estimateDurationSeconds(words);
  return {
    words,
    characters,
    chapters: project.chapters.length,
    spoken,
    duration,
    durationLabel: formatDuration(duration),
    progress: project.chapters.length ? spoken / project.chapters.length : 0,
  };
}

export function StoreProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [player, setPlayer] = useState({
    title: "Nothing playing",
    subtitle: "Generate a chapter to begin",
    audioId: null,
    url: null,
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.dataset.theme = state.theme;
  }, [state]);

  const api = useMemo(() => {
    const update = (mutator) => setState((current) => mutator({ ...current }));

    return {
      state,
      player,
      setPlayer,
      statsFor: projectStats,
      toggleTheme() {
        update((current) => ({
          ...current,
          theme: current.theme === "dark" ? "light" : "dark",
        }));
      },
      setVoice(partial) {
        update((current) => ({
          ...current,
          voice: { ...current.voice, ...partial },
        }));
      },
      createProject(type, title) {
        const project = {
          id: uid(),
          type,
          title: title.trim() || `Untitled ${type}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          compiledAudioId: null,
          chapters: [
            {
              id: uid(),
              title: type === "podcast" ? "Episode 1" : "Chapter 1",
              text: "",
              processed: "",
              stats: null,
              status: "draft",
              audioId: null,
              duration: 0,
            },
          ],
          bookmarks: [],
        };
        update((current) => ({
          ...current,
          lastProjectId: project.id,
          projects: [project, ...current.projects],
        }));
        return project.id;
      },
      touch(projectId) {
        update((current) => ({
          ...current,
          lastProjectId: projectId,
          projects: current.projects.map((project) =>
            project.id === projectId ? { ...project, updatedAt: Date.now() } : project,
          ),
        }));
      },
      renameProject(projectId, title) {
        update((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId ? { ...project, title, updatedAt: Date.now() } : project,
          ),
        }));
      },
      addChapter(projectId) {
        const chapter = {
          id: uid(),
          title: "New chapter",
          text: "",
          processed: "",
          stats: null,
          status: "draft",
          audioId: null,
          duration: 0,
        };
        update((current) => ({
          ...current,
          lastProjectId: projectId,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? { ...project, updatedAt: Date.now(), chapters: [...project.chapters, chapter] }
              : project,
          ),
        }));
        return chapter.id;
      },
      updateChapter(projectId, chapterId, patch) {
        update((current) => ({
          ...current,
          projects: current.projects.map((project) => {
            if (project.id !== projectId) return project;
            return {
              ...project,
              updatedAt: Date.now(),
              chapters: project.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? {
                      ...chapter,
                      ...patch,
                      status:
                        patch.status ||
                        (patch.audioId ? "spoken" : (patch.text ?? chapter.text).trim() ? "ready" : "draft"),
                    }
                  : chapter,
              ),
            };
          }),
        }));
      },
      moveChapter(projectId, chapterId, direction) {
        update((current) => ({
          ...current,
          projects: current.projects.map((project) => {
            if (project.id !== projectId) return project;
            const chapters = [...project.chapters];
            const index = chapters.findIndex((chapter) => chapter.id === chapterId);
            const next = index + direction;
            if (index < 0 || next < 0 || next >= chapters.length) return project;
            [chapters[index], chapters[next]] = [chapters[next], chapters[index]];
            return { ...project, chapters, updatedAt: Date.now() };
          }),
        }));
      },
      addBookmark(projectId, bookmark) {
        update((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  bookmarks: [{ id: uid(), createdAt: Date.now(), ...bookmark }, ...project.bookmarks],
                }
              : project,
          ),
        }));
      },
      async attachAudio(projectId, chapterId, blob, extra = {}) {
        const audioId = uid();
        await saveAudio(audioId, blob);
        update((current) => ({
          ...current,
          projects: current.projects.map((project) => {
            if (project.id !== projectId) return project;
            return {
              ...project,
              updatedAt: Date.now(),
              chapters: project.chapters.map((chapter) =>
                chapter.id === chapterId
                  ? { ...chapter, ...extra, audioId, status: "spoken" }
                  : chapter,
              ),
            };
          }),
        }));
        return audioId;
      },
      async playBlob(blob, title, subtitle) {
        const audioId = uid();
        await saveAudio(audioId, blob);
        if (player.url) URL.revokeObjectURL(player.url);
        const url = URL.createObjectURL(blob);
        setPlayer({ title, subtitle, audioId, url });
        return audioId;
      },
      async playAudio(audioId, title, subtitle) {
        const blob = await loadAudio(audioId);
        if (!blob) return;
        if (player.url) URL.revokeObjectURL(player.url);
        const url = URL.createObjectURL(blob);
        setPlayer({ title, subtitle, audioId, url });
      },
      async compileProject(projectId) {
        const project = state.projects.find((item) => item.id === projectId);
        const blobs = [];
        for (const chapter of project.chapters) {
          if (!chapter.audioId) continue;
          const blob = await loadAudio(chapter.audioId);
          if (blob) blobs.push(blob);
        }
        if (!blobs.length) throw new Error("Generate at least one chapter first.");
        const compiled = await concatMp3Blobs(blobs);
        const audioId = uid();
        await saveAudio(audioId, compiled);
        update((current) => ({
          ...current,
          projects: current.projects.map((item) =>
            item.id === projectId ? { ...item, compiledAudioId: audioId, updatedAt: Date.now() } : item,
          ),
        }));
        return audioId;
      },
      reset() {
        localStorage.removeItem(KEY);
        setState(seed());
      },
    };
  }, [state, player.url]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

export { formatDuration, estimateDurationSeconds, deleteAudio, loadAudio };
