SpeakEasy — Turn Words Into Voice

SpeakEasy
 is a text-to-speech application that preprocesses English text and converts it into natural-sounding speech.

The project combines an NLP preprocessing pipeline with a web-based frontend. Text is tokenized, cleaned, and normalized before being converted into speech. The preprocessing pipeline handles numbers, abbreviations, units, symbols, currencies, and pronunciation rules to make text easier for a text-to-speech engine to interpret.

Live Demo

Open SpeakEasy

Features
Text-to-speech conversion
NLP-based text preprocessing
Sentence and word tokenization
Abbreviation expansion
Number-to-words conversion
Unit normalization
Symbol and currency normalization
Pronunciation normalization
CSV-based NLP dictionaries
Browser-based frontend
Responsive user interface
Pipeline
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

Example
Input
Dr. Sharma bought 2 kg of apples. He paid ₹500. Welcome to SpeakEasy!

Processed Text
Doctor Sharma bought two kilograms of apples. He paid five hundred rupees. Welcome to SpeakEasy!


The preprocessing stage converts written forms into speech-friendly text before it is passed to the text-to-speech system.

Project Structure
SpeakEasy/
|
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
|
├── nlp/
│   └── NLP preprocessing modules
|
├── corpus/
│   └── NLP dictionaries and pronunciation data
|
├── tts/
│   └── Text-to-speech generation
|
├── generated_audio/
│   └── Generated audio files
|
├── tests/
│   └── Test coverage
|
├── main.py
├── requirements.txt
└── README.md

Frontend Setup

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev


The application will be available at the local URL shown in the terminal.

Frontend Build

To create a production build:

npm run build


To preview the production build locally:

npm run preview

Python NLP and TTS Setup

Create a virtual environment:

python -m venv venv


Activate it on Windows:

venv\Scripts\activate


On macOS or Linux:

source venv/bin/activate


Install the Python dependencies:

pip install -r requirements.txt


NLTK tokenizer models such as punkt and punkt_tab are downloaded automatically the first time they are required.

The gTTS-based text-to-speech pipeline requires an internet connection to generate audio.

Usage

For the Python pipeline:

python main.py


Type or paste text into the application.

The pipeline processes the input, applies normalization rules, and generates speech-friendly text before producing the audio output.

Run Tests

Run the Python test suite with:

pytest -q

Corpus

The corpus/ directories contain the data used by the NLP preprocessing system.

File	Purpose
abbreviations.csv	Abbreviation expansion rules
units.csv	Unit normalization rules
pronunciations.csv	Pronunciation and speech normalization rules
Technologies
JavaScript
React
Vite
Python
NLTK
gTTS
CSV-based NLP dictionaries
Vercel
Deployment

The frontend is deployed using Vercel.

Live application:

https://speak-easy-cnvr-beta.vercel.app/

Project Goal

SpeakEasy aims to improve text-to-speech output by converting ordinary written English into text that is easier for speech synthesis systems to interpret correctly.

Instead of sending raw text directly to a TTS engine, SpeakEasy first analyzes and normalizes the input so that abbreviations, numbers, units, currencies, symbols, and pronunciation-sensitive words can be spoken more naturally.
