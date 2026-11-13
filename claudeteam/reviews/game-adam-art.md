# Game 05, The Garden of Choices (Adam): art list, prompts, seeds and rejects

Owner: `kids-game-designer`, 2026-11-12. Status: scholar gates 2-3 reviewed 2026-11-12 (2a PASS, 2b PASS WITH FIXES, 3 PASS WITH FIXES); the fixes are applied
(see "Fixes after gates 2-3" in `game-adam-garden.md`) and await the scholar's re-check.
This file is the designer's self-check only. The images were rendered under the owner's standing approval of the
painted-games direction. Nothing here is linked from the story or the hub until the scholar signs off 2a, 2b and 3.

- Source of truth for prompts and seeds: `UI/scripts/specs/games/adam.py` (every reject, candidate and pick is recorded
  there with its reason). Renderer: `UI/scripts/build-game-art.py adam gen|cut|export`; export rules:
  `UI/scripts/specs/games/adam_export.py`. Contact sheet: `claudeteam/reviews/game-adam-contact-sheet.png` (every plate,
  and every sprite on a light and a dark ground).
- `STYLE` and `NEGATIVE` are imported from `UI/scripts/specs/illustrations.py` and used **word for word**. The game
  additions are the 3a.3 list (with `apple tree, bikini, bare shoulders`), the Adam bans of 3a.4 and gate 1 (`apple,
  apples, red apple, green apple, snake in a tree, serpent coiled on a branch, lizard, figures, faces, face, eyes,
  mouth, facial features, fruit being held, hands holding fruit, bitten fruit, bite mark`), and the lessons of the four
  approved games (`crossed poles, x shape, crossbar, lattice, trellis, window bars, mullions, tile grid, medallion,
  concentric lozenge, lozenge with a dot, eye motif, nazar, script-like marks, corner signature`). Every plate also
  carries `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky`: no sky body is drawn anywhere.
- Seeds are `crc32("game-adam/<asset>") % 2,000,000`; a rejected render is rerolled with a new seed (suffix `-r2a/b/c`,
  `-r3`), never retouched. Where Z-Image kept decorating, the shipped sprite is a recorded Qwen-Image-Edit of the
  cleanest render with one narrow change ("remove the diamonds"), as the scholar allowed for the Ibrahim crust and tents.
- Models: Z-Image Turbo 1.0 (q8p) for the masters and cut-out sources; Qwen-Image-Edit 2511 (q8p) for the dimmed garden
  and the earth at dawn (edits of each garden master), for the basket, ball, leaves and cat (decoration removed), and
  (after gate 2b) for the portrait garden master (the ≡ bark marks removed; the dim edit re-run on it).
- Pipeline: Draw Things only through `~/.local/bin/draw-things-cli` (RAM gate + heavy lane, one job at a time;
  `ram-gate status` checked first, never `RAMGATE_DISABLE`). Jobs waited at the gate whenever free RAM was under 25%
  (another process ran a model with the gate disabled). rembg `isnet-general-use` ran only under `ram-gate run --heavy`
  and only when no draw-things-cli binary was running (a scratch cutter checks the process name; the build script's
  check also matches queued shims). Whisper large-v3-turbo (narration cuts) ran under `ram-gate run --heavy` and exited.
  Pillow export, no model. Every model process exited when its job ended.
- Registration: the dimmed garden is registered to the garden master by edge correlation (50/50 blend shows no doubling).
  The earth edits redrew the border as a wide blue scrollwork band and moved the river, so each is cropped to a fixed
  box measured inside that band (`INNER_BOX` in the export): no part of the band ships.
- Raw renders: `UI/art-raw/adam/` (gitignored; rejects in `UI/art-raw/adam/rejected/` and the `cand-*` files).

## The scenes and their layers

