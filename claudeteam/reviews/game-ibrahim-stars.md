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
