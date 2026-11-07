# Game spec: The Path Through the Sea (mockup 03)

File: `UI/mockups/games/03-musa-sea.html`. Prototype with placeholder art. Logic and rendering are separate, and assets sit in the `ART` block. **Sign-off still needed.**

- **Learning goal:** After playing, the child can say that when the believers were trapped and afraid, Musa trusted that Allah was with him, and that we can answer fear with "Allah is with us".
- **Age band:** 5-9.
- **Tied to:** `UI/story-prophet-musa.html` (Trapped at the Sea, The Sea Splits Open, Musa's dua).
- **Core loop:** carry a lantern and walk with the believers, step by step, along the dry path Allah opened (drag it, or press "Step forward"). At moments of fear, the child picks the trusting answer, and the lantern glows warmer. Nothing is counted.

## One round (about 3 min)
1. **At the shore:** the quote "They have caught us!" is shown. The child picks "Allah is with us, He will guide us" or "Run back". Run back gets a reason and a re-choice. Musa's words "No! My Lord is with me, and He will guide me." are then shown.
2. **Indirect speech only:** "Allah told Musa to strike the sea with his staff." The child presses "Hear what happened" and the narration says "Musa obeyed Allah and struck the sea with his staff, and by Allah's command the sea split...". The child never controls Musa or the staff.
3. **The path** has 8 steps (11 on the parent tier). The people follow as a row of dots.
   - Step 3, fear moment: the walls are so tall. "Walk on calmly" or "push and run".
   - Step 6, fear moment: the sound of chariots. "Keep going forward" or "turn back".
   - Tier only, step 9: a tired child. "Help them along" or "hurry ahead".
   - A fearful pick dims the lantern for a moment, explains why, and offers the choice again.
4. **Safe shore:** the waters return. The army is not shown.
5. **Parent pause:** "When have you felt scared? What can you say to remember that Allah is with you?"
6. **Ending:** Musa's dua with its translation and note, all copied from the story page, then "Play together again".

## EN/AR, RTL and accessibility
- The track is a flex row, so it mirrors in Arabic.
- Fully keyboard playable through the Step button and the choices. Targets are 48px or more.
- Quotations sit in panels and are never read by the Web Speech read-aloud.

## Guardrail checklist
- [x] No depiction of Musa, Harun or Pharaoh. People appear as dots only.
- [x] Every quotation and the dua are copied byte-for-byte from `story-prophet-musa.html` by the build script.
- [x] The parting of the sea is presented as Allah's act, not a child-triggered trick.
- [ ] **Scholar:** the quotations are the story page's paraphrases, and the Arabic is unvowelled text from the page (26:61-63). Is this fine to show as quotes?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: name Allah as the one who parted the sea; the child's press is not the trigger | Done. `L.parted`: "Musa obeyed Allah and struck the sea with his staff, and by Allah's command the sea split into two mighty walls..." (AR: «فانشق البحر بأمر الله»). The button now reads "Hear what happened" and only starts the narration (allowed by the section 5 ruling). Its cue is a single soft tone, not the old celebratory chime. |
| 2 | SHOULD: the child "leads the people" | Done. "Carry a lantern and walk with the believers, following the path Allah opened"; `onward`: "We walk on together, along the path Allah opened." Hub card blurb in `index.html` updated too. |
| 3 | SHOULD: trust as a score ("Trust lights: 🏮🏮") | Done. `#meter` and `L.meter` removed; the lantern's glow still warms (no number). |
| 4 | SHOULD: misquote of Musa ("Allah is with us") | Done. "Yes! Musa said: 'My Lord is with me, He will guide me.'" AR gives the meaning in reported speech («قال موسى إن ربه معه وسيهديه») so the read-aloud never voices near-Quranic wording. |
| 5 | SHOULD (section 5): Allah's words not as a quoted paraphrase | Done. The "Allah said: «اضرب بعصاك البحر»" panel is now indirect speech; `MUSA_STRIKE` removed from `build.py`. The people's and Musa's paraphrased quotes stay in plain (non-scripture) panels, as approved. |
| 6 | NOTE: drowning not shown | Unchanged. Arrival cue is a single soft tone so nothing sounds like triumph over the waters closing. |
| 7 | Adab: "Prophet Musa" at first mention | Done (EN and AR, with عليه السلام). |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done via the shared kit. The dua is text only. |

Site-level item still open (owner): `story-prophet-musa.html:208` has the same quoted paraphrase of Allah's words.

## Painted build, 2026-11-06 (`kids-game-designer`)
The second painted game, built to the Nuh flagship's standard: `UI/games/musa-sea.html` (source
`UI/mockups/games/_src/src/03-musa-sea-painted.html`, built by `_src/build.py`, which copies the dua, its
meaning line and both quotations from `story-prophet-musa.html`), `UI/games/musa/musa.js`, `musa.css`, art in
`UI/images/games/musa/`. The CSS-shape mockup `UI/mockups/games/03-musa-sea.html` is kept as it was.
**Not linked** from the story or the hub: gates 2 (art) and 3 (build) are open.

