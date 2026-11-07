# Game 04, Ibrahim: Stars and Guests: art list, prompts, seeds and rejects

Owner: `kids-game-designer`, 2026-11-07. Status: **pending scholar gates 2-3** (2a prompts, 2b contact sheet,
3 build). This file is the designer's self-check only. The images were rendered under the owner's standing approval of
the painted-games direction. Nothing here is linked from the story or the hub until the scholar signs off 2a, 2b and 3.

- Source of truth for prompts and seeds: `UI/scripts/specs/games/ibrahim.py`. Renderer:
  `UI/scripts/build-game-art.py ibrahim gen|cut|export`; export rules: `UI/scripts/specs/games/ibrahim_export.py`.
- `STYLE` and `NEGATIVE` are imported from `UI/scripts/specs/illustrations.py` and used **word for word**. The game
  additions are the 3a.3 list (as for Nuh and Musa, with `bikini, bare shoulders`), the Ibrahim bans of 3a.4 and
  gate 1 (no guests, no place settings or cups, no idols, statues, figurines or pedestals, no ziggurat, temple tower or
  altar, no fire, flames or axe), "face, eyes, mouth, nose, smile, facial features" for every asset (no faces on the
  sun, moon or stars), and the Nuh/Musa lessons (no crossed poles, X shapes, lattice, window bars or mullions).
  Every plate also carries `moon, full moon, crescent, sun, sun disc, rising sun, setting sun, planet, comet`, so the
  only bodies on screen are the reviewed cut-outs.
- Seeds are `crc32("game-ibrahim/<asset>") % 2,000,000`; a rejected render is rerolled with a new seed (suffix `-r2`,
  `-r3`, ...), never retouched.
- Models: Z-Image Turbo 1.0 (q8p) for the masters and cut-out sources; Qwen-Image-Edit 2511 (q8p) for the morning and
  evening states of the desert (both edits of the night master) and for the crust dish (an edit of the platter).
- Pipeline: Draw Things only through `~/.local/bin/draw-things-cli` (RAM gate + heavy lane, one job at a time, shared
  with the Yusuf agent; `ram-gate status` checked first, never `RAMGATE_DISABLE`) -> rembg `isnet-general-use` under
  `ram-gate run --heavy`, started only while no Draw Things job was alive -> Pillow export (no model).
  - **Registration:** the Qwen edits redrew the border (once as a wide ornament band) and zoomed the scene a little, so
    the painted frame could not be trusted. The export crops each edit to the box whose dunes, palms and houses best
    match the night master (edge correlation on the lower half; `register()` in the export). Night, morning and
    evening then crossfade in register (checked by drawing the horizon line on all three).
  - **The moon is derived, not rendered** (see the rejects): the export takes the approved sun's plain disc (the rays
    cut away by a circle) and recolours it to pale ivory-silver with the gouache texture kept faint, plus the sun's thin
    gold rim. One hand with the sun, and no craters or patches from which a face could form.
  - Cut-outs: trim, 2 px dark-ink outline, light tint-match to the parchment, WebP with alpha.
- Raw renders: `UI/art-raw/ibrahim/` (gitignored; every reject kept in `UI/art-raw/ibrahim/rejected/` with its seed in
  the file name). Whisper (for the narration cuts) ran once under `ram-gate run --heavy` and exited.
- The models were unloaded when done: `draw-things-cli` exits after each job (shim); rembg and Whisper ran in their own
  processes under the heavy lane and exited.

## The scenes and their layers

