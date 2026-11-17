# SpeakEasy — Turn Words Into Voice 🎙️

SpeakEasy is a **Text-to-Speech (TTS) application** that preprocesses English text using Natural Language Processing (NLP) techniques and converts it into natural-sounding speech.

The project combines a **Python-based NLP and TTS pipeline** with a modern web-based frontend. The frontend communicates with the existing NLP and TTS pipeline through a lightweight Vite bridge without replacing or rewriting the backend.

## 🚀 Live Demo

**[Open SpeakEasy](https://speak-easy-cnvr-beta.vercel.app/)**

## ✨ Features

- Text-to-speech conversion
- NLP-based text preprocessing
- Sentence and word tokenization
- Abbreviation expansion
- Number-to-words conversion
- Unit normalization
- Symbol and currency normalization
- Pronunciation normalization
- CSV-based NLP dictionaries
- Browser-based frontend
- Responsive user interface

## 🔄 Processing Pipeline

SpeakEasy processes raw text through multiple NLP preprocessing stages before passing it to the TTS engine.

```text
Raw Text
   |
   v
NLP Tokenization
   |
   v
Text Cleaning
   |
   v
Abbreviation Expansion
   |
   v
Symbol / Currency Normalization
   |
   v
Unit Normalization
   |
   v
Number-to-Words Conversion
   |
   v
Pronunciation Processing
   |
   v
Text-to-Speech Engine
   |
   v
Generated Audio
```

### Preprocessing Handles

- **Numbers:** Converts numerical values into words.
- **Abbreviations:** Expands abbreviations into their full forms.
- **Units:** Normalizes measurement units.
- **Symbols:** Converts special symbols into speech-friendly text.
- **Currencies:** Converts currency representations into words.
- **Pronunciation:** Applies pronunciation rules for improved speech output.

## 📝 Example

**Input:**

```text
Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!
```

**Processed Text:**

```text
Doctor Sharma bought two kilograms of apples. He paid five hundred rupees. Welcome to SpeakEasy!
```

The preprocessing stage transforms ordinary written text into **speech-friendly text** before sending it to the text-to-speech engine.

## 📁 Project Structure

```text
SpeakEasy/
│
├── frontend/
│   ├── src/
│   │   ├── nlp/
│   │   │   └── engine.js
│   │   └── ...
│   ├── corpus/
│   │   ├── abbreviations.csv
│   │   ├── units.csv
│   │   └── pronunciations.csv
│   ├── index.html
│   ├── package.json
│   └── ...
│
├── nlp/
│   └── NLP preprocessing modules
│
├── corpus/
│   └── NLP dictionaries and pronunciation data
│
├── tts/
│   └── Text-to-speech generation
│
├── generated_audio/
│   └── Generated audio files
│
├── tests/
│   └── Test coverage
│
├── main.py
├── requirements.txt
└── README.md
```

## 💻 Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at the local URL displayed in the terminal.

## 📦 Frontend Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🐍 Python NLP and TTS Setup

Create a virtual environment:

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

NLTK tokenizer models such as `punkt` and `punkt_tab` are downloaded automatically the first time they are required.

> **Note:** The gTTS-based text-to-speech pipeline requires an active internet connection to generate audio.

## ▶️ Usage

Run the Python pipeline:

```bash
python main.py
```

Then:

1. Open the SpeakEasy application.
2. Type or paste your English text.
3. Allow the NLP pipeline to preprocess and normalize the input.
4. Convert the processed text into speech.
5. Listen to the generated audio.

The pipeline applies normalization rules before generating speech output.

## 🧪 Run Tests

Execute the Python test suite:

```bash
pytest -q
```

## 📚 Corpus

The `corpus/` directories contain dictionaries and linguistic data used by the NLP preprocessing system.

| File | Purpose |
|---|---|
| `abbreviations.csv` | Abbreviation expansion rules |
| `units.csv` | Unit normalization rules |
| `pronunciations.csv` | Pronunciation and speech normalization rules |

## 🛠️ Technologies Used

- **JavaScript**
- **React**
- **Vite**
- **Python**
- **NLTK**
- **gTTS**
- **CSV-based NLP dictionaries**
- **Vercel**

## ☁️ Deployment

The SpeakEasy frontend is deployed using **Vercel**.

**Live Application:** https://speak-easy-cnvr-beta.vercel.app/

## 🎯 Project Goal

SpeakEasy aims to improve text-to-speech quality by converting ordinary written English into text that speech synthesis systems can interpret more accurately.

Instead of sending raw text directly to a TTS engine, SpeakEasy first analyzes and normalizes the input using NLP techniques.

This includes handling abbreviations, numbers, units, currencies, symbols, and pronunciation-sensitive words.

The normalized text is then passed to the text-to-speech system to generate more natural and understandable speech.

## 📌 Future Improvements

Potential improvements include:

- Support for additional languages
- Expanded pronunciation dictionaries
- Larger NLP dictionaries
- Offline text-to-speech support
- Multiple voice options
- Adjustable speech speed
- Downloadable audio formats
- Improved handling of complex abbreviations
- Advanced sentence-level pronunciation processing

## 📄 License

This project is available for educational and development purposes.



