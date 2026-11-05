# Game mockups: visual and UX critique (2026-11-03, finished 2026-11-04)

Reviewer: `kids-game-designer`. This is a review only; no mockup file was edited.
Owner's verdict: "not bad idea but very bad UI and graphics". I agree with both halves. The
mechanics are mostly sound. The way the games look and are laid out is well below the site's own
painted plates. Today they look like a form with a picture attached.

## How this was checked

- Served `UI/` with a no-cache `http.server`. Drove each mockup with Playwright
  (chrome-headless-shell 1248) at tablet landscape 1180x820 and phone 390x844, in EN and AR.
- Screenshots are in
  `/private/tmp/claude-501/-Users-hishamabuella-Work-Interactive-Islamic-kids-website/e8e68c51-18d1-4a2c-bedb-40bde535d502/scratchpad/game-review/`
  (about 230 PNGs). Prefixes:
  - `01-nuh-*`, `07-lanterns-*`, `08-fil-*`: full playthroughs (start, mid, pause, end).
  - `06-garden-*`, `09-honest-*`: start plus a few steps.
  - `x02-*`, `x03-*`, `x04-*`, `x05-*`, `x10-*`: start and first interaction.
  - `ref-*`: the site's own story and surah pages, for comparison.
- How far each run got:
  - **01 Nuh:** played to the ending on tablet. On phone it could not be finished by tapping; see problem 5.
  - **07 Lanterns:** played to the ending in every size and language.
  - **08 Al-Fil:** played to the last step (the Kaaba glows).
  - **02-06, 09, 10:** start and first steps only.
- Compared against `UI/images/stories/prophet-nuh/scene-*.webp`, `UI/images/surahs/surah-al-fil/verse-*.webp` and `UI/story-prophet-nuh.html`.
- 06 (Deeds Garden) and 10 (Ask and Find) say in their headers that they use placeholder art (an
  ASSETS block). They are judged on UI and layout only. Their emoji problems are still listed,
  because they show why emoji cannot be the final art.

## What the site already looks like

The plates set the standard. They are Ottoman and Persian manuscript illumination: flat gouache on
cream parchment, lapis cobalt and Iznik turquoise, gold-leaf outlines, a fine gold rule border, and
stylised geometric forms. `UI/scripts/specs/illustrations.py:22-26` fixes this style for every
plate. The plates are calm, textured and decorative, and every one sits inside a gold frame. The
games share none of it: no texture, no gold-leaf line, no frame language and no painted surface. A
child moving from a story page into its game steps down in quality, when the game should feel like
stepping *into* the plate.

## Top 10 problems, ranked by visual impact

### 1. No real art: CSS and SVG primitives in a style that clashes with the plates

The scenes are built from flat shapes. Each game uses a different visual language, and none matches the plates.

- **01 Nuh:**
  - The world is an SVG hill and sand bands (`01-nuh-ark.html:206-214`).
  - The ark is a CSS trapezoid with dashed rows (`:134-150`).
  - The mockers are three grey "pill people" (`:208-212`). They read as gravestones or toilet-door icons.
- **08 Al-Fil:**
  - The elephant is clip art: blue ellipses with rectangle legs and an orange saddle (`08-al-fil-seek.html:111-124`). The two "distant" elephants sit on its head (`:204-212`).
  - The birds are "~~" squiggles (`:125`).
  - The Kaaba is three black parallelograms (`:148-155`). That is a crude rendering of a sacred building and should go to the scholar.
- **07 Lanterns:** the whole "courtyard" is one 60x90 line icon (`07-ayah-lanterns.html:136-145`) on a dark rounded box (`:51-58`).
- **03 Musa:** the sea is three blue bars and a row of dashed boxes (`x03-*`), so there is no sea, no path and no night.
- **04 Ibrahim:** one emoji star on a flat navy rectangle (`x04-*`).
- **05 Adam:** emoji trees in a grid (`05-adam-garden.html:418`), with a red-dashed "🚫 Do not approach this tree" pill (`:559`).
- **09 Honest:**
  - A flat living room strip, with a ball, cup and chair drawn as inline SVG (`09-honest-choices.html:318-325`).
  - The broken cup is two blue triangles.

The fix is painted art in the plate style. Nothing visible should be drawn in CSS except UI chrome and gold line ornaments.

### 2. Emoji are used as game pieces, HUD icons and reward art

Emoji render differently on every platform, and they never match a painted world. Some are simply wrong.

- **Wrong for the story:**
  - The Nuh ending art is `🚢🌿🕊️` (`01-nuh-ark.html:652`). That is a modern steamship with a red funnel, standing in for the ark.
  - In 10, the ark is a sailing dinghy `⛵`, the well is a plastic bucket `🪣`, and Musa's staff is chopsticks `🥢` (`10-ask-and-find-coop.html:220`).
