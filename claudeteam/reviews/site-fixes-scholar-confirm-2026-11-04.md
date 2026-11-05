# Scholar confirmation of the site fixes (islamic-content-scholar, 2026-11-04)

Scope: the uncommitted wording and plates written by the story/site fixers under
`game-islamic-review-2026-11-03.md` and `book-islamic-review-2026-11-04.md`.
Read-only review: `git diff` of `UI/story-prophet-*.html`, `UI/translations.js`, `UI/voice-scripts.js`,
the 20 `UI/surah-*.html` pages, `UI/ayat-al-kursi.html`, `UI/quran.html`,
`UI/scripts/narrate-s2pro.py`, `UI/scripts/verify-scripture.py`, `UI/scripts/specs/*.py`, and the
plates at 100%.

## Verdict

**APPROVED, with three CHANGEs.**
- **C1, MUST:** the new Arabic narration has the synthesised voice reciting Quranic Arabic.
- **C2, SHOULD:** Musa 28:7 puts "basket" inside Allah's inspiration.
- **C3, MUST (carried from 11-03):** the Kursi chair icon is still on three pages.

All 11 plates pass section 3b.

## 0. Verifier (run from `UI/`, `python3 scripts/verify-scripture.py`)

```
surah-ad-duha.html         ok  (11 verses + complete-surah block)
... (all 20 surah pages ok; Uthmani-spelling notes only on adiyat, asr, bayyinah, falaq,
     humazah, ikhlas, an-nas, an-nasr)
surah-fatiha.html          ok  (7 verses + complete-surah block)
surah-quraysh.html         ok  (4 verses + complete-surah block)
ayat-al-kursi.html         ok  (8 phrase-cards concatenate to 2:255)
story-prophet-ibrahim.html 21:69 ok  (whole ayah)
story-prophet-musa.html 20:12 ok  (part of the ayah)
story-prophet-musa.html 20:44 ok  (part of the ayah)
story-prophet-yusuf.html 12:92 ok  (part of the ayah)
story-prophet-yusuf.html 12:101 ok  (part of the ayah)

ALL SCRIPTURE MATCHES
```

**Independent check.** I compared the five story ayat character by character, with diacritics
kept, against `api.alquran.cloud/v1/ayah/{s}:{a}/quran-simple`.
- After the trailing whitespace is stripped, each quote is an exact substring of the ayah.
- 21:69 is the whole ayah.
- 20:12, 20:44, 12:92 (without «قَالَ») and 12:101 (the dua portion) are contiguous parts.

**The new check in the verifier.** The `۝`-count check in `check_full_block` passes. The
Bismillah line on every non-Fatiha page carries no ۝, and Al-Fatiha keeps ۝١ on its Bismillah
(`UI/surah-fatiha.html:124`).

---

## ROUND 1

### R1-1. Ibrahim scenes 2-4 and the lesson reveal: APPROVED
`UI/story-prophet-ibrahim.html:112,140,163,170-174`.
- Reasoning with his people matches 6:83 «وَتِلْكَ حُجَّتُنَا آتَيْنَاهَا إِبْرَاهِيمَ عَلَىٰ قَوْمِهِ».
- The paraphrase "I do not love things that disappear" / «لا أحبّ ما يغيب» is a faithful child
  rendering of «لَا أُحِبُّ الْآفِلِينَ» (6:76). It is a paraphrase of a person's speech, in plain
  quotation marks and not styled as scripture, which the 11-03 ruling allows.
- **The question form "Is this my lord?" / «هل هذا ربي؟» is approved.** It follows the reading
  of «هَٰذَا رَبِّي» as a rebuking question with the hamza dropped (one of the recognised
  tafsir readings). It is also the safer form for children.
- Scenes 3 and 4 keep the statement form "This is my lord!", now framed as "he said to his
  people". That is the Quran's own wording and the framing makes it argument, so it is
  acceptable. The mix of question and statement is not an error.
- The lesson reveal "Ibrahim showed his people that only Allah ... deserves to be worshipped" /
  «بيّن إبراهيم لقومه» is approved.
- **NOTE (left over, not in this round):** the lesson item "Always search for the truth" /
  «ابحث عن الحق دائماً» is still at `:286`, and in the narration at `UI/voice-scripts.js:240`.
  It is a remnant of the old "still searching" framing. The 11-04 SHOULD stands: use "Think,
  and follow the truth" / «فكّر واتّبع الحق».

### R1-2. Adam scene 4, "What did Iblis do wrong?": APPROVED
`UI/story-prophet-adam.html:172-176`; `UI/translations.js:63-66,239-242`.
- The options are "He fell asleep" / «نام», "He was proud and refused to bow" / «تكبّر ورفض أن
  يسجد» (correct), and "He ran away" / «هرب».
- The correct answer matches 2:34 «أَبَىٰ وَاسْتَكْبَرَ».
- The wrong options are about Iblis, not a prophet, so nothing wrong is attributed to a prophet.
- The feedback is the generic `feedbackCorrect` / `feedbackThinkAgain`
  (`UI/interactive-story.js:465,472`). Nothing about Allah's "feelings" remains.
- The i18n keys are still named `scene4Happy`, `scene4Displeased` and `scene4Surprised`. That is
  cosmetic only.

### R1-3. Ibrahim 242, "cool and safe ... walked out unharmed": APPROVED
`UI/story-prophet-ibrahim.html:244` reads "The fire became cool and safe! Ibrahim walked out
unharmed." The Arabic is «فصارت النار برداً وسلاماً! وخرج إبراهيم سالماً لم يُصبه أذى». The
"garden" embellishment is gone. It follows the 21:69 block correctly (see R2-5).

### R1-4. Yusuf: APPROVED on the page; the Arabic narration needs CHANGE (see C1)
- **The gloss** «أي: لا لومَ عليكم اليوم ولا عتاب» (`UI/story-prophet-yusuf.html:172`) is correct.
  تثريب is reproach or blame.
- **The order of events** is approved. The text now says "he gave them food. Later, when they
  knew who he was, Yusuf forgave them" (`:170`), which matches 12:58-62 and then 12:89-92.
- **The English narration** gives the meaning (`UI/voice-scripts.js`, Yusuf EN slide 8). Approved.
- **The Arabic narration** (Yusuf AR slide 8) reads «...لا لوم عليكم اليوم، يغفر الله لكم، وهو
  أرحم الراحمين». Its second half is the ayah's wording verbatim, voiced by the TTS clone.
  Replacement under C1.

### R1-5. Musa "by Allah's command" and Az-Zalzalah "Allah knows it": APPROVED
- Musa: `UI/story-prophet-musa.html:214` reads "Allah told Musa to strike the sea ... by Allah's
  command the whole sea split". The Arabic is «أمر الله موسى أن يضرب البحر بعصاه ... بأمر الله».
  This satisfies the 11-03 MUST and SHOULD.
- Az-Zalzalah: `UI/surah-az-zalzalah.html:90,422` reads "Allah knows it" / «الله يعلمه».
  "Noticed" implied coming to know, and it is gone. Approved.

### Also seen in round 1 (not asked): APPROVED
- **Nuh 7:** `UI/story-prophet-nuh.html:159` is the 11-03 text word for word. The dove is gone.
- **Ibrahim:** "stone by stone" is at `:261`.
- **NOTE:** the Kaaba mini-game below it still says "Bricks: 0/9" and "🧱 Add Brick"
  (`UI/story-prophet-ibrahim.html:272,274`), while its Arabic says «ضع حجراً». Suggested:
  "Stones: 0/9" and "🪨 Add a stone". Cosmetic.

---

## ROUND 2

### R2-1. Musa 28:7 in indirect speech, keeping "basket": CHANGE (SHOULD)
**The indirect speech is approved.** "Basket" in the scene title, the plate, the narration of what
the mother did, and the quiz is acceptable. It is a narrative detail, and I ruled it a note on
11-04.

The current sentence is different: it puts "basket" **inside what Allah inspired**. The text is
"Allah inspired her to place him in a basket on the river" / «ألهمها الله أن تضعه في سلة على
النهر» (`UI/story-prophet-musa.html:88`). The Quran says that what Allah inspired was التابوت
(20:39), a chest, and the basket of reeds is Exodus 2:3. Take the container out of the inspired
words, and let "basket" stay in the narration that follows.

