#!/usr/bin/env python3
"""Diff every surah page's Arabic against api.alquran.cloud.

Checks each verse card and the complete-surah block, in two tiers:

  letters  - the consonantal text with every mark stripped. This MUST match. A
             difference here is a wrong word, and is a real error.
  marks    - the full pointed text, NFC-normalised. Reported for information
             only, because the pages legitimately mix orthographic styles: the
             Uthmani script omits the sukun in places the simple script writes it
             (`مِن شَرِّ` / `مِنْ شَرِّ`), shows idgham with a shadda
             (`يَكُن لَّهُ` / `يَكُنْ لَهُ`), and carries waqf marks the pages
             drop. All of those render as the same recitation.

NFC matters even at the marks tier: a shadda and the vowel beside it can be
stored in either order and look identical, so a raw byte diff reports
differences that are not there.

Usage:  python3 scripts/verify-scripture.py
Exit status is non-zero only if the letters tier fails.
"""
import json
import os
import re
import sys
import unicodedata
import urllib.request

UI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BISM = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"

# page -> surah number in the mushaf. Ayat al-Kursi is a single verse inside
# Surah Al-Baqarah, so it is checked separately below.
PAGES = {
    'surah-fatiha.html': 1,
    'surah-al-ikhlas.html': 112,
    'surah-al-falaq.html': 113,
    'surah-an-nas.html': 114,
    'surah-al-kawthar.html': 108,
    'surah-al-asr.html': 103,
    'surah-an-nasr.html': 110,
    'surah-al-kafirun.html': 109,
    'surah-al-maun.html': 107,
    'surah-quraysh.html': 106,
    'surah-al-masad.html': 111,
    'surah-al-fil.html': 105,
    'surah-az-zalzalah.html': 99,
    'surah-ad-duha.html': 93,
    'surah-ash-sharh.html': 94,
    'surah-at-tin.html': 95,
    'surah-al-humazah.html': 104,
    'surah-at-takathur.html': 102,
    'surah-al-qariah.html': 101,
}


def n(s):
    # The API prefixes a byte-order mark to the first ayah of a surah.
    return unicodedata.normalize('NFC', s.replace('\ufeff', '').strip())


# Harakat, sukun, shadda, the superscript alef, tatweel, Quranic annotation and
# waqf signs. Everything that is not a letter or a space.
MARKS = re.compile('[ؐ-ًؚ-ٰٟـۖ-ۭ]')


def letters(s):
    """The consonantal text: marks stripped, whitespace collapsed."""
    return re.sub(r'\s+', ' ', MARKS.sub('', n(s))).strip()


def api_verses(num):
    url = 'https://api.alquran.cloud/v1/surah/%d/quran-simple' % num
    data = json.load(urllib.request.urlopen(url, timeout=30))['data']
    out = []
    for a in data['ayahs']:
        t = n(a['text'])
        # The API prefixes the bismillah to ayah 1 of every surah but At-Tawbah.
        # Al-Fatiha is the exception: there the bismillah *is* ayah 1 (Hafs).
        if a['numberInSurah'] == 1 and num != 1 and t.startswith(n(BISM)):
            t = t[len(n(BISM)):].strip()
        out.append(t)
    return out


def main():
    problems = 0
    for page in sorted(PAGES):
        path = os.path.join(UI, page)
        if not os.path.exists(path):
            print('%-26s MISSING' % page)
            problems += 1
            continue
        src = open(path, encoding='utf-8').read()
        cards = [n(x) for x in re.findall(r'<p class="arabic"[^>]*>(.*?)</p>', src, re.S)]
        full = re.search(r'<p class="arabic-full"[^>]*>(.*?)</p>', src, re.S)
        ref = api_verses(PAGES[page])

        bad, style = [], []
        if len(cards) != len(ref):
            bad.append('%d verse cards vs %d ayat in the API' % (len(cards), len(ref)))
        for i, (a, b) in enumerate(zip(cards, ref), 1):
            if letters(a) != letters(b):
                bad.append('verse %d: wrong wording' % i)
            elif a != b:
                style.append('verse %d' % i)

        if full:
            parts = [n(p) for p in full.group(1).split('۝') if p.strip()]
            # Al-Fatiha's block has no separate bismillah line: it is ayah 1.
            expect = ref if PAGES[page] == 1 else [n(BISM)] + ref
            if len(parts) != len(expect):
                bad.append('complete-surah block has %d lines, expected %d'
                           % (len(parts), len(expect)))
            for i, (a, b) in enumerate(zip(parts, expect), 1):
                if letters(a) != letters(b):
                    bad.append('complete-surah line %d: wrong wording' % i)
                elif a != b:
                    style.append('complete-surah line %d' % i)
        else:
            bad.append('no complete-surah block')

        if bad:
            problems += len(bad)
            print('%-26s FAIL' % page)
            for b in bad:
                print('    - %s' % b)
        else:
            note = ('  [%d line(s) in Uthmani spelling]' % len(style)) if style else ''
            print('%-26s ok  (%d verses + complete-surah block)%s' % (page, len(ref), note))

    # Ayat al-Kursi: eight phrase-cards that must concatenate to 2:255.
    path = os.path.join(UI, 'ayat-al-kursi.html')
    if os.path.exists(path):
        src = open(path, encoding='utf-8').read()
        cards = [n(x) for x in re.findall(r'<p class="arabic"[^>]*>(.*?)</p>', src, re.S)]
        ref = n(json.load(urllib.request.urlopen(
            'https://api.alquran.cloud/v1/ayah/2:255/quran-simple', timeout=30)
        )['data']['text'])
        joined = letters(' '.join(cards))
        if joined == letters(ref):
            print('%-26s ok  (%d phrase-cards concatenate to 2:255)'
                  % ('ayat-al-kursi.html', len(cards)))
        else:
            problems += 1
            print('%-26s FAIL  phrase-cards do not concatenate to 2:255' % 'ayat-al-kursi.html')

    print('\n%s' % ('ALL SCRIPTURE MATCHES' if not problems
                    else '%d problem(s) found' % problems))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
