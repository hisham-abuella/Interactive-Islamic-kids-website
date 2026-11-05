# Frontend UI review: presentations and main site (2026-11-03)

Frontend Lead, review only. No site files were edited. This audits the code against
`claudeteam/reviews/ui-reference-research-2026-11-03.md` and adds problems the research missed.

**How it was checked.** `UI/` was served from a no-cache static server (port 8791, `Cache-Control:
no-store`). Playwright 1.64 / Chromium loaded index, stories, quran, surah-fatiha and
story-prophet-adam at 1024x768 (tablet) and 390x844 (phone, touch), in EN and AR, plus a
reduced-motion pass. Screenshots and `metrics.json` are in
`/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/ui-review/`.
The `*-scrolled-full.png` files were taken after scrolling the whole page, so the scroll-reveals had fired. The other `*-full.png` files were not.

---

## 0. The headline: the research missed the biggest problems

The research is about polish: motion, hairlines and serif faces. The browser shows problems that matter more to a child.

| # | Problem | Evidence |
|---|---|---|
| A | **On a phone the story slideshow is unusable.** The illustration is a 117px postage stamp and the text sits in a **156px column**, about 4 words per line. | Probe at 390px: `.story-container` padding 48px (`stories.css:258`, never reduced on mobile), plus `.story-main` 32px (`:248`), plus `.story-slide` padding, plus `.story-scene` padding. The scene is 156px wide. Screenshot `story-prophet-adam-en-phone-slide1-scrolled.png` |
| B | **The first slide renders blank** until the child scrolls it into view. In a full-page capture the whole slide is empty. | `stories.js:494-499` sets inline `opacity:0; translateY(30px)` on every `.story-scene` and waits for an IntersectionObserver. At 390px the slide box starts at y=751, below the fold. This is the surah.js failure mode in a second file. 10 of 10 scenes measured at opacity 0 on load. `story-prophet-adam-en-phone-full.png` |
| C | **The hub's cards are invisible without JS/IO.** `.fade-in` is `opacity:0` in plain CSS (`styles.css:746`). Only the inline IO in `index.html:191-200` adds `.visible`. | `index-en-tablet-full.png` shows the hub with every story, surah and learn card missing |
| D | **On tablet the slide hides its own text.** The slide is capped at `max-height:60vh` (`stories.css:938,958`) and the 16:9 plate fills it, so the scene title and paragraph need an *inner* scroll inside a horizontally swiping box. | `story-prophet-adam-en-tablet-full.png`: slide 1 shows only the picture |
| E | **The story starts below the fold.** Slide box top is at y=622 (tablet, 768 high) and y=751 (phone). The play-narration button is at y=1280 / y=1370. A child sees a welcome pill, an emoji globe, a 2-4 line title and a progress bar. The story and the play button are off screen. | `metrics.json` (`slides`, `narr`) |
| F | **The narration bar is a foreign object.** `audio-narration.js:106-296` injects its own `<style>` with off-palette hex (`#1e3a5f`, `#2d5a87`, `#10b981`, `#14b8a6`, `#f59e0b`, `#d97706`), a black shadow, and an emerald "speaking" toast. On phone its buttons are squashed to **22-26px wide** because they shrink as flex items. | metrics: `narration-btn play-btn:26x45`, `advance-btn:22x38`. This breaks hard rule 1 (it is a JS sheet, so the CSS audit never caught it) |
| G | **Keyframe name collisions.** The injected sheet defines `@keyframes pulse` and `@keyframes fadeInUp` (`audio-narration.js:212,290`). It is appended after `stories.css`, so it **overrides** `stories.css:350` `fadeInUp` and `:397` `pulse`. Every `.story-scene` entrance therefore animates `translate(-50%, 20px)`, a horizontal lurch. `.mini-quiz` loses its gold ring pulse and gets a 2s opacity blink instead. `interactive-story.css` also redefines `bounce`, `twinkle` and `fadeIn` over `stories.css`. | grep of `@keyframes` across sheets |
| H | **RTL is double-flipped on story, stories and quran pages.** `bilingual.js:45` sets `dir="rtl"`, which already reverses flex rows. `stories.css:1361-1371` then adds `flex-direction: row-reverse` to `.navbar`, `.nav-links` and `.logo`, which flips them **back to LTR**. In Arabic the logo is on the right on index and surah pages but on the **left** on stories, quran and story pages. The same pattern appears in `interactive-story.css:783-814` (choice/emotion/drag rows) and in the narration bar (`audio-narration.js:221`). | metrics: `logo.x` = 844 (index-ar) vs 32 (stories-ar, story-ar). `story-prophet-adam-ar-tablet-slide2.png` |
| I | **The slideshow is not RTL-aware.** The track is forced to `direction:ltr` (`stories.css:1486-1493`), swipe-left always means next (`stories.js:736-748`), the arrows are fixed `◀ ▶`, the dots fill left to right, and the counter reads "18 / 2" in AR. "← العودة للقصص" points the wrong way. An Arabic book turns the other way. | AR screenshot above |
| J | **Overlapping fixed controls.** The fullscreen toggle (`stories.css:1517`, top 100 / right 80) sits on top of the stars counter (`interactive-story.css:6`, top 100 / right 20). Both float over the card on phone. | Every story screenshot |
| K | **Tap targets fail the 44px floor** on story pages: sound toggle 40x40, fullscreen 40x40, slide dots 8-18px (`stories.css:1219,1970`) and clickable, narration buttons 22-26px wide, quiz options 43px. | metrics `small` |
| L | **Type shrinks on phone, which is backwards for children.** `.story-slide .scene-text p` drops to 0.95rem (`stories.css:1243`) and quiz options to 0.85rem (`:1253`). There are 32 distinct `font-size` values across the sheets and no type scale tokens. The h1 on stories/quran stays 48px at 390px. | `stories.css:1172-1300` |
| M | **The hub undersells the stories.** Hub cards use emoji roundels (Nuh **and** Musa are both 🌊; `index.html:57,87`). The painted cover plates already exist and are used on `stories.html`. **Adam is missing from "Featured Stories"**, so the fourth card orphans on a 3-column row. Two "Learn About Islam" cards are dead `<div>`s (`index.html:151,156`). "Explore Activities" is a `<button>` that goes nowhere (`:174`). | `index-en-tablet-scrolled-full.png` |
| N | `story-styles.css` is **loaded by no page** (grep finds no `<link>`). It is dead code. Its 2 infinite loops and 3 `transition: all` do not matter. Delete it instead of fixing it. | grep |
| O | `<meta name="theme-color" content="#0d9488">` on 30 pages is the pre-redesign Tailwind teal, not `--turquoise-deep #0F6B65`. Story pages load **Noto Sans Arabic** (`story-prophet-*.html:11,15`); every other page uses Amiri. The Arabic voice of the site changes between pages. | grep |

