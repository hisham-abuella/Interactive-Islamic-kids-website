#!/usr/bin/env python3
"""Put the surah plates on the surah pages, each above the verse it opens.

    python3 scripts/place-surah-plates.py            # every page
    python3 scripts/place-surah-plates.py surah-al-fil

Idempotent: it strips any plate it placed before and inserts afresh, so it is
safe to re-run after changing specs/surah_plates.py. build-surah.py calls it
too, so a rebuilt page keeps its plates.

Al-Fatiha and Al-Ikhlas get no pictures (see the spec's docstring). They get
the illuminated frame instead, with the real text typeset inside it — the
image engine never draws a single letter of it.
"""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from specs.surah_plates import PLATES  # noqa: E402

UI = Path(__file__).resolve().parent.parent

# Everything this script inserts is wrapped in these markers, which is what
# makes a re-run able to find and replace its own work.
START, END = "<!-- surah-plate -->", "<!-- /surah-plate -->"
STRIP = re.compile(r"[ \t]*" + re.escape(START) + r".*?" + re.escape(END) + r"\n", re.S)

PANEL_FONTS = ('<link href="https://fonts.googleapis.com/css2?family=Amiri+Quran'
               '&family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">')

# Arabic-Indic digits for the ayah markers.
AR_DIGITS = str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")

CALLIGRAPHY = {
    "surah-fatiha": dict(
        title="سُورَةُ الفَاتِحَةِ",
        label="Surah Al-Fatiha written in Arabic inside an illuminated frame",
        bismillah=None,  # in the Hafs count it is verse 1 here, so it is numbered below
        verses=[
            "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            "الرَّحْمَٰنِ الرَّحِيمِ",
            "مَالِكِ يَوْمِ الدِّينِ",
            "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
            "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        ],
    ),
    "surah-al-ikhlas": dict(
        title="سُورَةُ الإِخْلَاصِ",
        label="Surah Al-Ikhlas written in Arabic inside an illuminated frame",
        bismillah="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        verses=[
            "قُلْ هُوَ اللَّهُ أَحَدٌ",
            "اللَّهُ الصَّمَدُ",
            "لَمْ يَلِدْ وَلَمْ يُولَدْ",
            "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        ],
    ),
}

INDENT = " " * 16


def plate(slug, verse):
    # alt="" on purpose: the verse card right below says what the plate shows,
    # and a screen reader reading both would say everything twice.
    return (f'{INDENT}{START}\n'
            f'{INDENT}<figure class="verse-plate">'
            f'<img src="images/surahs/{slug}/verse-{verse}.webp" alt="" loading="lazy" '
            f'decoding="async" width="960" height="540"></figure>\n'
            f'{INDENT}{END}\n')


def panel(spec):
    lines = []
    if spec["bismillah"]:
        lines.append(f'<span class="panel-bismillah">{spec["bismillah"]}</span>')
    for n, text in enumerate(spec["verses"], 1):
        lines.append(f'{text} <span class="ayah-mark">۝{str(n).translate(AR_DIGITS)}</span>')
    body = "\n".join(f"{INDENT}            {line}" for line in lines)
    # role="img" + aria-label: the verse cards below already read the surah
    # aloud verse by verse; the panel should not read it a second time.
    return (f'{INDENT}{START}\n'
            f'{INDENT}<figure class="calligraphy-panel" role="img" aria-label="{spec["label"]}">\n'
            f'{INDENT}    <div class="panel-text" lang="ar" dir="rtl" aria-hidden="true">\n'
            f'{INDENT}        <div class="panel-title">{spec["title"]}</div>\n'
            f'{INDENT}        <p>\n{body}\n{INDENT}        </p>\n'
            f'{INDENT}    </div>\n'
            f'{INDENT}</figure>\n'
            f'{INDENT}{END}\n')


def place(slug):
    path = UI / f"{slug}.html"
    html = STRIP.sub("", path.read_text(encoding="utf-8"))
    html = html.replace(f"    {PANEL_FONTS}\n", "")

    if slug in CALLIGRAPHY:
        html = html.replace('    <link rel="stylesheet" href="styles.css">',
                            f'    {PANEL_FONTS}\n    <link rel="stylesheet" href="styles.css">', 1)
        inserts = {1: panel(CALLIGRAPHY[slug])}
    else:
        inserts = {v: plate(slug, v) for v in PLATES.get(slug, {})}

    for verse, block in inserts.items():
        anchor = f'{INDENT}<div class="verse-card" data-verse="{verse}">'
        if anchor not in html:
            raise SystemExit(f"{slug}: no verse card {verse}")
        html = html.replace(anchor, block + anchor, 1)

    path.write_text(html, encoding="utf-8")
    return len(inserts)


def main(slugs):
    for slug in slugs or [*PLATES, *CALLIGRAPHY]:
        print(f"{slug}: {place(slug)} placed")


if __name__ == "__main__":
    main(sys.argv[1:])
