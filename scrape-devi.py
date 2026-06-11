"""
Scrapes Devi Mahatmya (Durga Saptashati) from sanskritdocuments.org
Produces: src/data/devi-mahatmya.json

Sources:
  - Devanagari Sanskrit : durga700.html
  - ITRANS transliteration : durga700.itx
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; portfolio-scraper/1.0)"}

CHAPTER_NAMES = {
    1:  "Madhu-Kaitabha Vadha",
    2:  "Mahishasura Sena Vadha",
    3:  "Mahishasura Vadha",
    4:  "Shakra-stuti",
    5:  "Devi Prादurbhava",
    6:  "Dhumralochana Vadha",
    7:  "Chanda-Munda Vadha",
    8:  "Raktabija Vadha",
    9:  "Nishumbha Vadha",
    10: "Shumbha Vadha",
    11: "Narayani Stuti",
    12: "Phalastuti",
    13: "Suratha-Vaishya Varada",
}

# ── Devanagari digits to Arabic ──────────────────────────────────────────────
DEVA_DIGITS = str.maketrans("०१२३४५६७८९", "0123456789")

def deva_to_int(s: str) -> int:
    return int(s.translate(DEVA_DIGITS))


# ── Fetch helpers ─────────────────────────────────────────────────────────────
def fetch(url: str) -> str:
    print(f"  GET {url}")
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    r.encoding = "utf-8"
    return r.text


# ── Parse Devanagari from HTML ────────────────────────────────────────────────
def parse_html(html: str) -> dict[tuple[int, int], str]:
    """Returns {(chapter, verse): sanskrit_text}"""
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n")

    verses: dict[tuple[int, int], str] = {}

    # Verse marker pattern: ॥ ch.v॥  or  ॥ch.v॥  (Devanagari digits)
    verse_pat = re.compile(
        r"॥\s*([०-९]+)\.([०-९]+)\s*॥"
    )

    # Split text on verse markers, keeping the markers
    parts = verse_pat.split(text)
    # parts = [pre, ch, v, body, ch, v, body, ...]
    i = 1
    while i + 2 < len(parts):
        try:
            ch  = deva_to_int(parts[i])
            v   = deva_to_int(parts[i + 1])
            body = parts[i + 2].strip()
            # Clean up: remove speaker labels, extra whitespace
            body = re.sub(r"\n{3,}", "\n", body)
            body = re.sub(r"[ \t]+", " ", body)
            body = body.strip()
            if body and 1 <= ch <= 13:
                verses[(ch, v)] = body
        except (ValueError, IndexError):
            pass
        i += 3

    print(f"  HTML: extracted {len(verses)} verse blocks")
    return verses


# ── Parse ITRANS transliteration from .itx ───────────────────────────────────
def parse_itx(itx: str) -> dict[tuple[int, int], str]:
    """Returns {(chapter, verse): itrans_text}"""
    verses: dict[tuple[int, int], str] = {}

    # Verse marker: || 1\.1||  or  1\.1|| at end of speaker line
    verse_pat = re.compile(r"\|\|\s*(\d+)\\\.(\d+)\s*\|\|")

    lines = itx.splitlines()
    current_key: tuple[int, int] | None = None
    buffer: list[str] = []

    def save():
        if current_key:
            raw = " ".join(buffer).strip()
            # Strip LaTeX macros and double-pipe markers
            raw = re.sub(r"\\[a-zA-Z]+\{[^}]*\}", "", raw)
            raw = re.sub(r"\|\|[^|]*\|\|", "", raw)
            raw = re.sub(r"%.*", "", raw)
            raw = raw.strip()
            if raw:
                verses[current_key] = raw

    for line in lines:
        line = line.strip()
        if not line or line.startswith("%"):
            continue
        m = verse_pat.search(line)
        if m:
            save()
            buffer = []
            ch, v = int(m.group(1)), int(m.group(2))
            current_key = (ch, v)
            # Text after the marker on the same line
            rest = line[m.end():].strip()
            if rest:
                buffer.append(rest)
        elif current_key:
            # Skip LaTeX structural lines
            if line.startswith("\\") and not line.startswith("\\noindent"):
                save()
                current_key = None
                buffer = []
            else:
                buffer.append(line)

    save()
    print(f"  ITX : extracted {len(verses)} verse blocks")
    return verses


# ── Build JSON ────────────────────────────────────────────────────────────────
def build(html_verses, itx_verses) -> list[dict]:
    all_keys = sorted(set(html_verses) | set(itx_verses))
    records = []
    for (ch, v) in all_keys:
        records.append({
            "chapter": ch,
            "verse": v,
            "chapter_name": CHAPTER_NAMES.get(ch, f"Chapter {ch}"),
            "sanskrit": html_verses.get((ch, v), ""),
            "transliteration": itx_verses.get((ch, v), ""),
        })
    return records


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("Fetching sources...")
    html = fetch("https://sanskritdocuments.org/doc_devii/durga700.html")
    time.sleep(1)
    itx  = fetch("https://sanskritdocuments.org/doc_devii/durga700.itx")

    print("\nParsing...")
    html_verses = parse_html(html)
    itx_verses  = parse_itx(itx)

    print("\nBuilding JSON...")
    records = build(html_verses, itx_verses)

    out_path = "src/data/devi-mahatmya.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"\nDone — {len(records)} verses written to {out_path}")

    # Quick sanity check
    chapters = {}
    for r in records:
        chapters.setdefault(r["chapter"], 0)
        chapters[r["chapter"]] += 1
    print("\nVerse count per chapter:")
    for ch, count in sorted(chapters.items()):
        print(f"  Ch {ch:2d} ({CHAPTER_NAMES.get(ch, '?'):30s}): {count}")


if __name__ == "__main__":
    main()