Of these, A-B-D-E-F-H-I are the actual "presentation" UI problems. Fix them before any Aceternity-style effect, because no effect helps a slideshow a child cannot read.

---

## 1. Verifying the research's "current state" claims

| Claim | Verdict | Evidence |
|---|---|---|
| interactive-story.css has ~11 infinite keyframes | **True: 11** `infinite` uses, 15 `@keyframes` | lines 20, 59, 93, 117, 134, 144, 158, 168, 209, 525, 698 |
| "`transition: all .3s` everywhere" | **True, and wider than stated.** interactive-story.css 11, stories.css 12, surah.css 4, styles.css 1 (`:175`), plus injected `audio-narration.js:121` | grep `transition:\s*all` |
| No reduced-motion rules of its own | **True but softened.** `styles.css:861-875` sets `animation-iteration-count:1` and near-zero durations on `*`, and every page loads styles.css first. Reduced-motion users are already covered: the reduced pass measured 0 hidden cards on surah and story pages. The problem is the **default** experience: **25-26 infinite animations running at once** on a story page (12 distinct names; `metrics.json`). Hub 1, stories/quran 6, surah 8. | live `document.getAnimations()` |
| stories.css also loops | **True, not mentioned:** 12 infinite (`stories.css:20,394,566,624,662,694,870,1163,1693,1704,1834,1847`). surah.css 3 (`:20,62,229`). styles.css 1 (`crescentPulse :120`, on every page's logo) | |
| Slides: flex track + translateX 0.4s | **True**: `stories.css:945-950`, `stories.js:703` | |
| "4 shadows + glows" | **Understated.** 5 shadow tokens (`styles.css:61-65`), but **90 `box-shadow` declarations** in total (styles 27, stories 32, surah 18, interactive 6, story-styles 7). Only 15 use a token. **23 use pure black `rgba(0,0,0,…)`** (stories 12, surah 7, interactive 3, styles 1) | grep |
| "2px borders" | **Understated.** 3px-or-thicker borders: stories 17, interactive 9, surah 7, styles 5. `.story-container` is `3px solid` (`stories.css:259`), `.mini-quiz` `3px` (`:393`) | |
| Pure #fff/#000 leftovers | **True.** `background: white` / `#fff`: surah 7, interactive 5, stories 4, styles 2. `.story-container { background: white }` (`stories.css:255`) is the largest surface on a story page. `--card: #FFFDF8` already exists for this | |
| Nunito + Baloo 2, Amiri for Arabic | True on hub/surah. **False on story pages** (Noto Sans Arabic). See O | |

---

## 2. The shortlist, item by item

Effort: S = under 2h, M = half a day to a day, L = more than a day / touches every story.

### 1. Calm existing motion. **ADOPT (raise to Phase 1)**
On a page about an illuminated manuscript, 25 things pulsing at once read as a slot machine. The ornament should rest. The rest pose is the design.
- Policy: **at most one ambient loop per viewport**, at least 6s, opacity/transform only, amplitude 4px or 1.03 scale or less. Everything else becomes a **one-shot** entrance or a response to a tap.
- Keep as one-shot: `tapHint` (play 3 times, then stop: `animation-iteration-count: 3`), `celebratePulse` (once on correct), `starPulse` (once on star award).
- Delete: `crescentPulse` (logo, every page), `fireFlicker 0.5s alternate` (`interactive-story.css:158`, flicker at 2Hz, a photosensitivity smell), `bounce 1s infinite` (stories `:624,:870`), `sparkle`, `twinkle` x3, `glow` (surah `:229`, stories `:566`), `pulse` on `.mini-quiz`, `iconBounce`, `swipeHint`.
- Keep one: `floatStar 8s` or `float 6s` on a single decoration, not both.
- Replace every `transition: all .3s ease` with explicit properties via tokens:
```css
:root{
  --ease-out: cubic-bezier(.2,.7,.2,1);
  --dur-1: 160ms; --dur-2: 240ms; --dur-3: 400ms;
  --t-press: transform var(--dur-1) var(--ease-out), background-color var(--dur-2) var(--ease-out),
             border-color var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out);
}
.choice-btn, .quiz-option, .nav-btn, .mode-btn { transition: var(--t-press); }
```
- **Rename the keyframes** in the injected narration sheet (`narrPulse`, `narrToastIn`) or, better, move the sheet into CSS (see item P1-F). This fixes collision G on its own.
- Effort **M**. Files: `interactive-story.css`, `stories.css`, `surah.css`, `styles.css` (tokens plus `crescent`), `audio-narration.js`.

### 2. Cross-fade slides. **ADAPT**
A page turn in a manuscript is a quiet change, not a carousel whoosh. But the real problem is item I (RTL) and D (60vh clipping). Rebuild the slide view once and do all three together.
- Drop the translateX track. Stack slides in one grid cell and show one with `[hidden]`/`.is-current`. RTL then needs no transform maths, and the IO-reveal problem goes away.
```css
.story-slides { display:grid; }
.story-slide { grid-area:1/1; opacity:0; visibility:hidden;
  transition: opacity var(--dur-2) var(--ease-out), translate var(--dur-2) var(--ease-out), visibility 0s var(--dur-2); }
.story-slide.is-current { opacity:1; visibility:visible; translate:0; transition-delay:0s; }
.story-slide.from-next { translate: calc(var(--dir,1) * 16px) 0; }
.story-slide.from-prev { translate: calc(var(--dir,1) * -16px) 0; }
html[dir="rtl"] { --dir: -1; }
```
- JS: `goToSlide` toggles classes. Use `document.startViewTransition?.(() => swap())` where it is supported (Chrome/Safari 18), with the class swap as fallback. Flip swipe direction and arrow keys when `document.dir === 'rtl'`. Mirror arrows with `html[dir=rtl] .slide-nav-btn { scale: -1 1 }`.
- Remove `max-height:60vh` and `overflow-y:auto` from `.story-slide`. Let the page scroll and lay the slide out as plate on top, text below (see P1-A).
- Effort **M**. Files: `stories.js` (`initializeSlideMode`, `updateSlideView`, `handleSwipe`, `handleKeyNavigation`), `stories.css:933-1000, 1481-1503`.

### 3. Words appear with narration. **ADAPT, Phase 3**
This is good for pre-readers, but only with real timestamps. `audio-narration.js:483-485` currently *estimates* duration at 150 wpm. A karaoke highlight driven by a guess drifts, and a drifting highlight teaches the wrong word. That is worse than none.
- Phase 3, once the voice pipeline emits word timings (Whisper word timestamps over the generated audio, a manual RAM-gated batch job). Wrap words in `<span>` at runtime. On `timeupdate`, add `.is-spoken` (gold underline `background: linear-gradient(var(--gold-pale),var(--gold-pale)) 0 100%/100% .35em no-repeat`). No per-word fade/blur: the text must be readable before the voice reaches it. Reduced motion: the underline only, no transition.
- Interim (Phase 2, S): while audio plays, highlight the **current paragraph** with a 1px `--rule-strong` left/inline-start rule. No timings needed.
- Effort **L** (data) / **S** (paragraph). Files: `audio-narration.js`, `stories.css`, `voice-scripts.js` (timing data).

### 4. Highlight the verse being recited. **ADOPT, Phase 1**
This is cheap and high value. `surah-narration.js` already tracks `state.playingIndex` (`:24,85,116`) but only changes button text. No `.playing` style exists in `surah.css`.
```js
// in refresh(): card.classList.toggle('is-reciting', on);
// in play(i): if (!matchMedia('(prefers-reduced-motion: reduce)').matches) card.scrollIntoView({block:'center',behavior:'smooth'}); else card.scrollIntoView({block:'center'});
```
```css
.verse-card.is-reciting { background: var(--gold-wash); border-color: var(--rule-strong);
  box-shadow: inset 3px 0 0 var(--gold); }
html[dir=rtl] .verse-card.is-reciting { box-shadow: inset -3px 0 0 var(--gold); }
```
Make scrolling optional in "Read all" only: auto-scroll is disorienting when a child taps one verse they can already see. Also force `opacity:1` on the reciting card, so it cannot be hidden by the surah.js reveal.
- Effort **S**. Files: `surah-narration.js`, `surah.css`.

### 5. Focus cards + candle-light sheen on the hub. **ADAPT (sheen only, later)**
The hub's problem is content (M), not hover. The audience is on tablets, so `:has(:hover)` dimming never fires for most children. Do the real fixes first: cover plates on hub cards, Adam added, dead cards fixed.
- Then (Phase 3) a static gold sheen on `:focus-visible` and `@media (hover:hover)` only: a `radial-gradient` at `var(--mx) var(--my)` set by one `pointermove` handler. Skip sibling dimming, which is a game-UI idiom and not a book one.
- Effort **S**. Files: `styles.css`, `index.html` (small script).

### 6. Hairlines over shadows, one warm shadow, no #fff/#000. **ADOPT, Phase 2**
This is exactly the Illuminated Page: vellum on vellum, ruled in gold ink, not floating plastic cards.
- Tokens in `styles.css`: `--hairline: 1px solid var(--rule)`, `--hairline-strong: 1px solid var(--rule-strong)`, and one `--shadow-page: 0 1px 0 var(--rule), 0 12px 32px -12px rgba(20,56,58,.18)` (warm ink, never black). Keep `--shadow-sm` for pressed buttons and alias `--shadow-md/lg` to `--shadow-page`.
- Replace the 23 `rgba(0,0,0,…)` and the 18 `background: white`/`#fff` with `--shadow-page` / `--card`. Bring 3px+ borders down to 1px rules, except the gold frame on the hero and the reserved red wrong-answer state.
- Remember hard rule 4: the remap must happen in the page-type sheets, where those values are hardcoded. Changing the tokens alone does not reach them.
- Effort **M**. Files: `styles.css`, `stories.css`, `surah.css`, `interactive-story.css`.

### 7. Serif reading face. **ADAPT**
Agreed for the parent-facing prose on surah pages ("Why is it special", tafsir). **Rejected for the story narration**: the readers are 4-9 years old, and early-reader research favours an open sans with single-storey a/g. Nunito is a good choice there. Keep Nunito for children's text and raise its size instead (see P1-L).
- Arabic: unify on **Amiri** for prose and **Amiri Quran** for ayat. Drop Noto Sans Arabic from story pages (O), or move to Noto Naskh if a sans proves more legible in testing. Either way, use one face site-wide.
- English serif (Literata or Source Serif 4) only for `.surah-info`, `.fact-card`, `.tip-card`. One extra Google Fonts family, CDN-only, which is fine.
- Effort **S**. Files: `story-prophet-*.html` (font link, 5 files), `surah.css`, `styles.css`.

### 8. Before/after reveal slide. **ADAPT, Phase 3, selectively**
This only works where the story has a real before/after: Nuh (flood/receded), Musa (sea closed/parted). It costs new plates and must go through the illustration pipeline. Sketch: two stacked `<img>` and `clip-path: inset(0 calc(100% - var(--p)) 0 0)`, driven by an `<input type=range>`. Flip with `inset(0 0 0 calc(100% - var(--p)))` under `[dir=rtl]`. The range input gives keyboard and screen-reader support for free. Make the thumb 44px.
- Effort **M** per story (art is the cost). Files: `interactive-story.css/js`, story HTML, `images/stories/*`.

### 9. Recap card stack at the end. **ADOPT, Phase 2**
The end of a story currently scrolls into quiz cards and then a video. A tap-through deck of 3-4 "what we learned" cards, each one plate thumbnail plus one sentence, is the manuscript's colophon. CSS: stacked grid cells, `rotate: calc(var(--i) * 2deg)` on the cards beneath, and one tap sends the top card to the back. No timer. The lessons are already in each story's `scene8Lesson*` i18n keys.
- Effort **M**. Files: `interactive-story.js`, `interactive-story.css`, 5 story HTML files.

### 10. Cross-document View Transitions, hub card to story header. **ADOPT, Phase 2, cheap**
`@view-transition { navigation: auto; }` plus a matching `view-transition-name` on the stories.html cover `<img>` and the story's first plate. Chrome and Safari 18.2+ support it. Elsewhere it does nothing, which matches "no build step". Reduced motion: wrap it in `@media (prefers-reduced-motion: no-preference)`.
- Effort **S**. Files: `styles.css`, `stories.html`, `index.html` (once hub cards have covers), `story-prophet-*.html`.

### 11. Line-art empty states; shamsa draws itself on completion. **ADAPT**
The shamsa draw-on is the right reward: it is the site's own mark and it rests when finished. Inline the `--shamsa` SVG once, at about 160px. Give each stroke `pathLength=1; stroke-dasharray:1; stroke-dashoffset:1`, animate it to 0 over 1.2s once, then fill the centre circle gold. Use it on surah memorised (`quran-progress.js`) and story complete. "Empty states" barely exist on this site, so skip those.
- Effort **S**. Files: `surah.js` / `quran-progress.js`, `interactive-story.js`, `styles.css`.

### 12. One featured "Tonight's story" card. **ADOPT, Phase 2**
This fits the bedtime mode (`bedtime.js`) well. One wide card on the hub using the cover plate, with the gold `--hairline-strong` frame: the single gold-framed card on the page (research item "one accent, one job"). Pick it by date (`dayOfYear % stories.length`) so it changes nightly with no server.
- Effort **S**. Files: `index.html`, `styles.css`.

### 13. Static lantern glow behind the surah title. **ADOPT, trivial**
A `radial-gradient(closest-side, rgba(224,183,92,.28), transparent)` pseudo-element behind `.surah-hero h1`, with no animation. This replaces surah.css's infinite `glow` (`:229`) and `pulse` (`:62`).
- Effort **S**. Files: `surah.css`.

### 14. Illustration parallax. **REJECT**
Plates are painted as flat miniatures, and depth contradicts the style. Small movement buys nothing on tablets (no pointer) and costs a rAF loop. The research itself ranked it last.

---

## 3. More problems the research missed, with fixes

**P1-A. Mobile story layout (problem A, D, E).** One `@media (max-width: 768px)` block in `stories.css`:
```css
.story-main { padding: 0; }
.story-container { padding: 1rem; border-radius: 0; border-inline: 0; background: var(--card); }
.story-slide, .story-slide .story-scene { padding: .75rem 0; }
.story-scene.has-plate { border-inline-start-width: 0; }   /* the 5px side rule eats width */
.story-slides-container, .story-slide { max-height: none; overflow: visible; }
```
Compact the header on story pages: hide `.personal-greeting` after the first visit, cap the title at 2 lines with `font-size: clamp(1.4rem, 5vw, 2.2rem)`, and move the progress bar into the sticky header. Then the plate starts above the fold. Effort **M**. Files: `stories.css`, `interactive-story.css`.

**P1-B. Stop hiding content behind IO (problem B, C, plus the known surah.js issue).** One pattern for all three files. Hide only when JS has proved it can reveal:
```js
document.documentElement.classList.add('js-reveal');   // first line of the script
```
```css
.js-reveal .fade-in:not(.visible) { opacity: 0; translate: 0 16px; }
@media print { .js-reveal .fade-in { opacity: 1 !important; translate: none !important; } }
```
Delete `stories.js:494-499` outright: slide mode already shows one scene at a time. In `surah.js:248-255`, move from inline styles to the same class, and add `beforeprint` handling. Effort **S**. Files: `styles.css`, `index.html`, `stories.js`, `surah.js`.

**P1-F. Narration bar into the design system (problem F, G, K).** Move the injected CSS into `interactive-story.css` and tokenise it: `--cobalt-deep` → `--cobalt` gradient (cobalt = "voice/Quran" job), a turquoise play button, a gold active state, and `--card` text. Delete `addStyles()`. Make every button `flex: 0 0 44px; min-width:44px`. On phone, wrap the bar to two rows: play and progress, then the toggles. Replace the emoji glyphs (▶️ 🔄 ⏭, which render differently per OS) with inline SVG or text. Add `aria-label`s: `title` only today (`audio-narration.js:39,62,69`). Remove `row-reverse` and let `dir` do it. Place the bar **above** the slide, or make it sticky at the bottom of the viewport, so "play" is visible without scrolling. Effort **M**. Files: `audio-narration.js`, `interactive-story.css`.

**P1-H. RTL double-flip (problem H).** Delete every `html[lang="ar"] … { flex-direction: row-reverse }` that sits on a flex row inside `dir=rtl`: `stories.css:1361-1371, 1391, 1481`; `interactive-story.css:783, 792, 801, 805, 814, 819`. Convert `left/right` and `border-left/right` pairs to logical properties (`inset-inline-end`, `border-inline-start`): `stories.css:1374-1417`, `interactive-story.css:765-780`. This removes about 60 lines. Check the hero for the known failure: composed blocks stay centred. Effort **S-M**. Files: `stories.css`, `interactive-story.css`.

**P1-J. Fixed controls.** Fold the stars counter, sound and fullscreen into one toolbar row inside the story header, instead of three fixed islands at `top:100px`. At minimum, move fullscreen to `top: 170px` or into the slide-nav row. Effort **S**. Files: `stories.css:1517,1645`, `interactive-story.css:6,714`.

**P1-K/L. Touch targets and a children's type scale.** Add tokens:
```css
--step--1: clamp(.95rem, .9rem + .2vw, 1rem);
--step-0:  clamp(1.125rem, 1.05rem + .35vw, 1.25rem);  /* story body, never below 18px */
--step-1:  clamp(1.35rem, 1.2rem + .6vw, 1.6rem);
--step-2:  clamp(1.7rem, 1.4rem + 1.4vw, 2.4rem);
--step-3:  clamp(2rem, 1.5rem + 2.5vw, 3.3rem);
```
Map `.scene-text p` → `--step-0` (remove the 0.95rem shrink at `stories.css:1243`), `h2` → `--step-1`, page h1 → `--step-3` (fixes 48px on 390px for stories/quran). Slide dots get a 44px hit area through padding or a `::before`, with the visible dot unchanged. Sound and fullscreen go to 44px. Effort **S**. Files: `styles.css`, `stories.css`, `interactive-story.css`.

**P2-M. Hub cards.** Reuse `.story-thumbnail.has-cover` plates on hub cards (as stories.html does), add Adam, and use a 2x2 grid on tablet to remove the orphan. Turn `Values`/`Five Pillars` into links or mark them "Coming soon" with `aria-disabled`. Remove the dead "Explore Activities" button or link it. Make "Play Story"/"Start Story" one label on stories.html, and use the same tag set on every card. Effort **S-M**. Files: `index.html`, `stories.html`, `styles.css`.

**P2-O. Housekeeping.** Set `theme-color` to `#0F6B65` (30 files, a sed one-liner). Delete `story-styles.css`. One Arabic face. Effort **S**.

**Surah pages (observed).** The phone page is 15,600px tall. The "Special Light" and "Healing Power" cards centre body paragraphs at about 0.85rem (`surah.css:621,1014`). Left/start-align the prose and use `--step-0`. Consider collapsing the four intro cards into one "About this surah" disclosure (`<details>`) above "Learn each verse", so the verses arrive sooner. Effort **S-M**. Files: `surah.css`, surah HTML template (21 files, scripted).

---

## 4. Phased plan

**Phase 1: make the presentations readable (roughly 3-4 days)**
| Item | Files | Effort |
|---|---|---|
| P1-A mobile story layout: kill nested padding, no 60vh inner scroll, compact header | stories.css, interactive-story.css | M |
| P1-B no content hidden behind IO (stories.js, hub `.fade-in`, surah.js) | stories.js, surah.js, styles.css, index.html | S |
| P1-F narration bar into the design system, 44px buttons, keyframe collisions gone, visible without scrolling | audio-narration.js, interactive-story.css | M |
| P1-H RTL double-flip removed, logical properties | stories.css, interactive-story.css | S-M |
| #2 slide view rebuilt: grid stack + cross-fade, RTL swipe/keys/arrows/counter | stories.js, stories.css | M |
| #1 calm motion (one loop per viewport, no `transition: all`) | interactive-story.css, stories.css, surah.css, styles.css | M |
| P1-J one toolbar for stars/sound/fullscreen | stories.css, interactive-story.css | S |
| P1-K/L type-scale tokens, 18px floor, 44px dots | styles.css, stories.css, interactive-story.css | S |
| #4 verse-being-recited highlight | surah-narration.js, surah.css | S |

**Phase 2: the main site and the illuminated finish (roughly 3 days)**
| Item | Files | Effort |
|---|---|---|
| P2-M hub cards with cover plates, Adam added, dead cards fixed | index.html, styles.css, stories.html | S-M |
| #12 "Tonight's story" featured card (one gold card per page) | index.html, styles.css | S |
| #6 hairlines + one warm shadow token; remove 23 black shadows and 18 white surfaces | styles.css, stories.css, surah.css, interactive-story.css | M |
| #7 one Arabic face (Amiri), serif only for surah prose | story-prophet-*.html, surah.css, styles.css | S |
| #10 cross-document view transitions card → story | styles.css, stories.html, story-prophet-*.html | S |
| #9 recap card stack (colophon) | interactive-story.js/.css, 5 story HTML | M |
| #3-interim current-paragraph highlight while narrating | audio-narration.js, stories.css | S |
| Surah page prose: start-aligned, larger, intro cards in `<details>` | surah.css, 21 surah HTML | S-M |
| P2-O theme-color, delete story-styles.css | 30 HTML, UI/story-styles.css | S |

**Phase 3: delight, data-dependent (when Phases 1-2 have shipped)**
| Item | Files | Effort |
|---|---|---|
| #3 word-level karaoke from real timestamps (Whisper batch via ram-gate, manual trigger) | audio-narration.js, voice-scripts.js, stories.css | L |
| #11 shamsa draws itself on completion | quran-progress.js, interactive-story.js, styles.css | S |
| #13 static lantern glow behind surah title (replaces glow/pulse loops) | surah.css | S |
| #8 before/after slider for Nuh and Musa | interactive-story.css/js, story HTML, new plates | M each |
| #5 candle-light sheen, hover/focus only | styles.css, index.html | S |
| #14 parallax | (rejected) | - |

**Rejected:** parallax (#14), sibling-dimming focus cards, per-word blur reveal, and any timed karaoke before real timestamps exist.
