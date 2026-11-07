#!/usr/bin/env python3
"""Fetch the tafsir reference text for every ayah on the site from QuranEnc.com, verbatim.

Why: the Arabic "meaning" line on each surah verse card must become a short child-level
sentence based on al-Tafsir al-Muyassar, with al-Mukhtasar as the second source
(islamic-content-scholar, claudeteam/reviews/site-fixes-scholar-confirm-2026-11-04.md,
Round 3, Part 2 A). The site does not republish these tafsirs; the files written here are a
reference for the team and the scholar, kept unchanged with the QuranEnc credit, the
version and the retrieval date, as QuranEnc's republishing terms require
(claudeteam/reviews/recitation-tafsir-sources-2026-11-04.md, section 2).

Keys (QuranEnc API v1, no key needed):
  arabic_moyassar    al-Tafsir al-Muyassar (King Fahd Complex)              main source
  arabic_mokhtasar   al-Mukhtasar fi Tafsir al-Quran (Tafsir Center)        second source
  english_mokhtasar  The Abridged Explanation of the Quran (Tafsir Center)  EN reference

Ayat: Al-Fatiha (1), 2:255 and the 20 short surahs on the site = 141 ayat.

Writes UI/scripts/data/tafsir/<key>.json:
  {"key", "title", "source", "api", "browse", "version", "retrieved", "terms",
   "ayat": {"s:a": <the API's result object for that ayah, unchanged>}}
and UI/scripts/data/tafsir/SOURCES.md (credits and conditions).

One request at a time with a 0.5 s pause. No local model is involved (no RAM gate).

Usage:  python3 scripts/fetch-tafsir.py            # fetch all three keys
        python3 scripts/fetch-tafsir.py --check    # only check the saved files cover all 141 ayat
"""
import argparse
import datetime
import json
import os
import sys
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'data', 'tafsir')
API = 'https://quranenc.com/api/v1'
PAUSE = 0.5

# surah -> number of ayat (the site's surahs); 2:255 is fetched on its own
SURAHS = {1: 7, 93: 11, 94: 8, 95: 8, 98: 8, 99: 8, 100: 11, 101: 11, 102: 8, 103: 3, 104: 9,
          105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3, 111: 5, 112: 4, 113: 5, 114: 6}
SINGLE = [(2, 255)]

KEYS = {
    'arabic_moyassar': {
        'title': 'التفسير الميسر',
        'source': 'al-Tafsir al-Muyassar, King Fahd Glorious Quran Printing Complex '
                  '(مجمع الملك فهد لطباعة المصحف الشريف)',
        'role': 'Main source for the Arabic child meaning lines (scholar, Round 3, Part 2 A).',
    },
    'arabic_mokhtasar': {
        'title': 'المختصر في تفسير القرآن الكريم',
        'source': 'al-Mukhtasar fi Tafsir al-Quran al-Karim, Tafsir Center for Quranic Studies '
                  '(مركز تفسير للدراسات القرآنية)',
        'role': 'Second source, where Muyassar is too long (scholar, Round 3, Part 2 A).',
    },
    'english_mokhtasar': {
        'title': 'The Abridged Explanation of the Quran',
        'source': 'al-Mukhtasar in English, Tafsir Center for Quranic Studies',
        'role': 'Reference only, to check the site\'s own English meaning lines.',
    },
}

TERMS = ('QuranEnc.com: "Contents of the translations can be downloaded and re-published" on these '
         'conditions: 1. no modification, addition or deletion of the content; 2. clearly referring '
         'to the publisher and the source (QuranEnc.com); 3. mentioning the version number when '
         're-publishing; 4. keeping the transcript information inside the document; 5. notifying '
         'the source (QuranEnc.com) of any note on the translation; 6. updating the translation '
         'according to the latest version issued from the source; 7. no inappropriate '
         'advertisements when displaying the content.')


def ayah_keys():
    out = [f'{s}:{a}' for s, n in SURAHS.items() for a in range(1, n + 1)]
    out += [f'{s}:{a}' for s, a in SINGLE]
    return out


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'islamic-kids-site/fetch-tafsir (non-commercial)'})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode('utf-8'))
    time.sleep(PAUSE)
    return data


def version_of(key):
    """QuranEnc's /translations/list does not list the Arabic keys (checked 2026-11-06), so the
    version is usually not published by the API; then the retrieval date stands in for it."""
    try:
        for lang in ('', '/en', '/ar'):
            for t in get(f'{API}/translations/list{lang}').get('translations', []):
                if t.get('key') == key:
                    return t.get('version'), t.get('last_update')
    except Exception as e:          # the version is metadata only; the fetch goes on
        print(f'  (version lookup failed: {e})', file=sys.stderr)
    return None, None


