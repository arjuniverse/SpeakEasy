# SpeakEasy — Turn Words Into Voice

An **text-to-speech preprocessing pipeline**. Raw English text is tokenized with NLTK, cleaned, and normalized (numbers, abbreviations, units, symbols), then converted to an MP3 with gTTS.

This repository contains only the **NLP + TTS pipeline**. There is no web UI, API, or database.

## Pipeline

```
Raw Text
  → NLTK sentence / word tokenization
  → Text cleaning
  → Abbreviation expansion
  → Symbol / currency normalization
  → Unit normalization
  → Number-to-words conversion
  → gTTS
  → MP3 audio (generated_audio/)
```

## Setup

```bash
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
```

NLTK tokenizer models (`punkt`, `punkt_tab`) are downloaded automatically the first time you run the program.

gTTS needs an internet connection to generate audio.

## Usage

```bash
python main.py
```

Type or paste text, then press Enter. Example:

```
Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!
```

Expected processed text:

```
Doctor Sharma bought two kilograms of apples. He paid five hundred rupees. Welcome to SpeakEasy!
```

The program prints the original text, NLP statistics, processed text, and the path of the generated MP3.

## Run tests

```bash
pytest -q
```

## Project layout

| Path | Role |
|------|------|
| `nlp/` | Tokenization, cleaning, numbers, abbreviations, pipeline |
| `corpus/` | CSV dictionaries for abbreviations, units, pronunciations |
| `tts/` | gTTS MP3 generation (separate from NLP) |
| `generated_audio/` | Output MP3 files |
| `tests/` | pytest coverage of each pipeline stage |