- EN replacement: "Musa's mother was so worried. Then Allah inspired her to set him afloat on the
  river, told her not to be afraid, and promised to bring him back to her. That was a very hard
  thing to do! But she trusted Allah completely, and she gently set the little basket onto the
  water of the River Nile."
- AR replacement: «كانت أم موسى قلقة جداً. ثم ألهمها الله أن تضعه على ماء النهر، وألّا تخاف،
  ووعدها أن يردّه إليها. كان ذلك أمراً صعباً جداً! لكنها وثقت بالله تماماً، ووضعت السلة الصغيرة
  برفق على ماء نهر النيل.»
- Apply the same to Musa slide 1 in `UI/voice-scripts.js`, EN and AR, and re-take
  `UI/audio/prophet-musa/{en,ar}/slide-1.mp3`.

### R2-2. Musa 20:12 lead-in and the 20:44 gloss: APPROVED on the page; Arabic narration under C1
- «ناداه الله باسمه، وقال له:» / "Allah called him by his name, and said:" is correct (20:11
  «نُودِيَ يَا مُوسَىٰ»).
- «أي: كلِّماه بكلام ليّن لطيف» is a correct gloss of «فَقُولَا لَهُ قَوْلًا لَيِّنًا».
- Both ayat are partial quotes. Each stops at a natural pause, and the reference names the ayah.

### R2-3. Musa, "Allah told him to throw down his staff" / «أمره الله أن يُلقي عصاه»: APPROVED
This is indirect speech for 20:19 and 28:31.

### R2-4. The two Adam indirect sentences: APPROVED
`UI/translations.js:42,88,218,264`:
- "Allah told the angels that He was going to create a human being from clay" / «وأخبر الله
  الملائكة أنه سيخلق بشراً من طين» (38:71).
- "ONE tree they must not go near" / «إلا شجرة واحدة نهاهما أن يقربا منها» (2:35).

The scene 8 slip wording «فأزلّهما الشيطان فأخطآ» (`:271`) is as ruled. Repeating «الشيطان» twice
in that sentence is for `arabic-reviewer`, not a correctness issue.

### R2-5. Ibrahim 21:69: APPROVED
`UI/story-prophet-ibrahim.html:241-243`.
- The lead-in "But Allah protected Ibrahim. In the Quran, Allah tells us:" is correct.
- "We said: O fire, be coolness and safety for Ibrahim" is the standard rendering.
- The gloss «أي: أمر الله النارَ أن تكون باردة سالمة لا تؤذي إبراهيم» is correct.
- **Optional NOTE:** the English shows no gloss, so a child may ask who "We" is. The lead-in
  already says "Allah tells us", so this is acceptable as it is.
- The **Arabic narration** of this slide recites the ayah. See C1.

### R2-6. Yusuf 12:101 block, the dua note, and the bow-of-respect line: APPROVED
`UI/story-prophet-yusuf.html:173,192-194`.
- The 12:101 dua portion is exact, and its translation is sound.
- "and then he made this dua. We can make it too!" is accurate. The dua is the closing part
  of 12:101, after the thanks.
- The parent line «كان سجود تحية واحترام، وكان مباحاً في زمانهم. وفي الإسلام لا نسجد إلا لله.»
  and the English "It was a bow of respect, allowed in their time. In Islam we prostrate only to
  Allah." are correct and as ruled.
- The **Arabic narration** of slide 10 recites the dua verbatim. See C1.

### R2-7. Kursi: APPROVED, plus CHANGE C3
`UI/ayat-al-kursi.html:70,291-296`.
- The new Q1 is "What does the verse tell us about the Kursi?" with the answer "It holds the
  heavens and the earth" / «أنه وسع السماوات والأرض». This is 2:255 «وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ
  وَالْأَرْضَ». The distractors (book, star, mountain) are harmless.
- The intro is «الكرسي مخلوق عظيم من خلق الله، وسع السماوات والأرض، ولا نعلم كيف هو», and the
  English "how great ... greater than" is as ruled.
- **Renaming to "the Verse of the Kursi" is approved.** It keeps the Kursi distinct from the
  'Arsh. I found no "throne" or "footstool" left in any HTML or JS outside `UI/games/`.

**C3, MUST (from 11-03 §2, 06 fix 1):** the hero icon is still a chair. The 11-03 ruling found
the 🪑 icon anthropomorphic, because it gives the Kursi a sat-upon form. It is at:
- `UI/ayat-al-kursi.html:50` `<div class="surah-icon" aria-hidden="true">🪑</div>`
- `UI/quran.html:428` `<div class="story-thumbnail" aria-hidden="true">🪑</div>`
- `UI/index.html:117` `<div class="story-icon" aria-hidden="true">🪑</div>`

Replacement: `✨` in all three, matching the page's own "✨ Greatest Verse" badge.

### R2-8. Ikhlas: APPROVED
`UI/surah-al-ikhlas.html:72` reads "equal to a third of the Quran: its reward is like reciting a
third of the Quran". The Arabic is «تعدل ثلث القرآن: أجر قراءتها كأجر قراءة ثلث القرآن». It
matches al-Bukhari 5013, and the "three times = whole Quran" extrapolation is gone.

### R2-9. Al-Bayyinah 2: APPROVED
`UI/surah-al-bayyinah.html:155` reads "a Messenger, the Prophet Muhammad ﷺ, reciting it aloud" /
«رسولٌ هو النبي محمد ﷺ يتلو بصوته», as ruled. Quiz Q2 «ما هي البيّنة؟» is fine.

### R2-10. Bismillah on its own line on 20 pages: APPROVED
- All 20 pages have `<span class="full-bismillah">` with no ۝.
- `UI/surah.css:475` gives it `display:block; text-align:center`.
- The template is fixed (`UI/scripts/surah-page-template.py:115-121`).
- Al-Fatiha is unchanged and correct (Bismillah = ۝١).
- The verifier now guards this.

### R2-11. Audio-only substitution of ﷺ: APPROVED
`UI/scripts/narrate-s2pro.py`, in `units()`, replaces ﷺ with "peace be upon him" in English and
«صلى الله عليه وسلم» in Arabic, in the audio only. This is better adab, not merely acceptable:
the salutation is meant to be *said* in full, and the ligature is only its written shorthand. The
pages keep ﷺ.
- Some English sentences come out stilted ("the Prophet's, peace be upon him, path"). That is
  acceptable.

### Also seen in round 2 (ﷺ and salutations): APPROVED
- ﷺ added at:
  - `UI/surah-al-masad.html:181` (M9 closed)
  - `UI/surah-al-falaq.html:100`
  - `UI/surah-al-fil.html:101`
  - `UI/surah-al-kafirun.html:84`
  - `UI/surah-an-nasr.html:90`
  - `UI/quran.html:244`
- At-Tin EN now reads "Musa (peace be upon him)" in place of the Arabic عليه السلام inside
  English text.

---

## C1. MUST: the TTS voice reads Quranic Arabic in the new Arabic narration

**The rule.** This is the site's own rule (`UI/surah-narration.js:46-47`, "a recitation is not a
reading"). The 11-03 ruling restated it: "No synthesised voice may read Quranic Arabic. The
meaning may be narrated."

**The problem.** In English, a translation *is* the meaning. In Arabic, speaking the ayah's own
words *is* recitation, so the Arabic narration must use the gloss. The new Ibrahim line even
announces it: «يقول الله تعالى في القرآن: قلنا يا نار كوني برداً وسلاماً على إبراهيم». These
slides have already been re-rendered with the voice clone.

**The fix.** Replace these `UI/voice-scripts.js` Arabic scripts exactly, then re-take the listed
mp3s:

