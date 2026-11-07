# Game spec: Nuh and the Ark (mockup 01)

File: `UI/mockups/games/01-nuh-ark.html`. Prototype, not linked from the hub. Status: built before scholar and learning-designer sign-off. **Sign-off still needed.**

- **Learning goal:** After playing, the child can say that Nuh kept building the ark patiently and trusted Allah even when people laughed, and that we keep doing good when others mock it.
- **Age band:** 5-8 (the tier toggle makes the animal round longer for 8-11).
- **Tied to:** `UI/story-prophet-nuh.html` (building the ark, a pair of every animal, the flood, the ark resting on Judi (11:44), Nuh's dua).
- **Core loop:** drag a plank onto the ark, then press and hold the hammer to fix it. Letting go never resets progress, so steady effort wins. Mocking words drift by and fade each time the child keeps building.

## One round (about 3-4 min)
1. **Build** (6 planks). After plank 1 the first taunt appears with a choice: "Keep building, trusting Allah" or "Stop, they are laughing". Picking Stop gives a gentle reason and the choice comes back. Taunts after planks 3 and 5 just drift and fade once the next plank is fixed. Each time the work goes on despite the taunts, the ark glows. Nothing is counted.
2. **Parent pause 1:** "Has anyone ever laughed at something good you were doing? What helped you keep going?"
3. **Two by two:** drag animals from the meadow onto the ramp. The first waits on the ramp. A matching second animal takes both into the ark. A mismatched animal wobbles back with "needs a partner of its own kind". Tap the waiting animal to send it back.
4. **Rain:** the sky darkens, the water rises and the ark floats. Tapping the waves makes ripples (a toy with no goal).
5. **Judi:** "After many days, Allah commanded the rain to stop and the water to go down." The child taps the ark (or the "Watch the ark come to rest" button) and watches it settle on Mount Judi. Prophet Nuh thanks Allah.
6. **Parent pause 2:** "Why do you think Nuh trusted Allah, even when there was no sea nearby?"
7. **Ending:** a calm summary, then Nuh's dua copied from the story page, then "Play together again".

## Feedback
- **Success:** a soft chime, sparse sparkles and narration that names what the child did.
- **Failure:** a wobble, a low soft tone and an explanation of why. No lives, no buzzer and no timers.

## Difficulty ramp
Animal pairs are picked at random from 10 kinds each round. The parent tier ("more animals") raises it from 5 pairs to 8.

## EN/AR, RTL and accessibility
- Every string is bilingual. Layout positions use `inset-inline-start`, so the ark and ramp mirror in Arabic. Numerals become Eastern Arabic.
- Keyboard: select the plank or an animal with Enter, then press Enter on the ark or ramp. Hold Enter on the hammer.
- Touch targets are 48px or more. The whole hull is the drop target, because a single row is too small on a phone.
- `prefers-reduced-motion` is respected. A bedtime toggle dims the screen and quietens the chimes. An optional read-aloud uses Web Speech, and the dua is never spoken by it.

## Guardrail checklist
- [x] Nuh is never drawn. He is shown through the ark and the planks. The mockers are only distant tents, lantern-lights and their words.
- [x] The child never controls Nuh. The child builds and loads.
- [x] The dua `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ` and its translation are copied byte-for-byte from the story page by the build script.
- [x] No music. Soft sine chimes only, with a mute toggle.
- [x] **Scholar (approved 2026-11-03):** the taunt lines are invented and mild ("A boat? There is no sea here!"), based on the Quran's account that his people mocked him (Hud 11:38). Are they acceptable to show?
- [x] **Scholar (ruled 2026-11-03):** the dove and olive leaf are Biblical. Removed from the game; the story page still needs the same fix (owner/site-level).

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: remove the Biblical dove and olive leaf | Done. Dove button, CSS and narration deleted. Replaced by 11:44 in the scholar's words: "After many days, Allah commanded the rain to stop and the water to go down... The ark came to rest safely on a mountain called Judi. Prophet Nuh thanked Allah for keeping them safe." (EN and AR, AR is the scholar's text). The child taps the ark to watch it settle; ending art is the ark on Judi. |
| 2 | SHOULD: mockers drawn as human figures | Done. The SVG heads and bodies are replaced by two distant tents with slow lantern-lights (reduced motion: still). The taunts stay as words only. |
| 3 | SHOULD: patience turned into a score (stars, "kept going N times") | Done. `renderStars`, the `#stars` element and the count are removed; the ark glows instead. The ending says "you kept building when people laughed". |
| 4 | NOTE: ending puts the child in Nuh's place; "Prophet Nuh" at first mention | Done. Ending: "You helped build the ark, plank by plank, and you kept building when people laughed... Prophet Nuh was patient and trusted Allah." First line now "Allah told Prophet Nuh" / «النبيَّ نوحاً عليه السلام». |
| 5 | NOTE: taunts approved; child never voices them | Unchanged and compliant: the child only taps them away. |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done in the shared kit (`_src/src/common.js`): the 4-note `done` arpeggio is now a two-note chime (523 + 784 Hz). No Quran or dua audio exists in this game; the dua is text only and never spoken by TTS. |

