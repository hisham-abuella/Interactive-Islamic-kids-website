#!/usr/bin/env python3
"""Turn one page of the site into the BOOK data tools/make-print.js reads.

  uvx --with beautifulsoup4 --with pillow python tools/extract-book.py \
      ../UI/story-prophet-nuh.html books/story-prophet-nuh.html [--art hi|draft]

This is the only part of the Kids Night Stories print pipeline that differs
for this site. Those books keep their words in a `BOOK` object inside the
page; this site keeps them in the page's HTML (English in the element, Arabic
in `data-ar`, or for Prophet Adam in translations.js via `data-i18n`). So the
page is read here and written back out as a small stub that holds
`var INK = …; var BOOK = {…}; var UI = {` — the exact slice make-print.js
evaluates — and everything after that (layout, cover, checks) is unchanged.

The words are copied from the page, never retyped, so print and screen cannot
drift. Scripture (verse cards, the full surah, a story's dua) is copied
character for character and wrapped in <span class="quran"> so it is set in
Amiri, the naskh face the site uses for Quran text.

Artwork:
  --art hi     (default) every picture must have a print master at
               input/img-hi/<stories|surahs>/<book>/<plate>.jpg; if any is
               missing this stops, rather than quietly printing the 960px web
               plate (which is under 300ppi in most boxes).
  --art draft  use the 960px web plates, converted to JPEG with DRAFT stamped
               across them, into input/img-draft/…-draft.jpg. For layout review
               only: check-lulu.sh is expected to fail the ppi check.

Pages with no plate (a lesson, a dua, a verse without a picture) get a small
vector ornament instead, so they never carry a raster image.

Prints one JSON line on stdout: the page count and the art it used/missed.
"""
import argparse, html as htmllib, json, re, subprocess, sys
from pathlib import Path
from bs4 import BeautifulSoup, NavigableString

PRINT = Path(__file__).resolve().parent.parent          # print/
UI = PRINT.parent / 'UI'

# The site's Illuminated Page palette (UI/styles.css), only the shades that
# clear 4.5:1 on the print paper #FCFBF6, so make-print.js never falls back to
# its pale-swatch treatment. One accent per story mood.
MOOD_TINT = {
    'dawn': '#8A6220',    # --gold-text
    'gold': '#7A5518',    # --gold-ink
    'earth': '#7A5518',
    'garden': '#0F6B65',  # --turquoise-deep
    'water': '#24508C',   # --cobalt
    'night': '#1B3C6B',   # --cobalt-deep
}
STORY_ACCENT = '#0F6B65'  # --turquoise-deep
SURAH_ACCENT = '#24508C'  # --cobalt (the site's Quran accent)

# A plain eight-point star in manuscript gold: the art for a page with no plate.
ORNAMENT = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">'
    '<g fill="none" stroke="#C08A2E" stroke-width="2.2" stroke-linejoin="round">'
    '<rect x="29" y="29" width="42" height="42"/>'
    '<rect x="29" y="29" width="42" height="42" transform="rotate(45 50 50)"/>'
    '<circle cx="50" cy="50" r="9"/></g></svg>')

EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️‍⃣←-⇿⌀-⏿]')


def clean(s):
    """Inline HTML kept (strong, em, br); emoji dropped, since a colour emoji
    prints as a bitmap and would turn up in the ppi check; whitespace folded."""
    s = EMOJI.sub('', s or '')
    return re.sub(r'\s+', ' ', s).strip()


def inner(el):
    return clean(el.decode_contents()) if el is not None else ''


_i18n = None
def i18n(key, lang):
    """Prophet Adam's page keeps its words in translations.js, by key."""
    global _i18n
    if _i18n is None:
        js = (UI / 'translations.js').read_text(encoding='utf-8')
        out = subprocess.run(['node', '-e', 'var window = {}, localStorage = {getItem() {}};\n' + js + '\nprocess.stdout.write(JSON.stringify(translations))'],
                             capture_output=True, text=True, check=True).stdout
        _i18n = json.loads(out)
    return _i18n[lang].get(key, '')