| Unit | Current (verbatim ayah) | Replacement script |
|---|---|---|
| prophet-ibrahim ar slide-6 | «لكنّ الله حمى إبراهيم. يقول الله تعالى في القرآن: قلنا يا نار كوني برداً وسلاماً على إبراهيم. فصارت النار...» | «لكنّ الله حمى إبراهيم، فأمر النارَ أن تكون باردة سالمة لا تؤذيه. فصارت النار برداً وسلاماً! وخرج إبراهيم سالماً لم يُصبه أذى. سبحان الله! هذا يُظهر أن الله يحمي من يثقون به.» |
| prophet-musa ar slide-5 | «...ناداه الله باسمه، وقال له: إني أنا ربك. يا له من شرف عظيم!» | «كبر موسى وأصبح رجلاً قوياً صادقاً. وبعد سنوات، بينما كان يسافر مع عائلته ليلاً، رأى نوراً يتوهج على جبل يسمى الطور. صعد ليأخذ ناراً تدفئ عائلته، وهناك كلمه الله مباشرة! ناداه الله باسمه، وأخبره أنه ربّه. يا له من شرف عظيم!» |
| prophet-musa ar slide-8 | «قال الله لموسى وأخيه هارون شيئاً جميلاً: فقولا له قولاً ليناً. ...» | «أمر الله موسى وأخاه هارون بأمر جميل: أن يكلّما فرعون بكلام ليّن لطيف. حتى مع ملك قاسٍ مثل فرعون، كان عليهما أن يكونا مؤدبين! قال موسى: اعبد الله وحده، وأطلق سراح قومي. لكن فرعون كان متكبراً جداً. فاستدعى أفضل سحرته ليثبت أن موسى مخطئ.» |
| prophet-yusuf ar slide-8 | «...سامحهم من كل قلبه وقال لهم: لا لوم عليكم اليوم، يغفر الله لكم، وهو أرحم الراحمين. ...» | «بعد سنوات، جاء إخوة يوسف إلى مصر يطلبون الطعام. لم يعرفوه، لكنه عرفهم! وبدل أن يغضب، أعطاهم الطعام. ثم لما عرفوا من هو، سامحهم من كل قلبه، وأخبرهم أنه لا لوم عليهم اليوم ولا عتاب، ودعا الله أن يغفر لهم، فالله أرحم الراحمين. وجاءت أسرته كلها لتعيش في مصر، وتحققت رؤياه - فسجدوا له جميعاً احتراماً ومحبة! كان سجود تحية واحترام، وكان مباحاً في زمانهم. وفي الإسلام لا نسجد إلا لله.» |
| prophet-yusuf ar slide-10 | «...ثم دعاه بهذا الدعاء: أنت وليي في الدنيا والآخرة، توفني مسلماً وألحقني بالصالحين. ...» | «شكر النبي يوسف الله على كل نعمه، ثم دعاه أن يكون وليَّه في الدنيا والآخرة، وأن يتوفّاه مسلماً ويُلحقه بالصالحين. ونحن أيضاً ندعو بهذا الدعاء!» |

Re-take these:
- `UI/audio/prophet-ibrahim/ar/slide-6.mp3`
- `UI/audio/prophet-musa/ar/slide-5.mp3`
- `UI/audio/prophet-musa/ar/slide-8.mp3`
- `UI/audio/prophet-yusuf/ar/slide-8.mp3`
- `UI/audio/prophet-yusuf/ar/slide-10.mp3`

The English slides are translations, so they are approved as they are.

**SHOULD, pre-existing and outside this round:** the Adam Arabic narration recites 7:23 in full
at `UI/voice-scripts.js:170` and `:188`. Give the meaning instead, for example: «توجّها إلى الله
واعترفا بخطئهما، وسألاه أن يغفر لهما ويرحمهما». The child learns the dua itself from the vowelled
text on the page.

---

## PLATES (section 3b), each reviewed at 100% (960x540)

| Plate | Ruling | Notes |
|---|---|---|
| Nuh 3 `stories/prophet-nuh/scene-3.webp` | APPROVED | A seasons tree on a green mound. No suns or moons, no faces. Fallen leaves only. |
| Musa 3 `stories/prophet-musa/scene-3.webp` | APPROVED | A riverside garden, pool, palms and lotus. No building, no niche, no glyphs. The small dark fountain-head in the pool is not a figure. |
| Musa 7 `stories/prophet-musa/scene-7.webp` | APPROVED | See the ruling below. |
| Ibrahim 3 `stories/prophet-ibrahim/scene-3.webp` | APPROVED | The moon over dunes is plain, with no face. The signature is gone, and the dune is clean at 100%. |
| Ibrahim 8 `stories/prophet-ibrahim/scene-8.webp` | APPROVED | Rope, mallet, chisel, stone and jug on sand. No House, no tiles. This is exactly the ruling. |
| Az-Zalzalah 4 `surahs/surah-az-zalzalah/verse-4.webp` | APPROVED | Cracked earth with a sprout. No book, no footprints, no glyphs. The border is non-figurative. M6 is closed. |
| Al-Fil 4 `surahs/surah-al-fil/verse-4.webp` | APPROVED | Birds in flight with small brown clay pebbles. No red, no splash, no targets or bodies. |
| Al-Kawthar 2 `surahs/surah-al-kawthar/verse-2.webp` | APPROVED | See the ruling below. |
| Al-Bayyinah 1 `surahs/surah-al-bayyinah/verse-1.webp` | APPROVED | A dawn path over dunes. No scroll and no niche. M7: this is now fit for a front cover. |
| Al-Falaq 1 `surahs/surah-al-falaq/verse-1.webp` | APPROVED | The ridge is now a clean dark line with the dawn glow. No upright shapes. The grass tufts in the foreground do not read as figures. |
| Ash-Sharh 1 `surahs/surah-ash-sharh/verse-1.webp` | APPROVED | Dunes opening onto a green valley with a stream and palms. No rock face, no eye. |

**Musa 7: the glazed 2x4 window grids.**
- I cropped both windows and enlarged them.
- Each is a narrow multi-pane sash: one central glazing bar, and three or four horizontal bars
  running the full width.
- That reads as a ladder or grid of equal panes. It is not a Latin cross, which needs a single
  crossbar set high on a longer upright. No single "+" dominates.
- At thumbnail size the windows are a few pixels and show no shape.
- The plate is symmetrical, so RTL mirroring changes nothing.
- **Approved.** The rule to watch for in future is a **2x2** window (one bar each way), which
  does read as a cross.
- The empty stepped dais has no statue, throne or symbol. It is acceptable as a palace hall.
- The glazed windows are anachronistic for Pharaoh's Egypt. That is an art note, not a
  religious one.

**Al-Kawthar 2: no longer showing prayer.** Approved.
- The plate illustrates «وَانْحَرْ» with a calm, living sheep beside a tent. No sacrifice is shown,
  and this is right for the age band.
- The verse's «فَصَلِّ» is carried by the text. A plate need not picture both halves of an ayah.
- My 11-04 ruling asked only that the prayer mat and the sacrifice not be conflated. Leaving the
  rug out meets that.
- A separate plain rug, apart from the sheep, would also have been acceptable. It is not
  required.

**The global "prayer rug" negative versus An-Nasr 3, Al-Ma'un 4, Al-Bayyinah 5 and Ash-Sharh 7.**
I viewed all four. **A rug is acceptable in all four.**
- An empty prayer rug is a respectful way to show salah without a person, which the site may
  never draw.
- Each plate fits its ayah:
  - An-Nasr 3: tasbih and istighfar. The rug has prayer beads on it, in a courtyard.
  - Al-Ma'un 4: «فَوَيْلٌ لِلْمُصَلِّينَ». A neglected, rolled rug under cobwebs, already
    approved on 11-04.
  - Al-Bayyinah 5: «وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ». A rug beside a bowl of grain.
  - Ash-Sharh 7: «فَإِذَا فَرَغْتَ فَانْصَبْ». A rug on a rooftop at evening.
- At 100% all four rugs carry only geometric lozenges: no text, no pseudo-script, no Ka'bah or
  mosque image, no figure.
- In Al-Ma'un 4 there is a grey squiggle at the top right. At 100% it reads as a cobweb or a
  crack, not script.

The global negative was a blunt instrument for the Kawthar fault. Make it **per plate**:
- Keep "prayer rug, prayer mat" in `NEGATIVE` (`UI/scripts/specs/illustrations.py:54`) for
  plates that do not ask for a rug.
- For the four rug plates, drop it from that plate's negative. Add instead "kaaba on the rug,
  mosque picture on the rug, writing on the rug, animal on the rug, shoes on the rug".

