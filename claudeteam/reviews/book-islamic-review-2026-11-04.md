# Religious-correctness review of the Lulu print volumes (islamic-content-scholar, 2026-11-04)

Scope: `print/draft/vol-surahs-{1,2,3,4}-{interior,cover}-draft.pdf` (v3 builds, 17:23) and
`print/draft/vol-prophets-*-draft.pdf`. **The Stories of the Prophets volume is the older v2 build
(17:13).** It still has the 11-03 Nuh plates and the old contents titles, and it will be rebuilt.
I reviewed it anyway: its text edits were already in, and its plates are the site's plates.

Method:
- Rendered every page of all five interiors (324 pages) and all five covers with `pdftoppm`.
- Read every page and every plate in `print/input/img-draft/`. Suspect plates were checked at 100%.
- Dumped all print text from `print/books/*.html`.
- Scripture was diffed by script, never by eye.

## Verdicts

| Volume | Verdict |
|---|---|
| Short Surahs I (Fatiha, Kursi, Ikhlas, Falaq, Nas) | APPROVED WITH FIXES (title, Kursi wording, back-cover plate) |
| Short Surahs II (Asr ... Masad) | APPROVED WITH FIXES (one missing ﷺ, Talk pages) |
| Short Surahs III (Duha ... Takathur) | APPROVED WITH FIXES (**Zalzalah 4 plate is a MUST**, back-cover plate) |
| Short Surahs IV (Bayyinah ... Humazah) | APPROVED WITH FIXES (**front-cover scroll is a MUST**, Bayyinah 2 wording) |
| Stories of the Prophets (v2) | **NOT APPROVED for print as built.** Five plate MUSTs (the dove, suns with faces, pseudo-writing in two Musa plates, a Latin pseudo-signature) plus the 12:92 setting. Rebuild, then re-review. |

**All Quranic text in all four Surahs volumes is correct, correctly divided, and correctly
numbered.** Nothing below is a wording error in an ayah.

---

## 0. Verifier results (quoted)

`python3 print/tools/verify-print-scripture.py` (exit 0):
```
story-prophet-yusuf    ok  (12:92 vs api.alquran.cloud + dua, verbatim from the page)
surah-fatiha           ok  (7 verses + complete surah, 7 spans)
ayat-al-kursi          ok  (Bismillah + 8 parts = 2:255 + complete verse)
surah-al-falaq         ok  (Bismillah + 5 verses + complete surah, 6 spans)  [4 in Uthmani spelling]
...  (all 27 books ok)
vol-prophets-interior-draft.html   ok  (6 spans, identical to the data, same order; 0 complete surahs numbered 1..n: 0 ayat)
vol-surahs-1-interior-draft.html   ok  (60 spans, identical to the data, same order; 5 complete surahs numbered 1..n: 23 ayat)
vol-surahs-2-interior-draft.html   ok  (88 spans, identical to the data, same order; 8 complete surahs numbered 1..n: 36 ayat)
vol-surahs-3-interior-draft.html   ok  (96 spans, identical to the data, same order; 5 complete surahs numbered 1..n: 43 ayat)
vol-surahs-4-interior-draft.html   ok  (86 spans, identical to the data, same order; 4 complete surahs numbered 1..n: 39 ayat)

336 scripture spans in 27 books: ALL PRINT SCRIPTURE MATCHES
```

`python3 UI/scripts/verify-scripture.py` (exit 0):
```
surah-fatiha.html          ok  (7 verses + complete-surah block)
ayat-al-kursi.html         ok  (8 phrase-cards concatenate to 2:255)
story-prophet-yusuf.html 12:92 ok  (part of the ayah)
... (all 21 surah pages ok; "[n line(s) in Uthmani spelling]" notes are marks-tier only)
ALL SCRIPTURE MATCHES
```
The "Uthmani spelling" notes come from the marks tier, and they are information only. The letters
tier matches everywhere.