| Layer (back to front) | Asset | Notes |
|---|---|---|
| The garden (Jannah), the same garden dimmed after the slip, the earth at dawn | `plate-{garden,dim,earth}-{land,port}` | 1240 x 791 (landscape), 690 x 1319 (portrait). The one tree stands alone on its hill, plain broad leaves, **no fruit**, nothing beneath it; it is not an apple tree. No figure anywhere. |
| Motes | PixiJS, procedural (no image) | decoration only, a few slow motes on a success; the game is whole without it |
| Fruit of the allowed trees | `fruit-pomegranate`, `fruit-dates` (landscape), `fruit-figs` (portrait) | whole, untouched, never held; they hang only on the pomegranate tree, the palms or the fig tree |
| Basket | `basket` (Qwen edit) | plain straw, no diamonds |
| Your garden on earth (a courtyard) | `plate-court-{land,port}` | three separate beds (no shared kerbs crossing), a plain wall with no openings, a stone ledge |
| Seedlings and grown plants | `sprout`, `bloom` | the bloom is closed tulip cups |
| Water jug, ball, Mama's pot | `jug`, `ball` (Qwen edit), `pot` | bare brass, plain leather, bare terracotta |
| The pot's three pieces | none: CSS `clip-path` polygons over `pot` | one approved sprite, so nothing new to review; mended, thin dark seam lines |
| Leaves (the "hide" choice), the sleeping cat | `leaves` (Qwen edit), `cat` (Qwen edit) | the cat sleeps curled up, eyes closed, no cushion |
| Adam's dua, istighfar card, frame, shamsa | DOM text and inline SVG | the dua is live text copied from the story page; the shamsa is the one approved on Nuh |

**Not generated, by rule:** Adam, Hawa, the angels, Iblis or Shaytan, Mama, a child, hands, any figure or face, a
serpent, an apple, any fruit on the one tree, any text or Quran, the Ka'bah.

## Scholar gate 2b (2026-11-12) and the fix
All 19 approved. SHOULD applied: `plate-garden-port` is now Qwen edit 699657 of 419717 (the ≡ bark marks removed), and `plate-dim-port` is DIM_EDIT 239281 re-run on it (records in `adam.py`). Shipped: 19 WebP, 948 KB.

## Designer self-check against 3b (all shipped sprites, at 100% and thumbnail, light and dark ground, both layouts, mirrored)
1. Faces or figures: none. Trunk knots in the garden plates read as bark; the knot with a dark dot that looked like an
   eye (garden-port r1) was rejected. The cat's eyes are closed lines.
2. Allah, angels, Shaytan: nothing shown; no eye in the sky, no winged or serpentine shape, no light labelled divine.
3. Crosses and symbols: no X or + from rails, kerbs or tiles (the 2 x 3 bed grid was rejected); every bare surface that
   carried a quatrefoil, diamond or medallion was rejected or edited. Open question below on tree trunks and bark marks.
4. Script-like marks: the corner signature (garden-port a) and the scrollwork border of the earth edits never ship.
5. No Ka'bah, mosque, book or text. 6. No human form. 7. Nothing violent: the pot "breaks" into three clean pieces with a
   soft knock. 8. No apple and no serpent anywhere; the one tree has no fruit. 9. Anatomy: the cat is whole and calm.
10. In context, mirrored for Arabic: checked in the screenshots (no new cross or letter appears).

## Questions for the scholar (gate 2b)
1. **Trees crossing the courtyard wall.** In `plate-court-land` the lemon and pomegranate trunks pass in front of the wall's
   top edge and carry their crowns above it. I read a leafy tree in front of a wall as a tree, not a cross (the Ibrahim
   ruling on a pole through a roof peak), but it is the same geometry. 
2. **Bark marks on the portrait trunks.** `plate-garden-port` and `plate-dim-port` have two or three short horizontal bark
   marks on each tall trunk (around x 40 and x 660), inside the trunk's width. Ornament, or a cross risk?
3. **The ball's gold outline.** The ball (Qwen edit) is a plain red disc with a thin gold rim line just inside its edge
   and a soft highlight. I read it as the manuscript outline every cut-out has; please confirm it does not read as an eye.
4. **The dimmed garden** is the only visual of the slip (no ember, no creature). Is the grey dusk acceptable, given the
   narration names Shaytan's whisper over it?

