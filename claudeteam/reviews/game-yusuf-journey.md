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