A prayer rug is never to appear:
- with an animal on it;
- under shoes or feet;
- as a sacrifice surface;
- with a woven Ka'bah, mosque or text.

---

## Summary table

| Item | Ruling |
|---|---|
| R1-1 Ibrahim scenes 2-4, 6:76 paraphrase, question form | APPROVED (NOTE: "Always search for the truth" at `:286` still pending) |
| R1-2 Adam "What did Iblis do wrong?" | APPROVED |
| R1-3 Ibrahim "cool and safe ... unharmed" | APPROVED |
| R1-4 Yusuf gloss, food then forgiveness | APPROVED (page); AR narration: CHANGE under C1 |
| R1-5 Musa "by Allah's command"; Zalzalah "Allah knows it" | APPROVED |
| R2-1 Musa 28:7 indirect, "basket" | CHANGE (SHOULD): basket out of Allah's inspiration; text above |
| R2-2 Musa 20:12 lead-in, 20:44 gloss | APPROVED (page); AR narration: CHANGE under C1 |
| R2-3 "Allah told him to throw down his staff" | APPROVED |
| R2-4 Adam indirect sentences | APPROVED |
| R2-5 Ibrahim 21:69 | APPROVED (page); AR narration: CHANGE under C1 |
| R2-6 Yusuf 12:101, dua note, bow line | APPROVED (page); AR narration: CHANGE under C1 |
| R2-7 Kursi Q1, "Verse of the Kursi" | APPROVED; plus C3 (MUST): 🪑 to ✨ at three places |
| R2-8 Ikhlas third | APPROVED |
| R2-9 Bayyinah 2 | APPROVED |
| R2-10 Bismillah own line, 20 pages | APPROVED |
| R2-11 ﷺ spoken in full in audio | APPROVED |
| Plates (11) | APPROVED, including Musa 7 windows and Kawthar 2 |
| Rug in Nasr 3, Ma'un 4, Bayyinah 5, Sharh 7 | APPROVED; make the rug negative per-plate |
| C1 TTS reciting Quranic Arabic (5 AR slides) | CHANGE (MUST): scripts above; re-take 5 mp3s |

---

## Round 3 (2026-11-04)

Read-only review of `git diff` (`UI/voice-scripts.js`, `UI/story-prophet-*.html`,
`UI/mockups/games/06-deeds-garden.html`), the round-3 fixer's scans
(`scan-after.tsv`, `scan_quran.py`, `scan_surah_tr.py`), my own re-count
(`scholar_tr_exact.py`, `scholar_ex.py` in the session scratchpad), and
`api.alquran.cloud/v1/ayah/108:1/ar.muyassar`.

### PART 1. Round-3 wording: APPROVED

| Item | Evidence | Ruling |
|---|---|---|
| Adam AR slide 8 | `UI/voice-scripts.js:170` «شعر آدم وحواء بالندم الشديد. فتوجَّهَا إلى الله واعترَفَا بخطئهما، وسألاه أن يغفر لهما ويرحمهما...» | APPROVED. This is the meaning of 7:23 in indirect speech, as suggested under C1. The dual vowelling (تَوَجَّهَا، اعْتَرَفَا) is correct. |
| Adam AR slide 11 | `UI/voice-scripts.js:188` «...فيه اعترف آدم وحواء بخطئهما، وسألا الله أن يغفر لهما ويرحمهما. تعلّم كلماته المكتوبة أمامك، وقُله...» | APPROVED. The voice gives the meaning and sends the child to the vowelled text on the page. «قُله» is correct. |
| Adam AR slide 7, tashkeel | `UI/voice-scripts.js:164` «فأخطآ وأكَلا ... أدرَكا» | APPROVED. أَكَلَا and أَدْرَكَا are correct dual past forms, and so is أخطآ. On «فأزلّهما» see D below. |
| Ibrahim lesson "Think, and follow the truth" / «فكّر واتّبع الحق» | `UI/story-prophet-ibrahim.html:284-286`, `UI/voice-scripts.js:240` and `:258`, `UI/mockups/games/06-deeds-garden.html:398` | APPROVED, and it is the same wording at all four places. It closes the R1-1 NOTE. It takes the lesson of 6:76-79 (reasoning leads to tawhid) without suggesting that Ibrahim was ever unsure. |
| Mini-game "Stones:" / «الحجارة:», "🪨 Add a stone" / «🪨 ضع حجراً» | `UI/story-prophet-ibrahim.html:272`, `:274` | APPROVED. Stones fit the narration (Ismail bringing stones and Ibrahim building, Bukhari 3364) and 2:127 (raising the foundations). The internal id `brickCount` is invisible and does not matter. |
| C1, five AR scripts | `UI/voice-scripts.js:256` (Ibrahim 6), `:381` (Musa 5), `:384` (Musa 8), `:339` (Yusuf 8), `:341` (Yusuf 10) | APPROVED. Each one matches the C1 table word for word. |
| C2, Musa slide 1 | `UI/voice-scripts.js:355` (EN), `:377` (AR), `UI/story-prophet-musa.html:88` (page, EN and AR) | APPROVED. Each one matches R2-1 word for word. "Basket" is no longer inside Allah's inspiration. |
| Musa slide 8, page text | `UI/story-prophet-musa.html:178-181` | APPROVED. This is not story prose any more. The ayah stands in its own vowelled `quran-text story-ayah` block (`data-ayah="20:44"`, checked by the verifier), followed by the gloss «أي: كلِّماه بكلام ليّن لطيف. (سورة طه، الآية ٤٤)». The old prose quote «قولا له قولاً ليناً» is gone. No voice reads page text: stories narrate only from `voice-scripts.js` (`UI/audio-narration.js:383`, `:425`). Showing a cited, vowelled ayah on the page is exactly what the site should do. |

### PART 2. Recitation by the synthetic voice

#### The site-wide rule (apply to every narration script, AR and EN, and to every Web Speech fallback)

1. **No synthetic voice speaks Quranic wording.** This covers the Fish S2-Pro clone and Web Speech. It applies to Arabic script and to transliteration alike.
   - Forbidden: (a) any ayah or part of an ayah framed as a quotation («قال الله:», «يقول الله تعالى في القرآن», «دعا: ...», "In Arabic it is: ..."), at any length; (b) any **whole ayah**, however short («القارعة», «ملك الناس», «الرحمن الرحيم» when it is presented as the ayah); (c) any unframed run of **4 or more consecutive words** of an ayah.
2. **Allowed in the voice:**
   - the Names and Attributes of Allah (السميع العليم، أرحم الراحمين، العلي العظيم);
   - dhikr and Sunnah formulas: بسم الله، الحمد لله، سبحان الله، لا إله إلا الله، حسبي الله، أستغفر الله، إن شاء الله، and the isti'adha أعوذ بالله من الشيطان الرجيم. These are adhkar, not tilawa, even where an ayah contains the same words;
   - ordinary narrative nouns, names and numbers (أحد عشر كوكباً والشمس والقمر);
   - a single key Quranic word that an explanation is explaining (الكوثر، سجيل، الحطمة);
   - dialogue fragments of 2-3 words inside the narrator's own sentence, with no "the Quran says" framing.
3. **Speech of Allah, a prophet or Iblis that the Quran reports is given in the voice as indirect speech** in Arabic: third person, the narrator's own words. In English, a translation is meaning, so it may stay direct and be voiced.
4. **The Quranic words themselves live on the screen**, vowelled, cited, and checked by `verify-scripture.py`. If the team wants a child to *hear* an ayah or a Quranic dua, the only acceptable source is a **human** recording: a licensed qari's recitation, or the owner reading in his own real voice with checked pronunciation. A clone is never acceptable.
5. **Enforcement.** Turn the fixer's scan into a check that fails the build. Flag any unit with a whole ayah or a run of 4 or more words, against a whitelist of the formulas in rule 2 that I review. Run it against `units()` in `scripts/narrate-s2pro.py`, so that it sees exactly what the voice will say, ﷺ substitution included.

#### A. Surah pages: the AR "meaning" line is the ayah itself. CHANGE (MUST)

