# Illuminated Page v2: design system

Status: adopted 2026-11-05 (pilot: `index.html`, the five story pages via the shared reader,
`surah-al-ikhlas.html`). Owner: frontend-lead. Research: `claudeteam/reviews/refero-deep-dive-2026-11-05.md`.

**Direction.** Every story and surah is a page in a hand-illuminated book, held in a calm,
well-made reading app. The palette and ornament are the Illuminated Page's (Iznik turquoise and
cobalt, manuscript gold, parchment, the girih star, the shamsa). v2 adds app ergonomics: a sticky
app bar, a tab bar, screens instead of long pages, a reader with a floating transport, and one
system of tokens with one job per colour.

**Who it is for.** A parent reading aloud to a 4-10 year old, often at bedtime, on an iPad or
phone. So: large reading text, large hit areas, no motion competing with the words, and nothing
that needs hover.

Files: tokens and `@font-face` in `styles.css :root`; app components in `app.css`; the story
reader in `stories.css` (v2 block at the end) + `stories.js` + `audio-narration.js`; the surah
screen in `surah.css` (v2 block) + `surah-narration.js`. Icons: `vendor/icons/sprite.svg`.

---

## 1. Principles

1. **Warm paper, never #fff or #000.** Parchment surfaces, pine ink.
2. **Hairlines before shadows.** Cards are drawn with a 1px line. One warm shadow, only for
   things that float over content (sheet, transport, mini player, featured card).
3. **One colour, one job** (section 2.1). If a colour is doing two jobs, one of them is wrong.
4. **One featured surface per screen**: the gold card.
5. **Children's text is a rounded sans at 18px or more.** A serif only for Arabic prose and scripture.
6. **App chrome speaks the platform's language**: system UI font, 44-56px targets, segmented
   controls, a bottom tab bar, a tactile press.
7. **The rest pose is the design.** No infinite loops; motion answers a tap.
8. **RTL is a first-class direction**: logical properties and `dir`, never `row-reverse` on top of `dir`.

## 2. Colour

### 2.1 Roles

| Role | Token | Value | Job (and only this job) |
|---|---|---|---|
| Canvas | `--surface-0` | `#FBF6EA` | page background |
| Raised | `--surface-1` | `#FFFDF8` | cards, sheets, bars (replaces every `white`) |
| Sunk | `--surface-2` | `#F3E9D6` | wells, tracks, segmented background, skeletons |
| Glass | `--surface-glass` | parchment 86% | app bar and tab bar over content (with blur) |
| Text | `--text-1` | `#14383A` | primary text |
| Text, secondary | `--text-2` | `#4F6663` | meta, labels, inactive tabs |
| **Action** (turquoise) | `--action` | `#0F6B65` | buttons, links, the active tab, the play control, correct answers |
| On action | `--text-on-action` | `#FFFDF8` | text and glyphs on `--action` |
| Action tint | `--action-wash` | `#E3F1EF` | pressed, hover and selected tints |
| **Ornament** (gold) | `--ornament` | `#C08A2E` | rules, frames, stars, the reading progress line. Never text |
| **Focus** (gold, dark) | `--focus` | `#8A6220` | the focus ring and the narrated-verse bar |
| **Reward** (gold wash) | `--reward-wash` / `--reward-text` | `#F7EDD8` / `#7A5518` | the featured card, the narrated verse, "Reading" badges |
| **Quran** (cobalt) | `--quran` / `--quran-wash` | `#24508C` / `#E7EDF6` | ayah numbers, surah-name tiles, the Arabic name in the surah header |
| Wrong answer | literal | `#B42318` | wrong-answer feedback only (frontend hard rule 2) |
| Lines | `--line`, `--hairline`, `--hairline-gold` | `#E3D7C0` / gold 60% | card edges; gold rule for ornamental frames |

