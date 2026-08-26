export async function processWithBackend(text) {
  const response = await fetch("/api/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "NLP request failed");
  return data;
}

export async function speakWithBackend(text, language = "en") {
  const response = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, language }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "TTS request failed");
  return data;
}

export async function checkBackend() {
  try {
    const response = await fetch("/api/health");
    return response.ok;
  } catch {
    return false;
  }
}
