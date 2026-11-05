# Game spec: My Learning Garden / حديقة ما تعلّمت (mockup 06, formerly "The Deeds Garden")

Status: MOCKUP at `UI/mockups/games/06-deeds-garden.html`. Placeholder art (graphics redesign pending). Not linked from the hub. Needs sign-off from the scholar and the learning designer before a real build.

- **Learning goal:** After playing, the child can walk a parent around their garden and, for each plant or lantern, say what that story or surah taught them.
- **Age band:** 5-11 (recall cards are read aloud by the parent; the 🔊 button reads them for pre-readers).
- **Tied to:** site-wide progress. 5 story beds (Adam, Nuh, Ibrahim, Musa, Yusuf) and 22 surah lanterns (Al-Fatiha, Ayat al-Kursi, then the Juz Amma surahs on the site, in mushaf order).
- **Core loop:** finish a story or surah, so a plant grows or a lantern lights, then tap it to recall what was learned and talk about it.
- **A visit (2-5 min):** open the garden, tap "Show a grown-up around" (a guided tour of everything that has grown), the child retells each item and the parent asks the question on its card, then "Goodnight, garden" dims the courtyard.
- **Growth stages:** plant: seed, sprout (story started), grown (finished), in bloom (story game done). Lantern: unlit, lit (read together), golden (memorised). In the mockup these are set by the demo panel; in the real site they would come from the story/surah pages.
- **Pause points:** every recall card has a "For the grown-up · ask" question. Surah questions are copied from each page's "For the grown-up reading" box; story questions are new and need the learning designer's review.
- **Feedback:** a soft bloom animation and a two-note chime when something grows. An unread item says "This seed is waiting for the story of ..." and suggests reading it together.
- **No pressure:** nothing wilts or decays, there are no streaks or day counts, and the hub card shows only "N plants growing · N lanterns glowing".
- **Storage:** `localStorage["mockup.deedsGarden.v1"]` only. It never touches `islamicKidsLang` or any production key.
- **Hub:** a preview card at the bottom of the mockup shows how it would sit on `index.html` (mini garden plus a "Visit your garden" button).
- **EN/AR/RTL:** all strings come from one dictionary; the grid mirrors under `dir="rtl"`; numbers use Arabic-Indic digits in AR.
- **Accessibility:** every item is a `<button>` of 64px or more, with an aria-label giving its name and stage. The dialog closes with Esc and focus returns to the item. Reduced motion is respected.

## Guardrail checklist
- [x] No prophet, Companion or angel depicted: plants and lanterns only.
- [x] Scripture: each lantern's first ayah is copied verbatim from its surah page (checked by script, see the qa note below).
- [x] Story "remember" lines paraphrase the story pages; the lesson lines are copied from each story's lesson list.
- [x] No music; soft sine chimes with a mute toggle.
- [x] Scholar (approved 2026-11-03): "lantern per surah, plant per story" framing, and the first ayah on a recall card in scripture styling.
- [ ] Owner: should progress ever be shared between devices? (Recommend no: local only.)

## Scholar gate 1 (spec), 2026-11-04
Ruling: `claudeteam/reviews/game-islamic-review-2026-11-03.md` (verdict for this game: **APPROVED WITH FIXES**). All fixes below were applied by `kids-game-designer` on 2026-11-04. Gate 1 closes when the scholar confirms them. Gate 2 (art) and gate 3 (build) are still open.

| # | Ruling (severity) | Resolution |
|---|---|---|
| 1 | MUST: Ayat al-Kursi icon is a chair (🪑) | Done: replaced with an eight-point star (✴️ placeholder; final art: gold eight-point star). |
| 2 | MUST: rename "The Deeds Garden" / «حديقة الأعمال» | Done: "My Learning Garden" / «حديقة ما تعلّمت» in the title, `T.title`, the header comment and the hub index card. Storage key renamed to `mockup.learningGarden.v1`. The file name `06-deeds-garden.html` is kept so links resolve; rename it when the game is built for real. |
| 3 | MUST: Nuh "remember" line is the Biblical dove | Done: "Allah told Prophet Nuh to build the ark, and it came to rest safely on Mount Judi." The plant is now a palm (was an olive, which echoed the leaf). |
| 4 | SHOULD: "cool like a garden" | Done: "Allah commanded the fire to be cool and safe for Ibrahim, and he came out unharmed." AR avoids the Quranic wording (TTS may read it): «أمر الله النار أن تكون باردة آمنة لإبراهيم». |
| 5 | SHOULD: dangling recap lines (Al-Bayyinah, Al-Adiyat, At-Takathur) | Done: rewritten to stand alone (98:5 sincerity; 100:6 gratitude; 102:8 being asked about blessings), EN and AR. |
| 6 | NOTE: "Allah noticed it" | Done: "Allah knows every good thing you do" / «الله يعلم كل خير تفعله». |
| 7 | Adab: ﷺ after the Prophet | Done: the Al-Lahab parent question now says "family of the Prophet ﷺ" in EN (AR already had it). |
| S | Sound (owner decision pending): no melodies, one tone or a two-note chime | Already compliant: single tones and one two-note chime. No Quran audio; the read-aloud speaks only the recap and question, never the ayah. |

Site-level item still open (owner): "Allah noticed" on `surah-az-zalzalah.html:90,422`.