**Independent checks (my own scripts, not the team's tools):**
1. **Complete-surah panels.** I took every complete-surah panel in the four built `vol-surahs-*`
   interiors and diffed it against `api.alquran.cloud/v1/surah/{n}/quran-simple`. I normalised
   both sides first: harakat stripped, alef/ya/ta-marbuta unified, and the API's prefixed
   Bismillah on 105 and 112 handled. Result:
   - All 21 surahs match.
   - Every panel is numbered 1..n.
   - Al-Fatiha has the Bismillah as ayah ﴿١﴾ and a whole ayah ﴿٧﴾. **This is the Hafs count, so
     the 2026-09-02 fix held in print.**
   - Ayat al-Kursi matches 2:255 and carries no Bismillah.
   - The 20 other surahs each have the Bismillah on its own unnumbered line.
2. **Quran quoted inside the story narration.** These quotes are not tagged `data-ayah`, so
   neither verifier sees them. I checked each against the API:
   - Verbatim: 7:23, 21:69, 2:35, 38:71, 7:12, 26:62, 28:31 «ألق عصاك», 6:79, 12:5, 12:101.
   - Verbatim apart from a dropped particle or an ayah break: 20:11-12, 20:44.
   - Paraphrases of people's speech, which is acceptable: «لقد أدركونا» (26:61) and «آمنا برب
     موسى وهارون» (7:121-122 and 20:70 merged).

---

## 1. The Bismillah: is print right, and should the site change?

**Print is right.** In the Hafs/Kufan count that the child's mushaf follows:
- The Bismillah is ayah 1 of Al-Fatiha only.
- At the head of every other surah it is Quran, but it is not a numbered ayah of that surah.
- The Madinah mushaf sets it on its own centred line with no ayah-end mark.

Print does exactly this. It is inline and numbered ﴿١﴾ in Al-Fatiha
(`vol-surahs-1` p.10), and on its own unnumbered line everywhere else (`.bism-line`,
`print/tools/make-print.js:700`). Never setting it for At-Tawbah is also correct.

**The site is wrong, and it must change (MUST, site).** Every non-Fatiha complete-surah block puts
U+06DD ARABIC END OF AYAH (۝) after the Bismillah. That marks it as an ayah. A child who counts
the ۝ marks in Al-Ikhlas gets 5, while the badge says 4. That is the same class of error as the
2026-09-02 Al-Fatiha numbering bug.

Remove the ۝ from each of these lines, and keep the Bismillah as its own line:

| File | Line |
|---|---|
| `UI/surah-ad-duha.html` | 296 |
| `UI/surah-al-adiyat.html` | 289 |
| `UI/surah-al-asr.html` | 182 |
| `UI/surah-al-bayyinah.html` | 253 |
| `UI/surah-al-falaq.html` | 205 |
| `UI/surah-al-fil.html` | 215 |
| `UI/surah-al-humazah.html` | 260 |
| `UI/surah-al-ikhlas.html` | 201 |
| `UI/surah-al-kafirun.html` | 219 |
| `UI/surah-al-kawthar.html` | 182 |
| `UI/surah-al-masad.html` | 209 |
| `UI/surah-al-maun.html` | 236 |
| `UI/surah-al-qariah.html` | 290 |
| `UI/surah-an-nas.html` | 219 |
| `UI/surah-an-nasr.html` | 182 |
| `UI/surah-ash-sharh.html` | 252 |
| `UI/surah-at-takathur.html` | 245 |
| `UI/surah-at-tin.html` | 252 |
| `UI/surah-az-zalzalah.html` | 251 |
| `UI/surah-quraysh.html` | 197 |

The line text in each file is the same: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝`.

Keep `UI/surah-fatiha.html:240` as it is: there the Bismillah is ayah 1, so its ۝ is right.
`UI/surah-fatiha.html:124` (`۝١`) is right too. Two improvements are recommended but not required:
- Number the site's marks (۝١ ... or ﴿١﴾), as print does.
- Add a check to `verify-scripture.py`: for any surah other than 1, the complete-block Bismillah
  must not be followed by ۝. The letters tier cannot see this today, because ۝ (U+06DD) falls in
  the stripped `MARKS` range.

## 2. Ayah numbers ﴿n﴾ in Arabic-Indic digits; Ayat al-Kursi ﴿٢٥٥﴾

**Approved.**
- Arabic-Indic digits after each ayah is mushaf practice.
- The ornate-parenthesis form is the established typographic substitute when the rosette is not
  drawn.
- The digits are U+0660-0669, not the Persian forms.
- In the renders the brackets face correctly in RTL (`vol-surahs-1` p.10, p.32).
- Ayat al-Kursi ﴿٢٥٥﴾ is correct. It tells the child where the verse lives, and it matches "verse
  number 255" on the Kursi page.
- The gold `.ayah-no` is `white-space:nowrap`, so a number is never orphaned from its ayah. Good.

**SHOULD (print):** Ayat al-Kursi's pieces are headed «الجزء ١» ... «الجزء ٨»
(`print/tools/extract-book.py:304`, `('Part', 'الجزء')`). In a Quran book, «الجزء ٧» reads as
"Juz' 7" of the 30 ajza'. Ayat al-Kursi is in Juz' 3. Use «المقطع ١» (or «الجملة ١»). "Part" in
English is fine.

**The Kursi Bismillah card (`vol-surahs-1` p.14):** defensible, so keep it. Starting a recitation
mid-surah with the Bismillah is permitted, and the complete-verse page correctly omits it. The
prescribed opening when reciting is the isti'adha (16:98).
- **SHOULD:** precede or replace the card with «أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ»,
  headed "Before we recite / قبل أن نقرأ".
- At minimum, give the card that heading, so it does not read as a piece of 2:255.

## 3. Ayah placement, and the respect due to printed Quran

**Approved:**
- Pages with no picture put the ayah at the top in the gold panel.
- No ayah is split across pages. I checked all 324 pages.
- No ayah is set over art.
- No Quran text appears on any cover, spine or back. Keep it that way: covers are what get put
  on the floor.

**SHOULD: picture pages put the ayah last, below the Arabic explanation.** For example,
`vol-surahs-1` p.15, where 2:255's opening sits at the foot of the page in Amiri at roughly the
prose size. The adab of a teaching book is that the text of Allah comes first, and the
explanation follows it. Either:
- (a) move the ayah directly under the picture, before the English heading; or
- (b) keep the order but set the ayah clearly larger than the prose, in its own thin gold rule,
  so it does not read as a caption.

This is not an error, but (a) is preferred.

**SHOULD: an adab note in every volume.**
- Where: on the first interior page (under the QR on the first title page) or on the back cover
  under the blurb.
- Why: these books will be read in bed, dropped and outgrown, and they contain whole surahs. They
  are not a mushaf: most of each book is explanation, so no wudu rule should be imposed. The child
  and parent should still be told how to treat them.
- Proposed text (`arabic-reviewer` to polish the AR):

  > This book contains verses of the Holy Quran. Please keep it somewhere clean, not on the floor
  > or in the bathroom. When it is worn out, do not put it in the bin: ask a grown-up to dispose
  > of it respectfully.
  >
  > يحتوي هذا الكتاب على آيات من القرآن الكريم، فاحفظه في مكان نظيف، ولا تضعه على الأرض ولا تدخل
  > به الخلاء. وإذا بَلِيَ فلا تُلقِه في القمامة، بل اطلب من أحد الكبار أن يتخلّص منه بطريقة لائقة.

- The same applies to the team: dispose of misprinted proofs and rejected drafts by shredding,
  not in the household bin.

## 4. Yusuf 12:92 inside the Arabic paragraph; Adam 7:23 and Ibrahim 21:69 unvowelled in the prose face

**12:92: MUST before the stories rebuild ships.** At `vol-prophets` p.46 the ayah runs on inside
the paragraph:

> «...سامحهم من كل قلبه وقال: لَا تَثْرِيبَ عَلَيْكُمُ / الْيَوْمَ ۖ ... الرَّاحِمِينَ أي: لا لومَ عليكم اليوم ولا عتاب. (سورة يوسف، الآية / ٩٢)»

Three problems:
- Nothing marks where the Quran ends and the human gloss «أي: ...» begins.
- The ayah breaks across lines mid-phrase.
- The reference breaks across lines.

This is a regression from the site, which sets 12:92 as its own block (`UI/story-prophet-yusuf.html:171`
`p.story-ayah`, meaning at `:172`). Fix: set it as its own centred line in Amiri, wrapped
﴿ ... ﴾, then the gloss on the next line, with the reference in `nowrap`. Use the same treatment
as the dua panels.

**7:23 and 21:69 in the prose face (p.10, p.33), unvowelled: acceptable, with one SHOULD.**
- Arabic books routinely quote Quran in the running font, and both quotes are verbatim (checked
  above).
- The problem is inconsistency. 12:92 is styled as Quran, while these and the other verbatim
  quotes (2:35, 38:71, 7:12, 20:11-12, 20:44, 26:62, 28:31, 6:79, 12:5) are in plain quotation
  marks. That makes them indistinguishable from the paraphrases right next to them.
- Rule: **verbatim Quran inside narration is wrapped in ﴿ ﴾ instead of "..."**. It does not need
  vowels or Amiri.
- **21:69 is Allah's speech**, so it should get the same ﴿ ﴾. Ideally it is also tagged
  `data-ayah="21:69"` on the site, so that `verify-scripture.py` checks it.
- Tag 7:23 the same way. It already appears vowelled on the dua page.

**Related SHOULD (repeats the 11-03 ruling):** Allah's words to Musa's mother are given as a
paraphrase inside quotation marks:
- EN: "Place him in a basket and let the river carry him. Do not be afraid — I will bring him
  back to you."
- AR: «ضعيه في سلة ودعي النهر يحمله. لا تخافي، سأرده إليك.»

Location: `vol-prophets` p.52, from `UI/story-prophet-musa.html:88`. Make it indirect speech
("Allah inspired her to place him in a box on the river, and promised to bring him back to
her"), or quote 28:7 exactly. Also "basket" / «سلة»: the Quran says تابوت (box/chest). This is a
note, not a fix.

## 5. Contents titles and ﷺ

**The contents convention is approved, on conditions.**
- Dropping "(peace be upon him)" from the English contents titles is acceptable. The salutation
  in writing is recommended, not obligatory. A contents list is a navigational index. The
  Stories blurb already says "peace be upon them" once for all five.
- **عليه السلام after every prophet's name in the Arabic is approved.** Extend it beyond the
  contents (SHOULD): the Arabic *title pages* are inconsistent today. Nuh and Yusuf lack it:
  «النبي نوح والسفينة العظيمة», «النبي يوسف والرؤيا الجميلة».
- The English title pages are inconsistent too: Adam, Ibrahim and Musa carry "(peace be upon
  him)" in the title, and Nuh and Yusuf carry it in the first line of the story. Pick one rule:
  drop it from all titles, and make sure **the first mention in each story's text** carries it.
  Today Adam, Ibrahim and Musa have no salutation in their body text.
- Do not substitute "(AS)" or "(SAW)". Abbreviated salutations are disliked.

**ﷺ: one miss.** `surah-al-masad` verse 4 EN: "putting thorns in the Prophet's path"
(`vol-surahs-2` p.73; `UI/surah-al-masad.html:181` EN; `print/books/surah-al-masad.html:96`).
**MUST:** "the Prophet's ﷺ path". The Arabic on the same line has ﷺ.

Every other named or implied mention of the Prophet Muhammad in all five books carries ﷺ. The
glyph renders in both faces.

Bayyinah 98:2 "A Messenger from Allah" is inside an ayah translation, where ﷺ is optional. See
section 8 for its explanation line.

## 6. New wording: blurbs and "Talk about it / هيّا نتحدّث"

**Blurbs (`print/tools/volumes.json`):**
- Lines 53-54, 70-71, 86-87 (Short Surahs II-IV): **approved.** Every surah in II-IV is in Juz'
  'Amma (93-111), and «آخر أجزاء القرآن» is correct.
- Lines 33-34 (Short Surahs I): approved, with two notes.
  - Counting Al-Ikhlas among «المعوّذات» follows the usage in the hadith (al-Bukhari 5016-5017),
    so it is acceptable.
  - "Each verse has its own page" / «لكل آية صفحتها" is not quite true for Ayat al-Kursi, which
    is one verse over eight pages. Write "each verse or part of a verse".
- **Line 21, the title "Short Surahs I: The Protectors" / «الحافظات»: SHOULD change (aqeedah).**
  - It names the surahs as the protectors. Protection is from Allah alone. The surahs are how we
    *seek refuge* with Him (قل أعوذ). Children are exactly the audience who will take that
    literally, and amulet thinking starts there.
  - «الحافظات» is also the Quran's word for chaste women (4:34, 33:35), which is an odd echo on a
    children's cover.
  - Suggested: "Short Surahs I: In Allah's Care" / «قصار السور ١: في حفظ الله», or "Seeking
    Allah's Protection" / «نستعيذ بالله».
- **Lines 16-17 (Stories): SHOULD.** "as the Quran tells them" / «كما يرويها القرآن» over-claims.
  The stories contain details the Quran does not give:
  - Asiyah's name (from hadith; fine);
  - "far from the ocean";
  - the "basket";
  - the sister's words;
  - the cave in the Ibrahim plate.

  Use "Five true stories of the prophets from the Quran" / «خمس قصص صادقة من القرآن الكريم عن
  الأنبياء». The rest of the blurb is approved, including "peace be upon them" / «عليهم السلام».
- **Listen copy, SHOULD.** `make-print.js:319-320` / `:526-527` say "Every page read aloud, in
  English and Arabic", and `:512` says "with a voice reading each one aloud". The narration
  deliberately does not read the Quranic Arabic (`UI/surah-narration.js:46-47`). In a Quran book,
  "every page read aloud" tells a parent the voice recites the Quran. Say "The meaning of every
  page read aloud, in English and Arabic." In Arabic: «معنى كل صفحة مقروءاً بالعربية
  والإنجليزية».

**"Talk about it / هيّا نتحدّث" (`print/tools/extract-book.py:160-178`):**
- **The heading is approved** in both languages.
- **The questions copied from the site quizzes are religiously sound.**
- **SHOULD:** several of them ask for hadith or sirah facts that **the printed book does not
  contain**. The site's hadith and sirah panels are not extracted. With no answer on the page, a
  parent will supply one, and the common answers to two of these are weak narrations. Questions
  without a printed answer:
  - Ad-Duha Q2 "Why was this surah revealed?" The sound answer: revelation paused (al-Bukhari 4950;
    Muslim 1797). The popular puppy story is weak.
  - An-Nasr Q3 "What did the Prophet ﷺ do to the people who had been cruel to him?" The general
    pardon at the conquest is sound. «اذهبوا فأنتم الطلقاء» is weak in its chain.
  - Al-Asr Q4, the Companions reciting Al-Asr at parting (at-Tabarani, al-Awsat; graded sahih by
    al-Albani, as-Sahihah 2648).
  - Al-Kawthar Q3, the Prophet's ﷺ description of the river (al-Bukhari 4964, Muslim 400).
  - Ayat al-Kursi Q4 "When did the Prophet ﷺ tell us to recite it for protection?" (al-Bukhari
    2311, at bedtime).

  Fix: add a small "For grown-ups: answers" line under each Talk page with the source, or drop
  those questions.
- Kafirun Q4 ("a quarter") has a printed answer. Its hadith is graded differently by different
  scholars (at-Tirmidhi 2893-2895; al-Albani hasan/sahih by supporting chains, as-Sahihah 586).
  It is acceptable, but cite "(at-Tirmidhi)" on the page that states it.
- Ikhlas Q2: the answer ("a third") is sound (al-Bukhari 5013). See section 8 for the sentence
  after it.
- Yusuf Q2 "What special *ability* did Allah give Yusuf?" / «موهبة»: prefer "What did Allah teach
  Yusuf?" / «ماذا علّم الله يوسف؟» (12:6 «وَيُعَلِّمُكَ مِنْ تَأْوِيلِ الْأَحَادِيثِ»). This
  frames it as knowledge given, not a talent.

## 7. Cover art

**Volume I front, the Ayat al-Kursi plate (lake, deer, birds): approved.** No figures, no text, no
throne or seat. It is a sound choice.

Problems with plates in print context, by cover:

| Volume and position | Plate | Ruling |
|---|---|---|
| **IV front** | `surah-al-bayyinah/verse-1` | **MUST (cover), SHOULD (interior p.1 and p.4).** A twin-roller scroll with gold finials, standing in a wall niche: the iconography of a Sefer Torah in its ark. On the front of a Quran book, next to 98:2 «رَسُولٌ مِنَ اللَّهِ يَتْلُو صُحُفًا مُطَهَّرَةً», it says the Messenger ﷺ recited from that scroll. Use Al-Adiyat's horses or Al-Qari'ah's garden on the front. Replace the interior plate with loose plain folios or a non-figurative ornament. |
| **I back** | `surah-al-falaq/verse-1` | **SHOULD.** The dark ridge carries a row of upright rounded silhouettes (`falaq-zoom` at 100%). They read as a stone circle (a pagan cult site), gravestones, or a file of hooded figures (checklist 3b item 1). Not on a cover. Use Ad-Duha 1 or Quraysh 1, or regenerate. |
| **III back** | `surah-ash-sharh/verse-1` | **SHOULD.** The left rock face has an eye and a profile: a face in rock (3b item 1), and an "eye" motif. Replace it on the cover, and regenerate for the interior. |
| II front, II back, III front, Prophets front | Asr 1 (hourglass in a desert, seen through an arch), Fil 1 (calm elephant), Duha 1 (palms at sunrise), Adam cover (garden) | Approved. The Asr arch is a frame onto a landscape, not a mihrab with an object set in it. |

Interior plates that fail the 11-03 art checklist (`game-islamic-review-2026-11-03.md` §3b) are
listed in section 8.

## 8. Everything else, including conflicts with the 11-03 ruling

### MUST (block print)
1. **Nuh: the dove and olive branch are still in plate 7** (`vol-prophets` p.22, "A New
   Beginning"), right beside text that now correctly says Judi.
   - The 11-03 ruling: Biblical, Genesis 8:8-11.
   - The spec is fixed (`UI/scripts/specs/illustrations.py:130`), but the image is not.
     `UI/images/stories/prophet-nuh/scene-7.webp` (Nov 3 23:21) still shows the dove on the live
     site.
   - The pilot `print/draft/story-prophet-nuh-lulu-*` has it too.
   - The rebuild must use the re-rendered plate. Re-review it before it is used.
2. **Nuh plate 3** (`prophet-nuh/scene-3`, p.18 "Never Giving Up"): the suns and moons around the
   tree have **faces**: eyes and smiling mouths. These are anthropomorphic suns, which checklist
   3b item 1 rejects (11-03 §3a also bans them in the negative). Regenerate.
3. **Musa plate 3** (`prophet-musa/scene-3`, p.53 "Safe in the Palace"): the walls carry **gold
   pseudo-Arabic calligraphy panels**. That fails 3b item 4, "the most serious failure", because
   a reader may take it for Quran. It also sets a mihrab-like arched door in Pharaoh's palace.
   Regenerate.
4. **Musa plate 7** (`prophet-musa/scene-7`, p.57): the ceiling frieze has a band of
   pseudo-script glyphs (3b item 4). Regenerate, or crop the frieze out.
5. **Ibrahim plate 3** (`prophet-ibrahim/scene-3`, p.29 "The Beautiful Moon"): a **Latin
   pseudo-signature** is painted on the dune at lower left (3b item 4). Regenerate.
6. **Az-Zalzalah plate 4** (`surah-az-zalzalah/verse-4`, `vol-surahs-3` p.49): a gilded,
   illuminated book (mushaf-like) with **two bare footprints on its cover**, plus small glyph-like
   squares. In a Quran book this reads as feet on a mushaf. The 11-03 rule: scripture and the
   mushaf are never under feet. It is also on the site. Replace it: the earth "telling its news"
   needs no book. Use cracked ground with a sprout, or a non-figurative ornament.
7. **Yusuf 12:92 setting.** See section 4.
8. **The missing ﷺ in Al-Masad 4.** See section 5.

### SHOULD (fix before the final build)
- Kursi: "The word 'Kursi' means throne or footstool" (`vol-surahs-1` p.13;
  `UI/ayat-al-kursi.html:70` EN and AR «موضع القدمين أو العرش»; quiz answer "Throne" at `:295`;
  subtitle "The Verse of the Throne" at `:52`, printed on p.12).
  - The Kursi is not the 'Arsh (Throne). Ibn 'Abbas distinguished them, and so does the
    Abu Dharr narration (as-Sahihah 109). Calling it "throne" conflates the two.
  - Explaining "footstool" to a 5-year-old invites picturing Allah's body.
  - Use: "The Kursi is a mighty creation of Allah, so vast that it holds the heavens and the earth.
    We do not know what it looks like." In Arabic: «الكرسي مخلوق عظيم من خلق الله، وسع
    السماوات والأرض، ولا نعلم كيف هو». The quiz answer should match.
  - "The Verse of the Throne" is the conventional English name. Keep it if the owner wishes, but
    then the Kursi page must not also say Kursi means throne.
  - Same page: "how big ... Allah is — bigger than the sky" should be "how great ... greater than
    the sky". The Arabic «أعظم» is already right.
- Al-Ikhlas: "So if you say it three times, it is as if you read the whole Quran"
  (`vol-surahs-1` p.26; `UI/surah-al-ikhlas.html:72`). The hadith says it *equals a third*
  (al-Bukhari 5013). "Three times = the whole Quran" is an extrapolation. The scholars' caution
  is that it equals in reward and does not replace reading the Quran. Write: "Its reward is like
  reciting a third of the Quran. SubhanAllah!", and drop the next sentence.
- Al-Bayyinah 2: "the clear proof turned out to be: a person reading aloud" (`vol-surahs-4` p.5;
  `UI/surah-al-bayyinah.html:155`).
  - The Prophet ﷺ was unlettered, and he *recited* (يتلو) from memory. "Reading" implies a text
    in his hands, especially beside the scroll plate.
  - "A person" also undersells him.
  - Use "a Messenger, the Prophet Muhammad ﷺ, reciting it aloud". The Arabic «إنسان يتلو بصوته»
    should become «رسولٌ هو النبي محمد ﷺ يتلو بصوته».
- Ibrahim plate 8 (`prophet-ibrahim/scene-8`, p.34), with "brick by brick" in its text.
  - The plate is an image-model **Ka'bah**: a cube of stone blocks with turquoise diamond tile
    panels. The 11-03 rule says the Ka'bah is never generated, and these tiles are invented.
    Replace it with the tools and stones of a building site (rope, chisel, stacked stones), with
    no recognisable House. Or use a hand-drawn outline of the foundations (2:127 «يَرْفَعُ
    إِبْرَاهِيمُ الْقَوَاعِدَ»).
  - Text: "brick by brick" should be "stone by stone"
    (`UI/story-prophet-ibrahim.html:259`). The 11-03 ruling still stands, and the Arabic is
    already «حجراً حجراً».
- Ibrahim plate 5 (`scene-5`, "The Stone Statues"): the plinths carry figure-like reliefs, and an
  axe leans on one. Empty plinths are good. Confirm at 100% that no relief reads as a figure or
  idol face, and regenerate if one does. The axe detail comes from tafsir reports, not the Quran
  (21:58). It is acceptable as an object, but do not narrate it.
- Yusuf: "they all bowed to him with respect and love" / «فسجدوا له جميعاً» (`vol-prophets`
  p.46; `UI/story-prophet-yusuf.html:173`). Add the 11-03 parent line: "It was a bow of respect,
  allowed in their time. In Islam we prostrate only to Allah." Adam p.4 already explains "as a
  sign of respect", so match it.
- Yusuf dua page: «رَبِّ قَدْ آتَيْتَنِي مِنَ الْمُلْكِ» / "My Lord, You have given me
  authority..." (`vol-prophets` p.48; `UI/story-prophet-yusuf.html:193`).
  - This is the opening of 12:101, cut mid-ayah, and it is not itself a supplication. The Arabic
    page has no ellipsis, so it reads as complete.
  - A child cannot truthfully say "You have given me sovereignty".
  - Fix: use the dua portion, «أَنتَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ ۖ تَوَفَّنِي مُسْلِمًا
    وَأَلْحِقْنِي بِالصَّالِحِينَ», added through the verifier. Or retitle the page "Yusuf's words
    of thanks" and keep it as a quotation, not "Let's make dua".
- Ibrahim "What We Learn" Arabic is **empty** (`vol-prophets` p.35: heading only, and the data has
  `ar.line: ''`). This is an extraction defect. A bilingual page that teaches lessons in one
  language only should be fixed. "Always search for the truth" is a residue of the old
  "still searching" framing. Prefer "Think, and follow the truth".
- Al-Fil plate 4 (`surah-al-fil/verse-4`, `vol-surahs-2` p.15): blood-red droplets trailing into
  a splash-like cluster read as blood (3b item 7). Recolour the stones to baked-clay ochre/brown.
  سجّيل is fired clay.
- Al-Kawthar plate 2: a sheep lying on a **prayer rug**. This conflates the prayer mat with the
  sacrifice. Put the sheep on sand beside the tent, and the rug apart from it.
- Quotation marks around invented morals on the story covers ("Forgiveness is beautiful. Always
  forgive others like Prophet Yusuf did!", etc.). In a book that also quotes Quran and hadith in
  quotation marks, these read as sayings. Drop the quotation marks.

### NOTE
- Al-Masad: the framing is age-appropriate. It is about choices, it says "Allah is just", and it
  is said once with no dwelling. Approved for this age band. The same goes for Al-Humazah,
  Al-Qari'ah, At-Takathur and Al-Bayyinah 6, whose "Said once, as the Quran says it" approach is
  sound. That phrase reads like an editor's note to a child. `kids-copy` may want to soften it.
- Al-Ma'un 4 plate (a neglected prayer rug under cobwebs) for "woe to those who pray" is
  acceptable: it pictures neglect, not prayer.
- Ibrahim plate 1 (a cave) visualises the Israiliyyat birth-in-a-cave story. The text does not
  claim it. Acceptable, but a neutral plate would be better.
- Nuh "Even though they were far from the ocean" is not in the Quran. It is harmless, but it is
  why the blurb must not say "as the Quran tells them".
- The pilot `print/draft/surah-fatiha-lulu-*` and `story-prophet-nuh-lulu-*` are superseded.
  Destroy the Nuh pilot (it has the dove) rather than print it.

---

## Must-fix list (consolidated)

| # | Where | Fix |
|---|---|---|
| M1 | `vol-prophets` p.22, `UI/images/stories/prophet-nuh/scene-7.webp` | Remove the dove plate; use the re-rendered Judi plate after scholar review |
| M2 | `prophet-nuh/scene-3` (p.18) | Suns and moons with faces: regenerate |
| M3 | `prophet-musa/scene-3` (p.53) | Pseudo-Arabic calligraphy on the walls: regenerate |
| M4 | `prophet-musa/scene-7` (p.57) | Pseudo-script frieze: regenerate or crop |
| M5 | `prophet-ibrahim/scene-3` (p.29) | Latin pseudo-signature: regenerate |
| M6 | `surah-az-zalzalah/verse-4` (`vol-surahs-3` p.49; site too) | Mushaf-like book with footprints: replace |
| M7 | `vol-surahs-4` front cover | Torah-style scroll: use another plate on the front |
| M8 | `vol-prophets` p.46 | 12:92 on its own line in ﴿ ﴾, gloss separate, reference `nowrap` (as on the site) |
| M9 | Al-Masad 4 EN (`UI/surah-al-masad.html:181`) | "the Prophet's ﷺ path" |
| M10 (site) | The 20 `UI/surah-*.html` lines in section 1 | Remove ۝ after the Bismillah in the complete-surah blocks |

## Should-fix list (consolidated)
- **Volume I**
  - Retitle "The Protectors" / «الحافظات» (`volumes.json:21`).
  - Kursi "throne/footstool" and "bigger than": `UI/ayat-al-kursi.html:52,70,295`.
  - «الجزء» should be «المقطع» (`extract-book.py:304`).
  - Isti'adha heading on the Kursi Bismillah card.
- **Volume III and Volume I back covers:** replace Ash-Sharh 1 and Falaq 1 on the backs.
- **Picture pages:** ayah before the explanation, or set clearly larger.
- **Adab note** in each volume.
- **Listen copy:** "the meaning of every page" (`make-print.js:319-320,512,526-527`).
- **Stories blurb:** "from the Quran", not "as the Quran tells them" (`volumes.json:16-17`).
- **Talk pages:** answers with sources, or drop Duha Q2, Nasr Q3, Asr Q4, Kawthar Q3 and Kursi Q4.
  Yusuf Q2 wording.
- **Al-Ikhlas:** drop "three times = whole Quran" (`UI/surah-al-ikhlas.html:72`).
- **Al-Kafirun:** cite at-Tirmidhi for "a quarter" (`UI/surah-al-kafirun.html:71`).
- **Al-Bayyinah 2:** "reciting", and name the Prophet ﷺ (`UI/surah-al-bayyinah.html:155`).
- **Stories text**
  - Verbatim Quran in ﴿ ﴾, and tag 21:69 and 7:23 with `data-ayah`.
  - Musa 28:7 paraphrase becomes indirect speech (`UI/story-prophet-musa.html:88`).
  - Yusuf bowing parent line (`:173`), and the Yusuf dua page (`:193`).
  - "stone by stone" (`UI/story-prophet-ibrahim.html:259`).
  - Ibrahim "What We Learn" Arabic.
  - عليه السلام on all AR titles, and a salutation at the first mention in each story.
  - Drop quotation marks around invented morals.
- **Plates**
  - Ibrahim 8 (generated Ka'bah).
  - Ibrahim 5 (check the reliefs).
  - Al-Fil 4 (blood-red stones).
  - Al-Kawthar 2 (sheep on a prayer rug).

## Decisions for the owner
1. The Volume I title. Recommended: «في حفظ الله» / "In Allah's Care".
2. Whether the English name "The Verse of the Throne" stays. If it stays, the Kursi page must
   not equate Kursi with Throne.
3. Whether Talk pages carry a small answer key with sources (recommended), or lose the
   hadith-based questions.
