"""Text cleaning, unit expansion, and symbol normalization."""

import csv
import re
from pathlib import Path

from nlp.numbers import number_to_words

CORPUS_DIR = Path(__file__).resolve().parent.parent / "corpus"


def clean_text(text):
    """Normalize whitespace so later steps can match phrases reliably."""
    if text is None:
        return ""
    text = text.replace("\u00a0", " ")
    text = text.replace("\n", " ").replace("\t", " ")
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def load_units(csv_path=None):
    """Load unit symbol -> (singular, plural) mappings."""
    path = Path(csv_path) if csv_path else CORPUS_DIR / "units.csv"
    units = {}
    with path.open(encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            symbol = row["unit"].strip()
            singular = row["singular"].strip()
            plural = row["plural"].strip()
            if symbol:
                units[symbol.lower()] = (singular, plural)
    return units


def load_pronunciations(csv_path=None):
    """Load optional word -> spoken-form replacements."""
    path = Path(csv_path) if csv_path else CORPUS_DIR / "pronunciations.csv"
    mapping = {}
    with path.open(encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            word = row["word"].strip()
            spoken = row["spoken_form"].strip()
            if word and spoken:
                mapping[word] = spoken
    return mapping


def normalize_units(text, csv_path=None):
    """Convert patterns like '2 kg' into 'two kilograms'."""
    units = load_units(csv_path)
    if not units:
        return text

    symbols = sorted(units.keys(), key=len, reverse=True)
    escaped = [re.escape(symbol) for symbol in symbols]
    pattern = re.compile(
        rf"\b(\d+(?:,\d{{3}})*)\s*({'|'.join(escaped)})\b",
        re.IGNORECASE,
    )

    def replace_match(match):
        raw_number = match.group(1).replace(",", "")
        symbol = match.group(2).lower()
        count = int(raw_number)
        singular, plural = units[symbol]
        unit_word = singular if count == 1 else plural
        return f"{number_to_words(count)} {unit_word}"

    return pattern.sub(replace_match, text)


def normalize_symbols(text):
    """
    Normalize common currency and symbols.

    ₹500 -> five hundred rupees
    $20  -> twenty dollars
    50%  -> fifty percent
    &    -> and
    @    -> at
    """

    def rupees(match):
        value = int(match.group(1).replace(",", ""))
        word = "rupee" if value == 1 else "rupees"
        return f"{number_to_words(value)} {word}"

    def dollars(match):
        value = int(match.group(1).replace(",", ""))
        word = "dollar" if value == 1 else "dollars"
        return f"{number_to_words(value)} {word}"

    def percent(match):
        value = int(match.group(1).replace(",", ""))
        return f"{number_to_words(value)} percent"

    text = re.sub(r"₹\s*(\d{1,3}(?:,\d{3})*|\d+)", rupees, text)
    text = re.sub(r"\$\s*(\d{1,3}(?:,\d{3})*|\d+)", dollars, text)
    text = re.sub(r"(\d{1,3}(?:,\d{3})*|\d+)\s*%", percent, text)
    text = re.sub(r"\s*&\s*", " and ", text)
    text = re.sub(r"\s*@\s*", " at ", text)
    return text


def apply_pronunciations(text, csv_path=None):
    """Replace selected words with their spoken forms from the corpus."""
    for word, spoken in load_pronunciations(csv_path).items():
        pattern = re.compile(rf"\b{re.escape(word)}\b")
        text = pattern.sub(spoken, text)
    return text