## Negative prompt (every asset; plus the per-asset extra below)

> people, person, human, human figure, man, woman, child, baby, face, portrait, silhouette of a person, hands, crowd, angel, deity, idol statue of a person, rider, riders, riding, mounted figure, passenger, traveller, robed figure, anthropomorphic sun, sun with a face, moon with a face, face in the sky, text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, rainbow, rainbows, prismatic arc, kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, star and crescent emblem, religious symbol, flag, banner with an emblem, blurry, low quality, letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, artist signature, monogram, seal, faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, human figures, silhouettes, standing stones, hooded figures, face in the rock, pareidolia, book, books, open book, mushaf, scroll, scrolls, parchment roll, prayer rug, prayer mat, kaaba, cube building, black cube, blood, red droplets, splatter, mihrab, prayer niche, arched niche, inscription band, figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, apple tree, bikini, bare shoulders, apple, apples, red apple, green apple, snake in a tree, serpent coiled on a branch, lizard, figures, faces, face, eyes, mouth, facial features, fruit being held, hands holding fruit, bitten fruit, bite mark, crossed poles, x shape, crossbar, lattice, trellis, window bars, mullions, tile grid, medallion, concentric lozenge, lozenge with a dot, eye motif, nazar, script-like marks, corner signature

## Shipped assets (19 WebP, 948 KB)

`plate-earth-port` is kept as rendered (seed 1713284, the EARTH_EDIT of the r2c portrait master, approved 2026-11-12); `plate-earth-land` likewise (seed 1377552).

### `plate-garden-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1120712**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a wide lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river winds across the middle ground, a pomegranate tree heavy with fruit stands at the far left edge, a fig tree and a date palm stand at the far right edge, their low branches reach over the lawn, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-dim-land`
- Kind: edit; edits `plate-garden-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **1507100**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky`
- Prompt (exactly as sent):

  > Keep the exact same garden, trees, river, lawn, composition, style and gold border. Change only the light and the colours: it is now a grey, sombre dusk. The sky is a dull grey-violet, the greens are faded and greyish, the flowers have closed, the river is a dull slate blue, and the whole picture is quiet and dim. No sun, no moon, no stars, no people, no figures, no animals, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-earth-land`
- Kind: edit; edits `plate-garden-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **1377552**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky`
- Prompt (exactly as sent):

  > Keep the same composition, the river's path, the hills, the style and the gold border. Change the place: it is now the wide open earth at dawn, not a garden. The lawn becomes wild grassland and patches of bare golden earth, the river becomes a small plain stream, the fruit trees become a few young wild trees and green bushes, low hills rise in the distance, and the sky is a soft clear dawn of apricot, rose and pale turquoise. Fresh, calm and hopeful. No sun disc, no moon, no people, no figures, no animals, no buildings, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-garden-port`
- Kind: edit; edits `plate-garden-port-src419717`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **699657**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, marks on the trunk, stripes on the bark, symbols, rings round the trunk, ties, bands, fruit on the middle tree`
- Prompt (exactly as sent):

  > Keep the exact same picture: the pomegranate tree, the lone middle tree on its hill, the fig tree, the river, the lawn, the flowers, the sky, the colours, the style and the gold border. Change only the two tall trunks at the left and right edges: remove the small groups of short horizontal marks on them, so each trunk is plain smooth bark from top to bottom. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-dim-port`
