# UI reference research — Refero Styles, Hairline, Aceternity (2026-11-03)

Research agent report, applied to the Illuminated Page site. No files edited.

## Current state noted
- styles.css: Iznik/manuscript tokens, girih/shamsa SVG tokens, Nunito + Baloo 2, one global reduced-motion block (~l.861).
- stories.css (~945-960): slides are a flex track moved with translateX 0.4s.
- interactive-story.css: ~11 infinite keyframes (twinkle, fireFlicker, bounce, tapHint, celebratePulse, kaabaGlow...), `transition: all .3s` everywhere, no own reduced-motion rules.

## Refero Styles (2,000+ extracted design systems)
Fits: the "warm paper" family (Perplexity "scholar's parchment", Cursor "warm parchment atelier", Intercom/ElevenLabs warm cream editorial).
- Never pure #fff/#000; audit leftover white/#fff.
- Hairlines before shadows: 1px warm borders + one warm shadow (site has 4 shadows + glows, 2px borders).
- One accent, one job: gold = ornament/focus, turquoise = action, cobalt = Quran. One featured gold card per page.
- Serif for editorial reading (Literata / Source Serif 4), never bold; Arabic in Amiri/Scheherazade; Nunito for UI, Baloo titles.
- Calm rhythm: ~900px measure, 64-96px section gaps, alternating parchment/parchment-deep.
Avoid: dark "midnight" styles, liquid/iridescent, Slush sticker-loud style (except maybe slightly rotated sticker badges).

## Hairline (@lucasmarkes/hairline)
33 isometric pointer-reactive line figures (tech props). Principles: one projection & stroke weight, no fills/glow, few lines, colour has one job (one stroke changes colour when active), springs not timed easing, deliberate rest pose, fixed hit areas, hover slows time, one shared rAF loop that stops when idle; empty-state art 160-240px above one heading + one action; a11y labels, reduced motion = rest.
Apply the method (not the figures) to girih/shamsa ornament: single-weight gold strokes, one stroke turns turquoise on tap, rest pose is the design (tablets have no hover).

## Aceternity UI (React/Tailwind/Motion catalogue) — vanilla reconstructions
Good fits: Text Generate Effect (per-word fade/blur, tie to narration), Focus Cards (`:has(:hover)` dim siblings, hover-only), Card Spotlight as gold candle-light sheen, Card Stack (tap, no timer) for recap, Compare before/after slider (clip-path + range input, RTL-mirrored), very subtle parallax (<=6px, desktop only), Lamp Effect as static lantern glow, Timeline (sticky rail + IO gold line) for prophets order/Quran progress, Expandable Card via View Transitions API, animated tab pill for EN/AR toggle, hand-drawn gold underline for vocab words.
Avoid: Meteors, Shooting Stars, Vortex, Beams, Aurora, Sparkles, shaders, Liquid Glass, glitch/encrypted text, Infinite Moving Cards, 3D Marquee, Typewriter, Magnetic Button, Moving Border, Following Pointer, Macbook/Container Scroll, Hero Parallax, Globes, Floating Dock.

## Shortlist (priority order)
1. [story-slides] Calm existing motion: replace infinite loops with one-shot entrances or >=6s low-amplitude loops; replace `transition: all`.
2. [story-slides] Cross-fade slides (250ms opacity, <=24px move, RTL-aware) or startViewTransition.
3. [story-slides] Words appear with narration; karaoke gold word if timestamps exist; reduced motion shows all.
4. [surah] Highlight verse being recited (gold-wash + 1px rule-strong, scrollIntoView center).
5. [hub] Focus cards + candle-light sheen, hover-capable only.
6. [hub][surah] Hairlines over shadows; one warm shadow token; remove pure #fff/#000.
7. [story-slides][surah] Serif reading face for narration/translation.
8. [story-slides] Before/after reveal slide.
9. [story-slides] Recap card stack at end, tap-driven.
10. [hub] Cross-document View Transitions hub card -> story header.
11. [surah][hub] Hairline-style line-art empty states; shamsa draws itself on surah completion.
12. [hub] One featured "Tonight's story" card.
13. [surah] Static lantern glow behind title.
14. [story-slides] Gentle illustration parallax (optional, lowest).
