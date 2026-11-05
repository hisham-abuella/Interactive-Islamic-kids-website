# Learning review of the UI shortlist (2026-11-03)

Reviewer: kids-learning-designer. Review only, no site files edited.
Input: `claudeteam/reviews/ui-reference-research-2026-11-03.md` (Refero / Hairline / Aceternity shortlist).
Lens: a 5-11 year old, usually with a parent reading aloud at one screen, often at bedtime.
Method: walk each page as the child on day 1, day 7 and day 30.

## What already exists (the research did not mention it)

Some of the "missing" learning scaffolding is already built, so proposals should extend it rather than duplicate it:

- **Training wheels exist.** `UI/surah.js` `initStagePicker()` gives every surah page (22 of 22) a Read / Practice / Recite picker. Practice drops the transliteration. Recite shows only the Arabic, with the meaning one tap away. The choice is remembered per surah. Good.
- **A memorization map exists, but only on `UI/quran.html`.** `UI/quran-progress.js` adds a badge to each card that cycles not started / learning / memorized, a "You have memorized N of M" count, and a "Pick up where you left off" link.
- **Gaps in that map:**
  - The child sets the state themselves through a small badge nested inside a card link. A 5-year-old will tap it by accident or to see the star.
  - Nothing on the surah page itself feeds the map. Reaching Recite never asks "can you say it now?"
  - The hub (`UI/index.html`) shows none of it.
  - When nothing is in the "learning" state, there is no suggestion of what to learn next.
- **Stories have no saved progress.** The only exception is Ibrahim's star count (`interactive-story.js`). `UI/stories.html` and the hub cannot tell a child which prophets they have already met.
- **Surah audio is meaning narration, not recitation.** `UI/surah-narration.js` reads the translation and explanation, and deliberately does not read the Arabic. Any "highlight the verse during recitation" idea really means "during the meaning narration" until there is qari audio, and whether to add qari audio is a call for `islamic-content-scholar`.
- **Story-end reward is a YouTube embed** (e.g. `UI/story-prophet-nuh.html`, "Bonus Video Unlocked"). The reward for learning takes the child to another site, which conflicts with the no-external-links principle. It should be replaced (see pick 3).

## Verdict on each shortlist idea

