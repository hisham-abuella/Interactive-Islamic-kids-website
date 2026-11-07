# Game spec: Ibrahim, Stars and Guests (mockup 04)

File: `UI/mockups/games/04-ibrahim-stars.html`. Prototype with placeholder art. Logic and rendering are separate, and assets sit in the `ART` block. **Sign-off still needed.**

- **Learning goal:** After playing, the child can explain that the star, the moon and the sun all set, so they are creations and not worthy of worship, and that only Allah who made them is. The child can also name three ways Ibrahim honoured his guests.
- **Age band:** 6-10.
- **Tied to:** `UI/story-prophet-ibrahim.html` for the sky scenes and the quotations "I turn my face..." and "Ibrahim understood...". The hospitality round narrates the meaning of 51:24-27 / 11:69 in plain words (approved without a site page, because no Quran text is shown).
- **Core loop:**
  - Round 1: tap a light in the sky, drag the "Time passes" slider until it sets, answer the factual question "Did it stay with us all the time?", hear the reasoning ("something that goes away cannot be our Lord"), and finally drag all three into a "Created by Allah" frame.
  - Round 2: welcome guests step by step, only from 51:25-27: return the greeting of peace, hurry quietly to the household, choose the best food (a fat, roasted calf), drag the tray close (not to the far corner), and invite them gently. Then a line for the grown-up: the guests were angels, and angels do not eat.

## Pause points
1. After the sky round: "The sun is so big and bright. Why can it not be our Lord?"
2. After the guests: "Who visits our home? What could we do to make them feel welcome, like Ibrahim?"

## Feedback
Each wrong pick ("Yes, it stayed" / go away / a dry crust / the far corner / "Eat it now!") gets a short reason and a re-choice. No option ever affirms shirk. Nothing is lost.

## Difficulty ramp
The parent tier is a conversational one: the child explains each answer in their own words before tapping.

## EN/AR, RTL and accessibility
- The slider is a native `<input type=range>`, so it is keyboard and screen-reader friendly, with `aria-valuetext` such as "Night turns to dawn".
- All strings are bilingual.

## Guardrail checklist
- [x] Ibrahim and the guests are never drawn. Guests are shown only by the mat where the food is set. They are **named** as angels for the grown-up (ruled 2026-11-03), and the food is never shown being eaten.
- [x] The framing avoids saying Ibrahim worshipped the stars. It follows the story page: he looked, each one set, so it could not be his Lord.
- [x] The quotations are copied byte-for-byte from the story page.
- [x] **Scholar (ruled 2026-11-03: plain-words narration is fine; the water step is removed):** the hospitality details are paraphrased from Hud 11:69 and Adh-Dhariyat 51:26-27 ("he hurried and brought a fine roasted calf, and brought it near to them, and said: will you not eat?"). The game says "a fine roasted meal". Is this acceptable without adding the ayat to a page first?
- [x] **Scholar (approved 2026-11-03; say "always with us, hearing and seeing", never "everywhere"):** the phrase "Our Lord never disappears and never sleeps" is used as an explanation (meaning of Al-Baqarah 2:255). Is it fine as a paraphrase?
- [ ] **Owner/CEO:** should the hospitality round be its own page or story slide first, so that the game follows the site rather than leading it?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: an option affirms shirk ("Yes, it is so bright" to "Can something that disappears be our Lord?") | Done. Question is now "It has set. Did it stay with us all the time?" with "No, it went away" / "Yes, it stayed" ("Look again..."). The reasoning is narration: "Something that goes away cannot be our Lord. Allah never goes away and never sleeps: He is always with us, hearing and seeing." |
| 2 | MUST: the guests were angels; no invented water step; do not imply they ate | Done. The 3 water cups, their hold mechanic, CSS and strings are removed. Steps now follow 51:25-27: greeting of peace, "Ibrahim went quickly and quietly to his household", the best food ("a fat, roasted calf"), brought near, "Please, won't you eat?". Added the scholar's parent line: "For the grown-up: these guests were really angels sent by Allah with good news. Angels do not eat, so they did not eat the food." Ending changed from "you welcomed guests the way Ibrahim did" to "you learned how Ibrahim welcomed his guests with his very best". |
| 3 | NOTE: keep avoiding the "this is my lord" lines | Kept: the game never says them. |
| 4 | NOTE: 6:79 quote matches the site | Unchanged. |
| 5 | Section 5: "never disappears, never sleeps" approved; never "Allah is everywhere" | Done: the new narration says "always with us, hearing and seeing". |
| 6 | Adab: "Prophet" at first mention | Done: "Prophet Ibrahim" / «النبي إبراهيم عليه السلام». |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done via the shared kit; the "done" cue after the invitation is now the two-note `good` chime. |

