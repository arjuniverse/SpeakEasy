"""Tests for abbreviation expansion from the corpus CSV."""

from nlp.abbreviations import expand_abbreviations


def test_doctor_expansion():
    assert "Doctor" in expand_abbreviations("Dr. Sharma arrived.")


def test_common_titles():
    text = "Mr. and Mrs. Smith met Prof. Rao."
    result = expand_abbreviations(text)
    assert "Mister" in result
    assert "Missus" in result
    assert "Professor" in result


def test_etcetera():
    result = expand_abbreviations("Bring pens, books, etc.")
    assert "et cetera" in result


def test_does_not_expand_drive():
    result = expand_abbreviations("Drive safely.")
    assert result == "Drive safely."
