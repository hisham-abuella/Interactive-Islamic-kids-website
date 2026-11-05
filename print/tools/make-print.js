#!/usr/bin/env node
/**
 * Build a print-ready HTML edition of a story, for rendering to PDF.
 *
 *   node tools/make-print.js <book.html> <out.html> --url <listen-url> --qr <qr.svg>
 *   node tools/make-print.js <book.html> <out.html> --board ...   # board-book edition
 *
 * Reads the book's own page data rather than a second copy of the text: the
 * artwork and both languages are lifted straight out of the ART / BOOK objects,
 * so a printed edition can never drift from the screen one.
 *
 * One story page per sheet, artwork large, English and Arabic together, so a
 * single printed copy serves both. A QR on the cover opens the narrated version.
 *
 * Three formats:
 *   default   A5 portrait, no bleed — for printing at home on card and stapling.
 *   --board   180mm square trim with 3mm bleed, crop marks and a folio in the
 *             bleed, for printing single-sided on heavy card, laminating, and
 *             gluing back-to-back into a board book a baby can chew on. The
 *             square shape is what board books are: it sits open on its own and
 *             small hands can grip an edge without covering the picture.
 *   --lulu    Lulu's Square (8.5in trim, 0.125in bleed, 0.5in safety),
 *             saddle stitched. Their preflight rejects what the board edition
 *             depends on, so this format differs in four ways: no crop marks or
 *             folio ("do NOT include trim, bleed, or margin lines"), a 0.5in
 *             safety margin instead of 8mm, the front cover lifted out into its
 *             own spread (--cover), and the interior padded with blanks to a
 *             multiple of four, because a saddle-stitched sheet folds into four
 *             pages and Lulu would otherwise choose where the blanks land.
 */
/*
 * Ported unchanged from ~/Work/bedtime-stories/tools/make-print.js (Kids Night
 * Stories) so these books share its template, interior and cover. The input
 * side is print/tools/extract-book.py, which writes each site page out as the
 * BOOK slice this file reads. Additions, all marked "[site]":
 *   - Amiri for scripture (<span class="quran">), the naskh face the site uses
 *     for Quran text, beside the template's Baloo Bhaijaan for everyday Arabic;
 *   - --unit, so a volume cover can say "surahs" instead of "stories".
 * Owner-approved adaptations (2026-11-04), also marked "[site]", Lulu only:
 *   (a) a 16:9 picture box, because the site's plates are 16:9 and a square
 *       box letterboxed them;
 *   (b) the Arabic title on single covers, section dividers and volume covers;
 *   (c) the site's Illuminated Page colours (parchment paper, turquoise /
 *       cobalt accents, manuscript gold rules and frames) instead of the
 *       template's red and its frame colours;
 *   (d) a volume contents list that fits up to 8 entries in both languages;
 *   plus, for pages with no picture: the ayah (or dua) set as the page's
 *   picture in a gold-ruled panel, never over art and never split, and a slim
 *   ornament band on prose pages, instead of a large star in a picture box.
 * Grid, type pairing, type tiers, listen panel, cover structure, spine formula,
 * barcode zone and every Lulu rule are unchanged.
 */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

function arg(flag, fallback) {
    const i = process.argv.indexOf(flag);
    return i > -1 ? process.argv[i + 1] : fallback;
}
const has = (flag) => process.argv.indexOf(flag) > -1;

const [, , bookPath, outPath] = process.argv;
if (!bookPath || !outPath) {
    console.error('usage: make-print.js <book.html>[,<book2.html>...] <out.html> --url <url> --qr <qr.svg> [--board|--lulu] [--volume "Title"]');
    process.exit(1);
}
// Several books can be bound as one volume: pass them comma separated. Each
// book keeps its own cover as a section divider, and the volume gets a cover
// of its own that lists what is inside.
const bookPaths = bookPath.split(',').map(function (b) { return b.trim(); }).filter(Boolean);
const volumeTitle = arg('--volume', '');
const volumeTitleAr = arg('--volume-ar', '');
// [site] a short bilingual blurb for a volume's back cover
const blurb = arg('--blurb', ''), blurbAr = arg('--blurb-ar', '');
// [site] what a volume holds: "5 stories in one book", "10 surahs in one book"
const unit = arg('--unit', 'stories');
// A volume's cover can carry its own pictures instead of the first story's:
// Yusuf's Animals and Colours puts Susu in with the zoo on the front and has
// her waving goodbye on the back.
const frontArt = arg('--front-art', '');
const longPages = has('--long');
const backArt = arg('--back-art', '');
// A frame around each half of the cover spread, so the cream page sits inside
// a border instead of running bare to the trim:
//   --frame mat:#8FB58A   a plain band of that colour, like a picture mat
//   --frame islamic[:#hex] gold eight-point stars on night blue (or #hex)
const frame = arg('--frame', '');
// Perfect bound needs a spine; saddle stitch folds and has none. Lulu's own
// generic template ships a 0.1321in spine, which is their formula at the
// 32-page minimum — at 40 pages it is wrong, so it is computed here instead.
const binding = arg('--binding', 'perfect') === 'saddle' ? 'saddle' : 'perfect';
const listenUrl = arg('--url', '');
const qrPath = arg('--qr', '');
const board = has('--board');
// Lulu's Small Square, saddle stitched. Their numbers, in inches, because the
// trim is specified in inches and rounding it through mm moves the cut line.
const lulu = has('--lulu');
// Which Arabic sits under the English: the fusha the books are written in, or
// the Egyptian of the مصري switch. Same page, same picture, different column.
const dialect = arg('--dialect', 'ar') === 'eg' ? 'eg' : 'ar';
const arOf = (p) => (dialect === 'eg' && p.eg) ? p.eg : p.ar;
const arLang = dialect === 'eg' ? 'ar-EG' : 'ar';
const coverSpread = has('--cover');
// which artwork: the hand-drawn SVG the book opens with, or the generated
// illustrations behind the book's own artwork toggle
const useImages = arg('--art', 'drawn') === 'images';
const IN = 25.4;
const trim = Number(arg('--trim', lulu ? 8.5 * IN : 180));        // finished page, mm square
const bleed = Number(arg('--bleed', lulu ? 0.125 * IN : 3));      // trimmed off; artwork runs into it
const safe = Number(arg('--safe', lulu ? 0.5 * IN : 8));          // keep words this far inside the trim
const sheet = trim + bleed * 2;
// both square formats share a geometry; only the numbers and the marks differ
const square = board || lulu;

// ---- lift the data out of the book ------------------------------------------
// Everything from the colour constants to the UI strings is pure data: template
// literals and object literals, no DOM. Evaluating just that slice gives us the
// real artwork and text without duplicating either.
const html = fs.readFileSync(bookPaths[0], 'utf8');
const from = html.indexOf('var INK =');
const to = html.indexOf('var UI = {');
if (from < 0 || to < 0) {
    console.error('could not find the data section in', bookPath);
    process.exit(1);
}
// The child the copy is printed for. On screen the name is typed in; on paper
// it is fixed, so --name / --name-ar swap it into every babyname span. Which one
// a span gets is decided by the script already inside it.
const nameEn = arg('--name', ''), nameAr = arg('--name-ar', '');
function withName(src) {
    if (!nameEn && !nameAr) return src;
    return src.replace(/(<span class=\\?"babyname\\?">)([^<]*)(<\/span>)/g, function (m, a, was, b) {
        const ar = /[؀-ۿ]/.test(was);
        return a + ((ar ? nameAr : nameEn) || was) + b;
    });
}
function readBook(file) {
    const h = fs.readFileSync(file, 'utf8');
    const a = h.indexOf('var INK ='), b = h.indexOf('var UI = {');
    if (a < 0 || b < 0) {
        console.error('could not find the data section in', file);
        process.exit(1);
    }
    const box = { console };
    vm.createContext(box);
    vm.runInContext(withName(h.slice(a, b)), box);
    return { file: file, BOOK: box.BOOK,
             title: (h.match(/<title>([^<]*)<\/title>/) || [, 'Story'])[1] };
}
const volume = bookPaths.map(readBook);
const BOOK = volume[0].BOOK;