Site-level item still open (owner): the same dove detail is on `UI/story-prophet-nuh.html:159` and in the plate prompt `UI/scripts/specs/illustrations.py:130`.

## Painted flagship rebuild, 2026-11-04 (owner-approved)

The CSS-shape mockup is kept as `UI/mockups/games/01-nuh-ark-v1.html`. The flagship
`UI/mockups/games/01-nuh-ark.html` (built from `_src/src/01-nuh-ark.html` by `_src/build.py`, with
`nuh/nuh.js` and `nuh/nuh.css`) keeps every gate-1 fix above word for word, and changes the look and
layout only:
- **One full-bleed scene, no page scroll.** A fixed logical world (1240x776 landscape, 690x1303
  portrait) is scaled to cover the screen. The phone has its own portrait painting and layout, with
  the narration ribbon over the sky at the top and the beads at the bottom, so the ground is free
  for play.
- **Painted layers.** Valley plates in three matched states (dry, flood, Judi) crossfade. The ark is
  a bare ribbed frame, and the finished painted hull is revealed row by row as each plank is fixed.
  The plank you carry is cut from that same hull. Timber pile, mallet, ten animals and reeds are
  cut-outs. Rain, the water's moving surface and gold motes are drawn by one PixiJS canvas
  (decoration only; the game runs without it). Frame: gold rule plus girih corners in SVG line.
- **Drag source and target on screen together.** The pile sits beside the ark; the animals stand in
  the meadow around the ark and its ramp. Tap-to-select then tap the target, and the keyboard,
  work the same way.
- **Feedback in the world.** The plank lands with a small squash, the mallet knocks, the hull row
  appears, the ark glows when the work goes on despite the taunts, pairs walk up the ramp and a
  cabin window warms. A mismatched animal wobbles back, with the reason in the ribbon.
- **Gold beads** for progress (no numbers), tactile 64 px buttons with a lip, self-hosted Baloo 2,
  Nunito, Baloo Bhaijaan 2 and Amiri (`UI/vendor/fonts/`).
- **Voice:** Baba's recorded story narration (`audio/prophet-nuh/<lang>/slide-4,5,6.mp3`) plays at
  the build, animals and flood beats (Listen button, and once automatically after the first tap).
  Slide 7 is deliberately not used, because the recording still mentions the dove. Every other line
  is text only. There is no browser TTS at all.
- **Sound:** no music. Wood knocks, soft steps, water laps and rain are filtered noise; the chimes
  are one or two bell tones (two-note "done" 523 + 784 Hz).
- **Reward moment:** the scene dims, a lamp glow rises at the ark on Judi, a gold shamsa draws
  itself in the open sky (no concentric centre, so nothing reads as an eye), a few slow motes rise,
  a two-note chime, then a still frame with the ending page on the start side. The dua is set large
  in Amiri in a cobalt-ruled cartouche.
- **Bedtime mode** is a night palette with the lanterns brighter, softer sound, no motes and still
  rain. **Reduced motion** shows rest poses, with no idle loops and the rain drawn once and still.
