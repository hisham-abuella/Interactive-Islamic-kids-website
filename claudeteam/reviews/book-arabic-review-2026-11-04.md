# Arabic review: Lulu print volumes (draft), 2026-11-04

Reviewer: arabic-language-reviewer
Scope: new print-only wording (volume titles, back-cover blurbs, "Talk about it", listen panel,
contents titles, "Complete Surah" headings) plus print typography in `print/draft/vol-*.pdf`.
Method: dumped the cover and interior build HTML, extracted the PDF text (`pdftotext`), mapped
every text run to its embedded font (`pdftohtml -xml`), and looked at the v2/v3 screenshots and
fresh renders of the talk pages and chapter covers.

**Note on stale files:** `tools/make-print.js` (17:23) and `tools/volumes.json` (17:20) are newer
than every `vol-*-cover-draft` PDF (17:13). So the prophets cover in the drafts still has no blurb, and its
contents list still shows "(peace be upon him)" in the English and no عليه السلام after Nuh and Yusuf.
I ran the current `contentsEn`/`contentsAr` over the five titles and both come out right. The covers
need a rebuild before anyone judges them.

---

## 1. Fixed (Arabic wording, in the files I'm allowed to edit)

### `print/tools/volumes.json`

| Volume | Was | Now | Why |
|---|---|---|---|
| vol-surahs-1 `title_ar` | قصار السور ١: الحافظات | قصار السور ١: آيات الحماية | الحافظات can be misread. حافظة also means a wallet or folder, and الحافظات in 4:34 refers to righteous women. A child would not get "protectors" from it. آيات الحماية is clear and covers a volume that holds an ayah (al-Kursi) as well as surahs. |
| vol-surahs-1 `blurb_ar` | سورة الفاتحة وآية الكرسي والمعوّذات: … يحفظها الصغار. لكل آية صفحة، ومعها … | سورة الفاتحة وآية الكرسي والمعوّذات الثلاث: آيات وسور قصيرة محبوبة، ليحفظها الطفل عن ظهر قلب. لكل آية صفحتها، ومعها معناها بكلمات بسيطة. | "the three Quls" now matches المعوّذات الثلاث exactly (المعوّذات on its own often means the two, al-Falaq and an-Nas). "for a child to learn by heart" is a purpose, so it becomes ليحفظها … عن ظهر قلب rather than the descriptive يحفظها الصغار. |
| vol-surahs-2/3/4 `blurb_ar` | سور قصيرة من جزء عمّ، آخر أجزاء القرآن، لكل آية صفحة: … | سور قصيرة من جزء عمّ، وهو آخر أجزاء القرآن. لكل آية صفحتها: الآية، ومعناها بكلمات بسيطة، وصورة أو زخرفة تساعد على تذكّرها. | The old text was one comma-spliced run-on. The appositive now has وهو, and there is a sentence break before the list, matching the English colon. |
| vol-prophets | (unchanged) | | The Arabic is good and faithful. |
| vol-surahs-2/3/4 `title_ar` | (unchanged) | | |

### `print/tools/make-print.js`

- `contentsAr` now joins the honorific with no-break spaces (`النبي ${name} عليه السلام`),
  so a contents line can no longer wrap between عليه and السلام or leave the honorific on a line
  without the name. The old prophets cover already wrapped "ثقة النبي إبراهيم عليه السلام / بالله" and "… وانشقاق / البحر".
  With عليه السلام now added to Nuh and Yusuf too, more lines will wrap. `node --check` passes. The
  cover-text checker splits on non-word characters, so its tokens are unchanged.

Not rebuilt, as instructed.

## 2. Checked and fine

- **هيّا نتحدّث** ("Talk about it"): natural, warm and short. The shadda renders in Baloo Bhaijaan 2.
- **السورة كاملة / الآية كاملة** under the surah name, or under آية الكرسي: correct, and parity with "Complete Surah / The Complete Verse" is good.
- **Surah-name headings and contents** (سورة الفاتحة … سورة الهمزة): all 27 match the site, and all
  have the "Surah X" / "سورة X" parity.
- **عليه السلام convention** (current code): النبي آدم عليه السلام - أول إنسان / النبي نوح عليه السلام والسفينة العظيمة /
  ثقة النبي إبراهيم عليه السلام بالله / النبي يوسف عليه السلام والرؤيا الجميلة / النبي موسى عليه السلام وانشقاق البحر.
  The English consistently drops "(peace be upon him)". This is fine for a contents list.
- **Digits:** no Western digits in any Arabic run across the five interiors and covers. Verse
  headings (الآية ٣), talk numbering (١. ٢. ٣.), ayah ends (﴿٢٥٥﴾) and titles (قصار السور ٢) are all
  Arabic-Indic. The English uses Western digits.
- **RTL punctuation and quotes:** the question marks (؟), the Arabic comma, a "!" inside closing quotes and the parentheses
  (سورة يوسف، الآية ٩٢) all sit in the right place in the rendered PDF. There are no hard-coded punctuation
  workarounds like `!هيا نبدأ`.
- **No English left in Arabic runs** (the only Latin text in them is `&nbsp;` entities inside the Quran panels).
- **Shaping:** Baloo Bhaijaan 2 shapes everything outside scripture, and Amiri shapes the Quran panels and
  inline ayat. Lam-alef, shadda and tanween all look right in the screenshots.

## 3. Typography defects that need template changes (book designer)

