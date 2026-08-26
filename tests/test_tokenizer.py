"""Tests for NLTK sentence and word tokenization."""

from nlp.tokenizer import tokenize_sentences, tokenize_words


def test_sentence_tokenization():
    text = "Hello there. How are you?"
    sentences = tokenize_sentences(text)
    assert len(sentences) == 2
    assert sentences[0].startswith("Hello")
    assert sentences[1].startswith("How")


def test_word_tokenization_includes_punctuation():
    tokens = tokenize_words("Hello, world!")
    assert "Hello" in tokens
    assert "world" in tokens
    assert "," in tokens
    assert "!" in tokens


def test_empty_text_returns_empty_lists():
    assert tokenize_sentences("") == []
    assert tokenize_words("   ") == []
