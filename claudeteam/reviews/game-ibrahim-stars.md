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