// A book with more than one chapter gets a code per chapter cover, so the
// colour zoo opens the colour chapter rather than the front of the book. The
// per-chapter file sits beside the default one as <name>-<chapter>.svg.
// In a volume each book carries its own code, so the file is derived from the
// book rather than taken from one --qr flag. The zoo's is named for the story,
// not the file, and its two chapters each have their own.
const QR_NAME = { 'black-white-zoo': 'qr-zoo' };
function qrFor(chapter, bk) {
    const dir = qrPath ? path.dirname(qrPath) : path.join('input', 'qr');
    const slug = path.basename((bk && bk.file) || bookPaths[0], '.html');
    const base = QR_NAME[slug] || ('qr-' + slug);
    for (const f of [path.join(dir, `${base}-${chapter}.svg`), path.join(dir, `${base}.svg`), qrPath]) {
        if (f && fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
    }
    return '';
}

// The book stores generated artwork as a path relative to itself; the print
// file usually lives a directory down, so re-base it. Missing files fall back
// to the drawing rather than printing a hole.
// Everything is resolved against the repo root and then made relative to
// wherever the print file is being written. The books moved into books/ and
// the artwork into input/, so the two are no longer siblings and the old
// "rebase onto the book's directory" shortcut quietly produced paths that
// pointed inside books/.
const outDir = path.dirname(path.resolve(outPath));
// Per book, not per run: a volume's books could live in different folders,
// and dirname() of the comma-joined list silently landed a level too deep.
const dirOf = (bk) => path.dirname(path.resolve((bk && bk.file) || bookPaths[0]));
const fromOut = (repoRel) => path.relative(outDir, path.resolve(repoRel));
const ownArt = (rel) => `<img src="${fromOut(rel)}" alt="">`;

// [site] does this page print a picture (rather than an ornament)?
const hasPicture = (page, bk) => /^<img/.test(artworkOf(page, bk));
// [site] the site's Illuminated Page palette (UI/styles.css)
const SITE = { turquoiseDeep: '#0F6B65', cobalt: '#24508C', cobaltDeep: '#1B3C6B',
               gold: '#C08A2E', goldLight: '#E0B75C', goldText: '#8A6220',
               goldWash: '#F7EDD8', parchment: '#FBF6EA' };
// [site] a slim ornament band for a prose page with no picture: a gold rule,
// an eight-point star, a gold rule. It marks the page without taking it over.
const BAND = `<svg viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="none" stroke="${SITE.gold}" stroke-width="1.2" stroke-linejoin="round">
  <path d="M8 12 H100 M140 12 H232"/><circle cx="4" cy="12" r="1.6"/><circle cx="236" cy="12" r="1.6"/>
  <rect x="113" y="5" width="14" height="14"/><rect x="113" y="5" width="14" height="14" transform="rotate(45 120 12)"/>
  <circle cx="120" cy="12" r="3"/></g></svg>`;
// [site] the small star at each corner of a verse panel
const CORNER = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <g fill="${SITE.parchment}" stroke="${SITE.gold}" stroke-width="1.1" stroke-linejoin="round">
  <rect x="4" y="4" width="12" height="12"/><rect x="4" y="4" width="12" height="12" transform="rotate(45 10 10)"/></g></svg>`;
const corners = () => ['tl', 'tr', 'bl', 'br'].map((c) => `<i class="corner ${c}">${CORNER}</i>`).join('');
// [site] the ayah's size in the panel goes down with its length, never below
// 17pt (the Arabic floor is 15pt). Measured on the longest ayah and the
// longest complete surah in the five volumes.
function verseTier(t) {
    const n = String(t).replace(/<[^>]+>/g, '').length;
    return n <= 50 ? 'v1' : n <= 100 ? 'v2' : n <= 200 ? 'v3' : n <= 450 ? 'v4' : n <= 800 ? 'v5' : 'v6';
}
const isScripture = (s) => /class="quran"/.test(s || '');
// [site] plate rulings (tools/plate-rulings.json, from islamic-content-scholar):
// a plate on "never_on_cover" is never a front, back or divider picture
const RULINGS = JSON.parse(fs.readFileSync(path.join(__dirname, 'plate-rulings.json'), 'utf8'));
const ruled = (img) => RULINGS.never_on_cover.some((r) => (img || '').replace(/\\/g, '/').replace(/(-draft)?\.jpg$/, '').endsWith(r));
const coverPic = (page, bk) => hasPicture(page, bk) && !ruled(page.img);
// [site] what a book's narration reads, for the listen panel. The voice reads
// the stories, and the meanings on a surah page; it does not recite the Quran
// (UI/surah-narration.js), so the copy must not say "every page read aloud".
const kindOf = (bk) => /^story-/.test(path.basename((bk && bk.file) || bookPaths[0])) ? 'stories' : 'surahs';
const LISTEN = {
    stories: ['Every story read aloud, in English and Arabic.', 'استمع إلى كل قصة بالعربية والإنجليزية.'],
    surahs: ['The meaning of every page read aloud, in English and Arabic.', 'استمع إلى معنى كل صفحة بالعربية والإنجليزية.'],
};
const TAGLINE = {
    stories: ['Every page in English and Arabic, with a voice that reads each story aloud.', 'كل صفحة بالعربية والإنجليزية، ومعها صوت يقرأ لك القصة.'],
    surahs: ['Every page in English and Arabic, with a voice that reads the meanings aloud.', 'كل صفحة بالعربية والإنجليزية، ومعها صوت يقرأ لك معانيها.'],
};
const shortUrl = () => esc(listenUrl.replace(/^https?:\/\//, '').split('/').slice(0, 2).join('/'));
const listenPanel = (qr, kind) => !qr ? '' : `<div class="listen">
      <div class="qr">${qr}</div>
      <div class="listen-text">
        <b>Scan to listen</b>
        <b class="ar" dir="rtl" lang="ar">امسح الرمز واستمع</b>
        <span>${LISTEN[kind][0]}</span>
        <span class="ar" dir="rtl" lang="ar">${LISTEN[kind][1]}</span>
        <span class="url">${shortUrl()}</span>
      </div>
    </div>`;
// [site] "5 surahs in one book" in Arabic: 3-10 with a feminine plural noun
// (قصص, سور) take the bare form of the number word
const AR_COUNT = { 3: 'ثلاث', 4: 'أربع', 5: 'خمس', 6: 'ست', 7: 'سبع', 8: 'ثماني', 9: 'تسع', 10: 'عشر' };
const volEyebrow = (k) => `${k} ${unit} in one book`;
const volEyebrowAr = (k) => `${AR_COUNT[k] || String(k).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])} ${unit === 'stories' ? 'قصص' : 'سور'} في كتاب واحد`;
// [site] the adab note (islamic-content-scholar's text, 11-04): these books
// hold whole surahs but are not a mushaf, so no wudu rule is imposed; the
// family is told how to treat and retire them
const ADAB = ['This book contains verses of the Holy Quran. Please keep it somewhere clean, not on the floor or in the bathroom. When it is worn out, do not put it in the bin: ask a grown-up to dispose of it respectfully.',
    'يحتوي هذا الكتاب على آيات من القرآن الكريم، فاحفظه في مكان نظيف، ولا تضعه على الأرض ولا تدخل به الخلاء. وإذا بَلِيَ فلا تُلقِه في القمامة، بل اطلب من أحد الكبار أن يتخلّص منه بطريقة لائقة.'];
const leadTier = (t) => { const n = String(t).replace(/<[^>]+>/g, '').length; return n <= 60 ? 'l1' : n <= 120 ? 'l2' : 'l3'; };

function artworkOf(page, bk) {
    if (useImages && page.img) {
        // page.img is written relative to the book ("../images-susu/x.png"),
        // so normalise it back to a repo-relative path first.
        const asset = path.relative(process.cwd(), path.resolve(dirOf(bk), page.img));
        // prefer a JPEG made for print: the same picture at a twentieth of the
        // bytes, which is the difference between a mailable PDF and a 14MB one
        const jpg = path.join('input', 'img', asset.replace(/\.png$/, '.jpg'));
        // Lulu wants 300ppi minimum. The shipped art is 1024px, which is 241ppi
        // inside a 108mm box, so the print build looks first for the 1536px
        // re-render in input/img-hi. Falling through to the 1024px copy would
        // pass preflight on the small stages and fail on the large ones, so
        // build-lulu.sh refuses to run until the hi-res set is complete.
        const hi = path.join('input', 'img-hi', asset.replace(/\.png$/, '.jpg'));
        for (const rel of (lulu ? [hi, jpg, asset] : [jpg, asset])) {
            if (fs.existsSync(rel)) {
                return `<img src="${fromOut(rel)}" alt="">`;
            }
        }
    }
    return page.art;
}
const esc = (s) => String(s == null ? '' : s);

// A page's accent is its own colour, which is the whole point — but printed as
// text on cream paper, pale colours vanish. White scored 1.04 against the paper
// and yellow 1.75, so "WHITE" came out white on white. Anything under 4.5:1 gets the name
// set in a bordered swatch of its own colour instead of as coloured text.
function luminance(hex) {
    const h = String(hex).replace('#', '');
    const c = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
        .map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
    const la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
// [site] the paper is the site's parchment, so pale-accent contrast is measured on it
const PAPER_HEX = lulu ? '#FBF6EA' : '#FCFBF6';
const isPale = (hex) => { try { return contrast(hex, PAPER_HEX) < 4.5; } catch (e) { return false; } };
// the screen version marks the child's name with a span; print it plainly
const plain = (s) => esc(s).replace(/<span class="babyname">([^<]*)<\/span>/g, '$1');

// Crop marks and the folio live inside the bleed, so the trim knife removes
// them. They are the only way to cut a stack of card squarely by hand, and the
// folio is the only way to keep forty loose sheets in order while gluing.
const marks = (n) => !board ? '' : `
    <i class="mark tl"></i><i class="mark tr"></i><i class="mark bl"></i><i class="mark br"></i>
    <i class="folio">${n}</i>`;

// [site] a title with its markup removed, for the Arabic title lines
const plainTitle = (t) => plain(esc(t)).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// [site] a cover with no plate (Al-Fatiha, Al-Ikhlas): the Arabic title, large,
// in Amiri inside the same gold-ruled panel the verse pages use
const titlePanel = (page) => `<div class="title-panel">${corners()}
      <p class="title-ar" dir="rtl" lang="ar">${plainTitle(arOf(page).title)}</p>
    </div>`;

const sheets = [];
let n = 0;
// The front cover is the book's first cover page. A multi-chapter book has
// more than one — the colour zoo's second chapter opens with its own — and
// those stay in the interior, where they belong.
let front = null;
// Every chapter cover across the whole volume, for the contents list on the
// volume cover: the zoo alone contributes two, Susu one, and so on.
const chapters = [];
for (const bk of volume) {
  for (const key of Object.keys(bk.BOOK)) {
    for (const page of bk.BOOK[key].pages) {
        if (page.cover) chapters.push({ page: page, book: bk, key: key });
    }
  }
}
for (const bk of volume) {
  const BOOK = bk.BOOK;
  for (const key of Object.keys(BOOK)) {
    for (const page of BOOK[key].pages) {
        const accent = page.tint || BOOK[key].accent || (lulu ? SITE.turquoiseDeep : '#D7263D');   // [site]
        n += 1;
        if (page.cover) {
            const qr = qrFor(key, bk);
            if (!front) front = { page, qr, book: bk };
            // Lulu takes the cover as its own spread file, so it must not also
            // appear as interior page one. A volume has a cover of its own, so
            // every chapter cover stays inside as a divider.
            if (lulu && !volumeTitle && front.page === page) continue;
            // [site] the book's accent colours the title word (the template's
            // cover fell back to its own red); the Arabic title is set under the
            // English one; a cover with no plate gets a typographic title panel.
            const pic = !lulu || coverPic(page, bk);
            sheets.push(`
  <section class="sheet cover${lulu && plainTitle(page.en.title).length > 40 ? ' long-title' : ''}" style="--accent:${BOOK[key].accent || SITE.turquoiseDeep}">${marks(n)}
    ${pic ? `<div class="art${lulu ? ' wide' : ''}">${artworkOf(page, bk)}</div>` : titlePanel(page)}
    <div class="words">
      <p class="eyebrow">${plain(page.en.eyebrow)}</p>
      ${lulu && arOf(page).eyebrow ? `<p class="eyebrow ar" dir="rtl" lang="${arLang}">${plain(arOf(page).eyebrow)}</p>` : ''}
      <h1>${plain(page.en.title).replace(/<em>/g, '<em>')}</h1>
      ${lulu && pic ? `<h1 class="ar" dir="rtl" lang="${arLang}">${plainTitle(arOf(page).title)}</h1>` : ''}
      <p class="line">${plain(page.en.line)}</p>
      <p class="line ar" dir="rtl" lang="${arLang}">${plain(arOf(page).line)}</p>
    </div>
    ${lulu ? listenPanel(qr, kindOf(bk)) : qr ? `<div class="listen">
      <div class="qr">${qr}</div>
      <div class="listen-text">
        <b>Scan to listen</b>
        <span>Every page read aloud, in English and Arabic.</span>
        <span class="url">${shortUrl()}</span>
      </div>
    </div>` : ''}
  </section>`);
        } else {
            // the longest pages (the hadith page) overflow at full size:
            // give them a smaller stage and tighter type rather than clipping
            // [site] a page with no picture: scripture becomes the picture, in a
            // gold-ruled panel (so it is not counted in the words' load); a
            // prose page gets the ornament band. A page with a plate is the
            // template's page, the ayah last as its "sound".
            const pic = !lulu || hasPicture(page, bk);
            const verse = !pic && isScripture(arOf(page).sound);
            const load = (page.en.line + page.en.sound + arOf(page).line + (verse ? '' : arOf(page).sound)).length;
            // the square board page has less height to spare than A5, so it
            // needs a middle setting between a full stage and a cramped one
            // thresholds are measured, not guessed: on the square page a full
            // stage starts pushing the last line off at about 115 characters once
            // the type was enlarged,
            // and a snug stage at about 245
            // and a dense one at about 330. A book written long (--long: a
            // 4-year-old's book runs 40-70 words a side) gets one more tier
            // past that, "long", which gives the words the page: a smaller
            // picture so the type stays at 14pt English / 15pt Arabic, the floor
            // for reading aloud from print. Opt-in, because Susu's hadith page
            // is longer than Yaseen's shortest and its layout is already right.
            // [site] a picture page whose ayah runs past 150 letters (Al-Bayyinah 5,
            // 176) takes the template's own long tier: vowelled Amiri stands taller
            // than the template's Arabic face, and at dense the last line reached
            // 2pt into the safety margin (found by check-print-text's safety test)
            // So does a story page quoting an ayah inside its Arabic line (Yusuf
            // 12:92): the Amiri run lifts that paragraph's line height.
            const longAyah = lulu && pic && ((isScripture(arOf(page).sound)
                && String(arOf(page).sound).replace(/<[^>]+>/g, '').length > 150)
                || isScripture(arOf(page).line));
            const dense = ((longPages || longAyah) && load > 330) ? ' dense long' : load > 245 ? ' dense' : (load > 115 ? ' snug' : '');
            const pale = isPale(accent) ? ' pale' : '';
            // [site] a picture page's ayah comes straight after the picture,
            // before the explanation, in its own thin gold rules and larger than
            // the prose (scholar, 11-04: the text of Allah first, then what it means)
            const lead = lulu && pic && isScripture(arOf(page).sound);
            const stage = pic ? `<div class="art${lulu ? ' wide' : ''}">${artworkOf(page, bk)}</div>${lead ? `
    <div class="ayah-lead ${leadTier(arOf(page).sound)}"><p class="sound ar verse" dir="rtl" lang="ar">${plain(arOf(page).sound)}</p></div>` : ''}`
                : verse ? `<div class="verse-panel ${verseTier(arOf(page).sound)}">${corners()}
      <p class="sound ar verse" dir="rtl" lang="ar">${plain(arOf(page).sound)}</p>
    </div>`
                : `<div class="band">${BAND}</div>`;
            const kind = (pic ? '' : verse ? ' verse-page' : ' prose-page') + (page.talk ? ' talk-page' : '') + (lead ? ' lead-page' : '') + (lulu && pic && isScripture(arOf(page).line) ? ' ayah-inline' : '');
            sheets.push(`
  <section class="sheet${dense}${pale}${kind}" style="--accent:${accent}">${marks(n)}
    ${stage}
    <div class="words">
      <h2>${plain(page.en.name)}</h2>
      ${page.en.line ? `<p class="line">${plain(page.en.line)}</p>` : ''}
      ${page.en.sound ? `<p class="sound">${plain(page.en.sound)}</p>` : ''}
      <hr>
      <h2 class="ar" dir="rtl" lang="${arLang}">${plain(arOf(page).name)}</h2>
      ${arOf(page).line ? `<p class="line ar" dir="rtl" lang="${arLang}">${plain(arOf(page).line)}</p>` : ''}
      ${!verse && !lead && arOf(page).sound ? `<p class="sound ar" dir="rtl" lang="${arLang}">${plain(arOf(page).sound)}</p>` : ''}
    </div>
  </section>`);
        }
    }
  }
}

const title = volumeTitle || (html.match(/<title>([^<]*)<\/title>/) || [, 'Story'])[1];

// ---- the cover spread -------------------------------------------------------
// Lulu wants one page holding back cover, spine and front cover. Saddle stitch
// has no spine — the sheets fold rather than stack against a flat edge — so the
// spread is simply two trims side by side. The QR moves to the back, which is
// where a reader looks for it anyway.
// How many interior pages this volume will have — needed on the cover, which
// is built as its own file and so cannot just count its own sheets.
function interiorPages() {
    let n = 0;
    for (const bk of volume) {
        for (const key of Object.keys(bk.BOOK)) {
            for (const page of bk.BOOK[key].pages) {
                if (lulu && !volumeTitle && page.cover && front && front.page === page) continue;
                n += 1;
            }
        }
    }
    if (lulu && volumeTitle) n += 1;   // [site] the volume's title page (adab note)
    while (n % 4) n += 1;        // the blanks the interior adds
    return n;
}
// Lulu: spine (in) = pages / 444 + 0.06
const spineMm = (binding === 'saddle' || !lulu) ? 0 : (interiorPages() / 444 + 0.06) * IN;
const spreadW = trim * 2 + spineMm + bleed * 2;

// ---- the cover frame --------------------------------------------------------
// The band is one pattern tile wide, and the tile divides the trim exactly, so
// a whole row of stars runs along every trimmed edge and none is cut in half
// at a corner. Lulu may trim up to 0.125in either way, so the band can come out
// a little uneven — a band this wide still reads as a frame when it does.
const tile = trim / 20;
const band = frame ? tile : 0;
// The panel's own padding: words keep the full safety margin from the trim and
// a clear 6mm from the panel's edge, whichever is further in.
const pad = Math.max(safe, band + 6);
function islamicTile() {
    // An eight-point star (two squares, one turned 45°) in the middle, with
    // lines out to the tile's edges that join it to its neighbours.
    const c = 20, R = 11, r = 6;
    const pts = [];
    for (let i = 0; i < 16; i++) {
        const a = Math.PI / 8 * i - Math.PI / 2, d = i % 2 ? r : R;
        pts.push((c + d * Math.cos(a)).toFixed(2) + ' ' + (c + d * Math.sin(a)).toFixed(2));
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>` +
        `<g fill='none' stroke='${SITE.goldLight}' stroke-width='1.1' stroke-linejoin='round'>` +
        `<path d='M${pts.join(' L')} Z'/>` +
        `<rect x='15' y='15' width='10' height='10' transform='rotate(45 20 20)'/>` +
        `<path d='M20 0 V${c - R} M20 ${c + R} V40 M0 20 H${c - R} M${c + R} 20 H40'/>` +
        // a quarter of a small diamond in each corner: four tiles make one
        `<path d='M4 0 L0 4 M36 0 L40 4 M0 36 L4 40 M36 40 L40 36'/>` +
        `</g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
const frameCss = (function () {
    if (!frame || !coverSpread) return '';
    const islamic = frame.split(':')[0] === 'islamic';
    const colour = frame.split(':')[1] || (islamic ? '#1F3557' : '#8FB58A');
    const line = islamic ? SITE.gold : 'rgba(17,16,16,.28)';   // [site] manuscript gold
    const pattern = islamic ? `background-image:${islamicTile()};background-size:${tile}mm ${tile}mm;` : '';
    return `
  /* the frame: the band is the half's own background, the page a panel on it */
  .spread,.spine{background:${colour}}
  .half{position:relative;background-color:${colour};${pattern}}
  .half.back{background-position:${bleed}mm ${bleed}mm}
  .half.front{background-position:0 ${bleed}mm}
  .half::before{
    content:"";position:absolute;z-index:0;top:${bleed + band}mm;bottom:${bleed + band}mm;
    background:var(--paper);border-radius:${islamic ? 2 : 4}mm;
    box-shadow:inset 0 0 0 1.4mm var(--paper),inset 0 0 0 ${islamic ? 2.1 : 1.8}mm ${line}${islamic ? `,0 0 0 .6mm ${line}` : ''};
  }
  .half.back::before{left:${bleed + band}mm;right:${band}mm}
  .half.front::before{left:${band}mm;right:${bleed + band}mm}
  .half > *{position:relative;z-index:1}`;
})();

// The contents list: every chapter in the volume, in reading order, in both
// languages. This is what makes a bound volume legible from the outside —
// "Animals and Colours" means nothing until it says Black & White, Fifteen
// Colours, Susu the Cat underneath it.
const stripTags = (t) => plain(esc(t)).replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
// [site] one convention for a prophet's name across a volume's contents: no
// "(peace be upon him)" in the English titles (the pages give it on some and
// not others), and عليه السلام after the name in every Arabic title.
const contentsEn = (t) => stripTags(t).replace(/\s*\(peace be upon (him|them)\)/gi, '');
const contentsAr = (t) => stripTags(t).replace(/النبي\s+([^\s]+)(\s+عليه السلام)?/,
    // no-break spaces: the honorific stays on the name's line, never split in two
    (m, name) => `النبي ${name} عليه السلام`);
const contentsList = () => chapters.map(function (c) {
    return `<li><span class="ch-en">${contentsEn(c.page.en.title)}</span>` +
           `<span class="ch-ar" dir="rtl" lang="${arLang}">${contentsAr(arOf(c.page).title)}</span></li>`;
}).join('');

if (coverSpread) {
    if (!front) {
        console.error('no cover page found in', bookPaths.join(','));
        process.exit(1);
    }
    const { page: c } = front;
    // [site] a volume whose first book has no plate (Short Surahs I opens with
    // Al-Fatiha) takes its front picture from the first book that has one
    const volPic = (lulu && volumeTitle && !frontArt)
        ? chapters.map((ch) => ({ page: ch.page, book: ch.book })).find((ch) => coverPic(ch.page, ch.book))
        : null;
    // [site] a volume's back cover takes a second plate from inside the volume
    // (the next book with a picture after the front's), so the back is not
    // bare paper above the listen panel
    const frontImg = volPic || (coverPic(c, front.book) ? { page: c } : null);
    const backPic = (lulu && volumeTitle && !backArt)
        ? chapters.find((ch) => coverPic(ch.page, ch.book) && (!frontImg || ch.page !== frontImg.page))
        : null;
    // A volume holds several stories, so its cover opens the shelf rather than
    // dropping the reader into whichever one happens to be first.
    // --cover-qr gives a volume its own code: Noah's First Words opens his
    // card on the shelf, not the shelf's top.
    const shelfQr = arg('--cover-qr', '')
        || path.join(qrPath ? path.dirname(qrPath) : path.join('input', 'qr'), 'qr-shelf.svg');
    const qr = (volumeTitle && fs.existsSync(shelfQr))
        ? fs.readFileSync(shelfQr, 'utf8') : front.qr;
    sheets.length = 0;
    sheets.push(`
  <section class="spread">
    <div class="half back">
      <div class="back-top">
        ${volumeTitle ? `
        <p class="eyebrow">${volEyebrow(chapters.length)}</p>
        <p class="eyebrow ar" dir="rtl" lang="ar">${volEyebrowAr(chapters.length)}</p>
        <h2 class="back-title">${esc(volumeTitle)}</h2>
        ${volumeTitleAr ? `<p class="line ar" dir="rtl" lang="${arLang}">${esc(volumeTitleAr)}</p>` : ''}
        <p class="line">${TAGLINE[unit === 'stories' ? 'stories' : 'surahs'][0]}</p>
        <p class="line ar" dir="rtl" lang="ar">${TAGLINE[unit === 'stories' ? 'stories' : 'surahs'][1]}</p>
        ${blurb ? `<p class="line blurb">${esc(blurb)}</p>` : ''}
        ${blurbAr ? `<p class="line ar blurb" dir="rtl" lang="${arLang}">${esc(blurbAr)}</p>` : ''}` : `
        <p class="eyebrow">${plain(c.en.eyebrow)}</p>
        ${lulu && arOf(c).eyebrow ? `<p class="eyebrow ar" dir="rtl" lang="${arLang}">${plain(arOf(c).eyebrow)}</p>` : ''}
        <h2 class="back-title">${stripTags(c.en.title)}</h2>
        ${lulu ? `<p class="back-title ar" dir="rtl" lang="${arLang}">${stripTags(arOf(c).title)}</p>` : ''}
        <p class="line">${plain(c.en.line)}</p>
        <p class="line ar" dir="rtl" lang="${arLang}">${plain(arOf(c).line)}</p>`}
      </div>
      ${backArt ? `<div class="art back-art">${ownArt(backArt)}</div>`
        : backPic ? `<div class="art wide back-art">${artworkOf(backPic.page, backPic.book)}</div>` : ''}
      ${lulu ? listenPanel(qr, volumeTitle ? (unit === 'stories' ? 'stories' : 'surahs') : kindOf(front.book)) : qr ? `<div class="listen">
        <div class="qr">${qr}</div>
        <div class="listen-text">
          <b>Scan to listen</b>
          <span>Every page read aloud, in English and Arabic.</span>
          <span class="url">${shortUrl()}</span>
        </div>
      </div>` : ''}
    </div>
    ${spineMm ? '<div class="spine" aria-hidden="true"></div>' : ''}
    <div class="half front${chapters.length > 4 ? ' many' : ''}" style="--accent:${front.book.BOOK[Object.keys(front.book.BOOK)[0]].accent || SITE.turquoiseDeep}">
      ${volumeTitle ? `
      ${frontArt ? `<div class="art${lulu ? ' wide' : ''}">${ownArt(frontArt)}</div>`
        : volPic ? `<div class="art${lulu ? ' wide' : ''}">${artworkOf(volPic.page, volPic.book)}</div>`
        : `<div class="art">${artworkOf(c, front.book)}</div>`}
      <div class="words">
        <p class="eyebrow">${volEyebrow(chapters.length)}</p>
        ${lulu ? `<p class="eyebrow ar" dir="rtl" lang="ar">${volEyebrowAr(chapters.length)}</p>` : ''}
        <h1>${esc(volumeTitle)}</h1>
        ${volumeTitleAr ? `<h1 class="ar" dir="rtl" lang="${arLang}">${esc(volumeTitleAr)}</h1>` : ''}
        <ul class="contents">${contentsList()}</ul>
      </div>` : `
      ${!lulu || coverPic(c, front.book) ? `<div class="art${lulu ? ' wide' : ''}">${artworkOf(c, front.book)}</div>` : titlePanel(c)}
      <div class="words">
        <p class="eyebrow">${plain(c.en.eyebrow)}</p>
        ${lulu && arOf(c).eyebrow ? `<p class="eyebrow ar" dir="rtl" lang="${arLang}">${plain(arOf(c).eyebrow)}</p>` : ''}
        <h1>${plain(c.en.title)}</h1>
        ${lulu && coverPic(c, front.book) ? `<h1 class="ar" dir="rtl" lang="${arLang}">${stripTags(arOf(c).title)}</h1>` : ''}
        <p class="line">${plain(c.en.line)}</p>
        <p class="line ar" dir="rtl" lang="${arLang}">${plain(arOf(c).line)}</p>
      </div>`}
    </div>
  </section>`);
}

// A bound volume opens on its own cover, not on the first story's. Lulu takes
// that cover as a separate file; everything else wants it as page one.
if (volumeTitle && !coverSpread && !lulu) {
    sheets.unshift(`
  <section class="sheet cover volume-cover">
    <div class="art">${frontArt ? ownArt(frontArt) : artworkOf(front.page, front.book)}</div>
    <div class="words">
      <p class="eyebrow">${esc(chapters.length)} ${unit} in one book</p>
      <h1>${esc(volumeTitle)}</h1>
      ${volumeTitleAr ? `<h1 class="ar" dir="rtl" lang="${arLang}">${esc(volumeTitleAr)}</h1>` : ''}
      <ul class="contents">${contentsList()}</ul>
    </div>
  </section>`);
}

// [site] a Lulu volume opens on a title page: the volume's name in both
// languages and the adab note, in the gold-ruled panel
if (volumeTitle && lulu && !coverSpread) {
    sheets.unshift(`
  <section class="sheet title-page" style="--accent:${volume[0].BOOK[Object.keys(volume[0].BOOK)[0]].accent || SITE.turquoiseDeep}">
    <div class="band">${BAND}</div>
    <div class="words">
      <p class="eyebrow">${volEyebrow(chapters.length)}</p>
      <p class="eyebrow ar" dir="rtl" lang="ar">${volEyebrowAr(chapters.length)}</p>
      <h1>${esc(volumeTitle)}</h1>
      ${volumeTitleAr ? `<h1 class="ar" dir="rtl" lang="${arLang}">${esc(volumeTitleAr)}</h1>` : ''}
    </div>
    <div class="adab">${corners()}
      <p class="line">${ADAB[0]}</p>
      <p class="line ar" dir="rtl" lang="ar">${ADAB[1]}</p>
    </div>
  </section>`);
}

// ---- blanks to a multiple of four -------------------------------------------
// A saddle-stitched sheet folds into four pages, so the interior count has to
// be a multiple of four. Lulu will add the blanks itself if we don't, but then
// they land wherever its imposition puts them; added here they land at the end.
let padded = 0;
if (lulu && !coverSpread) {
    while (sheets.length % 4) { sheets.push('\n  <section class="sheet blank"></section>'); padded += 1; }
}

// ---- geometry ---------------------------------------------------------------
const page = coverSpread
    ? `@page { size: ${spreadW}mm ${sheet}mm; margin: 0; }   /* back + front spread, no spine: saddle stitch has none */`
    : square
        ? `@page { size: ${sheet}mm ${sheet}mm; margin: 0; }   /* ${trim}mm square trim + ${bleed}mm bleed */`
        : `@page { size: 148mm 210mm; margin: 0; }   /* A5 portrait — two to a sheet of A4 */`;

const geometry = square ? `
  .sheet{
    width:${sheet}mm; height:${sheet}mm; padding:${bleed + safe}mm;
    position:relative;
  }
  /* a baby is looking at the picture, not the words: give it the page */
  .sheet:not(.cover){justify-content:center}
  .art{width:108mm;height:108mm}
  .sheet.snug .art{width:82mm;height:82mm}
  .sheet.snug h2{font-size:27pt}
  .sheet.snug h2.ar{font-size:24pt}
  .sheet.snug .line{font-size:15pt;line-height:1.34}
  .sheet.snug .line.ar{font-size:15pt;line-height:1.56}
  .sheet.snug .sound{font-size:17pt}
  .sheet.dense .art{width:72mm;height:72mm}
  .words{margin-top:5mm}
  h1{font-size:38pt}
  h2{font-size:31pt}
  h2.ar{font-size:27pt}
  .line{font-size:17pt;line-height:1.38}
  .line.ar{font-size:17pt;line-height:1.62}
  .sound{font-size:19pt}
  .sheet.dense h2{font-size:24pt}
  .sheet.dense h2.ar{font-size:21pt}
  .sheet.dense .line{font-size:13.5pt;line-height:1.32}
  .sheet.dense .line.ar{font-size:14pt;line-height:1.52}
  .sheet.dense .sound{font-size:15pt}
  .sheet.dense .words{margin-top:4mm;gap:1.5mm}
  .sheet.long .art{width:56mm;height:56mm}
  .sheet.long h2{font-size:20pt}
  .sheet.long h2.ar{font-size:19pt}
  .sheet.long .line{font-size:14pt;line-height:1.3}
  .sheet.long .line.ar{font-size:15pt;line-height:1.45}
  .sheet.long .sound{font-size:14pt}
  .sheet.long .words{margin-top:3mm;gap:1.2mm}
  /* the cover also carries the title block and the 34mm QR panel: at a full
     stage the panel ran off the bottom of the square page and the QR was
     clipped to the point where it would not scan */
  .cover .art{width:66mm;height:66mm}
  .cover h1{font-size:34pt}

  /* Lulu's 0.5in safety margin takes 9.4mm more off each side than the board
     edition's 8mm, so every stage comes down to match. Measured, not guessed. */
  ${lulu ? `
  /* Lulu's Square is 8.5in, a good 25mm wider than the board edition, and this
     block spends that room. Everything here is measured, not chosen: the type
     was enlarged first, then each stage grown back until the tightest page in
     either volume had a few millimetres left. The board edition keeps the
     smaller scale above, because 180mm cannot carry this one. */
  h1{font-size:46pt}
  h2{font-size:36pt}
  h2.ar{font-size:31pt}
  .line{font-size:20pt;line-height:1.4}
  .line.ar{font-size:20pt;line-height:1.65}
  .sound{font-size:22pt}
  .sheet.snug h2{font-size:32pt}
  .sheet.snug h2.ar{font-size:28pt}
  .sheet.snug .line{font-size:18.5pt;line-height:1.38}
  .sheet.snug .line.ar{font-size:18.5pt;line-height:1.6}
  .sheet.snug .sound{font-size:20pt}
  .sheet.dense h2{font-size:28pt}
  .sheet.dense h2.ar{font-size:25pt}
  .sheet.dense .line{font-size:16pt;line-height:1.34}
  .sheet.dense .line.ar{font-size:16.5pt;line-height:1.55}
  .sheet.dense .sound{font-size:18pt}
  .art{width:98mm;height:98mm}
  .sheet.snug .art{width:93mm;height:93mm}
  .sheet.dense .art{width:88mm;height:88mm}
  .sheet.long .art{width:66mm;height:66mm}
  .sheet.long .line{font-size:16pt;line-height:1.32}
  .sheet.long .line.ar{font-size:17pt;line-height:1.48}
  .sheet.long .sound{font-size:16pt}
  .cover .art{width:76mm;height:76mm}
  .words{margin-top:5mm}
  .sheet.blank{background:var(--paper)}

  /* [site] (a) 16:9 picture boxes. The site's plates are 1.78:1 and the
     template's square boxes letterboxed them; each tier keeps the template's
     order (full > snug > dense > long) and is shorter than the square it
     replaces, so no page has less room for words than before. A 1700px-wide
     print master lands at 308-432ppi in every one of these boxes. */
  .art.wide{width:140mm;height:78.75mm}
  .sheet.snug .art.wide{width:132mm;height:74.25mm}
  .sheet.dense .art.wide{width:124mm;height:69.75mm}
  .sheet.long .art.wide{width:104mm;height:58.5mm}
  .sheet.pale .art.wide{width:116mm;height:65.25mm}
  /* a divider also carries the Arabic title, eyebrow and a bilingual listen
     panel: 110mm keeps the longest story divider inside the safety margin */
  .cover .art.wide{width:110mm;height:61.875mm}
  .art.wide img{object-fit:cover}

  /* [site] a page with no picture. Prose gets a slim ornament band; scripture
     becomes the picture, in a gold-ruled panel on a pale gold wash (never over
     art), sized down with its length but never under 17pt (Arabic floor 15pt). */
  .band{width:110mm;height:11mm;flex:none}
  .band svg{width:100%;height:100%;display:block}
  .prose-page .words{margin-top:4mm}
  .verse-panel,.title-panel{
    position:relative;flex:none;width:100%;max-width:174mm;padding:7mm 12mm;
    background:var(--gold-wash);border-radius:1.5mm;
    box-shadow:inset 0 0 0 .6mm var(--gold),inset 0 0 0 1.5mm var(--gold-wash),inset 0 0 0 1.8mm var(--gold);
  }
  .corner{position:absolute;width:7mm;height:7mm}
  .corner svg{width:100%;height:100%;display:block}
  .corner.tl{top:-2.4mm;left:-2.4mm} .corner.tr{top:-2.4mm;right:-2.4mm}
  .corner.bl{bottom:-2.4mm;left:-2.4mm} .corner.br{bottom:-2.4mm;right:-2.4mm}
  .verse-panel .verse{color:var(--ink);text-align:center;margin:0;font-weight:400}
  .verse-panel .verse .quran{line-height:1.95}
  .v1 .verse{font-size:36pt} .v2 .verse{font-size:31pt} .v3 .verse{font-size:26pt}
  .v4 .verse{font-size:22pt} .v5 .verse{font-size:18pt}
  .v6 .verse{font-size:17pt} .v6 .verse .quran{line-height:1.85}
  .verse-page .words{margin-top:6mm}
  /* [site] the complete surah: the Bismillah on its own centred line, with no
     number (it is not an ayah of the surah, except in Al-Fatiha), and each
     ayah followed by its number in ornate brackets, never split from it */
  .verse .bism-line{display:block;margin-bottom:.15em}
  .verse .ayah-no{font-family:"Amiri Print",serif;white-space:nowrap;color:${SITE.goldText}}
  .title-panel{max-width:150mm;padding:9mm 12mm}
  .title-ar{font-family:"Amiri Print",serif;font-weight:700;font-size:46pt;line-height:1.5;margin:0;color:var(--ink);text-align:center}
  .cover .title-panel{max-width:130mm;padding:5mm 10mm}
  .cover .title-ar{font-size:40pt}

  /* [site] a picture page's ayah, first after the picture, between thin gold rules */
  .ayah-lead{flex:none;width:100%;max-width:172mm;margin-top:4mm;padding:1.6mm 0;
    border-top:.35mm solid var(--gold);border-bottom:.35mm solid var(--gold)}
  .ayah-lead .verse{color:var(--ink);text-align:center;margin:0;font-weight:400}
  .ayah-lead .verse .quran{line-height:1.8}
  .ayah-lead.l1 .verse{font-size:23pt} .ayah-lead.l2 .verse{font-size:20pt} .ayah-lead.l3 .verse{font-size:18pt}
  .lead-page .words{margin-top:3mm}
  /* the ayah under the picture costs about 20mm of height, so a lead page's
     picture comes down a step (still 300ppi+ from a 1700px master) */
  .lead-page .art.wide{width:120mm;height:67.5mm}
  .sheet.snug.lead-page .art.wide{width:112mm;height:63mm}
  .sheet.dense.lead-page .art.wide{width:104mm;height:58.5mm}
  .sheet.long.lead-page .art.wide{width:92mm;height:51.75mm}
  /* [site] the isti'adha before Ayat al-Kursi: its own line, Amiri */
  .verse .istiadha{display:block;font-family:"Amiri Print",serif;margin-bottom:.1em}
  /* [site] an ayah quoted in a story (Yusuf 12:92): its own centred line in
     ﴿ ﴾, the gloss on the next line, the reference never broken */
  .line .story-ayah{display:block;font-family:"Amiri Print",serif;font-size:1.1em;margin:1mm 0}
  .line .story-ayah .quran{line-height:1.8}
  .line .ayah-gloss,.line .ayah-meaning{display:block;margin-bottom:1mm}
  .nowrap{white-space:nowrap}
  /* a story page that sets an ayah on its own line (Yusuf 12:92, Musa 20:12)
     gives its picture back for it: 84mm wide, 514ppi from a 1700px master */
  .sheet.ayah-inline .art.wide{width:84mm;height:47.25mm}
  /* ...and when it is also a long page (Yusuf's reunion: the story, 12:92,
     its meaning and the note on bowing), one step more, still over the
     14pt EN / 15pt AR floor; 76mm is 568ppi from a 1700px master */
  .sheet.long.ayah-inline .art.wide{width:76mm;height:42.75mm}
  .sheet.long.ayah-inline .line{font-size:15pt;line-height:1.28}
  .sheet.long.ayah-inline .line.ar{font-size:16pt;line-height:1.42}
  .sheet.long.ayah-inline .sound{font-size:15pt}
  .sheet.long.ayah-inline h2{font-size:19pt}
  .sheet.long.ayah-inline h2.ar{font-size:18pt}
  /* [site] talk page: each question its own line with a hanging number,
     aligned to the start of its language (not centred) */
  .talk-page .line{text-align:start;width:100%;max-width:170mm;margin-inline:auto}
  .talk-page .q{display:block;padding-inline-start:1.5em;text-indent:-1.5em;margin-bottom:1.5mm}
  .talk-page .qn{display:inline-block;min-width:1.5em;text-indent:0}
  /* [site] the volume title page and its adab note */
  .title-page{justify-content:center}
  .title-page .words{margin:6mm 0 10mm;gap:2.5mm}
  .title-page h1{font-size:34pt}
  .title-page h1.ar{font-size:34pt}
  .adab{position:relative;flex:none;max-width:160mm;padding:7mm 11mm;background:var(--gold-wash);border-radius:1.5mm;
    box-shadow:inset 0 0 0 .6mm var(--gold),inset 0 0 0 1.5mm var(--gold-wash),inset 0 0 0 1.8mm var(--gold);
    display:flex;flex-direction:column;gap:3mm;text-align:center}
  .adab .line{font-size:14pt;line-height:1.45}
  .adab .line.ar{font-size:15pt;line-height:1.7}
  .eyebrow.ar{font-family:var(--ar);letter-spacing:0;text-transform:none;font-size:10pt}

  /* [site] (b) the Arabic title under the English one */
  h1.ar{font-family:var(--ar);font-weight:700;line-height:1.25;font-size:30pt}
  .cover h1.ar{font-size:28pt}
  /* a divider whose English title runs past ~40 letters (Ibrahim's) wraps to
     two lines; it is set a size down so the listen panel stays in the margin */
  .cover.long-title h1{font-size:28pt}
  .cover.long-title h1.ar{font-size:24pt}
  /* [site] (c) the rule between the languages in manuscript gold */
  hr{border-top-color:rgba(192,138,46,.6)}
  ` : ''}

  /* crop marks and folio sit in the bleed — the trim removes them */
  .qr{width:34mm;height:34mm}
  .listen-text b{font-size:12pt}
  .mark{position:absolute;width:${bleed}mm;height:${bleed}mm;border:0 solid rgba(17,16,16,.55)}
  .mark.tl{top:0;left:0;border-top-width:.25mm;border-left-width:.25mm}
  .mark.tr{top:0;right:0;border-top-width:.25mm;border-right-width:.25mm}
  .mark.bl{bottom:0;left:0;border-bottom-width:.25mm;border-left-width:.25mm}
  .mark.br{bottom:0;right:0;border-bottom-width:.25mm;border-right-width:.25mm}
  .folio{
    position:absolute;bottom:.4mm;left:50%;transform:translateX(-50%);
    font-family:var(--body);font-style:normal;font-size:5pt;color:rgba(17,16,16,.5);
  }