| Layer (back to front) | Asset | Notes |
|---|---|---|
| The desert at night, in the morning, in the evening (one painted plate per time, landscape and portrait) | `plate-{night,morning,evening}-{land,port}` | 1240 x 783 (landscape), 690 x 1278 (portrait); the far town of plain houses is Ibrahim's people, never figures |
| Star twinkle, motes | PixiJS, procedural (no image) | decoration only; the game is whole without it |
| The bright star | DOM radial glow (no image) | a soft glow of light: no rays (a 4-ray sparkle is a cross) and no ring (a ring round a glow is an eye) |
| The moon, the sun | `moon` (derived), `sun` | plain discs, no faces; set behind the far dunes through a soft mask at the horizon |
| "Created by Allah" cartouche and the three tokens | DOM parchment panel; the tokens reuse `moon`, `sun` and the star glow | in the HUD, never an object in the sky |
| Ibrahim's tent (landscape and portrait, each its own composition) | `plate-tent-{land,port}` | the mat with its cushions is the guests' place; the guests are never drawn |
| The best food, the poor food | `platter`, `bread` (an edit of the platter: same tray, one dry crust) | always whole: nothing shows food being eaten |
| Frame: gold rule and girih corners | inline SVG (no image) | |

**Not generated, by rule:** Ibrahim, the guests (angels), any person or figure, idols or plinths, the axe, the fire,
the Ka'bah, any text. The reward shamsa is the hand-drawn SVG approved on Nuh (scholar gate 3).

## Negative prompt (every asset)

> people, person, human, human figure, man, woman, child, baby, face, portrait, silhouette of a person, hands, crowd, angel, deity, idol statue of a person, rider, riders, riding, mounted figure, passenger, traveller, robed figure, anthropomorphic sun, sun with a face, moon with a face, face in the sky, text, writing, calligraphy, arabic letters, latin letters, numbers, watermark, signature, photorealistic, photograph, 3d render, cgi, horror, scary, gore, rainbow, rainbows, prismatic arc, kaaba, mosque, minaret, dome with a finial, shrine, temple, religious building, star and crescent emblem, religious symbol, flag, banner with an emblem, blurry, low quality, letters, script, inscription, hieroglyphs, glyphs, frieze with symbols, artist signature, monogram, seal, faces on celestial bodies, smiling sun, smiling moon, eyes in the sky, human figures, silhouettes, standing stones, hooded figures, face in the rock, pareidolia, book, books, open book, mushaf, scroll, scrolls, parchment roll, prayer rug, prayer mat, kaaba, cube building, black cube, blood, red droplets, splatter, mihrab, prayer niche, arched niche, inscription band, figure, cross, crucifix, church, menorah, star of david, om symbol, yin yang, buddha, statue, idol, totem, pentagram, evil eye, hamsa, zodiac, halo, wings on a person, cherub, serpent, snake, devil, horns, skull, blood, weapon, sword, spear, gore, bikini, bare shoulders, statues, idols, figurines, carved figures, pedestal with a statue, ziggurat, temple tower, altar, fire, bonfire, flames, axe, guests, diners, place settings, cups, goblets, face, eyes, mouth, nose, smile, facial features, crossed poles, x shape, lattice, window bars, mullions

## Assets

### `plate-night-land`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1344x896, seed **1160080**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet`
- Prompt (exactly as sent):

  > a wide quiet desert at night seen like a manuscript painting, smooth low rolling dunes of pale sand fill the bottom third of the picture, a few date palms stand at the far left and far right edges, a small far-off town of plain low flat-roofed mud-brick houses with tiny warm glowing doorways sits on the horizon in the middle distance, no towers and no domes, a huge deep cobalt blue night sky fills the upper two thirds, scattered small gold dot stars, the middle of the sky is open and empty, the sand is smooth and clean with no marks, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-morning-land`
- Kind: edit; edits `plate-night-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **608985**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet`
- Prompt (exactly as sent):

  > Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only the time of day: it is now a clear bright morning soon after sunrise. The sky is pale turquoise high up and soft gold and apricot near the horizon, the stars are gone, and warm morning light falls on the dunes, the palms and the houses. The sky stays open and empty: no sun disc, no moon, no clouds in the middle, no birds, no people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-evening-land`
- Kind: edit; edits `plate-night-land`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **388088**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet`
- Prompt (exactly as sent):

  > Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only the time of day: it is now calm evening just after sunset. The sky glows soft rose, apricot and violet near the horizon and deepens to dusky blue above, with a few faint first gold stars, and the doorways of the far houses glow warm. The sky stays open and empty: no sun disc, no moon, no people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-night-port`
