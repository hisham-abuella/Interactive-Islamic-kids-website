#!/usr/bin/env python3
"""verify-scripture.py, run on the print data instead of the pages.

  python3 tools/verify-print-scripture.py [--build draft|.]

UI/scripts/verify-scripture.py proves the site's pages carry the right
wording. This proves the books do too, in two steps, using that script's own
letters/marks tiers and its source (api.alquran.cloud, quran-simple):

  1. print data   every scripture span in books/<page>.html (what
                  extract-book.py lifted out of the page) is diffed against
                  the API: each verse in order, the Bismillah, every line of
                  the complete surah; Ayat al-Kursi's parts must concatenate
                  to 2:255; a story's dua must be the page's dua verbatim.
  2. layout       every span in each volume's built interior HTML
                  (build/vol-*-interior*.html, what Chrome prints) is the same
                  string, in the same order, as the books it binds: the layout
                  step dropped nothing, added nothing, changed nothing.

Exit status is non-zero if the letters tier fails anywhere, or a span differs
between the data and the layout.
"""
import importlib.util, json, re, sys
from pathlib import Path

PRINT = Path(__file__).resolve().parent.parent
UI = PRINT.parent / 'UI'
spec = importlib.util.spec_from_file_location('vs', UI / 'scripts' / 'verify-scripture.py')
vs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(vs)

build = 'draft'
if '--build' in sys.argv:
    build = sys.argv[sys.argv.index('--build') + 1]
sfx = '-draft' if build == 'draft' else ''

SPAN = re.compile(r'<span class=\\?"quran\\?">(.*?)</span>', re.S)


def spans(path):
    t = path.read_text(encoding='utf-8')
    return [vs.n(re.sub(r'<[^>]+>', '', s)) for s in SPAN.findall(t)]


problems = 0
total = 0
volumes = json.loads((PRINT / 'tools' / 'volumes.json').read_text())
# An extraction older than its page (or than translations.js, which Adam reads,
# or than the extractor itself) checks yesterday's words: fail it outright.
EXTRACTOR = PRINT / 'tools' / 'extract-book.py'
for v in volumes:
    for book in v['books']:
        path = PRINT / 'books' / f'{book}.html'
        sources = [UI / f'{book}.html', UI / 'translations.js', EXTRACTOR]
        newer = [x.name for x in sources if not path.exists() or x.stat().st_mtime > path.stat().st_mtime]
        if newer:
            problems += 1
            print(f'{book:22} STALE  print/books/{book}.html is older than {", ".join(newer)}: re-extract (tools/build-volumes.sh does)')
            continue
        got = spans(path)
        total += len(got)
        bad, style = [], 0
        page = f'{book}.html'
        if page in vs.PAGES:
            num = vs.PAGES[page]
            ref = vs.api_verses(num)
            # data order: [Bismillah,] verse 1..n on the verse pages, then the
            # complete surah: one span per ayah, after its own Bismillah line
            # (Al-Fatiha: the Bismillah is ayah 1 and numbered with the rest)
            bism = [] if num == 1 else [vs.n(vs.BISM)]
            want = bism + ref
            body, full = got[:len(want)], got[len(want):]
            for i, (a, b) in enumerate(zip(body, want)):
                if vs.letters(a) != vs.letters(b):
                    bad.append(f'span {i + 1}: wrong wording')
                elif a != b:
                    style += 1
            expect = ref if num == 1 else [vs.n(vs.BISM)] + ref
            if len(full) != len(expect):
                bad.append(f'complete surah: {len(full)} spans, want {len(expect)}')
            elif [vs.letters(p) for p in full] != [vs.letters(p) for p in expect]:
                bad.append('complete surah: wrong wording')
            what = (f'Bismillah + {len(ref)} verses' if bism else f'{len(ref)} verses') + \
                f' + complete surah, {len(full)} spans'
        elif book == 'ayat-al-kursi':
            import urllib.request
            ref = vs.n(json.load(urllib.request.urlopen(
                'https://api.alquran.cloud/v1/ayah/2:255/quran-simple', timeout=30))['data']['text'])
            parts, full = got[1:-1], got[-1]      # [Bismillah, part 1..8, complete verse]
            if vs.letters(got[0]) != vs.letters(vs.BISM):
                bad.append('Bismillah: wrong wording')
            if vs.letters(' '.join(parts)) != vs.letters(ref):
                bad.append('parts do not concatenate to 2:255')
            if vs.letters(full.replace('۝', ' ')) != vs.letters(ref):
                bad.append('complete verse is not 2:255')
            what = f'Bismillah + {len(parts)} parts = 2:255 + complete verse'
        else:   # a story: ayat it quotes (data-ayah), then its dua
            import urllib.request
            src = (UI / page).read_text(encoding='utf-8')
            # Every scripture element on the page, once each, in page order. An
            # element can be both a quoted ayah (data-ayah) and the dua: Yusuf's
            # dua IS 12:101 (<p class="arabic-text" data-ayah="12:101">), and
            # the extractor prints it once, so it is expected once. It is still
            # checked against the API as an ayah.
            found = {}                        # element start offset -> (label, text)
            for m in vs.STORY_AYAH.finditer(src):
                _, sura, ayah, body = m.groups()
                quote = re.sub(r'\s+', ' ', vs.n(re.sub(r'<[^>]+>', '', body)))
                ref = vs.n(json.load(urllib.request.urlopen(
                    f'https://api.alquran.cloud/v1/ayah/{sura}:{ayah}/quran-simple', timeout=30))['data']['text'])
                if f' {vs.letters(quote)} ' not in f' {vs.letters(ref)} ':
                    bad.append(f'{sura}:{ayah} on the page is not the wording of the ayah')
                found[m.start()] = (f'{sura}:{ayah}', quote)
            m = re.search(r'class="dua-box".*?(<p\b[^>]*class="arabic-text"[^>]*>)(.*?)</', src, re.S)
            if m:
                dua = re.sub(r'\s+', ' ', vs.n(re.sub(r'<[^>]+>', '', m.group(2))))
                if m.start(1) in found:       # the same element: one span, labelled as both
                    found[m.start(1)] = (found[m.start(1)][0] + ' (dua)', found[m.start(1)][1])
                else:
                    found[m.start(1)] = ('dua', dua)
            want = [found[k] for k in sorted(found)]
            if got != [q for _, q in want]:
                bad.append(f'{len(got)} spans vs {len(want)} on the page, or a span differs from the page')
            what = ' + '.join(f'{k} vs api.alquran.cloud' if k != 'dua' else 'dua' for k, _ in want) + ', verbatim from the page, each element once'
        if bad:
            problems += len(bad)
            print(f'{book:22} FAIL')
            for b in bad:
                print(f'    - {b}')
        else:
            print(f'{book:22} ok  ({what})' + (f'  [{style} in Uthmani spelling]' if style else ''))