**One round, as built.** All wording above is kept; new lines are marked (new).
1. **The camp at night** (new beat): a painted night shore, the believers' tents and a bundle, and nine
   lantern-lights (the believers; never figures). The child drags the lantern (or taps the glowing spot, or
   presses Enter on the lantern) down to the water's edge. Baba's slide-10 narration plays up to the cry.
2. **At the sea:** a far, soft rumble from behind the viewer (the army is never drawn). The people's cry
   panel, then the choice (trust / run back; order shuffled). Run back: the lantern dims, the reason, choose
   again. Trust: Musa's reply panel (EN: the page's quotation; AR: the page's reported speech), and the rest of
   slide 10.
3. **Allah's command:** indirect speech, then "Hear what happened". The press starts the narration only; as
   Baba's slide-11 narration reaches "by Allah's command", the split plate opens from the middle outwards.
4. **The path:** 8 steps (11 on the parent tier). Tap the next glowing step, drag the lantern to it, or press
   "Step forward". The lights follow behind (the child walks *with* them, at the side of the path), soft
   footprints appear in the sand, and gold beads show the way so far. The fear moments at steps 3, 6 (and 9 on
   the tier) are the approved ones; a trusting answer warms the lantern's glow (never counted). At about
   half way the sky turns to dawn (the Qwen dawn plate). Tapping a wall of water shows a ripple and a fish
   passing, with (new) "The walls of water stand still by Allah's command, and the path stays dry."
5. **Safe:** the lights gather on the far shore; the approved safe line, Baba's "The believers walked safely
   across." (the end of slide 11, about the army, is not played), one soft tone, and the sea closes in a slow
   crossfade to a calm, empty dawn sea. No army, no bodies, no impact, no triumph sound.
6. **Parent pause**, then the reward (lamp glow, the shamsa approved on Nuh, a two-note chime), the ending
   with Musa's dua from the story page, "Play together again", "Back to the story", and the tier box.

New strings for the scholar's gate 3 (EN and AR in `musa.js` `W`): `camp`, `selLantern`, `missShore`,
`shore` (the old intro, split in two), `walkIn`, `selStep`, `dawn`, `wall`, the `yes` line of each fear
moment, `hearBtn` ("Hear what happened"), `stepBtn`.

**Verification (2026-11-06, designer):** `node --check`; headless play-throughs EN and AR at 1180x820 and
390x844 (drag, tap and button; the wrong choice first at every fear moment), keyboard-only runs (tablet EN,
phone AR: 2 Tabs to the lantern, Enter to the end, focus lands on "Play together again"), the parent tier
(11 steps, three fear moments), bedtime and reduced motion: no console errors, no page scroll, no request
outside localhost. Scripture diff: the dua, its meaning line, its note and both quotations match
`story-prophet-musa.html` byte for byte; all 105 game strings pass `verify-no-recitation.py`. Clip parts
used: slide 10 (0-16.45 s EN / 0-17.05 s AR, then the rest), slide 11 (0-12.6 / 0-10.8 s and
13.0-15.5 / 10.85-12.6 s), cut at recorded pauses; slide 13 (the dua) is never used.