- **Rendering badly:**
  - The 🐦 bird renders as a grey blob (`01-nuh-tablet-en-5animals-full.png`, `x10-*`).
  - The toolbar 🗣️ (voice) button is nearly invisible on the teal bar in every Nuh-kit game.
- **Pieces too small to read:** animals load into the cabin windows as 1rem emoji (`01:146`, `.win`). That is the payoff of the whole phase, and it is too small to see.

### 3. The layout is a web page, not a game screen

Each game is a card with the scene in it, then a narration strip, then HUD rows, then the pieces to
play with, all stacked down the page. The child's eye and hand keep leaving the world.

- **01 Nuh at 1180x820:**
  - The "Keep building / Stop" choices sit below the fold (`01-nuh-tablet-en-2choice.png`).
  - The whole animal meadow is below the fold (`#meadow`, `01:163`, outside `.scene`), so you drag from below the fold up into the scene.
  - The hammer is outside the scene, under the text (`01-nuh-phone-en-2hammering.png`).
- **07 Lanterns:**
  - The tray of lanterns sits under the string (`07:82`). On phone they are a full screen apart, so the drag crosses a scroll (`07-lanterns-phone-en-3wrong.png`).
  - The "courtyard" is a list of four dashed form rows.
- **08 Al-Fil:** the scene is about 640x390 at top-left, with 350px of empty parchment below it.
  - On tablet the reveal panel grows longer than the screen, so the scene scrolls out of view (`08-fil-tablet-en-5pause.png`).
  - On phone the scene is 350x200 and every response appears below the fold, out of sight of the tap (`08-fil-phone-en-4reveal1.png`).
- **09 Honest:** the living room picture is a header strip, and the action happens in a separate empty dashed box beneath it (`09:54`, `.act`). That makes two disconnected "worlds".
- **02 Yusuf:** the path and the cards are separate boxes. On phone the cards are below the fold (`x02-phone-ar-2mid.png`).

The fix is a full-bleed stage that fills the viewport with no page scroll during play. Pieces live inside the scene. Narration and HUD are thin overlays on the scene's edge.

### 4. Staging bugs break the story, mostly in Nuh

- **The hill:** it ends in a vertical cliff at x=520 (`01:207`, `L520 625`). It is visible in every Nuh shot.
- **The sun:** it never changes. It shines through the storm and the flood (`01:206`, never touched by `rain()`).
- **The rain:**
  - It is a hard barcode of diagonal stripes (`01:167-168`, `repeating-linear-gradient`).
  - It is still visible after the narration says "the rain stopped" (`01-nuh-tablet-en-8dove.png`).
- **The flood:**
  - The water rises over the hull, so the ark appears to sink (`8dove`).
  - Then, on "it came to rest on Judi", the ark hangs in mid-air above the sea with no mountain in sight. `#judi` is z-index 1, under `#water` at z-index 2 (`01:171,175`), and the ark is lifted with `translateY(-64%)` (`01-nuh-tablet-en-9judi.png`).
- **The dove:** a white disc with an emoji, sitting on the hull.
- **Al-Fil:** "the plan going astray" is a squiggle replacing an arrow on a little map. The army becoming "eaten straw" fades the elephants to 12% opacity and adds tufts on top (`08-fil-tablet-en-6end.png`). That is the climax of the surah, and nothing happens in the sky or on the ground.

### 5. Phone layouts are broken (Nuh cannot be finished by tapping)

- **01 Nuh at 390px:**
  - The scene turns 4:5 portrait (`01:183-188`), but the art is composed for landscape. The top half is empty sky, the ark is cut off on the right, and the mockers drop out of frame.
  - The hull is 108px tall, but six rows at `min-height:24px` (`01:138`) need 144px. Rows 5 and 6 render above the hull's `clip-path` (`01:137`), where the child cannot see them. A probe shows the hull top at y=390 and row 6 at y=354; `elementFromPoint` on row 6 returns `#ark`.
  - The Playwright run timed out trying to tap row 5 or 6 (`nuh-phone-en-FAILSTATE.png`). Note that the file has since been edited to accept a drop anywhere on the hull (`01:140-142`), but the top rows still sit outside the visible hull.
  - The plank pile overlaps the hull by 21px.
- **03 Musa at 390px:** the eight-cell path overflows the scene, and "Safe shore" (the goal) is clipped off the right edge (`x03-phone-en-1start.png`).
- **AR headers on phone (06, 07):** the title wraps and the "نموذج تجريبي" badge breaks across lines (`07-lanterns-phone-ar-2start.png`, `06-phone-ar-main.png`).

### 6. The one good picture is shown distorted, next to clip art