- **EN/AR:** the whole painted world mirrors in Arabic (light from the top-start corner), the HUD
  mirrors, and the taunt bubbles are counter-mirrored so their text reads correctly.

Engine choice: `claudeteam/reviews/game-engine-choice-2026-11-04.md`. Art list, prompts and seeds:
`claudeteam/reviews/game-nuh-art.md` and `UI/scripts/specs/games/nuh.py`.

### Scholar gates
- Gate 1 (spec): approved with fixes 2026-11-03; fixes applied 2026-11-04 (table above), awaiting
  the scholar's confirmation.
- Art gate: prompts reviewed (pending, scholar 2a); contact sheet reviewed (pending, scholar 2b,
  `claudeteam/reviews/game-nuh-contact-sheet.png`). Self-check by `kids-game-designer` done for
  both; see `game-nuh-art.md`.
- Gate 3 (build): pending. Not linked from the hub.

## Scholar gates 2-3 (2026-11-04)

Reviewer: `islamic-content-scholar`. Method: every shipped file in `UI/images/games/nuh/` read at
full size on a light and a dark ground, with 4-8x zooms of every suspect detail; all 56 build
screenshots (tablet and phone, EN and AR) sampled at every stage; `nuh.js` read in full; the dua
diffed in bytes against the story page and against `api.alquran.cloud` 71:28 (`quran-simple`).

### Gate 1 (spec): CONFIRMED, CLOSED
All six fixes in the table above are present in the flagship build:
- No dove, olive leaf or rainbow anywhere. The only `dove` hits are comments, `01-nuh-ark.html:8` and `nuh.js:110`.
- 11:44 is in my wording: `nuh.js:100` (`command`) and `nuh.js:102` (`rest`), EN and AR.
- The mockers are two painted tents and two lantern spans (`01-nuh-ark.html:37-38`). No figure.
- Nothing counts patience. The beads show plank and pair progress only (`nuh.js:226-230`).
- Ending wording: `nuh.js:105-106`.
- "Prophet Nuh" / «النبيَّ نوحاً عليه السلام» at first mention: `nuh.js:76`.
- The child only taps taunts away and never voices them (`nuh.js:368-372`).
- `done` is a two-note chime (`nuh.js:139`, `_src/src/common.js:68`).

### Gate 2a (prompts): PASS
Source: `UI/scripts/specs/games/nuh.py`; record: `game-nuh-art.md`. Checked against 3a:
- **3a.1:** things only. No being with agency is prompted.
- **3a.2:** light is plain light.
- **3a.3:** STYLE and NEGATIVE are imported unchanged, plus the game list (`nuh.py:32-39`).
- **3a.4:** the Nuh bans are in the negative and repeated in both edit prompts.
- **3a.5:** no text, Ka'bah or mushaf is prompted.
- **3a.6:** the tents are plain.
- **3a.7:** seeds and rerolls are recorded with reasons.
- Extra precautions accepted: "no mast" plus "mast, sail, yardarm, rigging" in the negative; the flood
  edit's "nothing is left floating"; the reroll of the floating-tents flood plate.
- NOTE: `GAME_NEGATIVE` (`nuh.py:32-38`) omits "bikini, bare shoulders" from the 3a.3 list. This is
  harmless here, because no person is prompted. Add it before the list is copied to another game.