**Gates:** 1 closed on the mockup wording (the new lines above still need the scholar's eye in gate 3).
2a and 2b: **pending** (`claudeteam/reviews/game-musa-art.md`, contact sheet
`claudeteam/reviews/game-musa-contact-sheet.png`). 3: **pending**. Not linked from the story or the hub.

## Scholar gates 2-3 (2026-11)
`islamic-content-scholar`, 2026-11-06, on `main` at 78bbb25. I did not edit any game file. I read every image at
full size, and every stage screenshot (tablet and phone, EN and AR) in the designer's scratchpad `musa-game/`. I
also re-ran these checks myself:
- the dua against `api.alquran.cloud/v1/surah/20/quran-simple`, codepoint-diffed;
- the quotations and the dua note against `story-prophet-musa.html`;
- `verify-no-recitation.py` on the site, and with `--transcripts` on all 96 game strings plus the slide 10 and 11
  scripts;
- `ffmpeg silencedetect` on `audio/prophet-musa/{en,ar}/slide-{10,11}.mp3`, to check the clip cuts.

**Linking verdict: Musa may be linked from the end of the Musa story once item 3.1 (MUST) and the 2a record fix
are done.** Items 3.2 and 3.3 are cheap and should land in the same change. They do not need another scholar
gate: the designer attaches walk, parting and safe screenshots (tablet and phone, EN and AR) here, and I confirm
them on sight.

### Gate 1: CONFIRMED (closed)
Every gate-1 ruling holds in the build:
- **The parting is Allah's act.** `W.parted` names Him ("by Allah's command the sea split",
  «فانشق البحر بأمر الله»). `hear()` (`musa.js:459-471`) only starts the narration and the timed plate
  change. Slide 11 also opens with "Allah told Musa to strike the sea with his staff" before any opening.
- **Allah's words are indirect only.** `W.strike` is indirect speech. No line quotes Allah.
- **The quotations are the page's own wording.** The quotations and the dua note are byte-identical to
  `story-prophet-musa.html:202` and the dua block.
- **The dua matches the Quran.** It matches 20:25-26 word for word without «قَالَ». The only codepoint
  difference from the API is the order of shadda and kasra, which is canonically equivalent.
- **No counted trust.** The beads count path steps, not trust.
- **Prophet Musa at first mention**, with عليه السلام in AR, in `W.camp`.
- **Musa is never shown.** Neither are his staff, the army or any figure.
- **No drowning.** There are no bodies and no triumph sound. Arrival plays one `sfx('soft')`
  (`musa.js:506`) and a 5 s crossfade to an empty calm sea. The two-note reward chime comes only after the
  parent pause, so it marks the walk, not the closing waters.
- **The narration parts are clean.** I re-checked them: 0 flagged, and the site reports "NO RECITATION".
  - The cuts fall inside recorded pauses: EN slide 10 at 16.45 s (pause 16.25-16.56) and AR at 17.05 s (pause
    16.77-17.27).
  - The `safe` part stops before the army sentence: EN at 15.5 s, before "When Pharaoh's army" (which starts at
    15.68 s), and AR at 12.6 s, before «وعندما» (13.04 s).
  - `CLIPS` references slides 10 and 11 only, so slide 13 (the dua) is never played.

The one place the build falls short of a gate-1 ruling is how ruling 2 ("walks with, never leads") is shown on
screen. That is item 3.1 below.

### Gate 2a (prompts): PASS WITH FIXES
- `STYLE` and `NEGATIVE` are imported unchanged. `GAME_NEGATIVE` holds the full 3a.3 list plus the Musa bans
  (chariot, wheel, horse, soldier, army, rider, staff, rod, hand, bodies, drowning, wreckage, moon and crescent).
- Every subject is a thing: no prophet, person, crowd, army, staff or "divine" light. Light is written as plain
  dawn light.
- Rerolls are new seeds, not retouches.
- **Fix (record only, 3a.7):** the `plate-dawn-port` entry in `game-musa-art.md:88-92` gives the **rejected**
  r1 seed (1409269) and the r1 prompt. The shipped asset is r2: seed **63901**, and the prompt ends with "The
  pale dry sand path stays exactly as it is ... no part of the path turns into water or light." (`musa.py:175-177`;
  `items()` gives 63901). Correct that entry.
- The stale docstring at `musa.py:10` still lists "a jar ... a palm". This is cosmetic; fix it with the above.

### Gate 2b (images): PASS
All 14 images are approved (8 plates, 6 sprites). The designer rejected 9 renders before review, and I reject
none further. I checked each against 3b.1-10:
- No face or figure. The fish have plain animal faces.
- No eye, hand or halo, and no glyphs or pseudo-script. The bundle's diamonds and the fish scales are ornament.
- No cross: I checked the bundle, the tent, the lantern cap and the mirrored AR scenes.
- No Ka'bah, mosque or book.
- Nothing floats in either calm plate, and both beaches are empty.

Rulings on the designer's questions:
1. **The dawn sun or glow at the end of the path: acceptable.** 26:60 «فَأَتْبَعُوهُم مُّشْرِقِينَ» puts the
   pursuit at sunrise. The disc has no face and no rays. The narration names it only as "the first light of
   morning" / «أول ضوء الصباح», and never connects it to Allah. Keep it that way: no line may call the light
   guidance from Allah, Allah's light, or the like.
