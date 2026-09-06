import abbreviationsCsv from "../../corpus/abbreviations.csv?raw";
import unitsCsv from "../../corpus/units.csv?raw";
import pronunciationsCsv from "../../corpus/pronunciations.csv?raw";

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];

const TENS = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
];

function parseCsv(raw) {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || "").trim();
    });
    return row;
  });
}

const ABBREVIATIONS = parseCsv(abbreviationsCsv)
  .map((row) => [row.abbreviation, row.expansion])
  .sort((a, b) => b[0].length - a[0].length);

const UNITS = Object.fromEntries(
  parseCsv(unitsCsv).map((row) => [row.unit.toLowerCase(), [row.singular, row.plural]]),
);

const PRONUNCIATIONS = parseCsv(pronunciationsCsv);

function underOneHundred(n) {
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return TENS[tens];
  return `${TENS[tens]}-${ONES[ones]}`;
}

function underOneThousand(n) {
  if (n < 100) return underOneHundred(n);
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;
  if (remainder === 0) return `${ONES[hundreds]} hundred`;
  return `${ONES[hundreds]} hundred ${underOneHundred(remainder)}`;
}

export function numberToWords(n) {
  n = Number(n);
  if (n < 0) return `minus ${numberToWords(Math.abs(n))}`;
  if (n < 1000) return underOneThousand(n);
  const parts = [];
  const scales = [
    [1_000_000_000, "billion"],
    [1_000_000, "million"],
    [1_000, "thousand"],
  ];
  for (const [value, name] of scales) {
    if (n >= value) {
      const count = Math.floor(n / value);
      n %= value;
      parts.push(`${underOneThousand(count)} ${name}`);
    }
  }
  if (n > 0) parts.push(underOneThousand(n));
  return parts.join(" ");
}

export function tokenizeSentences(text) {
  if (!text || !text.trim()) return [];
  const matches = text.match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g);
  return (matches || []).map((part) => part.trim()).filter(Boolean);
}

export function tokenizeWords(text) {
  if (!text || !text.trim()) return [];
  return text.match(/[A-Za-z0-9]+|[^\sA-Za-z0-9]/g) || [];
}

function cleanText(text) {
  return String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandAbbreviations(text) {
  for (const [abbreviation, expansion] of ABBREVIATIONS) {
    const core = abbreviation.replace(/\.+$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = abbreviation.endsWith(".")
      ? new RegExp(`\\b${core}\\.`, "gi")
      : new RegExp(`\\b${core}\\b`, "gi");
    text = text.replace(pattern, expansion);
  }
  return text;
}

function normalizeSymbols(text) {
  text = text.replace(/₹\s*(\d{1,3}(?:,\d{3})*|\d+)/g, (_, raw) => {
    const value = Number(raw.replace(/,/g, ""));
    return `${numberToWords(value)} ${value === 1 ? "rupee" : "rupees"}`;
  });
  text = text.replace(/\$\s*(\d{1,3}(?:,\d{3})*|\d+)/g, (_, raw) => {
    const value = Number(raw.replace(/,/g, ""));
    return `${numberToWords(value)} ${value === 1 ? "dollar" : "dollars"}`;
  });
  text = text.replace(/(\d{1,3}(?:,\d{3})*|\d+)\s*%/g, (_, raw) => {
    return `${numberToWords(Number(raw.replace(/,/g, "")))} percent`;
  });
  text = text.replace(/\s*&\s*/g, " and ");
  text = text.replace(/\s*@\s*/g, " at ");
  return text;
}

function normalizeUnits(text) {
  const symbols = Object.keys(UNITS).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `\\b(\\d+(?:,\\d{3})*)\\s*(${symbols.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi",
  );
  return text.replace(pattern, (_, raw, symbol) => {
    const count = Number(raw.replace(/,/g, ""));
    const [singular, plural] = UNITS[symbol.toLowerCase()];
    return `${numberToWords(count)} ${count === 1 ? singular : plural}`;
  });
}

function normalizeNumbers(text) {
  text = text.replace(/\b\d{1,3}(?:,\d{3})+\b/g, (raw) => numberToWords(Number(raw.replace(/,/g, ""))));
  text = text.replace(/\b\d+\b/g, (raw) => numberToWords(Number(raw)));
  return text;
}

function applyPronunciations(text) {
  for (const row of PRONUNCIATIONS) {
    const pattern = new RegExp(`\\b${row.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    text = text.replace(pattern, row.spoken_form);
  }
  return text;
}

export function detectTransforms(original) {
  return {
    numbers: /\d/.test(original),
    abbreviations: /\b(?:Dr|Mr|Mrs|Ms|Prof|Sr|Jr|vs|etc|Ltd|Inc|St|Ave)\./i.test(original),
    units: /\b\d+(?:,\d{3})*\s*(?:kg|km|cm|mm|mg|ml|lb|oz|hr|min|sec|ms|hz|kw)\b/i.test(original),
    symbols: /[₹$%@&]/.test(original),
  };
}

export function estimateDurationSeconds(wordCount) {
  return Math.max(wordCount ? 1 : 0, Math.round((wordCount / 150) * 60));
}

export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function processTextLocal(text) {
  const original = text ?? "";
  const sentences = tokenizeSentences(original);
  const tokens = tokenizeWords(original);
  let processed = cleanText(original);
  processed = expandAbbreviations(processed);
  processed = normalizeSymbols(processed);
  processed = normalizeUnits(processed);
  processed = normalizeNumbers(processed);
  processed = applyPronunciations(processed);
  processed = cleanText(processed);
  const words = original.trim() ? original.trim().split(/\s+/).length : 0;

  return {
    original_text: original,
    processed_text: processed,
    sentences,
    tokens,
    statistics: {
      characters: original.length,
      words,
      sentences: sentences.length,
      tokens: tokens.length,
    },
    flags: detectTransforms(original),
    engine: "local",
  };
}