- Kind: edit; edits `plate-garden-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **239281**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky`
- Prompt (exactly as sent):

  > Keep the exact same garden, trees, river, lawn, composition, style and gold border. Change only the light and the colours: it is now a grey, sombre dusk. The sky is a dull grey-violet, the greens are faded and greyish, the flowers have closed, the river is a dull slate blue, and the whole picture is quiet and dim. No sun, no moon, no stars, no people, no figures, no animals, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-court-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1224903**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the back, a lemon tree and a pomegranate tree show above the wall, the floor is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles, three separate small square beds of dark brown soil stand apart from each other in one row across the left half of the picture with gaps of earth between them and nothing growing in them, on the right a low plain flat stone ledge against the wall with nothing on it, a few green bushes in the corners, a calm clear pale turquoise sky, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-court-port`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **623526**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the middle of the picture, a lemon tree and a pomegranate tree show above it against a calm clear pale turquoise sky, the floor in front is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles and fills the bottom half, three separate small square beds of dark brown soil stand apart from each other in one row across the lower part with gaps of earth between them and nothing growing in them, a low plain flat stone ledge at the right against the wall with nothing on it, a few green bushes in the corners, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `fruit-pomegranate`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1994042**.
- Extra negative: `cut open, seeds, halves`
- Prompt (exactly as sent):

  > one whole ripe red pomegranate with its small crown, smooth matte skin, not cut open, two small green leaves on a short stem, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `fruit-dates`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1114522**.
- Extra negative: `bowl, plate`
- Prompt (exactly as sent):

  > one small cluster of ripe glossy brown dates hanging on a short golden stalk, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `fruit-figs`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1537934**.
- Extra negative: `cut open, halves, seeds, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > two whole ripe purple figs side by side on a short stem with one green fig leaf, not cut open, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `basket`
- Kind: cutedit; edits `cand-basket-a`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1024x768, seed **1969323**.
- Extra negative: `diamond, lozenge, motif, pattern, decoration, blue marks, border, frame, fruit, handle`
- Prompt (exactly as sent):

  > Keep the exact same empty straw basket, its shape, its weave, the light, the angle, the plain pale background and the style. Remove the blue diamonds from its side: the whole basket is now plain natural golden straw of one colour, with no pattern, no motif and no decoration. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `jug`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **514462**.