- Kind: plate. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 768x1408, seed **1049604**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet`
- Prompt (exactly as sent):

  > a tall vertical view of a quiet desert at night seen like a manuscript painting, smooth low rolling dunes of pale sand fill the bottom quarter of the picture, one date palm at the left edge and one at the right edge, a small far-off town of plain low flat-roofed mud-brick houses with tiny warm glowing doorways sits on the horizon, no towers and no domes, a huge deep cobalt blue night sky fills the upper two thirds, scattered small gold dot stars, the middle of the sky is open and empty, the sand is smooth and clean with no marks, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-morning-port`
- Kind: edit; edits `plate-night-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **72013**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet`
- Prompt (exactly as sent):

  > Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only the time of day: it is now a clear bright morning soon after sunrise. The sky is pale turquoise high up and soft gold and apricot near the horizon, the stars are gone, and warm morning light falls on the dunes, the palms and the houses. The sky stays open and empty: no sun disc, no moon, no clouds in the middle, no birds, no people, no text., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-evening-port`
- Kind: edit; edits `plate-night-port`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **1493918**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet, ornament, ornamental border, scrollwork, arabesque, corner ornament, arch, cartouche frame, vines`
- Prompt (exactly as sent):

  > Keep the exact same dunes, palms, far town, composition, palette, style and gold border. Change only the time of day: it is now calm evening just after sunset. The sky glows soft rose, apricot and violet near the horizon and deepens to dusky blue above, with a few faint first gold stars, and the doorways of the far houses glow warm. The sky stays open and empty: no sun disc, no moon, no people, no text. Keep the border exactly as it is now: one thin plain straight gold rule, with no ornament, no scrollwork, no curved corners and no arch., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-tent-land`
- Kind: edit; edits `plate-tent-land-src126676`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1344x896, seed **310210**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet, crossed sticks, crossed poles, crossbar, cross beam, stakes, pegs, x shape, footprints, tracks, holes in the sand, marks on the sand, rope ties across a pole, eye motif, evil eye, nazar, concentric lozenge, lozenge with a dot, diamond medallion, medallion, roof ornament, crossbar on the pole, rail across the pole, frame rails, script, inscription, script-like marks, border pattern, fringe, hem pattern, footprints, paired dents`
- Prompt (exactly as sent):

  > Keep the exact same tent, palm, mat, cushions, clay pots, sand, sky, colours, style and gold border. Remove every rope and cord stretched between the poles under the roof: no line crosses or touches any pole. Each pole is one plain straight upright pole with nothing across it and nothing tied to it. Change nothing else., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `plate-tent-port`
- Kind: edit; edits `plate-tent-port-src761115`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 768x1408, seed **615708**.
- Extra negative for this asset: `moon, full moon, crescent, crescent moon, sun, sun disc, rising sun, setting sun, planet, comet, crossed sticks, crossed poles, crossbar, cross beam, stakes, pegs, x shape, footprints, tracks, holes in the sand, marks on the sand, rope ties across a pole, eye motif, evil eye, nazar, concentric lozenge, lozenge with a dot, diamond medallion, medallion, roof ornament, crossbar on the pole, rail across the pole, frame rails, script, inscription, script-like marks, border pattern, fringe, hem pattern, footprints, paired dents, pole above the band, pole tip, finial, columns, pillars, chevrons, cream sky, blank background`
- Prompt (exactly as sent):

  > Keep everything exactly as it is: the turquoise sky, the palm, the dark tent, the plain turquoise band, the curtain, the cushions, the mat, the clay pots, the golden sand and the gold border. Make only one small change: the two plain wooden front poles are a little shorter, so each pole ends at the lower edge of the turquoise band and nothing of the pole shows above the band. The poles stay plain round wood., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `moon`
