# Islamic-appropriateness review of the games (islamic-content-scholar, 2026-11-03/04)

Owner rule: "make sure all games are Islamic appropriate." This file is the scholar's ruling on
the game designer's brief, the ten mockups in `UI/mockups/games/`, and the specs in
`claudeteam/reviews/game-*.md`. It is also the **art checklist** that the brief's three-stage gate
points at (section 3).

Scope note: mockups 01-05 were edited at 23:47-23:49 while this review was in progress. Line numbers
below were re-read from those later versions. Specs exist only for 06-10. The 04 header points to
`game-ibrahim-stars.md`, and the brief points to `game-mockups-visual-critique-2026-11-03.md`;
neither file exists yet.

## Summary

| # | Game | Verdict |
|---|------|---------|
| 01 | Nuh and the Ark | APPROVED WITH FIXES |
| 02 | Yusuf's Journey | APPROVED WITH FIXES |
| 03 | The Path Through the Sea (Musa) | APPROVED WITH FIXES |
| 04 | Ibrahim: Stars and Guests | APPROVED WITH FIXES (the guests round needs rework) |
| 05 | The Garden of Choices (Adam) | APPROVED WITH FIXES |
| 06 | The Deeds Garden | APPROVED WITH FIXES (rename) |
| 07 | Ayah Lanterns | APPROVED WITH FIXES |
| 08 | Al-Fil: find it in the picture | APPROVED WITH FIXES |
| 09 | Honest Choices | APPROVED WITH FIXES |
| 10 | Ask and Find, together | APPROVED WITH FIXES |

No game needs a redesign. "Approved" here passes **gate 1 (spec) only, once the fixes are made**.
Gate 2 (art) and gate 3 (build) are still open for every game.

**Scripture verification (done by script, not by eye).** I extracted all 49 diacritised Arabic runs
from the ten mockups and checked each one as an exact substring of the site pages (`UI/*.html`).
All 46 scripture/dua strings match. The 3 strings that don't match are game prose, not scripture
(01:529, 02:457, 06:415). As a second check, I compared every ayah against
`api.alquran.cloud/.../quran-simple` after normalising both. Every one matches, with three known
quirks of the API that are not errors in the games:
- The API prepends the Bismillah to verse 1 of 105 and 112.
- The API puts a BOM before 1:1.
- 20:25 opens with قَالَ ("he said"). The dua correctly starts after it.

**Al-Fatiha numbering is still Hafs:** the Bismillah is ayah 1 and the final ayah is whole
(07:239-245, and 06:144). The 2026-09-02 fix has held.

---

## 1. Corrections to `.claude/agents/kids-game-designer.md`

The brief is mostly sound. The three-stage gate (lines 109-117) is right; keep it. The
"Religious and cultural guardrails" section (lines 119-130) is too thin for what the games now do.
**Replace lines 119-130 in full** with the text below.