### Gate 2b (contact sheet and every shipped image): PASS WITH FIXES
| # | Asset | Finding | Severity | Required fix |
|---|---|---|---|---|
| 1 | `animal-goat.webp` | Both front knees carry a glossy black round orb with a white catch-light. They read as eyes on the legs (3b.9 anatomy that looks wrong; 3b.2 eye shapes). Visible at play size on the tablet. | **MUST (reject)** | Regenerate with a new seed (`goat-r2`). Consider "plain brown and white goat, no saddle cloth". Do not retouch. |
| 2 | `plate-judi-land.webp` | The flagged stipple is at about x 1208-1233, y 51-77: a dotted blob about 25 px across, plus two specks above it. At 8x with contrast boosted it has no strokes, no baseline and no letter shapes, so it is **not script** and does not fail 3b.4. It is residue of the engine's corner mark. | SHOULD | Fill it with the surrounding flat sky gradient and record that in `game-nuh-art.md`. This is clean-up of empty sky, not retouching of content, so 3a.7 allows it. A regeneration is not required. |
| 3 | `plate-judi-port.webp` | A large round green ball sits on the main peak, directly above the resting ark, with the sunrise behind it (`phone-*-10-judi.png`). It is the focal point of the phone's climax. It can read as a green dome or a glowing orb in the sky, and the designer already lists it as a shortfall. It has no finial, building or crescent, so it is not a 3b.5 failure. | SHOULD | Regenerate the portrait Judi edit so that the peak keeps the dry plate's green cap (as `plate-judi-land` does). |
| 4 | `animal-giraffe.webp` | One almond-shaped motif with an inner almond on the neck. It is about 15 px in play. It is not a nazar bead and reads as paisley. | NOTE | Accept. |

Everything else is clean:
- `plate-dry-land`: tents empty, lanterns are lanterns.
- `plate-dry-port`: the dark dots on the dunes are shrub tufts at 8x. The lantern is a lamp on a stake with no crossbar.
- `plate-flood-land`, `plate-flood-port`: no tents, no floating objects, no bodies or forms in the water.
- `ark-whole`: no mast or yard. The cabin windows are open squares with no cross mullions.
- `ark-frame`, `plank`, `timber-pile`, `mallet`, `reeds`: plain geometric inlay, no glyphs.
- `camel`, `cow`, `elephant`, `lion`, `rabbit`, `sheep`, `tortoise`, `hoopoe`: no rider, no glyphs on
  the saddle cloths, no cross or emblem (the cow's star and the sheep's quatrefoil are Ottoman
  ornament), anatomy correct.
- Mirrored AR (`tab-ar-*`, `phone-ar-*`): no new cross or letter forms appear.

**Designer question 1, the hoopoe: ACCEPTABLE, keep it.**
- 11:40 is "a pair of every kind", so any ordinary bird qualifies.
- The hoopoe's role in Sulayman's story (27:20-28) does not make it a sacred symbol. Showing it
  here as one of the pairs, with no role, implies nothing false.
- A sparrow would be equally fine, but there is no need to change.
- Conditions:
  - the hoopoe never flies off to look for land, and never brings anything back (that would recreate the dove beat);
  - it never speaks;
  - it is never singled out from the other animals.