- Extra negative: `engraving, inscription, hands, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small plain brass watering jug with a round body, a long thin curved spout and one handle, bare polished brass of one colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `sprout`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **407091**.
- Extra negative: `pot, flowers`
- Prompt (exactly as sent):

  > one tiny young green seedling with two small round leaves growing from a small mound of dark brown soil, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `bloom`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1894698**.
- Extra negative: `pot, vase`
- Prompt (exactly as sent):

  > one small young flowering plant with fresh green leaves and three closed cup-shaped soft pink tulip flowers, growing from a small mound of dark brown soil, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `ball`
- Kind: cutedit; edits `cand-ball-a`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x768, seed **1102657**.
- Extra negative: `diamond, lozenge, star, motif, pattern, decoration, medallion, seams, stitching, border, frame`
- Prompt (exactly as sent):

  > Keep the exact same round red-brown leather ball, its size, its soft shading, the light, the plain pale background and the style. Remove the turquoise and blue diamond and the seam lines completely: the ball is now plain smooth red-brown leather of one colour all over, with no pattern, no motif, no seams and no decoration. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `pot`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **990001**.
- Extra negative: `flowers, plant, band, glaze pattern, handles, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one round-bellied clay pot with a short wide neck, bare unglazed warm terracotta of one colour all over, standing upright, whole, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `leaves`
- Kind: cutedit; edits `cand-leaves-c`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1024x768, seed **697432**.
- Extra negative: `tile, enamel, diamond, lozenge, motif, gem, jewel, ornament, pattern, decoration`
- Prompt (exactly as sent):

  > Keep the exact same heap of dry autumn leaves, their colours, the light, the angle, the plain pale background and the style. Remove the small blue and turquoise tile from the heap and fill its place with more brown and ochre leaves, so the heap is only leaves. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cat`
- Kind: cutedit; edits `cand-cat-b`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1024x768, seed **967836**.
- Extra negative: `cushion, mat, rug, bed, medallion, ring, border, motif, pattern, open eyes`
- Prompt (exactly as sent):

  > Keep the exact same sleeping grey tabby cat, curled up with its eyes closed, its fur, its pose, the light and the style. Remove the round turquoise and blue cushion under it completely: the cat now lies curled up on the plain pale cream background, with only a very soft shadow. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

## Rejected first renders (seed, reason in `adam.py`)

- plate-garden-land 175932: no lone tree; a date palm would identify the one tree
- plate-garden-port 1887016: eye-like bark knot; fallen pomegranates by a sapling
- plate-court-land 1740550: 2 x 3 bed grid with "+" kerbs; barred window
- plate-court-port 413714: bubble rings in the sky; footprint-like dents; scribble; a pot already on the floor
- fruit-figs 923965, fruit-pear 358922, fruit-orange 522270: concentric blue lozenges on the skin
- basket 310487: spiral base (target) and blue band
- jug 1176090, ball 1967080, pot 357945: quatrefoil or medallion with a dot
- leaves 1144947: two tiles with blue ovals
- cat 1544222: ornamented round cushion (medallion)
- plate-garden-port 419717 (approved r2c) and plate-dim-port 937736: replaced after scholar 2b SHOULD (the ≡ bark marks); 419717 is the input of the shipped edit 699657, and the dim edit was re-run on the new master (239281)

## Candidates rendered for the rerolls (picks and rejects are recorded in `adam.py`)

### `cand-plate-garden-land-a` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **126194**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a wide lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river winds across the middle ground, a pomegranate tree heavy with fruit stands at the far left edge, a fig tree and a date palm stand at the far right edge, their low branches reach over the lawn, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-garden-land-b` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1120712**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a wide lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river winds across the middle ground, a pomegranate tree heavy with fruit stands at the far left edge, a fig tree and a date palm stand at the far right edge, their low branches reach over the lawn, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-garden-land-c` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **526558**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a wide lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river winds across the middle ground, a pomegranate tree heavy with fruit stands at the far left edge, a fig tree and a date palm stand at the far right edge, their low branches reach over the lawn, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-garden-port-a` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1737769**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river crosses the middle, a pomegranate tree heavy with fruit at the left edge and a fig tree at the right edge with low spreading branches, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds fills the top third, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-garden-port-b` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **671635**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river crosses the middle, a pomegranate tree heavy with fruit at the left edge and a fig tree at the right edge with low spreading branches, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds fills the top third, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-garden-port-c` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **419717**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a lush paradise garden seen like a manuscript painting, a soft green lawn with small flowers fills the bottom third, a clear calm blue river crosses the middle, a pomegranate tree heavy with fruit at the left edge and a fig tree at the right edge with low spreading branches, in the open centre of the picture, across the river on a small round green hill, one single tree stands alone: a straight smooth trunk and one round crown of plain broad dark green leaves, quite unlike the other trees, with no fruit and no flowers on it and nothing on the ground beneath it, a calm warm pale gold and turquoise sky with a few soft clouds fills the top third, the lawn in front is open and clear, no fallen fruit on the ground, the tree trunks are smooth with no knots, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-land-a` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1224903**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the back, a lemon tree and a pomegranate tree show above the wall, the floor is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles, three separate small square beds of dark brown soil stand apart from each other in one row across the left half of the picture with gaps of earth between them and nothing growing in them, on the right a low plain flat stone ledge against the wall with nothing on it, a few green bushes in the corners, a calm clear pale turquoise sky, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-land-b` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1275773**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the back, a lemon tree and a pomegranate tree show above the wall, the floor is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles, three separate small square beds of dark brown soil stand apart from each other in one row across the left half of the picture with gaps of earth between them and nothing growing in them, on the right a low plain flat stone ledge against the wall with nothing on it, a few green bushes in the corners, a calm clear pale turquoise sky, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-land-c` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1612267**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the back, a lemon tree and a pomegranate tree show above the wall, the floor is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles, three separate small square beds of dark brown soil stand apart from each other in one row across the left half of the picture with gaps of earth between them and nothing growing in them, on the right a low plain flat stone ledge against the wall with nothing on it, a few green bushes in the corners, a calm clear pale turquoise sky, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-port-a` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **536220**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the middle of the picture, a lemon tree and a pomegranate tree show above it against a calm clear pale turquoise sky, the floor in front is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles and fills the bottom half, three separate small square beds of dark brown soil stand apart from each other in one row across the lower part with gaps of earth between them and nothing growing in them, a low plain flat stone ledge at the right against the wall with nothing on it, a few green bushes in the corners, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-port-b` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **623526**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the middle of the picture, a lemon tree and a pomegranate tree show above it against a calm clear pale turquoise sky, the floor in front is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles and fills the bottom half, three separate small square beds of dark brown soil stand apart from each other in one row across the lower part with gaps of earth between them and nothing growing in them, a low plain flat stone ledge at the right against the wall with nothing on it, a few green bushes in the corners, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-plate-court-port-c` (candidate)
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1165872**.
- Extra negative: `moon, crescent, sun, sun disc, planet, comet, rays of light from the sky, fallen fruit, fruit on the ground, knot, knothole, bark eye, grid of beds, shared kerbs, footprints, prints, dents, marks on the ground, bubbles, rings in the sky, window, barred window, flower pot, vase`
- Prompt (exactly as sent):

  > a tall vertical view of a small sunny family courtyard garden seen like a manuscript painting, a low plain sand-coloured wall of smooth plaster with no openings runs across the middle of the picture, a lemon tree and a pomegranate tree show above it against a calm clear pale turquoise sky, the floor in front is smooth plain packed earth of one even warm sand colour with no marks, no lines and no tiles and fills the bottom half, three separate small square beds of dark brown soil stand apart from each other in one row across the lower part with gaps of earth between them and nothing growing in them, a low plain flat stone ledge at the right against the wall with nothing on it, a few green bushes in the corners, no doors, no windows, no gate, no pots, no tiles, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-figs-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **779170**.