Bedtime mode (`html[data-theme="bedtime"]`) redefines every role token; nothing else changes.
The v1 names (`--parchment`, `--turquoise-deep`, `--gold-text`, `--card`, `--slate-500`, the five
shadows...) are **aliases** of the role tokens, so every older sheet keeps working.

### 2.2 Rules
- New CSS uses role tokens only. No hex in page-type sheets or JS (frontend hard rule 1).
- Turquoise `#17877F` (`--action-bright`) is 4.05:1: large glyphs only, never body-size text.
- `--ornament` is 2.82:1 on parchment: lines and fills only.

### 2.3 Contrast (WCAG 2.x, computed from the tokens)

| Foreground | Background | Ratio | Use | Needs |
|---|---|---|---|---|
| `--text-1` | `--surface-0` / `-1` / `-2` | 11.75 / 12.47 / 10.53 | body | 4.5 |
| `--text-1` | `--reward-wash` | 10.90 | featured card, narrated verse | 4.5 |
| `--text-2` | `--surface-0` / `-1` / `-2` | 5.71 / 6.05 / 5.11 | meta, labels | 4.5 |
| `--text-on-action` | `--action` | 6.24 | primary buttons, play | 4.5 |
| `--action` | `--surface-0` | 5.88 | links, "See all", active tab | 4.5 |
| `--action` | `--action-wash` | 5.46 | active tab label on its pill | 4.5 |
| `--focus` (ring) | `--surface-0` / `--surface-2` | 5.06 / 4.53 | focus ring | **3.0** |
| `--focus` (bar) | `--reward-wash` | 4.69 | narrated-verse edge bar | 3.0 |
| `--reward-text` | `--reward-wash` | 5.75 | kicker on the featured card | 4.5 |
| `--quran` | `--surface-1` / `--quran-wash` | 7.94 / 6.86 | ayah numbers, surah tiles | 4.5 |
| `--ornament-light` | ink card `#14383A` | 6.70 | complete-surah text, Bismillah line | 4.5 |
| `--text-on-action` | `#B42318` | 6.47 | wrong answer | 4.5 |
| Bedtime `--text-1` | bedtime `--surface-0` | 12.38 | | 4.5 |
| Bedtime `--text-2` | bedtime `--surface-0` | 8.25 | | 4.5 |
| Bedtime `--text-on-action` | bedtime `--action` | 5.84 | | 4.5 |
| Bedtime `--focus` | bedtime `--surface-1` | 8.02 | focus ring | 3.0 |

Pairs v2 retires: ink on `--gold` (language toggle) 4.18; white on turquoise (listen-all, stage
button) 4.37; gold focus ring 2.82; white on emerald (quiz hover/correct) 3.97; white on
gold-light (light badges) 1.89.

## 3. Type

| Family | Token | Faces (self-hosted, `vendor/fonts`) | Used for |
|---|---|---|---|
| System UI | `--font-ui` | SF Pro / Segoe UI / Roboto, Nunito fallback | app chrome: bars, tabs, labels, buttons, section headers |
| System UI, Arabic | `--font-ui-ar` | SF Arabic / Segoe UI, Baloo Bhaijaan 2 fallback | the same, in Arabic |
| Reading | `--font-read` | Nunito 400/600/700/800 | children's English text, tile titles |
| Titles | `--font-title` | Baloo 2 700/800 | screen titles, scene titles, the brand |
| Arabic body | `--font-ar` | Amiri 400/700 | **the one Arabic body face** (story text, meanings, headings in AR) |
| Quran | `--font-quran` | Amiri Quran 400 | ayat, the complete surah, surah names on tiles |
| Calligraphy | n/a | Aref Ruqaa 700 | the calligraphy panel title only |

No font CDN: pages that load `styles.css` need no Google Fonts link (removed from the pilot pages;
the other 24 pages still carry theirs until they move to the shell).

Fluid scale (min at 360px, max near 1280px):