**Designer question 2, mirroring the painted world in Arabic: ACCEPTABLE.**
- Nothing in the plates or sprites has writing, a direction with religious meaning (no qibla, no
  Ka'bah) or an asymmetric emblem.
- The mirrored screenshots show no new cross or letter forms.
- The taunt bubbles are counter-mirrored, so they read correctly.
- Keep this rule for later games: never mirror an image that contains text or a sacred place.

### Gate 3 (build): PASS WITH FIXES
Verified:
- **The dua.** `01-nuh-ark.html:126` `رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ` is byte-identical to
  `story-prophet-nuh.html:177`. It matches the opening of 71:28 after NFC normalisation; the only
  byte difference is the canonical order of shadda and haraka, which is the same text.
- **Text around the dua.** The translation and the kicker are byte-identical to `story-prophet-nuh.html:178-179`.
- **Reading aloud.** The dua is never spoken: there is no TTS at all, and the clips are story slides 4-6 only.
- **Narration, EN and AR** (`nuh.js:70-108`): sound and calm.
  - "Allah told Prophet Nuh" and "Allah commanded" name Allah as the actor.
  - The settling is watched, not caused by the child.
  - "Water covered the earth" (`:99`) matches the story page (scene 6) and the majority classical reading. Acceptable.
- **Taunts:** the three approved lines, tapped away only.
- **Flood framing:**
  - no bodies and no drowning shown;
  - the tents are simply gone under calm water;
  - the mockers are not mentioned again, which is the right deferral for ages 5-8;
  - tapping the waves gives a soft ripple and a water-lap sound, with no triumph chime.
- **Reward wording:** "Safe, by Allah's mercy" / «في أمان، برحمة الله» (`01-nuh-ark.html:122`) is
  faithful to 11:43 «إِلَّا مَن رَّحِمَ». Approved.
- **Sound** (`nuh.js:123-163`):
  - wood knocks, steps, water laps and rain are filtered noise;
  - the bells are single tones or two-note chimes (`good` 659/988, `done` 523/784). The three partials inside `bell()` are timbre, not a melody;
  - no music;
  - the volume ducks under Baba's clip.

| # | Where | Finding | Severity | Required fix |
|---|---|---|---|---|
| 1 | `nuh.js:545`, `nuh.css:223-226`; `tab-en-12-reward.png`, `tab-ar-12-reward.png` | The shamsa is line work with an open, transparent centre. On the landscape Judi plate a thin painted cloud band runs through its centre, and together they form a horizontal almond with a star in it: an eye in the sky (3b.2). The SVG is fine in itself; the composite is not. | SHOULD (before linking) | Give the shamsa a solid ivory or parchment disc behind the gold lines (for example a `<circle r="92">` with a fill), so that no sky shows through. It then reads as an illuminated medallion, not a sun or an eye. Re-check it in both directions. |
| 2 | `nuh.js:92-93`; `phone-ar-7-mismatch.png` shows «هذا البقرة يحتاج إلى شريك من نوعه ... الذي» | The Arabic templates assume masculine nouns. For بقرة, زرافة and سلحفاة the result is ungrammatical («هذا البقرة يحتاج», «زرافة آخر»). This is a language error, not a religious one, but the site teaches Arabic. | SHOULD | Add `f: true` to those three `KINDS` and branch the Arabic: «هذه البقرة تحتاج إلى شريك من نوعها. من يطابق ...» and «ابحث عن شريكها: بقرة أخرى». Also choose «الذي/التي» by the gender of the waiting animal. |
| 3 | `nuh.js:110` | The comment "Slide 7 is not used: it still has the dove" is now stale. Slide 7 carries the 11:44 text in `voice-scripts-data.json` and at `story-prophet-nuh.html:159`, and `audio/prophet-nuh/*/slide-7.mp3` were re-recorded (uncommitted). | NOTE | Optional: play slide 7 at the Judi beat, but only after the Whisper QA transcript confirms that the new recording has no dove and matches the text. Otherwise just correct the comment. |

### Story plate `UI/images/stories/prophet-nuh/scene-6.webp`: NOT a must-fix
- At 3x the mast has **no yard**. It is a bare pole with a small collar band and diagonal shrouds
  running to the gunwales, which makes an A-frame or tent shape, not a cross. So 3b.3 is not triggered.
- It is inconsistent with the game's no-mast ark. That is a style matter: regenerate it at the next
  Nuh plate pass (prompt `illustrations.py` scene 6: add "no mast", and keep the negative's
  "mast, sail, yardarm, rigging").
- The lightning and the empty open boat are within the age band.

### Sign-off
`Art gate: prompts reviewed 2026-11-04 (scholar); contact sheet reviewed 2026-11-04 (scholar) - 21 of
22 shipped images approved, 1 rejected to regenerate (animal-goat, eye-like knees); 2 plate
should-fixes (plate-judi-land stipple fill, plate-judi-port green orb).`

The game may be linked from the hub when:
- gate 2b MUST 1 (goat) is done;
- gate 3 SHOULD 1 (the shamsa fill) is done;
- the regenerated goat has been re-checked by the scholar. The scholar can sign that off without a full re-review.

The other SHOULDs should land before release, but they do not block linking.

### Fixes applied after scholar gates 2-3 (kids-game-designer, 2026-11-04)
| Ruling | Done |
|---|---|
| 2b MUST 1: goat, eye-like knee orbs; regenerate with a new seed, no retouch | Regenerated: r2 and r3 rejected at full size before cut-out (dark knee patches); r4 "pure white goat, clean white legs" (seed 887926) shipped; r5 and r6 rejected (darker knee marks). The model draws knee calluses on every goat; r4 keeps only two faint soft brown smudges (no black, gloss or catch-light). **Scholar re-check requested.** Fallback: swap the kind for a deer or a horse. |
| 2b SHOULD 2: `plate-judi-land` stipple | Filled with the surrounding plain sky in the export step (`SKY_FILL`, box x 1185-1240, y 14-84). Recorded in `game-nuh-art.md`. |
| 2b SHOULD 3: `plate-judi-port` green ball | Regenerated from the portrait dry master with the edit model (r3, seed 720525): the peak keeps the dry plate's green cap, nothing above it. The ark rests on the island in the water, as before. |
| 2a NOTE: negative list | `bikini, bare shoulders` added to `GAME_NEGATIVE`. |
| Gate 3 SHOULD 1: shamsa reads as an eye with the sky through it | The shamsa now has a solid ivory disc (`circle.disc`, ivory fill, gold rim) behind the gold lines, so no sky shows through; it reads as an illuminated medallion. Checked in EN and AR (`tab-*-12-reward.png`). **Scholar re-check requested.** |
| Gate 3 SHOULD 2: Arabic gender | `f: true` on بقرة, زرافة, سلحفاة. Feminine lines: «هذه البقرة تحتاج إلى شريك من نوعها»، «ابحث عن شريكها: بقرة أخرى»، «البقرة التي عند المنحدر»، «عادت إلى المرج». All ten animals' lines were printed and checked in AR. |
| Gate 3 NOTE: slide 7 | The re-recorded `audio/prophet-nuh/{en,ar}/slide-7.mp3` are byte-identical to the staged files whose Whisper QA passed (EN WER 0.06, heard "...a mountain called Judy" (ASR spelling); AR WER 0.0, exact). Neither has the dove. Slide 7 now plays at the Judi beat; the stale comment is corrected. |
| Hoopoe conditions | Checked in `nuh.js`: the hoopoe is only an entry in `KINDS` (`h`, names). It shares the generic animal code with the other nine: it never flies, never leaves to look for land, never brings anything back, has no lines and no sound of its own, and is never singled out (random placement, size-sorted with the others, boards by the same ramp walk). |

## Scholar re-check and final verdict (2026-11-04)

Reviewer: `islamic-content-scholar`. I re-checked the items in "Fixes applied after scholar gates 2-3".

| Item | Evidence checked | Result |
|---|---|---|
| 2b MUST 1: `animal-goat.webp` (r4, seed 887926) | The sprite at 2x on a light ground; `goat-r4-knees-4x.png`; contact sheet (light and dark) | **CLEARED.** The knee marks are soft brown, diffuse smudges, with no dark pupil, no gloss and no catch-light. They read as the natural carpal calluses a real goat has, not as eyes. Anatomy is otherwise correct: four legs, one head, calm face. No swap to a deer or a horse is needed. |
| 2b SHOULD 2: `plate-judi-land.webp` stipple | The same crop at 8x with contrast boosted, before and after | **CLEARED.** The blob at x 1208-1233, y 51-77 is gone and the sky gradient is continuous. Two flecks of 2-3 px remain at the very top edge (x about 1140-1160, y about 10). They are outside the fill box, under the HUD and not text-like. Accept them. |
| 2b SHOULD 3: `plate-judi-port.webp` | Full plate and contact sheet; `phone-en-12-reward.png`, `phone-ar-12-reward.png` | **CLEARED.** The peak keeps the dry plate's green cap, with nothing above it. The ark rests on the green island below. No orb and no dome. |
| 2a NOTE: negative list | `nuh.py` | Done. |
| Gate 3 SHOULD 1: shamsa | `01-nuh-ark.html:118` `<circle class="disc" r="94"/>`; `nuh.css:227-231`; `tab-en-12-reward.png`, `tab-ar-12-reward.png`, `phone-en-12-reward.png`, `phone-ar-12-reward.png` | **CLEARED.** It is now a solid ivory roundel with a gold rim, and no sky shows through. It reads as an illuminated medallion in all four views, not as a sun or an eye. |
| Gate 3 SHOULD 2: Arabic gender | `nuh.js:93-99`; `tab-ar-7-mismatch-feminine-ribbon.png` shows «هذه البقرة تحتاج إلى شريك من نوعها. من يطابق الزرافة التي عند المنحدر؟» | **CLEARED.** The agreement is correct in the demonstrative, the verb, the pronoun, the relative pronoun, «أخرى» and «عادت». |
| Gate 3 NOTE: slide 7 at Judi | `nuh.js:117` `judi: 7`; designer's Whisper QA (EN WER 0.06, AR WER 0.0), and the script text in `voice-scripts-data.json` is the 11:44 wording | Accepted. It is Baba's narration of the meaning, not Quran recitation. |
| Hoopoe conditions | `nuh.js` `KINDS` and the generic animal code | Met. |
| Contact sheet | `claudeteam/reviews/game-nuh-contact-sheet.png` (updated) | All 22 images are clean on both grounds. |

**Final verdicts**
- Gate 1: CLOSED.
- Gate 2a: PASS.
- Gate 2b: **PASS.**
- Gate 3: **PASS.**

Sign-off line: `Art gate: prompts reviewed 2026-11-04 (scholar); contact sheet reviewed 2026-11-04
(scholar) - 22 sprites approved, 1 rejected and regenerated after review (animal-goat, r4), 2 plates
corrected (plate-judi-land sky fill, plate-judi-port regenerated).`

**Linking: APPROVED.** `UI/mockups/games/01-nuh-ark.html` may be linked from the hub as it stands.

Conditions that carry forward:
- Any new or changed image comes back to the scholar before it ships.
- Any change to narration text, the dua or the sounds comes back to the scholar before it ships.
- The story plate `prophet-nuh/scene-6` mast is a style item for the next plate pass, not a blocker.

## Atmos fix (2026-11)
`kids-game-designer`, 2026-11-06, applying the scholar's GO (game-musa-sea.md, "Proposed Nuh fix": GO only with
a stacking change).

