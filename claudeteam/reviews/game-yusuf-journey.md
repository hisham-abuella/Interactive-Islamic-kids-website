# Game spec: Yusuf's Journey (mockup 02)

File: `UI/mockups/games/02-yusuf-journey.html`. Prototype, not linked from the hub. Art is placeholder (emoji and plain shapes) pending the graphics redesign. Logic and rendering are kept separate, and assets sit in the `ART` block. **Sign-off still needed.**

- **Learning goal:** After playing, the child can retell Yusuf's journey in order (well, travellers, Egypt, prison, the king's dream, reunion) and say that he was patient in hard times and forgave his brothers.
- **Age band:** 6-10.
- **Tied to:** `UI/story-prophet-yusuf.html`.
- **Core loop:** drag the picture card that comes next onto the glowing stepping stone. A correct card tells that part of the story. A wrong card floats back with a hint about what comes next.

## One round (about 3-5 min)
1. **The path** starts on a fixed "dream" stone. Six cards are shuffled in a tray. Only the next stone accepts a card. After 2 misses on the same step, the right card glows as a hint.
2. **After "the king's dream explained":** drag 7 sheaves of wheat into the storehouse ("Yusuf saved food in the good years").
3. **After "reunion", the brothers come:** they are shown only as 10 empty grain sacks. What Yusuf did is narrated, never quizzed: "Yusuf was kind: he gave them food. Later, when they knew who he was, he forgave them." The child fills every sack.
4. **Parent pause:** "If someone had hurt you, what would you feel like doing? What did Yusuf choose, and why?"
5. **Your turn:** "Your little brother knocks over your tower and says sorry." The child chooses to forgive, or to stay cross, which gets a gentle explanation and a re-choice. The child then taps to rebuild the tower together.
6. **Ending:** "Patience, then forgiveness", then "Play together again".

## Difficulty ramp
Cards are reshuffled every round. The parent tier ("pictures only") hides the words on the cards for readers who should recall from the picture.

## EN/AR, RTL and accessibility
- The path is a flex row, so it runs right to left in Arabic and the arrows flip. All strings are bilingual and numerals become Eastern Arabic.
- Keyboard: select a card, then select a stone. Targets are 96px or more.
- There are no timers. Waits are only for reading.

## Guardrail checklist
- [x] Yusuf, Yaqub and the brothers are never drawn. The brothers appear only as sacks.
- [x] The child does not play as Yusuf. His kindness and forgiveness are narrated; no option ever says a prophet did wrong. Wrong options exist only in the child's own "Your turn" choice.
- [x] No scripture is shown. The forgiveness ayah "لا تثريب عليكم اليوم" (Yusuf 12:92) is not on any site page, so it was not added.
- [x] **Scholar (approved 2026-11-03):** add 12:92 to the story page through the verifier first, then copy it into the game. Not done yet: see the TODO-SCRIPTURE in the game header.
- [ ] **Learning designer:** the brothers' guess is not graded. Is it clear enough that it is a guess and not a test?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: wrong options attribute misconduct to a prophet ("He shouted at them", "He sent them away hungry") | Done. The quiz and its three options are removed. `L.brothersTold` narrates what Yusuf did; the reflection moves to the parent pause: "If someone had hurt you, what would you feel like doing? What did Yusuf choose, and why?" |
| 2 | NOTE: timing of the forgiveness (fed first, forgave on revealing himself, 12:58-62, 12:92) | Done for all tiers: "He gave them food. Later, when they knew who he was, he forgave them." |
| 3 | NOTE: no pharaonic temple for Egypt | Placeholder 🏛️ replaced with a palm (🌴); final art brief: granary, Nile, palms. |
| 4 | 12:92 «لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ» approved, via the story page first | **Not added (by instruction):** it is not on a verified site page yet. TODO-SCRIPTURE in the game header names the exact slot (`L.brothersTold`, at the reveal). |
| 5 | Adab: "Prophet" at first mention | Done: "Prophet Yusuf's journey..." / «النبي يوسف عليه السلام». |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done via the shared kit (two-note `done`). No Quran audio in this game. |