def en_of(el):
    if el is None:
        return ''
    keyed = el if el.has_attr('data-i18n') else el.find(attrs={'data-i18n': True})
    if keyed is not None and not el.has_attr('data-ar'):
        return clean(i18n(keyed['data-i18n'], 'en'))
    return inner(el)


def ar_quotes(fragment, quran_quote=False):
    """[site] Print-only: ASCII double quotes in Arabic text become «...», the
    Arabic print convention; inside a span the page marks as Quran
    (.quran-text), or for a whole paragraph that is one (quran_quote), they
    become the ornate brackets ﴿...﴾ used for verbatim Quran (scholar, 11-04).
    Only text nodes change, never markup or a <span class="quran"> ayah."""
    if '"' not in fragment:
        return fragment
    soup = BeautifulSoup(fragment, 'html.parser')
    state = {}
    for node in list(soup.find_all(string=True)):
        anc = [a.get('class') or [] for a in node.parents if getattr(a, 'get', None)]
        if any('quran' in c for c in anc):
            continue
        q = quran_quote or any('quran-text' in c for c in anc)
        pair = ('﴿', '﴾') if q else ('«', '»')
        out = []
        for ch in str(node):
            if ch == '"':
                k = pair[0]
                out.append(pair[1] if state.get(k) else pair[0])
                state[k] = not state.get(k)
            else:
                out.append(ch)
        node.replace_with(''.join(out))
    return str(soup)


def ar_of(el):
    if el is None:
        return ''
    if el.has_attr('data-ar'):
        return ar_quotes(clean(el['data-ar']))          # BeautifulSoup has already unescaped it
    keyed = el if el.has_attr('data-i18n') else el.find(attrs={'data-i18n': True})
    if keyed is not None:
        return ar_quotes(clean(i18n(keyed['data-i18n'], 'ar')),
                         quran_quote='quran-text' in (el.get('class') or []))
    return ''


def quran(s):
    return f'<span class="quran">{clean(s)}</span>' if s else ''


# ---- artwork ---------------------------------------------------------------
# [site] plates the scholar ruled must not print (tools/plate-rulings.json,
# "withheld"): the page prints as a page with no picture (its ayah in the gold
# panel) until the plate is re-rendered and re-reviewed. The same file lists
# the plates never to be used on a cover, which make-print.js reads.
RULINGS = json.loads((PRINT / 'tools' / 'plate-rulings.json').read_text(encoding='utf-8'))
used, missing, withheld = [], [], []
def art_for(src, mode):
    """src is the page's own path (images/stories/prophet-nuh/scene-1.webp).
    Returns the file make-print.js should print, relative to books/."""
    if not src:
        return None
    rel = Path(src).relative_to('images').with_suffix('')        # stories/prophet-nuh/scene-1
    if any(str(rel).endswith(w) for w in RULINGS['withheld']):
        withheld.append(str(rel))
        return None
    if mode == 'hi':
        master = PRINT / 'input' / 'img-hi' / rel.with_suffix('.jpg')
        if not master.exists():
            missing.append(str(master.relative_to(PRINT)))
            return None
        used.append(str(master.relative_to(PRINT)))
        return '../' + str(master.relative_to(PRINT))
    # draft: the 960px web plate, stamped so nobody mistakes it for print art
    from PIL import Image, ImageDraw, ImageFont
    web = UI / src
    out = PRINT / 'input' / 'img-draft' / (str(rel) + '-draft.jpg')
    if not out.exists() or out.stat().st_mtime < web.stat().st_mtime:
        out.parent.mkdir(parents=True, exist_ok=True)
        im = Image.open(web).convert('RGB')
        d = ImageDraw.Draw(im)
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf', 34)
        except OSError:
            font = ImageFont.load_default()
        label = 'DRAFT  -  960px web art, not for print'
        w = d.textlength(label, font=font)
        d.rectangle([0, im.height - 58, im.width, im.height], fill=(200, 30, 40))
        d.text(((im.width - w) / 2, im.height - 50), label, fill='white', font=font)
        im.save(out, 'JPEG', quality=90)
    used.append(str(out.relative_to(PRINT)))
    return '../' + str(out.relative_to(PRINT))