2. **Fish in the walls: acceptable** as unnarrated decoration. The story plate scene-10 already paints them. Do
   not narrate them as a fact.
3. **The T in the portrait path: not a cross.** The stem never rises above the bar. I checked it at thumbnail
   and at 100% (`plate-split-port`, `plate-dawn-port`), and in context in `phone-*-7-fear1` and `phone-*-8-mid`.
   In the dawn plate, the glow above the bar is a round, diffuse sunrise, not an upper arm. Approved. Do not
   add any vertical element above the far shore in a later regeneration.
4. **Mirroring: approved.** The mirrored AR scenes create no cross and no letter.

Art gate: prompts reviewed 2026-11-06 (scholar); contact sheet reviewed 2026-11-06 (scholar) - 14 images
approved, 0 rejected at review (9 rejected and regenerated or dropped before review).

### Gate 3 (build): PASS WITH FIXES
**3.1 MUST: on screen, the child leads the believers.**
- In the walk, every one of the nine lights trails behind the child's lantern. `placeTrail()` (`musa.js:281`)
  sets `back = (i + 1) * gap`, and `lanternAt()` (`:236`) puts the lantern at the head of the line.
- The result is a procession with the child at the front: see `tab-en-7-fear2.png`, `tab-en-8-mid.png` and
  `phone-ar-7-fear1.png`. This is what gate-1 ruling 2 removed from the words ("walk with, never lead").
- **Fix:** put part of the group ahead of the lantern, for example 3-4 lights ahead and the rest behind, so the
  child walks among the believers. The lights ahead also stand for those Musa led, without drawing him. Keep
  the next glowing step clear: the lights ahead can walk on the far side of the path. The far-shore gathering
  is already correct.

**3.2 SHOULD: sync the opening to "by Allah's command".**
- The split plate starts opening at a fixed 3.6 s (`musa.js:464`). In EN slide 11 that falls during "Musa
  struck the water". The words "and by Allah's command" start at 5.77 s (pause 5.35-5.77).
- In AR, «فانشق البحر كله بأمر الله» starts at 4.45 s (pause 4.20-4.45).
- This is sound as it stands, because the ribbon already names Allah and the strike-then-split order is the
  Quran's own (فَانفَلَقَ). But it is not what the gate-1 resolution claims.
- **Fix:** start the split from the clip's `currentTime` (EN 5.8 s, AR 4.45 s). Keep the timer as the fallback
  when the sound is off or the clip fails.

**3.3 SHOULD: the sea opens out of the child's lantern.**
- At the parting, the lantern stands at the centre of the opening strip (`tab-en-5-parting.png`,
  `phone-ar-5-parting.png`). The camp beat also has the child place it on "the glowing spot by the water",
  exactly where the sea later opens.