1. **Quranic pause marks fall back to Geeza Pro.** ۚ ۖ ۗ (U+06DA/06D6/06D7) come out of Geeza Pro, not
   Amiri: 9 marks in vol-surahs-1 (Ayat al-Kursi verse pages and the complete-verse panel, p22-23) and 2 in
   vol-prophets p46 (Yusuf 12:92 inline). Each of these marks follows a space. The likely cause is
   Google Fonts' unicode-range subsets. The space is in Amiri's Latin subset and the mark is in its Arabic subset, so
   Chrome finds no single face for the space+mark cluster and falls back to a system font. `UI/vendor/fonts/amiri-arabic-*.woff2`
   is the same Arabic-only subset, so it would not fix this either. **Fix:** self-host the full Amiri
   TTF/WOFF2 (all of its glyphs, with no unicode-range) for `.quran`, `.title-ar` and `.ayah-no`, then rebuild and check that
   `pdffonts` shows no Geeza Pro. Scripture must stay in Amiri.
2. **ﷺ (U+FDFA) is not in the body faces.** Baloo Bhaijaan 2 and Fredoka both lack it, so it renders
   in Noto Kufi Arabic in Arabic lines and in **Geeza Pro in English lines**. That is 39 instances across vol-surahs-1/2/3.
   **Fix:** add an `@font-face{font-family:"Salawat"; src:<Amiri>; unicode-range:U+FDFA}` and
   put it first in both `--body` and `--ar`, so every ﷺ is Amiri's.
3. **The Arabic eyebrow is never printed on chapter covers.** The data has "٥ آيات · سورة مكية" and
   "قصص الأنبياء", but the template prints only `page.en.eyebrow`. This is a parity gap on every chapter divider.
4. **The listen panel and the volume eyebrow/tagline are English only.** This affects every chapter divider and every back
   cover. Proposed Arabic (each a separate `dir="rtl" lang="ar"` element; `.listen-text` is
   `text-align:left`, so the Arabic needs its own right alignment):
   - "Scan to listen" → **امسح الرمز واستمع**
   - "Every page read aloud, in English and Arabic." → **استمع إلى كل صفحة بالعربية والإنجليزية.**
   - "Every page in English and Arabic, with a voice reading each one aloud." → **كل صفحة بالعربية والإنجليزية، ومعها صوت يقرؤها لك.**
   - "N stories/surahs in one book" → **{number} {قصص|سور} في كتاب واحد**. Both nouns are feminine, so the
     number word takes the masculine-looking form: ثلاث، أربع، خمس، ست، سبع، ثماني، تسع، عشر.
     The current volumes need **خمس قصص**, **خمس سور**, **ثماني سور** and **أربع سور**.
5. **Contents weight imbalance.** `.ch-en` is Fraunces 600 but `.ch-ar` has no weight, so it falls to Baloo 400 and
   the Arabic column looks a step lighter. Suggest `font-weight:600` on `.ch-ar`, and
   `text-wrap:balance` on both columns to avoid single-word last lines ("بالله", "البحر").
6. **Talk page layout.** The numbered questions are centred, so the numerals zig-zag down the page.
   Suggest start alignment (left for English, right for Arabic) with hanging numerals.
7. **Quotes and dashes (low priority).** The Arabic uses ASCII `"…"`. They render in the right place, but
   «…» is the Arabic print convention (a print-only replacement inside Arabic runs, never inside `.quran`). Site text
   in both languages uses " - " as a dash; in print it could become an en dash.
8. **١ looks like alif in Baloo at title size.** On the vol-1 cover, "قصار السور ١:" reads as
   "السور ا:". It is readable in context, but "(١)" would be clearer. The owner can decide; I did not change it.

## 4. For the owner (site-sourced text, outside my edit scope here)

1. **Arabic in the English line, at-Tin verse 2** (vol-surahs-3 p34): "…spoke to Prophet Musa عليه السلام."
   It also renders in Geeza Pro. The source is `UI/surah-at-tin.html:157`, and the same thing happens at lines 81 and 381.
   The English should read "(peace be upon him)".
2. **Weak Arabic in talk questions.** These come from the site quiz, but print makes them a page of their own:
   - `UI/surah-al-bayyinah.html:307` ما الذي كانت البينة؟ is ungrammatical. It should be **ما هي البيّنة؟** or **ماذا كانت البيّنة؟**
   - `UI/surah-al-humazah.html:339` لماذا كان ذكر أنها تطّلع على الأفئدة ذا معنى؟ is translationese. It should be
     **لماذا قالت السورة إن النار تطّلع على الأفئدة؟**
   - `UI/story-prophet-nuh.html:194` بماذا أمر الله النبي نوح أن يبني؟ uses both "أمر بـ" and "أن", which is wrong. It should be **ماذا أمر الله النبيَّ نوحاً أن يبني؟**
3. **The English talk question for Ayat al-Kursi Q3,** "…never does which of these?", depends on the multiple-choice options,
   which print removes. The Arabic version reads fine without them. The English needs rewording, for example "What does the verse
   say Allah never does?"
4. **The الجزء ١…٨ headings for Ayat al-Kursi's pieces** (set in `extract-book.py`, following the site) read to an
   Arabic reader as "Juz 1…8" of the Quran. **المقطع ١** would avoid that. This needs to be agreed with the site.
5. **The vol-1 subtitle "The Protectors" / آيات الحماية** says these passages protect. That is well grounded for
   al-Mu'awwidhat and Ayat al-Kursi, and al-Fatiha is used as ruqyah, but please have `islamic-content-scholar` confirm it.
   The same goes for using المعوّذات الثلاث to mean al-Ikhlas, al-Falaq and an-Nas together.
6. **The vol-1 English blurb** says "Each verse has its own page", but Ayat al-Kursi is one verse spread over eight
   pages. The Arabic follows the English. A small point.
7. **The dialect build** (`--dialect eg`) still takes the fusha `title_ar`/`blurb_ar` from volumes.json.
   This is fine as long as no Egyptian volume is planned.