def page(en, ar, img=None, tint=None, cover=False):
    p = {'en': en, 'ar': ar, 'art': ORNAMENT}
    if img:
        p['img'] = img
    if tint:
        p['tint'] = tint
    if cover:
        p['cover'] = True
    return p


# ---- the "talk about it" page ----------------------------------------------
# The page's own quiz questions, without the multiple-choice options, as
# questions to talk over after reading. The questions are copied from the page
# (English text, Arabic data-ar / translations.js); only the heading is print
# furniture, like the template's "Scan to listen". It sits at the end of each
# book, where the template pads with blanks, so a volume's spare pages carry
# something to do instead of nothing.
TALK_EN, TALK_AR = 'Talk about it', 'هيّا نتحدّث'
AR_DIGITS = str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')


# [site] Questions whose answer rests on a hadith or sirah report the book does
# not print (scholar, 11-04 §6). A parent would supply the answer, and the
# common answers to some are weak narrations, so they are left out until the
# owner decides on a sourced "for grown-ups" answer line. Page -> the quiz's
# own question numbers (1-based).
TALK_DROP = {'surah-ad-duha': {2}, 'surah-an-nasr': {3}, 'surah-al-asr': {4},
             'surah-al-kawthar': {3}, 'ayat-al-kursi': {4}}
dropped = []


def talk(soup, scope, page_name=''):
    qs = soup.select(f'{scope} .quiz-question')
    drop = TALK_DROP.get(page_name, set())
    dropped.extend(f'{page_name} Q{i}: {en_of(q)}' for i, q in enumerate(qs, 1) if i in drop)
    qs = [q for i, q in enumerate(qs, 1) if i not in drop]
    if not qs:
        return []
    # each question its own block with a hanging number, aligned to the
    # start of its language (make-print.js .talk-page), not centred
    qn = lambda n, t: f'<span class="q"><span class="qn">{n}.</span> {t}</span>'
    en = ''.join(qn(i, en_of(q)) for i, q in enumerate(qs, 1))
    ar = ''.join(qn(str(i).translate(AR_DIGITS), ar_of(q)) for i, q in enumerate(qs, 1))
    return [dict(page({'name': TALK_EN, 'line': en, 'sound': ''},
                      {'name': TALK_AR, 'line': ar, 'sound': ''}), talk=True)]


