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
