"""Frontend glue: call the existing gTTS module. Does not change tts/."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from tts.speech_generator import generate_speech


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    payload = json.loads(sys.stdin.read() or "{}")
    audio_path = generate_speech(
        payload.get("text", ""),
        language=payload.get("language", "en"),
        output_directory=str(ROOT / "generated_audio"),
    )
    json.dump({"path": audio_path}, sys.stdout)


if __name__ == "__main__":
    main()
