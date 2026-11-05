#!/usr/bin/env python3
"""Check a Lulu cover spread against the HTML it was rendered from.

  uvx --with zxing-cpp --with pillow python tools/check-cover-text.py \
      build/<stem>-cover.html <dir>/<stem>-cover.pdf

[site] New for this site's books. The ported check-print-text.py skips cover
spreads (as in Kids Night Stories), so a volume contents list that ran off the
front cover went unnoticed: the pilot's 8-entry Short Surahs II lost its last
three titles. This measures the finished PDF, the way check-print-text does:

  missing   every word of the spread's HTML (titles, contents list in both
            languages, back-cover lines, listen panel) must be in the PDF.
            Same word matching as check-print-text: letters compared as bags,
            harakat normalised away, neighbouring split fragments joined.
  safety    every word box, and the QR code, sits inside the 0.5in safety
            margin of its own half (back or front cover); nothing on the spine.
  barcode   nothing in Lulu's 92 x 32mm barcode area, bottom-right of the back
            cover, 0.5in in from the trim.

Needs pdftotext/pdftoppm (poppler), and zxing-cpp + pillow for the QR box.
"""
import html, re, subprocess, sys, tempfile, unicodedata
from pathlib import Path

PT = 72 / 25.4
TRIM, BLEED, SAFE = 8.5 * 72, 0.125 * 72, 0.5 * 72        # points
BAR_W, BAR_H = 92 * PT, 32 * PT

src, pdf = sys.argv[1:3]


def unmark(w):
    w = unicodedata.normalize('NFKC', w.replace('’', '').replace("'", ''))
    return ''.join(c for c in w if not unicodedata.combining(c) and not c.isspace())   # ﷺ expands to four words


def sig(w):
    w = ''.join(c for c in unmark(w) if c.isalnum())
    return ''.join(sorted(w.replace('ى', 'ي').replace('ة', 'ه').lower()))


def tokens(t):
    # split into words first: unmark() also drops whitespace (for ﷺ)
    return [unmark(x) for x in re.findall(r'[\w\u0600-\u06FF]+', t) if sig(x)]


# ---- what the HTML says is on the spread -----------------------------------
doc = open(src, encoding='utf-8').read()
body = doc[doc.index('<section class="spread">'):]
body = re.sub(r'<svg.*?</svg>', ' ', body, flags=re.S)
want = tokens(html.unescape(re.sub(r'<[^>]+>', ' ', body)))
entries = len(re.findall(r'<li>', body))

# ---- what the PDF has ------------------------------------------------------
bbox = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True, check=True).stdout
pg = re.search(r'<page width="([\d.]+)" height="([\d.]+)"', bbox)
W, H = float(pg.group(1)), float(pg.group(2))
spine = W - 2 * TRIM - 2 * BLEED
back = (BLEED, BLEED + TRIM)
front = (BLEED + TRIM + spine, W - BLEED)
boxes = [(float(a), float(b), float(c), float(d), html.unescape(w)) for a, b, c, d, w in
         re.findall(r'<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<', bbox)]
toks = [x for *_, w in boxes for x in tokens(w)]
on_page = ({sig(x) for x in toks} | {sig(a + b) for a, b in zip(toks, toks[1:])}
           | {sig(a + b + c) for a, b, c in zip(toks, toks[1:], toks[2:])})
arabic = lambda t: all('؀' <= ch <= 'ۿ' for ch in t)
for k in (4, 5):
    for i in range(len(toks) - k + 1):
        if all(arabic(t) for t in toks[i:i + k]):
            on_page.add(sig(''.join(toks[i:i + k])))

problems = []
missing = [w for w in want if sig(w) not in on_page]
if missing:
    problems.append(f'missing: {len(missing)} word(s) not on the spread: ' + ' '.join(missing[:12]))

top, bottom = BLEED + SAFE, BLEED + TRIM - SAFE
bar = (back[1] - SAFE - BAR_W, bottom - BAR_H, back[1] - SAFE, bottom)   # x0, y0, x1, y1


def where(x0, x1):
    if x1 <= back[1]:
        return 'back', back
    if x0 >= front[0]:
        return 'front', front
    return 'spine', None


low = {'back': 0.0, 'front': 0.0}
for x0, y0, x1, y1, w in boxes:
    side, (h0, h1) = where(x0, x1)[0], (where(x0, x1)[1] or (0, 0))
    if side == 'spine':
        problems.append(f'spine: "{w}" at x {x0:.0f}-{x1:.0f}pt'); continue
    if x0 < h0 + SAFE - .5 or x1 > h1 - SAFE + .5 or y0 < top - .5 or y1 > bottom + .5:
        problems.append(f'safety: "{w}" on the {side} at ({x0:.0f},{y0:.0f})-({x1:.0f},{y1:.0f})pt')
    if side == 'back' and x1 > bar[0] and x0 < bar[2] and y1 > bar[1] and y0 < bar[3]:
        problems.append(f'barcode: "{w}" in the 92x32mm barcode area')
    low[side] = max(low[side], y1)

# ---- the QR code: inside the back's safety, clear of the barcode area -------
qr_note = 'no QR code found'
try:
    import zxingcpp
    from PIL import Image
    dpi = 150
    tmp = Path(tempfile.mkdtemp(prefix='covercheck-'))
    subprocess.run(['pdftoppm', '-r', str(dpi), '-png', pdf, str(tmp / 'c')], check=True, stderr=subprocess.DEVNULL)
    img = Image.open(sorted(tmp.glob('c*.png'))[0])
    codes = zxingcpp.read_barcodes(img)
    for c in codes:
        p = c.position
        xs = [pt.x * 72 / dpi for pt in (p.top_left, p.top_right, p.bottom_left, p.bottom_right)]
        ys = [pt.y * 72 / dpi for pt in (p.top_left, p.top_right, p.bottom_left, p.bottom_right)]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        side, half = where(x0, x1)
        ok = (half is not None and x0 >= half[0] + SAFE - 1 and x1 <= half[1] - SAFE + 1
              and y0 >= top - 1 and y1 <= bottom + 1)
        clear = not (side == 'back' and x1 > bar[0] and x0 < bar[2] and y1 > bar[1] and y0 < bar[3])
        if not ok:
            problems.append(f'safety: QR code on the {side} at ({x0:.0f},{y0:.0f})-({x1:.0f},{y1:.0f})pt')
        if not clear:
            problems.append('barcode: QR code in the 92x32mm barcode area')
        qr_note = f'QR on the {side}, {(bar[0] - x1) / PT:.1f}mm left of the barcode area'
    if len(codes) != 1:
        problems.append(f'qr: {len(codes)} codes found, want 1')
except ImportError:
    qr_note = 'QR position not checked (run with uvx --with zxing-cpp --with pillow)'

for p in problems:
    print(f'  {p}')
fmt = lambda y: f'{(bottom - y) / PT:.1f}mm'
print(f'{pdf}: {len(want)} words, {entries} contents entries; lowest text '
      f'{fmt(low["front"])} above the front safety line, {fmt(low["back"])} on the back; {qr_note}; '
      + ('clean' if not problems else f'{len(problems)} problem(s)'))
sys.exit(1 if problems else 0)