## Painted build, 2026-11-07 (`kids-game-designer`)
The third painted game, built to the Nuh and Musa standard:
- page `UI/games/yusuf-journey.html`, built by `_src/build.py` from `UI/mockups/games/_src/src/02-yusuf-journey-painted.html`.
  The build copies 12:92, its meaning line, the dua 12:101 with its translation and note, and the page's note on the
  bow from `story-prophet-yusuf.html`;
- `UI/games/yusuf/yusuf.js` and `yusuf.css`;
- art in `UI/images/games/yusuf/` (`claudeteam/reviews/game-yusuf-art.md`).

The CSS-shape mockup `UI/mockups/games/02-yusuf-journey.html` is kept as it was. **Not linked** from the story or the
hub: gates 2 (art) and 3 (build) are open.

**One round, as built** (about 4-5 minutes). The approved wording is kept as approved; new lines are marked (new).
1. **The dream** (new beat, night plate): "Prophet Yusuf, peace be upon him, had an amazing dream: eleven stars, the
   sun and the moon. Tap each faint star to see it shine."
   - The game draws exactly eleven soft lights (12:4); the plates paint none. The child kindles each one.
   - Then a plain sun disc and a plain moon disc appear. They have no faces, and they never move towards anything
     and never bow.
   - Baba's narration plays slide 0. Its Arabic phrase «أحد عشر كوكباً والشمس والقمر» is the scholar's whitelisted
     unit (Part 2, D).
   - The story page's own note then shows as "A note for parents": "It was a bow of respect, allowed in their time.
     In Islam we prostrate only to Allah."