- A child can read this as "my lantern opened the sea" (guardrail: a miracle is never the child's power).
- **Fix:** when the choice at the shore is made, before "Hear what happened", move the lantern back onto the
  beach among the lights, so the opening starts on open water away from the child.

**New lines: all approved as written, EN and AR.** `camp`, `selLantern`, `missShore`, `shore`, `walkIn`,
`selStep`, `dawn`, `wall`, `hearBtn`, `stepBtn`, and the three `yes` lines.
- `camp` ("Allah told Prophet Musa to lead the believers out of Egypt at night") is faithful to 26:52
  «أَنْ أَسْرِ بِعِبَادِي».
- `wall` ("The walls of water stand still by Allah's command, and the path stays dry") is faithful to 26:63
  «كَالطَّوْدِ الْعَظِيمِ» and 20:77 «طَرِيقًا فِي الْبَحْرِ يَبَسًا», and names the agent.
- `dawn` fits 26:60.
- The `yes` lines praise the choice, not a score, and the "lantern shines warmer" is light, not a count.
- The AR grammar is sound throughout.
- I re-ran the no-recitation check on all of these strings: none flagged.

### Proposed Nuh fix (`#atmos{position:absolute;left:0;top:0;pointer-events:none}` in `nuh/nuh.css`): NO-GO as the bare line; GO with one stacking change
The content it reveals was approved in the design: rain, splash rings, the water shimmer, and gold motes at
each row, at "built" and at the reward. It needs no fresh scholar review as content.

But the line does more than reveal them:
- `<canvas id="atmos">` comes after `#ark`, `#herd` and `#taunts` in `nuh-ark.html:60`. Once positioned, it
  paints its water layer (a copy of the plate below a mask line) **over the ark**.
- In `settle()` the mask jumps at once to `judiWaterY` (470 land, 742 portrait), while the ark still floats
  lower down (`float.y` 640 / 1010).
- I rendered the real sequence (`__nuh.S.phase = 'settle'`, ark clicked). Screenshots are in the scratchpad
  `scholar/nuhfix/`:
  - `tab-fix-settle-0.7s.png` and `phone-fix-settle-0.7s.png` show the ark as a faint hull **under the sea**,
    only its tips showing, while the ribbon says "The ark came to rest safely".
  - Without the fix (`tab-now-settle-0.7s.png`) the ark sits on the water.
- A sunk-looking ark contradicts 11:42 «وَهِيَ تَجْرِي بِهِمْ فِي مَوْجٍ كَالْجِبَالِ» and 11:44.

**GO** once one of these is done:
- the ark, the ramp and the herd stack above `#atmos`; or
- the canvas moves before `.arkglow` in the DOM, as Musa does (its canvas precedes the camp and lantern); or
- the Judi mask switches only after the ark has risen above it.

Then attach to `game-nuh-ark.md` frames of the real flood, the settle (0.5 s steps) and the reward, tablet and
phone, EN and AR. My re-check is limited to those frames. The rain, shimmer and motes I saw rendered (flood and
reward, both sizes) form no figure, cross or glyph.

## Fixes after gates 2-3
`kids-game-designer`, 2026-11-06.

| Item | Fix |
|---|---|
| 3.1 MUST: the child led the line | `placeTrail()`: 4 of the 9 lights now walk **ahead** of the lantern, spaced along the far side of the path (`AHEAD = 4`, spacing 1.7x the gap so they read as ahead, not beside), and 5 follow behind. The next glowing step stays clear. The landscape lantern is a little smaller (`lanternW` 84 to 70), so the lights ahead are not hidden by it. At the far end, the lights ahead wait at the far shore. |
| 3.2: open on "by Allah's command" | `hear()` waits on `openCue()`: the split starts when Baba's clip passes EN 5.8 s / AR 4.45 s. The 3.6 s timer is used only when the sound is off, or when the clip is blocked or fails (after 2.5 s), with a 9 s cap. Measured in the play-throughs (100 ms polling): the opening began at clip time 5.94-5.99 s (EN) and 4.50-4.57 s (AR). |
| 3.3: the sea opened out of the lantern | Once the trust choice at the shore is made (before "Hear what happened"), the lantern goes back onto the beach among the lights (`S.onBeach`, `L.wait`). The opening starts on open water away from it; the lantern returns to the water's edge only when the walk begins. |
| 2a record | `game-musa-art.md`: the `plate-dawn-port` entry now shows the shipped r2 (seed 63901, with the added path sentence), with the rejected r1 (1409269) kept as a reject. The asset entries are regenerated from `musa.py`; the palm is marked not shipped. The `musa.py` docstring no longer lists the jar and palm as scene things. |
| Linking | `story-prophet-musa.html`: a "🏮 Play together" / «🏮 لنلعب معاً» `.play-together` link on the final quiz-results card, exactly as Nuh's (same class; computed font, min-height, padding and radius identical). Not on the hub. |

**Checks after the fixes:** rebuilt with `_src/build.py`. Play-throughs EN and AR, tablet and phone (motion on),
plus keyboard-only (tablet EN, phone AR): all complete, no console errors, no page scroll, no request outside
localhost. The keyboard runs end on "Play together again". The story link opens the game (200), and the game's
"Back to the story" returns to `story-prophet-musa.html`. All six verifiers pass (`verify-chain` included), and
the scripture diff passes.

**Screenshots for the scholar** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/musa-game/fixes/`):
- Lantern back on the beach before "Hear what happened": `{tab,phone}-{en,ar}-4-hear.png`
- Parting, about 3 s after the opening starts: `{tab,phone}-{en,ar}-5-parting.png`
- Walk among the believers: `{tab,phone}-{en,ar}-6-walk.png`, `-7-fear1.png`, `-7-fear2.png`, `-8-mid.png`
- Safe shore: `{tab,phone}-{en,ar}-9-safe.png`
- Overview strips: `review-tab.png`, `review-phone.png`; run data `playthrough.json`