| Token | Size | Role |
|---|---|---|
| `--step--1` | 14-15px | labels, captions, meta |
| `--step-0` | 16-17px | UI body |
| `--step-read` | **18-22px** | children's story text: never below 18px (`max(1.125rem, ...)`), scaled by the reader's Aa control (0.92 / 1 / 1.18) |
| `--step-1` | 20-24px | card and section titles |
| `--step-2` | 24-32px | screen and scene titles |
| `--step-3` | 30-44px | large titles |
| `--step-quran` | 28-40px | ayat |

Arabic gets +10% and line-height 1.9-1.95; headings in Arabic drop negative tracking.

## 4. Space, radius, elevation

- **8pt grid:** `--s-1` 4, `--s-2` 8, `--s-3` 12, `--s-4` 16, `--s-5` 24, `--s-6` 32, `--s-7` 48, `--s-8` 64. Gutter `clamp(16px, 4vw, 32px)`.
- **Radii:** `--r-sm` 10 (chips, inputs), `--r-md` 16 (cards, tiles, plates), `--r-lg` 24 (sheets, featured card), `--r-pill` (buttons, segmented, play).
- **Elevation:** hairline for everything that sits on the page. `--shadow` (two layers, ink-brown, `0 1px 2px` + `0 10px 28px -12px`) only for floating layers. `--shadow-sm` for a selected segment.
- **Hit areas:** `--tap` 44px minimum on every control; `--tap-lg` 56px for the play control, transport arrows and tabs.
- **Safe areas:** bars pad with `env(safe-area-inset-*)`; pages set `viewport-fit=cover`.

## 5. Iconography

