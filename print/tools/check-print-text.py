#!/usr/bin/env python3
"""Check a printed edition against the HTML it was rendered from.

  tools/check-print-text.py build/<book>.html print/<dir>/<book>.pdf [--min-pt 14]

Two things a PDF can get wrong without looking wrong:

  clipped  overflow:hidden drops the end of a long page silently. Each sheet's
           story lines (.line, .sound) must end on the matching PDF page, so the
           last three words of each are looked for there. [site] And the first
           three: a centred page that overflows loses its top too.
  safety   [site] every word box inside Lulu's 0.5in safety margin.
  small    every word's box height is turned into an approximate point size
           (box height / 1.41 for these fonts, checked against 13.5pt CSS).
           A page whose median story word is under --min-pt fails. 14pt is the
           floor for reading aloud from a printed page.

Needs pdftotext (poppler).
"""
import html, re, subprocess, sys, statistics, unicodedata

args = sys.argv[1:]
min_pt = 14.0
if '--min-pt' in args:
    i = args.index('--min-pt'); min_pt = float(args[i + 1]); del args[i:i + 2]
src, pdf = args

doc = open(src, encoding='utf-8').read()
sheets = re.split(r'<section class="sheet', doc)[1:]

def sig(w):
    """A word as its sorted base letters. pdftotext reorders letters inside
    some Arabic words (في comes back as يف) and returns presentation forms, so
    words are compared as bags of letters, without diacritics."""
    w = unicodedata.normalize('NFKC', w)
    w = ''.join(c for c in w if c.isalnum() and not unicodedata.combining(c))
    return ''.join(sorted(w.replace('ى', 'ي').replace('ة', 'ه').lower()))


def unmark(w):
    """[site] A PDF word with its harakat removed (NFKC first, so presentation
    forms of mark ligatures come apart into the marks they are)."""
    w = unicodedata.normalize('NFKC', w.replace('’', '').replace("'", ''))
    return ''.join(c for c in w if not unicodedata.combining(c) and not c.isspace())   # ﷺ expands to four words


def arabic_runs(boxes):
    """[site] Fully vowelled Quran text in Amiri comes out of Chrome as one
    glyph run per cluster, and pdftotext returns the pieces out of order:
    وَإِيَّاكَ is four fragments (إِ وَ يَّ كَا), الرَّحْمَٰنِ six, interleaved with
    the next word's. So Arabic fragments are put back where they are on the
    page: grouped into lines by baseline, read right to left, marks stripped,
    and every contiguous run of up to 12 fragments on one line counts as a
    word. A run must hold exactly a word's letters, so this finds words that
    are on the page without accepting letters scattered across it."""
    ar = [(x0, y0, x1, y1, unmark(w)) for x0, y0, x1, y1, w in boxes
          if re.search(r'[\u0600-\u06FF]', w)]
    ar = [b for b in ar if sig(b[4])]
    # a fragment joins a line when its box overlaps the line's first box by
    # 40% of the smaller height: a superscript alef (ىٰ) or a kasra drops a
    # fragment's box half a line, while neighbouring Amiri lines (pitch about
    # 1.8x the type size) do not overlap at all
    lines = []
    for b in sorted(ar, key=lambda b: (b[1] + b[3]) / 2):
        if lines:
            r = lines[-1][0]
            ov = min(r[3], b[3]) - max(r[1], b[1])
            if ov >= .4 * min(r[3] - r[1], b[3] - b[1]):
                lines[-1][1].append(b)
                continue
        lines.append([b, [b]])
    runs = set()
    for _, row in lines:
        row.sort(key=lambda b: -(b[0] + b[2]) / 2)          # right to left
        for i in range(len(row)):
            acc = ''
            for j in range(i, min(i + 12, len(row))):
                acc += row[j][4]
                runs.add(sig(acc))
    return runs

def words(t):
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t)).replace('’', '').replace("'", '')
    return [w for w in re.findall(r'[\w؀-ۿ]+', t) if sig(w)]

bbox = subprocess.run(['pdftotext', '-bbox', pdf, '-'], capture_output=True, text=True, check=True).stdout
pages = bbox.split('<page ')[1:]
if len(pages) != len(sheets):
    print(f'page count differs: {len(sheets)} sheets, {len(pages)} PDF pages'); sys.exit(1)

bad = 0
for n, (sheet, page) in enumerate(zip(sheets, pages), 1):
    boxes = [(float(x0), float(a), float(x1), float(b), html.unescape(w)) for x0, a, x1, b, w in
             re.findall(r'xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<', page)]
    # [site] Harakat are normalised away before comparing: every mark (fatha,
    # shadda, sukun, superscript alef...) is stripped from the PDF's words, as
    # sig() already strips them from the source, so a fragment that was only
    # a mark vanishes instead of breaking a run.
    toks = [x for *_, w in boxes for x in re.findall(r'[\w\u0600-\u06FF]+', unmark(w))]
    # pdftotext also splits some Arabic words in two (جدًا comes back as جًد ا)
    # or, around a shadda, in three (عَضّة comes back as َع ّض ة), so each run of
    # two or three neighbouring tokens counts as a word too
    on_page = ({sig(x) for x in toks} | {sig(a + b) for a, b in zip(toks, toks[1:])}
               | {sig(a + b + c) for a, b, c in zip(toks, toks[1:], toks[2:])})
    on_page |= arabic_runs(boxes)
    problems = []
    for para in re.findall(r'<p class="(?:line|sound)[^"]*"[^>]*>(.*?)</p>', sheet, re.S):
        tail = [w for w in words(para)][-3:]
        missing = [w for w in tail if sig(w) not in on_page]
        if missing:
            problems.append('clipped: …' + ' '.join(tail))
        # [site] the template centres a page's content, so an overflowing page
        # loses its top as well as its bottom: check the first words too (an
        # ayah must never lose its opening words either)
        head = [w for w in words(para)][:3]
        if [w for w in head if sig(w) not in on_page]:
            problems.append('clipped: ' + ' '.join(head) + '…')
    # [site] Lulu: no text outside the 0.5in safety margin (9pt bleed + 36pt).
    # An overflowing centred page can push words into the margin before
    # overflow:hidden clips them, and the words check would not see that.
    lo, hi = 9 + 36 - .5, 9 + 612 - 36 + .5
    out = [w for x0, y0, x1, y1, w in boxes if x0 < lo or y0 < lo or x1 > hi or y1 > hi]
    if out and 'sheet blank' not in sheet:
        problems.append(f'safety: {len(out)} word(s) outside the 0.5in safety margin: ' + ' '.join(out[:6]))
    # [site] the listen panel's captions are not story type. The template kept
    # them out by size (under 9pt); its Arabic captions, in Baloo's tall line
    # box, measure larger, so on a sheet with a listen panel every word from
    # "Scan to listen" down is left out of the median.
    scan = [y0 for _, y0, _, _, w in boxes if w == 'Scan'] if 'class="listen"' in sheet else []
    body = [bx for bx in boxes if not scan or bx[1] < min(scan) - 2]
    sizes = [(b - a) / 1.41 for _, a, _, b, _ in body if (b - a) / 1.41 >= 9]   # skip QR caption and folio
    if 'sheet blank' not in sheet and 'class="line' in sheet and sizes:
        med = statistics.median(sizes)
        if med < min_pt:
            problems.append(f'small: median {med:.1f}pt < {min_pt}pt')
    for p in problems:
        print(f'  p{n}: {p}'); bad += 1

print(f'{pdf}: {len(pages)} pages, ' + ('clean' if not bad else f'{bad} problem(s)'))
sys.exit(1 if bad else 0)
