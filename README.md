# SpeakEasy — Turn Words Into Voice


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