` : `
  .sheet{
    width:148mm; height:210mm; padding:12mm 12mm 10mm;
  }
  .art{width:108mm;height:108mm}
  /* text-heavy pages: the artwork yields, the words stay whole */
  .sheet.snug .art{width:88mm;height:88mm}
  .sheet.dense .art{width:74mm;height:74mm}
  .sheet.snug h2{font-size:23pt}
  .sheet.snug h2.ar{font-size:19pt}
  .sheet.snug .line{font-size:12pt;line-height:1.32}
  .sheet.snug .line.ar{font-size:12.5pt;line-height:1.55}
  .sheet.snug .sound{font-size:14pt}
  .sheet.dense h2{font-size:20pt}
  .sheet.dense h2.ar{font-size:17pt}
  .sheet.dense .line{font-size:11pt;line-height:1.3}
  .sheet.dense .line.ar{font-size:11.5pt;line-height:1.5}
  .sheet.dense .sound{font-size:12.5pt}
  .sheet.dense .words{margin-top:4mm;gap:1.5mm}
  .words{margin-top:6mm}
  h1{font-size:30pt}
  h2{font-size:26pt}
  h2.ar{font-size:22pt}
  .line{font-size:13pt;line-height:1.35}
  .line.ar{font-size:13pt;line-height:1.6}
  .sound{font-size:15pt}
  .cover .art{width:96mm;height:96mm}
  .cover h1{font-size:34pt}
