"""Sentence and word tokenization using NLTK."""

import nltk
from nltk.tokenize import sent_tokenize, word_tokenize


def _ensure_nltk_data():
    """Download tokenizer models if they are not already present."""
    resources = [
        ("tokenizers/punkt", "punkt"),
        ("tokenizers/punkt_tab", "punkt_tab"),
    ]
    for resource_path, download_name in resources:
        try:
            nltk.data.find(resource_path)
        except LookupError:
            nltk.download(download_name, quiet=True)


def tokenize_sentences(text):
    """Split text into sentences using NLTK's Punkt tokenizer."""
    _ensure_nltk_data()
    if not text or not text.strip():
        return []
    return sent_tokenize(text)


def tokenize_words(text):
    """Split text into word and punctuation tokens using NLTK."""
    _ensure_nltk_data()
    if not text or not text.strip():
        return []
    return word_tokenize(text)
