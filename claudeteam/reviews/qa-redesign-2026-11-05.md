# QA: app-style redesign (ui-refero-refresh), 2026-11-05

Scope: commits 4dc4d42, 7e144de, 506e42e, dc57c6c, e97e803, 95049f3, c7cb2d3 (after 02a4bfb).
Method: I checked everything myself and did not use the lead's numbers as a starting point.
- I served the site with `Cache-Control: no-store` (python, port 8791) and served a `git archive 02a4bfb` copy the same way (port 8792) to compare before and after.
- Tests ran in headless Chromium through Playwright 1.64.
- Each test run started in a new browser context. An init script cleared `localStorage` and set `islamicKidsLang` once. Every run then asserted `<html lang>`, `dir` and the stored value before testing anything.
- I wrote nothing in the repo except this file.

**Verdict: PASS. Nothing blocks the push.** The findings below are minor, and most of them existed before this branch.

## Reproduced checks

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Six verifiers (scripture, quizzes, narration, chain, illustrations, no-recitation) | PASS | All exit 0. no-recitation prints its standing INTERIM banner (AR_VERSE_AUDIO false, 0 Arabic verse mp3s). |
| 2 | Quran text unchanged vs 02a4bfb | PASS | Compared 27 files (21 surahs, ayat-al-kursi, 5 stories). I parsed nested markup, not regex. First pass: quran-text / arabic-full / full-bismillah / data-ayah, 52 elements, all identical. The brief's list misses the per-verse `p.arabic` and `.arabic-large` bismillah, so I widened it: 221 elements, all identical. I also compared every text node or attribute with 3 or more harakat across all pages: identical except one new non-Quran footer line on index.html. No diacritised Arabic changed in any JS diff. |
| 3 | No Google Fonts | PASS (site) | No DOM link and no request in 176 page loads. The remaining mentions are in place-surah-plates.py (a strip pattern), app_shell.py (a strip regex) and print/tools/make-print.js (the print pipeline, not the site, and not changed here). |
| 4 | 0 infinite animations on story, surah and hub pages | PASS (at load) | `document.getAnimations()` iterations==Infinity is 0 on index, stories, quran, all 5 stories, all 21 surahs and kursi, EN and AR at 390 and 1280. The Nuh game and the mockups still have some (expected). See F3 for one that starts at runtime. |
| 5 | No control under 44px | PASS (one pre-existing exception) | Open sheets and the open Yusuf narration panel are all at least 44px (some round to 43.9). Exceptions: the skip link is 130-140x42 when focused, and the Yusuf `#fullscreenToggle` is 40x40 at 390, which was the same in 02a4bfb. The sweep also flagged the closed `<details>` content and the 1x1 visually-hidden skip link; both are false positives. |
| 6 | 0 console errors, every page, EN and AR, 390 and 1280 | PASS | 44 pages x 2 langs x 2 widths = 176 loads. 0 console errors, 0 pageerrors, 0 HTTP >= 400, 0 horizontal overflow, start state asserted on every load. mockups/games/index.html has no bilingual layer, so it stays `lang=en` (expected). External requests were stubbed: GoatCounter on index and YouTube embeds. Unstubbed, the YouTube iframe logs a third-party "compute-pressure" permissions-policy message. |
| 7 | Lead's before/after (390, Nuh) | PASS, one number differs | Text column 119px@15.2px -> 358px@18.4px; play button y=1306, 26px wide -> y=763, 56x56; infinite animations on Nuh 12->0, index 1->0, Ikhlas 8->0 (stories.html and quran.html were 6->0) all match. Sub-44 targets: I get 5 -> 0, the lead quotes 21 -> 0. The "after" figure matches; the "before" count depends on counting method. |
| 8 | Cache-busting | PASS (site) | All 12 edited CSS/JS files are referenced as `?v=20261105` on every site page. Unversioned refs remain only in internal mockups: `../../styles.css` (6 pages) and `../../surah-narration.js` (2 pages). |
| 9 | Repo hygiene | PASS | Clean tree, no secrets. New binaries: 3 small PNG icons (4-11 KB) and 3 woff2 files (16-46 KB) with OFL/ISC licences. Largest edited file is stories.css at 67 KB. 847 local href/src refs in 44 pages all resolve. All 17 sprite icon ids exist. |

## Functional regression hunt