- Shipped as `moon.webp`, derived without a model in the export from the approved sun (seed 567194): its plain disc, recoloured. Two renders rejected (seeds 683121, 1128661), see the generation record.

### `sun`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x1024, seed **567194**.
- Extra negative for this asset: `clouds, sky, compass rose, long rays, cardinal rays, cross shape, star shape`
- Prompt (exactly as sent):

  > one round golden sun in flat Persian manuscript painting style, a plain warm gold and orange disc with a thin gold outline, ringed by a soft even crown of many small short rounded gold flame-like rays, all exactly the same small size all the way round, a completely plain disc with no face, no eyes and no mouth, single object centred on a plain flat dark navy blue background, nothing else in the picture, no stars, no clouds, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `platter`
- Kind: cutout. Model: `z_image_turbo_1.0_q8p.ckpt`. Render 1024x768, seed **873623**.
- Extra negative for this asset: `head, skull, bones, raw meat, knife, fork, cutlery, hands, slices, cut meat, cross-section, rings, marrow, round pieces, bone, cut end, ham hock, drumstick`
- Prompt (exactly as sent):

  > one large round shallow brass serving platter with a plain gold rim, holding one big rounded golden-brown roast with a crisp glossy skin all over, no bone showing and no cut end, resting on a bed of yellow rice with a few green herbs, warm and appetising, whole and untouched, seen from slightly above, single object centred on a plain flat pale cream background, nothing else in the picture, no ground, no shadow, Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `bread`
- Kind: cutedit; edits `platter`. Model: `qwen_image_edit_2511_q8p.ckpt`. Render 1024x768, seed **230721**.
- Extra negative for this asset: `pattern, motif, ornament on the bread, painted bread, eye, eyes, rosette, crescent, star, scored bread, cut marks, slashes, x, cross, roll, bun`
- Prompt (exactly as sent):

  > Keep the exact same brass platter, its rim, the plain pale background, the light, the angle and the style. Change only the food: remove the roast and the rice completely. Now the platter holds only one small, irregular, dry heel of dark brown bread lying on its side near the middle, with a smooth plain crust and no cuts, marks or lines on it; the rest of the platter is empty and bare., Ottoman and Persian manuscript illumination, flat gouache on cream parchment, Iznik turquoise and cobalt blue with manuscript gold leaf outlines, stylized geometric forms, fine gold rule border, warm and gentle, children's picture book, no people, no figures, no text

### `palm`
- Not shipped: both desert plates already paint palms at their edges. Rendered once (seed 1815872); passes 3b.

### `plate-tent-land-src126676`
- Input only, not shipped: the r2 tent render, seed 126676, whose rope crosses the inner back pole; see below.

### `plate-tent-port-src1400481`
- Input only, not shipped: the r5 tent render, seed 1400481; rejected as it stands, see below.

### `plate-tent-port-src761115`
- Input only, not shipped: the r6 edit, seed 761115; rejected as it stands, see below.

## Generation record: rejected before review (all regenerated with a new seed, never retouched)

Shipped: **12 images, 396 KB** (8 plates, 4 sprites: `sun`, `moon` (derived), `platter`, `bread`), budget 1.5 MB.
Rendered: 32 jobs (Z-Image 24, Qwen-Image-Edit 8). Two Z-Image jobs were accidental same-seed repeats of already
rejected renders (a queue raced a reroll; identical output, rejected again). Rejected **18** distinct renders; 1 rendered
and not shipped (palm).

