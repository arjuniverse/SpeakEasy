"""Load and expand abbreviations from the project corpus."""

import csv
import re
from pathlib import Path

CORPUS_PATH = Path(__file__).resolve().parent.parent / "corpus" / "abbreviations.csv"


def load_abbreviations(csv_path=None):
    """Return a list of (abbreviation, expansion) pairs, longest first."""
    path = Path(csv_path) if csv_path else CORPUS_PATH
    pairs = []
    with path.open(encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            abbr = row["abbreviation"].strip()
            expansion = row["expansion"].strip()
            if abbr and expansion:
                pairs.append((abbr, expansion))
    pairs.sort(key=lambda item: len(item[0]), reverse=True)
    return pairs


def expand_abbreviations(text, csv_path=None):
    """Replace known abbreviations with their spoken expansions."""
    for abbreviation, expansion in load_abbreviations(csv_path):
        core = re.escape(abbreviation.rstrip("."))
        # If the corpus entry includes a period, require it so "No." does not
        # replace the ordinary word "No".
        if abbreviation.endswith("."):
            pattern = re.compile(rf"\b{core}\.", re.IGNORECASE)
        else:
            pattern = re.compile(rf"\b{core}\b", re.IGNORECASE)
        text = pattern.sub(expansion, text)
    return text