**The bug:** `games/nuh/nuh.css` never positioned `#atmos`, so the PixiJS canvas was static and painted under
the plates. The rain, splash rings, water shimmer and gold motes approved in the design were invisible. Checked
with `elementsFromPoint`: the plates were stacked above `atmos`.

**The change (option 3 of the ruling: switch the Judi water line only after the ark has risen past it):**
- `nuh.css`: `#atmos{position:absolute;left:0;top:0;pointer-events:none}`.
- `nuh.js` `settle()`: the flood water layer now fades out at its own line, below the floating hull
  (`Atmos.water('flood', false)`). The Judi water layer and its higher line are set only after the 4.2 s rise,
  once the ark rests on Judi (`Atmos.water('judi', true)` after `anim(4300)`). Before this, the mask jumped to
  `judiWaterY` at once while the ark was still low, which made the ark look submerged.
- The canvas stays after the ark in the page, so the rain falls in front of the ark and the motes show over it.
  During the flood the water copy covers only the hull below the designed waterline, as designed ("the hull
  sits in the water, not on it").

**Frames for the scholar's re-check:** real play-throughs (keyboard build and boarding, sound off), tablet
1180x820 and phone 390x844, EN and AR, in `/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/nuh-atmos/`:
- **Flood:** `{tab,phone}-{en,ar}-flood-2.5s.png`, `-flood-5.0s.png`, `-flood-8.0s.png`, `-flood-afloat.png`.
- **Settle, every 0.5 s from the press:** `{tab,phone}-{en,ar}-settle-0.0s.png` to `-settle-6.0s.png` (13 frames per view).
- **Reward:** `{tab,phone}-{en,ar}-reward.png`; the ending `{tab,phone}-{en,ar}-end.png`.
- Overview strips: `review-tab.png`, `review-phone.png`, `tab-en-settle-grid.png`, `phone-ar-grid.png`.

In every settle frame the ark is on or above the water: it rises out of the fading flood water and comes to rest
on Judi above the new water line. No console errors in any run. The scholar re-checks only these frames.