`;

fs.writeFileSync(outPath, `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400..700&family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..700&family=Fredoka:wght@400..600&display=swap">
<style>
  /* [site] the full Amiri 1.003 (print/fonts, OFL), self-hosted and not
     subset: Google's unicode-range subsets split "space + pause mark" across
     two faces and the marks ۚ ۖ ۗ printed in Geeza Pro */
  @font-face{font-family:"Amiri Print";src:url("${fromOut('fonts/Amiri-Regular.ttf')}") format("truetype");font-weight:400;font-style:normal}
  @font-face{font-family:"Amiri Print";src:url("${fromOut('fonts/Amiri-Bold.ttf')}") format("truetype");font-weight:700;font-style:normal}
  @font-face{font-family:"Salawat";src:url("${fromOut('fonts/Amiri-Regular.ttf')}") format("truetype");unicode-range:U+FDFA}
  ${page}
  :root{
    --ink:#111010; --paper:${lulu ? SITE.parchment : '#FCFBF6'}; --quiet:#7E7A6E; --accent:${lulu ? SITE.turquoiseDeep : '#D7263D'};
    --gold:${SITE.gold}; --gold-wash:${SITE.goldWash};   /* [site] */
    /* [site] "Salawat" is Amiri restricted to U+FDFA, first in every stack, so
       every ﷺ is Amiri's (Fredoka, Fraunces and Baloo Bhaijaan have no ﷺ, and
       Chrome fell back to Geeza Pro / Noto Kufi for it) */
    /* Arabic inside an English line (At-Tin 2: "Musa عليه السلام") falls
       to Baloo Bhaijaan, not to a system face */
    --display:"Salawat","Fraunces","Baloo Bhaijaan 2",Georgia,serif;
    --body:"Salawat","Fredoka","Baloo Bhaijaan 2",system-ui,sans-serif;
    --ar:"Salawat","Baloo Bhaijaan 2",system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--paper);color:var(--ink);font-family:var(--body)}

  .sheet{
    display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
    page-break-after:always; break-after:page; overflow:hidden; background:var(--paper);
  }
  .sheet:last-child{page-break-after:auto;break-after:auto}

  .art{display:flex;align-items:center;justify-content:center;flex:none}
  .art svg,.art img{width:100%;height:100%;display:block;object-fit:contain}
  .art img{border-radius:3mm}
  .art svg.breathe{animation:none!important}

  .words{text-align:center;width:100%;display:flex;flex-direction:column;gap:2mm}
  h1{font-family:var(--display);font-weight:900;line-height:1;margin:0}
  h1 em{font-style:normal;color:var(--accent)}
  h2{font-family:var(--display);font-weight:900;line-height:1;margin:0;
     text-transform:uppercase;letter-spacing:.02em;color:var(--accent)}
  h2.ar{font-family:var(--ar);text-transform:none;letter-spacing:0;line-height:1.3}
  .line{margin:0}
  .line.ar{font-family:var(--ar)}
  .sound{font-family:var(--display);font-style:italic;font-weight:600;margin:0;color:var(--accent)}

  /* Pale colours cannot be read as text on cream, so the name sits inside a
     swatch of the colour with an ink keyline. It is more legible than coloured
     type and it shows the colour itself, which is what the page is teaching. */
  .pale h2{
    color:var(--ink); background:var(--accent);
    border:.5mm solid var(--ink); border-radius:2mm;
    padding:.02em .4em; width:fit-content; margin-inline:auto;
  }
  .pale .sound{color:var(--ink)}
  /* the keyline and padding cost a few millimetres of height, so a swatched
     page gives them back from the picture rather than running off the bottom */
  .sheet.pale .art{width:75mm;height:75mm}
  .sheet.pale.snug .art{width:68mm;height:68mm}
  .sheet.pale.dense .art{width:63mm;height:63mm}
  .sound.ar{font-family:var(--ar);font-style:normal;font-weight:700}
  /* [site] scripture is set in Amiri, as on the site, never in the display face */
  .quran{font-family:"Amiri Print",serif;font-weight:400;font-style:normal;line-height:1.7}
  .eyebrow{font-family:var(--display);font-size:8pt;letter-spacing:.2em;text-transform:uppercase;color:var(--quiet);margin:0}
  hr{border:none;border-top:.4mm solid rgba(17,16,16,.14);width:38mm;margin:3mm auto 1mm}

  .listen{
    margin-top:auto;display:flex;align-items:center;gap:5mm;width:100%;
    border-top:.4mm solid rgba(17,16,16,.16);padding-top:5mm;
  }
  .qr{width:30mm;height:30mm;flex:none}
  .qr svg{width:100%;height:100%;display:block}
  .listen-text{display:flex;flex-direction:column;gap:1mm;text-align:left}
  .listen-text b{font-size:11pt}
  .listen-text span{font-size:8.5pt;color:#4A463D;line-height:1.35}
  /* [site] the Arabic lines of the listen panel, right-aligned in their own column */
  .listen-text .ar{text-align:right;font-family:var(--ar)}
  .listen-text b.ar{font-weight:700}
  .listen-text .url{font-size:7.5pt;color:var(--quiet);letter-spacing:.04em}

  /* the contents list on a volume cover */
  .contents{list-style:none;margin:4mm 0 0;padding:0;display:flex;flex-direction:column;gap:2mm;width:100%}
  .contents li{
    display:flex;align-items:baseline;justify-content:space-between;gap:4mm;
    border-top:.3mm solid rgba(17,16,16,.16);padding-top:1.6mm;
  }
  .contents li:first-child{border-top:none}
  .ch-en{font-family:var(--display);font-weight:600;font-size:13pt;text-align:left}
  .ch-ar{font-family:var(--ar);font-size:13pt;text-align:right;font-weight:600}
  /* [site] the Arabic column at the English column's weight; balanced wrapping
     so no title ends on one stranded word */
  .ch-en,.ch-ar{text-wrap:balance}
  .volume-cover .art{width:58mm;height:58mm}
  .front .contents{margin-top:3mm}
${geometry}
${coverSpread ? `
  /* The spread is two trims wide. Content keeps the full safety margin from
     every trimmed edge and from the fold, because Lulu's trimming tolerance is
     0.125in toward either cover and a saddle-stitch fold wanders a little. */
  .spread{
    width:${spreadW}mm; height:${sheet}mm; display:flex; overflow:hidden;
    background:var(--paper);
  }
  .half{
    flex:0 0 ${trim + bleed}mm; min-width:0; display:flex; flex-direction:column;
    align-items:center; padding:${bleed + pad}mm ${pad}mm;
  }
  /* Too narrow for type at this page count, so it carries nothing but paper. */
  .spine{flex:0 0 ${spineMm}mm; background:var(--paper)}
  .half.back{padding-left:${bleed + pad}mm; justify-content:flex-start}
  .half.front{padding-right:${bleed + pad}mm; justify-content:flex-start}
  .front .art{width:96mm;height:96mm}
  /* [site] (a) the 16:9 front picture; (d) a volume of 5-8 books trades
     picture and title size for a contents list that keeps 13pt in both
     languages, measured by check-cover-text.py */
  .front .art.wide{width:136mm;height:76.5mm}
  .front .title-panel{max-width:150mm}
  .front h1.ar{font-size:30pt}
  .front.many .art.wide{width:100mm;height:56.25mm}
  .front.many .words{margin-top:4mm;gap:1.5mm}
  .front.many h1{font-size:30pt}
  .front.many h1.ar{font-size:25pt}
  .front.many .contents{gap:1mm;margin-top:2mm}
  .front.many .contents li{padding-top:1mm}
  .front.many .ch-en,.front.many .ch-ar{line-height:1.3}
  .back-title.ar{font-family:var(--ar);font-size:17pt;font-weight:700}
  .back .blurb{font-size:12.5pt;line-height:1.45;color:#2E2B26;max-width:150mm;margin:0 auto}
  .back .line.ar.blurb{line-height:1.7}
  .back .art.wide.back-art{width:84mm;height:47.25mm;margin:5mm auto 0}
  .front .words{margin-top:5mm}
  .front h1{font-size:34pt}
  .back{text-align:center}
  .back-top{display:flex;flex-direction:column;gap:3mm;width:100%}
  .back-title{
    font-family:var(--display);font-weight:900;font-size:19pt;line-height:1.05;
    margin:0;text-transform:none;letter-spacing:0;color:var(--ink);
  }
  .back .line{font-size:13pt;line-height:1.4}
  .back .line.ar{font-size:13pt;line-height:1.6}
  /* Lulu reserves 92 x 32mm at the bottom-right of the back cover for a
     barcode, 0.5in in from the trim. It is optional — a family book has no
     ISBN — but the listen panel used to run straight through it, which would
     have put a barcode over the QR the moment this book was ever distributed.
     The panel is held to the left of that zone instead. */
  /* [site] measured from the panel's own left edge (pad), not the safety
     margin: with a frame, pad is 16.8mm, and the template's width ran the URL
     line 4mm into the barcode area (found by check-cover-text.py). 2mm clear. */
  .back .listen{margin-top:auto; max-width:${(trim - 92 - safe - pad - 2).toFixed(1)}mm; margin-right:auto}
  .back .qr{width:30mm;height:30mm}
  .back .back-art{width:80mm;height:80mm;margin:10mm auto 0}
  .back .listen-text b{font-size:11pt}
  .back .listen-text span{font-size:8pt}
${frameCss}
` : ''}
</style>
</head>
<body>
${sheets.join('\n')}
</body>
</html>
`);

const fmt = (mm) => `${(mm / IN).toFixed(3).replace(/0+$/, '').replace(/\.$/, '')}in`;
console.log(`${path.basename(outPath)} — ${sheets.length} ${coverSpread ? 'spread' : 'sheets'}`
    + ` from ${volumeTitle ? volumeTitle + ' (' + bookPaths.length + ' books)' : path.basename(bookPaths[0])}`
    + (coverSpread ? `, ${fmt(spreadW)} x ${fmt(sheet)} (2 x ${fmt(trim)} trim + ${fmt(bleed)} bleed`
        + (spineMm ? `, ${spineMm.toFixed(2)}mm spine for ${interiorPages()} pages)` : ', no spine)')
        : lulu ? `, ${fmt(trim)} square trim + ${fmt(bleed)} bleed, ${fmt(safe)} safety`
            + (padded ? `, ${padded} blank${padded > 1 ? 's' : ''} to reach a multiple of 4` : '')
        : board ? `, ${trim}mm square + ${bleed}mm bleed` : ', A5'));
