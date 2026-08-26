"""SpeakEasy CLI: run the NLP pipeline and generate speech."""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from nlp.pipeline import process_text
from tts.speech_generator import generate_speech


BANNER = """
================================
        SPEAKEASY
    Turn Words Into Voice
================================
"""


def display_result(result, audio_path):
    stats = result["statistics"]
    print()
    print("Original text:")
    print(result["original_text"])
    print()
    print("NLP Statistics:")
    print(f"  Characters : {stats['characters']}")
    print(f"  Words      : {stats['words']}")
    print(f"  Sentences  : {stats['sentences']}")
    print(f"  Tokens     : {stats['tokens']}")
    print()
    print("Processed text:")
    print(result["processed_text"])
    print()
    print("Generated MP3:")
    print(audio_path)
    print()


def main():
    if sys.platform == "win32":
        try:
            sys.stdin.reconfigure(encoding="utf-8")
            sys.stdout.reconfigure(encoding="utf-8")
        except (AttributeError, OSError):
            pass

    print(BANNER)
    print("Enter text:")
    text = sys.stdin.readline().strip()
    if not text:
        print("No text provided. Exiting.")
        return

    result = process_text(text)
    audio_path = generate_speech(
        result["processed_text"],
        output_directory=str(PROJECT_ROOT / "generated_audio"),
    )
    display_result(result, audio_path)


if __name__ == "__main__":
    main()
