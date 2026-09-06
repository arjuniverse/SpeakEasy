"""Frontend glue: call the existing NLP pipeline. Does not change nlp/."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from nlp.pipeline import process_text


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    payload = json.loads(sys.stdin.read() or "{}")
    result = process_text(payload.get("text", ""))
    json.dump(result, sys.stdout, ensure_ascii=False)


if __name__ == "__main__":
    main()
