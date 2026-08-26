"""End-to-end NLP pipeline: tokenize, clean, normalize, and expand."""

from nlp.abbreviations import expand_abbreviations
from nlp.normalizer import (
    apply_pronunciations,
    clean_text,
    normalize_symbols,
    normalize_units,
)
from nlp.numbers import normalize_numbers
from nlp.tokenizer import tokenize_sentences, tokenize_words


def process_text(text):
    """
    Run the SpeakEasy NLP pipeline and return processed text plus statistics.

    Pipeline order:
        raw text
        -> NLTK sentence/word tokenization (for analysis)
        -> text cleaning
        -> abbreviation expansion
        -> symbol/currency normalization
        -> unit normalization
        -> remaining number normalization
        -> optional pronunciation replacements
    """
    original_text = text if text is not None else ""

    sentences = tokenize_sentences(original_text)
    tokens = tokenize_words(original_text)

    processed = clean_text(original_text)
    processed = expand_abbreviations(processed)
    processed = normalize_symbols(processed)
    processed = normalize_units(processed)
    processed = normalize_numbers(processed)
    processed = apply_pronunciations(processed)
    processed = clean_text(processed)

    word_count = len(original_text.split()) if original_text.strip() else 0

    return {
        "original_text": original_text,
        "processed_text": processed,
        "sentences": sentences,
        "tokens": tokens,
        "statistics": {
            "characters": len(original_text),
            "words": word_count,
            "sentences": len(sentences),
            "tokens": len(tokens),
        },
    }
