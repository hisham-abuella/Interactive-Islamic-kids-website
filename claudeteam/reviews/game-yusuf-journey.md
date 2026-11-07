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