One stroke icon set: Lucide (ISC), 24px grid, 2px stroke, `currentColor`, self-hosted as an SVG
sprite (`vendor/icons/sprite.svg`, 24 symbols). Use
`<svg class="icon" aria-hidden="true"><use href="vendor/icons/sprite.svg#i-NAME"/></svg>` inside
a labelled control. Direction-bearing glyphs (chevrons, arrows) get `.flip-rtl`. Emoji stay in
*content* (the stories' own voice) but not in chrome.

## 6. Motion

- **No infinite animations** anywhere in the reading area (and, after this pilot, none in the page
  sheets: 25 `infinite` loops in stories.css, interactive-story.css and surah.css became one-shot, `tapHint` plays 3 times, and the header crescent no longer pulses on every page).
- **Explicit transitions only**: `--t-press` lists transform, background-color, border-color,
  box-shadow, color and opacity. Never `transition: all`, never `outline` (the focus ring must not
  animate). Durations `--dur-1` 120ms (press), `--dur-2` 200ms (colour), `--dur-3` 320ms (page turn, sheet).
- **Press:** `transform: scale(.97)` (icon buttons .94) on `:active`.
- **Lift:** `translateY(-2px)` + `--shadow` on hover (only with `@media (hover:hover)`) **and on
  `:focus-visible`**.
- **Page turn:** a 320ms fade with at most 16px of travel toward the reading direction (`--turn`
  is -1 in RTL).
- **Reduced motion:** the global block in `styles.css` zeroes durations and iterations and now also
  covers `::view-transition-*`; JS smooth scrolling checks `prefers-reduced-motion` and uses
  `behavior: 'auto'` (stories.js, surah.js, surah-narration.js).
- **Reveal gate (`js-reveal`):** content is only hidden for an entrance after a script has added
  `.js-reveal` to `<html>` and can reveal it; a timer and `beforeprint` reveal everything. No blank
  first slides, print pages or full-page captures.

## 7. Components

### 7.1 App bar (`.app-bar`)
Sticky, `56px + safe-top`, `--surface-glass` with `blur(16px)`, hairline below. Start: back
(`.icon-btn`, chevron with `.flip-rtl`) or the brand. Middle: `.app-bar__title` (system UI 17px/600,
truncates). End: bedtime (`.icon-btn.bedtime-btn`, moon/sun SVG, `aria-pressed`) and the language
toggle (`.lang-toggle-btn`, a 44px parchment pill naming the language you switch *to*).

### 7.2 Tab bar (`.tab-bar`)
Below 1024px: fixed to the bottom, `64px + safe-bottom`, glass, hairline above; items are 64px
tall with a 24px icon over a 12-13px label; the current tab has `aria-current="page"`, the action
colour and a 56x30 `--action-wash` pill behind the icon. From 1024px: a 96px side rail under the
app bar. Tabs: Home, Stories, Quran (My Garden / progress: later).

### 7.3 Buttons
`.btn` 44px pill, system UI 16-17px/600. `.btn--primary` (action fill), `.btn--secondary`
(surface-1 + hairline), `.btn--lg` 56px. Never two filled buttons side by side. `.icon-btn` 44px
round, transparent, press tint `--action-wash`; `aria-pressed="true"` shows the action colour.

### 7.4 Cards, tiles, shelves, lists
- `.card`: surface-1, hairline, `--r-md`, 24px padding, no shadow.
- `.feature-card`: **the one gold card per screen.** `--reward-wash`, `--hairline-gold`, `--r-lg`,
  `--shadow`; 16:9 cover over the body on phones, side by side from 720px; kicker (icon + label in
  `--reward-text`), title (Baloo 2), one line of text, one primary `.btn--lg`.
- `.tile`: a 4:3 cover (`--r-md`, hairline, parchment skeleton behind; the image fades in on load),
  a 17px/700 title and a 14px meta line. Surah tiles without art use `.tile__cover--surah`:
  `--quran-wash` with a faint girih and the surah's name in Amiri Quran, cobalt.
- `.shelf`: a horizontally scrolling row (`scroll-snap`, bleeds to the screen edge, 44% columns on
  phones, 220px from 720px).
- `.list` / `.list-row`: grouped list, 60px rows, a 36px tinted icon well, chevron (flipped in RTL);
  unbuilt items are `aria-disabled` rows with a "Soon" `.chip`, never dead links.
- `.stat-row`: three stats with a gold `.meter` (reward = gold).

### 7.5 Segmented control (`.segmented`)
A sunk pill with 4px padding; 44px segments; the chosen one is surface-1 with `--shadow-sm` and a
hairline ring; state is `aria-pressed`. Used for Read / Practice / Recite, text size, language and
narration speed.

### 7.6 The story reader (`body.reader`)
Built by `stories.js` when a story has slides (all but Yusuf, which stays classic scroll).
- **Top bar** (`.reader-bar`): close (to stories.html) | title + "Page n of N" (Arabic digits in
  Arabic) | Aa (cycles small/medium/large; `aria-label` says which) | read-aloud (`aria-pressed`,
  volume / volume-off) | settings. Stars and the sound-effects toggle (Adam, Ibrahim) move into
  this bar: **one toolbar**. A 3px gold progress line runs along its bottom edge.
- **The page:** one slide in the DOM flow at a time (`display:none` for the rest, which are also
  `inert` and `aria-hidden`); no inner scroll, no 60vh cap; plate on top (16:9, `--r-md`), scene
  title, then the text at `--step-read`. Story text column on a 390px phone: 358px at 18.4px.
- **Live region:** polite, "Page 3 of 16: Never Giving Up" (localised), not announced on load.
- **Transport** (`.reader-transport`): a floating pill, fixed above the safe area: previous
  (56px) | play/pause (56px round, `aria-pressed`, labelled "Listen to this page") with a thin
  narration-progress line | next (56px). Always above the fold.
- **Direction:** forward is the inline-end in both languages: in Arabic, ArrowLeft and a
  left-to-right swipe go forward, the chevrons are mirrored, the progress line grows from the right.
  Keys are ignored in inputs, with modifiers and while the sheet is open; vertical drags scroll.
- **Settings sheet** (`<dialog class="sheet">`, modal, Esc closes, backdrop tap closes): text
  size, language, narration (speed segmented 0.75-1.5x, "Read each page aloud" switch,
  "Turn the page by itself" switch), display (bedtime switch, full screen).
- **Resume:** the slide is saved per story (`localStorage ik-story-progress`), feeding Home's
  "Continue" card; reopening a story resumes there (`?resume=0` starts over).

### 7.7 Narration controls
No injected stylesheet (the old one carried off-palette hex and keyframes named `pulse` and
`fadeInUp` that overrode `stories.css`). Classic-scroll stories get one `.narration-control-bar`
(sticky bottom, 56px play, progress, time, settings folded into a `<details>`). Switches are
`role="switch"` with `aria-checked`; every control has a visible or accessible name in both languages.

### 7.8 The surah screen (`body.app.surah-screen`)
- Compact header: title (Baloo 2), subtitle with the Arabic name in Amiri Quran / cobalt, info chips.
- Section titles are app list headers (system UI, start-aligned).
- **Read / Practice / Recite** is a `.segmented` control.
- **Mini player** (`.mini-player`, sticky above the tab bar): 56px play + "Listen to the meanings" /
  "Verse 2 of 4". On an Arabic page it shows the bilingual "coming soon" note and is
  `aria-disabled` (the no-recitation flag `AR_VERSE_AUDIO` stays false).
- **Verse card** as a list item: surface-1, hairline, `--r-md`; cobalt ayah number; ayah in Amiri
  Quran at `--step-quran`; meaning at `--step-read`; explanation on a parchment well.
- **The narrated verse** (all surah pages): `.is-narrating` + `aria-current="true"`: `--reward-wash`,
  the strong gold rule, and a 3px `--focus` bar on the inline-start edge (the reading edge; right
  in Arabic). While "listen to every verse" plays, an off-screen card is scrolled into view
  (instant under reduced motion); a single tapped verse never scrolls. Focus never moves.
- **`.full-bismillah`**: its own centred line in the complete surah, 86% of the ayah size, a gold
  hairline under it, no ayah mark.

### 7.9 Home (`index.html`)
Greeting ("Assalamu alaikum, Sara"), the featured card (**Continue** a story in progress, else
**Tonight's story** chosen by date), Prophet stories shelf (all five, painted covers, Adam
included), Short surahs shelf, a progress row (stories finished, surahs memorised, surahs being
learned, from this device's storage), and a "More to explore" list. No hero, no carousel, no dead
cards; "Explore Activities" and the Ramadan countdown are gone (nothing behind them).

### 7.10 Install as an app
`manifest.webmanifest` (standalone, parchment theme), `images/app/icon.svg` + 192/512 PNG +
`apple-touch-icon.png`, `theme-color #FBF6EA`, `apple-mobile-web-app-capable`. No service worker yet.

## 8. RTL

`bilingual.js` sets `dir`; layouts use flex/grid and logical properties (`inset-inline-*`,
`margin-inline-*`, `border-inline-start`, `text-align: start`). **Never add `flex-direction:
row-reverse` for Arabic**: `dir="rtl"` already reverses rows, and the second reversal is what put
the logo on the wrong side of story pages. v2 removed 12 such rules. Icon-only buttons carry their
Arabic name in `data-ar-label`, which `bilingual.js` swaps into `aria-label`.

## 9. Checklist for a new screen

- [ ] `<body class="app">`, app bar, tab bar, `viewport-fit=cover`, no font CDN link
- [ ] role tokens only; no `white`, `#fff`, `#000`, `rgba(0,0,0,…)`
- [ ] every control 44px+, labelled in EN and AR
- [ ] no `infinite`, no `transition: all`; JS scrolling honours reduced motion
- [ ] content visible with JS off and in print (`js-reveal` gate only)
- [ ] tested at 390, 1024 and 1280, EN and AR, no-cache server, and the six verifiers pass
