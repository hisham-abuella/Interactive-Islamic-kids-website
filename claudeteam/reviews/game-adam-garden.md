# Game spec: The Garden of Choices (mockup 05)

File: `UI/mockups/games/05-adam-garden.html`. Prototype with placeholder art. Logic and rendering are separate, and assets sit in the `ART` block. **Sign-off still needed.**

- **Learning goal:** After playing, the child can say that when Adam and Hawa made a mistake they said sorry to Allah straight away and He forgave them. The child can also follow the same steps after their own mistake: own it, say sorry, put it right, and ask Allah's forgiveness.
- **Age band:** 5-9.
- **Tied to:** `UI/story-prophet-adam.html`, with the Adam translations from `UI/translations.js`.
- **Core loop:**
  - Round 1: gather fruit in the garden Allah gave and hear the one rule. There is no "kept the rule" state.
  - Round 2: after an accident, choose honesty, fix what broke, and say sorry.

## One round (about 4 min)
1. **Jannah:** drag 5 fruits into the basket. The one tree has a "Do not approach this tree" sign. Tapping it says "Allah said: do not go near this tree." No praise and no comparison with Adam. It has no fruit to take, so the child can never "do the mistake". The tree is unidentified (no apple, no serpent).
2. **The story, narrated:** the story page's text about Shaytan's whisper and the mistake is shown and the garden dims. "They slipped and made a mistake" (2:36 فأزلّهما). "They turned to Allah and asked His forgiveness... We call this istighfar." Adam's dua appears and the parent and child read it together, then press "We read it together". "Allah forgave them!" (copied text) appears, then "Allah sent them to live on earth".
3. **Parent pause 1:** "Why is it good to say sorry quickly when we make a mistake?"
4. **Your garden on earth:** drag the watering can to 3 plants. Then tap the ball, which knocks over Mama's pot.
5. **Choice:** hide the pieces, which dims the garden and explains why; blame the cat, which is explained as unfair and untrue; or tell the truth. The child then drags 3 pieces back to mend the pot.
6. **What do you say?** "Sorry, Mama, I'll be more careful" or "It's not a big deal", which gets a gentle reason. The dua is shown again with the page's note: "Say this dua when you make a mistake...".
7. **Parent pause 2:** "When you make a mistake, what are the three steps?"
8. **Ending:** "Allah loves to forgive", then "Play together again".

## Difficulty ramp
The parent tier prompts a real conversation about a mistake from this week before starting.

## EN/AR, RTL and accessibility
- All strings are bilingual, and the dua note uses the page's own Arabic.
- Keyboard: select, then choose a target. Targets are 48px or more.

## Guardrail checklist
- [x] Adam, Hawa, the angels and Iblis are never drawn. The child never plays as Adam, and the prophet's mistake is narrated from the page, never played or chosen by the child.
- [x] The dua `رَبَّنَا ظَلَمْنَا أَنفُسَنَا ...` is copied byte-for-byte from the story page. Its EN/AR translation and note come from `translations.js`.
- [x] The dua is read together by the family. It is never turned into a hold or score mechanic and never spoken by TTS.
- [ ] **Scholar:** the story text "ate from the forbidden tree / big mistake" is reused from the page. Is the wording right for a prophet (some prefer "slip", زلّة)? The same wording is already on the story page.
- [ ] **Scholar:** the Arabic phrase "قالا آسفين لله" / "say sorry to Allah" is used for istighfar. Would "نستغفر الله" be preferred?

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: the child "succeeds" where a prophet slipped ("You kept the rule!") | Done. `ruleKept` is now `ruleHeard`: a single soft tap and "Allah said: do not go near this tree. Everything else in the garden was allowed." No praise, no wobble, no `S.kept`. Ending: "You learned Adam's dua, and when an accident happened you told the truth, fixed it and said sorry." |
| 2 | SHOULD: forbidden tree not an apple tree, no serpent | Done for the placeholder: 🍎 removed from the allowed fruits (🍋 instead); the forbidden tree stays a plain unidentified tree. Art brief carries the ban. |
| 3 | NOTE: "the light comes back to the garden" | Done: "Allah forgave them! Allah is the Most Merciful. Then Allah sent them to live on earth." |
| 4 | Section 5: "slip", not "big mistake" | Done in the game: "they slipped and made a mistake" / «فأزلّهما الشيطان فأخطآ». The story page (`translations.js:95,271`) still says "big mistake" (owner/site-level). |
| 5 | Section 5: istighfar, not «آسفين لله» | Done: "asked His forgiveness... We call this istighfar, and we say: Astaghfirullah"; AR «استغفرا الله» and «نستغفر الله» / «نقول أستغفر الله» replace both «آسفين لله» lines. The "hide" feedback now says Adam "turned to Allah and asked forgiveness". |
| 6 | Section 5: the slip is narrated, never played | Unchanged and compliant. |
| 7 | Adab: "Prophet" at first mention | Done: "Prophet Adam" / «النبي آدم عليه السلام». |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done via the shared kit. The dua is text only. |