```markdown
## Religious and cultural guardrails (ruled by `islamic-content-scholar`, 2026-11-03)
Full ruling and the art checklist: `claudeteam/reviews/game-islamic-review-2026-11-03.md`.

**Depiction**
- **No human figures at all**, which is the site's existing position (`UI/scripts/specs/illustrations.py`
  lines 1-9: "no plate here contains a person"). Ordinary people (Mama, Baba, an army, a crowd,
  travellers) appear only as voices, objects, footprints, tents, lantern-lights or abstract dots.
  Never as faces, bodies, silhouettes, hands or shadows.
- **Prophets, the Prophet's family and Companions, angels, Iblis/Shaytan and jinn are never shown**
  in any form: no figure, silhouette, glowing outline, shadow, hand, avatar, mascot or "playable
  character". Show them through setting, objects and consequences (the ark, the well, the staff,
  the parted water).
- **Allah is never depicted, and nothing may stand in for Him**: no eye in the sky, no hand from a
  cloud, no face in the sun or moon, no beam or light labelled as Allah, and no throne, chair or
  seat for the Kursi or the 'Arsh. Light may show mercy or guidance, but the narration says
  "Allah did ...". It never says "the light is Allah".
- **Animals and nature may be painted** (the site plates already do this). An animal never speaks
  scripture, never narrates a prophet's words, and never stands in for a prophet.
- **Shaytan** is never a character, creature, serpent, horned devil or "enemy" to fight. In Adam's
  story he is only narrated ("Shaytan whispered"). If a visual is needed at all, use the site's
  existing abstract cold ember (Adam plate 4). The forbidden tree is not an apple tree; the Quran
  does not name it.

**Scripture and sacred things**
- Scripture in a game is copied from a site page that has passed `verify-scripture.py`, and is
  never retyped. A hadith appears in a game only after it is on a site page with its source.
- **Ayat are never cut into words or letters** for scramble, spelling, word-search or fill-in
  puzzles. Whole-ayah ordering is the only approved sequencing form.
- **Quran text, the mushaf, the names of Allah and the Ka'bah are never**: on the ground or under
  feet; in a bin, trash, "wrong" pile or discard area; the losing side of a sort; hit, broken,
  thrown, stepped on or knocked over; or given a "wrong" sound or wobble when tapped. A Quran card
  that is not placed yet floats back to its tray, never to the floor.
- **No synthesised voice may read Quranic Arabic.** The meaning may be narrated. A recitation, if
  the owner wants one, must be a human qari's recording used with permission, and never a voice
  clone. No chime, effect or other sound may overlap any Quran audio.
- The Ka'bah may appear only as a simple, hand-drawn, respectful shape with no writing on its
  band. It is never generated by an image model, and never used as a distractor or obstacle.

**Miracles, punishment and other people**
- **A miracle is Allah's act, never the child's power.** The child never "causes" a miracle (parting
  the sea, cooling the fire, sending the birds). The child may watch, find, or follow, and the
  narration names Allah as the one who did it ("By Allah's command, the sea split"). Never use
  "magic", "spell", "power-up" or similar words for a miracle.
- **No mechanic makes a prophet fail, lose, sin or look foolish**, and no "wrong answer" option
  attributes wrongdoing to a prophet ("Yusuf shouted at them"). The child never "does better than"
  a prophet. Wrong options are about what *we* might do, not about what a prophet did.
- **No option asks the child to affirm shirk**, even as the wrong answer (for example "Yes, the
  star is our Lord"). Ask factual questions instead ("Does it stay all the time?").
- **Disbelievers and mockers:** their mocking may be narrated, faithful to the Quran, but the child
  never voices, types or "plays" a taunt. They are never named as enemies to beat, and their
  punishment is never a reward or celebrated (no chime of triumph on it).
- **Punishment narratives** (the flood, Pharaoh, Abraha's army): no bodies, no drowning shown, no
  impact effects or sounds. Narrate briefly and calmly; the emphasis is that Allah saved the
  believers and protected His House.

**Sources**
- Morals come from the Quran and authentic hadith, never from invented "Islamic" sayings.
  Biblical or Israiliyyat details are not taught as fact: the dove and olive leaf, the rainbow,
  the apple, the serpent, "the fire became like a garden". Keep to what the Quran says.

**Mechanics and reward**
- **No gambling-like mechanics**: no loot boxes, mystery rewards, random prizes, spins, wagers,
  betting, or dice that decide a reward. Shuffling the order of cards or rounds is fine; chance
  must never decide a reward.
- **Good deeds are not a score.** Do not count or display deeds, patience, trust or iman as
  numbers, stars or meters ("Trust lights: 3", "kept going x 3"). Light and warmth in the scene
  are enough. Do not call progress "deeds" (the record of deeds belongs to Allah). Praise the
  intention: "Allah sees it", not "+1".
- **Music:** whether instruments are acceptable is the owner's call. Until the owner decides: no
  music and no melodic sequences. Use voice, natural sounds, and single soft tones or two-note
  chimes. A multi-note rising arpeggio is a melody; avoid it.

**Adab**
- Say "Prophet Nuh" (النبي نوح) at a prophet's first mention in each game, and use عليه السلام in
  Arabic narration where it reads naturally. The Prophet Muhammad is always followed by ﷺ (written)
  and "peace be upon him" (spoken). Avoid exclamations that invoke Allah casually (يا إلهي for
  "oh no!").
```

Two smaller edits elsewhere in the brief:
- **Line 97-98:** replace "a contact sheet per game checked for any figure or face before use" with
  "a contact sheet per game checked against the pre- and post-generation checklist in
  `claudeteam/reviews/game-islamic-review-2026-11-03.md` section 3, and signed off by
  `islamic-content-scholar` before any sprite is used".
- **Line 55-56 (ambition list):** change "guide Musa's people along the dry path as the sea
  parts" to "walk with the believers along the dry path that Allah opened", so the child is not
  the one leading or parting.

---

## 2. Per-game findings

Severity: **MUST** = blocks gate 1. **SHOULD** = fix before build. **NOTE** = advisory.

### 01 Nuh and the Ark: APPROVED WITH FIXES
The mechanic fits the lesson (patience as press-and-hold, keep building while mocked). The dua
matches the site, and is the opening of 71:28. Judi is Quranic (11:44), and "a pair of every kind"
is 11:40.
1. **MUST: the dove and olive leaf are Biblical (Genesis 8:8-11), not Quranic or from authentic
   hadith.**
   - Evidence: `01-nuh-ark.html:231` (`<button id="dove" ...>🕊️`), `:633` "Tap the dove to send it
     out to look for land", `:646` "It came back with an olive leaf!", and `:652` `art: '🚢🌿🕊️'`.
   - Fix: delete the dove beat. Replace it with 11:44 as narrated on the site: "Then Allah
     commanded: the water went down, and the ark came to rest on the mountain called Judi." The
     child can tap the ark to watch it settle; that is not a miracle the child causes. Ending art:
     the ark on Judi.
   - (Site-level, outside the games: the same detail is on `UI/story-prophet-nuh.html:159` and in
     the plate prompt `UI/scripts/specs/illustrations.py:130`. Raise it with the owner.)
2. **SHOULD: the mockers are drawn as human figures** (heads and bodies), at `:208-212`
   `<g id="mockers">`. Final art must show them only through the taunt words, or as faint tents
   and campfires on the hill. No figures.