# ---- a prophet story -------------------------------------------------------
def story(soup, mode, page_name=''):
    title = soup.select_one('.story-title')
    title_en, title_ar = en_of(title), ar_of(title)
    name = re.search(r'Prophet (\w+)', title_en)
    if name:   # the template colours one word of the title: the prophet's name
        title_en = title_en.replace(name.group(1), f'<em>{name.group(1)}</em>', 1)
    moral = soup.select_one('.moral-takeaway p')
    cover_src = None
    plate = soup.select_one('img.scene-plate')
    if plate is not None:
        cover_src = str(Path(plate['src']).parent / 'cover.webp')
        if not (UI / cover_src).exists():
            cover_src = plate['src']
    # The moral is the book's own advice, not a quotation: in a book that
    # quotes Quran and hadith, quotation marks would make it read as a saying
    # (scholar, 11-04), so they are dropped. A leading "!" (a screen RTL
    # workaround in translations.js) moves back to the end of the sentence.
    def unquote(t):
        t = re.sub(r'^\s*["«“]\s*|\s*["»”]\s*$', '', t)
        return t[1:].strip() + '!' if t.startswith('!') else t
    pages = [page(
        {'eyebrow': 'Stories of the Prophets', 'title': title_en, 'line': unquote(en_of(moral))},
        {'eyebrow': 'قصص الأنبياء', 'title': title_ar, 'line': unquote(ar_of(moral))},
        img=art_for(cover_src, mode), cover=True)]
    for sc in soup.select('.story-content .story-scene'):
        txt = sc.select_one('.scene-text')
        h2 = txt.find('h2')
        # the story itself: the scene's own paragraphs. Taps, quizzes, drag and
        # drop and the facts behind them are screen activities, not the story.
        paras = [p for p in txt.find_all('p', recursive=False) if 'highlight-text' not in (p.get('class') or [])]
        hl = txt.find('p', class_='highlight-text', recursive=False)
        img = sc.select_one('img.scene-plate')
        # An ayah quoted in the story (p.story-ayah, data-ayah="12:92") has no
        # English: on the page its meaning follows as p.story-ayah-meaning. So
        # in page order, the English line carries the meaning where the ayah
        # stood, and the Arabic line carries the ayah itself, copied
        # character for character and set in Amiri, then the page's gloss.
        # [site] (scholar M8) The ayah is set on its own centred line in ﴿ ﴾,
        # as the site sets it apart; the gloss «أي: ...» starts a new line, so
        # the boundary between Quran and explanation is plain; a reference
        # "(Surah Yusuf 12:92)" never breaks across lines.
        nowrap_ref = lambda t: re.sub(r'(\([^()]*\d[^()]*\)|\([^()]*[٠-٩][^()]*\))', r'<span class="nowrap">\1</span>', t)

        def en_part(p):
            cls = p.get('class') or []
            if 'story-ayah' in cls:
                return ''
            if 'story-ayah-meaning' in cls:
                return f'<span class="ayah-meaning">{nowrap_ref(en_of(p))}</span>'
            return en_of(p)

        def ar_part(p):
            cls = p.get('class') or []
            if 'story-ayah' in cls:
                return f'<span class="story-ayah">﴿{quran(p.get_text())}﴾</span>'
            if 'story-ayah-meaning' in cls:
                return f'<span class="ayah-gloss">{nowrap_ref(ar_of(p))}</span>'
            return ar_of(p)
        pages.append(page(
            {'name': en_of(h2), 'line': ' '.join(x for x in map(en_part, paras) if x), 'sound': en_of(hl)},
            {'name': ar_of(h2), 'line': ' '.join(x for x in map(ar_part, paras) if x), 'sound': ar_of(hl)},
            img=art_for(img['src'] if img else None, mode),
            tint=MOOD_TINT.get(sc.get('data-mood'))))
    lb = soup.select_one('.lesson-box')
    if lb is not None:
        h3 = lb.find('h3')
        # Ibrahim's lessons keep their Arabic in data-ar on .lesson-item, not on
        # the .lesson-text span inside it: reading the span printed an empty
        # Arabic side (scholar, 11-04)
        items = lb.select('li') or lb.select('.lesson-item') or lb.select('.lesson-text')
        pages.append(page(
            {'name': en_of(h3), 'line': '<br>'.join(en_of(i) for i in items), 'sound': ''},
            {'name': ar_of(h3), 'line': '<br>'.join(ar_of(i) for i in items), 'sound': ''}))
    db = soup.select_one('.dua-box')
    if db is not None:
        h3 = db.find('h3')
        pages.append(page(
            {'name': en_of(h3), 'line': en_of(db.select_one('.dua-note')),
             'sound': en_of(db.select_one('.dua-translation'))},
            {'name': ar_of(h3), 'line': ar_of(db.select_one('.dua-note')),
             'sound': quran(db.select_one('.arabic-text').get_text())}))
    pages += talk(soup, '.final-quiz-section', page_name)
    return clean(re.sub('<[^>]+>', '', title_en)), STORY_ACCENT, pages


# ---- a surah (or Ayat al-Kursi) --------------------------------------------
BISM_LETTERS = 'بسم الله الرحمن الرحيم'