**Scale: 148 of 148, not 127.** The fixer's 3-gram scan cannot see ayat of one or two words (Qariah 1-2, Nas 2-3, Fatiha 3, Ma'un 4, and so on). My re-count tested whether each AR `.translation` line is a contiguous part of its own ayah after normalising. **146 are verbatim.** The other 2 differ only in hamza spelling (Ma'un 6 «يراؤون», Kursi 8 «يؤوده»). So every one of the 148 AR verse mp3s opens by reciting its ayah, and so does `textFor()` in AR mode (`UI/surah-narration.js:46-55`). Games 07 and 08 play these files (`UI/mockups/games/07-ayah-lanterns.html:352`, `08-al-fil-seek.html:414`). Example: `UI/surah-al-kawthar.html:136` `data-ar="&quot;إنا أعطيناك الكوثر&quot;"`.

Per page (AR verse units needing a new meaning line): Fatiha 7, Duha 11, Sharh 8, Tin 8, Bayyinah 8, Zalzalah 8, Adiyat 11, Qariah 11, Takathur 8, Asr 3, Humazah 9, Fil 5, Quraysh 4, Ma'un 7, Kawthar 3, Kafirun 6, Nasr 3, Masad 5, Ikhlas 4, Falaq 5, Nas 6, Kursi 8. **Total 148.**

Separately, the Bismillah header line on the 20 non-Fatiha pages also shows «بسم الله الرحمن الرحيم» as its "translation". It is not voiced (it is not a verse card), so it is a NOTE: give it the same meaning treatment so that the page is consistent.

The AR verse explanations are clean. My scan found no explanation with a run of 4 or more words from its own surah. The only 5-word hit is «واحد لا إله إلا هو» (Ikhlas 1), which is the tawhid formula and is allowed.

**Ruling: a simplified tafsir sentence per ayah. Not "no AR audio" as the permanent answer.** An Arabic-speaking child deserves the meaning in Arabic as much as an English-speaking child does.

- **Sources.** The primary source is **al-Tafsir al-Muyassar** (مجمع الملك فهد لطباعة المصحف الشريف). It is available as the edition `ar.muyassar` on `api.alquran.cloud`; I confirmed this on 108:1. The secondary source, where Muyassar is too long, is **al-Mukhtasar fi Tafsir al-Quran al-Karim** (مركز تفسير للدراسات القرآنية). Do not use any other source without asking me.
- **Paraphrasing for children:**
  1. **Meaning only from the source.** Simplify; do not add. No details the source lacks, and no isra'iliyyat. Where the source gives more than one view, take its first or main view and do not state it more firmly than it does.
  2. **Do not copy the ayah words that Muyassar itself embeds.** Muyassar often opens with the ayah (108:1: «إنا أعطيناك -أيها النبي- الخير الكثير...»). Rule 1 still applies: no whole ayah and no run of 4 or more words. A single key word that is being explained may stay.
  3. **Write as the narrator, in the third person** («يُقسم الله بـ...»، «يخبرنا الله أن...»، «أعطى الله النبيَّ ﷺ...»). Never use «قال الله:» quote framing, and never use quote marks.
  4. **Child level.** One sentence, two at most, of about 25 words or fewer, in everyday MSA. Explain a hard word inside the sentence.
  5. **Attributes of Allah:** affirm them as Muyassar does, without likening them to creation and without explaining them away. For Kursi 7, say that His Kursi is vaster than the heavens and the earth. Do not render it as "knowledge" or "throne".
  6. **Warning ayat** (Masad, Humazah, Qariah 8-11, Bayyinah 6, Takathur): say them plainly and briefly, with nothing graphic. Tie the warning to deeds, and where the surah allows, pair it with the mercy or reward ayah.
  7. **Agree with the English translation on the same card.** The line gives the meaning; the existing explanation carries the lesson. Do not repeat the explanation.
  8. **Every line comes to me before rendering.**
- **Model lines (Kawthar), for calibration:**
  - 108:1 «أعطى اللهُ النبيَّ ﷺ خيراً كثيراً جداً في الدنيا والآخرة، ومن هذا الخير نهرُ الكوثر في الجنة.»
  - 108:2 «فاشكر الله على هذا الخير: صلِّ له وحده، واذبح أضحيتك لله وحده.»
  - 108:3 «والذي يكره النبيَّ ﷺ هو المقطوع من كل خير.»
- **On screen: change it too (MUST).** On an Arabic page, the "meaning" slot must show the meaning sentence, not the ayah a second time in unvowelled form inside quote marks. The vowelled ayah is already on the card above it. This also fixes the Web Speech fallback, which reads `.translation`. Keep one source: the `data-ar` of `.translation` is both the on-screen line and the voice line.
- **Interim, until the 148 lines are written and approved (MUST, now):**
  - Stop the AR verse audio from reciting. Re-render the AR `verse-N.mp3` from the explanation only, by dropping the translation half of `units()` for `lang == "ar"`.
  - In `textFor()`, skip `.translation` when `lang() === 'ar'`.
  - If re-rendering cannot be done quickly, do not play AR verse audio at all (surah pages and games 07 and 08). This breach has existed since the AR verse audio first shipped, and children are hearing a clone recite the Quran now.

#### B. Story AR scripts with ayat verbatim

| Unit | Fixer draft | Ruling |
|---|---|---|
| Ibrahim AR slide 9 (2:127), `UI/voice-scripts.js:259` | «سألا الله أن يتقبّل منهما عملهما، فهو السميع العليم» | APPROVED, with an addition. «السميع العليم» are Names of Allah and are allowed. Full line: «هذا هو الدعاء الجميل الذي دعا به إبراهيم وإسماعيل أثناء بناء الكعبة: سألا الله أن يتقبّل منهما عملهما، فهو السميع الذي يسمع كل دعاء، العليم الذي يعلم كل شيء. تعلّم كلماته المكتوبة أمامك وادعُ بها!» |
| Musa AR slide 13 (20:25-26), `:389` | «سأل الله أن يشرح له صدره وييسّر له أمره» | APPROVED, with a gloss for children. Full line: «هذا دعاء جميل دعا به النبي موسى: سأل الله أن يشرح له صدره، أي يملأ قلبه طمأنينة وشجاعة، وأن ييسّر له أمره، أي يسهّل عليه مهمته. دعا به قبل أن يواجه فرعون. تعلّم كلماته المكتوبة أمامك، وادعُ به قبل أي أمر صعب، مثل الامتحان أو التحدث أمام الصف!» |
| Nuh AR slide 9 (71:28), `:299` | «سأل الله أن يغفر له ولوالديه» | APPROVED. Full line: «هذا دعاء جميل دعا به النبي نوح: سأل الله أن يغفر له ولوالديه. تعلّم كلماته المكتوبة أمامك، وادعُ به أنت أيضاً لنفسك ولوالديك!» |
| Musa AR slide 10 (26:62), `:386` | «كلا! فالله معي وسيهديني» | CHANGE. This is still direct speech, and it follows the ayah's shape word for word. Use the indirect form, as on the other slides: «...صاح الناس: لقد أدركونا! لكن موسى طمأنهم بهدوء وثقة، وأخبرهم أن الله معه وسيهديه إلى طريق النجاة.» The EN translation at `:364` stays as it is. |
| Adam AR slide 3 (7:12, 38:76), `:140` | «قال إنه خير من آدم، لأن الله خلقه من نار وخلق آدم من طين!» | APPROVED as written. |

Re-take the AR `slide-9` (Ibrahim), `slide-13` and `slide-10` (Musa), `slide-9` (Nuh) and `slide-3` (Adam).

#### C. EN narration speaks Quranic duas in transliteration. CHANGE (MUST)

A transliterated ayah spoken by a clone is still the Quranic wording produced by a machine. The only difference is that it comes out with English phonology: «zalamna» for ظلمنا, «samee ul aleem». Fiqh does distinguish saying a Quranic dua *as a dua* from tilawa, but that distinction rests on the speaker's intention. A machine has none. The real harm here is concrete: children learn duas by imitating what they hear, and a clone that mispronounces them is the worst teacher of the words.

- **Rule.** The EN voice gives the meaning and points to the words on the page. No transliteration of an ayah is spoken.
- The transliteration stays **on screen**, so the child can still learn the dua as a dua, with a parent, a teacher, or a human recording (rule 4).
- **Applies to:** Adam EN 11 (`UI/voice-scripts.js:78`), Ibrahim EN 9 (`:241`), Nuh EN 9 (`:281`), Musa EN 13 (`:367`).
- **Pattern:** "Here is Adam's beautiful dua for forgiveness. Its words are written for you on the screen. It means: Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers. Learn the words with someone you love, and say this dua whenever you make a mistake!"
- Re-take those four EN mp3s.
- The isti'adha transliteration in Adam EN 7 (`:54`) is a dhikr formula and may stay (D).

#### D. Short phrases

| Phrase | Evidence | Ruling |
|---|---|---|
| «أحد عشر كوكباً والشمس والقمر» | Yusuf AR slide 0, `UI/voice-scripts.js:331` | APPROVED. These are ordinary narrative nouns inside the narrator's own sentence, with no Quranic framing, and there is no natural way to say them differently. Optionally use «أحد عشر نجماً» to match the quiz wording («نجوم وشمس وقمر»). |
| «فأزلّهما الشيطان» (2:36) | Adam AR slide 7, `:164` | APPROVED, as a two-word collocation in prose. It is also redundant after «وسوس الشيطان لآدم وحواء وخدعهما». When the slide is next re-taken, prefer «...وخدعهما حتى أوقعهما في الخطأ، فأكَلا من الشجرة المحرمة». NOTE only. |
| The isti'adha «أعوذ بالله من الشيطان الرجيم» | Adam AR 7 `:164`, EN 7 `:54`, An-Nas 5 explanation | APPROVED. This is the Sunnah formula of seeking refuge, not an ayah. 16:98 commands it with different wording (فاستعذ). It is dhikr and may be voiced in both languages. |
| Ibrahim 6:76-78 fragments «هل هذا ربي؟»، «هذا ربي!»، «لا أحبّ ما يغيب» | Ibrahim AR 1-3, `:251-253` | APPROVED. They are 2-3 word dialogue in the narrator's sentence. «ما يغيب» replaces «الآفلين», and the question form was already approved under R1-1. |

### Round 3 summary

| Item | Ruling |
|---|---|
| Adam AR 7, 8, 11 | APPROVED |
| Ibrahim lesson "Think, and follow the truth" (page, narration, game 06) | APPROVED; closes the R1-1 NOTE |
| Stones / «الحجارة:» / «ضع حجراً» | APPROVED |
| C1 (5 AR scripts) and C2 (Musa 1, page and voice) | APPROVED; applied word for word |
| Musa 8 page with 20:44 | APPROVED; it is a cited, vowelled ayah block, and no voice reads it |
| A. 148 AR verse "meaning" lines are the ayah | CHANGE (MUST): a Muyassar-based child tafsir line per ayah, on screen and in the voice. Interim: AR verse audio from the explanation only, and `textFor()` skips `.translation` in AR |
| B. Ibrahim 9, Musa 13, Nuh 9, Adam 3 | APPROVED (with the full lines above) |
| B. Musa 10 | CHANGE: indirect speech, line above |
| C. EN transliterated Quranic duas (4 slides) | CHANGE (MUST): meaning only in the voice; transliteration stays on screen |
| D. Yusuf 0, Adam 7, isti'adha, Ibrahim fragments | APPROVED (optional polish noted) |
| Site-wide rule | Rules 1-5 above; make the scan a build check with a reviewed whitelist |

---

## Round 4 (2026-11-05)

Read-only review at commit `c50a016` (branch `ui-games-books-scholar-fixes`, working tree at `8131ad7`, clean).
- **Files read:** `UI/voice-scripts.js`, `UI/scripts/recitation-whitelist.json`, `UI/scripts/verify-no-recitation.py`, `UI/mockups/games/04`, `08`, `10`, and the five `UI/story-prophet-*.html` pages with `UI/translations.js`.
- **Checks run:** `verify-no-recitation.py` (PASS: 321 units, 13 speech files, 2317 literals; 148 AR verse units suppressed with 0 mp3s; 1 slide held), `--self-test` (PASSED), and `--text` probes.
- **Other evidence:** a scan of every on-screen `data-ar` and `translations.js` Arabic string with the same matcher, a word diff of the five story dua blocks against `api.alquran.cloud/v1/ayah/{ref}/quran-simple`, and YouTube oEmbed for all 27 embeds.

### 1. EN dua narration, meaning only: APPROVED

| Unit | Evidence | Ruling |
|---|---|---|
| Adam EN 11 | `UI/voice-scripts.js:78` | APPROVED. Matches the round-3 C pattern word for word. A faithful rendering of 7:23. |
| Ibrahim EN 9 | `:241` "It means: Our Lord, accept this from us. Indeed You are the All-Hearing, the All-Knowing." | APPROVED. A faithful rendering of 2:127 (the dua part). |
| Nuh EN 9 | `:281` "It means: My Lord, forgive me and my parents." | APPROVED. This is the opening of 71:28, the same part the page shows. |
| Musa EN 13 | `:367` "It means: My Lord, open my chest for me, and make my task easy for me. He made this dua before facing Pharaoh." | APPROVED. It is 20:25-26, and the context is right (20:24-26). |

None of the four contains any transliteration, and the checker passes them. Their mp3s were re-taken in `c50a016`.

### 2. Musa AR slide 9 draft: APPROVED

«…فسجدوا لله، وأعلنوا أنهم آمنوا بالله الذي أرسل موسى وهارون!»
- It is indirect speech in the narrator's own words.
- It is faithful to 7:120-122, 20:70 and 26:46-48: they fell in prostration to Allah and declared belief in the Lord of Musa and Harun.
- The checker passes it clean. «موسى وهارون» are names, and no 2-3 word whole ayah remains.

You may release the hold, render the slide and install it, then run `verify-no-recitation.py` and the Whisper sweep. **Also** the page prose has the same quote. `UI/story-prophet-musa.html:192` `data-ar` still ends «فسجدوا وقالوا: "آمنا برب موسى وهارون!"». Give the page the same sentence so that screen and voice agree (SHOULD, see 5b).

### 3. Whitelist and checker

| Entry | Ruling |
|---|---|
| `"Wa alaykum as-salam"` (EN, game 04 `optSalam`, `UI/mockups/games/04-*.html:449`) | APPROVED. It is the Sunnah reply to the salam, a greeting and not an ayah. 4:86 commands returning a greeting but does not give this wording. Change its `ruling` to "Round 4, 3". |
| `«أعود بالله من الشيطان الرجيم»` (Whisper spelling) | APPROVED, for transcripts only. It is needed because «بالله من الشيطان الرجيم» is a 4-word run of 16:98. SHOULD: scope it in code (for example `"transcripts_only": true`, honoured only under `--transcripts`). The `about` text says "no script uses this spelling", but nothing enforces that, and a misspelt isti'adha in a script should be caught as a quality error. |
| `onscreen_only` «التين والزيتون» (game 10, `UI/mockups/games/10-ask-and-find-coop.html:173`) | APPROVED. These are ordinary fruit nouns used as an item name. I confirmed that speech reads only `clue`/`hint` (`:338-339`). `notThat` with `it.name` goes to `textContent` only (`:321`). The clue «تبدأ سورة بالقسم بهاتين الثمرتين» is meaning, not wording. |
| The other `phrases` entries (0-21) | APPROVED. Each one is a Name of Allah, a dhikr formula, the isti'adha, or approved narrative nouns, as Round 3 Part 2 rule 2 and D allow. Ten entries are unused at present. Keep them. |
| The other `onscreen_only` entries (games 02, 06, 07, 08, 09) | APPROVED on the mechanism each one states, backed by the `speak(...)` argument rule and the "entry matched nothing" failure. |

**The rule implementation.**
- **APPROVED: a one-word ayah is flagged only when it is the whole line** (`verify-no-recitation.py:242-246`). This is rule 1(b) together with rule 2 (a single key word being explained).
- **APPROVED: a whole ayah of 2-3 words is flagged anywhere in a line** (`:228-241`). This is correct. Rule 1(b) takes precedence over the 2-3 word dialogue allowance, and it is exactly what caught «رب موسى وهارون».
- **APPROVED: the runs-of-4 logic.**
- **SHOULD (gap): adjacent whitelist entries.** "Excused only if every word is whitelisted" (`:216`) also excuses a run made of **two adjacent entries**. Neither combination was ever reviewed as a whole. Probes:
  - «لا إله إلا هو الرحمن الرحيم» passes, but it is the end of 2:163.
  - «حسبي الله لا إله إلا هو» passes, but it is 9:129, part of the ayah.

  The second is also a known morning dhikr, but that is a coincidence. Excuse a run only when a **single** whitelist occurrence covers it, and otherwise flag it for review. No current unit triggers this.
- **SHOULD before `AR_VERSE_AUDIO` is turned on:** entries 0 «بسم الله الرحمن الرحيم» and 13 «الرحمن الرحيم» are each a whole ayah of Al-Fatiha (1:1, 1:3). Add an exclusion (`except_units`: `surah-fatiha/ar/verse-1`, `verse-3`) so that a Fatiha meaning line that is still the ayah cannot pass through the whitelist.
- **NOTE (known limit):** rule 1(a), a quotation frame of any length, cannot be fully machine-checked. «يقول الله تعالى: القارعة» passes. A cheap heuristic is to flag a one-word ayah that directly follows «قال الله / يقول الله / في القرآن» and a colon. Otherwise this stays a review item.

### 4. Game 08 in AR reads exAr only: CONFIRMED

- In `UI/mockups/games/08-al-fil-seek.html:422-423`, `playVerse` falls back to `speak(lang === 'ar' ? AYAT[i].exAr : AYAT[i].exEn)`. While `arSoon()` is true, no verse file is requested. `AYAT[].ar` goes only to `textContent`.
- The `exAr` strings (`:289-301`) contain only explained key words (`«ألم تر؟»`, `«أصحاب الفيل»`, `«أبابيل»`) and meaning. This is allowed under rule 2.
- `got` and `find` lines are narrator prose.

### 5. Story pages: AR "translation" line repeats the ayah. CHANGE (MUST), as ruling A

The screen also shows ayat that the verifier does not see. **5a, MUST: the AR "meaning" line is the ayah again.** Replace each `data-ar` (for Adam, the `duaTranslation` value in `translations.js`) with the meaning line below. They are Muyassar-based, first-person "meaning of the dua", with no quote marks, and the citation added. Each one passes `verify-no-recitation.py --text` clean.

| Page:line | Current `data-ar` | Replacement |
|---|---|---|
| `UI/story-prophet-adam.html:373` (via `UI/translations.js:302` `duaTranslation`) | «"ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين."» | «معناه: يا ربّنا، أخطأنا في حقّ أنفسنا، فإن لم تسامحنا وترحمنا كنّا من الخاسرين. (سورة الأعراف، الآية ٢٣)» |
| `UI/story-prophet-nuh.html:178` | «"ربّ اغفر لي ولوالديّ"» | «معناه: يا ربّ، اغفر ذنوبي وذنوب أمّي وأبي. (سورة نوح، الآية ٢٨)» |
| `UI/story-prophet-ibrahim.html:308` | «"ربّنا تقبّل منا إنك أنت السميع العليم"» | «معناه: يا ربّنا، اقبل منّا هذا العمل، فأنت تسمع كل دعاء وتعلم كل شيء. (سورة البقرة، الآية ١٢٧)» |
| `UI/story-prophet-musa.html:234` | «"ربّ اشرح لي صدري ويسّر لي أمري"» | «معناه: يا ربّ، املأ قلبي طمأنينة وشجاعة، وسهّل عليّ مهمّتي. (سورة طه، الآيتان ٢٥ و٢٦)» |
| `UI/story-prophet-yusuf.html:193` | «"أنت وليّي في الدنيا والآخرة، توفّني مسلماً وألحقني بالصالحين." (سورة يوسف، الآية ١٠١)» | «معناه: يا الله، أنت الذي تتولّى أموري في الدنيا والآخرة، فاجعلني أموت مسلماً، واجعلني مع الصالحين. (سورة يوسف، الآية ١٠١)» |

**Already correct:** `story-prophet-ibrahim.html:243` (21:69), `story-prophet-musa.html:180` (20:44) and `story-prophet-yusuf.html:172` (12:92). `story-prophet-musa.html:139` (20:12) shows the citation only. That is acceptable. Optionally use «أي: أخبر الله موسى أنه هو ربّه الذي يكلّمه. (سورة طه، الآية ١٢)».

**5b, SHOULD: story prose quotes ayat unvowelled and uncited, as dialogue.**
- These lines are on screen only; no voice reads them. But the child cannot tell they are Quran, and `verify-scripture.py` does not check them.
- For each one, either use the indirect wording already approved for the voice, or make it a vowelled, cited `quran-text story-ayah` block with `data-ayah`.

| Location | Text |
|---|---|
| `UI/story-prophet-musa.html:192` | «"آمنا برب موسى وهارون!"» (use the draft in 2) |
| `UI/story-prophet-musa.html:203` | «"كلا! إن معي ربي سيهدين."» (26:62; use the round-3 B line: «...وأخبرهم أن الله معه وسيهديه إلى طريق النجاة») |
| `UI/story-prophet-ibrahim.html:164` | «"إني وجهت وجهي للذي فطر السماوات والأرض"» (6:79) |
| `UI/story-prophet-ibrahim.html:188` | «...ما لا يسمع ولا يبصر ولا...» (19:42) |
| `UI/story-prophet-yusuf.html:88` | «لا تقصص رؤياك على إخوتك» (12:5) |
| `UI/translations.js:237` (Adam `scene4Text`) | «"أنا خير منه! خلقتني من نار وخلقته من طين!"» (7:12) |
| `UI/translations.js:281` (Adam `scene9Quran`, shown in a `quran-text` block at `story-prophet-adam.html:308`) | 7:23 unvowelled, in quotes, uncited. Make it the vowelled ayah with `data-ayah="7:23"` and the citation. |

`UI/quran.html:312` (94:5) and `:329` (95:1, 95:4) are short teaser quotes on the hub. That is acceptable as a NOTE: vowel and cite them when convenient.

**5c, NOTE: the four story dua blocks have no `data-ayah`, so the verifier does not check them.** The blocks are `story-prophet-adam.html:372`, `nuh.html:177`, `ibrahim.html:307` and `musa.html:233`. I diffed them word by word against quran-simple, and the wording is correct in all four. The only differences are display conventions:
- Shadda and haraka are stored in a different order.
- Adam has no sukun on «أنفسنا» or «وإن», and «لَّمْ» carries an idgham shadda.
- Ibrahim has no sukun on «أنتَ».

These are Uthmani-print tajweed marks, and they do not change the reading. Add `data-ayah` (7:23, 71:28, 2:127, 20:25-26) so that the verifier holds them.

### 6. Musa AR 13, what Whisper heard: a quality issue, not doctrinal

- «أن يملأ» for «أي يملأ» turns the gloss into a second request ("and that He fill his heart with tranquillity"). That is still true to the meaning of 20:25.
- «يسّر» for «ييسّر» makes the clause read "that He eased", which is grammatically off but carries no doctrinal error.
- «يسهّل» is the gloss word itself.

None of these is Quranic wording, so none affects recitation. The Whisper text also passes the checker clean, so no mishearing brings it closer to 20:26. Whisper often confuses أي and أن, and dropped geminate يي. Have an Arabic speaker listen once. Re-take only if «ييسّر» is audibly «يسّر».

### 7. Owner view: YouTube embeds (27)

Inventory, from oEmbed today:
- 21 surah pages plus `ayat-al-kursi.html:271` = 22 recitation-learning videos:
  - "Learn with Zakaria": 10 (Duha, Adiyat, Bayyinah, Humazah, Kafirun, Qariah, Takathur, Sharh, Zalzalah, Tin)
  - "Osratouna tv": 9 (Falaq, Ikhlas, Fil, Masad, Ma'un, Kawthar, Nasr, Nas, Quraysh)
  - "Bismillah Beginnings": 1 (Asr)
  - "One4kids / Zaky": 1 (Kursi)
  - **IQRA Cartoon** for Fatiha (`surah-fatiha.html:260`). This is a *tafsir cartoon*, not a listen-and-repeat recitation, so the page's "learn to recite" framing does not fit it.
- 5 story pages (`story-prophet-adam.html:454`, `ibrahim.html:389`, `nuh.html:254`, `musa.html:308` (Part 1 only), `yusuf.html:267`): all IQRA Cartoon prophet-story episodes.

**Recommendation.**
1. **Gate, don't trust.** Before release, the owner (or an Arabic-reading adult) watches each video end to end once against a short checklist:
   - human recitation by a named qari, Hafs, correct, with no synthetic or AI voice;
   - no music under the recitation;
   - **no depiction of any prophet, angel or of Allah.** This matters most for the five IQRA story cartoons;
   - no isra'iliyyat or content that contradicts the page;
   - no ads or end-screens that lead off-site.

   Record the qari, the channel, the date checked and the verdict per video ID in a small manifest beside the pages. A video that fails is removed, not argued over.
2. **Reduce exposure:**
   - Embed from `youtube-nocookie.com` with `rel=0` (end-screen suggestions then stay on the same channel).
   - Lazy-load each video behind a parent-facing "play" tap, not autoplay.
   - Keep the site's own text as the primary teaching.
3. **Re-check periodically** (manually, for example each release). A third-party video can be deleted, replaced, or have its suggestions change, and the site cannot see that.
4. **Longer term, preferred for the 22 recitation slots:**
   - Replace the videos with licensed audio by a known qari per ayah (rule 4: human recitation is the only acceptable voice), for example from the Quran.com / EveryAyah sources, with licence terms confirmed. This gives the site control of the exact text and reciter, and it lines up with the vowelled ayah on the card.
   - Keep video only where it adds something audio cannot.
   - For the story cartoons, if the owner cannot vouch for every frame of a 10-20 minute cartoon, remove the embed. The story pages are complete without it.
5. Fatiha: if the IQRA tafsir cartoon is kept, relabel its section as "watch the story" instead of "learn to recite", or replace it with a recitation video like the other 21.

### Round 4 summary

| Item | Ruling |
|---|---|
| 1. EN dua narration, meaning only (Adam 11, Ibrahim 9, Nuh 9, Musa 13) | APPROVED |
| 2. Musa AR 9 draft | APPROVED; release the hold and render. Page `:192` should match (SHOULD) |
| 3. Whitelist: Wa alaykum as-salam, أعود (transcripts), التين والزيتون (on screen) | APPROVED. SHOULD: scope أعود to transcripts |
| 3. Checker rules | APPROVED. SHOULD: excuse only single-entry coverage; exclude Fatiha verse-1 and verse-3 from entries 0 and 13 before AR verse audio. NOTE: quotation frames stay a review item |
| 4. Game 08 AR speaks exAr only | CONFIRMED |
| 5a. Story AR dua "translation" lines (5 pages) | CHANGE (MUST): the replacement lines above |
| 5b. Unvowelled ayah quotes in story prose (7 places) | SHOULD: indirect speech or a cited `data-ayah` block |
| 5c. Four dua blocks without `data-ayah` | NOTE: wording correct; add `data-ayah` |
| 6. Musa AR 13 Whisper differences | Quality only; not doctrinal |
| 7. YouTube embeds | Owner vets all 27 against a checklist with a manifest; nocookie, rel=0, tap to play; long term, licensed qari audio; drop any story cartoon that cannot be vouched for |

## Round 5 (2026-11-05): Round 4 fixes applied (lead's report, for the scholar to confirm)

The owner approved "fix all". The scholar's wording is used exactly. EN changes alongside AR.

| Item | Where | Change |
|---|---|---|
| 5a (MUST) | `story-prophet-adam.html:374` via `translations.js:302`, `nuh.html:178`, `ibrahim.html:308`, `musa.html:234`, `yusuf.html:193` | AR meaning lines replaced with the Round 4, 5a lines word for word. EN lines get the matching citation: (Surah Al-A'raf 7:23), (Surah Nuh 71:28), (Surah Al-Baqarah 2:127), (Surah Ta-Ha 20:25-26). Yusuf EN already had its citation. |
| 2 | `voice-scripts.js:385`, `scripts/voice-scripts-data.json`, `musa.html:192` | AR slide 9 uses the approved sentence «…فسجدوا لله، وأعلنوا أنهم آمنوا بالله الذي أرسل موسى وهارون!». The hold is released, and the page `data-ar` uses the same sentence. The slide was re-recorded (S2-Pro, `ram-gate run --heavy`) and installed. Whisper heard the final sentence exactly; whole-unit WER 0.128 and CER 0.039 (dialect mishearings: «ألك» for «ألقى», «السحر» for «السحرة», «عساه» for «عصاه»). The heard text passes `--text` clean, and the full sweep gives 322 transcripts, 0 flagged. |
| 5b | `musa.html:203` | «لكن موسى طمأنهم بهدوء وثقة، وأخبرهم أن الله معه وسيهديه إلى طريق النجاة.» (the round-3 B voice line) |
| 5b | `ibrahim.html:164` | NEW, to confirm: «وأعلن إبراهيم لقومه أنه يتوجّه بعبادته إلى الله وحده، خالقِ السماوات والأرض!» / EN "Ibrahim declared to his people that he turned in worship to Allah alone, the Creator of the heavens and the earth!" («الذي خلق السماوات والأرض» was avoided: it is a 4-word run of 6:1, 6:73, 7:54 and 10:3.) |
| 5b | `ibrahim.html:188` | NEW, to confirm (follows the approved AR voice slide 4): «فسألهم كيف يعبدون أشياء لا تسمع ولا ترى ولا تنفعهم بشيء.» |
| 5b | `yusuf.html:88` | NEW, to confirm: «وبابتسامة حانية، أخبر النبي يعقوب ابنه أن الله أعطاه هبة خاصة، ونصحه ألّا يحكي رؤياه لإخوته، فقد يحسدونه. فأصغى يوسف جيداً لأبيه الحكيم.» |
| 5b | `translations.js:237` (Adam `scene4Text`) | «…قال إنه خير من آدم، لأن الله خلقه من نار وخلق آدم من طين!» (the approved AR voice slide 3 wording) |
| 5b | `story-prophet-adam.html:308` (`scene9Quran`) | This is now a vowelled `arabic-text quran-text story-ayah` block with `data-ayah="7:23"` (the text of the site's dua box). Below it is a meaning line: AR is the 5a line for 7:23; EN is the translation plus "(Surah Al-A'raf 7:23)". |
| 5c | `adam.html:373`, `nuh.html:177`, `ibrahim.html:307`, `musa.html:233` | Added `data-ayah` (7:23, 71:28, 2:127, 20:25-26). `verify-scripture.py` now accepts a range, `S:A-B`, and checks it against those ayat joined in order. All four pass at the letters tier, so no verifier change was needed for the tajweed marks: Adam and Ibrahim show "[marks differ]", which is information only. |
| 3 (checker) | `scripts/verify-no-recitation.py`, `scripts/recitation-whitelist.json` | (a) A run is excused only when ONE whitelist occurrence covers it. (b) «أعود…» is `transcripts_only` and is honoured only under `--transcripts`. (c) Entries 0 and 13 carry `except_units: surah-fatiha/ar/verse-1, verse-3`. The ruling for "Wa alaykum as-salam" is set to "Round 4, 3". Self-tests were added for all three, and the approved site lines still pass. |

**EN in 5b.** The EN page lines for Musa :192 and :203, Ibrahim :188, Yusuf :88 and Adam scene 4 are left as English meaning in direct speech. Each is word for word the EN narration of that slide, which was approved in Round 3 (EN meaning may be voiced). Changing them would split screen from voice. Ibrahim :164 has no narration, so its EN now follows the new AR. **Scholar: confirm or rule otherwise.**

**On-screen scan** (every `data-ar` on the five story pages and every Arabic string in `translations.js`, with the checker's matcher): 14 findings before, 1 after. The one left is `yusuf.html:77`, «أحد عشر كوكباً والشمس والقمر», the narrative nouns approved in Round 3 Part 2, D.
