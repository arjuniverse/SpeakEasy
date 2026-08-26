"""Convert integer numbers into English words."""

import re

ONES = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
]

TENS = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
]


def _under_one_hundred(n):
    """Convert 0-99 to words. Uses a hyphen for values like twenty-five."""
    if n < 20:
        return ONES[n]
    tens, ones = divmod(n, 10)
    if ones == 0:
        return TENS[tens]
    return f"{TENS[tens]}-{ONES[ones]}"


def _under_one_thousand(n):
    """Convert 0-999 to words."""
    if n < 100:
        return _under_one_hundred(n)
    hundreds, remainder = divmod(n, 100)
    if remainder == 0:
        return f"{ONES[hundreds]} hundred"
    return f"{ONES[hundreds]} hundred {_under_one_hundred(remainder)}"


def number_to_words(n):
    """
    Convert a non-negative integer to English words.

    Examples:
        5 -> five
        25 -> twenty-five
        100 -> one hundred
        1250 -> one thousand two hundred fifty
    """
    n = int(n)
    if n < 0:
        return "minus " + number_to_words(abs(n))
    if n < 1000:
        return _under_one_thousand(n)

    parts = []
    scales = [
        (1_000_000_000, "billion"),
        (1_000_000, "million"),
        (1_000, "thousand"),
    ]
    for value, name in scales:
        if n >= value:
            count, n = divmod(n, value)
            parts.append(f"{_under_one_thousand(count)} {name}")
    if n > 0:
        parts.append(_under_one_thousand(n))
    return " ".join(parts)


def normalize_numbers(text):
    """Replace standalone integers in text with their word form."""

    def replace_match(match):
        return number_to_words(int(match.group(0)))

    # Numbers with commas (1,250) then plain integers
    text = re.sub(r"\b\d{1,3}(?:,\d{3})+\b", lambda m: number_to_words(int(m.group(0).replace(",", ""))), text)
    text = re.sub(r"\b\d+\b", replace_match, text)
    return text