- Extra negative: `cut open, halves, seeds, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > two whole ripe purple figs side by side on a short stem with one green fig leaf, not cut open, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-figs-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **769816**.
- Extra negative: `cut open, halves, seeds, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > two whole ripe purple figs side by side on a short stem with one green fig leaf, not cut open, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-figs-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1537934**.
- Extra negative: `cut open, halves, seeds, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > two whole ripe purple figs side by side on a short stem with one green fig leaf, not cut open, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-pear-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1278807**.
- Extra negative: `apple, round fruit, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe golden-green pear with a long narrow neck, a short brown stem and one green leaf, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-pear-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **440173**.
- Extra negative: `apple, round fruit, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe golden-green pear with a long narrow neck, a short brown stem and one green leaf, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-pear-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **105467**.
- Extra negative: `apple, round fruit, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe golden-green pear with a long narrow neck, a short brown stem and one green leaf, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-orange-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **170206**.
- Extra negative: `apple, cut open, slices, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe orange citrus fruit with dimpled orange peel and two green leaves on a short twig, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-orange-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **729060**.
- Extra negative: `apple, cut open, slices, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe orange citrus fruit with dimpled orange peel and two green leaves on a short twig, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-fruit-orange-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **448626**.
- Extra negative: `apple, cut open, slices, diamond, lozenge, rhombus, motif, ornament, pattern, decoration, tile, border, frame, medallion, eye`
- Prompt (exactly as sent):

  > one whole ripe orange citrus fruit with dimpled orange peel and two green leaves on a short twig, natural fruit colours only, a botanical study, the skin is plain and natural with no pattern, no diamond, no lozenge, no motif and no decoration painted on it, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-basket-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **936493**.
- Extra negative: `handle, fruit, lid, checks, grid, spiral, concentric rings, inside of the basket, top view, blue band, pattern`
- Prompt (exactly as sent):

  > one low wide empty basket of natural golden straw seen exactly from the side at eye level, so only its outside wall shows and not its inside, no handle, plain even straw weave of one colour, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-basket-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **551831**.
- Extra negative: `handle, fruit, lid, checks, grid, spiral, concentric rings, inside of the basket, top view, blue band, pattern`
- Prompt (exactly as sent):

  > one low wide empty basket of natural golden straw seen exactly from the side at eye level, so only its outside wall shows and not its inside, no handle, plain even straw weave of one colour, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-basket-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **1408641**.
