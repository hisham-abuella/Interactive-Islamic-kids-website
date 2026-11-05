# UI improvement plan — synthesis (2026-11-03)

Sources: ui-reference-research-2026-11-03.md (Refero / Hairline / Aceternity),
frontend-ui-review-2026-11-03.md, a11y-ui-ideas-2026-11-03.md,
learning-ui-ideas-2026-11-03.md, and the ceo verdict (summarised below).

## Headline
The reference sites are useful for *polish* (warm-paper palette, hairlines over shadows, one
accent per job, calm per-item motion, card stack, view transitions). But a browser pass found the
story slideshows are broken in ways that matter more: a 156px text column on phones, blank first
slide, Arabic layout flipped twice with LTR swipe/keys/counter, a JS-injected narration bar with
off-palette colours and 22-26px buttons, and 25-30 infinite animations running at once.
**Fix readability first, then polish.**

## Phase 1 — make the slideshows readable and accessible (~3-4 days)
| Item | Files | Size | Agreed by |
|---|---|---|---|
| Mobile story layout: remove stacked padding, no 60vh inner scroll, story + play button above the fold | stories.css, interactive-story.css | M | FE |
| Stop hiding content until IntersectionObserver fires (`js-reveal` gate); hub cards visible without JS | stories.js, surah.js, styles.css, index.html | S | FE, a11y |
| Narration bar CSS moved into interactive-story.css: palette tokens, 44px buttons, no keyframe clashes, labelled controls with state, usable seek bar | audio-narration.js, interactive-story.css | M | FE, a11y |
| Fix double-flipped RTL; logical properties; mirrored swipe/arrow keys/arrow glyphs/counter; Arabic progress text | stories.css, interactive-story.css, stories.js | S-M | FE, a11y |
| Slides as cross-fade, hidden slides `inert`, polite live region "Page n of N", reduced-motion rule incl. `::view-transition-*` and JS smooth scroll | stories.js, stories.css | M | all |
| Calm motion: at most one slow loop per screen, no `transition: all`, decorative stars/clouds hidden from SR | interactive-story.css, stories.css, surah.css, styles.css | M | all |
| One toolbar for stars / sound / fullscreen (no overlap) | stories.css, interactive-story.css | S | FE |
| Type tokens: story text >= 1.125rem (18px), dots and buttons >= 44px, focus ring in `--gold-text` (>=3:1) | styles.css, stories.css, interactive-story.css | S | FE, a11y |
| Contrast fixes: language toggle, white-on-gold buttons/badges, quiz states, turquoise buttons | styles.css, stories.css, surah.css | S | a11y |
| Highlight verse being narrated: gold-wash + 3px `--gold-text` edge + `aria-current` | surah-narration.js, surah.css | S | all |
| Arrow-key handler ignores inputs; tap-to-reveal and dots become real buttons | stories.js | S | a11y |

## Phase 2 — hub, learning loop, finish (~3-5 days)
- Hub cards use the painted cover plates (not emoji), add Adam, fix dead cards/"Explore Activities".
- **"What's next" card** driven by real progress (continue surah → next shortest surah → next story);
  replaces "Featured Stories". Owner may pin "Tonight's story" by hand. (learning #1, ceo, FE)
- Surah memorization loop: first-word cue level, cover-and-say per verse filling a shamsa,
  "mark memorised" feeds the quran.html map (replaces the tiny badge). (learning #2)
- Story end: tap-driven recap card stack (3 cards, "what happened here?"), **replacing the
  YouTube unlock**. (learning #3, ceo, FE)
- Sentence highlight while narration plays (never hide text; parent switch off). (learning #4)
- Hairlines + one warm shadow token; remove 23 black shadows / 18 pure-white surfaces.
- Split slides over ~35 words (Musa 63, Yusuf 52) — with arabic-language-reviewer.
- Theme-color meta fix; delete unused story-styles.css; one Arabic body font.

## Phase 3 — needs new data, art or owner decisions
- Word-level karaoke from real timestamps (offline batch via ram-gate). Listen mode only.
- Shamsa draws itself once on completion; static lantern glow behind surah title.
- Before/after slider for Nuh/Musa only, with scholar sign-off.
- Cross-document View Transitions hub → story.
- Shared progress world (hub) with the game designer: moved only by memorised surahs and
  finished stories.

## Rejected
Parallax; hover-only focus-card dimming; word-by-word reveal in Read mode (parent reads ahead);
all space/glitch/typewriter/infinite-marquee effects; any React/Tailwind/CDN dependency.

## Owner decisions
1. Hub mood: bedtime-calm or playful daytime (or let the existing bedtime toggle carry it)?
2. Fonts: self-host all fonts (Nunito, Baloo, Amiri + any new one) for offline/control? Reading
   face for children: keep Nunito, or Andika/Atkinson (learning + a11y advise against a serif for
   kids' text; serif only for parent/meaning text)?
3. "Tonight's story": you pick by hand, or progress-driven "what's next"?
4. Replace the end-of-story YouTube unlock with the recap stack (removes an external dependency)?
5. Keep GoatCounter?
6. Add qari recitation audio to surah pages (scholar question)?
