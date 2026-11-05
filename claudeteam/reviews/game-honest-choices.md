# Game spec: Honest Choices (mockup 09)

Status: MOCKUP at `UI/mockups/games/09-honest-choices.html`. Has open TODO-SCHOLAR items. Needs sign-off from the scholar and the learning designer.

- **Learning goal:** After playing, the child can explain why we tell the truth even when it is hard, share even the small things, and help our parents straight away, and name the ayah or dua each one comes from.
- **Age band:** 5-10.
- **Core loop:** do something with your hands, then choose. The home visibly responds (lanterns light and the room warms, or it dims), and any other choice rewinds to the right path with an explanation.
- **Round (3 choices, about 4 minutes):**
  1. **Truth, "The blue cup".** Throw the ball, which breaks Mama's cup. Mama asks what happened. The choices are: tell the truth; "the cat did it" (the cat looks sad and the room dims); or hide the pieces (they stay sharp under the rug and the secret feels heavy). Telling the truth mends the cup with gold lines and lights the lantern. Grounding: Al-Asr 103:3 and its site explanation. Honesty *costs* something here (you own up) and is still right.
  2. **Sharing, "Four dates".** The choice *is* the manipulation: drag or tap dates onto your cousin's plate, then tap Done. Sharing none dims the room and shows Al-Maun 107:7 with the site's explanation. Sharing any lights the lantern and shows Az-Zalzalah 99:7. Giving all four is praised, with a note that keeping some is fine too.
  3. **Parents, "A glass of water".** Baba asks for water while you build a tower. The choices are "Yes, Baba!", "In a minute…" or "Uff!". Saying yes means pressing and holding to pour up to the line, then dragging the glass to the armchair. Baba says "Jazak Allahu khayran", and the round ends with Prophet Nuh's dua for parents (copied from the Nuh story page).
- **Pause points:** one parent question after each right path (copied from Al-Maun's page for sharing; the others are new).
- **Failure:** a gentle consequence in the world, a plain-words *why*, and "Go back and choose again". No score is kept, and every play ends on the right path with three lanterns lit.
- **Replay:** the order of the choice buttons is shuffled; the date split is free play.
- **EN/AR/RTL:** full dictionary, and RTL mirrors the layout. Mama and Baba are voices; the child's cousin is "ابن عمّك".
- **Accessibility:** all choices and objects are buttons of 48px or more. Pour works by holding Space/Enter or by pointer, with pointer capture so a wobbly finger does not stop it. Dates move by tap, Enter or drag. Reduced motion is respected.

## Sources and TODO-SCHOLAR
- Truthfulness is grounded in Al-Asr 103:3 ("advise each other to truth"). **TODO-SCHOLAR:** the direct hadith ("Truthfulness leads to righteousness…", Bukhari/Muslim) is not on any site page, so it is not quoted. Supply it, or approve 103:3.
- Parents are grounded in Nuh's dua (رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ, from the Nuh story page). **TODO-SCHOLAR:** Al-Isra 17:23-24 (the "uff" ayah) is the direct source but is not on the site; the "uff" branch explains in plain words only.
- Sharing is grounded in Az-Zalzalah 99:7 and Al-Maun 107:7. **TODO-SCHOLAR:** confirm that 107:7 fits a child sharing food.

## Guardrail checklist
- [x] No faces or figures: parents are voices, a door and an armchair; the cat is the only creature.
- [x] Every ayah, dua and explanation is copied verbatim (script-checked); no invented sayings.
- [x] No music; chimes with a mute toggle.

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: replace 107:7 on the "keep the dates" path | Done. `maun7` removed from the game. The keep path now says "Even one small date shared is a good deed, and Allah sees every bit of good. Shall we try again?" and shows 99:7 (copied from the Az-Zalzalah page). |
| 2 | MUST (adab): «يا إلهي!» for "Oh no!" | Done: «أوه، لا!». |
| 3 | SHOULD: 17:23-24 in the uff branch and as the closing parents' dua | **Not added (by instruction):** not on a verified site page yet. TODO-SCRIPTURE block in the script records the ruling and the exact slots; Nuh's dua (71:28 opening) stays meanwhile, as approved. |
| 4 | (1) truthfulness hadith (al-Bukhari 6094, Muslim 2607) | **Not added:** needs a site page with its reference and a wording check against sunnah.com/dorar.net. Al-Asr 103:3 stays as the approved interim grounding. TODO recorded. |
| 5 | (2b) sharing hadith (al-Bukhari 13, Muslim 45) | **Not added:** same condition. TODO recorded. |
| 6 | NOTE: lantern per good choice is fine (no count, no score) | Unchanged. |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Done. `bloom()` was a 3-note rising run; now two notes. No Quran or dua audio; the read-aloud speaks only game prose. |