| # | Idea | Learning verdict | Why |
|---|------|------------------|-----|
| 1 | Calm the infinite loops; no `transition: all` | **Do: high (enabler)** | Endless twinkle, bounce and pulse loops compete with the text for a young child's attention. This matters most at bedtime. Cheap, and needed before any highlight effect can stand out. |
| 2 | Cross-fade slides | Do: low-medium | Softer page turns help a little with orientation. Keep the move short (24px or less) so the eye lands on the text, not on the motion. |
| 3a | Words *appear* with narration (Text Generate Effect) | **Reject** | When a parent reads aloud, they read ahead and from the page, so text that is not yet there breaks reading aloud. Hiding words also stops a confident 9-year-old from reading ahead. |
| 3b | Highlight the line being narrated | **Do: high, as sentence-level** | Pointing at the print while reading ("print referencing") is one of the best-supported early-reading techniques for ages 5-7. The current audio is one mp3 per slide with no timings, so whole-sentence highlighting is the realistic first step. Word-by-word karaoke needs alignment data, for example made offline with Whisper, which must go through the `ram-gate`. Karaoke is worth it only for the 5-7 group, and a parent toggle should switch it off. |
| 4 | Highlight the verse being narrated on surah pages | Do: medium | Helps the child keep their place across 6-11 verses, and the cost is low. If qari audio is ever added, this becomes the core of a listen-and-repeat memorization loop, and the payoff is high. |
| 5 | Focus cards + candle-light sheen (hover only) | Neutral polish | No learning value, and tablets do not hover. Fine as polish, not a priority. |
| 6 | Hairlines over shadows; no pure #fff/#000 | Neutral | Reduces visual noise slightly. This is a design-system task. |
| 7 | Serif reading face for narration/translation | **Caution** | An editorial serif such as Literata or Source Serif suits an adult reader. Early readers decode more easily with a plain sans that has the single-storey "a" and "g" used in schoolbooks (e.g. **Andika**, built for beginning readers). Keep sans for story text. A serif is acceptable for the parent-facing explanation text only. |
| 8 | Before/after reveal slider | Medium, only where the story is a change | Strong when the story is about a change: Nuh's dry land and the flood, the sea before and after it parts for Musa, the fire made cool for Ibrahim. A slider the child drags is a direct-manipulation moment, so it is closer to a mini-game. Skip it elsewhere. Scholar sign-off is needed on how each miracle is shown, with no depiction of prophets. |
| 9 | Recap card stack at story end | **Do: high, if it is retrieval** | A stack of summary cards to read is re-reading, which teaches little. A stack where each card shows a picture or question first and the child or parent says the answer *before* flipping is retrieval practice. Make it "put the cards in order" for sequencing. See pick 3. |
| 10 | View Transitions hub card to story header | Low | Small orientation benefit ("this is the card I tapped"). |
| 11 | Shamsa draws itself on surah completion | **Do: high, if earned per verse** | Played as a one-shot animation when the page ends, it is decoration. If one segment of the shamsa completes for each verse recited unaided in Recite stage, it shows progress in a form a child can see: "two petals left". See pick 2. |
| 12 | One featured "Tonight's story" card | **Do: high, if driven by state** | A hand-picked featured card answers nothing for the child. A card filled from the child's progress ("Next: Surah Al-Kawthar, 3 short verses" / "Continue Prophet Musa") answers the hub's biggest question: what do I do now? See pick 1. |
| 13 | Static lantern glow behind title | Neutral | Decorative. |
| 14 | Illustration parallax | Skip | Motion with no learning payoff, and a distraction risk. |
| - | Prophets timeline (Aceternity Timeline) | Medium-high | Gives the child a mental map of who came first and how the stories connect. The gold line can fill as stories are completed, which turns it into the stories half of the progress world. Order is a scholar check. |
| - | Hand-drawn underline for vocabulary words | Medium | Stories currently have no vocabulary support. Underline 1-2 key words per story (Ark, prophet, du'a, sabr). Tapping one gives a simple definition and the Arabic word. This builds vocabulary without adding text to the slide. |
| - | Animated EN/AR tab pill | Neutral | Polish. |

## The 3-5 changes with the biggest learning payoff (ranked)

### 1. A "What's next" path on the hub, backed by real progress (research missed most of this)
On day 1 the hub is fine. By day 7 the child cannot see what they have done. By day 30, with 22 surahs and growing, it is a flat grid with no direction.

- Put the memorization map from `quran-progress.js` on `index.html`. Add story completion (mark a story finished when the end-of-story recap is reached) under the same localStorage-only, no-account rule.
- Replace "Featured Stories" with **one state-driven card**, filled in this order of priority:
  1. Continue a surah in "learning".
  2. Otherwise, the next not-started surah in the ramp order already used on `quran.html`, shortest first.
  3. Otherwise, the next prophet story.

  Example card text: "Next for you: Al-Kawthar, 3 short verses". This is the "Tonight's story" idea done properly.
- Fix the input. Move "mark memorized" off the tiny badge-inside-a-link and onto the surah page (pick 2), so the state means something.
- **Games link:** this is where the kids-game-designer's progress world belongs. Surahs memorized and stories completed are the only inputs that move it. Game rounds can decorate it but must not be its currency, because collectables must not become the point. Make it a calm world that grows (a garden, a courtyard of shamsas, a night sky of lamps), not a scoreboard. Coordinate before either side builds it.

### 2. Close the memorization loop on surah pages: the shamsa completes per verse
Read / Practice / Recite exists, but nothing gets the child from Recite to "I know it", and nothing records that they did.

- In Recite stage, add **cover-and-say per verse**: the Arabic is hidden, the child says the verse, then taps to check. Add a middle cue level between Practice and Recite that shows **only the first word** of each verse. First-word cues are the classic scaffold for hifz.
- Each verse the parent confirms "said without looking" fills one segment of a shamsa beside the title. This is research item 11, but earned.
- When the shamsa is complete, ask "Mark Al-Kawthar as memorized?". That answer feeds the map in pick 1. On day 30, show completed surahs with a full shamsa and offer a gentle "review" button. Spaced review matters more than new surahs once a child has 5 or more.
- Verse highlighting during narration (research item 4) fits into this view.
- **Games link:** a "first-word cue" or verse-ordering game is a natural review activity for surahs already marked memorized.

### 3. Turn the story end into retrieval plus talk, not a video
At present the end of a story is a 3-question recall quiz, then a YouTube unlock.

- Replace the video unlock with the **recap card stack** (research item 9), built for retrieval:
  - 4-6 cards, each showing a scene picture with "What happened here?" on the front.
  - The parent and child answer aloud, then flip the card.
  - The last card is a "Why do you think...?" discussion prompt for the parent.
- An optional "Put them in order" mode turns the stack into sequencing practice.
- The reward is the story's shamsa or lamp lighting up in the progress world (pick 1), not leaving the site.
- Keep the quiz but improve it. Mix in one "why" question per story and keep checking that the correct answer is not the longest option. The current Nuh quiz passes that check.
- **Games link:** the sequencing deck is a lightweight cousin of a sequencing game. Share the card art and data so the two do not drift apart.

### 4. Sentence highlighting synced to narration, on story slides
- Research item 3, but highlight the sentence, and never hide words.
- This helps 5-7 year olds link spoken words to print, and lets a child who is not being read to follow along with the audio.
- Add a parent toggle, off by default for confident readers.
- Word-level karaoke is a phase 2, needing offline forced alignment through the `ram-gate`.
- Cap text per slide while doing this: Musa has a 63-word paragraph and Yusuf one of 52. Above roughly 35 words, a slide is too much for a 6-year-old to track; split it.

### 5. Calm the motion first (research item 1, plus 2)
- This makes no lesson by itself, but every other highlight in this list depends on the page being still enough for the highlight to be the only thing moving.
- Bedtime use makes this a learning issue as well as a style one.
- Do it first because it is cheap.

## Other gaps the research did not cover
- **Story quizzes and surah quizzes are a fixed length** (3 and 4 questions), whatever the length of the story or surah. Ayat al-Kursi and Al-Kawthar should not get the same quiz.
- **Surah pages still have almost no hands-on interactivity** compared with the stories. Picks 2 and 4 are the cheapest ways to give them some.
- **Font choice for early readers** (see item 7). Do not move child-facing text to an adult editorial serif.

## Hand-offs
- `islamic-content-scholar`:
  - Whether to add qari recitation audio.
  - Before/after miracle imagery.
  - The prophets timeline order.
  - The wording of the "memorized" confirmation.
- `kids-game-designer` (UI/mockups/games/): agree on one progress world for the hub (pick 1), with memorized surahs and finished stories as its only currency. Share the recap card data with any sequencing game.
- `frontend-lead`: picks 4-5 and font choice.
