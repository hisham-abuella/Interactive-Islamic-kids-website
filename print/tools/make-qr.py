#!/usr/bin/env python3
"""Regenerate the printed QR codes.

Ported from ~/Work/bedtime-stories/tools/make-qr.py. Same settings: segno,
quartile error correction, dark #111010, and a viewBox injected — segno writes
width/height but no viewBox, and without one the symbol renders at its natural
size and the page clips it into something that will not scan.

  uvx --with segno python tools/make-qr.py [--offline]

Every printed URL is checked live first (HTTP 200) and nothing is written if
one fails: a code that opens a 404 is worse than no code. --offline skips that
check, for building with no network; never ship a book built that way.

A printed URL is permanent. Renaming a page breaks every copy already on a
shelf, so the list this writes (input/qr/URLS.txt) is the frozen record.
"""
import re, sys, urllib.request
from pathlib import Path
import segno

BASE = 'https://hisham-abuella.github.io/Interactive-Islamic-kids-website/UI'
PRINT = Path(__file__).resolve().parent.parent
UI = PRINT.parent / 'UI'
OUT = PRINT / 'input' / 'qr'
CODES = {
    # the shelf/hub codes, for volume covers
    'qr-shelf':         f'{BASE}/',
    'qr-shelf-stories': f'{BASE}/stories.html',
    'qr-shelf-quran':   f'{BASE}/quran.html',
}
# Every story and surah page gets qr-<page> without being listed: a new page
# has its code the moment it exists.
for pat in ('story-prophet-*.html', 'surah-*.html', 'ayat-al-kursi.html'):
    for page in sorted(UI.glob(pat)):
        CODES[f'qr-{page.stem}'] = f'{BASE}/{page.name}'

if '--offline' not in sys.argv:
    dead = []
    for name, url in CODES.items():
        try:
            req = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'make-qr'})
            code = urllib.request.urlopen(req, timeout=20).status
        except Exception as e:                      # noqa: BLE001
            code = getattr(e, 'code', str(e))
        if code != 200:
            dead.append((name, url, code))
    if dead:
        for name, url, code in dead:
            print(f'  {name}: {url} -> {code}', file=sys.stderr)
        print(f'{len(dead)} printed URL(s) do not load; no codes written.', file=sys.stderr)
        sys.exit(1)

OUT.mkdir(parents=True, exist_ok=True)
for name, url in CODES.items():
    q = segno.make(url, error='q')          # quartile: survives a chewed corner
    svg = q.svg_inline(scale=10, border=2, dark='#111010')
    size = (q.symbol_size(scale=10, border=2))[0]
    svg = re.sub(r'<svg ', f'<svg viewBox="0 0 {size} {size}" '
                           'preserveAspectRatio="xMidYMid meet" ', svg, count=1)
    (OUT / f'{name}.svg').write_text(svg)
    print(f'  {name:32} {url}')
(OUT / 'URLS.txt').write_text(
    '# Printed URLs. Frozen: a rename breaks every printed copy.\n'
    + ''.join(f'{n}\t{u}\n' for n, u in CODES.items()))
print(f'{len(CODES)} codes written to {OUT}' + ('' if '--offline' in sys.argv else ', every URL live (HTTP 200)'))
