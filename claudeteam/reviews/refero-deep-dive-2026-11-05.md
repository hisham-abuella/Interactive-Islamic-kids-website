# Refero deep dive: warm-paper editorial systems and calm app systems (2026-11-05)

Frontend Lead. Follows `ui-reference-research-2026-11-03.md` (the first Refero pass) and the
owner's two asks: "take inspiration from styles.refero.design" and, mid-task, "make it more
professional, UI app style". Output: `UI/DESIGN.md` (Illuminated Page v2) and the pilot on
the hub, the Nuh reader and the Ikhlas screen.

**Method.** `styles.refero.design` lists 20 styles on its front page; each style page
(`/style/<id>`) is an extracted DESIGN.md (tokens, type scale, radii, shadows, spacing,
components, do/don't). I read 12 in full: 5 warm-paper editorial systems, 4 calm product/app
systems and 3 learning apps (the closest Refero has to children's or education styles; it lists
no children's-book or publisher style, and no Anthropic/Claude style surfaced). Values below are
quoted from the pages; where a page contradicts itself (several do) that is noted.

**Rule we kept to.** Principles and systems only. No brand's colours, typefaces, logos, layouts
or names are reused. Every value in v2 is either ours already (the Iznik/manuscript palette) or
a generic system decision (an 8pt grid, a 44px hit area).

---

## 1. Warm-paper editorial systems

### Cursor: "warm parchment atelier" (`/style/4e3b4717-…`)
- **Surfaces:** canvas `#f7f7f4`, card `#f2f1ed`, elevated `#e6e5e0`, hairline `#cdcdc9`. Ink `#26251e`.
  **Pure white and pure black are prohibited.**
- **One accent, one job:** an orange used *only* for inline links and emphasis, "never a button,
  surface, or icon fill"; a separate amber for in-product action fills.
- **Type:** a sans for UI at 400/500, a Garamond-class serif "for editorial subheads and prose,
  not UI labels or navigation". Headlines never bold. Tracking tightens with size (-0.03em at 72px).
- **Depth:** "Borders are preferred over shadows for layering." Hairline = ink at 5-10% (`color-mix`).
  Shadows "must stay warm and neutral-black based, not blue".
- **Rhythm:** 4px base; 64-96px section gaps; sections separated by whitespace, not dividers.
- **Don'ts:** no pills on cards, no gradients/glows, no two filled buttons in one group.
- **Teaches us:** the parchment ladder (canvas, card, sunk) and the "no #fff/#000" rule; an
  accent's job is written down and enforced.

### Steep: "serif analytics on warm paper" (`/style/75fdb89f-…`)
- ~97% achromatic. One chromatic surface, a peach card, **"use once per page at most"**.
- Serif display at weight 400 only; sans body 400-500 with half-step weights.
- Radii: buttons 9999px, content cards 24px, images 12px. **"Content cards have no shadow. Only
  floating product UI elevates."** Floating artifact shadow: 1px ring + 20-25px soft blur.
- **Teaches us:** the single featured card (our gold "Tonight's story" card), and the elevation
  rule: only things that float (sheet, transport bar, featured card) get the shadow.

### Intercom: "warm cream editorial spread" (`/style/12255b63-…`)
- Canvas cream `#faf9f6`, linen `#f1eee9`, hairline `#dedbd6`. **No shadows at all**: "depth comes
  from background tone shifts and whitespace". No gradients, no section dividers.
- Display sans at weight 300; a serif for editorial body paragraphs.
- Body copy: "don't set body copy above 20px or below 14px"; icons 1.5px strokes.
- **Teaches us:** tone shifts can carry hierarchy on their own; a thin-stroke icon set reads calm.
  (We do *not* take its 4px radius: young hands and an app feel want softer corners.)

### ElevenLabs: "warm cream editorial" (`/style/031056ff-…`)
- Eggshell `#fdfcfc`, warm taupe `#f5f3f1`, stone hairline `#ebe8e4` (its most-used border).
- Chromatic colour reserved for product visuals only: "do not use violet or orange for buttons,
  links, badges". Shadows "near-invisible 1px only".
- Light display weight (300), +0.01em tracking on 14-16px body. Pill buttons; cards 20-24px.
- **Teaches us:** our *paintings* carry the colour; the chrome around them stays quiet.

### Perplexity: "scholar's parchment" (`/style/7c4e9339-…`)
- Parchment `#faf8f5`, aged-sepia text `#271a00`, fog `#d1cfc7`. **No box-shadow**; depth from
  white cards layered on parchment.
- A deep teal `#0f3639` as the single interactive accent, "sparingly". Serif for declarations only,
  never below 24px; never mix serif and sans in one block.
- **Teaches us:** a warm-brown ink instead of black, and a dark teal as the one action colour,
  which is already what our `--turquoise-deep` does.

## 2. Calm product and app systems

### Apple iPhone product page (`/style/a73148b9-…`)
- **No drop shadows**; separation from surface contrast, 28px media corners and 1px edges.
- Two type roles (Display, Text) with size-specific tracking; body 17px; nav 12px.
- Buttons are pills; the one filled blue pill is "only for compact filled pills".
- Global nav 44px tall with `blur(20px)` on its opened surface.
- **Teaches us:** the system UI stack for chrome (SF on Apple devices), 17px body for UI, a
  translucent blurred bar, large media corners.

### Things (Cultured Code) (`/style/ec0f5bca-…`)
- **System UI font stack only, no web fonts.** Mist canvas, white cards with a paired soft shadow
  (`0 2px 8px rgba(0,0,0,.1), 0 0 2px rgba(0,0,0,.1)`), cards 18px, buttons 6px, play control 9999px.
- "The circular play button is the only filled chromatic control." Body 17-18px, line-height 1.6,
  ~540px measure. Category hues are content, never UI accents.
- **Teaches us:** one round filled play control as the hero of a screen (our transport and mini
  player), and a readable measure.

### Wise (`/style/367c0c6e-…`)
- Pill buttons and a **pill segmented control** (~40px, active segment filled). Cards 10px, large 28px.
- "Use the accent only for primary action fills and active states, about one per viewport section";
  "never place two filled buttons side by side". Sticky 64px top bar.
- **Teaches us:** the segmented control (Read / Practice / Recite, text size, narration speed).

### Reflect Notes (`/style/e7f92774-…`) - dark, so a counter-example
- A disciplined radius set (5 / 16 / 32 / 999 and nothing else), one accent hue, weights 400/500.
- **Teaches us:** fix the radius scale and the weights, then stop. (Its dark "space" look is on
  the research's avoid list and stays there.)

## 3. Learning apps (the nearest thing to a children's style on Refero)

### Duolingo, two extractions (`/style/95b472c5-…`, `/style/7088d695-…`)
- One saturated green for progress/primary actions; secondary blue for links.
- A **rounded display face; Nunito is listed as the fallback for its body face.**
- 12px radius everywhere; "the chunky press effect is a 2-3px solid bottom border", no shadows.
- "Don't use the green for small text"; "don't apply illustration colours to UI chrome".
- **Teaches us:** a tactile press (we use `scale(.97)` instead of a bottom border, which suits the
  calmer bedtime register), rounded type for children, and colour that means progress.

### Busuu (`/style/72b85d0a-…`)
- Mint pill as the *only* primary action colour; circular flag tiles in a horizontally
  scrolling row; a single shadow token `0 1px 2px rgba(0,0,0,.1)`; 16px cards; 4px base.
- **Teaches us:** horizontally scrolling shelves of round-cornered tiles for choices (our Stories and
  Short surahs shelves), and that one shadow token is enough.

---

## 4. What we took: the eight principles applied

| # | Principle | Seen in | Where it lands in v2 |
|---|---|---|---|
| 1 | **Warm paper, never #fff/#000.** A three-step parchment ladder; ink is pine, not black. | Cursor, Intercom, ElevenLabs, Perplexity | `--surface-0/1/2`, `--text-1`; 16 white surfaces and 13 black shadows replaced in the page sheets |
| 2 | **Hairlines before shadows; one warm shadow** for floating things only. | Cursor, Steep, Apple, Busuu | `--hairline`, `--shadow`; cards, tiles and verse cards are hairline-only; the sheet, transport, mini player and featured card float |
| 3 | **One accent, one job**, written down. | Cursor, ElevenLabs, Wise, Things | turquoise = action, gold = ornament/focus/reward, cobalt = Quran, red = wrong answer |
| 4 | **One featured surface per screen.** | Steep (peach card once per page) | the gold "Continue / Tonight's story" card on Home |
| 5 | **A serif only for editorial moments**; a rounded sans for children. | Cursor, Intercom, Perplexity, Duolingo | Nunito for children's text (owner decision: Andika), Amiri for Arabic prose, Amiri Quran for ayat; no Latin serif in children's text |
| 6 | **System UI for chrome, a fixed type and radius scale.** | Things, Apple, Reflect | `--font-ui` (SF on Apple), fluid `--step-*` scale with an 18px floor, radii 10/16/24/999 |
| 7 | **App ergonomics:** translucent sticky bar, tab bar, segmented controls, a round play control, pill buttons, a tactile press. | Apple, Wise, Things, Duolingo | app bar, bottom tab bar / desktop rail, reader transport, mini player, `scale(.97)` press, 44-56px hit areas |
| 8 | **Calm rhythm:** whitespace separates, a 4/8px grid, motion is quiet. | all twelve | 8pt `--s-*` scale; no infinite loops; 120/200/320ms explicit transitions |

## 5. Mapping onto our tokens

| Refero pattern | v1 (before) | v2 token |
|---|---|---|
| canvas / card / sunk (Cursor `#f7f7f4/#f2f1ed/#e6e5e0`) | `--parchment #FBF6EA`, `--card #FFFDF8`, `--parchment-deep`, plus `white` literals | `--surface-0 #FBF6EA`, `--surface-1 #FFFDF8`, `--surface-2 #F3E9D6` |
| ink not black (Perplexity `#271a00`) | `--ink #14383A` | `--text-1 #14383A`, `--text-2 #4F6663` (was `--slate-500 #5C7370`, 4.21:1 on `--surface-2`) |
| hairline (ElevenLabs `#ebe8e4`) | `--rule` gold 32%, 2-3px borders | `--line #E3D7C0`, `--hairline`, `--hairline-gold` for ornament |
| one shadow (Busuu, Steep) | 5 tokens, 90 declarations, 23 black | `--shadow` (ink-brown, 2 layers); v1 names alias to it |
| one action colour (Perplexity teal) | turquoise and emerald fills, white text 3.97-4.37:1 | `--action #0F6B65` with `--text-on-action` 6.24:1 |
| accent only for focus/emphasis (Cursor) | gold focus ring 2.82:1 | `--focus #8A6220` 5.06:1 |
| single featured card (Steep peach) | none | `.feature-card` on `--reward-wash` with `--hairline-gold` |
| system font for chrome (Things) | Nunito/Baloo everywhere, from Google Fonts | `--font-ui` system stack; all brand fonts self-hosted |
| radius scale (Reflect) | 4px to 50px, ad hoc | `--r-sm 10`, `--r-md 16`, `--r-lg 24`, `--r-pill` |
| segmented control (Wise) | three separate stage buttons in a gold pill | `.segmented` |
| round play control (Things) | 22-26px emoji buttons in a JS-injected bar | `.play-btn` 56px, SVG glyphs |

## 6. What we deliberately did not take

- Light display weights (300) and tight negative tracking on big headlines: right for adult
  marketing pages, too thin for 5-year-olds. Baloo 2 at 800 stays for titles.
- 4px radii everywhere (Cursor, Intercom): too sharp for a children's app.
- "No shadows at all" (Intercom, Perplexity, Apple): a floating transport and a bottom sheet need
  one shadow to read as floating over a painting.
- Chunky Duolingo-style bottom borders and saturated green: the site is read at bedtime.
- Dark styles (Reflect, ORYZO), iridescent gradients, glass: on the avoid list since 2026-11-03.

Sources: [Refero Styles](https://styles.refero.design), style pages for
[Cursor](https://styles.refero.design/style/4e3b4717-84c8-4599-baaf-a343c3d619b6),
[Steep](https://styles.refero.design/style/75fdb89f-ca64-41b3-af36-7a78bd09448e),
[Intercom](https://styles.refero.design/style/12255b63-e506-4bc1-a4cd-d05487de32f3),
[ElevenLabs](https://styles.refero.design/style/031056ff-7af1-46db-8daa-115f731c5d26),
[Perplexity](https://styles.refero.design/style/7c4e9339-591c-46c3-ac3d-20c1b5b5a568),
[Apple iPhone](https://styles.refero.design/style/a73148b9-449b-42cd-9f38-86ef694f500e),
[Things](https://styles.refero.design/style/ec0f5bca-8367-49e7-b8aa-73b3fa09a4a0),
[Wise](https://styles.refero.design/style/367c0c6e-73a7-441c-a8ff-91d139ac60dc),
[Reflect](https://styles.refero.design/style/e7f92774-3c08-402b-917d-020ba1f3d489),
[Duolingo A](https://styles.refero.design/style/95b472c5-fc07-46a8-a11f-c5432e290fcd),
[Duolingo B](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350),
[Busuu](https://styles.refero.design/style/72b85d0a-1ff8-4dd3-b33a-f55aad6df5c9).
