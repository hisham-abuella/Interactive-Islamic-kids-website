# Game spec: Ask and Find, together (mockup 10)

Status: MOCKUP at `UI/mockups/games/10-ask-and-find-coop.html`. Placeholder emoji art (graphics redesign pending). Needs sign-off from the scholar and the learning designer.

- **Learning goal:** After playing, the child can link key objects and moments to the right story or surah on the site (the ark, the basket on the Nile, the well, the elephant...) and describe one in their own words.
- **Age band:** 5-11, with a parent. "6 cards" is for little ones; 9 cards is the default.
- **Tied to:** the 5 prophet stories plus Al-Fil, At-Tin and Quraysh (15 items; each clue paraphrases its source page, noted in the data).
- **Core loop:** one player gives the clue, the other finds the card, and every find lights one lantern on the **team** chain. Turns swap after every find.
- **Round (6 finds, 3-5 min):**
  - Grown-up turns: the grown-up reads the clue card aloud (or taps 🔊), and the child taps the matching card. "Give another hint" adds a second clue.
  - Child turns: "Grown-up, close your eyes!" The child taps to see a secret picture, describes it without naming it (which story, what happened), then hides it, and the grown-up finds it. Pre-readers can play this role.
  - A "Swap!" card marks each change of turn.
- **Pause point:** after the 3rd find: "Which story have we visited tonight that you like best — and why?"
- **Failure:** the wrong card wiggles and names itself and its story ("That is the well, from Prophet Yusuf. Listen to the clue again."). That wrong tap teaches a link too. No limit and no penalty.
- **Never competitive:** one shared chain, no per-player score, and the ending lists what "we found together".
- **Seating:** "Across the table" rotates the grown-up's clue card 180° so it faces the reader on a flat tablet.
- **Replay:** the deck and targets are shuffled from 15 items each game.
- **EN/AR/RTL:** full dictionary and the grid mirrors.
- **Accessibility:** cards are 110px buttons and the overlay buttons are 48px. Reduced motion is respected.

## Guardrail checklist
- [x] Objects only, no figures: the ark, staff, basket, well and so on stand for the stories.
- [x] No scripture quoted; clues paraphrase site pages. The moon clue repeats the Ibrahim page's own retelling.
- [x] No prophet is the butt of a wrong answer; wrong cards are other true items.
- [x] Scholar (reviewed 2026-11-03: 11 approved, 4 fixed below): review the 15 clue lines (in the `ITEMS` block), especially the Yusuf dream clue ("bowing down to him") and the Ibrahim moon clue.
- [ ] Owner: the placeholder 🥢 for Musa's staff must be replaced in the redesign.

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: remove the Biblical dove card | Done. Replaced by **Mount Judi** (11:44): "When the water went down, the ark came to rest on this mountain." The ark card's hint no longer names Judi (it would give the new card away). |
| 2 | SHOULD: fire "cool like a garden" | Done: "Allah commanded this to be cool and safe, and Ibrahim came out unharmed." The 🌷 is dropped from its placeholder art. |
| 3 | SHOULD: Kaaba "brick by brick" | Done: "raised its foundations together, stone by stone" / «رفع ... قواعدها معاً حجراً حجراً» (2:127). |
| 4 | SHOULD: Yusuf's dream "bowing down" | Done: hint now carries the parent line "it was a bow of respect, allowed in their time. In Islam we prostrate only to Allah." |
| 5 | SHOULD: a "no" tone on wrong taps, including the Kaaba | Done: every wrong tap is tone-free and just names the card; the Kaaba card also never wobbles. |
| 6 | NOTE: sea "Allah split it"; basket vs box (تابوت) | Done: "then Allah split it open"; the card is now "The box on the river" / «التابوت على النهر». |
| 7 | Kaaba art (ruling: hand-drawn SVG only) | Done: the 🕋 emoji is replaced with a small hand-drawn SVG cube with a plain gold band. |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done. The 3-note end chime is now two notes. No Quran audio in this game. |