Site-level item still open (owner): Ibrahim as "still searching" on `story-prophet-ibrahim.html:112,140,163`.

## Painted build, 2026-11-07 (`kids-game-designer`)
The third painted game, built to the Nuh and Musa standard: `UI/games/ibrahim-stars.html` (source
`UI/mockups/games/_src/src/04-ibrahim-stars-painted.html`, built by `_src/build.py`, which copies the dua, its
meaning line, its note and two story sentences from `story-prophet-ibrahim.html`), `UI/games/ibrahim/ibrahim.js`,
`ibrahim.css`, art in `UI/images/games/ibrahim/` (prompts and seeds: `UI/scripts/specs/games/ibrahim.py`; record:
`claudeteam/reviews/game-ibrahim-art.md`). The CSS-shape mockup `UI/mockups/games/04-ibrahim-stars.html` is kept as
it was. **Not linked** from the story or the hub: gates 2 (art) and 3 (build) are open.

Two fixes to the mockup's sources: the page sentences the mockup used ("I turn my face..." and "Ibrahim understood
that only Allah...") are no longer on `story-prophet-ibrahim.html`. The painted game uses the page's current
sentences instead, both reported speech: "Ibrahim showed his people that only **Allah** - who created the stars,
moon, and sun - deserves to be worshipped!" and "Ibrahim declared to his people that he turned in worship to Allah
alone, the Creator of the heavens and the earth!" (`IBR_SHOWED`, `IBR_DECLARE` in `build.py`).

