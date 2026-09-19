import { detectTransforms, processTextLocal } from "../nlp/engine";
import { processWithBackend, speakWithBackend } from "./backend";
import { base64ToBlob } from "../lib/audio";

export async function analyzeText(text) {
  try {
    const result = await processWithBackend(text);
    return {
      ...result,
      flags: detectTransforms(text),
      engine: result.engine || "python",
    };
  } catch {
    return processTextLocal(text);
  }
}

export async function generateAudio(processedText, language) {
  const result = await speakWithBackend(processedText, toGttsLanguage(language));
  return {
    blob: base64ToBlob(result.audioBase64, result.mime || "audio/mpeg"),
    path: result.path,
    engine: "python",
  };
}

function toGttsLanguage(language) {
  const map = { en: "en", "en-uk": "en-uk", hi: "hi", es: "es", fr: "fr" };
  return map[language] || "en";
}

export function speakInBrowser(text, voiceSettings) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("Speech synthesis is not available."));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceSettings.locale || "en-US";
    utterance.rate = voiceSettings.speed || 1;
    utterance.pitch = voiceSettings.pitch || 1;
    utterance.volume = voiceSettings.volume ?? 1;
    const voices = window.speechSynthesis.getVoices();
    const selected = voices.find((voice) => voice.name === voiceSettings.voice);
    if (selected) utterance.voice = selected;
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event.error || new Error("Speech failed"));
    window.speechSynthesis.speak(utterance);
  });
}