- Extra negative: `handle, fruit, lid, checks, grid, spiral, concentric rings, inside of the basket, top view, blue band, pattern`
- Prompt (exactly as sent):

  > one low wide empty basket of natural golden straw seen exactly from the side at eye level, so only its outside wall shows and not its inside, no handle, plain even straw weave of one colour, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-jug-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **805810**.
- Extra negative: `engraving, inscription, hands, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small plain brass watering jug with a round body, a long thin curved spout and one handle, bare polished brass of one colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-jug-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1117320**.
- Extra negative: `engraving, inscription, hands, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small plain brass watering jug with a round body, a long thin curved spout and one handle, bare polished brass of one colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-jug-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **514462**.
- Extra negative: `engraving, inscription, hands, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small plain brass watering jug with a round body, a long thin curved spout and one handle, bare polished brass of one colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-ball-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **592895**.
- Extra negative: `stitching, seams, panels, stripes, star, pentagon, football, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft round ball of bare red-brown leather, one single colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-ball-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1230277**.
- Extra negative: `stitching, seams, panels, stripes, star, pentagon, football, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft round ball of bare red-brown leather, one single colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-ball-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x768, seed **1270739**.
- Extra negative: `stitching, seams, panels, stripes, star, pentagon, football, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft round ball of bare red-brown leather, one single colour all over, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-pot-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **1611165**.
- Extra negative: `flowers, plant, band, glaze pattern, handles, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one round-bellied clay pot with a short wide neck, bare unglazed warm terracotta of one colour all over, standing upright, whole, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-pot-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **54311**.
- Extra negative: `flowers, plant, band, glaze pattern, handles, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one round-bellied clay pot with a short wide neck, bare unglazed warm terracotta of one colour all over, standing upright, whole, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-pot-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1024, seed **990001**.
- Extra negative: `flowers, plant, band, glaze pattern, handles, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one round-bellied clay pot with a short wide neck, bare unglazed warm terracotta of one colour all over, standing upright, whole, a simple everyday object with no decoration at all, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-leaves-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **1019866**.
- Extra negative: `branch, twig, sticks, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye, tiles, gems, jewels, stones, objects among the leaves`
- Prompt (exactly as sent):

  > one small low heap of fallen dry autumn leaves in soft browns, ochres and greens, only leaves and nothing else among them, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-cat-a` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **708414**.
- Extra negative: `open eyes, staring, standing cat, cushion, mat, rug, bed, basket, round medallion, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft grey tabby cat curled up fast asleep in a round ball on nothing, eyes closed, its head tucked into its tail, peaceful, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-leaves-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **1616608**.
- Extra negative: `branch, twig, sticks, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye, tiles, gems, jewels, stones, objects among the leaves`
- Prompt (exactly as sent):

  > one small low heap of fallen dry autumn leaves in soft browns, ochres and greens, only leaves and nothing else among them, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-cat-b` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **1796868**.
- Extra negative: `open eyes, staring, standing cat, cushion, mat, rug, bed, basket, round medallion, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft grey tabby cat curled up fast asleep in a round ball on nothing, eyes closed, its head tucked into its tail, peaceful, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-leaves-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **656886**.
- Extra negative: `branch, twig, sticks, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye, tiles, gems, jewels, stones, objects among the leaves`
- Prompt (exactly as sent):

  > one small low heap of fallen dry autumn leaves in soft browns, ochres and greens, only leaves and nothing else among them, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `cand-cat-c` (candidate)
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **1667858**.
- Extra negative: `open eyes, staring, standing cat, cushion, mat, rug, bed, basket, round medallion, diamond, lozenge, quatrefoil, rosette, medallion, motif, ornament, pattern, decoration, painted band, glaze, enamel, tile, eye`
- Prompt (exactly as sent):

  > one small soft grey tabby cat curled up fast asleep in a round ball on nothing, eyes closed, its head tucked into its tail, peaceful, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