3. **SHOULD: patience is turned into a score.** `:514` `'⭐'.repeat(S.kept) + ' You kept going ' +
   times(S.kept)` and `:654` "kept going ${times(S.kept)}". Remove the count. Let the ark glow
   instead, and change the ending to "You kept building when people laughed."
4. **NOTE:** the ending's "You built the ark ... just like Nuh" (`:654`) is close to putting the
   child in Nuh's place. Prefer "You helped build the ark, plank by plank. Prophet Nuh was
   patient and trusted Allah." Use "Prophet Nuh" at first mention (`:509` currently "Allah told
   Nuh").
5. **NOTE:** the taunts (`:482-486`) are faithful in spirit to 11:38. The child only taps them
   away and never voices them. Approved.
6. **NOTE:** the `done` chime is a four-note rising arpeggio (`:341` `[523, 659, 784, 1047]`). This
   is a melody; see the owner decision on sound.

### 02 Yusuf's Journey: APPROVED WITH FIXES
1. **MUST: wrong options attribute misconduct to a prophet.**
   - Evidence: `02-yusuf-journey.html:444` "What do you think Yusuf did?", with options `:446`
     "He shouted at them" and "He sent them away hungry". `:449` then calls these "a fair guess".
   - Fix: do not offer a quiz on what a prophet did. Narrate it ("Yusuf was kind, gave them food,
     and later forgave them"), then ask the child: "If someone had hurt you, what would you feel
     like doing? What did Yusuf choose?" The phase-3 "Your turn" choice (`:454-457`) already does
     this correctly for the child's own behaviour; that is the right place for wrong options.
2. **NOTE (accuracy, from the site page):** the game, like `story-prophet-yusuf.html:170`, puts the
   forgiveness at the brothers' first visit. In the Quran he first fed them (12:58-62), and forgave
   them when he revealed himself, saying "No blame upon you today" (12:92). Acceptable
   simplification for 5-year-olds. For the 8-11 tier, prefer "He gave them food, and later, when
   they knew who he was, he forgave them."
3. **NOTE:** the placeholder 🏛️ for Egypt (`:411`). Final art must not show pharaonic temples with
   idols or statues; use the granary, the Nile and palms.

### 03 The Path Through the Sea (Musa): APPROVED WITH FIXES
The quotations match `story-prophet-musa.html:197,208`, and the dua (20:25-26) matches.
"Before facing Pharaoh" is correct (20:24-26).
1. **MUST: name Allah as the one who parted the sea, and do not let the child's press be the
   trigger.**
   - Evidence: `:425` "Then Allah told Musa what to do. Press the button and watch.", button `:180`
     "Watch what happens", and `:426` "The sea split into two mighty walls ..." (no agent named).
   - Fix: the narration plays on its own: "Musa obeyed Allah and struck the sea with his staff, and
     by Allah's command the sea split into two mighty walls." After that, a "Walk on" button
     appears.
2. **SHOULD: the child "leads the people", displacing Musa** (`:426` "Carry the lantern ... to
   lead the people across"). Change this to "Carry a lantern and walk with the believers, following
   the path Allah opened."
3. **SHOULD: trust is turned into a score**: `:430` `meter: 'Trust lights: '` and `:522`
   `'🏮'.repeat(S.lights)`. Remove the meter. The lantern can glow brighter without a number.
4. **SHOULD: misquote.** `:424` "Yes! That is what Musa said" follows the option "Allah is with
   us, He will guide us", but Musa said "My Lord is with me; He will guide me" (26:62). Fix it to
   "Yes! Musa said: 'My Lord is with me, He will guide me.'"
5. **NOTE:** the quote panels `:175-177` are the site's paraphrases in quotation marks.
   "لقد أدركونا" paraphrases 26:61 «إِنَّا لَمُدْرَكُونَ». Acceptable, because it is not styled as
   Quran (not cobalt/scripture). Keep it that way, or switch to the exact ayah text with its
   reference.
6. **NOTE:** Pharaoh's drowning is not shown (`:429` "the walls of water came back down"). This is
   correct for the age band.

### 04 Ibrahim: Stars and Guests: APPROVED WITH FIXES
1. **MUST: the child is offered an option that affirms shirk.** `:438` `optYes: 'Yes, it is so
   bright'`, in answer to "Can something that disappears be our Lord?" (`:437`). The child taps
   "yes, it is our Lord". Replace the question with a factual one: "Did it stay with us all
   night/all day?", with the options "No, it went away" and "Yes, it stayed". Keep the reasoning
   step ("so it cannot be our Lord") as narration.
2. **MUST: the guests were angels** (51:24-28; 11:69-70). The game must not present an invented
   hospitality ritual as what happened, and must not imply that they ate.
   - Evidence: `:450` "Press and hold each cup to fill it with water", and `:461` "A warm welcome:
     a kind greeting, cool water, the best food ...". The Quran mentions no water.
   - Fix: build the steps only from 51:25-27: return the greeting of peace (51:25), hurry to the
     household (51:26 فَرَاغَ إِلَىٰ أَهْلِهِ), bring the best food, a fat calf (51:26 بِعِجْلٍ
     سَمِينٍ), bring it near them (51:27 فَقَرَّبَهُ إِلَيْهِمْ), and invite them gently, "Will you
     not eat?" (51:27 أَلَا تَأْكُلُونَ). The game already has the last three; `:459` «ألا
     تأكلون» is Quranic. Drop the water step from the story, or move it to a clearly separate
     "your own guests at home" step.
   - Add one line for the parent: "These guests were really angels sent by Allah with good news.
     Angels do not eat, so they did not eat the food." Never draw them; the cups and places on the
     mat may also go.
3. **NOTE:** the Ibrahim sky narration here (`:425-431`) wisely avoids "This is my lord!". The site
   page has it, and frames Ibrahim as "still searching for the truth"
   (`story-prophet-ibrahim.html:112,140,163`). The stronger reading (6:78-83, "that was Our argument
   which We gave Ibrahim against his people") is that he was reasoning with his people, not
   doubting. This is a site-level item for the owner; the game must keep avoiding the
   "my lord" lines.
4. **NOTE:** the 6:79 quote at `:187` matches the site. Approved.

### 05 The Garden of Choices (Adam): APPROVED WITH FIXES
The dua 7:23 matches the site character for character. "Shaytan whispered to Adam and Hawa"
(`:429`) is faithful to 7:20-22, and blames both jointly, as the Quran does. Approved.
1. **MUST: the child "succeeds" where a prophet slipped.** `:426` "You kept the rule!" when the
   child taps the tree's sign, then `:429` narrates that Adam and Hawa ate from it. The ending
   `:455` repeats "You kept the one rule in the garden".
   - Fix: remove the praise. In round 1 the child explores the garden Allah gave, and may tap the
     tree to hear "Allah said: do not go near this tree." There is no "kept" state and no
     comparison.
   - Change the ending to "You learned Adam's dua, and when an accident happened you told the
     truth, fixed it and said sorry."
2. **SHOULD:** in final art the forbidden tree must not be an apple tree, and must not have a
   serpent (both are Western/Biblical tropes; the Quran names neither). `:418` uses 🍎 among the
   *allowed* fruits. Fine for a placeholder, but keep the forbidden tree unidentifiable.
3. **NOTE:** `:432` "The light comes back to the garden" could suggest they stayed in Jannah.
   Prefer "Allah forgave them. Then Allah sent them to live on earth," which `:436` already
   continues.
4. **NOTE:** the child is not Adam, correctly (header lines 11-12). Keep the narration in the
   third person.

### 06 The Deeds Garden: APPROVED WITH FIXES
The framing of a lantern per surah and a plant per story is approved (spec question). Showing the
first ayah on a recall card is approved: it is copied verbatim and verified, and it is shown in
scripture styling.
1. **MUST: Ayat al-Kursi's icon is a chair.** `06-deeds-garden.html:154` `"icon": "🪑"`. This
   gives the Kursi a physical, sat-upon form, which is anthropomorphic. Use the plain
   gold/lantern glyph or an eight-point star. Never a seat or throne.
2. **MUST: rename "The Deeds Garden" / "حديقة الأعمال"** (`:408`). It tracks stories read and surahs
   learned, not deeds, and the record of deeds belongs to Allah. Use "My Learning Garden" /
   "حديقة ما تعلّمت", or "The Story Garden".
3. **MUST: the Nuh "remember" line is the Biblical dove** (`:389`). Replace it with "Allah told
   Nuh to build the ark, and it came to rest safely on Mount Judi."
4. **SHOULD:** Ibrahim's line (`:393`) says "cool like a garden". The Quran says "cool and safe"
   (21:69 بَرْدًا وَسَلَامًا). Use "Allah commanded the fire to be cool and safe for Ibrahim."
   The site page `story-prophet-ibrahim.html:242` has the same embellishment.
5. **SHOULD:** some recap lines were copied out of context and now dangle: `:200` "That
   feeling is what verse 5 calls ...", `:222` "That is what the surah is asking for ...", `:244`
   "That is a blessing ...". Rewrite them to stand alone.
6. **NOTE:** `:211` "Allah noticed it" (copied from `surah-az-zalzalah.html:422`). "Noticed"
   implies Allah was once unaware of it. Prefer "Allah knows it" / "الله يعلمه", here and on the
   site.

### 07 Ayah Lanterns: APPROVED WITH FIXES
Whole-ayah ordering of Al-Fatiha and Al-Ikhlas is approved. All 11 ayat were verified, and the
Bismillah as ayah 1 is the correct Hafs counting. The hint "The first ayah starts with a command:
Say!" (`:234`) belongs to **Al-Ikhlas** and is correct (112:1 begins قُلْ). Approved. The
Al-Fatiha hint "begins with the Bismillah" (`:249`) is also correct.
1. **MUST: the fallback has the browser's speech synthesiser read the Quran's Arabic.**
   `07-ayah-lanterns.html:341-342`: `speak(lang === 'ar' ? s.ayat[i].ar : s.ayat[i].en)`. This
   breaks the site's own rule (`surah-narration.js:46-47`, "a recitation is not a reading").
   - Fix: in AR, fall back to the Arabic *meaning* text, or stay silent. Never pass
     `ayat[i].ar` to TTS. Game 08 already does this correctly (`08:408` speaks `exAr`).
2. **SHOULD: chimes play over ayah audio.** `:443-452` calls `chimeStep(i)` and immediately
   `playAyah(...)`. Today the audio is a meaning narration, so this is tolerable. If recitation is
   ever added, the chime must finish before any Quran audio starts, and no sound may overlap it.
   The "pentatonic-ish rising chime" (`:320`) and the 3-step finale (`:491`) are melodic; see the
   owner decision on sound.
3. **NOTE (owner question in spec line 23):** if a recitation track is wanted, use a licensed
   human qari, never TTS and never the `s2pro-hisham` voice clone.
4. **NOTE:** the 112:3 translation "He does not give birth, nor was He born" (`:228`, from the site
   page) is acceptable. "He has no child, and He has no parent" is clearer for children; this is
   a site-level suggestion.

### 08 Al-Fil, find it in the picture: APPROVED WITH FIXES
All five ayat match the site and the API. Spec questions (game-al-fil-seek.md lines 27-28):
- **Stones falling on the camp:** approved, on condition that they fall onto tents and sand only,
  never onto elephants, with no impact flash or sound. The camp then fades quietly.
- **Showing the Ka'bah:** approved as a simple **hand-drawn SVG** with a plain gold band and no
  writing on it. It must never be generated by an image model (the site's plate negative already
  bans it: `illustrations.py:41`). See fix 2 for how it may be tapped.
- **The "plan arrow":** approved as a visual metaphor for كيدهم. Keep the narration honest:
  "their plan went wrong", which `:351` does. Do not add it to the ayah's meaning text.

Fixes:
1. **MUST: the child is made the agent of Allah's act.** `:310` "Your taps make the story happen."
   Tapping the flocks sends them in (`:546-551`), and tapping the stones drops them (`:552-555`).
   - Fix: the child **finds** each thing, then the scene plays with narration that names Allah
     ("Allah sent flock after flock"; "Allah sent the stones").
   - Change `:310` to "Your taps find each part of the story."
2. **MUST: the Ka'bah gets a "wrong" sound.** Tapping it before the last step runs `:529` `misses++;
   softNo();` with the name "the Kaaba — we will come back to it at the end" (`:334`).
   - Fix: when the tapped spot is the Ka'bah, play no `softNo` and count no miss. Show a gentle
     line, "That is the Ka'bah, Allah's House. We will visit it at the end." Better still, make
     it non-interactive until the final step.
3. **NOTE:** the ending's 3-note chime (`:592`) is melodic; see the owner decision on sound.

### 09 Honest Choices: APPROVED WITH FIXES
The three ayat and the dua are verified. Answers to the TODO-SCHOLAR items follow.
- **(1) Al-Asr 103:3 for truthfulness:** acceptable as an *interim* grounding. تواصوا بالحق is
  "urging one another to the truth", and the site's explanation says that. The direct source is
  better, the hadith of Ibn Mas'ud, agreed upon (al-Bukhari 6094, Muslim 2607):
  «عَلَيْكُمْ بِالصِّدْقِ، فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ، وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ»,
  "Hold to truthfulness, for truthfulness leads to goodness, and goodness leads to Paradise."
  The hadith is authentic. Add it to a site page with its reference first, as the brief requires.
  Before publishing, the person adding it must check the wording against sunnah.com or dorar.net;
  sunnah.com refused automated access during this review.
- **(2) Parents:** Nuh's dua (the opening of 71:28) is acceptable, because it is a real dua that
  includes parents. The better grounding is Al-Isra 17:23-24, verified against the API:
  «فَلَا تَقُلْ لَهُمَا أُفٍّ وَلَا تَنْهَرْهُمَا وَقُلْ لَهُمَا قَوْلًا كَرِيمًا» and the dua
  «رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا». I approve adding 17:23-24 to a site page
  (through `verify-scripture.py`). The game should then use it in the "uff" branch and the
  closing dua.
- **(2b) Al-Ma'un 107:7 for sharing food:** **not approved on the "keep the dates" path.** Al-Ma'un
  describes those who deny the Judgement, neglect prayer and show off (107:1-6). Showing it to a
  5-year-old who kept four dates casts the child among them.
  - Use 99:7 (already used on the success path) and, once it is on a site page, the agreed-upon
    hadith «لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ» (al-Bukhari 13,
    Muslim 45), with the same wording check as above.
  - 107:7 may be shown as positive teaching ("Allah wants us to share even small things") on the
    success path, never as a rebuke.
  - Evidence: `09-honest-choices.html:398` `groundHTML(SRC.maun7)` on the `keep` state, with
    `:233` "Surah Al-Maun talks about people who will not even share ...".

Fixes:
1. **MUST:** replace 107:7 on the keep path, as ruled above (`:398`).
2. **MUST (adab):** `:213` the Arabic for "Oh no!" is «يا إلهي!» ("O my God!"), a casual invocation
   in a moment of alarm. Use «أوه، لا!», as 05 does.
3. **SHOULD:** after 17:23-24 is on the site, use it in the `later`/`uff` branch (`:433-437`
   currently has a hidden TODO) and as the closing parents' dua.
4. **NOTE:** "Jazak Allahu khayran" (`:252`) is good adab. Lighting a lantern per good choice is
   acceptable, because there is no count and no score.

### 10 Ask and Find, together: APPROVED WITH FIXES
Spec line 25: of the 15 clues, 11 are approved as written. The other four need changes:
1. **MUST:** remove the `dove` card (`10-ask-and-find-coop.html:132`, "came back carrying an olive
   leaf"). It is Biblical. Replace it with "Mount Judi: the ark came to rest on this mountain"
   (11:44).
2. **SHOULD:** fire (`:148`) "cool like a garden" should read "Allah commanded the fire to be cool
   and safe, and Ibrahim came out unharmed" (21:69).
3. **SHOULD:** Ka'bah (`:151`) "brick by brick" should be "stone by stone" (the AR already says
   حجراً حجراً), and "they raised its foundations" (2:127).
4. **SHOULD:** Yusuf's dream (`:154`) "all bowing down to him" is Quranic (12:4, 12:100), but a
   child may hear it as worship. Add a parent line in the hint: "It was a bow of respect, allowed
   in their time. In Islam we prostrate only to Allah."

Other items:
5. **SHOULD:** a wrong tap plays a "no" tone on every card (`:314` `tone(246.94, ...,
   'triangle')`), including the Ka'bah card. Never play it for the Ka'bah. Better: make every
   wrong tap tone-free and just name the card, which the spec already does.
6. **NOTE:** the moon clue (`:145-146`) is approved; it avoids "this is my lord". Sea (`:141`): add
   "Allah split it". Basket (`:138`): the Quran says تابوت (a box or chest, 20:39); "basket" is the
   common retelling and is acceptable, but "box" is more exact. Staff, well, wheat, elephant,
   birds, fig/olive and camel: approved.

---

## 3. Mandatory art checklist for image-model game art (gate 2)

The scholar signs off on both lists. A sprite that has not passed both is not used.

### 3a. Before generation: prompt rules
1. **Prompt for things, never for beings with agency.** Allowed subjects are objects,
   architecture, landscapes, weather, light, plants and animals. Never prompt for a prophet,
   Companion, angel, jinn, Shaytan, "a holy man", "an old bearded man", a "guardian", a robed
   traveller, a crowd, an army of soldiers, a child, a mother or a father, even "from behind" or "as
   a silhouette".
2. **Never prompt for Allah or a stand-in:** no "divine light from God", "hand of God", "eye in the
   sky", "throne", "heavenly being". Write light as plain light: "warm shaft of morning light".
3. **Use `STYLE` and `NEGATIVE` from `UI/scripts/specs/illustrations.py` unchanged**, adding the
   game suffix. NEGATIVE must keep all of the following:
   - people, figure, face, hands, silhouette, rider, angel, deity, idol
   - anthropomorphic sun or moon
   - text, writing, calligraphy, arabic letters, latin letters, numbers, watermark
   - kaaba, mosque, minaret, religious symbol, star and crescent emblem, flag, banner with an emblem
   - rainbow
   - Add for games: "cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha,
     statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub,
     serpent, snake (except the Musa staff scene, which needs scholar approval), devil, horns,
     skull, blood, weapon, sword, spear, gore, apple tree (Adam), bikini, bare shoulders".
4. **Story-specific bans in the prompt itself:**
   - Nuh: no dove carrying a leaf, no rainbow.
   - Adam: the forbidden tree has unnamed fruit, and there is no apple or serpent.
   - Musa: no people walking between the water walls, and no chariot riders.
   - Al-Fil: no soldiers, riders or mahouts. Tents and elephants only; elephants standing calmly,
     never struck.
   - Ibrahim: no guests, no fire with a figure in it, no idols with faces. Broken idols may be
     shown only as faceless rubble, and only if a story needs it.
5. **The Ka'bah, the mushaf and Quran text are never generated.** The Ka'bah is a hand-drawn SVG.
   Any Arabic or Quran text is live HTML text from the verified page, never baked into an image.
6. **Modesty:** if clothing, fabric or a tent hanging appears, it is plain. No human forms,
   mannequins, dresses-on-bodies, or "fashion".
7. **Record every prompt, seed and negative** next to the sprite (for example in a
   `specs/games/<game>.py`), so the scholar can review the exact prompt before the run, and so a
   rejected sprite is regenerated with a new seed rather than retouched.
8. Generation runs only through `~/.local/bin/draw-things-cli` under the RAM gate, one job at a
   time, after the owner's go-ahead (brief line 98).

### 3b. After generation: contact-sheet review
Review every sprite at 100% and at thumbnail size, on a light **and** a dark background (cut-outs
hide things). **Reject the sprite** if any of these appears:
1. **Any face or figure**: a face in clouds, rocks, bark, the sun or moon, or water foam; a
   person-shaped silhouette, shadow, hand, foot or footprint pattern that reads as a person; a
   rider on an animal; a figure in a doorway, window or boat.
2. **Anything that could read as a depiction of Allah, an angel or Shaytan**: an eye shape in the
   sky, a hand from a cloud, a winged form, a halo, a glowing humanoid, a horned or serpentine
   shape (except the approved Musa staff serpent).
3. **Religious symbols of other faiths or of shirk**: a cross (including window mullions, masts
   and spars, or road crossings that form an obvious cross), a church or temple form, a statue or
   idol, a totem, a pentagram, a hexagram used as an emblem, a zodiac wheel, an evil eye, a
   hamsa, a Buddha shape. Also a star-and-crescent emblem or flag.
4. **Text-like glyphs**: any squiggle that resembles Arabic letters, Quranic calligraphy, a
   signature, a seal, numbers or Latin text, including on banners, the elephant's saddle cloth,
   tent fabric, ceramic tiles, book spines and borders. Pseudo-Arabic is the most likely failure
   and the most serious, because a child or parent may read it as Quran. When in doubt, reject.
5. **The Ka'bah, a mosque, a minaret, a mushaf or a book with writing** appearing unasked.
6. **Immodesty**: any human form at all (which already fails item 1), or suggestive shapes.
7. **Violence or fear beyond the age band**: blood, bodies, drowning forms, weapons, skulls,
   menacing faces on animals, dark horror lighting.
8. **Biblical or Israiliyyat details** that slipped in: a dove with a leaf, a rainbow, an apple
   on the forbidden tree, a serpent in the garden.
9. **Anatomy errors that look wrong or mocking**: extra legs, fused animals, or a distorted animal
   in a respectful scene. Regenerate.
10. **Final check in context:** place the sprite in the scene at both screen sizes, and in RTL
    mirroring. A mirrored shape can create a cross or a letter that was not there before.

Sign-off line to add to each game spec:
`Art gate: prompts reviewed <date> (scholar); contact sheet reviewed <date> (scholar) - N sprites
approved, M rejected and regenerated.`

---

## 4. Decisions for the owner
1. **Instruments and music.** The default is none. All games currently use synthesised sine-tone
   cues. Single soft tones are fine as non-musical feedback. Several games play rising
   multi-note arpeggios, which are melodies:
   - `01:341`
   - `07:320-321,491`
   - `08:396,592`
   - `09:287`
   - `10:` end chime
   
   Decide whether these are acceptable, or whether cues stay at one or two notes. Until the owner
   decides, the scholar's ruling is one or two notes.
2. **Animals and people.** The site already paints animals but no people
   (`illustrations.py:1-9`). The ruling is that games follow the same rule: animals yes, people
   never, prophets and angels never. The owner should confirm.
3. **The Ka'bah in games 08 and 10.** The ruling allows a simple hand-drawn SVG only. The owner may
   prefer to keep it out entirely, matching the site plates (which ban it).
4. **A recitation track (game 07).** If wanted, use a licensed human qari only, never TTS and
   never the voice clone.
5. **Two hadith and Al-Isra 17:23-24 need adding to site pages** before game 09 can quote them
   (approved above, with a wording check against a hadith database).
6. **Site-level findings outside the games** (for the owner and `docs-keeper`, not blocking the
   games):
   - The Biblical dove and olive leaf: `story-prophet-nuh.html:159` and `illustrations.py:130`.
   - "Cool like a garden": `story-prophet-ibrahim.html:242`.
   - Ibrahim as "still searching" rather than arguing with his people: `:112,140,163`.
   - "How do you think Allah felt about Iblis refusing?": `story-prophet-adam.html:172`. This
     attributes human feelings to Allah. Ask instead "What did Iblis do wrong?"
   - "Allah noticed": `surah-az-zalzalah.html:90,422`.

---

## 5. Rulings on the 01-05 designer's questions

**Nuh: the invented taunt lines.** Approved. Hud 11:38 says his people mocked him whenever they
passed, so mild, non-insulting paraphrases of that mocking are faithful. The three lines at
`01-nuh-ark.html:482-486` are acceptable. Conditions:
- Do not add insults the Quran reports, such as "madman" (54:9), as playable or tappable text.
- The child never types, voices or selects a taunt.

**Nuh: the dove and olive leaf.** Remove them from the game. This is a MUST (section 2, 01 fix 1).
The detail comes from Genesis 8:8-11. It is not in the Quran or in authentic hadith, so the site
must not teach it as fact.
- **Fix it on the story page too:**
  - `UI/story-prophet-nuh.html:159`, both the EN text and its `data-ar`.
  - The plate prompt `UI/scripts/specs/illustrations.py:130`, which means plate 7 must be
    regenerated or replaced with the ark resting on Judi.
- Replacement text, keeping to 11:44: "After many days, Allah commanded the rain to stop and the
  water to go down. The Ark came to rest safely on a mountain called Judi. Prophet Nuh thanked
  Allah for keeping them safe."
- Arabic: «وبعد أيام كثيرة أمر الله المطر أن يتوقف والماء أن ينحسر، فاستقرت السفينة بسلام على جبل
  اسمه الجودي. فحمد النبي نوح الله على نجاتهم.»

**Yusuf: 12:92 «لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ».** Yes, add it. It is the Quran's own
forgiveness line, and it gives the game a real source for its moral.
- Add it to `story-prophet-yusuf.html` first, through `verify-scripture.py`. Then copy it into the
  game at the moment Yusuf makes himself known; that is also the correct timing (see 02 note 2).
- Simple-script text, verified against the API: «قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ
  اللَّهُ لَكُمْ ۖ وَهُوَ أَرْحَمُ الرَّاحِمِينَ».
- For children, the quoted portion may begin at «لَا تَثْرِيبَ», dropping «قَالَ».
- Meaning: "He said: No blame upon you today. May Allah forgive you; He is the Most Merciful of
  the merciful."

**Musa: the paraphrased, unvowelled quotations shown as quotes.**
- Speech of **people** (the believers' cry, and Musa's reply) may be shown as a paraphrase in
  quotation marks, as long as it is not styled as Quran (no cobalt or scripture class, no ayah
  number). That is the case today at `03-musa-sea.html:175-176`. Approved.
- **Words attributed to Allah** (`:177`, «قال الله: اضرب بعصاك البحر») must be either:
  - the exact Quranic wording in scripture styling, with a reference: «أَنِ اضْرِب بِّعَصَاكَ
    الْبَحْرَ», 26:63, added to the page through the verifier first; or
  - indirect speech: "Allah told Musa to strike the sea with his staff."

  Do not put a paraphrase inside quotation marks as Allah's speech. This is a SHOULD for the game
  and for `story-prophet-musa.html:208`.
- **The "watch" button.** A button that only starts the narration is acceptable. The MUST in 03
  fix 1 is narrower than removing the button: the narration of the parting must name Allah as
  the one who did it ("by Allah's command the sea split"). At present `:426` does not. With that
  sentence added, the button may stay.

**Ibrahim: the guests paraphrase 11:69 and 51:26-27, which are not on any site page.**
- Narrating the meaning in plain words is acceptable without a site page. Quran *text* is what
  must come from a verified page. «ألا تأكلون» at `04-ibrahim-stars.html:459` is used as the
  child's own polite line, not presented as an ayah, so it is acceptable. If it is ever labelled
  as Quran, add 51:24-27 to the story page first.
- The angels: not drawing them is correct. Not *naming* them is not acceptable, because it implies
  ordinary guests who ate.
- The MUST in 04 fix 2 stands:
  - Remove the invented water step from the story.
  - Add the parent line "These guests were really angels sent by Allah with good news. Angels do
    not eat."
  - Do not show the food being eaten.

**Ibrahim: "never disappears, never sleeps" as the explanation.** Approved.
- "Never sleeps" is 2:255 «لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ».
- "Never disappears" is a sound child's rendering of al-Hayy al-Qayyum: Allah is always there,
  hears and sees, and is never absent, unlike the star, the moon and the sun (6:76-78 «لَا أُحِبُّ
  الْآفِلِينَ»).
- One caution: do not say "Allah is everywhere" as a place statement. Say "Allah is always with
  us, hearing and seeing".

**Adam: "big mistake" versus "slip" (زلّة).** Prefer "slip".
- The Quran's word is «فَأَزَلَّهُمَا الشَّيْطَانُ» (2:36): Shaytan caused them to slip.
- "Big mistake" overstates it for a prophet. It also places the weight on the act rather than on
  the repentance that follows.
- Use "they slipped and made a mistake" / «فأزلّهما الشيطان فأخطآ», and drop "big".
- Change it in the game (`05-adam-garden.html:429`) **and** on the story page (`UI/translations.js:95`
  `scene8Text` EN and `:271` AR «خطأً كبيراً», which `story-prophet-adam.html:280` renders).
  This is a SHOULD on both.

**Adam: "say sorry to Allah" versus «نستغفر الله».** Use both.
- "Say sorry to Allah" is acceptable as a child's first gloss, but the act has a name, and the
  child should learn it.
- EN: "Adam and Hawa turned to Allah and asked His forgiveness: they said sorry to Allah. We call
  this istighfar, and we say: Astaghfirullah."
- AR: replace «قال آدم وحواء آسفين لله» (`:433`) and «نقول آسفين لله» (`:451`) with «استغفرا الله»
  and «نستغفر الله». "آسف لله" is not natural Arabic adab.

**Adam: the mistake is narrated, never played.** This is correct, and it is a condition of the
approval. It must stay that way in the build. 05 fix 1 (remove "You kept the rule!") is the
remaining issue in that round.

### Story-page fixes flagged by these questions (site-level, for the owner)
| Page | Line | Fix | Severity |
|---|---|---|---|
| `UI/story-prophet-nuh.html` | 159 | Remove the dove and olive leaf; use the 11:44 text above | MUST (teaches a non-Quranic detail as fact) |
| `UI/scripts/specs/illustrations.py` | 130 | Nuh plate 7: replace the dove and leaf prompt with the ark on Judi; regenerate | MUST |
| `UI/translations.js` | 95, 271 | Change "big mistake" / «خطأً كبيراً» to "slipped and made a mistake" / «فأزلّهما الشيطان فأخطآ» | SHOULD |
| `UI/story-prophet-yusuf.html` | ~170 | Add 12:92 through the verifier | SHOULD |
| `UI/story-prophet-musa.html` | 208 | Allah's words: exact 26:63 with reference, or indirect speech | SHOULD |
| `UI/story-prophet-ibrahim.html` | 242 | "cool like a garden" should be "cool and safe" (21:69) | SHOULD |
| `UI/story-prophet-adam.html` | 172 | "How do you think Allah felt ...?" should be "What did Iblis do wrong?" | SHOULD |