def fetch(key, today):
    ayat = {}
    for s in SURAHS:
        url = f'{API}/translation/sura/{key}/{s}'
        print(f'  {url}')
        for item in get(url)['result']:
            ayat[f'{item["sura"]}:{item["aya"]}'] = item
    for s, a in SINGLE:
        url = f'{API}/translation/aya/{key}/{s}/{a}'
        print(f'  {url}')
        item = get(url)['result']
        ayat[f'{s}:{a}'] = item
    want = ayah_keys()
    keep = {k: ayat[k] for k in want if k in ayat}
    missing = [k for k in want if k not in keep]
    if missing:
        sys.exit(f'{key}: missing {missing}')
    version, last_update = version_of(key)
    meta = KEYS[key]
    return {
        'key': key,
        'title': meta['title'],
        'source': meta['source'],
        'role': meta['role'],
        'api': f'{API}/translation/sura/{key}/<sura>',
        'browse': f'https://quranenc.com/en/browse/{key}',
        'version': version or f'not published by the QuranEnc API; retrieved {today}',
        'last_update': last_update,
        'retrieved': today,
        'terms': TERMS,
        'count': len(keep),
        'ayat': keep,
    }


def write_sources(files, today):
    lines = [
        '# Tafsir reference text: sources and credits',
        '',
        'Fetched by `UI/scripts/fetch-tafsir.py` from the QuranEnc.com API (Encyclopedia of the',
        'Noble Quran, https://quranenc.com). The text in these files is **unchanged**: each ayah\'s',
        'entry is the API\'s result object as received. It is kept as a **reference** for the team',
        'and the islamic-content-scholar. The site does not show or voice it; the site\'s Arabic',
        'meaning lines are the team\'s own short child-level sentences based on it, approved by',
        'the scholar (`claudeteam/reviews/tafsir-ar-lines-2026-11.md`).',
        '',
        f'Ayat: Al-Fatiha, 2:255 and the 20 short surahs on the site ({len(ayah_keys())} ayat).',
        '',
        '| File | Work | Publisher | Version | Retrieved | Browse |',
        '|---|---|---|---|---|---|',
    ]
    for key, d in files.items():
        lines.append(f'| `{key}.json` | {d["title"]} | {d["source"]} | {d["version"]} | '
                     f'{d["retrieved"]} | {d["browse"]} |')
    lines += [
        '',
        '## Credit to show on the site',
        '',
        '«المعنى مبسَّط اعتماداً على التفسير الميسر (مجمع الملك فهد لطباعة المصحف الشريف) '
        'والمختصر في تفسير القرآن الكريم (مركز تفسير للدراسات القرآنية)، والنص من موقع موسوعة '
        'القرآن الكريم QuranEnc.com»',
        '',
        '"Meanings simplified from al-Tafsir al-Muyassar (King Fahd Complex) and al-Mukhtasar fi',
        'Tafsir al-Quran (Tafsir Center for Quranic Studies); text via QuranEnc.com."',
        '',
        '## Conditions of use (QuranEnc.com)',
        '',
        TERMS,
        '',
        '## Version',
        '',
        'QuranEnc\'s `/translations/list` endpoint did not list `arabic_moyassar`,',
        '`arabic_mokhtasar` or `english_mokhtasar` when fetched, so the API gives no version',
        'number for them; the retrieval date stands in for it, as the sources review advised.',
        'Ask QuranEnc for the version number if the verbatim text is ever shown on the site.',
        'Notes on the text go to QuranEnc (condition 5); notes on the Mukhtasar may also go to',
        'almokhtasar@tafsir.net.',
        '',
    ]
    with open(os.path.join(OUT, 'SOURCES.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))


def check():
    want, bad = ayah_keys(), 0
    for key in KEYS:
        p = os.path.join(OUT, f'{key}.json')
        d = json.load(open(p, encoding='utf-8'))
        miss = [k for k in want if not (d['ayat'].get(k) or {}).get('translation')]
        print(f'{key}: {len(d["ayat"])} ayat, {len(miss)} missing {miss[:5]}')
        bad += bool(miss)
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    args = ap.parse_args()
    if args.check:
        return check()
    os.makedirs(OUT, exist_ok=True)
    today = datetime.date.today().isoformat()
    files = {}
    for key in KEYS:
        print(key)
        files[key] = fetch(key, today)
        with open(os.path.join(OUT, f'{key}.json'), 'w', encoding='utf-8') as f:
            json.dump(files[key], f, ensure_ascii=False, indent=1)
            f.write('\n')
    write_sources(files, today)
    return check()


if __name__ == '__main__':
    sys.exit(main())