| Area | Result | Evidence |
|---|---|---|
| Story reader: Adam 18, Nuh 16, Ibrahim 16, Musa 20 pages, EN and AR | PASS (120/120) | All behaviours below held in every story and language:<br>- Loads on page 1 with the other pages `inert` and `aria-hidden`. A control on a hidden page cannot be focused. Prev is disabled.<br>- Next button, arrow keys (forward key is ArrowLeft in AR) and swipe in both directions (reversed in AR) all turn the page.<br>- The live region reads "Page 2 of 18: The Gift of Life" (AR: "صفحة ٢ من ١٨: …").<br>- AR mirroring: prev sits on the right, and the chevron has `matrix(-1,0,0,1,0,0)`.<br>- Narration requests and plays `audio/<story>/<lang>/slide-1.mp3` (Ibrahim: `paused=false`, currentTime 1.9s).<br>- Reload resumes at the saved page, `?resume=0` opens page 1, and Start over in the sheet returns to page 1.<br>- On the last page, Next is disabled and the story is marked done. No errors. |
| Mini-games and quizzes | PASS | Ibrahim sky choice: a wrong answer says "Amina, Try again!" and the right one gives +2 stars. Kaaba: 9 stones fill the rows, the button disables and +3 stars. Emotion check responds. Final quizzes on Adam, Nuh, Ibrahim and Musa: one wrong try, then 3/3, then it auto-advances to results. Nuh and Musa mini-quizzes pass. All EN and AR. |
| Yusuf scroll page | PASS | Stays classic-scroll (no reader, 8 scenes). The play button narrates slide-0.mp3. The final quiz shows results at 3/3. No errors in EN or AR. |
| Surah pages (21) and kursi | PASS | Read / Practice / Recite hide the right parts, "Show meaning" reveals, and the stage persists on reload.<br>EN: the mini player plays `en/verse-1.mp3` with no speech fallback. Verse 1 gets `.is-narrating` and `aria-current`, and the player says "Verse 1 of N". A per-verse listen on verse 2 moves the highlight.<br>AR: the player and verse buttons are `aria-disabled` and say "السرد بالعربية قريباً". Clicking them makes 0 mp3 requests, 0 speechSynthesis calls and no highlight.<br>Quiz: one wrong try, then n/n with results shown.<br>(The AR quiz rows read FAIL in my log only because my script parsed "٤" as NaN.) |
| quran.html badges, Home progress row | PASS | The badge cycles without following the card link (`{"surah-fatiha.html":2,"surah-al-ikhlas.html":1}`). Home then shows Stories 1, Memorised 1, Learning 1 (AR uses Arabic-Indic digits), and the Adam tile shows "Finished". |
| Home | PASS | No default name: the greeting is just "Assalamu alaikum" with "Add your child's name". The name saves, persists, clears, and Esc saves too. With no progress the card says "Tonight's story". After reading Nuh to page 6, the card says "Continue reading … page 6 of 16", Continue opens page 6 and Start over (`?resume=0`) opens page 1. The tab bar has 3 tabs, `aria-current` on the right one, and is 64px tall. |
| PWA manifest | PASS | Valid JSON. icon.svg exists; the PNGs are 192x192, 512x512 and 180x180 (apple-touch). Linked from index.html. |
| Bedtime | PASS | The Home moon sets `data-theme=bedtime` and stores `islamicKidsBedtime=on`. It carries to the surah page (body rgb(42,37,32)). The reader sheet switch shows checked and turns it off. |
| Language switching | PASS | Toggling on a surah page while narration plays stops it. The page goes to AR/RTL and "Show meaning" becomes "أظهر المعنى". The next page opens in AR. The reader sheet's language control relabels the page counter. |
| games/nuh-ark.html and mockups | PASS (loads, links back) | No errors. Nuh game: pixel-identical to 02a4bfb at 390, and its back link goes to `../story-prophet-nuh.html`. Mockups 02-05 link back to their stories. Mockups 06-10 have no back link, the same as before (they were not changed). Visual regression in F2. |

## Findings (none block the push)

- **F1 (new, minor): Enter in the Home name field re-opens the sheet.** The keydown handler in UI/home.js (`if (e.key === 'Enter') close();`) closes the dialog. Focus then returns to the opener (#homeSettings or #nameEdit), and the same Enter press activates that button. The sheet re-opens straight away. The name is still saved. Fix: call `e.preventDefault()` before `close()`. Reproduced in EN with and without a name.
- **F2 (new, internal pages only): mockups now render body text in bold Baloo 2.** styles.css now declares `'Baloo 2'` with only the 700 and 800 faces. The mockups ask for `'Baloo 2'` at 400, so Chrome draws paragraphs with the 700 face. Before this branch the font never loaded and the text fell back to system-ui. Seen on 06-deeds-garden, 07-ayah-lanterns and 09-honest-choices. No site page draws Baloo below weight 600 (checked 8 pages, EN and AR). These mockups also load the edited styles.css and surah-narration.js without `?v=`.
- **F3 (pre-existing): an infinite animation starts after the Kaaba game.** Completing it appends a kaaba with an inline `kaabaGlow 2s infinite` (interactive-story.js, which this branch did not change). The count at load is still 0.
- **F4 (pre-existing): English left on Arabic pages.** The surah quiz retry text "Not quite! Try again! / Try Again" (surah.js), the Kaaba "🕋 Complete!" and Yusuf's "NN% Complete".
- **F5 (pre-existing, Yusuf only):** the floating fullscreen button is 40x40 and partly under the header at 390. Yusuf still has the v1 header; the lead logged this as deferred.
- **F6 (UX, for the lead to judge):**
  - The reader bar has two speaker icons side by side: the effects toggle (emoji) and the read-aloud toggle.
  - "Back to Stories / Next Story" shows under every page of the reader, and its arrows do not mirror in AR (old markup).
  - The skip link is 42px tall when focused.
  - home.js's header comment promises a "Keep learning" surah card that `pick()` does not implement.

## Blocks pushing
None.