def _letters(t):
    import unicodedata
    t = ''.join(c for c in unicodedata.normalize('NFC', t) if not unicodedata.combining(c) and c != 'ـ')
    return re.sub(r'\s+', ' ', t).strip()


def complete(text, page_name):
    """The complete surah, set for print. Each ayah is copied verbatim from the
    page's block (split at the page's own ۝ markers) into its own Amiri span,
    followed by its number in ornate brackets ﴿١﴾ (Arabic-Indic digits), in
    place of the page's unnumbered ۝. The Bismillah before a surah is not one
    of its ayat (Hafs), so it is set as its own centred line with no number;
    Al-Fatiha is the exception, where the page counts it as ayah 1, and it is
    numbered. At-Tawbah has none: the line is only set if the page has it.
    A block with no ۝ is printed as the page has it. Ayat al-Kursi is one
    ayah, so it carries its number in Al-Baqarah, ﴿٢٥٥﴾, not ﴿١﴾."""
    parts = [clean(x) for x in text.split('۝') if x.strip()]
    if '۝' not in text:
        return quran(text)
    bism = ''
    if page_name != 'surah-fatiha' and _letters(parts[0]) == BISM_LETTERS:
        bism = f'<span class="bism-line">{quran(parts.pop(0))}</span>'
    first = 255 if page_name == 'ayat-al-kursi' else 1
    ayat = ' '.join(f'{quran(a)}&nbsp;<span class="ayah-no">﴿{str(i).translate(AR_DIGITS)}﴾</span>'
                    for i, a in enumerate(parts, first))
    return bism + ayat


