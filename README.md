# SpeakEasy — Turn Words Into Voice

**SpeakEasy** is a text-to-speech application that preprocesses English text and converts it into natural-sounding speech.

The project combines an **NLP preprocessing pipeline** with a **web-based frontend**. Text is tokenized, cleaned, and normalized before being converted into speech.

The preprocessing pipeline handles:

- Numbers
- Abbreviations
- Units
- Symbols
- Currencies
- Pronunciation rules

This makes the input more suitable for text-to-speech engines and helps produce more natural speech output.

---

## 🚀 Live Demo

**Open SpeakEasy:**
https://speak-easy-cnvr-beta.vercel.app/

---

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

---

## 🔄 Processing Pipeline

```text
Raw Text
   |
   v
NLTK / NLP Tokenization
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
Text-to-Speech
   |
   v
Generated Audio
````

---

 ## 📝 Example

 ### Input

```
Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!
```

 ### Processed Text

```
Doctor Sharma bought two kilograms of apples. He paid five hundred rupees. Welcome to SpeakEasy!
```

 The preprocessing stage converts written forms into **speech-friendly text** before passing the text to the text-to-speech system.

---

 ## 📁 Project Structure

```
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

---

 ## 💻 Frontend Setup

 Navigate to the frontend directory:

```
cd frontend
```

 Install the dependencies:

```
npm install
```

 Start the development server:

```
npm run dev
```

 The application will be available at the local URL shown in the terminal.

---

 ## 📦 Frontend Build

 Create a production build:

```
npm run build
```

 Preview the production build locally:

```
npm run preview
```

---

 ## 🐍 Python NLP and TTS Setup

 Create a virtual environment:

```
python -m venv venv
```

 ### Windows

```
venv\Scripts\activate
```

 ### macOS / Linux

```
source venv/bin/activate
```

 Install the Python dependencies:

```
pip install -r requirements.txt
```

 NLTK tokenizer models such as `punkt` and `punkt_tab` are downloaded automatically the first time they are required.

 > **Note:** The gTTS-based text-to-speech pipeline requires an internet connection to generate audio.

---

 ## ▶️ Usage

 Run the Python pipeline:

```
python main.py
```

 Type or paste text into the application.

 The pipeline processes the input, applies normalization rules, and generates speech-friendly text before producing the audio output.

---

 ## 🧪 Run Tests

 Run the Python test suite with:

```
pytest -q
```

---

 ## 📚 Corpus

 The `corpus/` directories contain the data used by the NLP preprocessing system.

 | File | Purpose |
| --- | --- |
| `abbreviations.csv` | Abbreviation expansion rules |
| `units.csv` | Unit normalization rules |
| `pronunciations.csv` | Pronunciation and speech normalization rules |

---

 ## 🛠️ Technologies

 - **JavaScript**
- **React**
- **Vite**
- **Python**
- **NLTK**
- **gTTS**
- **CSV-based NLP dictionaries**
- **Vercel**

---

 ## ☁️ Deployment

 The frontend is deployed using **Vercel**.

 ### Live Application

 https://speak-easy-cnvr-beta.vercel.app/

---

 ## 🎯 Project Goal

 SpeakEasy aims to improve text-to-speech output by converting ordinary written English into text that is easier for speech synthesis systems to interpret correctly.

 Instead of sending raw text directly to a TTS engine, SpeakEasy first analyzes and normalizes the input.

 This includes handling:

 - Abbreviations
- Numbers
- Units
- Currencies
- Symbols
- Pronunciation-sensitive words

 The normalized text is then passed to the text-to-speech system to produce more natural and understandable speech.

---

 ## 📌 Future Improvements

 Potential improvements include:

 - Support for additional languages
- More pronunciation rules
- Larger NLP dictionaries
- Offline text-to-speech support
- Voice selection
- Adjustable speech speed
- Downloadable audio formats
- Improved handling of complex abbreviations
- Advanced sentence-level pronunciation processing

---

 ## 📄 License

 This project is available for educational and development purposes.

```

You can copy the entire block directly into your repository as **`README.md`**.
```
