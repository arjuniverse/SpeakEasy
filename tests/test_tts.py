"""Tests for TTS MP3 generation."""

from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

from tts.speech_generator import generate_speech


def test_generate_speech_writes_mp3(tmp_path):
    fake_tts = MagicMock()

    def save(path):
        Path(path).write_bytes(b"ID3fake-mp3-bytes")

    fake_tts.save.side_effect = save

    with patch("tts.speech_generator.gTTS", return_value=fake_tts) as mock_gtts:
        output = generate_speech(
            "Hello from SpeakEasy",
            language="en",
            output_directory=str(tmp_path),
        )

    mock_gtts.assert_called_once()
    path = Path(output)
    assert path.exists()
    assert path.suffix == ".mp3"
    assert path.parent == tmp_path
    assert path.read_bytes().startswith(b"ID3")


def test_generate_speech_unique_filenames(tmp_path):
    fake_tts = MagicMock()
    fake_tts.save.side_effect = lambda path: Path(path).write_bytes(b"ID3")

    with patch("tts.speech_generator.gTTS", return_value=fake_tts):
        first = generate_speech("one", output_directory=str(tmp_path))
        second = generate_speech("two", output_directory=str(tmp_path))

    assert first != second
    assert Path(first).name != Path(second).name


def test_generate_speech_rejects_empty_text(tmp_path):
    with pytest.raises(ValueError):
        generate_speech("   ", output_directory=str(tmp_path))