| Asset | Rejected seed | Why (checklist item) |
|---|---|---|
| `plate-tent-land` | 1358775 | crossbar tied at the top of the centre pole; two stakes crossed in an X at the foot of the front pole (3b.3); dark hollows in the sand like footprints (3b.1) |
| `plate-tent-port` | 373667 | large oval hollows in the sand like footprints (3b.1); no painted rule |
| `plate-tent-port` | 1034882 | inner frame of upright poles crossed by rails (small crosses, 3b.3); tied X of two poles; paired oval prints (3b.1) |
| `plate-tent-port` | 242580 | pseudo-signature in the bottom-right corner (3b.4); rows of small dents like footprints (3b.1) |
| `plate-evening-port` | 1868268 | border redrawn as a pointed arch with ornamented spandrels over the sky (mihrab-like niche, in NEGATIVE) |
| `plate-evening-port` | 1909000 | border redrawn as a cartouche with arabesque scrollwork in all four corners (script-like squiggles, 3b.4) |
| `moon` | 683121 | photoreal moon with maria: the "face in the moon" pareidolia and an eye-like crater ring (3b.1, 3b.2); off-style |
| `moon` | 1128661 | the same again; the moon is now derived from the sun (no model) |
| `sun` | 875106 | the four longest rays point up, down, left and right: a compass cross (3b.3) |
| `platter` | 1401174 | sliced meat with ringed round cross-sections: rows of eyes (3b.2) |
| `platter` | 736641 | a joint with a pink cut end round a dark bone ring that can read as an eye (3b.2) |
| `bread` | 1804768 | round bread painted with a blue four-armed cross (3b.3) |
| `bread` | 1856991 | a bite taken out (gate 1: no food shown eaten); a tile panel with quatrefoils above it (3b.3) |
| `bread` | 1656777 | round loaf with a blue four-lobed medallion that reads as a cross (3b.3) |
| `bread` | 1600746 | toast painted with stars and crescents (a star-and-crescent emblem, 3b.3) |
| `bread` | 1030268 | roll painted with an eight-petal rosette with a round centre (3b.2/3b.3) |
| `bread` | 471110 | three crusts each painted with a blue almond with a dot: eyes (3b.2) |
| `bread` | 480720 | (Qwen edit of the platter) the roll is scored with an X across its top (3b.3) |

The plate STYLE's "Iznik
turquoise and cobalt ... gold leaf outlines" makes Z-Image paint an ornament on any flat food surface; six bread renders
failed that way, so the shipped crust is a Qwen edit of the approved platter (same tray, the food replaced by one plain
dry crust). The two dishes now differ only in what is on them, which is the lesson.

## Self-check against 3a (prompts)
1. Things only: desert, dunes, palms, plain houses, sky, a tent, a mat, cushions, clay pots, a platter, rice, a roast,
   bread, a disc for the sun. No prophet, guest, angel, person or crowd is prompted. Pass.
2. No light is written as divine; the sky states are "morning", "evening". The sun and moon are plain discs. Pass.
3. `STYLE` and `NEGATIVE` imported unchanged; the 3a.3 game list in full (with `bikini, bare shoulders`). Pass.
4. Ibrahim bans in the negative of every asset: guests, place settings, idols, statues, figurines, pedestal, ziggurat,
   temple tower, altar, fire, flames, axe. Pass.
5. No Ka'bah, mushaf or text prompted; the dua and the page sentences are live HTML. Pass.
6. The tent, mat and curtain are plain cloth. Pass.
7. Every prompt, seed, negative and reroll is recorded in `ibrahim.py` and above. Pass.
8. Draw Things only through the gated shim, one job at a time, after `ram-gate status`. Pass.

## Self-check against 3b (every shipped image at 100% and thumbnail, light and dark grounds; contact sheet)
`claudeteam/reviews/game-ibrahim-contact-sheet.png`.
1. Faces or figures: none. The houses' doorways are plain lit openings; no figure in any doorway. The sun and moon have
   no features. The sand of the shipped plates has some dents and pebbles; none is paired or foot-shaped (designer
   question 2).
