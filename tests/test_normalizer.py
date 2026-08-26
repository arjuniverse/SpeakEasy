"""Tests for unit and symbol normalization."""

from nlp.normalizer import clean_text, normalize_symbols, normalize_units


def test_kilograms():
    assert normalize_units("2 kg") == "two kilograms"


def test_kilometers():
    assert normalize_units("10 km") == "ten kilometers"


def test_centimeters():
    assert normalize_units("5 cm") == "five centimeters"


def test_singular_unit():
    assert normalize_units("1 kg") == "one kilogram"


def test_rupee_symbol():
    assert normalize_symbols("₹500") == "five hundred rupees"


def test_dollar_symbol():
    assert normalize_symbols("$20") == "twenty dollars"


def test_percent():
    assert normalize_symbols("50%") == "fifty percent"


def test_ampersand_and_at():
    result = normalize_symbols("Ram & Sham @ home")
    assert "and" in result
    assert "at" in result
    assert "&" not in result
    assert "@" not in result


def test_clean_text_collapses_whitespace():
    assert clean_text("  hello   world \n ") == "hello world"