**One round, as built** (about 4-5 minutes; gate-1 wording kept, new lines marked (new)).
1. **The night sky** (painted desert at night, the far town of Ibrahim's people as plain houses with lit doorways).
   One bright star glows (a soft glow of light, no rays, no ring). (new) "Prophet Ibrahim wanted to teach his people
   who the true Lord is. Look at the night sky: one star shines brighter than all the others. Tap it." Baba's
   recorded sentence plays: "Ibrahim wanted to teach his people who the true Lord is." (slide 1, first sentence only).
2. **Time passes, the child watches.** After the tap, a gold line with a turquoise knob ("Night" to "Before dawn")
   appears. Sliding it moves time: the star follows its arc down and sets behind the far dunes. The child moves the
   time, not the star; nothing is a miracle here, and nothing is caused by the child beyond the clock.
3. **The factual question (gate 1, MUST 1):** "The star has set. Did it stay with us all the time?" - "No, it went
   away" / "Yes, it stayed" (order shuffled, both buttons look alike). "Yes" gets "Look again: it went down and was
   gone. Let us watch once more." and the star is shown once more just above the horizon, sinking away by itself.
   "No" gets the approved reasoning: "...something that goes away cannot be our Lord. Allah never goes away and never
   sleeps: He is always with us, hearing and seeing." A **Next** button lets the grown-up set the pace.
4. **The moon** rises by itself from the horizon (the child watches), "Tap the moon", then the knob ("Night" to
   "Morning"): the moon sets while the sky crossfades from night to the morning plate in step with the knob. Same
   question. The reasoning ends with the page's sentence, and Baba's recording of it plays: "Ibrahim was showing his
   people that something which disappears cannot be our Lord." (slide 2, last sentence only).
5. **The sun** rises in the morning sky, "Tap the sun", then the knob ("Morning" to "Evening"): it sets as the sky
   crossfades to the evening plate. Same question; "Yes, when evening came, even the big, bright sun went away."
6. **"Created by Allah"** (new layout of the mockup's frame step): a parchment cartouche in the HUD (never an object
   in the sky) with three gold slots; the star, the moon and the sun wait below as round cobalt tokens. Drag each
   into the cartouche, or tap it: "Allah made the star." / "...the moon." / "...the sun." When all three are in:
   "Allah made them all. Only Allah, who never sets and never sleeps, deserves to be worshipped." Then the page's two
   sentences in a plain quote panel, with Baba's recording of the first (slide 3, last sentence only).
7. **Parent pause 1** (as approved), then "Next: Ibrahim's guests", a page-turn wipe in the reading direction.
8. **Ibrahim's tent** (painted, daylight). The guests are never drawn; the mat with its cushions is their place.
   Greeting choice (as approved); on "Wa alaykum as-salam" the guests' mat warms with light.
9. **51:26 "he went quickly to his household":** "Then Ibrahim went quickly and quietly to his household to get food
   ready. Tap the curtain to the household." The curtain glows; a tap brings a soft rustle and quick steps.
10. **The best food:** two dishes come out, a fat roasted calf on a platter and a dry crust of bread on a clay plate.
    Tap the best one (the crust wobbles gently: "That is kind, but Ibrahim gave his guests his very best").
11. **51:27 "he brought it near to them":** two glowing places, "Near the guests" and "The far corner". Drag the
    tray, or tap the tray then the place, or (keyboard) Enter on a place. The far corner: "That is a long way for
    the guests to reach. Ibrahim brought the food close to them. Try again."
12. **The invitation:** "Please, won't you eat?" / "Eat it now!" (as approved), then the summary line and, after
    Next, the scholar's line for the grown-up (angels do not eat). The tray stays whole on the mat throughout.
13. **Parent pause 2**, then (new) night falls again over the desert: "Night came again, and the stars came out over
    the desert. Allah made them all, and Allah is always with us, hearing and seeing." Then the reward (lamp glow,
    the shamsa approved on Nuh with its ivory disc, a two-note chime, a few slow motes) and the ending page with
    Ibrahim's dua (2:127) from the story page, "Play together again", "Back to the story", and the tier box.

**Not in this game, by the gate-1 rulings:** the idols (no plinths, no axe), the fire (not narrated, not shown),
the Ka'bah (not drawn; the dua's note mentions it in words only, as on the story page), any figure.

**Tier ("next time"):** before each choice the ribbon adds "Grown-up: before tapping, ask your child to say why."