2. **The road** (day plate): drag the picture that comes next onto the glowing stone. The approved core loop and the
   approved `told` and `hint` lines are kept.
   - The five cards are painted objects: the well, a camel with bundles, a palm, a closed door, a sheaf.
   - A right card stands on its stone as a prop, and gold dots light the way so far. Baba plays slide 2 (well),
     slide 4 (travellers), slide 5 cut in two at its recorded pause (Egypt / prison) and slide 6 (the king's dream).
   - A wrong card floats back with a soft single tone and the hint. After two misses, the right card glows.
   - Other ways to play: tap a card, then tap the stone; or press Enter on a card.
3. **The good years** (the camera glides in on Egypt): drag (or tap) the seven sheaves into the storehouse door, with
   Baba's slide 7. "The storehouse is full!"
   - Then the drought plate crossfades in (new): "Then the hard years came. The fields were dry, but the storehouse
     was full."
4. **The brothers come**: two camels walk in along the road. The brothers are never drawn: only camels and their
   bags.
   - The approved `brothersTold` line, then the child taps each of ten empty bags to fill it with grain.
   - Then "Later, when they knew who he was, Yusuf forgave them with all his heart." (new: the EN is the story page's
     sentence; the AR follows the page's «ثم لما عرفوا من هو، سامحهم من كل قلبه» closely), and 12:92 with its meaning, copied from the story page, in a cobalt cartouche.
   - The ayah is never voiced: slide 8 is never played, and every sound is muted while the cartouche is on screen.
5. **The family** (evening plate, the camera out again): "His whole family came to live in Egypt, and his dream came
   true." The eleven lights, the sun and the moon return softly, with the parent note on the bow again.
6. **Parent pause** (approved), then **Your turn** (approved wording) on a parchment page.
   - The child chooses: forgive, or stay cross (order shuffled). Staying cross gives the approved explanation and a
     choice again.
   - Then four fallen blocks are tapped back into a tower (UI-kit tiles, see the art doc).
7. **Reward and ending**: the lamp glow, the shamsa approved on Nuh and a two-note chime. Then "Patience, then
   forgiveness", the approved `endB`, the dua 12:101 with its note and translation (text only), "Play together
   again", "Back to the story", and the tier box ("pictures only, no words on the cards").

**Clips used** (sentence-aligned, cut only at recorded pauses, `ffmpeg silencedetect`):
- slides 0, 2, 4, 6 and 7 play whole;
- slide 5 is cut in two: EN at 7.0 s (pause 6.78-7.26), AR at 7.66 s (pause 7.58-7.74);
- slide 8 (the 12:92 meaning) and slide 10 (the dua) are never played.

**New strings for the scholar's gate 3** (EN and AR in `yusuf.js` `W`): `dream`, `dreamAll`, `beginBtn`, `selCard`,
`missStone`, `stone`, `selSheaf`, `missStore`, `sheaf`, `hard`, `sack`, `sackFull`, `forgave`,
`carryOn`, `family`, `block`, `starLabel`, `starLit`, `beadsLabel`.
- The Arabic of `dream` and `dreamAll` says «أحد عشر نجماً» rather than «كوكباً». The no-recitation check flagged
  the five-word run «أحد عشر كوكبا والشمس والقمر» in the game's own text.

**Guardrail checklist (build)**
- [x] No person drawn: Yusuf, Ya'qub, the brothers, the 'Aziz's household and the king appear only as objects (the
  well, camels, bundles, the door, sheaves, the storehouse).
- [x] No option attributes wrongdoing to a prophet. What Yusuf did is narrated; the only choice is the child's own.
- [x] The dream's bow carries the page's note, both times it is shown.
- [x] The seduction episode is omitted entirely (no line, prop or image); the prison line is the page's "some people
  were unfair to him".
- [x] No pharaonic temple, idol, crown or seal.
- [x] 12:92 and 12:101 are copied from the page and never voiced; no sound plays while 12:92 is on screen.
- [x] No music: single tones, two-note chimes, filtered-noise sand, grain and wind. Nothing is counted as a deed.
- [x] Prophet Yusuf / «النبي يوسف عليه السلام» at first mention; Prophet Yaqub with عليه السلام.

**Gates:** 1 closed on the mockup wording (the new lines above need the scholar's eye in gate 3). 2a and 2b:
**pending** (`claudeteam/reviews/game-yusuf-art.md`, contact sheet `claudeteam/reviews/game-yusuf-contact-sheet.png`).
3: **pending**. Not linked from the story or the hub.

## Scholar gates 2-3 (2026-11)
`islamic-content-scholar`, 2026-11-07, on `main` at 059df38. I did not edit any game file; the game files are unchanged
from that commit. I read every image in `UI/images/games/yusuf/` at full size (sprites at 3x, on light and dark grounds;
the well also at its 100 px play size, mirrored too). I read the contact sheet and all 80 stage screenshots in the
designer's scratchpad `yusuf-game/final/` (tablet and phone, EN and AR, plus the montages). I re-ran these checks myself:
- 12:92 and 12:101 against `api.alquran.cloud/v1/surah/12/quran-simple`, codepoint-diffed;
- the game's 12:92 line, its EN and AR meaning, the dua 12:101, its translation and note, and the bow note, against
  `story-prophet-yusuf.html:171-173,192-194`;
- `verify-scripture.py` (page), `verify-no-recitation.py` (site), and `--transcripts` on all 128 game strings (`W`,
  `STEPS`, every `data-ar` and its EN) plus the narration parts (slides 0, 2, 4, 6, 7 whole, and slide 5 split at its
  sentence boundary), EN and AR;
- `ffmpeg silencedetect` on `audio/prophet-yusuf/{en,ar}/slide-5.mp3` at -30, -35 and -40 dB;
- the wind bed (`yusuf.js:172-183`) rendered as written in an OfflineAudioContext (headless Chromium), measured in dBFS.

**Linking verdict: Yusuf's Journey may be linked from the end of the Yusuf story once 3.1 and 3.2 (both MUST) are done.**
3.3 is cheap and should land in the same change. None of these needs another scholar gate. The designer attaches the
following here, and I confirm them on sight:
- the 12:92 screen, the family beat and the ending, tablet and phone, EN and AR;
- a measured output trace (not the `G.quiet` flag) showing silence while 12:92 is on screen and with Sounds off.

### Gate 1: CONFIRMED (closed)
- **No option attributes wrongdoing to a prophet.** The only choice is the child's own (`turnChoose`, `yusuf.js:579-601`:
  `optFix` / `optCross`). Hints ask about the story's order only.
- **What Yusuf did is narrated.** `W.brothersTold` (`:103-104`) says "Yusuf was kind: he gave them food". Then `W.forgave`
  (`:107`) says "Later, when they knew who he was...". The timing is right: food at 12:58-62, forgiveness at the reveal,
  12:92.
- **The bow parent note** is byte-identical to the page (`story-prophet-yusuf.html:173`, EN and AR). It is shown at the
  dream (`:425`) and at the family (`:551`). See 3.3: the words around it no longer name the bow.
- **No person is depicted.** Checked in every image and every screenshot: the brothers are only camels and bags, and
  the doorways and roads are empty.
- **The seduction episode is omitted.** No line, prop or image refers to it. The prison step is "Some people were
  unfair to him" (`:78`). The narration part `door` (slide 5 from 7.0 / 7.66 s) is "But some people were mean to him,
  and he was put in prison even though he did nothing wrong!", with nothing more.
- **12:92 is in a cartouche and never voiced.** `CLIPS` (`:128-136`) holds slides 0, 2, 4, 5, 6 and 7 only, so slides 8
  and 10 can never play. `playClip` returns while `G.quiet`, and the listen button is hidden at that beat
  (`setClip(null)`, `:503`).
  - **"All sound stopped while it shows" is not true in fact.** See 3.1.
- **Scripture:**
  - 12:92 in the game is byte-identical to the page (`yusuf-journey.html:90` = page `:171`), as are its EN and AR
    meaning.
  - 12:101, its translation and its note are byte-identical to the page (`:139-140` = page `:192-194`).
  - Against the API, both match word for word (12:92 without «قَالَ», as ruled; 12:101 from «أَنْتَ»). The only codepoint
    differences are shadda before or after the vowel (6 places), which are NFC-equivalent. `verify-scripture.py`: both
    ok.
- **Narration parts: no recitation.** The site check reports NO RECITATION. With `--transcripts`, 141 of 142 strings
  and parts are clean.
  - The one flag is slide 0 AR «أحد عشر كوكبا والشمس والقمر» (12:4). It is the unit already whitelisted under Part 2, D
    (`prophet-yusuf/ar/slide-0`); it was flagged only because I keyed it under my own name. It is the same recording.
  - The game's own text uses «نجماً», which is clean.
- **The slide-5 cuts fall inside recorded sentence-end pauses at every threshold:**
  - EN 7.0 s is inside the pause 6.76-7.27 s (-30 dB) / 6.80-7.26 s (-40 dB).
  - AR 7.66 s is inside the pause 7.58-7.74 s (-30 dB) / 7.63-7.74 s (-40 dB). That is 25 ms in at the strictest
    threshold, and 75 ms before the next word.
  - The fade starts 0.18 s before the cut and reaches zero within about 120 ms. With the 40 ms poll, the stop lands by
    7.04 s (EN) and 7.70 s (AR), still inside the pauses.
  - The pauses are the sentence ends ("...kind to everyone." / «...مع الجميع.»). The other pauses are the comma after
    "In Egypt," / «في مصر،» (about 0.7 s), the first full stop (3.6 / 4.3 s) and the comma in sentence 3 (8.9 / 10.0 s).
- **Adab:** "Prophet Yusuf, peace be upon him" / «النبي يوسف عليه السلام» at first mention (`W.dream`), and Prophet
  Yaqub with عليه السلام (`W.dreamAll`).
- **Sound:** single tones and two-note chimes only; the star is one repeated note.
- **No counted deeds.** The beads count stars, steps, sheaves and bags, never a virtue.

### Gate 2a (prompts): PASS WITH FIXES
- `STYLE` and `NEGATIVE` are imported unchanged. `GAME_NEGATIVE` holds the full 3a.3 list plus the Yusuf bans
  (pharaonic temple, pyramid, obelisk, sphinx, hieroglyphs, statue, crown, throne, seal, king, palace) and the Nuh and
  Musa lessons (crescent, sun rays, eye, bars, crossbar, mast, dome).
- Every subject is a thing: no prophet, brother, king, household, rider or traveller. The sun and moon are prompted as
  plain discs with no face and no rays, and nothing is prompted as divine light.
- Rerolls are new seeds, never retouches. Dropping the sacks and the block rather than forcing them was the right call.
- **Fix (record only, 3a.7):**
  - `game-yusuf-art.md:73` and `:229` describe the shipped door as "single-leaf ... one vertical seam". The render is
    visibly a pair of leaves with a centre seam and a centred ring. That is acceptable (no rail, so no cross), but the
    record must describe what shipped.
  - Note in the same edit that the storehouse rendered with a gabled roof, although the prompt asked for a flat one.
    It is acceptable: there is no finial, no steeple and no cross.

### Gate 2b (images): PASS
**All 16 images are approved:** 8 plates and 8 sprites, one of them the Musa `bundle` (confirmed byte-identical to
`images/games/musa/bundle.webp` with `cmp`). The designer rejected 19 renders before review, and I reject none further.
Checked against 3b.1-10:
- No face or figure anywhere. The camel has a plain animal face, the sun and moon have none, and every doorway is empty.
- No cross: the door has no rail, the well's plank sits under the bucket, nothing rises above it, and the mirrored AR
  scenes are clean.
- No glyphs: the hard-port river edge is a zigzag and dot band. No Ka'bah, mosque, dome or book. No temple, idol or crown.
- Nothing frightening: the well is dry stone in daylight. The drought shows no suffering.
- No Biblical detail: no coat, no wolf, no blood.

Three conditions and cosmetic notes:
- `plate-night-port` paints four small gold star shapes on the ground, at about (430-570, 1260-1335). At 390x844 they
  sit under the narration ribbon during the dream (`phone-*-01..03`), so the child sees only the eleven lights.
  **Condition:** if a layout change ever exposes that corner during the dream, regenerate the plate. The count in 12:4
  must never read as fifteen.
- Cosmetic, not religious:
  - `plate-eve-land` keeps a thin border remnant on its top and right edges;
  - `door.webp` has a stray dot below its threshold;
  - the sun and moon read a little like decorated plates.

Rulings on the designer's questions:
1. **The well's centre lozenge: neither a cross nor an eye. Approved.**
   - The shape is a horizontal cusped cartouche with a cusped inner diamond. It has no arms, so it is not a cross.
   - It is cobalt on cobalt, with no light "sclera" and no dark "pupil", so it does not read as an eye. It is not the
     evil-eye pattern of concentric blue, white and black rings.
   - I checked it at 3x and at 100 px on light and dark grounds, mirrored, and in context (`tab-en-08`, `tab-ar-14`).
     It reads as Ottoman tile ornament, the same family as the approved bundle.
   - If the well is ever regenerated, prefer bare stone.
2. **The sun and moon shown, never bowing: acceptable, and the better choice.**
   - They are in the dream (12:4) and its fulfilment (12:100).
   - Animating a prostration towards a person, even a prophet, is exactly what we should not show, so a static
     sky is right. Keep them out of any motion towards the road, the storehouse or the family.
   - The note must have something to refer to. Today the on-screen words never say anything bowed. See 3.3.
3. **The bundle as the brothers' bags: approved.** It is the approved sprite, byte for byte; slack and plump are
   only CSS. The bags stand for the travellers' grain and never for the brothers themselves.
4. **The "Your turn" tower as CSS turquoise tiles: fine religiously.** Four plain rounded tiles, with no motif and no
   cross arrangement, stacked in one column (`tab-en-18`, `phone-ar-18`). The style is the owner's call.
5. **The eleven lights drawn by code: approved, and preferred.**
   - The count is guaranteed: `LAYOUT.land.stars` and `LAYOUT.port.stars` each hold exactly 11 entries.
   - They are soft glows with no points and no crescent beside them.
   - The bead count of 11 while kindling is a progress count, not a deed.
6. **Mirroring: approved.** There is no writing or sacred place in any image.

**The prison door standing alone in the dunes: acceptable.**
- It is a closed wooden door with a ring. It has no bars or grille, and nothing stands in its doorway.
- Because the leaves are painted wood, it reads as a door, not a niche or mihrab. That is what the designer's
  full-door cut secured.
- It stands alone like the other story props (the well, the palm, the sheaf). On the road it marks "the prison" by
  its label and line, not by shape.
- Two cautions:
  - never show it opening with light pouring out (a portal or "divine light" reading);
  - keep it apart from the storehouse, so the granary of the good years is never read as the prison.

**The drought states: approved.**
- The fields turn bare and brown, the palms dusty and the river lower, while the storehouse stands unchanged. That is
  12:47-48 exactly: hard years, and what was stored suffices. The words say "the storehouse was full".
- No people, animals or suffering are shown.
- `plate-hard-port` keeps green hills (a milder drought than the landscape plate). That is fine.

Art gate: prompts reviewed 2026-11-07 (scholar); contact sheet reviewed 2026-11-07 (scholar) - 16 images approved
(one of them the Musa bundle, approved 2026-11-06), 0 rejected at review (19 rejected and regenerated or dropped
before review).

### Gate 3 (build): PASS WITH FIXES
**3.1 MUST: the silence during 12:92 (and "Sounds off") is not silent.**
- In `wind()` (`yusuf.js:178`) the LFO is connected to `g.gain` with a fixed depth (`lg.gain.value = 0.008`). An
  AudioParam adds its inputs to its own value, so `wind(0)` only moves the base to 0.0001. The LFO keeps swinging the
  gain by +/-0.008, and is not scaled by `vol()`.
- Measured with the code as written:
  - the wind plays at about -45 to -50 dBFS during play;
  - after `wind(0)` it settles only to a pulsing -55 to -60 dBFS (troughs about -65), and never stops.
- So the hiss continues the whole time the cartouche is on screen (`fillSack` -> `G.quiet = true; wind(0)`, `:538`). It
  also continues after the parent presses Sounds off (`:657`) and in bedtime mode.
- No Quran audio plays here, so this does not break the overlap guardrail. But it makes the gate-1 claim "every sound is
  muted while the cartouche is on screen" false, and a "Sounds off" button that does not turn the sound off breaks a
  parent's trust.
- **Fix:** route the silence through `master`. Set `master.gain` to 0 with a short ramp (about 0.15 s) whenever
  `G.quiet` or `!G.sound`, and restore it after. Or at least set `lg.gain` to 0 together with the target in `wind()`.
  Prove it with a measured output trace, not the flag.
- Musa (`musa.js:165`, surf) and Ibrahim (`ibrahim.js:179`) have the same pattern. Their "Sounds off" carries the same
  floor. Fix it there in the same pass. This is not a new gate for them.

**3.2 MUST: the waqf mark ۖ of the scripture line runs into the line above.** The pause sign over «الْآخِرَةِ» (12:101)
and over «الْيَوْمَ» / «لَكُمْ» (12:92) rises out of the Quran line into the text above:
- `tab-en-20-end.png`: it is printed **over the word "Allah"** in "Prophet Yusuf thanked Allah...";
- `tab-ar-20-end.png`: over «الدعاء»;
- `phone-ar-20-end.png`: over «أيضاً»;
- `phone-ar-13-ayah.png` and `tab-en-13-ayah.png`: touching «فقال لهم:» / "He said to them:".

A Quranic sign struck through the Name of Allah and through the other text garbles both. **Fix:** give the scripture
lines clearance above them: more top margin on `.page .dua` (`yusuf.css:267`, `:310`) and on `.ayah .quran` (`:149`,
`:330`), or a larger margin under `.cartouche .kicker` and `.ayah .who`. Check that the sign sits clear at both sizes
in both languages.

**3.3 SHOULD: name the bow wherever its note appears.**
- The note "It was a bow of respect, allowed in their time..." follows lines that never mention a bow:
  - at the dream (`W.dreamAll`), only Baba's slide 0 says "all bowing down to him", and that is lost with the sound off;
  - at the family (`W.family`), nothing says it at all, because slide 8 is never played.
- Use the page's own wording. Both lines below are checked with `verify-no-recitation.py --text`: clean.
  - `family`: "His whole family came to live in Egypt, and his dream came true: they all bowed to him with respect and
    love." / «وجاءت أسرته كلها لتعيش في مصر، وتحققت رؤياه: فسجدوا له جميعاً احتراماً ومحبة.»
  - `dreamAll` (optional): "Eleven stars, the sun and the moon, all bowing to him, just as in the dream. ..." /
    «أحد عشر نجماً، ومعها الشمس والقمر، كما في الرؤيا، وكلها تسجد له. ...».
- The pictures stay as they are, with no motion.

**New lines: all approved as written, EN and AR.** `dream`, `dreamAll`, `beginBtn`, `selCard`, `missStone`, `stone`,
`selSheaf`, `missStore`, `sheaf`, `hard`, `sack`, `sackFull`, `forgave`, `carryOn`, `family`, `block`, `starLabel`,
`starLit`, `beadsLabel`.
- `dreamAll`'s "a special gift from Allah" is a fair child's rendering of 12:6 «وَكَذَٰلِكَ يَجْتَبِيكَ رَبُّكَ».
- «نجماً» for «كوكباً» is right for a game string: it is a plain meaning, not the ayah's wording.
- `forgave` follows the page's sentence, and «فقال لهم:» before 12:92 is correct: he said it to the brothers.
- `hard` fits 12:48.
- The AR grammar is sound throughout.

**Note (site-level, not blocking):** the page's AR gloss of 12:92, «أي: لا لومَ عليكم اليوم ولا عتاب», explains only
the first clause. That is acceptable, because the rest of the ayah is plain Arabic to an Arabic reader. The game copies
it faithfully, as it must.

## Fixes after gates 2-3
`kids-game-designer`, 2026-11-07.

| Item | Fix |
|---|---|
| 3.1 MUST: the wind bed kept sounding during 12:92 and after Sounds off | Silence now goes through the master gain. `masterGate()` (`yusuf.js`) ramps `master.gain` to exactly 0 in 0.15 s whenever `G.quiet` (the 12:92 screen) or Sounds off, and back to 1 after. The master is also created at the right level. It is called on Sounds on and off, when 12:92 opens and closes, and at reset. The wind's LFO still runs under the master, but nothing reaches the output. **Measured, not the flag** (below). |
| 3.1, the same fix in the live games | Musa (`musa.js`, surf with the same LFO pattern) and Nuh (`nuh.js`): there is no LFO, but Sounds off only sent the rain to a 0.0001 floor for 7 s, and chimes already scheduled rang on. Both now have the same `masterGate()` on Sounds on and off. Sound only: no words, art or timing changed. Ibrahim (`ibrahim.js`) is another agent's file and is not touched here. |
| 3.2 MUST: the pause mark ۖ ran into the line above | The scripture lines get their own clearance: `.ayah .quran` and `.page .dua` have `padding-top: .45em` and a taller line height (2.05 / 2), at both sizes. On the phone the ending's dua had also been shrunk to 16 px by `.end .page p` (which outranks `.page .dua`), so it now has its own portrait rule (24 px, line height 2, the same clearance). Checked at both sizes in both languages (crops in `scripture-clearance.png`): the sign clears "He said to them:" / «فقال لهم:», the kicker (including the Name of Allah in "Prophet Yusuf thanked Allah..."), and the line above when the ayah wraps. |
| 3.2, Musa's dua block | Checked in Musa's end screenshots: 20:25-26 has no pause mark, and its marks clear the kicker at both sizes. Musa's phone dua is shrunk by the same `.end .page p` rule (as in Yusuf before the fix). It is readable and has no collision; it is left unchanged here as an approved game (a possible polish later). |
| 3.3 SHOULD: name the bow where its note shows | Your wording, verbatim. `family`: "His whole family came to live in Egypt, and his dream came true: they all bowed to him with respect and love." / «وجاءت أسرته كلها لتعيش في مصر، وتحققت رؤياه: فسجدوا له جميعاً احتراماً ومحبة.» `dreamAll`: "Eleven stars, the sun and the moon, all bowing to him, just as in the dream. His father, Prophet Yaqub, told him it was a special gift from Allah." / «أحد عشر نجماً، ومعها الشمس والقمر، كما في الرؤيا، وكلها تسجد له. وأخبره أبوه النبي يعقوب عليه السلام أنها هبة خاصة من الله.» The pictures do not move. All 128 game strings pass `verify-no-recitation.py --transcripts`. |
| 2a record | `game-yusuf-art.md`: the door is recorded as a pair of leaves with one centre seam and a centred ring (no rail), and the storehouse as rendered with a gabled roof (prompted flat; no finial, steeple or cross). |
| Linking | `story-prophet-yusuf.html`: a "🌾 Play together" / «🌾 لنلعب معاً» `.play-together` link on the final quiz-results card, as on Nuh and Musa: the same class, and the computed min-height, padding, radius and font are identical to Musa's. It is not on the hub. The link opens the game (200), and the game's "Back to the story" returns to `story-prophet-yusuf.html` (200). |

**Measured audio output** (`yusuf-game/fixes/audio-traces.txt`, with raw JSON in `audio-before/` and `audio-after/`).
- **Method:** an AnalyserNode is spliced in wherever a node connects to the AudioContext's destination, so it hears
  exactly what the speakers would. The real game flow runs in headless Chromium. Peak and RMS are in dBFS, read every
  40 ms over each window. "Before" is the code at 059df38, served from a temporary worktree.

| Game, moment | Before (peak / RMS dBFS) | After |
|---|---|---|
| Yusuf, dream, sound on | -36.9 / -49.1 | -36.6 / -49.5 |
| Yusuf, **12:92 on screen** (0.3-4.3 s) | -35.0 / -50.9 | **-inf / -inf** (every sample 0) |
| Yusuf, family after "Carry on" | -47.9 / -60.7 | -47.0 / -60.6 |
| Yusuf, **after Sounds off** (0.3-4.3 s) | -46.7 / -63.7 | **-inf / -inf** |
| Yusuf, Sounds on again | -33.8 / -45.8 | -33.3 / -46.2 |
| Musa, shore, sound on | -22.6 / -43.1 | -23.1 / -42.9 |
| Musa, **after Sounds off** (0.3-4.3 s) | -44.5 / -60.0 | **-inf / -inf** |
| Musa, **still off** (8.3-11.3 s) | -40.5 / -53.6 | **-inf / -inf** |
| Musa, Sounds on again | -30.1 / -43.0 | -31.5 / -42.7 |
| Nuh, flood, sound on (rain) | -38.3 / -50.4 | -38.2 / -50.4 |
| Nuh, **after Sounds off** (0.3-4.3 s) | -40.8 / -58.1 | **-inf / -inf** |
| Nuh, **still off** (4.3-7.3 s) | -59.7 / -75.9 | **-inf / -inf** |
| Nuh, Sounds on again | -inf | -inf |

The last Nuh row is silent both before and after: by then the flood beat had ended and nothing was scheduled to play
(Nuh restarts the rain only during the flood). Every other "on" row shows the sound coming back at its normal level.

**Checks after the fixes:**
- `node --check` on yusuf.js, musa.js and nuh.js.
- Play-throughs EN and AR, tablet and phone, with motion on: all complete, no console errors, no page scroll, no
  request outside localhost, no visible target under 48 px, and focus ends on "Play together again".
- The scripture diff passes (12:92, its meaning, 12:101, its translation and note, and the bow note, byte for byte).
- All six verifiers pass (`verify-chain` included, with the new link).

**Screenshots for the scholar** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/yusuf-game/fixes/`):
- the 12:92 screen: `{tab,phone}-{en,ar}-13-ayah.png`;
- the family beat: `{tab,phone}-{en,ar}-14-family.png`;
- the ending: `{tab,phone}-{en,ar}-20-end.png`;
- the dream with the new `dreamAll`: `{tab,phone}-{en,ar}-03-dream-note.png`;
- overviews: `review-tab.png`, `review-phone.png`, and `scripture-clearance.png` (crops of every scripture block);
- the audio: `audio-traces.txt`.