def surah(soup, mode, src_name=''):
    h1 = soup.select_one('.surah-hero h1')
    sub = soup.select_one('.surah-subtitle')
    sub_en = clean(re.sub(r'\s*-\s*<span lang="ar">.*?</span>', '', sub.decode_contents())) if sub else ''
    badges = [clean(b.get_text()) for b in soup.select('.surah-info > .info-badge')]
    badges_ar = []
    info = soup.select_one('.surah-info')
    if info is not None and info.has_attr('data-ar'):
        badges_ar = [clean(b.get_text()) for b in BeautifulSoup(info['data-ar'], 'html.parser').select('.info-badge')]
    plates = soup.select('figure.verse-plate img')
    cover_src = plates[0]['src'] if plates else None
    pages = [page(
        {'eyebrow': ' · '.join(badges[:2]), 'title': en_of(h1), 'line': sub_en},
        {'eyebrow': ' · '.join(badges_ar[:2]), 'title': ar_of(h1), 'line': ar_of(sub)},
        img=art_for(cover_src, mode), cover=True)]
    intro = soup.select_one('.intro-card')
    if intro is not None:
        h2 = intro.find('h2')
        ps = intro.find_all('p', recursive=False)
        pages.append(page(
            {'name': en_of(h2), 'line': ' '.join(en_of(p) for p in ps), 'sound': ''},
            {'name': ar_of(h2), 'line': ' '.join(ar_of(p) for p in ps), 'sound': ''}))
    # Ayat al-Kursi is one verse, taught in pieces: print calls each piece
    # "Part" / «المقطع», never «الجزء», which a Quran reader takes for a juz'
    # of the thirty (scholar and Arabic reviewer, 11-04).
    single = soup.select_one('.surah-hero h1').get('data-ar', '') == 'آية الكرسي'
    bism = soup.select_one('.bismillah-card')
    if bism is not None and single:
        # Reciting from the middle of a surah opens with the isti'adha (16:98);
        # the Bismillah is allowed. Headed "Before we recite" so the card does
        # not read as a piece of 2:255 (scholar, 11-04 §2). The isti'adha is a
        # formula, not an ayah, so it is set in Amiri but not as a quran span.
        pages.append(page(
            {'name': 'Before we recite',
             'line': '"I seek refuge with Allah from Satan, the outcast." '
                     + en_of(bism.select_one('.translation')),
             'sound': "A'oodhu billaahi minash-shaytaanir-rajeem. " + en_of(bism.select_one('.transliteration'))},
            {'name': 'قبل أن نقرأ', 'line': '',
             'sound': '<span class="istiadha">أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</span>'
                      + quran(bism.select_one('.arabic-large').get_text())}))
    elif bism is not None:
        pages.append(page(
            {'name': 'Bismillah', 'line': en_of(bism.select_one('.translation')),
             'sound': en_of(bism.select_one('.transliteration'))},
            {'name': 'البسملة', 'line': '', 'sound': quran(bism.select_one('.arabic-large').get_text())}))
    unit_en, unit_ar = ('Part', 'المقطع') if single else ('Verse', 'الآية')
    # A plate sits just before the verse card it belongs to.
    pending = None
    for el in soup.select('.verses-section figure.verse-plate, .verses-section .verse-card'):
        if el.name == 'figure':
            pending = el.find('img')['src']
            continue
        num = el.get('data-verse', '')
        expl = el.select_one('.verse-explanation p')
        tr = el.select_one('.translation')
        pages.append(page(
            {'name': f'{unit_en} {num}', 'line': (en_of(tr) + ' ' + en_of(expl)).strip(),
             'sound': en_of(el.select_one('.transliteration'))},
            {'name': f'{unit_ar} {num.translate(str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩"))}',
             'line': ar_of(expl), 'sound': quran(el.select_one('p.arabic').get_text())},
            img=art_for(pending, mode)))
        pending = None
    full = soup.select_one('.full-surah-card .arabic-full')
    if full is not None:
        # Since 2026-11-04 the site sets a non-Fatiha Bismillah in its own
        # span.full-bismillah with no ۝ (it is not an ayah, Hafs). complete()
        # splits at ۝, so close the span with one here to keep it a line apart.
        for b in full.select('.full-bismillah'):
            b.append('۝')
        sec = soup.select_one('.full-surah-section .section-title')
        pages.append(page(
            # the surah's own name heads the page, "Complete Surah" under it
            {'name': en_of(h1), 'line': en_of(sec), 'sound': ''},
            {'name': ar_of(h1), 'line': ar_of(sec), 'sound': complete(full.get_text(), src_name)}))
    pages += talk(soup, '.quiz-section', src_name)
    return en_of(h1), SURAH_ACCENT, pages


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src')
    ap.add_argument('out')
    ap.add_argument('--art', choices=['hi', 'draft'], default='hi')
    a = ap.parse_args()
    src = Path(a.src)
    soup = BeautifulSoup(src.read_text(encoding='utf-8'), 'html.parser')
    kind = 'story' if src.stem.startswith('story-') else 'surah'
    title, accent, pages = story(soup, a.art, src.stem) if kind == 'story' else surah(soup, a.art, src.stem)
    if missing:
        print(f'{src.name}: {len(missing)} picture(s) have no print master:', file=sys.stderr)
        for m in missing:
            print(f'  {m}', file=sys.stderr)
        print('Render them first (see claudeteam/reviews/book-plan-*.md, "print-art job"), or pass\n'
              '--art draft for a layout preview. Printing the 960px web plates would ship pages\n'
              'under 300ppi, so stopping.', file=sys.stderr)
        sys.exit(1)
    book = {src.stem: {'accent': accent, 'pages': pages}}
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="utf-8">'
        f'<title>{htmllib.escape(title)}</title></head>\n<body>\n'
        f'<!-- generated by print/tools/extract-book.py from UI/{src.name}; do not edit -->\n<script>\n'
        "var INK = '#111010';\n"
        f'var BOOK = {json.dumps(book, ensure_ascii=False, indent=1)};\n'
        'var UI = {};\n</script>\n</body>\n</html>\n', encoding='utf-8')
    print(json.dumps({'page': src.name, 'kind': kind, 'pages': len(pages), 'withheld': withheld, 'talk_dropped': dropped,
                      'plates': len({p['img'] for p in pages if 'img' in p}), 'art': a.art}))


if __name__ == '__main__':
    main()