2. Eye shapes: the moon is a plain disc (its texture is blurred so no ring pattern remains); the star is a soft glow
   with no ring, and its keyboard focus mark is a bar under it, never a ring round it. The platter rim has small blue
   lozenges with a gold dot (Ottoman ornament, as on Nuh's cloths; designer question 3).
3. Crosses: none found in plates or sprites. In `plate-tent-land` a guy rope runs from the left and ends at the tall
   front pole, which continues above it: a side bar, not a bar through the pole (the Musa T ruling: the bar does not
   cross; designer question 1). The portrait tent's poles are plain uprights. The mirrored AR scenes add no cross.
4. Glyphs: the tent bands use diamonds and zigzags only; the portrait curtain hem has a small geometric fringe (checked
   at 100%: no letter shapes). No signature in any shipped plate.
5. No Ka'bah, mosque, minaret or book. The far town has no tower and no dome.
6-8. No human form, no violence, no Israiliyyat detail (no idol, no fire, no rainbow).
9. Anatomy: n/a (no animals).
10. In context at both sizes and mirrored: see the screenshots listed in `game-ibrahim-stars.md`.

## Questions for the scholar (gate 2b)
1. `plate-tent-land`: the guy rope that ends at the front pole (a side bar, the pole rising above it). Acceptable, or
   regenerate?
2. Sand dents and pebbles in the shipped tent plates (no pairs, no foot shapes). Acceptable?
3. The platter's (and the crust tray's) rim lozenges with a gold dot. Acceptable as ornament?
4. The moon is derived from the sun's disc by recolouring (no model). Acceptable as "the same hand", or should it be a
   hand-drawn SVG disc instead?

Art gate (first round): prompts reviewed 2026-11-07 (scholar, PASS); contact sheet reviewed 2026-11-07 (scholar) - 10
approved, 2 rejected (plate-tent-port, plate-tent-land). See `game-ibrahim-stars.md`, "Scholar gates 2-3 (2026-11)".

## After scholar gate 2b (2026-11-07): the two tent plates

| Asset | Render | Result |
|---|---|---|
| `plate-tent-land` | 126676 (shipped in e466bda) | **rejected by the scholar**: the guy rope runs through the inner back pole at about x 635, y 275 and the pole rises ~8 px above it (a small cross) |
| `plate-tent-land` | **310210**, Qwen edit of 126676 (`plate-tent-land-src126676`) | **shipped (r3)**: every rope under the roof removed; the inner back pole now meets the roof with nothing across it; the household curtain becomes the dark cloth wall right of the front pole. Checked at 4x: the front poles meet the sloping roof cloth (the side-bar case the scholar accepted), no knot X, no rope through any pole. The edit added a thin blue-and-gold rule inside the frame; the export trims 1.8% from each side of the tent plates |
| `plate-tent-port` | 1120183 (shipped in e466bda) | **rejected by the scholar**: nazar-like concentric lozenge on the roof; inner centre pole crossed by a rail; script-like marks on the curtain band and hem |
| `plate-tent-port` | 1400481, Z-Image r5 (motif bans added) | rejected: again a concentric diamond medallion on the roof, a band of small X marks along the eave, a striped curtain fringe, a pseudo-signature in the corner. Kept as the edit source (`plate-tent-port-src1400481`) |
| `plate-tent-port` | 761115, Qwen edit of r5 (r6) | rejected: clean ornament, but at both front poles the eave band crosses the pole and the pole rises ~30 px above it (stem above the bar), and white cord loops hang beside the poles. Kept as the edit source (`plate-tent-port-src761115`) |
| `plate-tent-port` | 178573, Qwen edit of r6 (r7) | rejected: the sky and sand went flat cream and both poles became columns of blue chevrons and lozenges |
| `plate-tent-port` | **615708**, Qwen edit of r6 (r8) | **shipped**: plain roof, plain turquoise eave band, plain curtain, no poles at all above or across the band, cushions and mat as before, smooth sand with single irregular dents, no writing (the edit drew a blue rule border whose margin held a small mark; the frame crop and the 1.8% tent trim remove both; checked on the exported plate) |

Shipped now: **12 images, 358 KB**. The two new tent plates are listed for the scholar's re-check at 100% and in
context (tablet and phone, EN and AR, mirrored); see "Fixes after gates 2-3" in `game-ibrahim-stars.md`.
