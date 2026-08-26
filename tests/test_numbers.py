"""Tests for integer-to-words conversion."""

from nlp.numbers import normalize_numbers, number_to_words


def test_single_digit():
    assert number_to_words(5) == "five"


def test_hyphenated_tens():
    assert number_to_words(25) == "twenty-five"


def test_even_hundred():
    assert number_to_words(100) == "one hundred"


def test_thousands():
    assert number_to_words(1250) == "one thousand two hundred fifty"


def test_zero():
    assert number_to_words(0) == "zero"


def test_normalize_numbers_in_sentence():
    text = "I counted 5 birds and 100 trees."
    result = normalize_numbers(text)
    assert "five" in result
    assert "one hundred" in result
    assert "5" not in result
    assert "100" not in result
