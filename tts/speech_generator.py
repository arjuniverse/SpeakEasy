"""Convert processed text into spoken audio with gTTS."""

import uuid
from pathlib import Path

from gtts import gTTS


def generate_speech(text, language="en", output_directory="generated_audio"):
    """
    Convert text to an MP3 file and return the saved file path.

    The NLP pipeline is intentionally not imported here so TTS stays independent.
    """
    if text is None or not str(text).strip():
        raise ValueError("Cannot generate speech from empty text.")

    output_dir = Path(output_directory)
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = f"speakeasy_{uuid.uuid4().hex}.mp3"
    output_path = output_dir / filename

    speech = gTTS(text=str(text).strip(), lang=language)
    speech.save(str(output_path))

    return str(output_path)
