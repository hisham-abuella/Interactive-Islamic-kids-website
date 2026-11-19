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

Since 2026-11-19 (owner's request) every surah page and Ayat al-Kursi opens its
verses with that illuminated frame: the surah's name and its whole text, typeset
from the page's own verse cards (which verify-scripture.py checks against the
mushaf). Long texts get a smaller size and a taller frame so they fit.
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

# v1 font link, kept only so place() can strip it from older pages
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

# The name shown at the top of each frame (the frame's own title, not a verse).
TITLES = {
    "surah-ad-duha": "سُورَةُ الضُّحَى", "surah-al-adiyat": "سُورَةُ العَادِيَاتِ",
    "surah-al-asr": "سُورَةُ العَصْرِ", "surah-al-bayyinah": "سُورَةُ البَيِّنَةِ",
    "surah-al-falaq": "سُورَةُ الفَلَقِ", "surah-al-fil": "سُورَةُ الفِيلِ",
    "surah-al-humazah": "سُورَةُ الهُمَزَةِ", "surah-al-kafirun": "سُورَةُ الكَافِرُونَ",
    "surah-al-kawthar": "سُورَةُ الكَوْثَرِ", "surah-al-masad": "سُورَةُ المَسَدِ",
    "surah-al-maun": "سُورَةُ المَاعُونِ", "surah-al-qariah": "سُورَةُ القَارِعَةِ",
    "surah-an-nas": "سُورَةُ النَّاسِ", "surah-an-nasr": "سُورَةُ النَّصْرِ",
    "surah-ash-sharh": "سُورَةُ الشَّرْحِ", "surah-at-takathur": "سُورَةُ التَّكَاثُرِ",
    "surah-at-tin": "سُورَةُ التِّينِ", "surah-az-zalzalah": "سُورَةُ الزَّلْزَلَةِ",
    "surah-quraysh": "سُورَةُ قُرَيْشٍ", "ayat-al-kursi": "آيَةُ الكُرْسِيِّ",
}
BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"

INDENT = " " * 16


def spec_from_page(slug, html):
    """The frame for a page not in CALLIGRAPHY, typeset from its own verse cards."""
    cards = re.findall(r'<div class="verse-card" data-verse="\d+">\s*<div class="verse-number">\d+</div>\s*'
                       r'<div class="verse-content">\s*<p class="arabic" lang="ar">(.*?)</p>', html, re.S)
    if not cards:
        raise SystemExit(f"{slug}: no verse cards found")
    name = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S).group(1).strip()
    spec = dict(title=TITLES[slug], label=f"{name} written in Arabic inside an illuminated frame",
                bismillah=BISMILLAH, verses=cards, first=1)
    if slug == "ayat-al-kursi":
        # one ayah (2:255) shown on 8 cards: one passage, one ayah mark, no bismillah
        spec.update(bismillah=None, verses=[" ".join(cards)], first=255)
    return spec


def size_class(spec):
    words = sum(len(v.split()) for v in spec["verses"])
    if words <= 30:
        return ""
    if words <= 42:
        return " panel--md"
    if words <= 60:
        return " panel--lg"
    return " panel--xl"


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
    for n, text in enumerate(spec["verses"], spec.get("first", 1)):
        lines.append(f'{text} <span class="ayah-mark">۝{str(n).translate(AR_DIGITS)}</span>')
    body = "\n".join(f"{INDENT}            {line}" for line in lines)
    # role="img" + aria-label: the verse cards below already read the surah
    # aloud verse by verse; the panel should not read it a second time.
    return (f'{INDENT}{START}\n'
            f'{INDENT}<figure class="calligraphy-panel{size_class(spec)}" role="img" aria-label="{spec["label"]}">\n'
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

    # Amiri Quran and Aref Ruqaa are self-hosted (styles.css @font-face) since
    # v2, so the panel no longer adds a font link; any old one is stripped above.
    if slug in CALLIGRAPHY:
        inserts = {}                     # no pictures on these two pages
        frame = panel(CALLIGRAPHY[slug])
    else:
        inserts = {v: plate(slug, v) for v in PLATES.get(slug, {})}
        frame = panel(spec_from_page(slug, html))

    for verse, block in inserts.items():
        anchor = f'{INDENT}<div class="verse-card" data-verse="{verse}">'
        if anchor not in html:
            raise SystemExit(f"{slug}: no verse card {verse}")
        html = html.replace(anchor, block + anchor, 1)

    # the frame goes first: above verse 1 and above verse 1's picture, if any
    anchor = f'{INDENT}<div class="verse-card" data-verse="1">'
    pos = html.index(anchor)
    if 1 in inserts and html[:pos].endswith(inserts[1]):
        pos -= len(inserts[1])
    html = html[:pos] + frame + html[pos:]
    inserts[0] = frame

    path.write_text(html, encoding="utf-8")
    return len(inserts)


def main(slugs):
    for slug in slugs or [*PLATES, *CALLIGRAPHY, *(t for t in TITLES if t not in PLATES)]:
        print(f"{slug}: {place(slug)} placed")


if __name__ == "__main__":
    main(sys.argv[1:])
