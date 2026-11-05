"""Decode every QR in every print PDF and check it opens the right page.

Ported from ~/Work/bedtime-stories/tools/check-qr.py; same method and the same
counting rules. A QR that renders still looks like a QR when it is clipped,
wrong, or stale. The only proof is reading it back out of the finished PDF,
which is what this does: rasterise each page at 200dpi, decode, compare
against the URL that page should carry.

  uvx --with zxing-cpp --with pillow python tools/check-qr.py [<file.pdf>... | <page>]

With PDF paths, only those. With a page name (story-prophet-nuh), only that
book's PDFs and the volumes that hold it. With nothing, every PDF in print/.

Expected codes, as in Kids Night Stories:
  <page>-lulu-cover        1  (the back cover's listen panel: that page)
  <page>-lulu-interior     0  (its cover moved to the cover spread)
  vol-*-cover              1  (a shelf/hub code)
  vol-*-interior           1 per book inside (each section divider)
"""
import subprocess, sys, glob, json, tempfile
from pathlib import Path
import zxingcpp
from PIL import Image

PRINT = Path(__file__).resolve().parent.parent
UI = PRINT.parent / 'UI'
BASE = 'https://hisham-abuella.github.io/Interactive-Islamic-kids-website/UI'
SHELF = {f'{BASE}/', f'{BASE}/stories.html', f'{BASE}/quran.html'}
TMP = Path(tempfile.mkdtemp(prefix='qrpages-'))

# every story/surah page may point only at itself
ALLOWED = {}
for pat in ('story-prophet-*.html', 'surah-*.html', 'ayat-al-kursi.html'):
    for page in UI.glob(pat):
        ALLOWED[page.stem] = {f'{BASE}/{page.name}'}
# A bound volume carries one code per book, so its allowed set is the union of
# the books inside it, plus a shelf code on its cover.
VOLUMES = {v['slug']: v['books'] for v in json.loads((PRINT / 'tools' / 'volumes.json').read_text())}


def stem_of(pdf):
    s = Path(pdf).stem
    return s[:-len('-draft')] if s.endswith('-draft') else s


def book_of(name):
    for v in VOLUMES:
        if name.startswith(v + '-'):
            return v
    for b in sorted(ALLOWED, key=len, reverse=True):
        if name.startswith(b + '-'):
            return b
    return None


args = sys.argv[1:]
if args and all(a.endswith('.pdf') for a in args):
    pdfs = [str(Path(a).resolve()) for a in args]
else:
    pdfs = sorted(glob.glob(str(PRINT / '**' / '*.pdf'), recursive=True))
    if args:
        only = args[0]
        pdfs = [p for p in pdfs if book_of(stem_of(p)) == only
                or only in VOLUMES.get(book_of(stem_of(p)), [])]

rows, bad, total_codes = [], [], 0
for pdf in pdfs:
    name = stem_of(pdf)
    book = book_of(name)
    if not book:
        bad.append((name, 'cannot tell which book this is')); continue
    for f in TMP.glob('*.png'):
        f.unlink()
    subprocess.run(['pdftoppm', '-r', '200', '-png', pdf, str(TMP / 'p')],
                   check=True, capture_output=True)
    found = []
    for img in sorted(TMP.glob('*.png')):
        for r in zxingcpp.read_barcodes(Image.open(img)):
            if r.format == zxingcpp.BarcodeFormat.QRCode:
                found.append((img.stem, r.text))
    total_codes += len(found)
    if book in VOLUMES:
        want = 1 if name.endswith('-cover') else len(VOLUMES[book])
    elif '-lulu-interior' in name:
        want = 0
    else:
        want = 1
    if len(found) != want:
        bad.append((name, f'expected {want} QR, found {len(found)}'))
    allowed = set(SHELF) if book in VOLUMES else set()
    for b in VOLUMES.get(book, [book]):
        allowed |= ALLOWED[b]
    for page, text in found:
        if text not in allowed:
            bad.append((name, f'{page}: {text!r} is not a {book} link'))
    rows.append((Path(pdf).stem, len(found), want, sorted({t for _, t in found})))

print(f'{len(pdfs)} PDFs, {total_codes} QR codes decoded\n')
for name, n, want, urls in rows:
    mark = ' ' if n == want else '!'
    print(f'{mark} {name:52} {n}/{want} -> {", ".join(u.replace(BASE, "") or "/" for u in urls)}')
print()
if bad:
    print(f'{len(bad)} PROBLEM(S):')
    for n, m in bad:
        print(f'  {n}: {m}')
    sys.exit(1)
print('every QR decodes, and every one points at its own page')