- 08 shows the real surah plate in the reveal panel, but stretched. The CSS sets `.plate{width:100%}` with no `height:auto`, and the `<img>` has `height="540"` (`08:77, 248`), so a 16:9 plate renders as roughly 360x540 (`08-fil-tablet-en-4reveal3.png`).
- Placing a painted plate beside the clip-art scene makes the gap between them obvious.

### 7. No light, depth or atmosphere

- Skies are single gradients, and there is no layering, framing, vignette or texture.
- "Lighting a lantern" (07) means a `drop-shadow` on a 40px icon (`07:70`). The lit courtyard never actually becomes a courtyard.
- The 06 courtyard is a dark card holding a grid of tiles (`06:34-37`).
- Shadows are generic `box-shadow`. Nothing has a light source.
- The plates get their richness from texture, gold line and framing. The games have none of the three.

### 8. The UI chrome is generic web furniture, and it differs between games

- **Dashed outlines everywhere:** they are the main affordance (hull rows, ramp, seats, lantern slots, Musa cells, the Adam rule tree, the 09 act box). Dashed borders read as "empty form field", not as a magical place to put something.
- **Unanchored pills:**
  - Phase tags, "Prototype"/"Mockup" badges and the turquoise-gradient pills have no ornament and no tactile lip.
  - In 04 the phase tag has white text on a white pill and is unreadable (`04-ibrahim-stars.html:136`: `.scene.night{color:#fff}` is inherited by `.phase-tag`).
- **Overlaps:** the speaker button covers the meaning text on lantern cards (`07:91`, `.lcard .hear` is absolutely positioned over the text).
- **Two different kits:** 01-05 inline their own tokens and square-ish buttons. 06-10 link `styles.css` and use round pills. Button shapes, toolbar order (voice, chimes, moon, language against moon, bell, language) and focus styles all differ.
- **Cheap progress counter:** in Nuh, "⭐⭐ You kept going twice" (`renderStars`). It is visually cheap, and it edges towards a streak.

### 9. Typography

- **No web fonts:** none of the mockups load fonts. `story-prophet-nuh.html:9-11` loads Baloo 2 and Nunito; the mockups do not, so every title falls back to system sans and loses the site's friendly rounded heading.
- **AR font fallbacks:** AR mode declares Amiri for the whole UI (`07:18`, same in 08), but Amiri is not loaded. Arabic falls back to Geeza Pro, and the "English" button renders in Times (`08-fil-tablet-ar-2step1.png`).
- **The dua is too small:** in the Nuh ending, the Arabic is no bigger than the English body text, inside a pale blue box (`01-nuh-tablet-en-10ending.png`).
- **Plain ayah markers:** in the 07 ending they are numbered circles (`07:105-108`), not ornamented ayah-end medallions.
- **Too much reading:** narration strips run to two or three lines of bold 1.1-1.2rem text, which is a heavy reading load for a 5-year-old. They need voice plus short text.

### 10. Pause points, endings and sound are flat dialogs and beeps

- **Same white card everywhere:** every pause point and every ending is the same white rounded card over a dimmed scene (`01:252-273`, the 07 and 08 `.pause-card`). The reward never happens *in the world*.
  - 07 throws away the lit courtyard and shows a text card (`07-lanterns-tablet-en-6end-full.png`).
  - 08 ends with a glow around a black box.
  - Nuh ends with three emoji over a modal.
- **No warmth:** the parent pause has no image, so it reads like a system alert.
- **Sound:**
  - All "chimes" are raw sine and triangle oscillators (`01` `chime()`, `07:320`). They sound like a test tone, not a soft bell or wood tap.
  - Voice is browser `speechSynthesis` (robotic, and different on every device). The site already has the father's narrated voice files, and the games ignore them, apart from 07 and 08 playing the verse-meaning mp3s.

## Smaller notes

- **RTL:** layout mirroring mostly works. The scene art does not mirror, which is fine for a picture. Directional mechanics do mirror: the Yusuf path and the Nuh ark side.
- **Bedtime mode:** it only applies a `filter: brightness()` to the whole stage. It should be a night palette with lamps lit.
- **Nuh toolbar:** the 🗣️ voice toggle is greyed out with `opacity:.6` when off, which looks disabled rather than "off".

## What "good" looks like

Each game should feel like stepping into one of the site's illuminated plates and finding it alive:

- **One full-bleed scene, no page scroll:** framed by a gold-ruled border and a girih corner ornament. It is painted in the same Ottoman/Persian gouache-on-parchment style as `specs/illustrations.py`, with cobalt, turquoise and gold-leaf line.
- **Pieces inside the picture:** the child drags or taps painted objects that live in the scene (planks, animals, lanterns, flocks, fruit), never into boxes under it.
- **State changes are painted:** dry valley to rain to flood to Judi, dark courtyard to lit courtyard, army to straw. Each is a crossfade between matched plates with sprite layers on top. They are not opacity tricks on CSS shapes.
- **A minimal HUD at the edges:** gold beads for progress, an ornamented narration ribbon one or two short lines long, read in the father's voice. Tactile buttons with a lip, 64px or larger.
- **Feedback in the world:** a snap, a wood tap, a lantern bloom, a soft natural chime.
- **Pause points and endings are scenes:** a parchment page with the question beside a calm still of the moment. The dua is set large in proper naskh inside an illuminated cartouche.
- **Phone composition:** a portrait layout of its own, not a crop of the landscape art.

