"""Tests for the complete NLP pipeline."""

from nlp.pipeline import process_text

SAMPLE = "Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!"


def test_pipeline_keys_and_types():
    result = process_text(SAMPLE)
    assert set(result.keys()) == {
        "original_text",
        "processed_text",
        "sentences",
        "tokens",
        "statistics",
    }
    assert result["original_text"] == SAMPLE
    assert isinstance(result["sentences"], list)
    assert isinstance(result["tokens"], list)
    assert isinstance(result["statistics"], dict)


def test_pipeline_statistics():
    result = process_text(SAMPLE)
    stats = result["statistics"]
    assert stats["characters"] == len(SAMPLE)
    assert stats["words"] == len(SAMPLE.split())
    assert stats["sentences"] == len(result["sentences"])
    assert stats["tokens"] == len(result["tokens"])
    assert stats["sentences"] == 3


def test_sample_processed_text():
    result = process_text(SAMPLE)
    expected = (
        "Doctor Sharma bought two kilograms of apples. "
        "He paid five hundred rupees. "
        "Welcome to SpeakEasy!"
    )
    assert result["processed_text"] == expected


def test_combined_normalizations():
    result = process_text("Prof. Lee mixed 5 cm of dye & 1 kg of flour at $20.")
    processed = result["processed_text"]
    assert "Professor" in processed
    assert "five centimeters" in processed
    assert "one kilogram" in processed
    assert " and " in processed
    assert "twenty dollars" in processed