**Voice:** only Baba's recorded story narration, three single sentences cut inside recorded pauses (ffmpeg
silencedetect) and checked with Whisper large-v3-turbo under the RAM gate: EN slide 1 0-3.6 s, AR 0-3.63 s; EN slide
2 9.5-14.45 s, AR 9.1-13.6 s; EN slide 3 9.85-16.8 s, AR 9.2-16.5 s. Whisper heard exactly the one sentence each
time; the neighbouring parts ("One night he looked at a bright star and asked them," / "...the moon also
disappeared." / "Even the powerful sun went away.") are outside every cut. The "Is this my lord?" / "This is my
lord!" sentences of slides 1-3 are never played. Slides 6 (21:69) and 9 (the dua) are never used. No browser TTS.

**Sound:** no music. A low desert wind (filtered noise), a soft breath as a light sets, cloth and steps at the
curtain, single bell tones and the two-note chimes (`good` 659/988, `done` 523/784). Ducked under Baba's voice.

**New strings for the scholar's gate 3** (EN and AR in `ibrahim.js` `BODIES` and `W`): every `show`, `tapped`,
`labels`, `vt`, `again` and `right` of the three lights (the star's `right` is the approved reasoning with "Ibrahim
showed his people:" in place of "Ibrahim knew it could not be his Lord", per the gate-1 note that he was teaching);
`frameAsk`, `placed`, `missFrame`, `frameDone`, `toTent`, `hurry` (now ends "Tap the curtain to the household"),
`food`, `best` (new second half), `selTray`, `missTray`, `night`, `next`, `tierAsk`, and the chips "To the
household", "Near the guests", "The far corner", "A fat, roasted calf", "A dry crust of bread".

**Sound off and quiet moments (from the scholar's Yusuf review, applied here before review):** the wind's slow swell is
now a gain stage after the level (it scales to nothing at level 0), "Sounds off" ramps the master gain to 0 in 0.25 s
and suspends the AudioContext, and the ending fades the wind to 0. Measured trace (AnalyserNode on the master output,
RMS of 8192 samples, headless Chromium): sound on -43 to -46 dBFS; 0.3 s after Sounds off -67 dBFS (inside the ramp);
from 1 s to 7 s after Sounds off the context is suspended and no sample reaches the output; with sound on and the wind
faded to 0 (a quiet moment, context running) every reading from 1.5 s to 7.5 s is exactly 0 (-inf dBFS). The dua line
has extra room above it (line-height 1.9, 0.3 em top padding) so no tall mark rises into the kicker line.

**Verification (2026-11-07, designer):** `node --check`; headless play-throughs EN and AR at 1180x820 and 390x844 (drag
on the tablet, tap and the keyboard End key on the phone; the wrong answer first at every choice; the far corner
first), with motion and with reduced motion; keyboard-only runs (tablet EN, phone AR: Tab reaches the star after the
HUD, Enter/End/Tab to the end, focus lands on "Play together again"); no console errors, no page scroll (scrollHeight
= innerHeight at start and end), no request outside localhost, "Back to the story" -> `../story-prophet-ibrahim.html`,
"Play together again" restarts at the star. All targets are 48 px or more (the tier checkbox sits in a 48 px label).
Scripture diff: the dua (2:127), its meaning and note, and both page sentences match `story-prophet-ibrahim.html`
byte for byte; the dua has the letters of 2:127 (quran-simple) once tashkeel and the waqf sign are set aside; no "my
lord" / «هذا ربي» outside comments. `verify-no-recitation.py --transcripts` on all 191 game strings plus the six
Whisper transcripts of the clip parts: 0 flagged. All six site verifiers pass (chain, illustrations, narration,
no-recitation, quizzes, scripture). Art: 12 images, 396 KB.

**Screenshots** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/ibrahim-game/shots/`):
`{tab,phone}-{en,ar}-NN-*.png` for every stage (01 start ... 16 end), `beside-*.png` (game beside the Ibrahim scene-2
plate), `review-{tab,phone}-{en,ar}.png` (all stages), `kb-*.png`.

### Gates
- Gate 1 (spec): approved with fixes 2026-11-03/04; fixes applied (table above). The new lines listed above need the
  scholar's eye in gate 3.
- Art gate: prompts reviewed (pending, scholar 2a); contact sheet reviewed (pending, scholar 2b,
  `claudeteam/reviews/game-ibrahim-contact-sheet.png`). Designer self-check and four questions: `game-ibrahim-art.md`.
- Gate 3 (build): pending. **Not linked** from the story or the hub.

**Designer questions for gate 3:**
1. The time knob: the child slides time forward and watches the light set. Is that clear enough of "the child makes
   the sun set"? (The labels say "Night ... Morning", the narration "let the night pass ... watch the moon".)
2. The "Created by Allah" cartouche holds the star, the moon and the sun as tokens; it sits in the HUD, not the sky.
3. The night that falls again at the end, with "Allah made them all, and Allah is always with us, hearing and seeing."
4. The crust tray is the same platter with one dry crust (both dishes look alike except for the food).

## Scholar gates 2-3 (2026-11)
`islamic-content-scholar`, 2026-11-07, on `main` at e466bda. Read-only review; no game file was edited.

**Summary.** Gate 1 is confirmed closed. 2a (prompts): **PASS**. 2b (images): **PASS WITH FIXES**, because both
tent plates must be regenerated. 3 (build): **PASS WITH FIXES**, because the time knob must only go forward.
**Linking: not yet.** Link it from the end of the Ibrahim story once the three MUST fixes below are applied and I have
re-checked the two new tent plates in context. The page is reachable by URL but linked from nowhere, so it does not
need to be taken down in the meantime.

### Gate 1: confirmed (all rulings hold in the painted build)
- **Factual questions only.** Every question asks "Did it stay with us all the time?" with "No, it went away" / "Yes, it
  stayed" (`UI/games/ibrahim/ibrahim.js:64-65, 74-75, 84-85`). No option says a star, the moon or the sun is a Lord. The
  "Yes" answer replays the setting (`ibrahim.js:464-470`). The reasoning is narration only (`:67, :77`).
- **Ibrahim is teaching his people.** "Prophet Ibrahim wanted to teach his people who the true Lord is" (`:58`),
  "Ibrahim showed his people: something that goes away cannot be our Lord" (`:67`), "Ibrahim was showing his people"
  (`:77`). The words "this is my lord" / «هذا ربي» appear nowhere in the strings: grep finds them only in code comments,
  and the only «ربي» hit is inside «عربي».
- **No faces on the sky bodies.** The sun and moon sprites are plain discs (checked at 100% on light and dark grounds).
  The star is a DOM glow with no rays and no ring.
- **The guests follow 51:25-27 and 11:69 only:** peace answered with peace (`:102-105`), «فراغ إلى أهله» as "went quickly and
  quietly to his household" (`:106`), "a fat, roasted calf" (`:110`, عجل سمين / حنيذ), brought near (`:113`), "Please,
  won't you eat?" (`:116`).
- **The angels line for the grown-up** is present (`:121-122`). The food is never shown eaten: the tray stays whole and is
  hidden at nightfall (`:606`).
- **No water step** in the story. Water appears only in the parent-pause idea for *our own* guests (`:124`), which gate 1
  allowed.
- **Omitted as ruled:** idols, fire and the Ka'bah are not drawn. The Ka'bah appears only in words, in the dua's kicker
  copied from the story page.

### Re-checks (my own measurements)
- **Dua 2:127, its meaning and its note:** byte-identical to `UI/story-prophet-ibrahim.html:307-309` (Python substring
  check on the Arabic, the EN and AR meaning lines, and the EN and AR kicker). Against `api.alquran.cloud`
  `2:127/quran-simple`, the normalised letters «ربنا تقبل منا انك انت السميع العليم» are an exact run of the ayah. The
  diacritised text differs in only two places: no sukun on «أَنتَ» and no waqf sign ۖ. That is the site's convention
  on the story page, not an error.
- **The two page sentences** (`IBR_SHOWED`, `IBR_DECLARE`, EN and AR) are byte-identical to
  `story-prophet-ibrahim.html:173` and `:164` (`ibrahim-stars.html:113`).
- **No recitation.** I ran `verify-no-recitation.py --transcripts` on 228 strings extracted from `ibrahim.js` and
  `ibrahim-stars.html` plus the six Whisper transcripts. It flagged one line, the on-screen dua itself (2:127), which is
  displayed and never voiced. The game has no `speechSynthesis` or `speak(` call, and its only audio is
  `slide-{1,2,3}.mp3` (`:136-138, :218`). Slides 6 and 9 are never used.
- **The three narration cuts fall inside pauses.** I ran ffmpeg silencedetect (-35 dB, 0.15 s) on the shipped mp3s:

  | Clip | Cut (s) | Pause the edge falls in (s) |
  |---|---|---|
  | EN slide 1 | 0-3.60 | end in 3.29-4.03 |
  | AR slide 1 | 0-3.63 | end in 3.51-3.76 |
  | EN slide 2 | 9.50-14.45 | start in 9.23-9.78; end in 14.33-14.56 (file end) |
  | AR slide 2 | 9.10-13.60 | start in 8.85-9.37; end in 13.48-13.77 (file end) |
  | EN slide 3 | 9.85-16.80 | start in 9.57-10.15; end in 16.67-16.93 (file end) |
  | AR slide 3 | 9.20-16.50 | start in 8.88-9.49; end in 16.38-16.65 (file end) |

  Re-cutting the shipped mp3s at these times reproduces the Whisper clips sample for sample (correlation 1.000, lag 0).
  The cut edges read -54 to -99 dBFS. The only exception is the head of slide 1, which is the start of the file. Whisper
  heard only the intended sentence each time. "Is this my lord?" (EN slide 1 about 7-8 s), "This is my lord!"
  (slide 2 about 3-4 s) and "This is my lord - it's the biggest!" (slide 3 about 1.5-3 s) all lie outside every cut.
- **Sounds off is silent.** In `audio-trace.json`: sound on reads -43 to -46 dBFS. 0.3 s after Sounds off it reads -67/-79
  (inside the 0.25 s ramp), and the context is already `suspended`. From 1 to 7 s after, all twelve readings are -inf with
  the context `suspended`. In a quiet moment with the wind at 0 and the context `running`, all twelve readings are
  -inf. Code: the master ramps to 0 and the context is suspended (`ibrahim.js:192-196`), and the Sounds-off click also stops
  Baba's clip (`:654`), which plays outside the Web Audio master.

### 2a, prompts: PASS
`UI/scripts/specs/games/ibrahim.py` and `game-ibrahim-art.md` meet every item of 3a:
- Things only: desert, houses, tent, mat, cushions, pots, platter, bread, and the sun disc.
- No light is written as divine.
- `STYLE`/`NEGATIVE` are imported unchanged, with the full 3a.3 game list.
- The Ibrahim bans are in every negative: guests, place settings, idols, statues, ziggurat, altar, fire, axe, and face
  and eyes for every asset.
- No Ka'bah, mushaf or text is prompted.
- Every prompt, seed and reroll is recorded.

The rerolls for the tents should add the motif bans listed under 2b.

### 2b, images: PASS WITH FIXES (10 of 12 approved, 2 to regenerate)
Approved: `plate-{night,morning,evening}-{land,port}`, `sun`, `moon`, `platter`, `bread`. In the town houses, every
doorway is plain light with no figure; I zoomed the night-port arched doorway to check. The skies contain only dot stars.

1. **MUST: regenerate `plate-tent-port` (seed 1120183).**
   - (a) The roof carries two stacked concentric blue lozenges (around x 345, y 490-600). The upper one has a round
     turquoise "pupil" in a pale centre. That is the blue nazar / evil-eye form (3b.2, 3b.3), the same reading as the
     rejected bread 471110 ("blue almond with a dot"). On the phone it sits at the centre of every guest frame.
   - (b) The tent's inner centre pole (x around 346) is crossed by a frame rail at y around 686 and rises about 50 px above
     it to the hem: a cross (3b.3). This is the failure that rejected 1034882, and it is visible at phone size
     (`shots/phone-en-08-tent-greet.png`, around x 195, y 440).
   - (c) The vertical band at the curtain's edge (x 615-640, y 640-960) is a column of small script-like marks, and the
     hem has a row of looped strokes (3b.4, when in doubt).
   - Add to the reroll prompt: plain roof with no medallion, diamond or motif; plain curtain with no border, fringe or hem
     pattern; no frame or rails visible inside. Keep the sand plain. Some of the current dents in front of the tent pair
     up.
2. **MUST: regenerate `plate-tent-land` (seed 126676).**
   - The rope that runs from the roof-corner knot (x around 567, y 298) to the front pole passes *through* the inner back
     pole (x around 635, y around 275). That pole rises about 8 px above the rope, and the rope continues about 40 px to
     its left: a small Latin cross at 100% (zoom: around x 600-660, y 260-300). It is low-contrast at tablet size, but
     it fails the Musa standard ("the stem never rises above the bar") and repeats the reject 1358775 (a crossbar at the
     top of a pole).
   - A recorded Qwen edit that removes the rope and keeps the poles plain is acceptable in place of a new seed, as was
     done for the bread. Either way it is a new render, not a retouch.
3. **Designer Q1, the front pole:** the rope ending at the tall front pole, with the pole rising above it, is a side bar
   (⊣), not a cross. Acceptable. The X-wrapped lashings at the pole tops are ordinary knots and also acceptable. The
   problem is the inner pole (item 2).
4. **Designer Q2, sand dents:** acceptable in `plate-tent-land`. The hollows are single and irregular, with no pairs and
   no sole shapes. The portrait plate is being redone anyway.
5. **Designer Q3, platter rim lozenges:** acceptable. They are a repeated band of small lozenges, i.e. ornament, as
   approved on Nuh's cloths. This is the difference from item 1(a), which is one large concentric blue lozenge with a
   round pupil at the centre of the scene.
6. **Designer Q4, the derived moon:** approved. A plain, featureless ivory disc in the same hand as the sun is better than
   either rejected render. No SVG is needed.
7. Note (no fix): the roast reads as a generic whole roast rather than obviously a calf. The label "A fat, roasted calf"
   carries the meaning, and nothing on the platter is wrong.

Sign-off line: `Art gate: prompts reviewed 2026-11-07 (scholar); contact sheet reviewed 2026-11-07 (scholar) - 10
sprites approved, 2 rejected (plate-tent-port, plate-tent-land) to regenerate and re-review.`

### 3, build: PASS WITH FIXES
1. **MUST: the time knob must only go forward** (designer Q1, re-judged in the painted build).
   - `ibrahim.js:427-433` maps every `input` value straight to the body's position (`S.u = lerp(o.u0, 1, k)`). So
     until the light has fully set, the child can drag the sun back up into the evening sky (and the sky plate back to
     morning), or press Home to do the same.
   - In this game of all games that matters. Ibrahim's own argument in 2:258 is «فإن الله يأتي بالشمس من المشرق فأت بها
     من المغرب»: no creature can bring the sun back from the west.
   - Watching time pass is acceptable, and I keep my approval of the slider from mockup 04: the knob is a clock, it is
     away from the sun, and its labels and narration name the time ("let the day pass"). The child pulling the sun back
     is not acceptable.
   - Fix: clamp the knob so its value never decreases within a light (keep the highest value reached, and ignore lower
     values, including Home). Then the knob can only let time move on.
2. **SHOULD: "never sets" becomes "never goes away"** in EN `frameDone` (`:97`) and `pause1H` (`:100`). Negating
   "sets" of Allah still describes Him in the terms of a sky body. "Never goes away" is the approved gate-1 wording and
   matches 7:7 «وما كنا غائبين». The AR «لا يغيب» is right as it is.
3. **Designer Q2, the "Created by Allah" panel:** approved. It sorts the three lights as creations, it sits in the HUD
   and not in the sky, and «خلقها الله» / "Allah made the star." (`:95`) is sound. Nothing is placed on a floor or shown as
   honoured.
4. **Designer Q3, the closing night line** (`:125-126`): approved. "Allah is always with us, hearing and seeing" follows
   20:46 «إنني معكما أسمع وأرى» and avoids "everywhere".
5. **Designer Q4, the crust on the same platter:** approved. The two dishes differ only in the food, which is the lesson.
   A wobble on bread is fine; the no-wobble rule is for sacred things only.
6. Checked and approved:
   - Adab: "Prophet Ibrahim" / «النبي إبراهيم عليه السلام» at first mention (`:58-59`).
   - The wrong options ("Who are you? Go away.", "Eat it now!") are what *we* might say, never attributed to Ibrahim,
     and each is corrected with what he did.
   - «ألا تأكلون» in the invitation chip is a short spoken phrase, not presented as an ayah and never voiced.
   - The angels line matches 11:69 «بالبشرى» and 51:28.
   - The eight beads mark progress, not deeds.
   - There is no music: the chimes are 659/988 and 523/784 Hz.
   - The shamsa is the one approved on Nuh.

### Linking verdict
**Do not link yet.** Link it from the end of `story-prophet-ibrahim.html` when all of these are done:
1. Both tent plates are regenerated (2b items 1-2), and I have re-checked the new plates at 100% and in context at both
   sizes and mirrored.
2. The one-way knob is applied (3.1). The designer can verify it; I will confirm from the diff.
3. The "never sets" wording is changed (3.2). This one is a SHOULD and does not block linking.

## Fixes after gates 2-3
`kids-game-designer`, 2026-11-07, on top of e466bda.

| Item | Fix |
|---|---|
| 2b MUST 1: `plate-tent-port` (1120183): nazar-like lozenge, rail across the inner pole, script-like marks | Regenerated. A new Z-Image seed with the motif bans added (r5, 1400481) still painted a roof medallion, a band of X marks and a corner signature, so the shipped plate is a recorded chain of Qwen edits of r5: r6 (761115) removed the ornaments and the writing; r7 (178573) was rejected (flat cream sky, chevron columns); **r8 (615708) is shipped**. The roof is plain, the eave band is plain turquoise, the curtain is plain, and no pole shows above or across the band (the r6 poles rose ~30 px above the band, so r8 takes them away). Inside there is no frame or rail. The sand has single, irregular dents only. Every input, prompt and seed is in `ibrahim.py`; the record is in `game-ibrahim-art.md`. |
| 2b MUST 2: `plate-tent-land` (126676): rope through the inner back pole | Regenerated as a recorded Qwen edit of 126676 (**310210**, shipped): every rope under the roof is gone, and each pole is a plain upright with nothing across it. The front poles still meet the sloping roof cloth (the side-bar case accepted in 2b Q1). The household hanging is now the dark cloth wall right of the front pole; the hotspot moved onto it. The export trims the thin rule the edit drew inside the frame. |
| 3 MUST 1: the time knob only goes forward | `ibrahim.js`: the knob keeps the furthest value reached in the current light (`S.kmax`). Any lower value from a drag back, a click near the start, Home, PageDown or a backwards arrow is put straight back to it, and Home, PageDown and the backwards arrows (Left/Down in EN, Right/Down in AR) are ignored. It is still a native range input with its label and `aria-valuetext`. |
| 3 SHOULD 2: "never sets" | EN `frameDone` and `pause1H` now say "never goes away" ("Only Allah, who never goes away and never sleeps, deserves to be worshipped."; "...and Allah never goes away and never sleeps."). The AR «لا يغيب» is unchanged. |
| Layout | The tent hotspots and places were re-measured on both new plates; on the phone the far corner moved to the end side so it never sits under the tray. |

**Proof that the knob cannot go backwards** (`fixes/knob-test.json`, headless, EN and AR at 1180x820): drag forward to
60% (value 60, the star's arc position u 0.768), then drag back to 10% while still holding (value 60, u 0.768), release
(60), then Home, Left, Down, PageDown (and Right in AR): every one leaves the value at 60 or 65 and u unchanged or
higher; Up moves it forward (70); a click near the start of the track leaves it at 70. `never_backwards: true` in
both languages (no step ever lowered the value or the position of the light).

**Checks after the fixes:** rebuilt with `_src/build.py`; `node --check`. Play-throughs EN and AR, tablet and phone
(motion on), and keyboard-only (tablet EN, phone AR): all complete, no console errors, no page scroll, no request
outside localhost; the keyboard runs end on "Play together again". All six verifiers pass; the scripture diff passes;
no "never sets" left. Art now 12 images, 358 KB.

**Screenshots for the scholar's re-check** (`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/ibrahim-game/fixes/`):
- The new tents in the guests round, tablet and phone, EN and AR (AR is the mirrored scene):
  `{tab,phone}-{en,ar}-08-tent-greet.png`, `-09-curtain.png`, `-10-food.png`, `-11-carry.png`, `-12-invite.png`,
  `-13-angels.png`, `-14-pause2.png`.
- The rest of the round: `{tab,phone}-{en,ar}-01-start.png` ... `-16-end.png`; overview strips `review-{tab,phone}-{en,ar}.png`; `beside-*.png`.
- The plates at full size: `UI/images/games/ibrahim/plate-tent-{land,port}.webp`, and the contact sheet
  `claudeteam/reviews/game-ibrahim-contact-sheet.png`.
- The knob test: `knob-test.json`.

**Linking:** not done. The scholar's verdict makes the link conditional on his re-check of the two new tent plates at
100% and in context. The link is ready to add as the same `.play-together` pattern on the final quiz card of
`story-prophet-ibrahim.html` once he confirms.