print()
for v in volumes:
    built = PRINT / 'build' / f'{v["slug"]}-interior{sfx}.html'
    if not built.exists():
        print(f'{built.name:34} MISSING'); problems += 1; continue
    want = [s for b in v['books'] for s in spans(PRINT / 'books' / f'{b}.html')]
    got = spans(built)
    # every complete surah numbered 1..n in order, nothing on the Bismillah line
    numbering = []
    for panel in re.findall(r'<p class="sound ar verse"[^>]*>(.*?)</p>', built.read_text(encoding='utf-8'), re.S):
        nums = [int(x.translate(str.maketrans('٠١٢٣٤٥٦٧٨٩', '0123456789')))
                for x in re.findall(r'class="ayah-no">﴿([٠-٩]+)﴾', panel)]
        if nums and nums != list(range(1, len(nums) + 1)) and nums != [255]:   # 255: Ayat al-Kursi
            numbering.append(f'ayah numbers {nums}')
        if re.search(r'class="bism-line">((?!</span></span>).)*ayah-no', panel, re.S):
            numbering.append('a number on the Bismillah line')
        if nums:
            numbering.append(len(nums))
    bad_num = [x for x in numbering if isinstance(x, str)]
    runs = [x for x in numbering if isinstance(x, int)]
    if bad_num:
        problems += 1
        print(f'{built.name:34} FAIL  ' + '; '.join(bad_num))
    elif got == want:
        print(f'{built.name:34} ok  ({len(got)} spans, identical to the data, same order;'
              f' {len(runs)} complete surahs numbered 1..n: {sum(runs)} ayat)')
    else:
        problems += 1
        print(f'{built.name:34} FAIL  {len(got)} spans in the layout vs {len(want)} in the data')

print(f'\n{total} scripture spans in {sum(len(v["books"]) for v in volumes)} books: '
      + ('ALL PRINT SCRIPTURE MATCHES' if not problems else f'{problems} problem(s) found'))
sys.exit(1 if problems else 0)