## The graphics research doc (`game-graphics-research-2026-11-03.md`): where I agree and disagree

**Agree:**
- The diagnosis: the art is the problem, not the engine.
- DOM + SVG + painted WebP layers, with all text in the DOM, and Pixi only as a fallback.
- "Never mix emoji, CSS blobs and paintings."
- Vendored fonts. Tap-to-select as the alternative to drag.
- No timers or scores.
- 64px targets and corner HUD.
- A per-game contact-sheet review by the father and the scholar.
- A new `build-game-art.py` calling the gated shim, and fixing `build-illustrations.py`, which still calls `/opt/homebrew/bin/draw-things-cli` directly (`UI/scripts/build-illustrations.py:36`). That breaks the RAM-gate rule.

**Disagree, or would change:**
1. **Style:** do not invent a new "storybook gouache" style suffix. Reuse the existing `STYLE` and `NEGATIVE` from `specs/illustrations.py` word for word, so the games match the plates exactly.
2. **Depth:** the doc's references (Monument Valley, Alba, atmospheric haze, a directional key light) pull towards a 3D-ish look that manuscript illumination does not have. Get depth from layered flat planes, framing arches and overlap, not from haze and spotlights.
3. **Sticker rim:** the "2-3 px parchment sticker rim" on cut-outs will look like stickers on a page. Miniature style uses a fine dark-ink or gold outline. Match that instead.
4. **Painted state changes:** use the `qwen_image_edit_2511` model (it is installed) to make the *state-change* plates from one master plate, for example "the same valley, now flooded" or "the same courtyard, lanterns lit". That keeps composition, palette and light identical between states. Interactive props are better as separate renders cut out with rembg. The doc only covers generate-then-cut.
5. **GSAP:** I would not take it on yet. Springs, the Web Animations API and a small rAF loop cover these games. Add GSAP only if one scene really needs MotionPath or DrawSVG.
6. **Layout:** the doc says almost nothing about it, and layout is half of what the owner called "bad UI". It needs a stage-first, no-scroll layout rule, a separate portrait composition for phone, and "drag source and target always on screen together".
7. **Kids' copy at 22-28px:** cut the text instead. One short line, voiced. Bigger type on long sentences makes the phone layout worse.

## Local tooling found (nothing generated, no model loaded)

- **Draw Things:**
  - Gated shim `~/.local/bin/draw-things-cli` is present. It wraps `generate` in `ram-gate run --heavy`.
  - Real binary: `/opt/homebrew/bin/draw-things-cli` (1.20260716.0).
- **Models** in `~/Library/Containers/com.liuliu.draw-things/Data/Documents/Models`:
  - `z_image_turbo_1.0_q8p.ckpt` (5.9 GB): what the current plates use.
  - `qwen_image_2512_q8p.ckpt` (20 GB).
  - `qwen_image_edit_2511_q8p.ckpt` (20 GB): image edit, good for consistent state variants.
  - `qwen_image_vae_f16`, `flux_1_vae_f16`: VAEs only, no FLUX model.
  - Qwen 2.5-VL 7B and Qwen 3-VL 4B text encoders.
- **RAM:** at check time 32% was free, with Ollama holding `qwen3.8:27b-mlx`. A 20 GB Qwen-Image run needs Ollama unloaded first (`ram-gate cleanup --ollama`).
- **Background removal:**
  - Python lib `rembg` 2.0.76 with onnxruntime 1.27. `/opt/homebrew/bin/rembg` exists, but its CLI extras are not installed (`pip install "rembg[cli]"`), so use it from Python for now.
  - Models in `~/.u2net`: `u2net`, `u2net_human_seg`, `isnet-general-use`.
  - No BiRefNet weights are present; `birefnet-general` would download about 900 MB on first use.
- **Image tools:**
  - Pillow 12.3 with WebP support.
  - ffmpeg is present, but without a libwebp encoder.
  - Not installed: ImageMagick, vips, cwebp, potrace, inkscape, svgo, pngquant, oxipng.
- **Runtime:**
  - Node v24.12.0 and Python 3.14.2 (Homebrew), plus uv.
  - Playwright 1.65-alpha is in the npx cache, but its expected browser (headless shell 1252) is not installed. Use `executablePath` to `~/Library/Caches/ms-playwright/chromium_headless_shell-1248/...`.
